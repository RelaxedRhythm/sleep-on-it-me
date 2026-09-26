import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { client } from "@/library/db";

export const runtime = "nodejs";

const summaryRequestSchema = z.object({
  sessionId: z.union([z.string().min(1), z.number()]),
});

function normalizeText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function getMeaningfulNoteText(note) {
  const parts = [];
  const title = normalizeText(note?.title);
  if (title) parts.push(title);

  const summary = normalizeText(note?.summary);
  if (summary) parts.push(summary);

  const keyPairs = Array.isArray(note?.key_value_pairs) ? note.key_value_pairs : [];
  for (const pair of keyPairs) {
    const cue = normalizeText(pair?.cue);
    const content = normalizeText(pair?.content);

    if (cue && content) {
      parts.push(`${cue}: ${content}`);
    } else if (content) {
      parts.push(content);
    } else if (cue) {
      parts.push(cue);
    }
  }

  return parts.join(" ");
}

function buildPrompt(notes) {
  const noteText = (Array.isArray(notes) ? notes : [])
    .map((note, index) => {
      const title = normalizeText(note?.title) || `Note ${index + 1}`;
      const summary = normalizeText(note?.summary);
      const detailPairs = Array.isArray(note?.key_value_pairs) ? note.key_value_pairs : [];

      const detailText = detailPairs
        .map((pair) => {
          const cue = normalizeText(pair?.cue);
          const content = normalizeText(pair?.content);

          if (cue && content) return `- ${cue}: ${content}`;
          if (content) return `- ${content}`;
          if (cue) return `- ${cue}`;
          return null;
        })
        .filter(Boolean)
        .join("\n");

      return [
        `Note ${index + 1}`,
        `Key: ${title}`,
        summary ? `Summary: ${summary}` : "Summary: No summary provided.",
        detailText ? `Details:\n${detailText}` : "Details: No additional note details recorded.",
      ].join("\n");
    })
    .join("\n\n");

  return [
    "You are a study-session recommender.",
    "Based on the student's notes, suggest the most useful next steps for revision or practice. Use only what is actually present in the notes. Do not simply restate the note titles. Focus on what the student should do next to strengthen understanding, clarify gaps, and review the most important concepts.",
    "",
    "Return valid JSON in this exact shape:",
    "{",
    '  "shortSummary": "A brief sentence explaining the best next step suggested by the notes.",',
    '  "keyTakeaways": ["The most important concept or focus area"],',
    '  "actionItems": ["Concrete next step supported by the notes"],',
    '  "topicsToRevise": ["Specific concept that should be revised"]',
    "}",
    "",
    "SESSION NOTES:",
    "",
    noteText || "No notes were provided.",
    "",
    "Rules:",
    "- Base your recommendations on the actual content of the notes, not on the note titles alone.",
    "- The output should feel like a plan for what to do next after this study session.",
    "- Prefer concrete actions like reviewing specific concepts, practicing examples, testing recall, or clarifying weak areas supported by the notes.",
    "- If the notes do not contain enough meaningful information, say so honestly in shortSummary and keep the lists empty or limited to explicit review suggestions.",
    "- Do not invent facts, learning outcomes, or topics that are not in the notes.",
  ].join("\n");
}

function parseModelResponse(content) {
  const cleaned = String(content ?? "")
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const parsed = JSON.parse(cleaned || "{}");

  return {
    shortSummary:
      normalizeText(parsed?.shortSummary) ||
      "Not enough information was recorded in this session to generate a detailed summary.",
    keyTakeaways: Array.isArray(parsed?.keyTakeaways)
      ? parsed.keyTakeaways.map((item) => normalizeText(item)).filter(Boolean)
      : [],
    actionItems: Array.isArray(parsed?.actionItems)
      ? parsed.actionItems.map((item) => normalizeText(item)).filter(Boolean)
      : [],
    topicsToRevise: Array.isArray(parsed?.topicsToRevise)
      ? parsed.topicsToRevise.map((item) => normalizeText(item)).filter(Boolean)
      : [],
  };
}

function buildFallbackSummary(notes) {
  const cleanedNotes = Array.isArray(notes) ? notes : [];
  const meaningfulNotes = cleanedNotes
    .map((note) => getMeaningfulNoteText(note))
    .map((text) => normalizeText(text))
    .filter(Boolean);

  if (!meaningfulNotes.length) {
    return {
      shortSummary: "Not enough information was recorded in this session to suggest a useful next step.",
      keyTakeaways: [],
      actionItems: [],
      topicsToRevise: [],
    };
  }

  const summaryText = meaningfulNotes
    .slice(0, 3)
    .join(". ")
    .slice(0, 300);

  return {
    shortSummary: summaryText
      ? `The most useful next step is to review and practice the ideas in ${summaryText}.`
      : "Not enough information was recorded in this session to suggest a useful next step.",
    keyTakeaways: meaningfulNotes
      .slice(0, 3)
      .map((noteText) => (noteText.length > 160 ? `${noteText.slice(0, 160)}...` : noteText)),
    actionItems: meaningfulNotes.length
      ? ["Review the main concepts from these notes and test yourself on them."]
      : [],
    topicsToRevise: meaningfulNotes.length
      ? ["Revisit the key ideas and clarify anything you are unsure about."]
      : [],
  };
}

