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
    <section className="relative w-full min-h-[80vh] md:min-h-screen bg-[#050505] flex flex-col justify-center py-24 md:py-36 px-6 sm:px-12 md:px-16 lg:px-24 overflow-hidden select-none">
      {/* Subtle radial atmosphere to enrich the dark canvas */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(circle at 20% 30%, rgba(139, 29, 29, 0.08) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-start text-left">
        {/* Headline: MONARCH'S MANUSCRIPT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: premiumEase }}
          className="flex flex-col uppercase font-black tracking-tight"
        >
          <span
            className="text-white text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.92]"
            style={{
              textShadow: "0 0 35px rgba(255, 255, 255, 0.3)",
            }}
          >
            MONARCH&apos;S
          </span>
          <span className="text-[#8b1d1d] text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.92] mt-1 sm:mt-2">
            MANUSCRIPT
          </span>
        </motion.div>

        {/* Event Description Body */}
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
