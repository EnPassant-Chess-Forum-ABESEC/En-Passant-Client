"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/lib/api";

export default function CustomProfileForm() {
  const fetchApi = useApi();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [branch, setBranch] = useState("");
  const [year, setYear] = useState(1);
  const [collegeEmail, setCollegeEmail] = useState("");
  const [chessComUsername, setChessComUsername] = useState("");

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await fetchApi("/users/me");
      if (data.success && data.user) {
        setProfile(data.user);
        setBranch(data.user.branch || "CSE");
        setYear(data.user.year || 1);
        setCollegeEmail(data.user.collegeEmail || "");
        setChessComUsername(data.user.chessAccounts?.chessCom?.username || "");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);
    try {
      const endpoint = profile?.isOnboardingComplete
        ? "/users/me"
        : "/users/onboard";
      const method = profile?.isOnboardingComplete ? "PUT" : "POST";
      const body = {
        branch,
        year: parseInt(year),
        collegeEmail,
        chessAccounts: { chessCom: { username: chessComUsername } },
      };

      const data = await fetchApi(endpoint, { method, body });
      if (data.success) {
        setSuccess(true);
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center text-white/40 text-sm">
        Loading your details...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-lg">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">
          En Passant Details
        </h2>
        <p className="text-sm text-white/50">
          Update your club specific information.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 text-red-400 text-sm rounded-md border border-red-500/20">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-500/10 text-green-400 text-sm rounded-md border border-green-500/20">
          Profile updated successfully! Refreshing...
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-white/50">
              Branch
            </label>
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="e.g. CSE"
              required
              className="w-full bg-white/5 border border-white/15 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#c21818]/70 focus:ring-1 focus:ring-[#c21818]/30"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-white/50">
              Year
            </label>
            <input
              type="number"
              min="1"
              max="4"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/15 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#c21818]/70 focus:ring-1 focus:ring-[#c21818]/30"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-white/50">
            College Email
          </label>
          <input
            type="email"
            value={collegeEmail}
            onChange={(e) => setCollegeEmail(e.target.value)}
            placeholder="name.admNo@abes.ac.in"
            required
            className="w-full bg-white/5 border border-white/15 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#c21818]/70 focus:ring-1 focus:ring-[#c21818]/30 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-white/50">
            Chess.com Username
          </label>
          <input
            type="text"
            value={chessComUsername}
            onChange={(e) => setChessComUsername(e.target.value)}
            placeholder="Username"
            className="w-full bg-white/5 border border-white/15 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#c21818]/70 focus:ring-1 focus:ring-[#c21818]/30 transition-all"
          />
        </div>

        <div className="pt-4 border-t border-white/[0.06] flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#c21818] text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-[#ff3333] transition-colors disabled:opacity-50 shadow-[0_2px_8px_rgba(194,24,24,0.15)]"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
