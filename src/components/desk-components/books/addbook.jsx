"use client";

import { BookPlus } from "lucide-react";

const AddBook = () => {
  return (
    <button
      className="mt-auto flex w-full justify-center gap-4 rounded-lg bg-sky-500 p-4 font-semibold tracking-wide text-sky-50 hover:cursor-pointer hover:bg-sky-50 hover:text-sky-500 hover:shadow"
      onClick={() => console.log("note added")}
    >
      <BookPlus />
      Newbook
    </button>
  );
};

export default AddBook;
