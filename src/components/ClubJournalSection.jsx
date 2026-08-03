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

function JournalImage({ src }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1.2, ease: premiumEase }}
      className="aspect-square relative overflow-hidden group cursor-pointer bg-[#0a0a0a]"
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] grayscale opacity-50 mix-blend-luminosity group-hover:mix-blend-normal group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-[1.03]"
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
      className="aspect-square flex flex-col justify-center p-4 sm:p-6 md:p-10 border border-black/10"
      style={light}
    >
      <div
        className={`flex flex-col ${align === "right" ? "items-end text-right" : "items-start text-left"}`}
      >
        <span className="text-[#9b1a1a] text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] mb-1 sm:mb-2 md:mb-4">
          {date}
        </span>
        <h3 className="text-[#0a0a0a] text-base sm:text-lg md:text-2xl lg:text-3xl font-normal uppercase tracking-normal mb-1 sm:mb-2 md:mb-4 leading-none">
          {title}
        </h3>
        <p className="text-[#0a0a0a]/70 text-[9px] sm:text-[10px] md:text-xs leading-relaxed font-bold">
          {text}
        </p>
      </div>
    </motion.div>
  );
}

export default function ClubJournalSection() {
  return (
    <section
      className="relative w-full font-sans"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      <div className="relative w-full h-[30vw] md:h-[14vw]">
        <div className="absolute top-0 right-0 flex flex-col items-end justify-start pt-[6vw] md:pt-[1.5vw] pr-[6vw] md:pr-[2vw] z-30">
          <h2
            className="text-white font-black uppercase text-right leading-[0.88] tracking-tight text-[14vw] sm:text-[10vw] md:text-[5.5vw]"
            style={{ fontSize: "clamp(3rem, 10vw, 6.5rem)" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.2, ease: premiumEase }}
            >
              CLUB
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.2, ease: premiumEase, delay: 0.15 }}
            >
              <span style={{ color: "var(--brand-crimson)" }}>JOURNAL</span>
            </motion.div>
          </h2>
        </div>
      </div>

      <div className="relative grid grid-cols-2 md:hidden w-full overflow-hidden">
        <JournalImage src="https://images.unsplash.com/photo-1529699211952-734e80c4d42b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" />
        <JournalText
          align="left"
          date="OCTOBER 12, 2026"
          title="The Sicilian Defense"
          text="Exploring the hyper-aggressive lines of the Najdorf variation and how it reshapes mid-game pressure."
        />

        <JournalText
          align="left"
          date="OCTOBER 28, 2026"
          title="Grandmaster Mindset"
          text="Psychological warfare over the board. Maintaining composure when time trouble hits the clock."
        />
        <JournalImage src="https://images.unsplash.com/photo-1580541832626-2a7151e6fd44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" />

        <JournalImage src="https://images.unsplash.com/photo-1560174038-da43ac74f01b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" />
        <JournalText
          align="left"
          date="NOVEMBER 05, 2026"
          title="Endgame Patterns"
          text="Why pawn structure dictates the flow of the final 20 moves, and how to spot winning lines."
        />

        <JournalText
          align="left"
          date="NOVEMBER 15, 2026"
          title="The King's Indian"
          text="Breaking down the complex center tensions and understanding when to launch the kingside attack."
        />
        <JournalImage src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" />

        <JournalImage src="https://images.unsplash.com/photo-1610631066894-0d7714a51eb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" />
        <JournalText
          align="left"
          date="DECEMBER 02, 2026"
          title="Tactical Vision"
          text="Training exercises to improve calculation depth and eliminate blunders from your tournament play."
        />

        <JournalText
          align="left"
          date="DECEMBER 14, 2026"
          title="Tournament Prep"
          text="Physical and mental conditioning routines utilized by the world's elite players before major events."
        />
        <JournalImage src="https://images.unsplash.com/photo-1552554761-46c57f2017c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" />

        <div
          className="absolute inset-x-0 top-0 pointer-events-none h-[12vw] z-10"
          style={{
            background: "linear-gradient(to bottom, #0a0a0a, transparent)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none h-[30vw] z-10"
          style={{
            background: "linear-gradient(to top, #0a0a0a 0%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative hidden md:grid grid-cols-4 w-full overflow-hidden">
        <D />
        <JournalText
          align="right"
          date="OCTOBER 12, 2026"
          title="The Sicilian Defense"
          text="Exploring the hyper-aggressive lines of the Najdorf variation and how it reshapes mid-game pressure."
        />
        <JournalImage src="https://images.unsplash.com/photo-1529699211952-734e80c4d42b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" />
        <W />

        <W />
        <D />
        <JournalText
          align="right"
          date="OCTOBER 28, 2026"
          title="Grandmaster Mindset"
          text="Psychological warfare over the board. Maintaining composure when time trouble hits the clock."
        />
        <JournalImage src="https://images.unsplash.com/photo-1580541832626-2a7151e6fd44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" />

        <JournalImage src="https://images.unsplash.com/photo-1560174038-da43ac74f01b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" />
        <JournalText
          align="left"
          date="NOVEMBER 05, 2026"
          title="Endgame Patterns"
          text="Why pawn structure dictates the flow of the final 20 moves, and how to spot winning lines."
        />
        <D />
        <W />

        <JournalText
          align="right"
          date="NOVEMBER 15, 2026"
          title="The King's Indian"
          text="Breaking down the complex center tensions and understanding when to launch the kingside attack."
        />
        <JournalImage src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" />
        <W />
        <D />

        <D />
        <W />
        <JournalImage src="https://images.unsplash.com/photo-1610631066894-0d7714a51eb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" />
        <JournalText
          align="left"
          date="DECEMBER 02, 2026"
          title="Tactical Vision"
          text="Training exercises to improve calculation depth and eliminate blunders from your tournament play."
        />

        <JournalText
          align="right"
          date="DECEMBER 14, 2026"
          title="Tournament Prep"
          text="Physical and mental conditioning routines utilized by the world's elite players before major events."
        />
        <JournalImage src="https://images.unsplash.com/photo-1552554761-46c57f2017c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" />
        <W />
        <D />

        <div
          className="absolute inset-x-0 top-0 pointer-events-none h-[6vw] z-10"
          style={{
            background: "linear-gradient(to bottom, #0a0a0a, transparent)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none h-[20vw] z-10"
          style={{
            background: "linear-gradient(to top, #0a0a0a 0%, transparent 100%)",
          }}
        />
      </div>
    </section>
  );
}
