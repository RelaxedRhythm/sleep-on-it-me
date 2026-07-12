import "./globals.css";

export const metadata = {
  title: "Sleep on it! | Login",
  description: "The best productive learning app on the market",
};

import Link from "next/link";
import {
  Brain,
  BookOpen,
  Timer,
  Moon,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            Sleep-On-It
          </Link>

          <div className="hidden gap-8 md:flex">
            <a href="#features">Features</a>
            <a href="#how">How It Works</a>
            <a href="#about">About</a>
          </div>

          <div className="flex gap-3">
            <Link
              href="/login"
              className="rounded-lg border px-5 py-2 hover:bg-gray-100"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center">
        <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-600">
          Productivity • Cornell Notes • Pomodoro
        </span>

        <h1 className="mt-8 max-w-4xl text-5xl font-extrabold leading-tight md:text-7xl">
          Study Smarter.
          <span className="text-indigo-600"> Focus Better.</span>
          <br />
          Sleep On It.
        </h1>

        <p className="mt-8 max-w-2xl text-lg text-gray-600">
          Organize your notes using the Cornell Method, stay focused with the
          Pomodoro Timer, and revisit your work after quality sleep for better
          retention.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-5">
          <Link
            href="/signup"
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-8 py-4 text-white hover:bg-indigo-700"
          >
            Start Studying
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/demo"
            className="rounded-lg border px-8 py-4 hover:bg-gray-100"
          >
            Live Demo
          </Link>
        </div>

        {/* Stats */}

        <div className="mt-20 grid w-full max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
          {[
            ["Pomodoro", "25 Min"],
            ["Cornell", "Smart Notes"],
            ["Books", "Unlimited"],
            ["Progress", "Tracked"],
          ].map(([title, value]) => (
            <div
              key={title}
              className="rounded-xl border bg-white p-6 shadow-sm"
            >
              <h2 className="text-3xl font-bold text-indigo-600">{value}</h2>
              <p className="mt-2 text-gray-500">{title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}

      <section id="features" className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-4xl font-bold">
            Everything You Need To Stay Productive
          </h2>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<BookOpen size={35} />}
              title="Cornell Notes"
              desc="Capture notes efficiently with cue, notes, and summary sections."
            />

            <FeatureCard
              icon={<Timer size={35} />}
              title="Pomodoro Timer"
              desc="Stay focused with structured study sessions and short breaks."
            />

            <FeatureCard
              icon={<Brain size={35} />}
              title="Smart Revision"
              desc="Revisit your notes after sleep to improve memory retention."
            />

            <FeatureCard
              icon={<Moon size={35} />}
              title="Sleep Tracking"
              desc="Record study sessions and reflect after a night's sleep."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}

      <section id="how" className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="text-center text-4xl font-bold">
          How Sleep-On-It Works
        </h2>

        <div className="mt-16 grid gap-10 md:grid-cols-3">
          <Step
            number="1"
            title="Create Notes"
            desc="Organize your ideas using Cornell note-taking."
          />

          <Step
            number="2"
            title="Study With Pomodoro"
            desc="Complete focused study cycles while tracking progress."
          />

          <Step
            number="3"
            title="Review Tomorrow"
            desc="Revisit your notes after sleep for stronger long-term memory."
          />
        </div>
      </section>

      {/* Benefits */}

      <section id="about" className="bg-indigo-600 py-24 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-4xl font-bold">
            Why Students Love Sleep-On-It
          </h2>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {[
              "Reduce procrastination",
              "Improve memory retention",
              "Structured Cornell Notes",
              "Focus using Pomodoro",
              "Track study progress",
              "Clean and distraction-free interface",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-xl bg-white/10 p-5"
              >
                <CheckCircle />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="py-24">
        <div className="mx-auto max-w-4xl rounded-3xl bg-indigo-600 px-10 py-16 text-center text-white">
          <h2 className="text-4xl font-bold">
            Ready To Transform Your Study Sessions?
          </h2>

          <p className="mt-5 text-lg text-indigo-100">
            Join students who combine effective note-taking, focused study, and
            smarter revision.
          </p>

          <Link
            href="/signup"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-4 font-semibold text-indigo-600"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}

      <footer className="border-t py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-6 text-gray-500 md:flex-row">
          <p>© 2026 Sleep-On-It</p>

          <div className="flex gap-6">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow transition hover:-translate-y-2 hover:shadow-lg">
      <div className="mb-6 text-indigo-600">{icon}</div>

      <h3 className="text-xl font-bold">{title}</h3>

      <p className="mt-3 text-gray-600">{desc}</p>
    </div>
  );
}

function Step(number,title,desc) {
  return (
    <div className="rounded-xl border p-8 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-2xl font-bold text-white">
        {number}
      </div>

      <h3 className="mt-6 text-2xl font-semibold">{title}</h3>

      <p className="mt-3 text-gray-600">{desc}</p>
    </div>
  );
}