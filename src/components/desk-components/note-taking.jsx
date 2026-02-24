"use client";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

const Note = ({ cue, definition, onDelete }) => {
  return (
    <div className="group relative flex gap-2 overflow-hidden rounded-xl ring-red-400 hover:ring-2">
      <textarea
        className="w-1/3 rounded-xl bg-stone-100 p-5"
        type="text"
        placeholder={cue}
      />
      <textarea
        className="w-2/3 rounded-xl bg-stone-100 p-5"
        type="text"
        placeholder={definition}
      />
      <button
        onClick={onDelete}
        type="button"
        className="absolute right-0 hidden h-full w-10 items-center justify-center bg-red-400 text-red-50 group-hover:flex hover:cursor-pointer"
      >
        <Trash2 />
      </button>
    </div>
  );
};

const CornellNoteTaking = () => {
  const today = new Date().toDateString();

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

  const handleCornellNoteSave = () => {
    console.log(cornellNote);
  };

  return (
    <main className="max-w-1/2 space-y-2 text-stone-800">
      {/* Head of the note */}
      <div className="flex justify-between rounded-xl bg-stone-100 p-5">
        <div className="w-1/3">{today}</div>
        <input
          className="w-2/3 font-semibold tracking-wide"
          placeholder="Title"
          type="text"
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
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 p-4 font-semibold tracking-wide text-green-50"
        onClick={handleKVPAdd}
      >
        <Plus />
      </button>

      {/* Summary */}
      <textarea
        required
        className="h-70 w-full rounded-xl bg-stone-100 p-5"
        placeholder="Summarize here..."
        type="text"
      />

      {/* cornell note actions */}
      <div className="flex gap-2">
        <button
          className="w-1/2 rounded-xl bg-orange-500 p-5 font-semibold tracking-wide text-green-50 hover:cursor-pointer"
          onClick={() => alert("Please save first!")}
        >
          New Cornell Note
        </button>
        <button
          className="w-1/2 rounded-xl bg-blue-400 p-5 text-lg font-semibold tracking-wide text-blue-50 hover:cursor-pointer"
          onClick={handleCornellNoteSave}
        >
          Save
        </button>
      </div>
    </main>
  );
};

export default CornellNoteTaking;