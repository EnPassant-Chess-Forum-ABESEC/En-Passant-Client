"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const MONO = { stroke: "#c8c8c8", gradientFrom: "#c8c8c8" };

const TIME_CLASS_CONFIG = {
  rapid: { label: "Rapid", ...MONO, icon: "rapid" },
  blitz: { label: "Blitz", ...MONO, icon: "blitz" },
  bullet: { label: "Bullet", ...MONO, icon: "bullet" },
};

function RapidIcon({ size = 22 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="m11.97 14.63c-.9 0-1.87-.73-1.5-2.23l1.03-4.4h1l1.03 4.37c.37 1.53-.63 2.27-1.57 2.27zm.03 7.87c-5.23 0-9.5-4.27-9.5-9.5s4.27-9.5 9.5-9.5 9.5 4.27 9.5 9.5-4.27 9.5-9.5 9.5zm0-3c4 0 6.5-2.5 6.5-6.5s-2.5-6.5-6.5-6.5-6.5 2.5-6.5 6.5 2.5 6.5 6.5 6.5zm-1.5-14.27v-4.23h3v4.23zm5-3.23h-7c0-1.7.43-2 3.5-2s3.5.3 3.5 2zm0 0" />
    </svg>
  );
}

function BlitzIcon({ size = 22 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="m5.77 15c-1.03 0-1.37-.4-1.2-1.4l1.53-10.2c.17-1 .63-1.4 1.67-1.4h5.8c1.03 0 1.33.4 1.07 1.37l-3.23 11.63zm13.06-6c1.03 0 1.2.33.57 1.13l-9.67 12.73c-1.23 1.63-1.6 1.47-1.27-.57l2.2-13.3zm0 0" />
    </svg>
  );
}

function BulletIcon({ size = 22 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="m7.17 15.3 1.43 1.47-8.27 6.9zm-6.87 2.3 4.5-6 .9 2zm10.47-7.5c3.47-3.6 5.93-5.2 8.7-6.4-2.4 0-5.3.37-9.8 4.6.03.5.7 1.47 1.1 1.8zm11.06-7.93s.23 1.1.23 2.77c0 2.67-.67 6.83-4.17 10.33l-2.17 2.17c-.67.67-1.33.6-2.13.27l-7.47 6.3 9.8-12.17-5.23 4.03c-.43-.4-.93-.83-1.33-1.23-1.73-1.7-4.13-5-2.77-6.37l2.2-2.13c3.53-3.5 7.63-4.2 10.3-4.2 1.63 0 2.73.23 2.73.23zm0 0" />
    </svg>
  );
}

const ICONS = {
  rapid: (size) => <RapidIcon size={size} />,
  blitz: (size) => <BlitzIcon size={size} />,
  bullet: (size) => <BulletIcon size={size} />,
};

