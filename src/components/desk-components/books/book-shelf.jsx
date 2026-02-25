import { fetchBooks } from "@/library/actions";
import { BookPlus, Library, NotebookText } from "lucide-react";

async function BookShelf() {
  const books = await fetchBooks();

  return (
    <div className="flex h-full flex-col text-lg">
      <h2 className="flex items-center gap-2 p-4 text-stone-400">
        <Library /> Book shelf
      </h2>
      <div className="flex h-full flex-col overflow-y-scroll p-4">
        {books.map((book) => (
          <div
            key={book.id}
            className="flex w-full items-center gap-2 rounded-lg px-4 py-2 font-medium text-stone-700 hover:cursor-pointer hover:bg-sky-500 hover:text-sky-50 hover:shadow"
          >
            <NotebookText /> {book.title}
          </div>
        ))}
      </div>
      <div className="w-full p-4">
        <button className="mt-auto flex w-full justify-center gap-4 rounded-lg bg-sky-500 p-4 font-semibold tracking-wide text-sky-50 hover:cursor-pointer hover:bg-sky-400 hover:shadow">
          <BookPlus />
          Newbook
        </button>
      </div>
    </div>
  );
}

export default BookShelf;
