"use client";

import Image from "next/image";
import { useRef, useState, useCallback, useEffect } from "react";
import { useScroll, motion } from "framer-motion";
import SpotlightCard from "./SpotlightCard";
import dynamic from "next/dynamic";

const ChessCanvas = dynamic(() => import("./ChessCanvas"), {
  ssr: false,
});

export default function NumbersSection() {
  const containerRef = useRef(null);
  const gridRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mouseInGrid, setMouseInGrid] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: (custom) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, delay: custom * 0.15, ease: "easeOut" },
    }),
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setMouseInGrid(true)}
      onMouseLeave={() => setMouseInGrid(false)}
      className="relative w-full bg-[#050505] font-prfaExtrabold border-none overflow-hidden"
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

      <div className="relative w-full h-[240vw] md:h-[96vw]">
        <div
          ref={gridRef}
          className="absolute inset-0 z-[1] pointer-events-none"
        >
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

          {mouseInGrid && (
            <div
              className="absolute inset-0 pointer-events-none hidden md:block transition-opacity duration-200"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(255, 255, 255, 0.4) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 1px, transparent 1px)
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

        <div className="absolute top-[40vw] left-0 w-full h-[200vw] z-0 md:hidden flex flex-wrap pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="w-[50vw] h-[50vw] border border-white/[0.04]"
              style={{ boxShadow: "0 0 1px rgba(255,255,255,0.03)" }}
            ></div>
          ))}
        </div>

        <div className="absolute top-0 w-full px-[2vw] hidden md:flex text-white/30 text-[10px] font-mono pt-2 z-0">
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

        <div className="relative w-full h-full max-w-screen-2xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={textVariants}
            className="absolute top-[8vw] md:top-[6vw] right-[5vw] text-right z-30 leading-[0.85]"
          >
            <div className="relative inline-block">
              <h2 className="flex flex-col uppercase font-pezula font-bold tracking-[0.04em] md:tracking-[0.08em] leading-[0.8]">
                <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] text-[15vw] md:text-[100px]">
                  Jewels of
                </span>
                <span className="text-[#9b1a1a] drop-shadow-[0_0_20px_rgba(155,26,26,0.4)] text-[15vw] md:text-[100px]">
                  Crown
                </span>
              </h2>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5 }}
            className="absolute left-1/2 top-[40vw] md:top-[-5vw] -translate-x-1/2 w-[100vw] md:w-[60vw] h-[200vw] md:h-[100vw] z-10 pointer-events-none rotate-[6deg] flex items-center justify-center"
          >
            {isMobile ? (
              <Image
                src="/home/3d_model_snapshot.png"
                alt="Chess King"
                width={800}
                height={800}
                className="h-[260vw] w-auto object-contain opacity-80 max-w-none"
              />
            ) : (
              <ChessCanvas scrollYProgress={scrollYProgress} />
            )}
          </motion.div>
        </div>

        <motion.div
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={cardVariants}
          className="absolute top-[40vw] md:top-[36vw] left-0 md:left-auto md:right-[14vw] w-[50vw] md:w-[24vw] h-[50vw] md:h-[24vw] z-20"
        >
          <SpotlightCard className="bg-[#050505] border border-white/10 w-full h-full flex flex-col items-center justify-center p-4 text-center transition-all duration-300">
            <span className="text-white font-pezula font-bold tabular-nums text-[12vw] md:text-[6vw] uppercase leading-none mb-2 md:mb-1">
              15+
            </span>
            <span className="text-white/70 font-sans font-medium text-[12px] tracking-[0.1em] uppercase leading-[1.5] max-w-[80%]">
              Podium Finishes
            </span>
          </SpotlightCard>
        </motion.div>

        <motion.div
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={cardVariants}
          className="absolute top-[90vw] md:top-[12vw] left-[50vw] md:left-[2vw] w-[50vw] md:w-[24vw] h-[50vw] md:h-[24vw] z-20"
        >
          <SpotlightCard className="bg-[#050505] border border-white/10 w-full h-full flex flex-col items-center justify-center p-4 text-center transition-all duration-300">
            <span className="text-white font-pezula font-bold tabular-nums text-[12vw] md:text-[6vw] uppercase leading-none mb-2 md:mb-1">
              350+
            </span>
            <span className="text-white/70 font-sans font-medium text-[12px] tracking-[0.1em] uppercase leading-[1.5] max-w-[80%]">
              Community Members
            </span>
          </SpotlightCard>
        </motion.div>

        <motion.div
          custom={2}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={cardVariants}
          className="absolute top-[140vw] md:top-[60vw] left-0 md:left-[14vw] w-[50vw] md:w-[24vw] h-[50vw] md:h-[24vw] z-20"
        >
          <SpotlightCard className="bg-[#050505] border border-white/10 w-full h-full flex flex-col items-center justify-center p-4 text-center transition-all duration-300">
            <span className="text-white font-pezula font-bold tabular-nums text-[12vw] md:text-[6vw] uppercase leading-none mb-2 md:mb-1">
              6
            </span>
            <span className="text-white/70 font-sans font-medium text-[12px] tracking-[0.1em] uppercase leading-[1.5] max-w-[80%]">
              Successful Events Hosted
            </span>
          </SpotlightCard>
        </motion.div>

        <motion.div
          custom={3}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={cardVariants}
          className="absolute top-[190vw] md:top-[72vw] left-[50vw] md:left-auto md:right-[2vw] w-[50vw] md:w-[24vw] h-[50vw] md:h-[24vw] z-20"
        >
          <SpotlightCard className="bg-[#050505] border border-white/10 w-full h-full flex flex-col items-center justify-center p-4 text-center transition-all duration-300">
            <span className="text-white font-pezula font-bold tabular-nums text-[12vw] md:text-[6vw] uppercase leading-none mb-2 md:mb-1">
              3+
            </span>
            <span className="text-white/70 font-sans font-medium text-[12px] tracking-[0.1em] uppercase leading-[1.5] max-w-[80%]">
              Years Across 64 Squares
            </span>
          </SpotlightCard>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[30vw] bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent z-10 pointer-events-none"></div>
    </section>
  );
}
