"use client";
import { useState } from "react";
import CornellNoteTaking from "@/components/desk-components/cornell-note";
import NotebookSummary from "@/components/desk-components/summary";
import Pomodoro from "@/components/desk-components/pomodoro";
import SidePanel from "@/components/desk-components/side-navigation-panels";
import { Note } from "@/components/desk-components/notes/notes";
import Book from "@/components/desk-components/books/book";
import BookShelf from "@/components/desk-components/books/book-shelf";
import Account from "@/components/desk-components/account";
import { fetchBooks, fetchNotes, fetchUser } from "@/library/actions";

// export const metadata = {
//   title: "Desk",
//   description: "The best productive environment for you! Built with caution.",
// };

const Desk = () => {
  const [shelf, setShelf] = useState();
  const [notes, setNotes] = useState();

  // populate books
  const getBooks = async () => {
    const res = await fetchBooks("08cf938e-3d7b-4175-93cb-2d537652d999");
    setShelf(res);
  };

  // filter notes
  const getNotes = async (id) => {
    const res = await fetchNotes(id);
    setNotes(res);
  };

  return (
    <div className="flex h-full">
      {/* books navigation */}
      <SidePanel label="Active Notebook Title">
        <div className="h-40 w-full rounded-b-lg bg-purple-500 text-purple-50"></div>
        <button onClick={getBooks}>fetchUser</button>
        {shelf
          ? shelf.map((book) => (
              <Book key={book.id} data={book} getNotes={getNotes} />
            ))
          : "not populated yet"}

        {/* <BookShelf userId={user.id} /> */}
        <div className="mt-auto">{/* <Account user={user.username} /> */}</div>
      </SidePanel>

      {/* workarea */}
      <div className="space-y-4 px-6">
        <NotebookSummary />
        <div className="flex items-start justify-around">
          <CornellNoteTaking />
          <Pomodoro />
        </div>
      </div>

      {/* notes navigation */}
      <SidePanel label="Notes">
        {notes
          ? notes.map((note) => <Note key={note.id} title={note.title} />)
          : "select a book"}
      </SidePanel>
    </div>
  );
};

export default Desk;
