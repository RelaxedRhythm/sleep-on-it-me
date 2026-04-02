"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { NotebookText,Pencil,Trash2 } from "lucide-react"; 
import { deleteBooks, updateBooks } from "../../../library/actions";
const Book = ({ data, getNotes }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.title);
  const [books, setBooks] = useState([]);
  const handleEdit = (e) => {
    e.stopPropagation();
    setIsEditing(!isEditing);
  };

  const handleSave = async (e) => {
    if (e.key === "Enter" || e.type === "blur") {
      await updateBooks(data.id, title);
      setIsEditing(false);
    }
  };



   const handleDelete = async (e,id) => {
    e.stopPropagation();
    await deleteBooks(id);

  };

  return (
    <div
      className="flex w-full items-center gap-2 rounded-lg px-4 py-2 font-medium text-stone-700 hover:cursor-pointer hover:bg-sky-500 hover:text-sky-50 hover:shadow"
      onClick={() =>
        getNotes(data.id)}
    >
      <NotebookText />  <input name="bookName" 
                              className={`outline-none ${
          isEditing ? "border px-1" : " border-none"
        }`} 
                              readOnly={!isEditing} 
                              onChange={(e) => setTitle(e.target.value)} 
                              onBlur={handleSave}
                              onKeyDown={handleSave}
                              value={title}/> 

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
