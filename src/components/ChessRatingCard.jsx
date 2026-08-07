"use client";

import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { motion } from "framer-motion";

export default function ChessRatingCard({ username, timeClass, currentRating }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        // 1. Fetch archives
        const archivesRes = await fetch(
          `https://api.chess.com/pub/player/${username}/games/archives`
        );
        if (!archivesRes.ok) throw new Error("Failed to fetch archives");
        const archivesData = await archivesRes.json();

        if (!archivesData.archives || archivesData.archives.length === 0) {
          setLoading(false);
          return;
        }

        // 2. Fetch up to last 3 months to ensure we get games (especially for Rapid)
        const recentArchives = archivesData.archives.slice(-3);
        let timeClassGames = [];

        for (const url of recentArchives) {
          try {
            const monthRes = await fetch(url);
            if (monthRes.ok) {
              const monthData = await monthRes.json();
              const games = monthData.games || [];
              timeClassGames.push(
                ...games.filter((g) => g.time_class === timeClass.toLowerCase())
              );
            }
          } catch (e) {
            console.error("Error fetching month:", e);
          }
        }

        const ratings = timeClassGames.map((g) => {
          const isWhite = g.white.username.toLowerCase() === username.toLowerCase();
          return isWhite ? g.white.rating : g.black.rating;
        });

        // We only care about the last 10 games to prevent the chart from looking too sharp/jagged
        setHistory(ratings.slice(-10));
      } catch (err) {
        console.error("Error fetching chess.com history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [username, timeClass]);

  // Calculate Delta
  let delta = 0;
  if (history.length >= 2) {
    delta = history[history.length - 1] - history[history.length - 2];
  }

  // Fallback to currentRating if we have no history but we have the current rating
  const displayRating = history.length > 0 ? history[history.length - 1] : currentRating;

  let iconPath = "m11.97 14.63c-.9 0-1.87-.73-1.5-2.23l1.03-4.4h1l1.03 4.37c.37 1.53-.63 2.27-1.57 2.27zm.03 7.87c-5.23 0-9.5-4.27-9.5-9.5s4.27-9.5 9.5-9.5 9.5 4.27 9.5 9.5-4.27 9.5-9.5 9.5zm0-3c4 0 6.5-2.5 6.5-6.5s-2.5-6.5-6.5-6.5-6.5 2.5-6.5 6.5 2.5 6.5 6.5 6.5zm-1.5-14.27v-4.23h3v4.23zm5-3.23h-7c0-1.7.43-2 3.5-2s3.5.3 3.5 2zm0 0";
  let iconColor = "#7ea349"; // Rapid green
  if (timeClass.toLowerCase() === "blitz") {
    iconPath = "m5.77 15c-1.03 0-1.37-.4-1.2-1.4l1.53-10.2c.17-1 .63-1.4 1.67-1.4h5.8c1.03 0 1.33.4 1.07 1.37l-3.23 11.63zm13.06-6c1.03 0 1.2.33.57 1.13l-9.67 12.73c-1.23 1.63-1.6 1.47-1.27-.57l2.2-13.3zm0 0";
    iconColor = "#f6c53f"; // Blitz yellow
  } else if (timeClass.toLowerCase() === "bullet") {
    iconPath = "m7.17 15.3 1.43 1.47-8.27 6.9zm-6.87 2.3 4.5-6 .9 2zm10.47-7.5c3.47-3.6 5.93-5.2 8.7-6.4-2.4 0-5.3.37-9.8 4.6.03.5.7 1.47 1.1 1.8zm11.06-7.93s.23 1.1.23 2.77c0 2.67-.67 6.83-4.17 10.33l-2.17 2.17c-.67.67-1.33.6-2.13.27l-7.47 6.3 9.8-12.17-5.23 4.03c-.43-.4-.93-.83-1.33-1.23-1.73-1.7-4.13-5-2.77-6.37l2.2-2.13c3.53-3.5 7.63-4.2 10.3-4.2 1.63 0 2.73.23 2.73.23zm0 0";
    iconColor = "#d58936"; // Bullet orange
  }

  // Chart rendering logic
  const width = 300;
  const height = 60;
  
  let pathD = "";
  let areaD = "";
  if (history.length > 1) {
    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = max - min === 0 ? 1 : max - min;
    
    // Slight padding to range
    const paddedMin = min - range * 0.2;
    const paddedMax = max + range * 0.2;
    const paddedRange = paddedMax - paddedMin;

    const points = history.map((val, i) => {
      const x = (i / (history.length - 1)) * width;
      const y = height - ((val - paddedMin) / paddedRange) * height;
      return { x, y };
    });

    // Straight line chart (connect the dots)
    pathD = `M ${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const p = points[i];
      pathD += ` L ${p.x},${p.y}`;
    }
    
    // Close the path for the area fill
    areaD = `${pathD} L ${width},${height} L 0,${height} Z`;
  }

  return (
    <div className="bg-[#1b1a18] border border-white/5 p-4 flex flex-col justify-between h-36 relative overflow-hidden group hover:border-white/10 transition-colors">
      <div className="relative z-10 flex justify-between items-start">
        <div className="flex gap-3">
          <div className="pt-1">
            <svg
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill={iconColor}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d={iconPath} />
            </svg>
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-medium text-white/70 tracking-wide">
              {timeClass}
            </h3>
            <div className="text-[28px] font-extrabold text-white leading-none mt-0.5">
              {loading ? "..." : displayRating || "—"}
            </div>
          </div>
        </div>

        {/* Delta Indicator */}
        {!loading && displayRating && (
          <div className={`flex items-center text-[13px] font-bold pt-1 ${delta > 0 ? 'text-[#7ea349]' : delta < 0 ? 'text-[#ff3333]' : 'text-white/40'}`}>
            {delta > 0 && <ArrowUp size={14} className="mr-0.5" />}
            {delta < 0 && <ArrowDown size={14} className="mr-0.5" />}
            {delta === 0 && <Minus size={14} className="mr-0.5" />}
            {Math.abs(delta)}
          </div>
        )}
      </div>

      {/* Area Chart Background */}
      {!loading && history.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 w-full h-[60px] opacity-80">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full preserve-3d"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={`gradient-${timeClass}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#4bb8d4" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#4bb8d4" stopOpacity="0.0" />
              </linearGradient>
              <clipPath id={`clip-reveal-${timeClass}`}>
                <motion.rect
                  x="0"
                  y="0"
                  height={height}
                  initial={{ width: 0 }}
                  animate={{ width: width }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              </clipPath>
            </defs>
            <g clipPath={`url(#clip-reveal-${timeClass})`}>
              <path
                d={areaD}
                fill={`url(#gradient-${timeClass})`}
              />
              <path
                d={pathD}
                fill="none"
                stroke="#4bb8d4"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          </svg>
        </div>
      )}
    </div>
  );
}
