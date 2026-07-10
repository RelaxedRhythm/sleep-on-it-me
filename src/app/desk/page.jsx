"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

import CornellNoteTaking from "@/components/desk-components/cornell-note";
import Modal from "@/components/ui/modal";
import NotebookSummary from "@/components/desk-components/summary";
import Pomodoro from "@/components/desk-components/pomodoro";
import SidePanel from "@/components/desk-components/side-navigation-panels";
import { Note } from "@/components/desk-components/notes/notes";
import Book from "@/components/desk-components/books/book";
import Account from "@/components/desk-components/account";
import { fetchNotes } from "@/library/actions";
import AddBook from "@/components/desk-components/books/addbook";

const Desk = () => {
  const { data: session, status } = useSession();
  const [shelf, setShelf] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [notes, setNotes] = useState([]);
  const [bookPage, setBookPage] = useState(1);
  const booksPerPage = 8;
  const userid = session?.user?.id;
  const user = session?.user;

  const [pomodoro_num, setPomodoro_num] = useState(1);
  const [session_num, setSessions_num] = useState(1);
  const [sessionId, setSessionId] = useState(null);
  const [todos, setTodos] = useState([]);
  const [notePage, setNotePage] = useState(1);
  const notesPerPage = 8;
  const [bookSearch, setBookSearch] = useState("");
  const [noteSearch, setNoteSearch] = useState("");
  const debouncedBookSearch = useDebouncedValue(bookSearch, 250);
  const debouncedNoteSearch = useDebouncedValue(noteSearch, 250);
  const [selectedNote, setSelectedNote] = useState(null);
  const [modalError, setModalError] = useState(null);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [draftNote, setDraftNote] = useState({ title: "", summary: "", keyValuePairs: [] });

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/desk")
        .then((res) => res.json())
        .then((data) => {
          setShelf(data.books || []);
          setTodos(data.todos || []);
          setSelectedBookId(data.selectedBookId);
          setNotes(data.notes || []);
        })
        .catch((err) => {
          console.error("Error fetching desk data:", err);
          setModalError("We could not load your desk data right now. Please refresh and try again.");
        });
    }
  }, [status]);

  const refreshNotes = async (bookId = selectedBookId) => {
    if (!bookId) {
      setNotes([]);
      return;
    }

    try {
      const bookNotes = await fetchNotes(bookId);
      setNotes(bookNotes || []);
    } catch (err) {
      console.error("Error loading notes for selected book:", err);
      setNotes([]);
    }
  };

  useEffect(() => {
    refreshNotes(selectedBookId);
  }, [selectedBookId]);

  const handleSelectBook = (bookId) => {
    if (!bookId) return;
    setSelectedNote(null);
    setIsEditingNote(false);
    setNotes([]);
    setSelectedBookId(bookId);
  };

  const handleBookAdded = (newBook) => {
    if (!newBook?.id) return;
    setShelf((prevShelf) => [newBook, ...prevShelf]);
    setSelectedNote(null);
    setIsEditingNote(false);
    setNotes([]);
    setSelectedBookId(newBook.id);
    setBookPage(1);
  };

  useEffect(() => {
    if (selectedNote) {
      setDraftNote({
        title: selectedNote.title || "",
        summary: selectedNote.summary || "",
        keyValuePairs: Array.isArray(selectedNote.key_value_pairs)
          ? selectedNote.key_value_pairs.map((item, index) => ({
              id: item.id ?? `${item.cue || "pair"}-${index}`,
              cue: item.cue || "",
              content: item.content || "",
            }))
          : [],
      });
    }
  }, [selectedNote]);

  const filteredBooks = (shelf || []).filter((book) => {
    const query = debouncedBookSearch.toLowerCase();
    return !query || (book.title || "").toLowerCase().includes(query) || (book.description || "").toLowerCase().includes(query);
  });

  const filteredNotes = (notes || []).filter((note) => {
    const query = debouncedNoteSearch.toLowerCase();
    return !query || ((note.title || "").toLowerCase().includes(query) || (note.summary || "").toLowerCase().includes(query));
  });

  const handleDraftPairChange = (index, field, value) => {
    setDraftNote((prev) => {
      const nextPairs = [...prev.keyValuePairs];
      nextPairs[index] = { ...nextPairs[index], [field]: value };
      return { ...prev, keyValuePairs: nextPairs };
    });
  };

  const handleAddKeyValuePair = () => {
    setDraftNote((prev) => ({
      ...prev,
      keyValuePairs: [
        ...prev.keyValuePairs,
        { id: `${Date.now()}-${prev.keyValuePairs.length + 1}`, cue: "", content: "" },
      ],
    }));
  };

  const handleRemoveKeyValuePair = (index) => {
    setDraftNote((prev) => ({
      ...prev,
      keyValuePairs: prev.keyValuePairs.filter((_, pairIndex) => pairIndex !== index),
    }));
  };

  const handleSaveNote = async () => {
    if (!selectedNote) return;

    const normalizedPairs = draftNote.keyValuePairs
      .filter((item) => item?.cue || item?.content)
      .map((item) => ({ cue: item.cue ?? "", content: item.content ?? "" }));

    try {
      const response = await fetch("/api/notes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          noteId: selectedNote.id,
          title: draftNote.title,
          summary: draftNote.summary,
          keyValuePairs: normalizedPairs,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || "We could not update this note.");
      }

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === selectedNote.id
            ? {
                ...note,
                title: draftNote.title,
                summary: draftNote.summary,
                key_value_pairs: normalizedPairs,
              }
            : note,
        ),
      );
      setSelectedNote((prev) =>
        prev && prev.id === selectedNote.id
          ? {
              ...prev,
              title: draftNote.title,
              summary: draftNote.summary,
              key_value_pairs: normalizedPairs,
            }
          : prev,
      );
      setIsEditingNote(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "We could not update this note. Please try again.";
      setModalError(message);
    }
  };

  const handleDeleteNote = async () => {
    if (!selectedNote) return;

    try {
      const response = await fetch(`/api/notes?noteId=${selectedNote.id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || "We could not delete this note.");
      }

      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== selectedNote.id));
      await refreshNotes(selectedBookId);
      setSelectedNote(null);
      setIsEditingNote(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "We could not delete this note. Please try again.";
      setModalError(message);
    }
  };

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="flex h-full">
      <SidePanel
        label={selectedBookId ? shelf.find((book) => String(book.id) === String(selectedBookId))?.title : "No Book Selected"}
        searchValue={bookSearch}
        onSearch={(v) => {
          setBookSearch(v);
          setBookPage(1);
        }}
        currentPage={bookPage}
        totalPages={Math.max(1, Math.ceil(filteredBooks.length / booksPerPage))}
        onPageChange={(p) => setBookPage(p)}
      >
        <div className="h-40 w-full rounded-b-lg bg-purple-500 text-purple-50"></div>
        {(shelf && shelf.length > 0) ? (() => {
          const start = (bookPage - 1) * booksPerPage;
          if (filteredBooks.length === 0) {
            return <p className="px-4 py-3 text-sm text-stone-500">No books match your search.</p>;
          }
          return filteredBooks.slice(start, start + booksPerPage).map((book) => (
            <Book
              key={book.id}
              data={book}
              isSelected={String(book.id) === String(selectedBookId)}
              onSelect={handleSelectBook}
            />
          ));
        })() : <p className="px-4 py-3 text-sm text-stone-500">No books yet. Add one to get started.</p>}

        <AddBook userId={userid} onBookAdded={handleBookAdded} />
        <div className="mt-auto"><Account user={user} /></div>
      </SidePanel>

      <div className="space-y-4 px-6">
        <NotebookSummary sessionId={sessionId} sessionName={`session ${session_num}`} />
        <div className="flex items-start justify-around">
          <CornellNoteTaking
            sessionId={sessionId}
            session={session_num}
            pomodoro={pomodoro_num}
            bookId={selectedBookId}
            onNoteSaved={() => refreshNotes(selectedBookId)}
            onError={setModalError}
          />
          <Pomodoro
            userId={userid}
            bookId={selectedBookId}
            sessionId={sessionId}
            setSessionId={setSessionId}
            pomodoro={pomodoro_num}
            setPomodoro={setPomodoro_num}
            session={session_num}
            setSessions={setSessions_num}
            todos={todos}
          />
        </div>
      </div>

      <SidePanel
        label="Notes"
        searchValue={noteSearch}
        onSearch={(v) => {
          setNoteSearch(v);
          setNotePage(1);
        }}
        currentPage={notePage}
        totalPages={Math.max(1, Math.ceil(filteredNotes.length / notesPerPage))}
        onPageChange={(p) => setNotePage(p)}
      >
        {(notes && notes.length > 0) ? (() => {
          const start = (notePage - 1) * notesPerPage;
          if (filteredNotes.length === 0) {
            return <p className="px-4 py-3 text-sm text-stone-500">No notes match your search.</p>;
          }
          return filteredNotes.slice(start, start + notesPerPage).map((note) => <Note key={note.id} title={note.title} onOpen={() => setSelectedNote(note)} />);
        })() : <p className="px-4 py-3 text-sm text-stone-500">Select a book to see notes.</p>}
      </SidePanel>

      <Modal
        isOpen={Boolean(modalError)}
        onClose={() => setModalError(null)}
        title="Something went wrong"
        message={modalError || "Please try again."}
        type="error"
      />

      <Modal
        isOpen={Boolean(selectedNote)}
        onClose={() => {
          setSelectedNote(null);
          setIsEditingNote(false);
        }}
        title={selectedNote?.title || "Note details"}
        type="info"
        size="lg"
        actions={[
          <button
            key="edit"
            type="button"
            onClick={() => setIsEditingNote((prev) => !prev)}
            className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            {isEditingNote ? "Cancel" : "Edit"}
          </button>,
          <button
            key="delete"
            type="button"
            onClick={handleDeleteNote}
            className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            Delete
          </button>,
          <button
            key="close"
            type="button"
            onClick={() => {
              setSelectedNote(null);
              setIsEditingNote(false);
            }}
            className="rounded-full bg-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-300"
          >
            Close
          </button>,
        ]}
      >
        {selectedNote ? (
          <div className="space-y-4 text-sm text-stone-700">
            {isEditingNote ? (
              <div className="space-y-3">
                <textarea
                  value={draftNote.title}
                  rows={2}
                  onChange={(event) => setDraftNote((prev) => ({ ...prev, title: event.target.value }))}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Note title"
                />
                <textarea
                  value={draftNote.summary}
                  rows={8}
                  onChange={(event) => setDraftNote((prev) => ({ ...prev, summary: event.target.value }))}
                  className="min-h-40 w-full rounded-xl border border-stone-300 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Note content"
                />

                <div className="rounded-xl border border-stone-200 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Key / value pairs</p>
                    <button
                      type="button"
                      onClick={handleAddKeyValuePair}
                      className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700"
                    >
                      Add pair
                    </button>
                  </div>
                  <div className="mt-3 space-y-3">
                    {draftNote.keyValuePairs.map((pair, index) => (
                      <div key={pair.id ?? `${pair.cue || "pair"}-${index}`} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                        <textarea
                          value={pair.cue}
                          rows={2}
                          onChange={(event) => handleDraftPairChange(index, "cue", event.target.value)}
                          className="w-full rounded-xl border border-stone-300 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
                          placeholder="Key"
                        />
                        <textarea
                          value={pair.content}
                          rows={2}
                          onChange={(event) => handleDraftPairChange(index, "content", event.target.value)}
                          className="w-full rounded-xl border border-stone-300 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
                          placeholder="Value"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyValuePair(index)}
                          className="rounded-full bg-rose-100 px-3 py-2 text-sm font-semibold text-rose-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveNote}
                  className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Save changes
                </button>
              </div>
            ) : (
              <>
                <div className="rounded-xl bg-stone-100 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Summary</p>
                  <p className="mt-2 whitespace-pre-wrap leading-7">{selectedNote.summary || "No content available."}</p>
                </div>

                {selectedNote.key_value_pairs?.length > 0 ? (
                  <div className="rounded-xl border border-stone-200 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Key / value pairs</p>
                    <div className="mt-3 space-y-3">
                      {selectedNote.key_value_pairs.map((item, index) => (
                        <div key={`${item.cue}-${index}`} className="rounded-lg bg-sky-50 p-3">
                          <p className="text-sm font-semibold text-sky-700">{item.cue || "Key"}</p>
                          <p className="mt-1 whitespace-pre-wrap text-sm text-stone-600">{item.content || "No details available."}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-stone-200 p-4 text-sm text-stone-500">
                    No key/value pairs were saved with this note.
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-stone-200 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Book</p>
                    <p className="mt-2 font-medium text-stone-700">{selectedNote.book_title || "Unknown book"}</p>
                  </div>
                  <div className="rounded-xl border border-stone-200 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Created</p>
                    <p className="mt-2 font-medium text-stone-700">{selectedNote.created_at ? new Date(selectedNote.created_at).toLocaleString() : "Unknown"}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default Desk;
