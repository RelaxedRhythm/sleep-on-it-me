"use client";
import "../globals.css";

import {useSession} from "next-auth/react";
import { useEffect, useState } from "react";

function Profile() {

  const { data: session, status } = useSession();
  const [profileData, setProfileData] = useState({
    totalBooks: 0,
    totalNotes: 0,
    totalStudyTime: 0,
    joinDate: null
  });

  useEffect(() => {
    if (status === "authenticated") {
      fetch('/api/profile')
        .then(res => res.json())
        .then(data => setProfileData(data))
        .catch(err => console.error('Error fetching profile data:', err));
    }
  }, [status]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Profile Header */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {session?.user?.fname?.charAt(0)}{session?.user?.lname?.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {session?.user?.fname} {session?.user?.lname}
              </h1>
              <p className="text-gray-600">@{session?.user?.username}</p>
              <p className="text-gray-600">{session?.user?.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl mb-2">📚</div>
            <div className="text-2xl font-bold text-gray-800">{profileData.totalBooks}</div>
            <div className="text-gray-600">Total Books</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl mb-2">📝</div>
            <div className="text-2xl font-bold text-gray-800">{profileData.totalNotes}</div>
            <div className="text-gray-600">Total Notes</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl mb-2">⏱️</div>
            <div className="text-2xl font-bold text-gray-800">{profileData.totalStudyTime}h</div>
            <div className="text-gray-600">Total Study Time</div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <p className="mt-1 text-gray-900">{session?.user?.fname}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <p className="mt-1 text-gray-900">{session?.user?.lname}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <p className="mt-1 text-gray-900">@{session?.user?.username}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-gray-900">{session?.user?.email}</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Member Since</label>
              <p className="mt-1 text-gray-900">
                {profileData.joinDate ? new Date(profileData.joinDate).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;