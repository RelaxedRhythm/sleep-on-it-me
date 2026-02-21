import "./globals.css";

function Login() {
  return (
    <form className="m-[20] flex w-100 flex-col justify-center gap-4 rounded-sm border border-gray-500 p-4">
      <p className="text-center text-3xl">Sign In</p>
      <p className="text-center text-sm text-gray-500">
        Enter your credentials to continue
      </p>
      <input
        className="m-[8] rounded-sm border border-gray-500 p-2"
        name="User"
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

function SignUp() {
  return (
    <form className="m-[20] flex w-100 flex-col justify-center gap-4 rounded-sm border border-gray-500 p-4">
      <p className="text-center text-3xl">Sign Up</p>
      <p className="text-center text-sm text-gray-500">
        Make your new account!
      </p>
      <input
        className="m-[8] rounded-sm border border-gray-500 p-2"
        placeholder="First Name"
        name="fname"
        type="text"
      />
      <input
        className="m-[8] rounded-sm border border-gray-500 p-2"
        name="lname"
        type="text"
        placeholder="Last Name"
      />
      <input
        className="m-[8] rounded-sm border border-gray-500 p-2"
        name="Username"
        type="text"
        placeholder="username"
      />
      <input
        className="m-[8] rounded-sm border border-gray-500 p-2"
        name="mail"
        type="email"
        placeholder="you@example.com"
      />
      <input
        className="m-[8] rounded-sm border border-gray-500 p-2"
        name="Password"
        type="password"
        placeholder="Password"
      />
      <input
        className="m-[8] rounded-sm border border-gray-500 p-2"
        name="Password"
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
  return (
    <main className="flex h-[96vh] items-center justify-center">
      {/* <div>Hello world!</div> */}
      <Login />
      <SignUp />
    </main>
  );
}
