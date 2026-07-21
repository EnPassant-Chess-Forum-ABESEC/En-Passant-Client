"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/lib/api";
import { UserButton, useUser } from "@clerk/nextjs";

export default function ProfilePage() {
  const { isLoaded, user: clerkUser } = useUser();
  const fetchApi = useApi();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Onboard Form state
  const [branch, setBranch] = useState("CSE");
  const [year, setYear] = useState(1);
  const [chessComUsername, setChessComUsername] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      loadProfile();
    }
  }, [isLoaded]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await fetchApi("/users/me");
      if (data.success) {
        setProfile(data.user);
        // Pre-fill forms
        if (data.user) {
          setBranch(data.user.branch || "CSE");
          setYear(data.user.year || 1);
          setChessComUsername(data.user.chessAccounts?.chessCom?.username || "");
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOnboard = async (e) => {
    e.preventDefault();
    try {
      const data = await fetchApi("/users/onboard", {
        method: "POST",
        body: {
          branch,
          year: parseInt(year),
          chessAccounts: {
            chessCom: { username: chessComUsername },
          },
        },
      });
      if (data.success) {
        loadProfile();
      }
    } catch (err) {
      alert("Error onboarding: " + err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        branch,
        year: parseInt(year),
      };
      if (chessComUsername) {
        payload.chessAccounts = { chessCom: { username: chessComUsername } };
      }

      const data = await fetchApi("/users/me", {
        method: "PUT",
        body: payload
      });
      if (data.success) {
        setIsEditing(false);
        loadProfile();
      }
    } catch (err) {
      alert("Error updating profile: " + err.message);
    }
  };

  if (!isLoaded || loading) {
    return <div className="p-8 mt-24">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto w-full p-8 mt-24 font-sans bg-[#111]">
      <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
        <h1 className="text-3xl font-bold uppercase tracking-widest text-white">Profile Dashboard</h1>
        <UserButton afterSignOutUrl="/" />
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {profile && !isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-[#1a1a1a] p-6 border border-white/10 rounded-sm relative">
            {profile.isOnboardingComplete && (
               <button onClick={() => setIsEditing(true)} className="absolute top-6 right-6 text-xs uppercase text-white/50 hover:text-white tracking-widest font-bold">Edit</button>
            )}
            <h2 className="text-xl font-bold uppercase text-[#9b1a1a] mb-4">User Info</h2>
            <div className="space-y-2 text-white/80">
              <p><span className="font-bold text-white/50 w-32 inline-block">Role:</span> {profile.role}</p>
              <p><span className="font-bold text-white/50 w-32 inline-block">Username:</span> {profile.userName}</p>
              <p><span className="font-bold text-white/50 w-32 inline-block">Email:</span> {profile.collegeEmail}</p>
              <p><span className="font-bold text-white/50 w-32 inline-block">Branch/Year:</span> {profile.branch || "N/A"} - {profile.year ? `Year ${profile.year}` : "N/A"}</p>
              <p><span className="font-bold text-white/50 w-32 inline-block">Onboarded:</span> {profile.isOnboardingComplete ? "Yes" : "No"}</p>
            </div>
          </div>

          <div className="bg-[#1a1a1a] p-6 border border-white/10 rounded-sm">
            <h2 className="text-xl font-bold uppercase text-[#9b1a1a] mb-4">Chess Accounts</h2>
            {profile.chessAccounts?.chessCom ? (
              <div className="space-y-2 text-white/80">
                <p><span className="font-bold text-white/50">Chess.com:</span> {profile.chessAccounts.chessCom.username}</p>
                <div className="flex gap-4 mt-2">
                  <div className="bg-white/5 px-3 py-1 text-sm">Rapid: {profile.chessAccounts.chessCom.ratings?.rapid || "N/A"}</div>
                  <div className="bg-white/5 px-3 py-1 text-sm">Blitz: {profile.chessAccounts.chessCom.ratings?.blitz || "N/A"}</div>
                </div>
              </div>
            ) : (
              <p className="text-white/40">No Chess.com account linked.</p>
            )}
          </div>
        </div>
      )}

      {profile && isEditing && (
        <div className="bg-[#1a1a1a] p-6 border border-white/10 rounded-sm mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold uppercase text-white">Edit Profile</h2>
            <button onClick={() => setIsEditing(false)} className="text-xs uppercase text-white/50 hover:text-white">Cancel</button>
          </div>
          <form onSubmit={handleUpdate} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm text-white/60 uppercase mb-1">Branch</label>
              <input 
                type="text" 
                value={branch} 
                onChange={e => setBranch(e.target.value)}
                className="w-full bg-[#222] border border-white/20 p-2 text-white focus:outline-none focus:border-[#9b1a1a]"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 uppercase mb-1">Year</label>
              <input 
                type="number" 
                min="1" max="4"
                value={year} 
                onChange={e => setYear(e.target.value)}
                className="w-full bg-[#222] border border-white/20 p-2 text-white focus:outline-none focus:border-[#9b1a1a]"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 uppercase mb-1">Chess.com Username</label>
              <input 
                type="text" 
                value={chessComUsername} 
                onChange={e => setChessComUsername(e.target.value)}
                className="w-full bg-[#222] border border-white/20 p-2 text-white focus:outline-none focus:border-[#9b1a1a]"
              />
            </div>
            <button type="submit" className="bg-[#9b1a1a] text-white uppercase font-bold tracking-widest px-6 py-2 hover:bg-red-800 transition">
              Update Profile
            </button>
          </form>
        </div>
      )}

      {profile && !profile.isOnboardingComplete && (
        <div className="mt-8 bg-[#1a1a1a] p-6 border border-white/10 rounded-sm">
          <h2 className="text-xl font-bold uppercase text-white mb-4">Complete Onboarding</h2>
          <form onSubmit={handleOnboard} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm text-white/60 uppercase mb-1">Branch</label>
              <input 
                type="text" 
                value={branch} 
                onChange={e => setBranch(e.target.value)}
                className="w-full bg-[#222] border border-white/20 p-2 text-white focus:outline-none focus:border-[#9b1a1a]"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 uppercase mb-1">Year</label>
              <input 
                type="number" 
                min="1" max="4"
                value={year} 
                onChange={e => setYear(e.target.value)}
                className="w-full bg-[#222] border border-white/20 p-2 text-white focus:outline-none focus:border-[#9b1a1a]"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 uppercase mb-1">Chess.com Username</label>
              <input 
                type="text" 
                value={chessComUsername} 
                onChange={e => setChessComUsername(e.target.value)}
                className="w-full bg-[#222] border border-white/20 p-2 text-white focus:outline-none focus:border-[#9b1a1a]"
              />
            </div>
            <button type="submit" className="bg-[#9b1a1a] text-white uppercase font-bold tracking-widest px-6 py-2 hover:bg-red-800 transition">
              Save Profile
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
