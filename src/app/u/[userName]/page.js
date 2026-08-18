"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, GraduationCap, Trophy, AlertTriangle } from "lucide-react";
import { SiChessdotcom } from "react-icons/si";
import ChessRatingCard from "@/components/ChessRatingCard";
import ChessGridBackground from "@/components/ChessGridBackground";
import { notFound, useParams } from "next/navigation";

export default function PublicProfilePage() {
  const { userName } = useParams();

  const fetchApi = useApi();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chessError, setChessError] = useState(false);

  useEffect(() => {
    if (userName) {
      loadProfile();
    }
  }, [userName]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const decodedUserName = decodeURIComponent(userName);
      const safeUserName = encodeURIComponent(decodedUserName);
      const data = await fetchApi(`/users/${safeUserName}`);
      if (data.success && data.user) {
        setProfile(data.user);
      } else {
        setError("User not found");
      }
    } catch (err) {
      if (err.status === 404 || err.message?.includes("404")) {
        setError("User not found");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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

  if (error === "User not found" || (!loading && !profile)) {
    return notFound();
  }

  const chess = profile?.chessAccounts?.chessCom;

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

        {profile && (
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
                    src={profile.avatarUrl || "/profile_placeholder.jpg"}
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2 min-w-0 flex-1 w-full">
                  <div className="flex items-center gap-3 w-full min-w-0">
                    <h1 className="text-3xl md:text-4xl font-semibold font-pezula tracking-wide text-white truncate w-full">
                      {profile.userName || profile.fullName || "Player"}
                    </h1>
                  </div>
                  <div className="text-white/40 text-sm">
                    Joined{" "}
                    {profile.createdAt
                      ? new Date(profile.createdAt).getFullYear()
                      : new Date().getFullYear()}
                  </div>
                </div>
              </div>
            </motion.div>

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
                              ["rapid", "blitz", "bullet"].forEach((mode) => {
                                if (
                                  profile.ranks[mode]?.rank &&
                                  profile.ranks[mode].rank < bestRank
                                ) {
                                  bestRank = profile.ranks[mode].rank;
                                  bestMode = mode;
                                }
                              });
                              if (bestRank === Infinity) return "Unranked";
                              const modeStr =
                                bestMode.charAt(0).toUpperCase() +
                                bestMode.slice(1);
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
                          <p className="text-sm font-semibold text-white/90">
                            {chess?.username
                              ? `@${chess.username}`
                              : "Not linked"}
                          </p>
                        </div>
                      </div>
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
                            {profile.year
                              ? profile.year === 5
                                ? "Passed"
                                : `Year ${profile.year}`
                              : "—"}
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
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          Invalid Username
                        </span>
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
    </div>
  );
}
