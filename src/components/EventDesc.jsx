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

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-8 md:px-11 flex flex-col items-start text-left">
        <h2
          className="flex flex-col uppercase tracking-[0.04em] md:tracking-[0.08em] leading-[0.82]"
          style={{
            fontFamily: "pezula, sans-serif",
            fontSize: "clamp(44px, 6.8vw, 96px)",
            fontWeight: 700,
          }}
        >
          <span className="flex flex-wrap">
            {Array.from("MONARCH'S").map((letter, i) => (
              <motion.span
                key={i}
                initial={{ y: 35, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  type: "spring",
                  stiffness: 65,
                  damping: 18,
                  delay: i * 0.035,
                }}
                className="inline-block bg-gradient-to-b from-[#ffffff] via-[#e2e2e2] to-[#777777] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                {letter}
              </motion.span>
            ))}
          </span>
          <span className="flex flex-wrap mt-2">
            {Array.from("MANUSCRIPT").map((letter, i) => (
              <motion.span
                key={i}
                initial={{ y: 35, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  type: "spring",
                  stiffness: 65,
                  damping: 18,
                  delay: 0.16 + i * 0.035,
                }}
                className="inline-block text-[#9b1a1a]"
              >
                {letter}
              </motion.span>
            ))}
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
                className="text-sm sm:text-base md:text-lg text-slate-300 font-normal leading-relaxed md:leading-[1.8] tracking-normal"
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
