"use client";
import "../../globals.css"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import StudyHeatmap from "@/components/StudyHeatmap";

function Welcome() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [dashboardData, setDashboardData] = useState({
    stats: { streak: 0, topics: 0, studyTime: 0, notesCount: 0 },
    recentActivity: [],
    notebooks: []
  });

  

  useEffect(() => {
    if (status === "authenticated") {
      fetch('/api/dashboard')
        .then(res => res.json())
        .then(data => setDashboardData(data))
        .catch(err => console.error('Error fetching dashboard data:', err));
    }
  }, [status]);

  if (status === "loading") return <p>Loading...</p>;

  const { stats, recentActivity, notebooks } = dashboardData;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,116,144,0.15),_transparent_40%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_100%)] p-6 text-stone-700">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="rounded-3xl border border-sky-100 bg-white/80 p-8 shadow-[0_20px_70px_-28px_rgba(2,132,199,0.35)] backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700">
                <Sparkles size={16} />
                Your learning command center
              </div>
              <h1 className="text-4xl font-bold text-stone-800">
                Welcome {session?.user?.fname} 👋
              </h1>
              <p className="mt-2 text-lg text-stone-600">
                Pick up where you left off or jump into fresh study sessions.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/desk")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-5 py-3 font-semibold text-white transition hover:bg-sky-700"
            >
              Continue Learning
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-orange-100 bg-white p-6 text-center shadow-sm">
            <div className="mb-2 text-3xl">🔥</div>
            <div className="text-2xl font-bold text-stone-800">{stats.streak}</div>
            <div className="text-stone-600">Day Streak</div>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-white p-6 text-center shadow-sm">
            <div className="mb-2 text-3xl">📚</div>
            <div className="text-2xl font-bold text-stone-800">{stats.topics}</div>
            <div className="text-stone-600">Topics</div>
          </div>
          <div className="rounded-2xl border border-violet-100 bg-white p-6 text-center shadow-sm">
            <div className="mb-2 text-3xl">⏱</div>
            <div className="text-2xl font-bold text-stone-800">{stats.studyTime}h</div>
            <div className="text-stone-600">Study Time</div>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 text-center shadow-sm">
            <div className="mb-2 text-3xl">📝</div>
            <div className="text-2xl font-bold text-stone-800">{stats.notesCount}</div>
            <div className="text-stone-600">Notes</div>
          </div>
        </div>

        <StudyHeatmap data={dashboardData.studyHeatmap} />

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-stone-800">Recent Activity</h2>
            <ul className="space-y-3">
              {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                <li key={index} className="rounded-2xl bg-stone-50 px-4 py-3 text-stone-600">
                  Added note “{activity.title}” to “{activity.book}” — {new Date(activity.date).toLocaleDateString()}
                </li>
              )) : (
                <li className="rounded-2xl bg-stone-50 px-4 py-3 text-stone-600">No recent activity</li>
              )}
            </ul>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-stone-800">Your Notebooks</h2>
            <div className="space-y-3">
              {notebooks.length > 0 ? notebooks.map((notebook) => (
                <div key={notebook.id} className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
                  <h3 className="font-semibold text-stone-800">{notebook.title}</h3>
                  <p className="mt-1 text-sm text-stone-600">Last edited: {new Date(notebook.lastEdited).toLocaleDateString()}</p>
                </div>
              )) : (
                <div className="rounded-2xl border border-dashed border-stone-200 p-4 text-center text-stone-600">No notebooks yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
