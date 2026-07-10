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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI service is not configured" },
        { status: 500 },
      );
    }

    const completion = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: buildPrompt(notesResult.rows) }],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            responseMimeType: "application/json",
          },
        }),
      },
    );

    if (!completion.ok) {
      const errorText = await completion.text();
      console.error("Gemini request failed:", errorText);
      return NextResponse.json(
        { error: "AI summary request failed" },
        { status: 502 },
      );
    }

    const data = await completion.json();
    const content =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
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
    console.error("AI summary route error:", error);
    return NextResponse.json(
      { error: "Unable to generate summary right now" },
      { status: 500 },
    );
  }
}