async function getNotesForSummary(sessionId, userId) {
  const notesResult = await client.query(
    `SELECT n.id, n.title, n.summary, n.session_num, n.pomodoro_num, n.created_at,
            COALESCE(
              json_agg(
                json_build_object('cue', nd.cue, 'content', nd.content)
                ORDER BY nd.id
              ) FILTER (WHERE nd.id IS NOT NULL),
              '[]'::json
            ) AS key_value_pairs
     FROM notes n
     LEFT JOIN note_details nd ON nd.note_id = n.id
     WHERE n.session_id = $1
     GROUP BY n.id
     ORDER BY n.created_at ASC`,
    [sessionId],
  );

  if (notesResult.rowCount) {
    return { notes: notesResult.rows, sourceSessionId: sessionId, source: "current" };
  }

  const lastSessionResult = await client.query(
    `SELECT s.id, s.user_id, s.session_num, s.started_at
     FROM sessions s
     WHERE s.user_id = $1
       AND s.id != $2
     ORDER BY s.started_at DESC, s.id DESC
     LIMIT 1`,
    [userId, sessionId],
  );

  if (!lastSessionResult.rowCount) {
    return { notes: [], sourceSessionId: null, source: "none" };
  }

  const lastSessionId = lastSessionResult.rows[0].id;
  const lastSessionNotesResult = await client.query(
    `SELECT n.id, n.title, n.summary, n.session_num, n.pomodoro_num, n.created_at,
            COALESCE(
              json_agg(
                json_build_object('cue', nd.cue, 'content', nd.content)
                ORDER BY nd.id
              ) FILTER (WHERE nd.id IS NOT NULL),
              '[]'::json
            ) AS key_value_pairs
     FROM notes n
     LEFT JOIN note_details nd ON nd.note_id = n.id
     WHERE n.session_id = $1
     GROUP BY n.id
     ORDER BY n.created_at ASC`,
    [lastSessionId],
  );

  return {
    notes: lastSessionNotesResult.rows || [],
    sourceSessionId: lastSessionId,
    source: "last",
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
    const targetNotes = await getNotesForSummary(sessionId, session.user.id);

    if (!targetNotes.notes.length) {
      return NextResponse.json(
        { message: "No notes found for this session yet, so we used the most recent available session instead." },
        { status: 200 },
      );
    }

    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GROK_API_KEY || process.env.XAI_API_KEY;
    const usesGemini = Boolean(process.env.GEMINI_API_KEY);
    const model = usesGemini ? "gemini-2.0-flash" : process.env.GROK_MODEL || "grok-2-latest";

    if (!geminiApiKey) {
      return NextResponse.json(buildFallbackSummary(targetNotes.notes));
    }

    let completion;

    try {
      if (usesGemini) {
        completion = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: {
                parts: [
                  {
                    text: "You are a study-session summarizer. Analyze the student's notes and create a useful revision summary based ONLY on the information provided. Do not simply repeat or rephrase note titles. Identify what was actually learned, important concepts, topics that may need revision, and reasonable next steps. Do not invent information.",
                  },
                ],
              },
              contents: [
                {
                  role: "user",
                  parts: [{ text: buildPrompt(targetNotes.notes) }],
                },
              ],
              generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 800,
                responseMimeType: "application/json",
                responseSchema: {
                  type: "OBJECT",
                  properties: {
                    shortSummary: { type: "STRING" },
                    keyTakeaways: {
                      type: "ARRAY",
                      items: { type: "STRING" },
                    },
                    actionItems: {
                      type: "ARRAY",
                      items: { type: "STRING" },
                    },
                    topicsToRevise: {
                      type: "ARRAY",
                      items: { type: "STRING" },
                    },
                  },
                  required: ["shortSummary", "keyTakeaways", "actionItems", "topicsToRevise"],
                },
              },
            }),
          },
        );
      } else {
        completion = await fetch("https://api.x.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${geminiApiKey}`,
          },
          body: JSON.stringify({
            model,
            temperature: 0.3,
            max_tokens: 800,
            messages: [
              {
                role: "system",
                content: "You are a study-session summarizer. Analyze the student's notes and create a useful revision summary based ONLY on the information provided. Do not simply repeat or rephrase note titles. Identify what was actually learned, important concepts, topics that may need revision, and reasonable next steps. Do not invent information.",
              },
              {
                role: "user",
                content: buildPrompt(targetNotes.notes),
              },
            ],
          }),
        });
      }
    } catch (error) {
      console.error("AI summary request failed:", error);
      return NextResponse.json(buildFallbackSummary(targetNotes.notes));
    }

    if (!completion.ok) {
      const errorText = await completion.text();
      console.error("AI summary request failed:", errorText);
      return NextResponse.json(buildFallbackSummary(targetNotes.notes));
    }

    try {
      const data = await completion.json();
      const text = usesGemini
        ? data?.candidates?.[0]?.content?.parts
            ?.map((part) => part?.text ?? "")
            .join("") || "{}"
        : data?.choices?.[0]?.message?.content || "{}";

      const result = parseModelResponse(text);

      return NextResponse.json({
        shortSummary: result.shortSummary || "Not enough information was recorded in this session to generate a detailed summary.",
        keyTakeaways: Array.isArray(result.keyTakeaways) ? result.keyTakeaways : [],
        actionItems: Array.isArray(result.actionItems) ? result.actionItems : [],
        topicsToRevise: Array.isArray(result.topicsToRevise) ? result.topicsToRevise : [],
      });
    } catch (error) {
      console.error("AI summary response parsing failed:", error);
      return NextResponse.json(buildFallbackSummary(targetNotes.notes));
    }
  } catch (error) {
    console.error("AI summary route error:", error);
    return NextResponse.json(
      { error: "Unable to generate summary right now" },
      { status: 500 },
    );
  }
}
