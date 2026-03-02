import { BookPlus, Library, NotebookText } from "lucide-react";
import AddBook from "./addbook";
import Book from "./book";

async function BookShelf({ userId, selectNotes }) {
  const books = await fetchBooks(userId);

  return (
    <div className="flex h-full flex-col text-lg">
      {/* title */}
      <h2 className="flex items-center gap-2 p-4 text-stone-400">
        <Library /> Book shelf
      </h2>

      {/* book list */}
      <div className="flex h-full flex-col overflow-y-scroll p-4">
        {books.map((book) => (
          <Book key={book.id} data={book} setNotes={selectNotes} />
        ))}
      </div>

      {/* add book button */}
      <div className="w-full p-4">
        <AddBook />
      </div>
    </div>
  );
}

export default BookShelf;
{
  /* <div
            key={book.id}
            className="flex w-full items-center gap-2 rounded-lg px-4 py-2 font-medium text-stone-700 hover:cursor-pointer hover:bg-sky-500 hover:text-sky-50 hover:shadow"
          >
            <NotebookText /> {book.title}
          </div> */
}
