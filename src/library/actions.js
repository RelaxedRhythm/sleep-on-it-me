"use server";
import { refresh } from "next/cache";
import { client } from "./db";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { signUpFormSchema } from "./validation";
import { number } from "zod";

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
  console.log(fname, lname, username, email, password);
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
  } else {
    return {
      errors: { email: ["Email already exists. Please log in!"] },
    };
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
  const books = await client.query("SELECT * FROM books WHERE user_id = $1 ORDER BY created_at DESC", [
    userId ,
  ]);
  return books.rows;
}
async function fetchNotes(bookId) {
  const notes = await client.query(
    `SELECT n.*, b.title as book_title,
     COALESCE(
       json_agg(
         json_build_object('cue', nd.cue, 'content', nd.content)
         ORDER BY nd.id
       ) FILTER (WHERE nd.id IS NOT NULL),
       '[]'::json
     ) AS key_value_pairs
     FROM notes n
     JOIN sessions s ON n.session_id = s.id
     LEFT JOIN books b ON s.book_id = b.id
     LEFT JOIN note_details nd ON nd.note_id = n.id
     WHERE s.book_id = $1
     GROUP BY n.id, b.title
     ORDER BY n.created_at DESC`,
    [bookId],
  );
  return notes.rows.map((note) => ({
    ...note,
    key_value_pairs: Array.isArray(note.key_value_pairs) ? note.key_value_pairs : [],
  }));
}

// write to db
async function writeBooks(userId) {
    try{
        const user_id=userId;
        const title='untitled'
        console.log(userId);
        const newBook=await client.query('INSERT INTO books(user_id,title) VALUES($1,$2) returning*;',[user_id,title]);
        return newBook.rows[0];
    }catch(err){
      console.log('error in adding book',err);
    }
}
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
  const summary = formData.get("summary");
  const title = formData.get("title");
  const session_id = formData.get("session_id");
  const session_num = formData.get("session_num");
  const pomodoro_num = Number(
    formData.get("pomodoro_num")) ||  0;
//   if (!book_id) {
//   console.log("No book selected");
//   return;
// }
  if(!session_id){
    console.log("No session found");
    return;
  } 
  const notes = await client.query(
    "INSERT INTO notes(session_id,pomodoro_num,title,summary,session_num) values($1,$2,$3,$4,$5) returning id",
    [session_id, pomodoro_num, title, summary, session_num],
  );
  const note_id = notes.rows[0].id;
  const keys = formData.getAll("key");
  const definitions = formData.getAll("definition");
  //to loop through both arrays together....
  for (let i = 0; i < keys.length; i++) {
    const cue = keys[i];
    const content = definitions[i];

    await client.query(
      "INSERT INTO note_details (cue,content,note_id) values($1,$2,$3);",
      [cue, content, note_id],
    );
  }
}

