"use client";
import { useState } from "react";
import { NotepadTextDashed, Plus, Trash2 } from "lucide-react";

const Note = ({ cue, definition, onDelete }) => {
  return (
    <div className="group relative flex items-start gap-2 rounded-xl group-hover:bg-amber-400">
      <button
        onClick={onDelete}
        type="button"
        className="peer absolute -left-6 hidden h-full w-8 items-center justify-center rounded-l-xl bg-red-400 text-red-50 group-hover:flex hover:cursor-pointer"
      >
        <Trash2 />
      </button>

      <textarea
        className="field-sizing-content w-1/3 rounded-xl bg-sky-100 p-5 outline-none peer-hover:bg-red-300 focus:ring-1 focus:ring-sky-300 focus:ring-offset-2"
        type="text"
        placeholder={cue}
        name="key"
      />
      <textarea
        className="field-sizing-content w-2/3 rounded-xl bg-sky-100 p-5 outline-none peer-hover:bg-red-300 focus:ring-1 focus:ring-sky-300 focus:ring-offset-2"
        type="text"
        placeholder={definition}
        name="definition"
      />
    </div>
  );
};

const CornellNoteTaking = ({ bookId, sessionId, session, pomodoro, onNoteSaved, onError }) => {
  const today = new Date().toDateString();
  const book = bookId;
  // console.log(book);
  console.log("pomodoro num",pomodoro)
  const [cornellNote, setCornellNote] = useState({
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

  const handleKVPAdd = () => {
    // console.log("note added");
    setCornellNote({
      ...cornellNote,
      kvp: [
        ...cornellNote.kvp,
        {
          id: cornellNote.kvp.length + 1,
          cue: "Key",
          definition: "Description",
        },
      ],
    });
  };

  const handleKVPDelete = (id) => {
    setCornellNote((note) => ({
      ...note,
      kvp: note.kvp.filter((note) => note.id !== id),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
       const response = await fetch("/api/notes", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || "Unable to save note right now.");
      }
      // Reset form after successful save
      setCornellNote({
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
      // Call callback to refresh notes
      if (onNoteSaved) {
        onNoteSaved();
      }
    } catch (error) {
      console.error('Error saving note:', error);
      onError?.('Unable to save the note right now. Please try again.');
    }
  };

  return (
    <form
      className="max-h-175 max-w-1/2 min-w-1/2 space-y-2 text-stone-700"
      onSubmit={handleSubmit}
    >
      <h2 className="flex items-center gap-2 font-semibold tracking-wide text-stone-400">
        <NotepadTextDashed /> Make your Cornell note here.
      </h2>

      {/* //hidden inputs to send additional data to the action function without user input */}
      <input type="hidden" name="book_id" value={book ?? ""} />
      <input type="hidden" name="session_id" value={sessionId ?? ""} />
      <input type="hidden" name="session_num" value={session ?? 0} />
      <input type="hidden" name="pomodoro_num" value={pomodoro ?? 0} />
      
      {/* Head of the note */}
      <div className="flex justify-between rounded-xl bg-sky-200 p-5">
        <div className="w-1/3">{today}</div>
        <input
          className="w-2/3 font-semibold tracking-wide outline-none focus:ring-1 focus:ring-sky-300"
          placeholder="Title"
          type="text"
          name="title"
        />
      </div>

      {/* KVP */}
      {cornellNote.kvp.map((note) => (
        <Note
          key={note.id}
          cue={note.cue}
          definition={note.definition}
          onDelete={() => handleKVPDelete(note.id)}
        />
      ))}

      {/* add KVP */}
      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-lime-500 p-4 font-semibold tracking-wide text-lime-50 hover:cursor-pointer hover:bg-lime-50 hover:text-lime-500 hover:shadow"
        onClick={handleKVPAdd}
      >
        <Plus />
      </button>

      {/* Summary */}
      <textarea
        required
        className="field-sizing-content w-full rounded-xl bg-sky-100 p-5 outline-none focus:ring-1 focus:ring-sky-300 focus:ring-offset-2"
        placeholder="Summarize here..."
        type="text"
        name="summary"
      />

      {/* cornell note actions */}
      <div className="flex gap-2">
        <button
          type="button"
          className="w-1/2 rounded-xl bg-orange-400 p-5 font-semibold tracking-wide text-orange-50 hover:cursor-pointer hover:bg-orange-50 hover:text-orange-400 hover:shadow"
          onClick={() => setCornellNote({
            title: "",
            kvp: [
              {
                id: 1,
                cue: "Key",
                definition: "Description",
              },
            ],
            summary: "",
          })}
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
