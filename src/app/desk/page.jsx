"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

import CornellNoteTaking from "@/components/desk-components/cornell-note";
import NotebookSummary from "@/components/desk-components/summary";
import Pomodoro from "@/components/desk-components/pomodoro";
import SidePanel from "@/components/desk-components/side-navigation-panels";
import { Note } from "@/components/desk-components/notes/notes";
import Book from "@/components/desk-components/books/book";
import BookShelf from "@/components/desk-components/books/book-shelf";
import Account from "@/components/desk-components/account";
import { fetchBooks, fetchNotes } from "@/library/actions";

const Desk = () => {
  const [shelf, setShelf] = useState();
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [notes, setNotes] = useState();
  const { data: session,status } = useSession();
  const userid = session?.user?.id;
  
  // populate books
  const getBooks = async () => {
    const res = await fetchBooks(userid);
    setShelf(res);
  };

  // filter notes
  const getNotes = async (id) => {
    setSelectedBookId(id);
    console.log("book clicked", selectedBookId);
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
          <CornellNoteTaking bookId={selectedBookId} />
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
