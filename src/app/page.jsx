import "./globals.css";
import { fetchUser, makeUser } from "@/library/actions";

// async function handleLogIn(e) {
//   "use server";
//   // console.log(e);
//   // fetchUser(username, password)
// }
// async function handleSignUp(data) {
//   "use server";
//   // console.log(data);
// }

async function Login() {
  "use server";

  return (
    <form
      action={fetchUser}
      className="m-[20] flex w-100 flex-col justify-center gap-4 rounded-sm border border-gray-500 p-4"
    >
      <p className="text-center text-3xl">Sign In</p>
      <p className="text-center text-sm text-gray-500">
        Enter your credentials to continue
      </p>
      <input
        className="m-[8] rounded-sm border border-gray-500 p-2"
        name="username"
        placeholder="username"
        type="text"
      />
      <input
        className="m-[8] rounded-sm border border-gray-500 p-2"
        name="password"
        type="password"
        placeholder="password"
      />
      <button className="rounded-l bg-blue-500 p-3 text-white">Sign In</button>{" "}
      <button>Make new account</button>
    </form>
  );
}

async function SignUp() {
  "use server";
  return (
    <form
      action={makeUser}
      className="m-[20] flex w-100 flex-col justify-center gap-4 rounded-sm border border-gray-500 p-4"
    >
      <p className="text-center text-3xl">Sign Up</p>
      <p className="text-center text-sm text-gray-500">
        Make your new account!
      </p>
      <input
        className="m-[8] rounded-sm border border-gray-500 p-2"
        placeholder="First Name"
        required
        name="fname"
        type="text"
      />
      <input
        className="m-[8] rounded-sm border border-gray-500 p-2"
        name="lname"
        required
        type="text"
        placeholder="Last Name"
      />
      <input
        className="m-[8] rounded-sm border border-gray-500 p-2"
        name="username"
        required
        type="text"
        placeholder="username"
      />
      <input
        className="m-[8] rounded-sm border border-gray-500 p-2"
        name="mail"
        required
        type="email"
        placeholder="you@example.com"
      />
      <input
        className="m-[8] rounded-sm border border-gray-500 p-2"
        name="password"
        required
        type="password"
        placeholder="Password"
      />
      <input
        className="m-[8] rounded-sm border border-gray-500 p-2"
        name="password"
        type="password"
        placeholder="Re-enter password"
      />
      <button className="rounded-l bg-blue-500 p-3 text-white">Sign Up</button>{" "}
      <button>Already have an account?</button>
    </form>
  );
}

export const metadata = {
  title: "Sleep on it! | Login",
  description: "The best productive learning app on the market",
};

export default function Home() {
  "use client";
  return (
    <main className="flex h-[96vh] items-center justify-center">
      {/* <div>Hello world!</div> */}
      <Login />
      <SignUp />
    </main>
  );
}
