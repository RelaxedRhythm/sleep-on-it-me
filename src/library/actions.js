"use server";
import { refresh } from "next/cache";
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
async function checkUser(fd) {
  const username = fd.get("username");
  const password = fd.get("password");
  const user = await client.query(
    "SELECT * FROM users WHERE username = $1",
    [username],
  );
  if (user) {
    console.log("userfound");
  } else console.log("Please Sign Up");
  return user.rows;
}

async function fetchUser(){
    const user= await client.query("SELECT * FROM users where username='Rhythm'");
    return user.rows;
}

// reading from db

async function fetchTodo() {
    const tasks= await client.query("SELECT id, task,status FROM to_do;");
    return tasks.rows;

  // const tasks = await client.query("SELECT id, task,status FROM to_do;");
  // return tasks.rows;
}

async function fetchBooks(userId) {
  const books = await client.query("select * from books where user_id=$1;",[userId]);
  return books.rows;
}
async function fetchNotes() {}

// write to db
async function writeBooks() {}
async function writeTodo(task) {
  client.query();
  const name=task.name;
    const status=task.status;
  try{
    const result=await client.query("INSERT INTO to_do (task,status) values($1,$2) returning*;",[name,status]);
    
      return result.rows[0];
    }
    catch(err){
      console.log(err.message);
      return null;
    }
  }
  

async function writeNotes() {}

async function deleteTodos(id){
    const deletedTask=await client.query("SELECT * FROM to_do WHERE id = $1;",[id]);
    
    if(deletedTask.rowCount===0){
      console.log("error: cant delete ....");
      return
    }
      
    await client.query("DELETE FROM to_do where id=$1",[id]);
    console.log("deletion success");
}
async function updateTodo(id, task, status) {
  try {
    const result = await client.query(
      "UPDATE to_do SET task = $1, status = $2 WHERE id = $3 RETURNING *;",
      [task, status, id]
    );

    return result.rows[0];
  } catch (err) {
    console.error(err.message);
    return null;
  }
}

export {

  makeUser,
  checkUser,
  fetchUser,
  fetchTodo,
  fetchBooks,
  fetchNotes,
  writeBooks,
  writeNotes,
  writeTodo,
  deleteTodos,
  updateTodo,
};
