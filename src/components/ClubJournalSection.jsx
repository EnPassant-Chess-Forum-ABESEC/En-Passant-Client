"use client";

import React from "react";
import { motion } from "framer-motion";

const premiumEase = [0.16, 1, 0.3, 1];

const dark = { backgroundColor: "#0a0a0a" };
const light = {
  backgroundImage: 'url("/white_marble_texture.png")',
  backgroundSize: "cover",
  backgroundPosition: "center",
};

function D() {
  return <div className="aspect-square border border-white/5" style={dark} />;
}
function W() {
  return <div className="aspect-square border border-black/10" style={light} />;
}

function JournalImage({ src, fit = "cover" }) {
  let fitClass = "bg-cover bg-center";
  if (fit === "contain") fitClass = "bg-contain bg-no-repeat bg-center";
  if (fit === "cover-top") fitClass = "bg-cover bg-top";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1.2, ease: premiumEase }}
      className="aspect-square relative overflow-hidden group cursor-pointer bg-[#0a0a0a]"
    >
      <div
        className={`absolute inset-0 ${fitClass} transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] grayscale opacity-50 mix-blend-luminosity group-hover:mix-blend-normal group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-[1.03]`}
        style={{ backgroundImage: `url(${src})` }}
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700 pointer-events-none" />
    </motion.div>
  );
}

function JournalText({ date, title, text, align }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1.2, ease: premiumEase }}
      className="aspect-square flex flex-col justify-center p-4 sm:p-6 md:p-10 border border-black/10 group cursor-pointer overflow-hidden"
      style={light}
    >
      <div
        className={`flex flex-col ${align === "right" ? "items-end text-right" : "items-start text-left"}`}
      >
        <span className="text-[#9b1a1a] font-sans font-medium text-[2.5vw] sm:text-[11px] tracking-[0.15em] uppercase mb-1 sm:mb-2 md:mb-4">
          {date}
        </span>
        <h3 className="text-[#0a0a0a] font-pezula font-bold group-hover:font-black text-[4vw] sm:text-[18px] tracking-[0.05em] uppercase mb-1 sm:mb-2 md:mb-4 leading-tight transition-all duration-200 ease-in-out">
          {title}
        </h3>
        <p className="text-[#0a0a0a]/80 font-sans font-normal text-[3vw] sm:text-[13px] leading-[1.5] sm:leading-[1.7] line-clamp-4 sm:line-clamp-none">
          {text}
        </p>
      </div>
    </motion.div>
  );
}

const journalEntries = [
  {
    date: "FEBRUARY 15, 2026",
    title: "RANN — SPORTS FEST",
    text: "En Passant team showcased their brilliance at Inter College Sports Fest — RANN 26 hosted by KIET, secruing 1st runner up in the event.",
    image: "/journal/rann2026.png",
    fit: "cover",
    desktopLayout: ["D", "T-right", "I", "W"],
  },
  {
    date: "APRIL 10, 2025",
    title: "Grandmaster Simul",
    text: "Top 5 candidates from the En-Passant Chess Community took on the ultimate challenge — a 5-board simul against a Grandmaster!",
    image: "/journal/gm_interaction.webp",
    fit: "cover",
    desktopLayout: ["W", "D", "T-right", "I"],
  },
  {
    date: "APRIL 27, 2025",
    title: "Queens Duel At ACC",
    text: "During ACC 2025, En Passant saw its highest count in female participation.",
    image: "/journal/queens.png",
    fit: "cover-top",
    desktopLayout: ["I", "T-left", "D", "W"],
  },
  {
    date: "APRIL 22, 2025",
    title: "ABES Chess Championship 2025",
    text: "En Passant's flagship solo tournament that would crown the best chess player in the campus.",
    image: "/journal/acc_poster.webp",
    fit: "cover",
    desktopLayout: ["T-right", "I", "W", "D"],
  },
  {
    date: "NOVEMBER 8, 2026",
    title: "KNIGHTMARES 2.0",
    text: "En Passant's flagship team tournament which honoured the knights of the garrison.",
    image: "/journal/knightmares_2026.png",
    fit: "cover",
    desktopLayout: ["D", "W", "I", "T-left"],
  },
  {
    date: "August 17, 2026",
    title: "CLUB RECRUITMENT",
    text: "Ready to make your move? Join the En Passant community! Tryouts, orientations, and casual game nights begin soon.",
    image: "/journal/image.png",
    fit: "cover-top",
    desktopLayout: ["T-right", "I", "W", "D"],
  },
];

export default function ClubJournalSection() {
  return (
    <section
      className="relative w-full font-sans"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      <div className="relative w-full h-[30vw] md:h-[14vw]">
        <div className="absolute top-0 right-0 flex flex-col items-end justify-start pt-[6vw] md:pt-[1.5vw] pr-[6vw] md:pr-[2vw] z-30">
          <h2
            className="text-white font-pezula font-bold uppercase text-right leading-[0.88] tracking-[0.04em] md:tracking-[0.08em] text-[14vw] sm:text-[10vw] md:text-[5.5vw]"
            style={{ fontSize: "clamp(3rem, 10vw, 6.5rem)" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.2, ease: premiumEase }}
              className="drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              CLUB
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.2, ease: premiumEase, delay: 0.15 }}
              className="text-[#9b1a1a] drop-shadow-[0_0_20px_rgba(155,26,26,0.4)]"
            >
              JOURNAL
            </motion.div>
          </h2>
        </div>
      </div>

      {/* MOBILE GRID */}
      <div className="relative grid grid-cols-2 md:hidden w-full overflow-hidden">
        {journalEntries.map((entry, idx) => {
          const ImageBlock = (
            <JournalImage
              key={`m-img-${idx}`}
              src={entry.image}
              fit={entry.fit}
            />
          );
          const TextBlock = (
            <JournalText
              key={`m-txt-${idx}`}
              align="left"
              date={entry.date}
              title={entry.title}
              text={entry.text}
            />
          );

          return (
            <React.Fragment key={`m-${idx}`}>
              {idx % 2 === 0 ? (
                <>
                  {ImageBlock}
                  {TextBlock}
                </>
              ) : (
                <>
                  {TextBlock}
                  {ImageBlock}
                </>
              )}
            </React.Fragment>
          );
        })}

        {/* Removed overlapping top shadow */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none h-[30vw] z-10"
          style={{
            background: "linear-gradient(to top, #0a0a0a 0%, transparent 100%)",
          }}
        />
      </div>

      {/* DESKTOP GRID */}
      <div className="relative hidden md:grid grid-cols-4 w-full overflow-hidden">
        {journalEntries.map((entry, idx) => (
          <React.Fragment key={`d-${idx}`}>
            {entry.desktopLayout.map((type, i) => {
              if (type === "D") return <D key={`d-${idx}-${i}`} />;
              if (type === "W") return <W key={`d-${idx}-${i}`} />;
              if (type === "I")
                return (
                  <JournalImage
                    key={`d-${idx}-${i}`}
                    src={entry.image}
                    fit={entry.fit}
                  />
                );
              if (type === "T-left")
                return (
                  <JournalText
                    key={`d-${idx}-${i}`}
                    align="left"
                    date={entry.date}
                    title={entry.title}
                    text={entry.text}
                  />
                );
              if (type === "T-right")
                return (
                  <JournalText
                    key={`d-${idx}-${i}`}
                    align="right"
                    date={entry.date}
                    title={entry.title}
                    text={entry.text}
                  />
                );
              return null;
            })}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