async function updateNote(id, title, summary) {
  try {
    const result = await client.query(
      "UPDATE notes SET title = $1, summary = $2 WHERE id = $3 RETURNING *;",
      [title, summary, id],
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error updating note:", err);
    return null;
  }
}

async function deleteNote(id) {
  try {
    await client.query("DELETE FROM note_details WHERE note_id = $1", [id]);
    await client.query("DELETE FROM notes WHERE id = $1", [id]);
    return true;
  } catch (err) {
    console.error("Error deleting note:", err);
    return false;
  }
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

async function updateBooks(id,title){
  try{
    const result=await client.query("UPDATE books SET title=$1 WHERE id=$2 RETURNING *;",[title,id]);
    return result.rows[0];
  }catch(err){
    console.error(err.message);
    return null;
  }
}

async function deleteBooks(id){
  try{
    const deletedBook=await client.query("SELECT * FROM books WHERE id=$1",[id]);
    if (deletedBook.rowCount === 0) {
    console.log("error: cant delete ....");
    return;
  }
  await client.query("DELETE FROM books where id=$1", [id]);
  console.log("deletion success");
  }  catch(err){
    console.log("error in deleting book",err);
    return;
  }
}

async function writeSession({bookId,userId,sessionNum}){
  console.log("session details",bookId,userId,sessionNum);
  try{
    if(!bookId || !userId || !sessionNum){
      console.log("missing session details");
      return;
    }
    const session= await client.query("INSERT INTO sessions (user_id,book_id,session_num,started_at,session_date) values($1,$2,$3,NOW(),$4) returning id",[userId, bookId, sessionNum, new Date()]);
     console.log("Query result:", session.rows);
    return session.rows[0].id;
  }catch(err){
    console.log("Error msg",err);
  }
}

async function completeSession(sessionId){
  try{
    const completed=await client.query("UPDATE sessions SET completed_at=$1 WHERE id=$2 RETURNING* ;",[new Date(),sessionId]);
    return completed.rows[0];
  }   catch(err){
    console.log("Error in completing session",err);
  }
}

async function searchByTitle(title, bookId,date){
  try{
    const result=await client.query(`SELECT n.* FROM notes n JOIN sessions s ON n.session_id = s.id 
      WHERE s.book_id = $1 
      AND ($2::text IS NULL OR n.title ILIKE $2) 
      AND ($3::DATE IS NULL OR DATE(n.created_at) = $3) 
      order by n.created_at desc;`,
      [bookId, `%${title}%`, date]);  
  }catch(err){
    console.log("Error in searching note by title",err);
  }
}

async function getDashboardStats(userId) {
  try {
    // Topics: number of books
    const topicsResult = await client.query("SELECT COUNT(*) as count FROM books WHERE user_id = $1", [userId]);
    const topics = parseInt(topicsResult.rows[0].count);

    // Notes: number of notes
    const notesResult = await client.query(`
      SELECT COUNT(n.*) as count FROM notes n 
      JOIN sessions s ON n.session_id = s.id 
      WHERE s.user_id = $1
    `, [userId]);
    const notesCount = parseInt(notesResult.rows[0].count);

    // Study Time: sum of pomodoro_num * 25 minutes
    const studyTimeResult = await client.query(`
      SELECT COALESCE(SUM(pomodoro_num), 0) as total FROM notes n 
      JOIN sessions s ON n.session_id = s.id 
      WHERE s.user_id = $1
    `, [userId]);
    const studyTimeMinutes = parseInt(studyTimeResult.rows[0].total) * 25;
    const studyTimeHours = Math.floor(studyTimeMinutes / 60);

    // Streak: number of active days in last 30 days (simplified)
    const activeDaysResult = await client.query(`
      SELECT COUNT(DISTINCT DATE(session_date)) as active_days
      FROM sessions 
      WHERE user_id = $1 
      AND session_date >= CURRENT_DATE - INTERVAL '30 days'
    `, [userId]);
    const streak = parseInt(activeDaysResult.rows[0].active_days);

    return {
      streak,
      topics,
      studyTime: studyTimeHours,
      notesCount
    };
  } catch (err) {
    console.error("Error getting dashboard stats:", err);
    return { streak: 0, topics: 0, studyTime: 0, notesCount: 0 };
  }
}

async function getRecentActivity(userId) {
  try {
    const result = await client.query(`
      SELECT n.title, n.created_at, b.title as book_title
      FROM notes n 
      JOIN sessions s ON n.session_id = s.id 
      JOIN books b ON s.book_id = b.id
      WHERE s.user_id = $1 
      ORDER BY n.created_at DESC 
      LIMIT 5
    `, [userId]);
    return result.rows.map(row => ({
      title: row.title,
      book: row.book_title,
      date: row.created_at
    }));
  } catch (err) {
    console.error("Error getting recent activity:", err);
    return [];
  }
}

async function getUserNotebooks(userId) {
  try {
    const result = await client.query(`
      SELECT id, title, created_at
      FROM books 
      WHERE user_id = $1 
      ORDER BY created_at DESC LIMIT 5
    `, [userId]);
    return result.rows.map(row => ({
      id: row.id,
      title: row.title,
      lastEdited: row.created_at
    }));
  } catch (err) {
    console.error("Error getting user notebooks:", err);
    return [];
  }
}

async function getProfileData(userId) {
  try {
    // Get user join date
    const userResult = await client.query("SELECT created_at FROM users WHERE id = $1", [userId]);
    const joinDate = userResult.rows[0]?.created_at;

    // Get total books
    const booksResult = await client.query("SELECT COUNT(*) as count FROM books WHERE user_id = $1", [userId]);
    const totalBooks = parseInt(booksResult.rows[0].count);

    // Get total notes
    const notesResult = await client.query(`
      SELECT COUNT(n.*) as count FROM notes n 
      JOIN sessions s ON n.session_id = s.id 
      WHERE s.user_id = $1
    `, [userId]);
    const totalNotes = parseInt(notesResult.rows[0].count);

    // Get total study time
    const studyTimeResult = await client.query(`
      SELECT COALESCE(SUM(pomodoro_num), 0) as total FROM notes n 
      JOIN sessions s ON n.session_id = s.id 
      WHERE s.user_id = $1
    `, [userId]);
    const totalStudyTime = Math.floor((parseInt(studyTimeResult.rows[0].total) * 25) / 60);

    return {
      totalBooks,
      totalNotes,
      totalStudyTime,
      joinDate
    };
  } catch (err) {
    console.error("Error getting profile data:", err);
    return { totalBooks: 0, totalNotes: 0, totalStudyTime: 0, joinDate: null };
  }
}

async function getStudyHeatmap(userId) {
  try {
    const result = await client.query(`
      SELECT 
        DATE(session_date) as day,
        COUNT(*) as sessions
      FROM sessions
      WHERE user_id = $1
      AND session_date >= CURRENT_DATE - INTERVAL '365 days'
      GROUP BY day
      ORDER BY day
    `, [userId]);

    return result.rows.map(row => ({
      date: row.day,
      count: parseInt(row.sessions)
    }));

  } catch (err) {
    console.error("Error getting heatmap:", err);
    return [];
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
  updateNote,
  deleteNote,
  writeTodo,
  deleteTodos,
  updateTodo,
  updateBooks,
  deleteBooks,
  writeSession,
  completeSession,
  searchByTitle,
  getDashboardStats,
  getRecentActivity,
  getUserNotebooks,
  getProfileData,
  getStudyHeatmap
};
