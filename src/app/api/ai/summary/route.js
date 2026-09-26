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
    "You are a study assistant.",
    "Based on the student's study notes, suggest useful and specific next steps. Identify concepts worth practising, topics to explore further, relevant exercises, and areas that may need revision. Make suggestions directly relevant to the provided notes. Do not merely summarize or rephrase the notes. Do not invent information or assume the student has mastered a concept. If the notes contain insufficient information, acknowledge this and provide only suggestions that are reasonably supported by the available information.",
    "",
    "Return valid JSON in this exact shape:",
    "{",
    '  "suggestions": [{"title": "Short action title", "description": "Clear, specific suggestion based on the notes."}]',
    "}",
    "",
    "SESSION NOTES:",
    "",
    noteText || "No notes were provided.",
    "",
    "Rules:",
    "- Base the recommendations on the actual content of the notes, not on the note titles alone.",
    "- Suggest concrete next steps such as practising a concept, building an example, testing recall, revising a weak concept, or applying a topic in a small exercise.",
    "- Keep each suggestion brief, specific, and actionable.",
    "- Limit the response to 3 to 5 suggestions.",
    "- If there is not enough meaningful information, return an empty suggestions array and set the description text to say the notes are too limited to suggest a confident next step.",
    "- Do not invent facts, learning outcomes, topics, or confidence levels.",
  ].join("\n");
}

function parseModelResponse(content) {
  const cleaned = String(content ?? "")
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const parsed = JSON.parse(cleaned || "{}");
  const suggestions = Array.isArray(parsed?.suggestions) ? parsed.suggestions : [];

  return {
    suggestions: suggestions
      .map((item) => ({
        title: normalizeText(item?.title),
        description: normalizeText(item?.description),
      }))
      .filter((item) => item.title && item.description)
      .slice(0, 5),
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
     JOIN sessions s ON s.id = n.session_id
     WHERE n.session_id = $1
       AND s.user_id = $2
     GROUP BY n.id
     ORDER BY n.created_at ASC`,
    [sessionId, userId],
  );

  if (notesResult.rowCount) {
    return { notes: notesResult.rows, source: "current" };
  }

  const previousSessionResult = await client.query(
    `SELECT s.id
     FROM sessions s
     JOIN notes n ON n.session_id = s.id
     WHERE s.user_id = $1
       AND s.id != $2
     GROUP BY s.id
     ORDER BY s.started_at DESC, s.id DESC
     LIMIT 1`,
    [userId, sessionId],
  );

  if (!previousSessionResult.rowCount) {
    return { notes: [], source: "none" };
  }

  const previousSessionId = previousSessionResult.rows[0].id;
  const previousSessionNotesResult = await client.query(
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
    [previousSessionId],
  );

  return {
    notes: previousSessionNotesResult.rows || [],
    source: "previous",
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
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const sessionId = parsed.data.sessionId.toString();
    const targetNotes = await getNotesForSummary(sessionId, session.user.id);

    if (!targetNotes.notes.length) {
      return NextResponse.json(
        {
          message: "No study notes available yet. Add some notes to get personalized suggestions.",
          basedOn: "none",
        },
        { status: 200 },
      );
    }

    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GROK_API_KEY || process.env.XAI_API_KEY;
    const usesGemini = Boolean(process.env.GEMINI_API_KEY);
    const provider = usesGemini ? "Gemini" : "Grok";
    const model = usesGemini ? "gemini-3.8-flash" : process.env.GROK_MODEL || "grok-2-latest";

    console.log("[AI Suggestions] Using provider/model", {
      provider,
      model,
    });

    if (!geminiApiKey) {
      console.error("[AI Suggestions] No API key configured for provider.", { provider, model });
      return NextResponse.json(
        { error: "Unable to generate AI suggestions right now." },
        { status: 500 },
      );
    }

    const prompt = buildPrompt(targetNotes.notes);
    console.log("[AI Suggestions] Sending notes to provider", {
      provider,
      model,
      sessionId,
      source: targetNotes.source,
      noteCount: targetNotes.notes.length,
      notes: targetNotes.notes.map((note) => ({
        id: note.id,
        title: note.title,
        summary: note.summary,
        key_value_pairs: Array.isArray(note.key_value_pairs) ? note.key_value_pairs : [],
      })),
    });

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
                    text: "You are a study assistant. Based on the student's study notes, suggest useful and specific next steps. Identify concepts worth practising, topics to explore further, relevant exercises, and areas that may need revision. Make suggestions directly relevant to the provided notes. Do not merely summarize or rephrase the notes. Do not invent information or assume the student has mastered a concept. If the notes contain insufficient information, acknowledge this and provide only suggestions that are reasonably supported by the available information.",
                  },
                ],
              },
              contents: [
                {
                  role: "user",
                  parts: [{ text: prompt }],
                },
              ],
              generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 700,
                responseMimeType: "application/json",
                responseSchema: {
                  type: "OBJECT",
                  properties: {
                    suggestions: {
                      type: "ARRAY",
                      items: {
                        type: "OBJECT",
                        properties: {
                          title: { type: "STRING" },
                          description: { type: "STRING" },
                        },
                        required: ["title", "description"],
                      },
                    },
                  },
                  required: ["suggestions"],
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
            max_tokens: 700,
            messages: [
              {
                role: "system",
                content: "You are a study assistant. Based on the student's study notes, suggest useful and specific next steps. Identify concepts worth practising, topics to explore further, relevant exercises, and areas that may need revision. Make suggestions directly relevant to the provided notes. Do not merely summarize or rephrase the notes. Do not invent information or assume the student has mastered a concept. If the notes contain insufficient information, acknowledge this and provide only suggestions that are reasonably supported by the available information.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
          }),
        });
      }
    } catch (error) {
      console.error("[AI Suggestions] Gemini request failed:", error);
      return NextResponse.json(
        { error: "Unable to generate AI suggestions right now." },
        { status: 500 },
      );
    }

    if (!completion.ok) {
      const errorText = await completion.text();
      console.error("[AI Suggestions] Provider HTTP error:", {
        provider,
        model,
        status: completion.status,
        statusText: completion.statusText,
        responseBody: errorText?.slice(0, 2000),
      });
      return NextResponse.json(
        { error: "Unable to generate AI suggestions right now." },
        { status: 500 },
      );
    }

    try {
      const data = await completion.json();
      const text = usesGemini
        ? data?.candidates?.[0]?.content?.parts
            ?.map((part) => part?.text ?? "")
            .join("") || "{}"
        : data?.choices?.[0]?.message?.content || "{}";

      if (usesGemini && (!data?.candidates || !Array.isArray(data.candidates))) {
        console.error("[AI Suggestions] Gemini response missing candidates:", data);
        return NextResponse.json(
          { error: "Unable to generate AI suggestions right now." },
          { status: 500 },
        );
      }

      const result = parseModelResponse(text);

      if (!result.suggestions.length) {
        console.error("[AI Suggestions] Gemini returned no usable suggestions:", text?.slice?.(0, 2000));
        return NextResponse.json(
          { error: "Unable to generate AI suggestions right now." },
          { status: 500 },
        );
      }

      return NextResponse.json({
        suggestions: result.suggestions,
        basedOn: targetNotes.source,
      });
    } catch (error) {
      console.error("[AI Suggestions] Gemini response parsing failed:", error);
      return NextResponse.json(
        { error: "Unable to generate AI suggestions right now." },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("AI summary route error:", error);
    return NextResponse.json({ error: "Unable to generate summary right now" }, { status: 500 });
  }
}
