"use client";

import { useState } from "react";
import { NotebookText, Pencil, Trash2 } from "lucide-react";
import { deleteBooks, updateBooks } from "../../../library/actions";
const Book = ({ data, isSelected, onSelect, onBookChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.title);
  const handleEdit = (e) => {
    e.stopPropagation();
    setIsEditing(!isEditing);
  };

  const handleSave = async (e) => {
    if (e.key === "Enter" || e.type === "blur") {
      await updateBooks(data.id, title);
      if (onBookChange) await onBookChange();
      setIsEditing(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    await deleteBooks(id);
    if (onBookChange) {
      await onBookChange();
    }
  };

  return (
    <div
      className={`flex w-full items-center gap-2 rounded-lg px-4 py-2 font-medium text-stone-700 hover:cursor-pointer hover:bg-sky-500 hover:text-sky-50 hover:shadow ${
        isSelected ? " bg-slate-200 text-sky-50" : "bg-white"
      }`}
      onClick={() => onSelect?.(data.id)}
    >
      <NotebookText />
      <input
        name="bookName"
        className={`outline-none ${
          isEditing ? "border px-1" : "border-none"
        } w-full bg-transparent text-inherit`}
        readOnly={!isEditing}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleSave}
        value={title}
      />

      <Pencil size={20} onClick={handleEdit} />
      <Trash2
        size={20}
        className="relative z-50 text-red-400 hover:cursor-pointer"
        onClick={(e) => handleDelete(e, data.id)}
      />
    </div>
  );
};

export default Book;
