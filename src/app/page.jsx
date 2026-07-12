import "./globals.css";

export const metadata = {
  title: "Sleep on it! | Study Smarter",
  description: "The best productive learning app on the market",
};

import Link from "next/link";
import {
  BookOpen,
  Timer,
  Brain,
  Moon,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f8f7f2] text-gray-800">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-6">
        <h1 className="text-3xl font-bold text-blue-600">
          Sleep-On-It
        </h1>

        <div className="flex gap-8 font-medium text-gray-600">
          <Link href="#features">Features</Link>
          <Link href="#workflow">Workflow</Link>
          <Link href="/login">Login</Link>
        </div>

        <Link
          href="/signup"
          className="rounded-xl bg-orange-500 px-6 py-3 text-white"
        >
          Get Started
        </Link>
      </nav>


      {/* Hero */}
      <section className="grid grid-cols-1 gap-10 px-10 py-16 md:grid-cols-2">

        <div className="flex flex-col justify-center">

          <p className="mb-4 flex items-center gap-2 text-blue-600">
            <Sparkles size={18}/>
            Smart Learning Workspace
          </p>

          <h1 className="text-6xl font-bold leading-tight">
            Study.
            <span className="text-blue-600">
              Focus.
            </span>
            <br/>
            Remember.
          </h1>


          <p className="mt-6 max-w-lg text-lg text-gray-600">
            Combine Cornell Notes, Pomodoro sessions and AI summaries
            to create a smarter learning routine.
          </p>


          <div className="mt-8 flex gap-5">

            <Link
              href="/signup"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-white"
            >
              Start Learning
              <ArrowRight size={18}/>
            </Link>


            <Link
              href="/demo"
              className="rounded-xl border px-8 py-4"
            >
              Demo
            </Link>

          </div>

        </div>



        {/* Workspace Preview */}
        <div className="rounded-3xl bg-white p-6 shadow-xl">

          <div className="mb-5 flex justify-between">
            <h2 className="font-bold">
              Study Workspace
            </h2>

            <span className="rounded-lg bg-blue-100 px-3 py-1 text-blue-600">
              Today
            </span>
          </div>


          {/* AI Summary */}
          <div className="rounded-2xl bg-[#f1f7ff] p-6">

            <div className="flex items-center gap-3">
              <Brain className="text-blue-600"/>
              <h3 className="text-xl font-bold">
                AI Note Summary
              </h3>
            </div>


            <p className="mt-3 text-gray-600">
              Review your notes, extract key points,
              and prepare for revision.
            </p>

          </div>



          {/* Pomodoro */}
          <div className="mt-5 rounded-2xl bg-orange-50 p-6">

            <div className="flex items-center gap-3">
              <Timer className="text-orange-500"/>
              <h3 className="font-bold">
                Pomodoro Session
              </h3>
            </div>


            <div className="mt-5 text-center">

              <p className="text-6xl font-bold text-orange-500">
                25:00
              </p>

              <button className="mt-5 rounded-xl bg-orange-500 px-10 py-3 text-white">
                Start
              </button>

            </div>

          </div>

        </div>

      </section>



      {/* Features */}
      <section
        id="features"
        className="px-10 py-20"
      >

        <h2 className="text-center text-4xl font-bold">
          Your Complete Study Desk
        </h2>


        <div className="mt-12 grid gap-8 md:grid-cols-4">


          <Feature
            icon={<BookOpen/>}
            title="Cornell Notes"
            text="Create structured notes and organize concepts."
          />


          <Feature
            icon={<Timer/>}
            title="Pomodoro"
            text="Focus with productive study sessions."
          />


          <Feature
            icon={<Brain/>}
            title="AI Summary"
            text="Generate quick revision material."
          />


          <Feature
            icon={<Moon/>}
            title="Sleep Review"
            text="Revisit knowledge after rest."
          />


        </div>

      </section>



      {/* Workflow */}
      <section
        id="workflow"
        className="bg-blue-600 px-10 py-20 text-white"
      >

        <h2 className="text-center text-4xl font-bold">
          How Sleep-On-It Works
        </h2>


        <div className="mt-12 grid gap-6 md:grid-cols-3">


          {
            [
              "Write your notes",
              "Focus using Pomodoro",
              "Review after sleep"
            ].map((item,index)=>(
              <div
                key={item}
                className="rounded-2xl bg-white/10 p-8 text-center"
              >

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-blue-600">
                  {index+1}
                </div>

                <h3 className="mt-5 text-xl font-bold">
                  {item}
                </h3>

              </div>
            ))
          }


        </div>

      </section>



      {/* Footer */}
      <footer className="py-8 text-center text-gray-500">
        © 2026 Sleep-On-It
      </footer>


    </main>
  );
}



function Feature({icon,title,text}){

  return (

    <div className="rounded-3xl bg-white p-8 shadow-sm transition hover:-translate-y-2">

      <div className="mb-5 text-blue-600">
        {icon}
      </div>


      <h3 className="text-xl font-bold">
        {title}
      </h3>


      <p className="mt-3 text-gray-600">
        {text}
      </p>

    </div>

  );
}