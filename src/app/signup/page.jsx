"use client";

import { signup } from "../../library/actions";
import { useActionState, useState } from "react";

export default function SignUp() {
  const [state, action, isPending] = useActionState(signup, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      action={action}
      className="m-[20] flex w-100 flex-col justify-center gap-4 rounded-sm border border-gray-500 p-4"
    >
      <p className="text-center text-3xl">Sign Up</p>
      <p className="text-center text-sm text-gray-500">Make your new account!</p>
      <input
        className="m-[8] rounded-sm border border-gray-500 p-2"
        placeholder="First Name"
        required
        name="fname"
        type="text"
      />
      {state?.errors?.fname && <p className="text-red-500">{state.errors.fname}</p>}

      <input
        className="m-[8] rounded-sm border border-gray-500 p-2"
        name="lname"
        required
        type="text"
        placeholder="Last Name"
      />
      {state?.errors?.lname && <p className="text-red-500">{state.errors.lname}</p>}

      <input
        className="m-[8] rounded-sm border border-gray-500 p-2"
        name="username"
        required
        type="text"
        placeholder="username"
      />
      {state?.errors?.username && <p className="text-red-500">{state.errors.username}</p>}

      <input
        className="m-[8] rounded-sm border border-gray-500 p-2"
        name="email"
        required
        type="email"
        placeholder="you@example.com"
      />
      {state?.errors?.email && <p className="text-red-500">{state.errors.email[0]}</p>}
      <div className="m-[8] flex items-center gap-2 rounded-sm border border-gray-500 p-2">
        <input
          className="w-full outline-none"
          name="password"
          required
          type={showPassword ? "text" : "password"}
          placeholder="Password"
        />
        <button type="button" className="text-sm text-blue-500" onClick={() => setShowPassword((prev) => !prev)}>
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
      {state?.errors?.password && (
        <div>
          <p>Password must:</p>
          <ul>
            {state.errors.password.map((err, index) => (
              <li key={index} className="text-red-500">
                {err}
              </li>
            ))}
          </ul>
        </div>
      )}
      <button className="rounded-l bg-blue-500 p-3 text-white" type="submit" disabled={isPending}>
        Sign Up
      </button>
      <button>Already have an account?</button>
    </form>
  );
}