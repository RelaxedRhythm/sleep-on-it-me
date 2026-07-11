import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { client } from "@/library/db";

export const runtime = "nodejs";

const summaryRequestSchema = z.object({
  sessionId: z.union([z.string().min(1), z.number()]),
});

function buildPrompt(notes) {
  const noteText = notes
    .map((note, index) => {
      const title = note.title || `Note ${index + 1}`;
      const summary = note.summary || "";
      return `Note ${index + 1}: ${title}\n${summary}`;
    })
    .join("\n\n");

  return [
    "You are an expert study coach.",
    "Create a concise study-session summary based only on the notes provided.",
    "Return valid JSON with the following shape:",
    "{",
    '"shortSummary": "string",',
    '"keyTakeaways": ["string"],',
    '"actionItems": ["string"],',
    '"topicsToRevise": ["string"]',
    "}",
    "Rules:",
    "- Keep the short summary under 2 sentences.",
    "- Keep each list concise and actionable.",
    "- If a topic is unclear, mention it as a revision topic.",
    "Notes:",
    noteText,
  ].join("\n");
}

function parseModelResponse(content) {
  const cleaned = content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
}

function buildFallbackSummary(notes) {
  const cleanedNotes = Array.isArray(notes) ? notes : [];
  const titles = cleanedNotes
    .map((note) => (note?.title || "").trim())
    .filter(Boolean)
    .slice(0, 3);

  const shortSummary =
    titles.length > 0
      ? `Reviewed ${titles.length} note${titles.length === 1 ? "" : "s"}: ${titles.join(", ")}.`
      : "Reviewed the available session notes.";

  const keyTakeaways = titles.length > 0
    ? titles.map((title) => `Focused on ${title}`)
    : ["Captured the main ideas from this study session."];

  const actionItems = titles.length > 0
    ? ["Follow up on the main ideas from these notes."]
    : ["Add a few more notes to build a stronger review summary."];

  const topicsToRevise = cleanedNotes
    .filter((note) => !(note?.summary || "").trim())
    .map((note, index) => note?.title || `Note ${index + 1}`);

  return {
    shortSummary,
    keyTakeaways,
    actionItems,
    topicsToRevise: topicsToRevise.length > 0 ? topicsToRevise : ["Review any unclear points from the session."],
  };
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = summaryRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 },
      );
    }

    const sessionId = parsed.data.sessionId.toString();
    const notesResult = await client.query(
      `SELECT title, summary, session_num, pomodoro_num, created_at
       FROM notes
       WHERE session_id = $1
       ORDER BY created_at ASC`,
      [sessionId],
    );

    if (!notesResult.rowCount) {
      return NextResponse.json(
        { message: "No notes found for this session yet." },
        { status: 200 },
      );
    }

    const apiKey = process.env.GROK_API_KEY || process.env.XAI_API_KEY || process.env.GEMINI_API_KEY;
    const model = process.env.GROK_MODEL || "grok-2-latest";
    if (!apiKey) {
      return NextResponse.json(buildFallbackSummary(notesResult.rows));
    }

    let completion;
    try {
      completion = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          temperature: 0.3,
          max_tokens: 800,
          messages: [
            {
              role: "system",
              content: "You are an expert study coach.",
            },
            {
              role: "user",
              content: buildPrompt(notesResult.rows),
            },
          ],
        }),
      });
    } catch (error) {
      console.error("Grok request failed:", error);
      return NextResponse.json(buildFallbackSummary(notesResult.rows));
    }

    if (!completion.ok) {
      const errorText = await completion.text();
      console.error("Grok request failed:", errorText);
      return NextResponse.json(buildFallbackSummary(notesResult.rows));
    }

    try {
      const data = await completion.json();
      const content =
        data?.choices?.[0]?.message?.content || "{}";
      const result = parseModelResponse(content);

      return NextResponse.json({
        shortSummary: result.shortSummary || "",
        keyTakeaways: Array.isArray(result.keyTakeaways) ? result.keyTakeaways : [],
        actionItems: Array.isArray(result.actionItems) ? result.actionItems : [],
        topicsToRevise: Array.isArray(result.topicsToRevise)
          ? result.topicsToRevise
          : [],
      });
    } catch (error) {
      console.error("Grok response parsing failed:", error);
      return NextResponse.json(buildFallbackSummary(notesResult.rows));
    }
  } catch (error) {
    console.error("AI summary route error:", error);
    return NextResponse.json(
      { error: "Unable to generate summary right now" },
      { status: 500 },
    );
  }
}
