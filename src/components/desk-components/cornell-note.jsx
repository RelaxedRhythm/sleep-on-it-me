"use client";
import { useState } from "react";
import { NotepadTextDashed, Plus, Trash2 } from "lucide-react";

const createInitialCornellNote = () => ({
  title: "",
  kvp: [
    {
      id: 1,
      cue: "Key",
      definition: "Description",
    },
  ],
  summary: "",
});

const Note = ({ cue, definition, onCueChange, onDefinitionChange, onDelete }) => {
  return (
    <div className="group relative flex items-start gap-2 rounded-xl">
      <button
        onClick={onDelete}
        type="button"
        className="peer absolute -left-6 hidden h-full w-8 items-center justify-center rounded-l-xl bg-red-400 text-red-50 group-hover:flex hover:cursor-pointer"
      >
        <Trash2 />
      </button>

      <textarea
        className="field-sizing-content w-1/3 rounded-xl bg-sky-100 p-5 outline-none peer-hover:bg-red-300 focus:ring-1 focus:ring-sky-300 focus:ring-offset-2"
        placeholder="Key"
        name="key"
        value={cue}
        onChange={(event) => onCueChange?.(event.target.value)}
      />
      <textarea
        className="field-sizing-content w-2/3 rounded-xl bg-sky-100 p-5 outline-none peer-hover:bg-red-300 focus:ring-1 focus:ring-sky-300 focus:ring-offset-2"
        placeholder="Description"
        name="definition"
        value={definition}
        onChange={(event) => onDefinitionChange?.(event.target.value)}
      />
    </div>
  );
};

const CornellNoteTaking = ({ bookId, sessionId, session, pomodoro, onNoteSaved, onError }) => {
  const today = new Date().toDateString();
  const [cornellNote, setCornellNote] = useState(createInitialCornellNote);

  const handleKVPAdd = () => {
    setCornellNote((note) => ({
      ...note,
      kvp: [
        ...note.kvp,
        {
          id: Date.now(),
          cue: "Key",
          definition: "Description",
        },
      ],
    }));
  };

  const handleKVPChange = (id, field, value) => {
    setCornellNote((note) => ({
      ...note,
      kvp: note.kvp.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry)),
    }));
  };

  const handleKVPDelete = (id) => {
    setCornellNote((note) => ({
      ...note,
      kvp: note.kvp.filter((entry) => entry.id !== id),
    }));
  };

  const handleResetNote = () => {
    setCornellNote(createInitialCornellNote());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!cornellNote.summary.trim()) {
      onError?.("Please add a short summary before saving the note.");
      return;
    }

    const formData = new FormData();
    formData.append("book_id", bookId ?? "");
    formData.append("session_id", sessionId ?? "");
    formData.append("session_num", session ?? 0);
    formData.append("pomodoro_num", pomodoro ?? 0);
    formData.append("title", cornellNote.title.trim());
    formData.append("summary", cornellNote.summary.trim());

    cornellNote.kvp.forEach((note) => {
      const cue = note.cue?.trim() || "";
      const definition = note.definition?.trim() || "";
      if (!cue && !definition) {
        return;
      }
      formData.append("key", cue);
      formData.append("definition", definition);
    });

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || "Unable to save note right now.");
      }

      setCornellNote(createInitialCornellNote());
      onNoteSaved?.();
    } catch (error) {
      console.error("Error saving note:", error);
      onError?.("Unable to save the note right now. Please try again.");
    }
  };

  return (
    <form className="w-full max-w-2xl space-y-2 text-stone-700" onSubmit={handleSubmit}>
      <h2 className="flex items-center gap-2 font-semibold tracking-wide text-stone-400">
        <NotepadTextDashed /> Make your Cornell note here.
      </h2>

      <div className="flex justify-between rounded-xl bg-sky-200 p-5">
        <div className="w-1/3">{today}</div>
        <input
          className="w-2/3 font-semibold tracking-wide outline-none focus:ring-1 focus:ring-sky-300"
          placeholder="Title"
          type="text"
          name="title"
          value={cornellNote.title}
          onChange={(event) =>
            setCornellNote((note) => ({ ...note, title: event.target.value }))
          }
        />
      </div>

      {cornellNote.kvp.map((note) => (
        <Note
          key={note.id}
          cue={note.cue}
          definition={note.definition}
          onDelete={() => handleKVPDelete(note.id)}
          onCueChange={(value) => handleKVPChange(note.id, "cue", value)}
          onDefinitionChange={(value) => handleKVPChange(note.id, "definition", value)}
        />
      ))}

      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-lime-500 p-4 font-semibold tracking-wide text-lime-50 hover:cursor-pointer hover:bg-lime-50 hover:text-lime-500 hover:shadow"
        onClick={handleKVPAdd}
      >
        <Plus />
      </button>

      <textarea
        required
        className="field-sizing-content w-full rounded-xl bg-sky-100 p-5 outline-none focus:ring-1 focus:ring-sky-300 focus:ring-offset-2"
        placeholder="Summarize here..."
        value={cornellNote.summary}
        onChange={(event) =>
          setCornellNote((note) => ({ ...note, summary: event.target.value }))
        }
      />

      <div className="flex gap-2">
        <button
          type="button"
          className="w-1/2 rounded-xl bg-orange-400 p-5 font-semibold tracking-wide text-orange-50 hover:cursor-pointer hover:bg-orange-50 hover:text-orange-400 hover:shadow"
          onClick={handleResetNote}
        >
          New Cornell Note
        </button>
        <button
          type="submit"
          className="w-1/2 rounded-xl bg-sky-500 p-5 text-lg font-semibold tracking-wide text-sky-50 hover:cursor-pointer hover:bg-sky-50 hover:text-sky-500 hover:shadow"
          disabled={!bookId}
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default CornellNoteTaking;
