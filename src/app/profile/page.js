"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/lib/api";
import { UserProfile, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Edit2,
  X,
  ChessPawn,
  Mail,
  BookOpen,
  GraduationCap,
  Trophy,
  MailCheck,
  AlertTriangle,
} from "lucide-react";
import { SiChessdotcom } from "react-icons/si";
import ChessRatingCard from "@/components/ChessRatingCard";
import CustomProfileForm from "@/components/profile/CustomProfileForm";
import ChessVerificationModal from "@/components/profile/ChessVerificationModal";
import { userProfileAppearance } from "@/lib/clerkAppearance";
import ChessGridBackground from "@/components/ChessGridBackground";

export default function ProfilePage() {
  const { isLoaded, user: clerkUser } = useUser();
  const fetchApi = useApi();

  const [profile, setProfile] = useState(null);
  const [myApplication, setMyApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [chessError, setChessError] = useState(false);
  const [isVerifyingChess, setIsVerifyingChess] = useState(false);

  useEffect(() => {
    if (isLoaded && clerkUser) loadProfile();
    else if (isLoaded && !clerkUser) setLoading(false);
  }, [isLoaded]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("onboarding") === "true") {
        setShowOnboardingModal(true);
      }
    }
  }, []);

  useEffect(() => {
    const locked = isEditing || showOnboardingModal || isVerifyingChess;
    document.documentElement.style.overflow = locked ? "hidden" : "unset";
    document.body.style.overflow = locked ? "hidden" : "unset";
    return () => {
      document.documentElement.style.overflow = "unset";
      document.body.style.overflow = "unset";
    };
  }, [isEditing, showOnboardingModal, isVerifyingChess]);

  const loadProfile = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const [data, appRes] = await Promise.all([
        fetchApi("/users/me"),
        fetchApi("/recruitment/my-application").catch(() => null)
      ]);
      if (data.success) setProfile(data.user);
      if (appRes?.myApplication) setMyApplication(appRes.myApplication);
    } catch (err) {
      setError(err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-white/10 border-t-[var(--brand-crimson)] rounded-full animate-spin" />
          <p className="text-white/30 text-xs uppercase tracking-[0.3em]">
            Loading…
          </p>
        </div>
      </div>
    );
  }

  const chess = profile?.chessAccounts?.chessCom;

  const recruitmentPath =
    myApplication?.status &&
    !["DRAFT", "PAYMENT_FAILED"].includes(myApplication.status)
      ? "/recruitment/dashboard"
      : "/recruitment";

  return (
    <div className="relative min-h-screen bg-[#050505] text-white font-sans overflow-hidden">
      <div className="absolute inset-0 z-0">
        <ChessGridBackground />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8 lg:pr-[70px] pt-32 pb-24">
        {error && (
          <div className="mb-8 px-4 py-3 border border-[#ff3333]/30 bg-[#ff3333]/8 text-[#ff3333] text-sm rounded-lg backdrop-blur-md">
            {error}
          </div>
        )}

        {profile && !isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md overflow-hidden p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 min-w-0 flex-1 w-full">
                <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-white/20 shrink-0 shadow-lg shadow-black/50">
                  <Image
                    src={clerkUser?.imageUrl || "/profile_placeholder.jpg"}
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2 min-w-0 flex-1 w-full">
                  <div className="flex items-center gap-3 w-full min-w-0">
                    <h1 className="text-3xl md:text-4xl font-semibold font-pezula tracking-wide text-white truncate w-full">
                      {profile.userName || clerkUser?.fullName || "Player"}
                    </h1>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-white/50 text-sm w-full min-w-0">
                    {profile.email && (
                      <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full min-w-0">
                        <Mail size={14} className="opacity-70 shrink-0" />
                        <span className="truncate">{profile.email}</span>
                      </div>
                    )}
                    {profile.collegeEmail && (
                      <div className="flex items-center gap-1.5 text-[#ff3333]/90 bg-[#ff3333]/10 px-3 py-1.5 rounded-full min-w-0 max-w-full">
                        <MailCheck size={14} className="opacity-70 shrink-0" />
                        <span className="truncate">{profile.collegeEmail}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto md:self-end mt-4 md:mt-0">
                <div className="flex flex-wrap items-center gap-3 w-full">
                  {profile.isOnboardingComplete && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 flex justify-center items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-white/10 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all shadow-sm"
                    >
                      <Edit2 size={14} /> Edit Profile
                    </button>
                  )}
                  <Link
                    href="/leaderboard"
                    className="flex-1 flex justify-center items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wider uppercase border border-white/10 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all shadow-sm"
                  >
                    <Trophy size={14} /> Leaderboard
                  </Link>
                </div>
                <Link
                  href={recruitmentPath}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold tracking-wider uppercase bg-[#c21818]/90 text-white hover:bg-[#c21818] rounded-lg transition-all shadow-[0_0_15px_rgba(194,24,24,0.3)] w-full"
                >
                  Recruitment
                </Link>
              </div>
            </motion.div>

            {!profile.isOnboardingComplete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 rounded-xl border border-[#c21818]/30 bg-[#c21818]/10 backdrop-blur-md"
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#ff3333] mb-1">
                    Action Required
                  </p>
                  <p className="text-white/70 text-sm">
                    Complete your club setup to appear on the leaderboard and
                    access all features.
                  </p>
                </div>
                <button
                  onClick={() => setShowOnboardingModal(true)}
                  className="shrink-0 px-5 py-2 text-xs font-bold uppercase tracking-widest bg-[#c21818] text-white hover:bg-[#a11414] rounded-lg transition-colors shadow-lg w-full sm:w-auto"
                >
                  Complete Profile
                </button>
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.12,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex flex-col gap-6"
              >
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-6">
                  <h2 className="text-s font-normal font-pezula tracking-[0.1em] uppercase text-white/70 mb-6 flex items-center gap-2">
                    Profile Details
                  </h2>
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50">
                          <Trophy size={16} />
                        </div>
                        <div>
                          <p className="text-[10px] normalcase tracking-wider text-white/40 mb-0.5">
                            Club Rank
                          </p>
                          <p className="text-sm font-semibold text-white/90">
                            {(() => {
                              if (!profile.ranks) return "Unranked";
                              let bestRank = Infinity;
                              let bestMode = "";
                              ["rapid", "blitz", "bullet"].forEach(mode => {
                                if (profile.ranks[mode]?.rank && profile.ranks[mode].rank < bestRank) {
                                  bestRank = profile.ranks[mode].rank;
                                  bestMode = mode;
                                }
                              });
                              if (bestRank === Infinity) return "Unranked";
                              const modeStr = bestMode.charAt(0).toUpperCase() + bestMode.slice(1);
                              return `#${bestRank} in ${modeStr}`;
                            })()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-px bg-white/5" />

                    <div className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50">
                          <SiChessdotcom />
                        </div>
                        <div>
                          <p className="text-[10px] normalcase tracking-wider text-white/40 mb-0.5">
                            Chess.com
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white/90">
                              {chess?.username
                                ? `@${chess.username}`
                                : "Not linked"}
                            </span>
                            {chess?.username && chess?.verified && (
                              <span className="text-[10px] font-bold text-green-500 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded-full uppercase tracking-wider scale-90">
                                Verified
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {chess?.username && !chess?.verified && (
                        <button
                          onClick={() => setIsVerifyingChess(true)}
                          className="text-[10px] font-bold px-2.5 py-1 bg-[#c21818]/20 hover:bg-[#c21818] text-white rounded border border-[#c21818]/30 transition-all uppercase tracking-wider"
                        >
                          Verify
                        </button>
                      )}
                      {!chess?.username && profile.isOnboardingComplete && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="text-white/20 hover:text-white/60 transition-colors p-2"
                        >
                          <Edit2 size={14} />
                        </button>
                      )}
                    </div>

                    <div className="w-full h-px bg-white/5" />

                    <div className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50">
                          <BookOpen size={16} />
                        </div>
                        <div>
                          <p className="text-[10px] normalcase tracking-wider text-white/40 mb-0.5">
                            Branch
                          </p>
                          <p className="text-sm font-semibold text-white/90">
                            {profile.branch || "—"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-px bg-white/5" />

                    <div className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50">
                          <GraduationCap size={16} />
                        </div>
                        <div>
                          <p className="text-[10px] normalcase tracking-wider text-white/40 mb-0.5">
                            Year
                          </p>
                          <p className="text-sm font-semibold text-white/90">
                            {profile.year ? (profile.year === 5 ? "Passed" : `Year ${profile.year}`) : "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.18,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="lg:col-span-2 flex flex-col gap-6"
              >
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-6 h-full">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-s font-normal font-pezula tracking-[0.1em] uppercase text-white/70 flex items-center gap-4">
                      <SiChessdotcom size={14} /> Chess.com Ratings
                    </h2>
                    {chessError && (
                      <div className="flex items-center gap-1.5 text-[#ff3333]">
                        <AlertTriangle size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Invalid Username</span>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-auto md:h-[calc(100%-2.5rem)]">
                    <div className="flex flex-col gap-3">
                      <ChessRatingCard
                        username={chess?.username}
                        timeClass="Blitz"
                        currentRating={chess?.ratings?.blitz}
                        onError={() => setChessError(true)}
                      />
                      <ChessRatingCard
                        username={chess?.username}
                        timeClass="Bullet"
                        currentRating={chess?.ratings?.bullet}
                        onError={() => setChessError(true)}
                      />
                    </div>

                    <ChessRatingCard
                      username={chess?.username}
                      timeClass="Rapid"
                      currentRating={chess?.ratings?.rapid}
                      variant="hero"
                      onError={() => setChessError(true)}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      {profile && isEditing && (
        <div
          className="fixed inset-0 z-40 flex items-start justify-center bg-black/65 backdrop-blur-sm p-4 pt-24 sm:p-6 sm:pt-28 overflow-y-auto"
          data-lenis-prevent="true"
        >
          <div className="relative my-auto w-full max-w-[850px] h-[min(620px,85vh)] flex justify-center">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-3 right-3 md:top-4 md:right-4 z-[60] text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              title="Close"
            >
              <X size={20} />
            </button>
            <UserProfile routing="virtual" appearance={userProfileAppearance}>
              <UserProfile.Page label="account" />
              <UserProfile.Page
                label="En Passant"
                labelIcon={<SiChessdotcom size={14} />}
                url="en-passant"
              >
                <CustomProfileForm />
              </UserProfile.Page>
              <UserProfile.Page label="security" />
            </UserProfile>
          </div>
        </div>
      )}

      {showOnboardingModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto"
          data-lenis-prevent="true"
        >
          <div className="relative my-auto w-full max-w-[32rem] bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setShowOnboardingModal(false)}
              className="absolute top-4 right-4 z-10 text-white/40 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              title="Close"
            >
              <X size={20} />
            </button>
            <CustomProfileForm />
          </div>
        </div>
      )}

      <ChessVerificationModal
        isOpen={isVerifyingChess}
        onClose={() => setIsVerifyingChess(false)}
        username={chess?.username}
        onVerified={() => loadProfile(true)}
      />
    </div>
  );
}
