import { NextResponse } from "next/server";
import { fetchTodo, fetchBooks, fetchNotes } from "@/library/actions";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const todos = await fetchTodo(userId);
    const books = await fetchBooks(userId);
    let selectedBookId = null;
    let notes = [];

    if (books.length > 0) {
      selectedBookId = books[0].id; // latest
      notes = await fetchNotes(selectedBookId);
    }

    return NextResponse.json({ todos, books, notes,selectedBookId });
  } catch (error) {
    console.error("Desk API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
