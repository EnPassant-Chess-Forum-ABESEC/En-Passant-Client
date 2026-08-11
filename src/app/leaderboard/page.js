"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/lib/api";
import SpotlightCard from "@/components/SpotlightCard";
import { motion } from "framer-motion";

const MEDAL_COLORS = [
  {
    color: "text-[#eab308]",
    glow: "drop-shadow-[0_0_16px_rgba(234,179,8,0.6)]",
    border: "border-[#eab308]/30",
    ring: "rgba(234,179,8,0.15)",
  },
  {
    color: "text-[#94a3b8]",
    glow: "drop-shadow-[0_0_12px_rgba(148,163,184,0.5)]",
    border: "border-[#94a3b8]/30",
    ring: "rgba(148,163,184,0.1)",
  },
  {
    color: "text-[#cd7c3c]",
    glow: "drop-shadow-[0_0_12px_rgba(205,124,60,0.5)]",
    border: "border-[#cd7c3c]/30",
    ring: "rgba(205,124,60,0.1)",
  },
];

export default function LeaderboardPage() {
  const fetchApi = useApi();
  const [timeControl, setTimeControl] = useState("rapid");
  const [leaderboard, setLeaderboard] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [timeControl]);

  useEffect(() => {
    loadMyRank();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await fetchApi(
        `/leaderboard?timeControl=${timeControl}&limit=20`,
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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <div className="relative w-full bg-[#050505] font-sans overflow-hidden">
      {/* ──────────────────────────────────────────
          ABOVE-GRID HEADER — normal flow, right-aligned
          Sits above the chess board section
         ────────────────────────────────────────── */}
      <div className="relative z-30 w-full pt-32 pb-0 px-6 md:px-[4vw] flex flex-col items-end text-right">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="uppercase font-cinzel font-bold leading-[0.85] tracking-[0.04em] md:tracking-[0.06em]">
            <span className="inline-block text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.4)] text-[12vw] md:text-[80px]">
              LEADER
            </span>
            <span className="inline-block text-[#9b1a1a] drop-shadow-[0_0_30px_rgba(155,26,26,0.6)] text-[12vw] md:text-[80px] ml-4 md:ml-6">
              BOARD
            </span>
          </h1>
        </motion.div>

        {/* Time controls + My Rank in one row below title, right aligned */}
        {/* 
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-end gap-4 mt-6 mb-0"
        >
          {myRank && (
            <div className="flex flex-wrap gap-5 text-xs uppercase tracking-widest font-mono text-white/50 border-r border-white/10 pr-4">
              <span>
                Rapid:{" "}
                <span className="text-[#9b1a1a]">
                  {myRank.rapid?.rank ? `#${myRank.rapid.rank}` : "—"}
                </span>{" "}
                ({myRank.rapid?.rating ?? "—"})
              </span>
              <span>
                Blitz:{" "}
                <span className="text-[#9b1a1a]">
                  {myRank.blitz?.rank ? `#${myRank.blitz.rank}` : "—"}
                </span>{" "}
                ({myRank.blitz?.rating ?? "—"})
              </span>
              <span>
                Bullet:{" "}
                <span className="text-[#9b1a1a]">
                  {myRank.bullet?.rank ? `#${myRank.bullet.rank}` : "—"}
                </span>{" "}
                ({myRank.bullet?.rating ?? "—"})
              </span>
            </div>
          )}

          <div className="flex gap-2">
            {["rapid", "blitz", "bullet"].map((tc) => (
              <button
                key={tc}
                onClick={() => setTimeControl(tc)}
                className={`px-5 py-2 uppercase font-cinzel font-bold tracking-widest text-xs transition-all duration-300 border ${
                  timeControl === tc
                    ? "bg-[#9b1a1a] text-white border-transparent shadow-[0_0_20px_rgba(155,26,26,0.4)]"
                    : "bg-transparent text-white/40 border-white/10 hover:text-white hover:border-white/30"
                }`}
              >
                {tc}
              </button>
            ))}
          </div>
        </motion.div>
        */}
      </div>

      {/* ──────────────────────────────────────────
          CHESS GRID SECTION
          Same system as NumbersSection.
          Grid cells: 12vw × 12vw, offset 2vw from left.
          Col positions: A=2vw, B=14vw, C=26vw, D=38vw, E=50vw, F=62vw, G=74vw, H=86vw
          Each 2×2 card = w-[24vw] h-[24vw]
         ────────────────────────────────────────── */}
      <div className="relative w-full h-[340vw] md:h-[96vw]">
        {/* Dark Marble Texture */}
        <div
          className="absolute inset-0 z-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: 'url("/dark_marble_bg.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 z-0 bg-black/60 pointer-events-none" />

        {/* Desktop Chess Board Grid lines */}
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

        {/* Mobile 2×4 grid borders */}
        <div className="absolute top-0 left-0 w-full h-full z-0 md:hidden flex flex-wrap pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="w-[50vw] h-[42.5vw] border border-white/[0.05]"
            />
          ))}
        </div>

        {/* Column Labels A–H (Desktop) */}
        <div className="absolute top-0 w-full px-[2vw] hidden md:flex text-white/20 text-[10px] font-mono pt-2 z-10">
          {["A", "B", "C", "D", "E", "F", "G", "H"].map((col) => (
            <div key={col} className="w-[12vw] text-center">
              {col}
            </div>
          ))}
        </div>

        {/* Row Labels Left (Desktop) */}
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

        {/* Row Labels Right (Desktop) */}
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

        {/* Inner grid content */}
        <div className="relative w-full h-full">
          {/* ── LEFT TEXT BLOCK — Cols A–B, Ranks 2–4 (w=24vw h=36vw from left=2vw top=12vw) ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 md:left-[2vw] top-[6vw] md:top-[12vw] w-[100vw] md:w-[24vw] h-auto md:h-[36vw] z-20 flex flex-col justify-center px-6 py-[4vw] md:p-[3vw] md:border-r border-white/[0.06]"
          >
            <p className="font-cinzel font-bold uppercase text-[8vw] md:text-[2.2vw] tracking-[0.05em] text-white leading-[1.1] mb-6 break-words w-full">
              TOP
              <br />
              PLAYERS
              <br />
              OF THE
              <br />
              COMMUNITY
            </p>
            <div className="w-8 h-px bg-[#9b1a1a] mb-3" />
            <p className="text-white/40 font-mono text-[3vw] md:text-[0.7vw] uppercase tracking-widest leading-[1.8]">
              Ranked by
              <br />
              {timeControl.charAt(0).toUpperCase() + timeControl.slice(1)}{" "}
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
          </motion.div>

          {/* ── PLAYER #1 — Cols C–D (left-[26vw]), Rows 3–5 (top-[24vw]) ── */}
          {top3[0] && (
            <motion.div
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={cardVariants}
              className="absolute top-[50vw] md:top-[24vw] left-0 md:left-[26vw] w-[50vw] md:w-[24vw] h-[75vw] md:h-[36vw] z-20 flex flex-col"
            >
              {/* Profile Image Area (2x2) */}
              <div className={`w-full h-[50vw] md:h-[24vw] bg-[#050505] border ${MEDAL_COLORS[0].border} relative overflow-hidden group`}>
                {(top3[0].profilePic || top3[0].imageUrl || top3[0].profilePictureUrl) ? (
                  <img src={top3[0].profilePic || top3[0].imageUrl || top3[0].profilePictureUrl} alt={top3[0].username || top3[0].userName} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#111] to-black">
                    <span className={`font-cinzel font-bold text-[15vw] md:text-[6vw] ${MEDAL_COLORS[0].color} ${MEDAL_COLORS[0].glow} leading-none`}>
                      #1
                    </span>
                    <span className="font-mono text-[3vw] md:text-[1vw] uppercase tracking-widest text-white/40 mt-2">
                      {top3[0].rating}
                    </span>
                  </div>
                )}
                {(top3[0].profilePic || top3[0].imageUrl || top3[0].profilePictureUrl) && (
                  <div className={`absolute top-4 left-4 font-cinzel font-bold text-[6vw] md:text-[2.5vw] ${MEDAL_COLORS[0].color} ${MEDAL_COLORS[0].glow} leading-none z-10`}>
                    #1
                  </div>
                )}
              </div>
              {/* Details Area (1x2) */}
              <div className="w-full flex-1 bg-[#0a0a0a] border-t border-white/5 flex flex-col justify-center px-[4vw] md:px-[2vw]">
                <h3 className="text-white font-cinzel font-bold text-[5vw] md:text-[1.8vw] leading-tight truncate">
                  {top3[0].username || top3[0].userName}
                </h3>
                <p className="text-white/60 font-mono text-[2.5vw] md:text-[0.7vw] uppercase tracking-widest truncate mt-1">
                  {top3[0].branch}{top3[0].year ? ` · Y${top3[0].year}` : ""}
                </p>
              </div>
            </motion.div>
          )}

          {/* ── PLAYER #2 — Cols G–H (left-[74vw]), Rows 4–6 (top-[36vw]) ── */}
          {top3[1] && (
            <motion.div
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={cardVariants}
              className="absolute top-[125vw] md:top-[36vw] left-[50vw] md:left-[74vw] w-[50vw] md:w-[24vw] h-[75vw] md:h-[36vw] z-20 flex flex-col"
            >
              {/* Profile Image Area (2x2) */}
              <div className={`w-full h-[50vw] md:h-[24vw] bg-[#050505] border ${MEDAL_COLORS[1].border} relative overflow-hidden group`}>
                {(top3[1].profilePic || top3[1].imageUrl || top3[1].profilePictureUrl) ? (
                  <img src={top3[1].profilePic || top3[1].imageUrl || top3[1].profilePictureUrl} alt={top3[1].username || top3[1].userName} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#111] to-black">
                    <span className={`font-cinzel font-bold text-[15vw] md:text-[6vw] ${MEDAL_COLORS[1].color} ${MEDAL_COLORS[1].glow} leading-none`}>
                      #2
                    </span>
                    <span className="font-mono text-[3vw] md:text-[1vw] uppercase tracking-widest text-white/40 mt-2">
                      {top3[1].rating}
                    </span>
                  </div>
                )}
                {(top3[1].profilePic || top3[1].imageUrl || top3[1].profilePictureUrl) && (
                  <div className={`absolute top-4 left-4 font-cinzel font-bold text-[6vw] md:text-[2.5vw] ${MEDAL_COLORS[1].color} ${MEDAL_COLORS[1].glow} leading-none z-10`}>
                    #2
                  </div>
                )}
              </div>
              {/* Details Area (1x2) */}
              <div className="w-full flex-1 bg-[#0a0a0a] border-t border-white/5 flex flex-col justify-center px-[4vw] md:px-[2vw]">
                <h3 className="text-white font-cinzel font-bold text-[5vw] md:text-[1.8vw] leading-tight truncate">
                  {top3[1].username || top3[1].userName}
                </h3>
                <p className="text-white/60 font-mono text-[2.5vw] md:text-[0.7vw] uppercase tracking-widest truncate mt-1">
                  {top3[1].branch}{top3[1].year ? ` · Y${top3[1].year}` : ""}
                </p>
              </div>
            </motion.div>
          )}

          {/* ── PLAYER #3 — Cols A–B (left-[2vw]), Rows 6–8 (top-[60vw]) ── */}
          {top3[2] && (
            <motion.div
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={cardVariants}
              className="absolute top-[200vw] md:top-[60vw] left-0 md:left-[2vw] w-[50vw] md:w-[24vw] h-[75vw] md:h-[36vw] z-20 flex flex-col"
            >
              {/* Profile Image Area (2x2) */}
              <div className={`w-full h-[50vw] md:h-[24vw] bg-[#050505] border ${MEDAL_COLORS[2].border} relative overflow-hidden group`}>
                {(top3[2].profilePic || top3[2].imageUrl || top3[2].profilePictureUrl) ? (
                  <img src={top3[2].profilePic || top3[2].imageUrl || top3[2].profilePictureUrl} alt={top3[2].username || top3[2].userName} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#111] to-black">
                    <span className={`font-cinzel font-bold text-[15vw] md:text-[6vw] ${MEDAL_COLORS[2].color} ${MEDAL_COLORS[2].glow} leading-none`}>
                      #3
                    </span>
                    <span className="font-mono text-[3vw] md:text-[1vw] uppercase tracking-widest text-white/40 mt-2">
                      {top3[2].rating}
                    </span>
                  </div>
                )}
                {(top3[2].profilePic || top3[2].imageUrl || top3[2].profilePictureUrl) && (
                  <div className={`absolute top-4 left-4 font-cinzel font-bold text-[6vw] md:text-[2.5vw] ${MEDAL_COLORS[2].color} ${MEDAL_COLORS[2].glow} leading-none z-10`}>
                    #3
                  </div>
                )}
              </div>
              {/* Details Area (1x2) */}
              <div className="w-full flex-1 bg-[#0a0a0a] border-t border-white/5 flex flex-col justify-center px-[4vw] md:px-[2vw]">
                <h3 className="text-white font-cinzel font-bold text-[5vw] md:text-[1.8vw] leading-tight truncate">
                  {top3[2].username || top3[2].userName}
                </h3>
                <p className="text-white/60 font-mono text-[2.5vw] md:text-[0.7vw] uppercase tracking-widest truncate mt-1">
                  {top3[2].branch}{top3[2].year ? ` · Y${top3[2].year}` : ""}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 w-full h-[20vw] bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent z-10 pointer-events-none" />
      </div>

      {/* ──────────────────────────────────────────
          RANK 4+ TABLE
         ────────────────────────────────────────── */}
      {rest.length > 0 && (
        <div className="relative w-full bg-[#050505] z-20 px-4 md:px-[4vw] pb-24">
          {/* Faint continuing grid */}
          <div
            className="absolute inset-0 z-0 opacity-[0.035] pointer-events-none hidden md:block"
            style={{
              backgroundImage: `
                linear-gradient(to right, #ffffff 1px, transparent 1px),
                linear-gradient(to bottom, #ffffff 1px, transparent 1px)
              `,
              backgroundSize: "12vw 12vw",
              backgroundPosition: "2vw 0",
            }}
          />

          <div className="relative z-10 max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-6 border-b border-white/[0.06] pb-4">
              <span className="text-white/15 font-cinzel font-bold text-[10px] uppercase tracking-[0.2em]">
                Rank 4 — {leaderboard.length}
              </span>
              <div className="flex-1 h-px bg-white/[0.04]" />
            </div>

            <div className="border border-white/[0.07] overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-[#0a0a0a] text-white/20 text-[10px] uppercase tracking-widest font-mono">
                  <tr>
                    <th className="p-4 font-normal w-16">Rank</th>
                    <th className="p-4 font-normal">Player</th>
                    <th className="p-4 font-normal hidden md:table-cell">
                      Branch / Year
                    </th>
                    <th className="p-4 font-normal text-right">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {rest.map((player, i) => (
                    <motion.tr
                      key={player.userId}
                      initial={{ opacity: 0, x: -6 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.025 }}
                      className="hover:bg-white/[0.025] transition-colors group"
                    >
                      <td className="p-4 font-mono text-white/20 font-bold text-sm group-hover:text-[#9b1a1a] transition-colors">
                        #{i + 4}
                      </td>
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-9 h-9 md:w-10 md:h-10 bg-[#111] overflow-hidden border border-white/10 shrink-0 flex items-center justify-center">
                          {(player.profilePictureUrl || player.profilePic || player.imageUrl) ? (
                            <img src={player.profilePictureUrl || player.profilePic || player.imageUrl} alt={player.username || player.userName} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
                          ) : (
                            <span className="text-white/20 font-cinzel font-bold text-xs">{player.username?.[0] || player.userName?.[0] || "?"}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-cinzel font-bold text-sm text-white/70 group-hover:text-white transition-colors">
                            {player.username || player.userName}
                          </div>
                          <div className="text-[10px] text-white/20 font-mono mt-0.5">
                            {player.chessComUsername || "—"}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-xs text-white/25 font-mono hidden md:table-cell">
                        {player.branch}
                        {player.year ? ` · Y${player.year}` : ""}
                      </td>
                      <td className="p-4 text-right">
                        <span className="font-cinzel font-bold text-base text-white/60 group-hover:text-white transition-colors tabular-nums">
                          {player.rating}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
