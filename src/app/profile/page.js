"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/lib/api";
import { UserButton, UserProfile, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown, Edit2, X, ChessPawn } from "lucide-react";
import ChessRatingCard from "@/components/ChessRatingCard";
import CustomProfileForm from "@/components/profile/CustomProfileForm";
import { userProfileAppearance } from "@/lib/clerkAppearance";

/* ─── Main Page ────────────────────────────────────────── */
export default function ProfilePage() {
  const { isLoaded, user: clerkUser } = useUser();
  const fetchApi = useApi();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

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
    <div className="relative min-h-screen bg-[#050505] text-white font-sans pt-28 pb-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg_3_red.png"
          alt="Background"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/30 via-[#050505]/80 to-[#050505] pointer-events-none"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
        {error && (
          <div className="mb-6 px-4 py-3 border border-[#ff3333]/30 bg-[#ff3333]/10 text-[#ff3333] text-sm rounded-lg">
            {error}
          </div>
        )}

        {/* View Mode */}
        {profile && !isEditing && (
          <div className="space-y-8">
            
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-2">
                  Player <span className="text-[#ff3333]">Dashboard</span>
                </h1>
                <p className="text-white/50 text-sm tracking-wide">
                  Manage your En Passant profile and chess stats
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/leaderboard" className="px-5 py-2 text-xs font-bold tracking-widest uppercase border border-white/20 text-white/80 hover:text-white hover:border-white hover:bg-white/10 transition-all rounded-md">
                  Leaderboard
                </Link>
                <Link href="/recruitment" className="bg-[#c21818] border border-[#c21818] text-white px-5 py-2 text-xs font-bold tracking-widest uppercase hover:bg-[#ff3333] hover:border-[#ff3333] transition-all rounded-md shadow-[0_0_15px_rgba(194,24,24,0.3)]">
                  Recruitment
                </Link>
              </div>
            </div>

            {/* Onboarding Prompt */}
            {!profile.isOnboardingComplete && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex flex-col md:flex-row items-center justify-between p-6 bg-[#111] border border-[#ff3333]/30 rounded-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-[#ff3333]"></div>
                <div className="mb-4 md:mb-0">
                  <h3 className="text-lg font-bold text-white mb-1 uppercase tracking-wide">
                    Complete your setup
                  </h3>
                  <p className="text-white/60 text-sm">
                    Fill in your club details to be featured on the leaderboard.
                  </p>
                </div>
                <button
                  onClick={() => setShowOnboardingModal(true)}
                  className="bg-[#c21818] text-white px-6 py-2.5 text-xs font-bold tracking-widest uppercase rounded-md hover:bg-[#ff3333] transition-all shadow-[0_0_15px_rgba(255,51,51,0.2)] shrink-0"
                >
                  Complete Setup
                </button>
              </motion.div>
            )}

            {/* Bento Grid */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {/* Main Identity Box */}
              <motion.div 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="col-span-1 md:col-span-2 lg:col-span-2 bg-[#111] border border-white/10 hover:border-white/20 transition-colors rounded-2xl p-6 md:p-8 flex items-center gap-6 relative overflow-hidden"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 relative rounded-full overflow-hidden border-2 border-white/10 shrink-0">
                  <Image
                    src={clerkUser?.imageUrl || "/profile_placeholder.jpg"}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white truncate">
                    {profile.userName || clerkUser?.fullName || "PLAYER"}
                  </h2>
                  <p className="text-white/50 text-sm truncate mt-1">
                    {profile.collegeEmail || "No email provided"}
                  </p>
                  
                  {profile.isOnboardingComplete && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#ff3333] hover:text-white transition-colors"
                    >
                      <Edit2 size={14} /> Edit Profile
                    </button>
                  )}
                </div>
              </motion.div>

              {/* Leaderboard Rank Box */}
              <motion.div 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="col-span-1 lg:col-span-1 bg-[#111] border border-[#ff3333]/20 hover:border-[#ff3333]/40 transition-colors rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden group"
              >
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#ff3333]/5 rounded-full blur-2xl group-hover:bg-[#ff3333]/10 transition-colors"></div>
                <div className="text-[10px] font-bold text-[#ff3333] tracking-[0.2em] uppercase mb-2">
                  Leaderboard Rank
                </div>
                <div className="text-5xl font-black text-white">
                  {profile.rank || "N/A"}
                </div>
              </motion.div>

              {/* Chess.com Username Box */}
              <motion.div 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="col-span-1 lg:col-span-1 bg-[#111] border border-white/10 hover:border-white/20 transition-colors rounded-2xl p-6 flex flex-col justify-center"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase">
                    Chess.com
                  </div>
                  {!chess?.username && profile.isOnboardingComplete && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-[#ff3333] hover:text-white transition-colors"
                      title="Link Account"
                    >
                      <Edit2 size={14} />
                    </button>
                  )}
                </div>
                <div className="text-xl font-bold text-white/90 truncate">
                  {chess?.username ? `@${chess.username}` : "Not linked"}
                </div>
              </motion.div>

              {/* Branch Box */}
              <motion.div 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="col-span-1 md:col-span-1 lg:col-span-2 bg-[#111] border border-white/10 hover:border-white/20 transition-colors rounded-2xl p-6"
              >
                <div className="text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase mb-1">
                  Branch
                </div>
                <div className="text-lg font-medium text-white/90 truncate">
                  {profile.branch || "N/A"}
                </div>
              </motion.div>

              {/* Year Box */}
              <motion.div 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="col-span-1 md:col-span-1 lg:col-span-2 bg-[#111] border border-white/10 hover:border-white/20 transition-colors rounded-2xl p-6"
              >
                <div className="text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase mb-1">
                  Academic Year
                </div>
                <div className="text-lg font-medium text-white/90 truncate">
                  {profile.year ? `Year ${profile.year}` : "N/A"}
                </div>
              </motion.div>

            </motion.div>

            {/* Ratings Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="pt-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                  Chess Ratings
                </h3>
                <div className="h-px bg-white/10 flex-1"></div>
              </div>
              
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
            </motion.div>
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
