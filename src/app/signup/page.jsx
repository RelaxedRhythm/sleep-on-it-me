"use client";

import { signup } from "../../library/actions";
import { Eye, EyeOff, Lock, Sparkles, UserRound } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import Modal from "@/components/ui/modal";

export default function SignUp() {
  const [state, action, isPending] = useActionState(signup, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, title: "", message: "" });

  useEffect(() => {
    if (!state?.errors) return;

    const messages = Object.values(state.errors)
      .flatMap((value) => value)
      .filter(Boolean);

    if (messages.length) {
      setModalState({
        isOpen: true,
        title: "Please fix a few things",
        message: messages.join(" "),
      });
    }
  }, [state]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(14,116,144,0.2),_transparent_35%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_100%)] px-4 py-10">
      <div className="w-full max-w-5xl overflow-hidden rounded-[32px] border border-sky-100 bg-white shadow-[0_30px_100px_-30px_rgba(2,132,199,0.4)]">
        <div className="grid md:grid-cols-[1.05fr_0.95fr]">
          <div className="hidden bg-[linear-gradient(135deg,_#0f172a_0%,_#2563eb_55%,_#38bdf8_100%)] p-10 text-white md:flex md:flex-col md:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-semibold">
                <Sparkles size={16} />
                Sleep on it
              </div>
              <h1 className="text-3xl font-semibold">Create your calm study space.</h1>
              <p className="mt-3 max-w-md text-sm leading-7 text-sky-100">
                Sign up to keep books, notes, and study sessions all in one beautifully simple workspace.
              </p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-sm text-sky-50">
              <p className="font-semibold">What you get</p>
              <ul className="mt-2 space-y-2 text-sm text-sky-100">
                <li>• A personal desk for every subject</li>
                <li>• Fast note capture with key/value pairs</li>
                <li>• A dashboard that keeps you moving forward</li>
              </ul>
            </div>
          </div>

          <form action={action} className="flex flex-col justify-center gap-4 bg-white p-8 md:p-10">
            <div className="text-center md:text-left">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Create account</p>
              <h2 className="mt-2 text-3xl font-semibold text-stone-800">Start your learning journey</h2>
              <p className="mt-2 text-sm text-stone-500">Set up a free account and bring your notes into one focused workspace.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="rounded-2xl border border-stone-200 bg-stone-50 p-3 shadow-sm">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-600">
                  <UserRound size={16} /> First name
                </span>
                <input className="w-full bg-transparent text-sm outline-none" placeholder="First Name" required name="fname" type="text" />
              </label>
              <label className="rounded-2xl border border-stone-200 bg-stone-50 p-3 shadow-sm">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-600">
                  <UserRound size={16} /> Last name
                </span>
                <input className="w-full bg-transparent text-sm outline-none" name="lname" required type="text" placeholder="Last Name" />
              </label>
            </div>

            <label className="rounded-2xl border border-stone-200 bg-stone-50 p-3 shadow-sm">
              <span className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-600">
                <UserRound size={16} /> Username
              </span>
              <input className="w-full bg-transparent text-sm outline-none" name="username" required type="text" placeholder="username" />
            </label>

            <label className="rounded-2xl border border-stone-200 bg-stone-50 p-3 shadow-sm">
              <span className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-600">
                <UserRound size={16} /> Email
              </span>
              <input className="w-full bg-transparent text-sm outline-none" name="email" required type="email" placeholder="you@example.com" />
            </label>

            <label className="rounded-2xl border border-stone-200 bg-stone-50 p-3 shadow-sm">
              <span className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-600">
                <Lock size={16} /> Password
              </span>
              <div className="flex items-center gap-2">
                <input className="w-full bg-transparent text-sm outline-none" name="password" required type={showPassword ? "text" : "password"} placeholder="Create a password" />
                <button type="button" className="text-sm font-semibold text-sky-600" onClick={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            <button className="rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700" type="submit" disabled={isPending}>
              {isPending ? "Creating account..." : "Create account"}
            </button>

            <p className="text-center text-sm text-stone-500">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-sky-600 hover:text-sky-700">
                Sign in
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