"use client";

import { writeBooks } from "@/library/actions";
import { BookPlus } from "lucide-react";

const AddBook = ({ userId, onBookAdded }) => {
  const handleAddBook = async () => {
    const newBook = await writeBooks(userId);
    if (newBook) {
      onBookAdded?.(newBook);
    }
  };

  return (
    <button
      className="mt-auto flex w-full justify-center gap-4 rounded-lg bg-sky-500 p-4 font-semibold tracking-wide text-sky-50 hover:cursor-pointer hover:bg-sky-50 hover:text-sky-500 hover:shadow"
      onClick={handleAddBook}
    >
      <BookPlus />
      Newbook
    </button>
  );
};

export default AddBook;
