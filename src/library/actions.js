"use server";
import { refresh } from "next/cache";
import { client } from "./db";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { signUpFormSchema } from "./validation";

// user sign up
async function signup(state, formData) {
  const validatedFields = signUpFormSchema.safeParse({
    fname: formData.get("fname"),
    lname: formData.get("lname"),
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { fname, lname, username, email, password } = validatedFields.data;
  console.log(fname, lname, username, email, password );
  let user = await client.query(
    "SELECT first_name FROM users WHERE email = $1",
    [email],
  );
  if (!user.rowCount) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await client.query(
      "INSERT INTO users (first_name, last_name, username, email, password_hash) values ($1, $2, $3, $4, $5)",
      [fname, lname, username, email, hashedPassword],
    );
  } else{
    return {
      errors: {email: ["Email already exists. Please log in!"],
      },
      
    }
  }

  redirect("/login");

}
// async function makeUser(fd) {
//   const first_name = fd.get("fname");
//   const last_name = fd.get("lname");
//   const username = fd.get("username");
//   const email = fd.get("mail");
//   const password = fd.get("password");

//   let user = await client.query(
//     "SELECT first_name FROM users WHERE email = $1",
//     [email],
//   );
//   if (!user.rowCount) {
//     await client.query(
//       "INSERT INTO users (first_name, last_name, username, email, password_hash) values ($1, $2, $3, $4, $5)",
//       [first_name, last_name, username, email, password],
//     );
//   } else console.log("Please log in!");
// }

// User Log in
async function checkUser(fd) {
  const username = fd.get("username");
  const password = fd.get("password");
  const user = await client.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  if (user) {
    console.log("userfound");
  } else console.log("Please Sign Up");
}
const fetchUser = async (id) => {
  const user = await client.query("Select * FROM users WHERE id = $1", [id]);
  return user.rows[0];
};

// reading from db

async function fetchTodo() {
  const tasks = await client.query("SELECT id, task,status FROM to_do;");
  return tasks.rows;

  // const tasks = await client.query("SELECT id, task,status FROM to_do;");
  // return tasks.rows;
}

async function fetchBooks(userId) {
  const books = await client.query("SELECT * FROM books WHERE user_id = $1", [
    userId,
  ]);
  return books.rows;
}
async function fetchNotes(bookId) {
  const notes = await client.query("SELECT * FROM notes WHERE book_id = $1", [
    bookId,
  ]);
  return notes.rows;
}

// write to db
async function writeBooks() {}
async function writeTodo(task) {
  client.query();
  const name = task.name;
  const status = task.status;
  try {
    const result = await client.query(
      "INSERT INTO to_do (task,status) values($1,$2) returning*;",
      [name, status],
    );

    return result.rows[0];
  } catch (err) {
    console.log(err.message);
    return null;
  }
}

async function writeNotes(formData) {
    const summary=formData.get("summary");
    const title=formData.get("title");
    // console.log(summary);
    const notes=await client.query('INSERT INTO notes(session_id,pomodoro_id,title,summary) values($1,$2,$3,$4) returning id',[1,2,title,summary]);
    const note_id=notes.rows[0].id;
    const keys=formData.getAll('key');
    const definitions=formData.getAll('defintion');
    //to loop through both arrays together....
    keys.forEach(async(cue,index) => {
        const content=definitions[index];
        await client.query("INSERT INTO note_details (cue,content,note_id) values($1,$2,$3);",
      [cue, content,note_id],
    );
    });
  }

async function deleteTodos(id) {
  const deletedTask = await client.query("SELECT * FROM to_do WHERE id = $1;", [
    id,
  ]);

  if (deletedTask.rowCount === 0) {
    console.log("error: cant delete ....");
    return;
  }

  await client.query("DELETE FROM to_do where id=$1", [id]);
  console.log("deletion success");
}
async function updateTodo(id, task, status) {
  try {
    const result = await client.query(
      "UPDATE to_do SET task = $1, status = $2 WHERE id = $3 RETURNING *;",
      [task, status, id],
    );

    return result.rows[0];
  } catch (err) {
    console.error(err.message);
    return null;
  }
}

export {
  signup,
  // makeUser,
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
