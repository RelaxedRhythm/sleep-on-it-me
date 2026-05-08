"use client";
import "../globals.css";

import {useSession} from "next-auth/react";
import { useEffect, useState } from "react";
import StudyHeatmap from "@/components/StudyHeatmap";

function Welcome() {

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
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Welcome Section */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome {session?.user?.fname} 👋
        </h1>
        <p className="text-lg text-gray-600 mt-2">Your learning command center</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-3xl mb-2">🔥</div>
          <div className="text-2xl font-bold text-gray-800">{stats.streak}</div>
          <div className="text-gray-600">Day Streak</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-3xl mb-2">📚</div>
          <div className="text-2xl font-bold text-gray-800">{stats.topics}</div>
          <div className="text-gray-600">Topics</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-3xl mb-2">⏱</div>
          <div className="text-2xl font-bold text-gray-800">{stats.studyTime}h</div>
          <div className="text-gray-600">Study Time</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-3xl mb-2">📝</div>
          <div className="text-2xl font-bold text-gray-800">{stats.notesCount}</div>
          <div className="text-gray-600">Notes</div>
        </div>
      </div>
      <StudyHeatmap data={dashboardData.studyHeatmap} />

      {/* Buttons Section */}
      <div className="flex justify-center gap-4 mb-8">
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold">
          Continue Learning
        </button>
        <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold">
          AI Suggestions
        </button>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        <ul className="space-y-2">
          {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
            <li key={index} className="text-gray-600">
              Added note "{activity.title}" to "{activity.book}" - {new Date(activity.date).toLocaleDateString()}
            </li>
          )) : (
            <li className="text-gray-600">No recent activity</li>
          )}
        </ul>
      </div>

      {/* Your Notebooks */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Notebooks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {notebooks.length > 0 ? notebooks.map((notebook) => (
            <div key={notebook.id} className="border p-4 rounded-lg">
              <h3 className="font-semibold">{notebook.title}</h3>
              <p className="text-gray-600">Last edited: {new Date(notebook.lastEdited).toLocaleDateString()}</p>
            </div>
          )) : (
            <div className="col-span-3 text-center text-gray-600">No notebooks yet</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Welcome;
