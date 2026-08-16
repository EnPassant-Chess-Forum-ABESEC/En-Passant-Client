"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/lib/api";
import SpotlightCard from "@/components/SpotlightCard";
import { motion } from "framer-motion";
import AnimatedList from "@/components/AnimatedList";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MEDAL_COLORS = [
  {
    color: "text-white",
    glow: "drop-shadow-[0_0_16px_rgba(255,255,255,0.6)]",
    border: "border-white/30",
    ring: "rgba(255,255,255,0.15)",
  },
  {
    color: "text-white",
    glow: "drop-shadow-[0_0_12px_rgba(255,255,255,0.5)]",
    border: "border-white/30",
    ring: "rgba(255,255,255,0.1)",
  },
  {
    color: "text-white",
    glow: "drop-shadow-[0_0_12px_rgba(255,255,255,0.5)]",
    border: "border-white/30",
    ring: "rgba(255,255,255,0.1)",
  },
];

export default function LeaderboardPage() {
  const fetchApi = useApi();
  const [timeControl, setTimeControl] = useState("rapid");
  const [leaderboard, setLeaderboard] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
    loadLeaderboard();
  }, [timeControl]);

  useEffect(() => {
    loadMyRank();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await fetchApi(
        `/leaderboard?timeControl=${timeControl}&limit=100`,
      );
      if (data.success) {
        setLeaderboard(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMyRank = async () => {
    try {
      const data = await fetchApi(`/leaderboard/my-rank`);
      if (data.success) {
        setMyRank(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  const totalPages = Math.ceil(rest.length / itemsPerPage);
  const paginatedRest = rest.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  const tableItems = paginatedRest.map((player, i) => (
    <div
      className="flex w-full items-center text-left group border-b border-white/[0.03] last:border-0"
      key={player.userId}
    >
      <div className="py-3 px-2 md:py-6 md:px-8 font-mono text-white/20 font-bold text-xs md:text-lg group-hover:text-[#9b1a1a] transition-colors w-8 md:w-32 shrink-0 text-center md:text-left">
        #{i + 4 + (currentPage - 1) * itemsPerPage}
      </div>

      <div className="hidden md:flex py-6 px-8 items-center gap-4">
        <div className="w-12 h-12 bg-[#111] overflow-hidden border border-white/10 shrink-0 flex items-center justify-center rounded-full">
          {player.profilePictureUrl || player.profilePic || player.imageUrl ? (
            <img
              src={
                player.profilePictureUrl || player.profilePic || player.imageUrl
              }
              alt={player.username || player.userName}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
            />
          ) : (
            <span className="text-white/20 font-pezula font-bold text-sm">
              {player.username?.[0] || player.userName?.[0] || "?"}
            </span>
          )}
        </div>
      </div>

      <div className="py-3 px-2 md:py-6 md:px-4 flex-1 min-w-0">
        <div className="font-pezula font-bold text-xs md:text-lg text-white/70 group-hover:text-white transition-colors truncate">
          {player.username || player.userName}
        </div>
        <div className="text-[9px] md:text-xs text-white/20 font-mono mt-0.5 truncate hidden md:block">
          {player.chessComUsername || "—"}
        </div>
      </div>

      <div className="py-6 px-8 text-xs md:text-sm text-white/25 font-mono hidden md:block shrink-0 md:w-48 lg:w-64">
        {player.branch}
        {player.year
          ? player.year === 5
            ? ` · Passed`
            : ` · Y${player.year}`
          : ""}
      </div>

      <div className="py-3 px-3 md:py-6 md:px-8 text-right shrink-0 w-16 md:w-32">
        <span className="font-pezula font-bold text-sm md:text-xl text-white/60 group-hover:text-white transition-colors tabular-nums">
          {player.rating}
        </span>
      </div>
    </div>
  ));

  return (
    <div className="relative w-full bg-[#050505] font-sans overflow-hidden">
      <div className="relative w-full h-[255vw] md:h-[96vw] mt-24 md:mt-32">
        <div
          className="absolute inset-0 z-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: 'url("/common/dark_marble_bg.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 z-0 bg-black/60 pointer-events-none" />

        <div
          className="absolute inset-0 z-0 opacity-10 pointer-events-none hidden md:block"
          style={{
            backgroundImage: `
              linear-gradient(to right, #ffffff 1px, transparent 1px),
              linear-gradient(to bottom, #ffffff 1px, transparent 1px)
            `,
            backgroundSize: "12vw 12vw",
            backgroundPosition: "2vw 0",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
          }}
        />

        <div className="absolute top-0 left-0 w-full h-full z-0 md:hidden flex flex-wrap pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="w-[50vw] h-[42.5vw] border border-white/[0.05]"
            />
          ))}
        </div>

        <div className="absolute top-0 left-0 h-full hidden md:flex flex-col text-[#444] text-[9px] font-mono pr-2 z-10">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
            <div
              key={row}
              className="h-[12vw] w-[2vw] flex justify-end items-center"
            >
              {row}
            </div>
          ))}
        </div>

        <div className="absolute top-0 right-0 h-full hidden md:flex flex-col text-[#444] text-[9px] font-mono pl-2 z-10">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
            <div
              key={row}
              className="h-[12vw] w-[2vw] flex justify-start items-center"
            >
              {row}
            </div>
          ))}
        </div>

        <div className="relative w-full h-full pt-20 md:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative md:absolute md:right-[2vw] md:top-[2vw] z-30 w-full px-6 md:px-0 text-right md:flex md:items-center"
          >
            <h1 className="uppercase font-pezula font-bold leading-[0.85] tracking-[0.04em] md:tracking-[0.06em] w-full">
              <span className="inline-block text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.4)] text-[12vw] md:text-[6vw]">
                LEADER
              </span>
              <span className="inline-block text-[#9b1a1a] drop-shadow-[0_0_30px_rgba(155,26,26,0.6)] text-[12vw] md:text-[6vw] ml-2 md:ml-4">
                BOARD
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden flex flex-row items-center justify-center w-full px-6 mt-6 z-30 relative gap-2"
          >
            {["bullet", "blitz", "rapid"].map((type) => (
              <button
                key={`${type}-mobile`}
                onClick={() => setTimeControl(type)}
                className={`flex-1 py-3 border transition-all duration-300 font-pezula text-xs tracking-wider uppercase ${timeControl === type ? "border-[#9b1a1a] bg-[#9b1a1a]/10 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" : "border-white/10 text-white/40 hover:text-white/80"}`}
              >
                {type}
              </button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:grid absolute left-[62vw] top-[12vw] w-[36vw] h-[12vw] z-30 grid-cols-3"
          >
            {["bullet", "blitz", "rapid"].map((type) => (
              <button
                key={type}
                onClick={() => setTimeControl(type)}
                className={`group w-full h-full flex flex-col items-center justify-center transition-all duration-500 relative overflow-hidden ${timeControl === type ? "text-white" : "text-white/30 hover:text-white/70"}`}
              >
                <div
                  className={`absolute inset-0 transition-opacity duration-500 ${timeControl === type ? "bg-gradient-to-b from-[#9b1a1a]/20 to-transparent opacity-100" : "bg-white/[0.03] opacity-0 group-hover:opacity-100"}`}
                />
                <span
                  className={`font-pezula font-bold text-[1.4vw] uppercase tracking-[0.1em] relative z-10 transition-all duration-500 ${timeControl === type ? "drop-shadow-[0_0_12px_rgba(255,255,255,0.5)]" : ""}`}
                >
                  {type}
                </span>
              </button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 md:left-[2vw] top-[85vw] md:top-0 w-[50vw] md:w-[24vw] h-[42.5vw] md:h-[24vw] z-20"
          >
            <SpotlightCard
              spotlightColor="rgba(255, 255, 255, 0.08)"
              className="w-full h-full flex flex-col justify-center px-4 md:px-6 py-[4vw] md:p-[3vw] border border-white/[0.06] bg-[#050505]"
            >
              <div className="relative z-10">
                <p className="font-pezula font-bold uppercase text-[5vw] md:text-[2.2vw] tracking-[0.05em] text-white leading-[1.1] mb-4 md:mb-6 break-words w-full">
                  TOP
                  <br />
                  PLAYERS
                  <br />
                  OF THE
                  <br />
                  COMMUNITY
                </p>
                <div className="w-6 md:w-8 h-px bg-[#9b1a1a] mb-2 md:mb-3" />
                <p className="text-white/40 font-mono text-[2.5vw] md:text-[0.7vw] uppercase tracking-widest leading-[1.8]">
                  Ranked by
                  <br />
                  {timeControl.charAt(0).toUpperCase() +
                    timeControl.slice(1)}{" "}
                  Rating
                </p>
                {loading && (
                  <p className="text-white/20 font-mono text-[2.5vw] md:text-[0.6vw] uppercase tracking-widest mt-4">
                    Loading...
                  </p>
                )}
                {!loading && leaderboard.length === 0 && (
                  <p className="text-white/20 font-mono text-[2.5vw] md:text-[0.6vw] uppercase tracking-widest mt-4">
                    No players found
                  </p>
                )}
              </div>
            </SpotlightCard>
          </motion.div>

          {top3[0] && (
            <motion.div
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={cardVariants}
              className="absolute top-[127.5vw] md:top-[24vw] left-[50vw] md:left-[26vw] w-[50vw] md:w-[24vw] h-[42.5vw] md:h-[24vw] z-20 flex flex-col"
            >
              <div className="w-full h-full bg-[#050505] relative overflow-hidden group">
                {top3[0].profilePic ||
                top3[0].imageUrl ||
                top3[0].profilePictureUrl ? (
                  <img
                    src={
                      top3[0].profilePic ||
                      top3[0].imageUrl ||
                      top3[0].profilePictureUrl
                    }
                    alt={top3[0].username || top3[0].userName}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#111] to-black">
                    <span
                      className={`font-pezula font-bold text-[15vw] md:text-[6vw] ${MEDAL_COLORS[0].color} ${MEDAL_COLORS[0].glow} leading-none`}
                    >
                      #1
                    </span>
                  </div>
                )}

                <div
                  className="absolute inset-0 pointer-events-none z-0"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to top, black 0%, transparent 60%)",
                    maskImage:
                      "linear-gradient(to top, black 0%, transparent 60%)",
                  }}
                >
                  <div className="absolute inset-0 backdrop-blur-xl bg-black/30" />
                </div>

                {(top3[0].profilePic ||
                  top3[0].imageUrl ||
                  top3[0].profilePictureUrl) && (
                  <div
                    className={`absolute top-4 left-4 font-pezula font-bold text-[6vw] md:text-[2.5vw] ${MEDAL_COLORS[0].color} ${MEDAL_COLORS[0].glow} leading-none z-10`}
                  >
                    #1
                  </div>
                )}

                <div
                  className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none z-0"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to top, black 0%, transparent 100%)",
                    maskImage:
                      "linear-gradient(to top, black 0%, transparent 100%)",
                  }}
                >
                  <div className="absolute inset-0 backdrop-blur-md bg-black/50" />
                </div>
                <div className="absolute bottom-0 left-0 w-full flex flex-row items-end justify-between px-[4vw] md:px-[1.5vw] pb-[4vw] md:pb-[1.5vw] z-10 gap-1">
                  <h3 className="text-white font-pezula font-bold text-[4vw] md:text-[1.8vw] leading-tight break-words drop-shadow-md min-w-0 flex-1">
                    {(top3[0].username || top3[0].userName || "").split(" ")[0]}
                  </h3>
                  <p className="text-white font-mono font-bold text-[3.5vw] md:text-[0.9vw] uppercase tracking-widest tabular-nums drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] shrink-0">
                    {top3[0].rating}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {top3[1] && (
            <motion.div
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={cardVariants}
              className="absolute top-[170vw] md:top-[48vw] left-0 md:left-[50vw] w-[50vw] md:w-[24vw] h-[42.5vw] md:h-[24vw] z-20 flex flex-col"
            >
              <div className="w-full h-full bg-[#050505] relative overflow-hidden group">
                {top3[1].profilePic ||
                top3[1].imageUrl ||
                top3[1].profilePictureUrl ? (
                  <img
                    src={
                      top3[1].profilePic ||
                      top3[1].imageUrl ||
                      top3[1].profilePictureUrl
                    }
                    alt={top3[1].username || top3[1].userName}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#111] to-black">
                    <span
                      className={`font-pezula font-bold text-[15vw] md:text-[6vw] ${MEDAL_COLORS[1].color} ${MEDAL_COLORS[1].glow} leading-none`}
                    >
                      #2
                    </span>
                  </div>
                )}

                <div
                  className="absolute inset-0 pointer-events-none z-0"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to top, black 0%, transparent 60%)",
                    maskImage:
                      "linear-gradient(to top, black 0%, transparent 60%)",
                  }}
                >
                  <div className="absolute inset-0 backdrop-blur-xl bg-black/30" />
                </div>

                {(top3[1].profilePic ||
                  top3[1].imageUrl ||
                  top3[1].profilePictureUrl) && (
                  <div
                    className={`absolute top-4 left-4 font-pezula font-bold text-[6vw] md:text-[2.5vw] ${MEDAL_COLORS[1].color} ${MEDAL_COLORS[1].glow} leading-none z-10`}
                  >
                    #2
                  </div>
                )}

                <div
                  className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none z-0"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to top, black 0%, transparent 100%)",
                    maskImage:
                      "linear-gradient(to top, black 0%, transparent 100%)",
                  }}
                >
                  <div className="absolute inset-0 backdrop-blur-md bg-black/50" />
                </div>
                <div className="absolute bottom-0 left-0 w-full flex flex-row items-end justify-between px-[4vw] md:px-[1.5vw] pb-[4vw] md:pb-[1.5vw] z-10 gap-1">
                  <h3 className="text-white font-pezula font-bold text-[4vw] md:text-[1.8vw] leading-tight break-words drop-shadow-md min-w-0 flex-1">
                    {(top3[1].username || top3[1].userName || "").split(" ")[0]}
                  </h3>
                  <p className="text-white font-mono font-bold text-[3.5vw] md:text-[0.9vw] uppercase tracking-widest tabular-nums drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] shrink-0">
                    {top3[1].rating}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {top3[2] && (
            <motion.div
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={cardVariants}
              className="absolute top-[212.5vw] md:top-[72vw] left-[50vw] md:left-[74vw] w-[50vw] md:w-[24vw] h-[42.5vw] md:h-[24vw] z-20 flex flex-col"
            >
              <div className="w-full h-full bg-[#050505] relative overflow-hidden group">
                {top3[2].profilePic ||
                top3[2].imageUrl ||
                top3[2].profilePictureUrl ? (
                  <img
                    src={
                      top3[2].profilePic ||
                      top3[2].imageUrl ||
                      top3[2].profilePictureUrl
                    }
                    alt={top3[2].username || top3[2].userName}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#111] to-black">
                    <span
                      className={`font-pezula font-bold text-[15vw] md:text-[6vw] ${MEDAL_COLORS[2].color} ${MEDAL_COLORS[2].glow} leading-none`}
                    >
                      #3
                    </span>
                  </div>
                )}

                <div
                  className="absolute inset-0 pointer-events-none z-0"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to top, black 0%, transparent 60%)",
                    maskImage:
                      "linear-gradient(to top, black 0%, transparent 60%)",
                  }}
                >
                  <div className="absolute inset-0 backdrop-blur-xl bg-black/30" />
                </div>

                {(top3[2].profilePic ||
                  top3[2].imageUrl ||
                  top3[2].profilePictureUrl) && (
                  <div
                    className={`absolute top-4 left-4 font-pezula font-bold text-[6vw] md:text-[2.5vw] ${MEDAL_COLORS[2].color} ${MEDAL_COLORS[2].glow} leading-none z-10`}
                  >
                    #3
                  </div>
                )}

                <div
                  className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none z-0"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to top, black 0%, transparent 100%)",
                    maskImage:
                      "linear-gradient(to top, black 0%, transparent 100%)",
                  }}
                >
                  <div className="absolute inset-0 backdrop-blur-md bg-black/50" />
                </div>
                <div className="absolute bottom-0 left-0 w-full flex flex-row items-end justify-between px-[4vw] md:px-[1.5vw] pb-[4vw] md:pb-[1.5vw] z-10 gap-1">
                  <h3 className="text-white font-pezula font-bold text-[4vw] md:text-[1.8vw] leading-tight break-words drop-shadow-md min-w-0 flex-1">
                    {(top3[2].username || top3[2].userName || "").split(" ")[0]}
                  </h3>
                  <p className="text-white font-mono font-bold text-[3.5vw] md:text-[0.9vw] uppercase tracking-widest tabular-nums drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] shrink-0">
                    {top3[2].rating}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="hidden md:flex absolute top-[84vw] left-[2vw] w-[24vw] h-[12vw] z-20 flex-col items-start justify-center px-[2vw] text-white/20 font-pezula font-bold text-[1.2vw] uppercase tracking-[0.2em]"
          >
            <span>Ranks</span>
            <span className="text-[1.5vw] text-white/40">
              1 — {leaderboard.length}
            </span>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-[20vw] bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent z-10 pointer-events-none" />
      </div>

      {rest.length > 0 && (
        <div className="relative w-full z-20 px-4 md:px-[4vw] mt-12 md:mt-16 pb-32">
          <div className="relative z-10 w-full mx-auto">
            <div className="border border-white/[0.07] overflow-hidden relative bg-[#050505]/40 backdrop-blur-2xl rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
              <div
                className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none mix-blend-screen"
                style={{
                  backgroundImage: 'url("/common/white_marble_texture.png")',
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="w-full text-left relative z-10 flex flex-col">
                <div className="flex w-full bg-white/[0.05] border-b border-white/[0.1] text-white/60 text-[10px] md:text-xs uppercase tracking-[0.15em] font-mono backdrop-blur-xl">
                  <div className="py-4 px-2 md:py-6 md:px-8 font-semibold w-8 md:w-32 shrink-0 text-center md:text-left">
                    Rank
                  </div>
                  <div className="py-4 px-2 md:py-6 md:px-4 font-semibold flex-1 min-w-0">
                    Player
                  </div>
                  <div className="py-6 px-8 font-semibold hidden md:block shrink-0 md:w-48 lg:w-64">
                    Branch / Year
                  </div>
                  <div className="py-4 px-3 md:py-6 md:px-8 font-semibold text-right shrink-0 w-16 md:w-32">
                    Rating
                  </div>
                </div>
                <div className="w-full relative min-h-[300px]">
                  <AnimatedList
                    items={tableItems}
                    showGradients={false}
                    enableArrowNavigation={false}
                    displayScrollbar={false}
                    className="w-full"
                    itemClassName="!p-0"
                  />
                </div>
              </div>

              {totalPages > 1 && (
                <div className="flex flex-row items-center justify-between border-t border-white/[0.07] px-4 md:px-8 py-4 bg-white/[0.01] backdrop-blur-xl">
                  <span className="text-white/30 font-mono text-xs uppercase tracking-wider">
                    Page {currentPage} of {totalPages}
                  </span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md text-white/50 hover:text-white hover:border-white/30 hover:bg-white/[0.08] hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] disabled:opacity-30 disabled:pointer-events-none transition-all duration-300"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md text-white/50 hover:text-white hover:border-white/30 hover:bg-white/[0.08] hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] disabled:opacity-30 disabled:pointer-events-none transition-all duration-300"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
