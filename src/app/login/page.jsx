"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, NotebookText, Sparkles, UserRound } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/modal";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, title: "", message: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const identifier = formData.get("username");
    const password = formData.get("password");

    const res = await signIn("credentials", {
      identifier,
      password,
      redirect: false,
    });

    if (!res?.error) {
      router.push("/home");
      return;
    }

    setModalState({
      isOpen: true,
      title: "Sign in failed",
      message: "We couldn't log you in. Please check your credentials and try again.",
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.18),_transparent_35%),linear-gradient(135deg,_#f8f5ff_0%,_#eef4ff_100%)] px-4 py-10">
      <div className="w-full max-w-5xl overflow-hidden rounded-[32px] border border-violet-100 bg-white shadow-[0_30px_100px_-30px_rgba(139,92,246,0.35)]">
        <div className="grid md:grid-cols-[1.02fr_0.98fr]">
          <div className="hidden bg-[linear-gradient(135deg,_#4c1d95_0%,_#7c3aed_50%,_#38bdf8_100%)] p-10 text-white md:flex md:flex-col md:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-semibold">
                <Sparkles size={16} />
                Sleep on it
              </div>
              <h1 className="text-3xl font-semibold">Welcome back to your desk.</h1>
              <p className="mt-3 max-w-md text-sm leading-7 text-violet-100">
                Pick up your notes, open your books, and keep your study flow moving in one calm workspace.
              </p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-sm text-violet-50">
              <div className="mb-3 flex items-center gap-2 font-semibold">
                <NotebookText size={18} />
                Desk features
              </div>
              <ul className="space-y-2 text-sm text-violet-100">
                <li>• Create structured Cornell notes</li>
                <li>• Keep books and notes organized</li>
                <li>• Continue learning without breaking momentum</li>
              </ul>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col justify-center gap-4 bg-white p-8 md:p-10">
            <div className="text-center md:text-left">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">Sign in</p>
              <h2 className="mt-2 text-3xl font-semibold text-stone-800">Log in to continue</h2>
              <p className="mt-2 text-sm text-stone-500">Enter your credentials and head back to the desk.</p>
            </div>

            <label className="rounded-2xl border border-stone-200 bg-stone-50 p-3 shadow-sm">
              <span className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-600">
                <UserRound size={16} /> Username or email
              </span>
              <input
                className="w-full bg-transparent text-sm outline-none"
                name="username"
                placeholder="you@example.com"
                type="text"
              />
            </label>

            <label className="rounded-2xl border border-stone-200 bg-stone-50 p-3 shadow-sm">
              <span className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-600">
                <Lock size={16} /> Password
              </span>
              <div className="flex items-center gap-2">
                <input
                  className="w-full bg-transparent text-sm outline-none"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="text-sm font-semibold text-violet-600"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            <button className="rounded-2xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700" type="submit">
              Sign In
            </button>

            <p className="text-center text-sm text-stone-500">
              New here?{' '}
              <Link href="/signup" className="font-semibold text-violet-600 hover:text-violet-700">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>

      <Modal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, title: "", message: "" })}
        title={modalState.title}
        message={modalState.message}
        type="error"
      />
    </div>
  );
}