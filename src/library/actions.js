"use server";
import { client } from "./db";

// user sign up
async function makeUser(fd) {
  const first_name = fd.get("fname");
  const last_name = fd.get("lname");
  const username = fd.get("username");
  const email = fd.get("mail");
  const password = fd.get("password");

  let user = await client.query(
    "SELECT first_name FROM users WHERE email = $1",
    [email],
  );
  if (!user.rowCount) {
    await client.query(
      "INSERT INTO users (first_name, last_name, username, email, password_hash) values ($1, $2, $3, $4, $5)",
      [first_name, last_name, username, email, password],
    );
  } else console.log("Please log in!");
}

// User Log in
async function fetchUser(fd) {
  const username = fd.get("username");
  const password = fd.get("password");
  const user = await client.query(
    "SELECT username FROM users WHERE username = $1",
    [username],
  );
  if (user) {
    console.log("userfound");
  } else console.log("Please Sign Up");
}

// reading from db

async function fetchTodo() {
  const tasks = await client.query("SELECT id, task,status FROM to_do;");
  return tasks.rows;
}

async function fetchBooks() {
  const books = await client.query("select * from books;");
  return books.rows;
}
async function fetchNotes() {}

// write to db
async function writeBooks() {}
async function writeTodo() {
  client.query();
}
async function writeNotes() {}

export {
  makeUser,
  fetchUser,
  fetchTodo,
  fetchBooks,
  fetchNotes,
  writeBooks,
  writeNotes,
  writeTodo,
};
