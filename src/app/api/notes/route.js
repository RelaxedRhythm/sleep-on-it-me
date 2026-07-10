import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { client } from "@/library/db";

export const runtime = "nodejs";

function getNoteQuery() {
  return `SELECT n.*, b.title as book_title,
    COALESCE(
      json_agg(
        json_build_object('cue', nd.cue, 'content', nd.content)
        ORDER BY nd.id
      ) FILTER (WHERE nd.id IS NOT NULL),
      '[]'::json
    ) AS key_value_pairs
    FROM notes n
    JOIN sessions s ON n.session_id = s.id
    LEFT JOIN books b ON s.book_id = b.id
    LEFT JOIN note_details nd ON nd.note_id = n.id
    WHERE s.book_id = $1
    GROUP BY n.id, b.title
    ORDER BY n.created_at DESC`;
}

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get("bookId");

    if (!bookId) {
      return NextResponse.json({ error: "Book id is required" }, { status: 400 });
    }

    const notesResult = await client.query(getNoteQuery(), [bookId]);
    const notes = notesResult.rows.map((note) => ({
      ...note,
      key_value_pairs: Array.isArray(note.key_value_pairs) ? note.key_value_pairs : [],
    }));

    return NextResponse.json({ notes });
  } catch (error) {
    console.error("Notes GET error:", error);
    return NextResponse.json({ error: "Unable to load notes" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const summary = formData.get("summary");
    const title = formData.get("title");
    const sessionId = formData.get("session_id");
    const sessionNum = formData.get("session_num");
    const pomodoroNum = Number(formData.get("pomodoro_num")) || 0;

    if (!sessionId) {
      return NextResponse.json({ error: "No session found" }, { status: 400 });
    }

    const noteResult = await client.query(
      "INSERT INTO notes(session_id,pomodoro_num,title,summary,session_num) VALUES($1,$2,$3,$4,$5) RETURNING id",
      [sessionId, pomodoroNum, title, summary, sessionNum],
    );

    const noteId = noteResult.rows[0]?.id;
    const keys = formData.getAll("key");
    const definitions = formData.getAll("definition");

    for (let index = 0; index < keys.length; index += 1) {
      const cue = keys[index];
      const content = definitions[index];
      await client.query(
        "INSERT INTO note_details (cue,content,note_id) VALUES($1,$2,$3)",
        [cue, content, noteId],
      );
    }

    return NextResponse.json({ ok: true, noteId });
  } catch (error) {
    console.error("Notes POST error:", error);
    return NextResponse.json({ error: "Unable to save note" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { noteId, title, summary } = body || {};

    if (!noteId) {
      return NextResponse.json({ error: "Note id is required" }, { status: 400 });
    }

    const result = await client.query(
      "UPDATE notes SET title = $1, summary = $2 WHERE id = $3 RETURNING id, title, summary",
      [title, summary, noteId],
    );

    return NextResponse.json({ ok: true, note: result.rows[0] || null });
  } catch (error) {
    console.error("Notes PUT error:", error);
    return NextResponse.json({ error: "Unable to update note" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const noteId = searchParams.get("noteId");

    if (!noteId) {
      return NextResponse.json({ error: "Note id is required" }, { status: 400 });
    }

    await client.query("DELETE FROM note_details WHERE note_id = $1", [noteId]);
    await client.query("DELETE FROM notes WHERE id = $1", [noteId]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Notes DELETE error:", error);
    return NextResponse.json({ error: "Unable to delete note" }, { status: 500 });
  }
}
