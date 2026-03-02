"use client";

import { NotebookText } from "lucide-react";
import { useRouter } from "next/navigation";

const Book = ({ data, getNotes }) => {
  const router = useRouter();
  return (
    <div
      className="flex w-full items-center gap-2 rounded-lg px-4 py-2 font-medium text-stone-700 hover:cursor-pointer hover:bg-sky-500 hover:text-sky-50 hover:shadow"
      onClick={() => getNotes(data.id)}
    >
      <NotebookText /> {data.title}
    </div>
  );
};

export default Book;
