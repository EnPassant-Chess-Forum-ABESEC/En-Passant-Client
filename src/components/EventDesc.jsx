"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const premiumEase = [0.16, 1, 0.3, 1];

export default function EventDesc({ initialDescription = "" }) {
  const [description, setDescription] = useState(initialDescription);
  const [loading, setLoading] = useState(!initialDescription);

  useEffect(() => {
    let isMounted = true;
    async function loadEventDescription() {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
        const res = await fetch(`${apiUrl}/events`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        const eventsList = data?.events || [];

        const targetEvent =
          eventsList.find(
            (e) =>
              e.status === "active" ||
              e.status === "in_progress" ||
              e.status === "upcoming",
          ) || eventsList[0];

        if (isMounted) {
          if (targetEvent?.description) {
            setDescription(targetEvent.description);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("Error loading event description from API:", err);
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadEventDescription();
    return () => {
      isMounted = false;
    };
  }, []);

  const paragraphs = (description || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section className="relative w-full min-h-[80vh] md:min-h-screen bg-[#050505] flex flex-col justify-center py-24 md:py-36 px-0 overflow-hidden select-none">
      <div className="absolute top-0 left-0 w-full h-32 sm:h-48 md:h-64 bg-gradient-to-b from-[#050505] via-[#050505]/80 to-transparent z-10 pointer-events-none" />

      <div
        className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-red-950/20 rounded-full blur-[130px] pointer-events-none z-0"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-8 md:px-11 flex flex-col items-start text-left">
        <h2
          className="flex flex-col uppercase leading-[0.9] select-none"
          style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
          }}
        >
          {/* Line 1: Elegant, Wide-Tracked Royal Prefix */}
          <span
            className="block font-black tracking-[0.2em] text-[clamp(26px,4vw,52px)] leading-none bg-gradient-to-b from-[#ffffff] via-[#e2e8f0] to-[#94a3b8] bg-clip-text text-transparent"
            style={{
              filter:
                "drop-shadow(0 2px 8px rgba(0,0,0,0.9)) drop-shadow(0 0 12px rgba(255,255,255,0.15))",
            }}
          >
            MONARCH&apos;S
          </span>

          {/* Line 2: Colossal, Heavyweight Ruby Anchor Title */}
          <span
            className="block font-black tracking-[0.03em] text-[clamp(54px,8.8vw,120px)] leading-[0.9] mt-2 bg-gradient-to-b from-[#ff6b6b] via-[#ef4444] via-[#dc2626] to-[#7f1d1d] bg-clip-text text-transparent"
            style={{
              filter:
                "drop-shadow(0 4px 14px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 20px rgba(220, 38, 38, 0.25))",
            }}
          >
            MANUSCRIPT
          </span>
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, delay: 0.15, ease: premiumEase }}
          className="mt-8 sm:mt-10 md:mt-14 space-y-6 max-w-4xl"
        >
          {loading && !description ? (
            <div className="space-y-4 max-w-3xl animate-pulse">
              <div className="h-5 bg-white/10 rounded w-full" />
              <div className="h-5 bg-white/10 rounded w-5/6" />
              <div className="h-5 bg-white/10 rounded w-4/6" />
            </div>
          ) : paragraphs.length > 0 ? (
            paragraphs.map((para, idx) => (
              <p
                key={idx}
                className="text-base sm:text-lg md:text-[20px] text-slate-200 font-normal leading-relaxed md:leading-[1.85] tracking-[0.015em]"
                style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif" }}
              >
                {para}
              </p>
            ))
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
