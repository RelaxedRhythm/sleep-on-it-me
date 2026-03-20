"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function Login() {

  const router=useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const identifier=formData.get("username");
    const password=formData.get("password");
    
    const res= await signIn("credentials",{
      identifier,
      password,
      redirect:false,
     
    });

    if(!res?.error){
      router.push("/home");
    }
    else{
      alert("Invalid username or password",res.error);
    }

    
  }


  return (
    <form
      onSubmit={handleSubmit}
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