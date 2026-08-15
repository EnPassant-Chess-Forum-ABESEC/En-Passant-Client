"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BRANCH_OPTIONS = [
  "BCA",
  "MCA",
  "CSE",
  "CS",
  "CE",
  "CSE-AIML",
  "CSE-DS",
  "ELCE",
  "EN",
  "ME",
  "ECE",
  "IT",
  "MBA",
];

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
  const [phoneNumber, setPhoneNumber] = useState("");
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
        setPhoneNumber(data.user.phoneNumber || "");
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

    const sanitizedCollegeEmail = collegeEmail.trim().toLowerCase();

    if (
      sanitizedCollegeEmail &&
      !sanitizedCollegeEmail.endsWith("@abes.ac.in")
    ) {
      setError("College email must end with @abes.ac.in");
      setSaving(false);
      return;
    }

    try {
      const endpoint = profile?.isOnboardingComplete
        ? "/users/me"
        : "/users/onboard";
      const method = profile?.isOnboardingComplete ? "PUT" : "POST";
      const body = {
        branch,
        year: parseInt(year),
        collegeEmail: sanitizedCollegeEmail,
        phoneNumber: phoneNumber.trim(),
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
            <Select value={branch} onValueChange={setBranch} required={!profile?.isOnboardingComplete}>
              <SelectTrigger className="w-full bg-white/5 border border-white/15 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c21818]/70 focus:ring-1 focus:ring-[#c21818]/30">
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent className="bg-[#111] border-white/10 text-white max-h-40 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {BRANCH_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt}
                    value={opt}
                    className="focus:bg-[#c21818]/20 focus:text-white"
                  >
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-white/50">
              Year
            </label>
            <Select
              value={String(year)}
              onValueChange={(val) => setYear(Number(val))}
              required={!profile?.isOnboardingComplete}
            >
              <SelectTrigger className="w-full bg-white/5 border border-white/15 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c21818]/70 focus:ring-1 focus:ring-[#c21818]/30">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent className="bg-[#111] border-white/10 text-white">
                <SelectItem
                  value="1"
                  className="focus:bg-[#c21818]/20 focus:text-white"
                >
                  1st Year
                </SelectItem>
                <SelectItem
                  value="2"
                  className="focus:bg-[#c21818]/20 focus:text-white"
                >
                  2nd Year
                </SelectItem>
                <SelectItem
                  value="3"
                  className="focus:bg-[#c21818]/20 focus:text-white"
                >
                  3rd Year
                </SelectItem>
                <SelectItem
                  value="4"
                  className="focus:bg-[#c21818]/20 focus:text-white"
                >
                  4th Year
                </SelectItem>
                <SelectItem
                  value="5"
                  className="focus:bg-[#c21818]/20 focus:text-white"
                >
                  Passed
                </SelectItem>
              </SelectContent>
            </Select>
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
            required={!profile?.isOnboardingComplete}
            className="w-full bg-white/5 border border-white/15 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#c21818]/70 focus:ring-1 focus:ring-[#c21818]/30"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-white/50">
            Phone Number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+91..."
            required={!profile?.isOnboardingComplete}
            className="w-full bg-white/5 border border-white/15 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#c21818]/70 focus:ring-1 focus:ring-[#c21818]/30"
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
            className="w-full bg-white/5 border border-white/15 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#c21818]/70 focus:ring-1 focus:ring-[#c21818]/30"
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
