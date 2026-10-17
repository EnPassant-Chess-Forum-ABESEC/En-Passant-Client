"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/lib/api";
import { CheckCircle2 } from "lucide-react";
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
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProfile();
  }, []);

  const saveProfileData = async () => {
    const sanitizedCollegeEmail = collegeEmail.trim().toLowerCase();
    const sanitizedPhone = phoneNumber.replace(/\D/g, "");

    if (!profile?.isOnboardingComplete) {
      if (!branch || !year || !sanitizedCollegeEmail || !sanitizedPhone) {
        setError(
          "Please fill out all details above before linking your account.",
        );
        return false;
      }
    }

    if (sanitizedCollegeEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
      if (
        !emailRegex.test(sanitizedCollegeEmail) ||
        !sanitizedCollegeEmail.endsWith("@abes.ac.in")
      ) {
        setError("Invalid college email. Must be a valid @abes.ac.in address.");
        return false;
      }
    }

    if (sanitizedPhone && sanitizedPhone.length !== 10) {
      setError("Phone number must be exactly 10 digits.");
      return false;
    }

    const endpoint = profile?.isOnboardingComplete
      ? "/users/me"
      : "/users/onboard";
    const method = profile?.isOnboardingComplete ? "PUT" : "POST";
    const body = {
      branch,
      year: parseInt(year),
      collegeEmail: sanitizedCollegeEmail,
      phoneNumber: sanitizedPhone,
    };

    const data = await fetchApi(endpoint, { method, body });
    return data.success;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      const isSaved = await saveProfileData();
      if (isSaved) {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = window.location.pathname;
        }, 1000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLinkChesscom = async () => {
    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      const isSaved = await saveProfileData();
      if (!isSaved) {
        setSaving(false);
        return;
      }

      const res = await fetchApi("/auth/chesscom/login", { method: "POST" });
      if (res.authorizeUrl) {
        window.location.href = res.authorizeUrl;
      }
    } catch (err) {
      setError(err.message || "Failed to initiate Chess.com linking.");
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
            <Select
              value={branch}
              onValueChange={setBranch}
              required={!profile?.isOnboardingComplete}
            >
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
            Chess.com Account
          </label>
          <div className="flex items-center justify-between w-full bg-white/5 border border-white/15 rounded-md px-3 py-2 text-sm text-white">
            <div className="flex items-center gap-2">
              <span
                className={
                  profile?.chessAccounts?.chessCom?.username
                    ? "text-white font-medium"
                    : "text-white/40"
                }
              >
                {profile?.chessAccounts?.chessCom?.username
                  ? `@${profile.chessAccounts.chessCom.username}`
                  : "Not linked yet"}
              </span>
              {profile?.chessAccounts?.chessCom?.username &&
                (profile?.chessAccounts?.chessCom?.verified ? (
                  <CheckCircle2
                    size={13}
                    className="text-emerald-400 fill-emerald-400/20 shrink-0"
                    title="Verified Chess.com Account"
                  />
                ) : (
                  <span className="text-[9px] font-mono font-medium text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-full">
                    Unverified
                  </span>
                ))}
            </div>
            <button
              type="button"
              onClick={handleLinkChesscom}
              disabled={saving}
              className="text-xs font-medium px-3 py-1 rounded-md bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {profile?.chessAccounts?.chessCom?.username
                ? profile?.chessAccounts?.chessCom?.verified
                  ? "Update"
                  : "Verify Account"
                : "Link"}
            </button>
          </div>
          <p className="text-[10px] text-white/30 mt-1">
            Linking will auto-save your details above before redirecting you
            securely to Chess.com.
          </p>
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
