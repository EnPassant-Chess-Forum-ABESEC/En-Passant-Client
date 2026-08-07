"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/lib/api";
import { UserButton, UserProfile, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Edit2, X, ChessPawn } from "lucide-react";
import ChessRatingCard from "@/components/ChessRatingCard";
import CustomProfileForm from "@/components/profile/CustomProfileForm";
import { userProfileAppearance } from "@/lib/clerkAppearance";

/* ─── tiny helpers ─────────────────────────────────────── */
function Label({ children }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-1">
      {children}
    </p>
  );
}

function Value({ children }) {
  return <p className="text-white/90 text-sm font-medium">{children || "—"}</p>;
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
    <div
      className="flex flex-col items-center justify-center px-4 py-3 border border-white/10"
      style={{ background: "rgba(255,255,255,0.03)" }}
    >
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">
        {label}
      </span>
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
    <div
      className="relative border border-white/10 p-6 md:p-8"
      style={{ background: "rgba(255,255,255,0.03)" }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {accent && (
            <div
              className="w-1 h-6"
              style={{ background: "var(--brand-crimson)" }}
            />
          )}
          <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-white">
            {title}
          </h2>
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
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  const { scrollY } = useScroll();
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 150], [1, 0]);

  useEffect(() => {
    if (isLoaded && clerkUser) {
      loadProfile();
    } else if (isLoaded && !clerkUser) {
      setLoading(false);
    }
  }, [isLoaded]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isEditing || showOnboardingModal) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "unset";
      document.body.style.overflow = "unset";
    }
    return () => {
      document.documentElement.style.overflow = "unset";
      document.body.style.overflow = "unset";
    };
  }, [isEditing, showOnboardingModal]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await fetchApi("/users/me");
      if (data.success) {
        setProfile(data.user);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ── loading / error states ───────────────────────────── */
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-white/10 border-t-[var(--brand-crimson)] rounded-full animate-spin" />
          <p className="text-white/30 text-xs uppercase tracking-widest">
            Loading profile…
          </p>
        </div>
      </div>
    );
  }

  const chess = profile?.chessAccounts?.chessCom;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* ── Hero strip ──────────────────────────────────────── */}
      <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-12">
        <div className="absolute inset-0 z-0 bg-[#050505]">
          <Image
            src="/profile_hero.png"
            alt="Profile Hero"
            fill
            style={{
              objectFit: "cover",
              objectPosition: "center 15%",
            }}
            className="opacity-60 scale-110 origin-top"
            priority
          />
        </div>

        {/* Fade gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a] z-0 pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-0 pointer-events-none"></div>

        <div className="relative z-10 text-center px-4 mt-20 flex flex-col items-center">
          <h1 className="font-pezula text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight flex flex-wrap justify-center items-center gap-x-4 gap-y-2 drop-shadow-2xl">
            <span className="text-white">WELCOME!!</span>
            <span className="text-[#ff3333] drop-shadow-[0_0_20px_rgba(255,51,51,0.3)]">
              {clerkUser?.firstName?.toUpperCase() ?? "PLAYER"}
            </span>
          </h1>

          <div className="flex items-center gap-6 mt-12">
            <Link href="/leaderboard">
              <div className="px-8 py-3.5 text-xs md:text-sm font-bold tracking-widest uppercase border border-white/30 text-white/80 hover:text-white hover:border-white hover:bg-white/10 transition-all duration-300">
                Leaderboard
              </div>
            </Link>
            <Link href="/recruitment">
              <div className="bg-[#c21818] border border-[#c21818] text-white px-8 py-3.5 text-xs md:text-sm font-bold tracking-widest uppercase hover:bg-[#ff3333] hover:border-[#ff3333] transition-all duration-300 shadow-2xl">
                Recruitment
              </div>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          style={{ opacity: scrollIndicatorOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none text-white/30"
        >
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={20} />
          </motion.div>
        </motion.div>
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
          <div className="space-y-6">
            {/* Top Bar: Profile Details */}
            <div className="flex flex-col md:flex-row gap-10 bg-[#111] p-8 border border-white/5">
              {/* Image Section */}
              <div className="w-full md:w-64 aspect-square relative border border-white/10 shrink-0">
                <Image
                  src={clerkUser?.imageUrl || "/profile_placeholder.jpg"}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Details Section */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-pezula text-5xl md:text-6xl uppercase tracking-tight text-white leading-none">
                    {profile.userName || clerkUser?.fullName || "PLAYER"}
                  </h2>
                  {profile.isOnboardingComplete && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-white/40 hover:text-white transition-colors"
                      title="Edit Profile"
                    >
                      <Edit2 size={20} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                  <div className="flex flex-col gap-1.5">
                    <div className="text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase">
                      Email
                    </div>
                    <div className="text-sm font-medium text-white/90">
                      {profile.collegeEmail || "N/A"}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase">
                      Year
                    </div>
                    <div className="text-sm font-medium text-white/90">
                      {profile.year ? `Year ${profile.year}` : "N/A"}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase">
                      Branch
                    </div>
                    <div className="text-sm font-medium text-white/90">
                      {profile.branch || "N/A"}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase">
                      Chess.com
                    </div>
                    <div className="text-sm font-medium text-white/90">
                      {chess?.username ? `@${chess.username}` : "Not linked"}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-2 col-span-2">
                    <div className="text-[10px] font-bold text-[#ff3333] tracking-[0.2em] uppercase">
                      Leaderboard Rank
                    </div>
                    <div className="text-3xl font-black text-white">
                      {profile.rank || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Onboarding Prompt */}
            {profile && !profile.isOnboardingComplete && (
              <div className="mt-8 flex flex-col items-center justify-center p-8 bg-[#111] border border-[#ff3333]/20 rounded-lg text-center">
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">
                  Almost there!
                </h3>
                <p className="text-white/60 text-sm mb-6 max-w-md">
                  Please complete your club specific profile to be featured on
                  the leaderboard and participate in events.
                </p>
                <button
                  onClick={() => setShowOnboardingModal(true)}
                  className="bg-[#c21818] border border-[#c21818] text-white px-8 py-3 text-xs font-bold tracking-widest uppercase hover:bg-[#ff3333] hover:border-[#ff3333] transition-all duration-300 shadow-[0_0_15px_rgba(255,51,51,0.2)]"
                >
                  Complete Setup
                </button>
              </div>
            )}

            {/* Ratings Section Header */}
            <div className="pt-8 pb-2">
              <h3 className="text-xl font-black text-white uppercase tracking-wider">
                Chess Ratings
              </h3>
              <div className="w-12 h-1 bg-[#ff3333] mt-3"></div>
            </div>

            {/* Bottom Bar: Chess Ratings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ChessRatingCard
                username={chess?.username}
                timeClass="Rapid"
                currentRating={chess?.ratings?.rapid}
              />
              <ChessRatingCard
                username={chess?.username}
                timeClass="Blitz"
                currentRating={chess?.ratings?.blitz}
              />
              <ChessRatingCard
                username={chess?.username}
                timeClass="Bullet"
                currentRating={chess?.ratings?.bullet}
              />
            </div>

            {!chess?.username && profile.isOnboardingComplete && (
              <div className="text-center pt-4">
                <p className="text-white/40 text-sm mb-3">
                  No Chess.com account linked.
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-[10px] uppercase tracking-widest font-bold px-4 py-2 border border-white/20 hover:border-white hover:text-white text-white/60 transition-colors"
                >
                  Link Account
                </button>
              </div>
            )}
          </div>
        )}

        {/* Edit / Onboard form modal using Clerk */}
        {profile && isEditing && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto"
            data-lenis-prevent="true"
          >
            <div className="relative my-auto w-fit flex justify-center">
              <button
                onClick={() => setIsEditing(false)}
                className="absolute top-2 right-3 md:top-4 md:right-5 z-[60] text-gray-400 hover:text-gray-800 p-2 rounded-full hover:bg-black/5 transition-colors"
                title="Close"
              >
                <X size={20} />
              </button>
              <UserProfile routing="virtual" appearance={userProfileAppearance}>
                <UserProfile.Page label="account" />
                <UserProfile.Page
                  label="En Passant"
                  labelIcon={<ChessPawn size={16} />}
                  url="en-passant"
                >
                  <CustomProfileForm />
                </UserProfile.Page>
                <UserProfile.Page label="security" />
              </UserProfile>
            </div>
          </div>
        )}

        {/* Standalone Onboarding Modal */}
        {showOnboardingModal && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto"
            data-lenis-prevent="true"
          >
            <div className="relative my-auto w-full max-w-[32rem] bg-[#111] rounded-2xl overflow-hidden shadow-2xl">
              <button
                onClick={() => setShowOnboardingModal(false)}
                className="absolute top-4 right-4 z-10 text-white/40 hover:text-white/80 p-2 rounded-full hover:bg-white/5 transition-colors"
                title="Close"
              >
                <X size={20} />
              </button>
              <CustomProfileForm />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