export default function ChessRatingCard({
  username,
  timeClass,
  currentRating,
  variant = "default",
}) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const key = timeClass.toLowerCase();
  const config = TIME_CLASS_CONFIG[key] || TIME_CLASS_CONFIG.rapid;
  const isHero = variant === "hero";

  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        const archivesRes = await fetch(
          `https://api.chess.com/pub/player/${username}/games/archives`,
        );
        if (!archivesRes.ok) throw new Error("Failed to fetch archives");
        const archivesData = await archivesRes.json();
        if (!archivesData.archives?.length) {
          setLoading(false);
          return;
        }

        let timeClassGames = [];
        const maxMonthsToCheck = 12;
        let monthsChecked = 0;

        for (let i = archivesData.archives.length - 1; i >= 0; i--) {
          if (monthsChecked >= maxMonthsToCheck) break;
          const url = archivesData.archives[i];
          try {
            const monthRes = await fetch(url);
            if (monthRes.ok) {
              const monthData = await monthRes.json();
              const games = monthData.games || [];
              const relevantGames = games.filter((g) => g.time_class === key);

              timeClassGames = [...relevantGames, ...timeClassGames];

              if (timeClassGames.length >= 12) break;
            }
          } catch (e) {}
          monthsChecked++;
        }

        const ratings = timeClassGames.map((g) => {
          const isWhite =
            g.white.username.toLowerCase() === username.toLowerCase();
          return isWhite ? g.white.rating : g.black.rating;
        });
        setHistory(ratings.slice(-12));
      } catch (err) {
        console.error("Error fetching chess.com history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory().catch(() => setLoading(false));
  }, [username, timeClass]);

  let delta = 0;
  if (history.length >= 2) {
    delta = history[history.length - 1] - history[history.length - 2];
  }
  const displayRating =
    history.length > 0 ? history[history.length - 1] : currentRating;

  const W = 260;
  const H = 52;
  let pathD = "",
    areaD = "";

  if (history.length > 1) {
    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = max - min === 0 ? 1 : max - min;
    const paddedMin = min - range * 0.15;
    const paddedMax = max + range * 0.15;
    const paddedRange = paddedMax - paddedMin;

    if (isHero) {
      const curveTop = 74;
      const curveH = H;
      const pts = history.map((val, i) => ({
        x: (i / (history.length - 1)) * W,
        y: curveTop + curveH - ((val - paddedMin) / paddedRange) * curveH,
      }));
      pathD = `M ${pts[0].x},${pts[0].y}`;
      for (let i = 1; i < pts.length; i++)
        pathD += ` L ${pts[i].x},${pts[i].y}`;
      areaD = `${pathD} L ${W},200 L 0,200 Z`;
    } else {
      const pts = history.map((val, i) => ({
        x: (i / (history.length - 1)) * W,
        y: H - ((val - paddedMin) / paddedRange) * H,
      }));
      pathD = `M ${pts[0].x},${pts[0].y}`;
      for (let i = 1; i < pts.length; i++)
        pathD += ` L ${pts[i].x},${pts[i].y}`;
      areaD = `${pathD} L ${W},${H} L 0,${H} Z`;
    }
  }

  const gradId = `grad-${key}-${isHero ? "hero" : "default"}`;

  if (isHero) {
    return (
      <div
        className="relative overflow-hidden bg-[#0a0a0a] flex flex-col h-full"
        style={{ minHeight: 200 }}
      >
        <div className="relative z-10 flex items-center justify-between px-5 pt-5 pb-2">
          <div className="flex items-center gap-2">
            <div className="text-white/20">{ICONS[key](28)}</div>
            <p className="text-[15px] font-semibold normalcase tracking-[0.1em] text-white/25">
              {config.label}
            </p>
          </div>
          <p className="text-[40px] font-black leading-none text-white">
            {loading ? "···" : displayRating || "—"}
          </p>
        </div>

        <div className="absolute inset-0 w-full h-full">
          {!loading && history.length > 1 && (
            <svg
              viewBox={`0 0 ${W} 200`}
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={config.gradientFrom}
                    stopOpacity="0.35"
                  />
                  <stop
                    offset="100%"
                    stopColor={config.gradientFrom}
                    stopOpacity="0.0"
                  />
                </linearGradient>
                <clipPath id={`clip-${key}-hero`}>
                  <motion.rect
                    x="0"
                    y="0"
                    height="200"
                    initial={{ width: 0 }}
                    animate={{ width: W }}
                    transition={{ duration: 1.4, ease: "easeInOut" }}
                  />
                </clipPath>
              </defs>
              <g clipPath={`url(#clip-${key}-hero)`}>
                <path d={areaD} fill={`url(#${gradId})`} />
                <path
                  d={pathD}
                  fill="none"
                  stroke={config.stroke}
                  strokeWidth="1.8"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            </svg>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden bg-[#0a0a0a] flex flex-col justify-between"
      style={{ minHeight: 120 }}
    >
      <div className="relative z-10 flex items-center justify-between px-5 pt-5 pb-2">
        <div className="flex items-center gap-2">
          <div className="text-white/20">{ICONS[key](22)}</div>
          <p className="text-[15px] font-semibold normalcase tracking-[0.1em] text-white/25">
            {config.label}
          </p>
        </div>
        <p className="text-[26px] font-black leading-none text-white">
          {loading ? "···" : displayRating || "—"}
        </p>
      </div>

      {/* SVG area chart pinned to bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 w-full"
        style={{ height: H }}
      >
        {!loading && history.length > 1 && (
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={config.gradientFrom}
                  stopOpacity="0.35"
                />
                <stop
                  offset="100%"
                  stopColor={config.gradientFrom}
                  stopOpacity="0.0"
                />
              </linearGradient>
              <clipPath id={`clip-${key}`}>
                <motion.rect
                  x="0"
                  y="0"
                  height={H}
                  initial={{ width: 0 }}
                  animate={{ width: W }}
                  transition={{ duration: 1.4, ease: "easeInOut" }}
                />
              </clipPath>
            </defs>
            <g clipPath={`url(#clip-${key})`}>
              <path d={areaD} fill={`url(#${gradId})`} />
              <path
                d={pathD}
                fill="none"
                stroke={config.stroke}
                strokeWidth="1.8"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          </svg>
        )}
      </div>

      {/* Bottom spacer so chart doesn't overlap text */}
      <div style={{ height: H / 2 }} />
    </div>
  );
}
