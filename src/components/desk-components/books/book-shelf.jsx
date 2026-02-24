import { fetchBooks } from "@/library/actions";

async function BookShelf() {
  const books = await fetchBooks();

  return (
    <div className="flex h-full flex-col divide-y divide-stone-700 overflow-y-scroll p-6">
      {books.map((book) => (
        <div className="w-full hover:cursor-pointer">{book.title}</div>
      ))}
    </div>
  );
}

export default BookShelf;
