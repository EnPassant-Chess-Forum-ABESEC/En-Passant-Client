"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/lib/api";
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";

/* ─── tiny helpers ─────────────────────────────────────── */
function Label({ children }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-1">
      {children}
    </p>
  );
}

function Value({ children }) {
  return (
    <p className="text-white/90 text-sm font-medium">{children || "—"}</p>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <Label>{label}</Label>
      <Value>{value}</Value>
    </div>
  );
}

function RatingBadge({ label, value }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-3 border border-white/10"
      style={{ background: "rgba(255,255,255,0.03)" }}>
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">{label}</span>
      <span className="text-2xl font-black text-white">{value ?? "—"}</span>
    </div>
  );
}

function FormInput({ label, type = "text", ...props }) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        type={type}
        {...props}
        className="w-full bg-transparent border border-white/15 px-4 py-3 text-white text-sm
                   focus:outline-none focus:border-[var(--brand-crimson)] transition-colors
                   placeholder:text-white/20"
      />
    </div>
  );
}

function SectionCard({ title, accent, action, children }) {
  return (
    <div className="relative border border-white/10 p-6 md:p-8"
      style={{ background: "rgba(255,255,255,0.03)" }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {accent && <div className="w-1 h-6" style={{ background: "var(--brand-crimson)" }} />}
          <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-white">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

/* ─── Main Page ────────────────────────────────────────── */
export default function ProfilePage() {
  const { isLoaded, user: clerkUser } = useUser();
  const fetchApi = useApi();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [branch, setBranch] = useState("CSE");
  const [year, setYear] = useState(1);
  const [chessComUsername, setChessComUsername] = useState("");

  useEffect(() => {
    if (isLoaded) loadProfile();
  }, [isLoaded]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await fetchApi("/users/me");
      if (data.success) {
        setProfile(data.user);
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

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const endpoint = profile?.isOnboardingComplete ? "/users/me" : "/users/onboard";
      const method = profile?.isOnboardingComplete ? "PUT" : "POST";
      const body = {
        branch,
        year: parseInt(year),
        chessAccounts: { chessCom: { username: chessComUsername } },
      };
      const data = await fetchApi(endpoint, { method, body });
      if (data.success) {
        setIsEditing(false);
        loadProfile();
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  /* ── loading / error states ───────────────────────────── */
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-white/10 border-t-[var(--brand-crimson)] rounded-full animate-spin" />
          <p className="text-white/30 text-xs uppercase tracking-widest">Loading profile…</p>
        </div>
      </div>
    );
  }

  const chess = profile?.chessAccounts?.chessCom;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">

      {/* ── Hero strip ──────────────────────────────────────── */}
      <div className="relative pt-32 pb-12 border-b border-white/10 overflow-hidden">
        {/* subtle diagonal grid bg */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 40px)",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end gap-6">

            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2"
                style={{ borderColor: "var(--brand-crimson)" }}>
                {clerkUser?.imageUrl ? (
                  <Image src={clerkUser.imageUrl} alt="avatar" width={96} height={96}
                    className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/5 text-3xl font-black text-white/20">
                    {clerkUser?.firstName?.[0] ?? "?"}
                  </div>
                )}
              </div>
              {/* Clerk UserButton sits on top as a small badge */}
              <div className="absolute -bottom-1 -right-1 scale-75">
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>

            {/* Name + meta */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
                  {clerkUser?.fullName ?? profile?.userName ?? "Player"}
                </h1>
                {profile?.role && (
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1"
                    style={{ background: "var(--brand-crimson)", color: "white" }}>
                    {profile.role}
                  </span>
                )}
              </div>
              <p className="text-white/40 text-sm tracking-wide">
                {profile?.collegeEmail ?? clerkUser?.primaryEmailAddress?.emailAddress}
              </p>

              {/* Onboarding status pill */}
              {profile && !profile.isOnboardingComplete && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 border border-amber-500/40 bg-amber-500/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-amber-400 text-[10px] font-bold uppercase tracking-widest">
                    Onboarding incomplete
                  </span>
                </div>
              )}
            </div>

            {/* Quick stats */}
            {chess && (
              <div className="flex gap-2 shrink-0">
                <RatingBadge label="Rapid" value={chess.ratings?.rapid} />
                <RatingBadge label="Blitz" value={chess.ratings?.blitz} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        {error && (
          <div className="mb-6 px-4 py-3 border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* View Mode */}
        {profile && !isEditing && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Account details */}
            <div className="md:col-span-2">
              <SectionCard
                title="Account Details"
                accent
                action={
                  profile.isOnboardingComplete && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-[10px] uppercase tracking-widest font-bold text-white/30
                                 hover:text-white transition-colors border border-white/10
                                 hover:border-white/30 px-3 py-1.5"
                    >
                      Edit
                    </button>
                  )
                }
              >
                <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                  <Field label="Username" value={profile.userName} />
                  <Field label="Role" value={profile.role} />
                  <Field label="Branch" value={profile.branch} />
                  <Field label="Year" value={profile.year ? `Year ${profile.year}` : null} />
                  <div className="col-span-2">
                    <Field label="College Email" value={profile.collegeEmail} />
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* Chess Accounts */}
            <SectionCard title="Chess Accounts" accent>
              {chess ? (
                <div className="space-y-5">
                  <div>
                    <Label>Chess.com</Label>
                    <a
                      href={`https://chess.com/member/${chess.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/90 text-sm font-medium hover:text-[var(--brand-crimson)] transition-colors"
                    >
                      @{chess.username}
                    </a>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <RatingBadge label="Rapid" value={chess.ratings?.rapid} />
                    <RatingBadge label="Blitz" value={chess.ratings?.blitz} />
                  </div>
                  {chess.ratings?.bullet && (
                    <RatingBadge label="Bullet" value={chess.ratings.bullet} />
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-start gap-3">
                  <p className="text-white/30 text-sm">No account linked yet.</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-[10px] uppercase tracking-widest font-bold px-3 py-2 border border-white/15 hover:border-[var(--brand-crimson)] hover:text-[var(--brand-crimson)] transition-colors"
                  >
                    Link Account
                  </button>
                </div>
              )}
            </SectionCard>

          </div>
        )}

        {/* Edit / Onboard form */}
        {profile && (isEditing || !profile.isOnboardingComplete) && (
          <div className="max-w-xl">
            <SectionCard
              title={profile.isOnboardingComplete ? "Edit Profile" : "Complete Your Profile"}
              accent
              action={
                profile.isOnboardingComplete && (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-[10px] uppercase tracking-widest font-bold text-white/30 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                )
              }
            >
              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Branch"
                    value={branch}
                    onChange={e => setBranch(e.target.value)}
                    placeholder="e.g. CSE"
                    required
                  />
                  <FormInput
                    label="Year"
                    type="number"
                    min="1" max="4"
                    value={year}
                    onChange={e => setYear(e.target.value)}
                    required
                  />
                </div>
                <FormInput
                  label="Chess.com Username"
                  value={chessComUsername}
                  onChange={e => setChessComUsername(e.target.value)}
                  placeholder="your username"
                />
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-bracket"
                  >
                    <div className="btn-inner">
                      {saving ? "Saving…" : profile.isOnboardingComplete ? "Update Profile" : "Complete Setup"}
                    </div>
                  </button>
                </div>
              </form>
            </SectionCard>
          </div>
        )}
      </div>
    </div>
  );
}
