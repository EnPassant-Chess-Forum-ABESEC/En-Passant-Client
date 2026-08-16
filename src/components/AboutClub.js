"use client";

import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import SpotlightCard from "./SpotlightCard";

export default function AboutClub() {
  const sectionRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mouseInSection, setMouseInSection] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const premiumEase = [0.16, 1, 0.3, 1];

  const headerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease: premiumEase, delay: custom * 0.15 },
    }),
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: (custom) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 20,
        delay: custom * 0.15,
      },
    }),
  };

  const cards = [
    {
      notation: "e4",
      title: "COMPETE",
      items: [
        "Monthly Tournaments",
        "Campus Leagues",
        "Intercollege Events",
        "Arena Nights",
      ],
      position: "top-[60vw] md:top-[12vw] left-0 md:left-[2vw]",
    },
    {
      notation: "e5",
      title: "LEARN",
      items: ["Workshops", "Game reviews", "Opening theory", "Daily Puzzles"],
      position: "top-[110vw] md:top-[24vw] left-[50vw] md:left-[50vw]",
    },
    {
      notation: "d4",
      title: "CONNECT",
      items: ["Community", "Club nights", "Casual games", "Collaborations"],
      position: "top-[160vw] md:top-[60vw] left-0 md:left-[14vw]",
    },
    {
      notation: "D5",
      title: "LEAD",
      items: [
        "Organize events",
        "Build projects",
        "Design media",
        "Grow the club",
      ],
      position: "top-[210vw] md:top-[72vw] left-[50vw] md:left-[62vw]",
    },
  ];

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setMouseInSection(true)}
      onMouseLeave={() => setMouseInSection(false)}
      className="relative w-full bg-[#050505] overflow-hidden font-sans pt-20"
    >
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'url("/common/dark_marble_bg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <div className="absolute inset-0 z-0 bg-black/40 pointer-events-none"></div>

      <div className="absolute top-0 left-0 w-full h-[30vw] bg-gradient-to-b from-[#050505] via-[#050505]/60 to-transparent z-10 pointer-events-none"></div>

      <div className="relative w-full h-[300vw] md:h-[104vw]">
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none hidden md:block"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.3) 1px, transparent 2px),
                linear-gradient(to bottom, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.3) 1px, transparent 2px)
              `,
              backgroundSize: "12vw 12vw",
              backgroundPosition: "2vw 0",
              filter: "blur(0.4px)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
              maskImage:
                "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
            }}
          />

          {mouseInSection && (
            <div
              className="absolute inset-0 pointer-events-none hidden md:block transition-opacity duration-200"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(155, 26, 26, 0.5) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(155, 26, 26, 0.5) 1px, transparent 1px)
                `,
                backgroundSize: "12vw 12vw",
                backgroundPosition: "2vw 0",
                WebkitMaskImage: `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%), linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)`,
                maskImage: `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%), linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)`,
                WebkitMaskComposite: "source-in",
                maskComposite: "intersect",
              }}
            />
          )}
        </div>

        <div className="absolute top-[60vw] left-0 w-full h-[200vw] z-0 md:hidden flex flex-wrap pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="w-[50vw] h-[50vw] border border-white/[0.05]"
            ></div>
          ))}
        </div>

        <div className="absolute top-0 w-full px-[2vw] hidden md:flex text-white/20 text-[10px] font-mono pt-2 z-0">
          {["A", "B", "C", "D", "E", "F", "G", "H"].map((col) => (
            <div key={col} className="w-[12vw] text-center">
              {col}
            </div>
          ))}
        </div>

        <div className="absolute top-0 left-0 h-full hidden md:flex flex-col text-[#555555] text-[9px] font-mono pr-2 z-0">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
            <div
              key={row}
              className="h-[12vw] w-[2vw] flex justify-end items-center"
            >
              {row}
            </div>
          ))}
        </div>

        <div className="absolute top-0 right-0 h-full hidden md:flex flex-col text-[#555555] text-[9px] font-mono pl-2 z-0">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
            <div
              key={row}
              className="h-[12vw] w-[2vw] flex justify-start items-center"
            >
              {row}
            </div>
          ))}
        </div>

        <div className="absolute top-[6vw] md:top-[2vw] right-[4vw] z-30 text-right pointer-events-none leading-[0.85]">
          <h2 className="flex flex-col uppercase font-pezula font-bold tracking-[0.04em] md:tracking-[0.08em] leading-[0.8]">
            <motion.span
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={headerVariants}
              className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] text-[15vw] md:text-[100px]"
            >
              THE CLUB
            </motion.span>
            <span className="text-[15vw] md:text-[100px]">
              <motion.span
                custom={1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={headerVariants}
                className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] inline-block"
              >
                IN
              </motion.span>{" "}
              <motion.span
                custom={2}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={headerVariants}
                className="text-[#9b1a1a] drop-shadow-[0_0_20px_rgba(155,26,26,0.4)] inline-block"
              >
                ACTION
              </motion.span>
            </span>
          </h2>
        </div>

        {cards.map((card, index) => (
          <motion.div
            key={card.notation}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={cardVariants}
            className={`absolute ${card.position} z-20 w-[50vw] md:w-[36vw] h-[50vw] md:h-[24vw]`}
          >
            <SpotlightCard
              spotlightColor="rgba(155, 26, 26, 0.35)"
              className="relative w-full h-full p-[4vw] md:p-[3.5vw] flex flex-col justify-between bg-[#050505] border border-white/10 pointer-events-auto transition-all duration-300 shadow-2xl overflow-hidden group"
            >
              <div className="absolute right-[5%] bottom-[0%] text-[30vw] md:text-[18vw] font-pezula font-black text-white/[0.02] group-hover:text-white/[0.04] transition-colors duration-500 select-none pointer-events-none leading-none z-0">
                {card.notation}
              </div>

              <div className="flex justify-between items-start relative z-10">
                <h3 className="text-white font-pezula font-bold text-[16px] md:text-[28px] tracking-[0.15em] uppercase pt-1 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent drop-shadow-md">
                  {card.title}
                </h3>
              </div>

              <ul className="flex flex-col gap-[1.5vw] md:gap-[1.2vw] mt-auto relative z-10 pb-[2vw] md:pb-[1vw]">
                {card.items.map((item) => (
                  <li
                    key={item}
                    className="group/item text-white/70 hover:text-white font-sans font-light text-[12px] md:text-[18px] tracking-[0.05em] flex items-center gap-[2vw] md:gap-[1.5vw] transition-colors duration-300"
                  >
                    <span className="text-[#9b1a1a] font-bold text-[16px] md:text-[20px] leading-none mt-[-2px] group-hover/item:translate-x-1 transition-transform duration-300">
                      ›
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </motion.div>
        ))}

        <div className="absolute bottom-0 left-0 w-full h-[30vw] md:h-[10vw] bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-30 pointer-events-none" />
      </div>
    </section>
  );
}
