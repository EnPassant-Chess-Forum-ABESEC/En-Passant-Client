"use client";

import Image from "next/image";
import { useRef } from "react";
import { useScroll, motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Center } from "@react-three/drei";
import SpotlightCard from "./SpotlightCard";

function ChessPieceModel({ scrollYProgress }) {
  const { scene } = useGLTF("/king.glb");
  const modelRef = useRef();

  useFrame(() => {
    if (modelRef.current) {
      // Map scroll progress (0 to 1) to rotation.
      modelRef.current.rotation.y = scrollYProgress.get() * Math.PI * 4;
    }
  });

  return (
    <Center position={[0, 0, 0]}>
      <primitive ref={modelRef} object={scene} scale={5.5} />
    </Center>
  );
}

export default function NumbersSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Stagger configurations
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
      className="relative w-full bg-[#050505] font-prfaExtrabold border-none overflow-hidden"
    >
      {/* Dark Marble Texture Background */}
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'url("/dark_marble_bg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <div className="absolute inset-0 z-0 bg-black/40 pointer-events-none"></div>

      {/* Top Fade — blends seamlessly with hero section below */}
      <div className="absolute top-0 left-0 w-full h-[30vw] bg-gradient-to-b from-[#050505] via-[#050505]/60 to-transparent z-10 pointer-events-none"></div>

      <div className="relative w-full h-[240vw] md:h-[96vw]">
        {/* ─── Desktop Faint Chess Board Grid Background ─── */}
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
              "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
            maskImage:
              "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
          }}
        ></div>

        {/* ─── Mobile 2x4 Grid Borders ─── */}
        <div className="absolute top-[40vw] left-0 w-full h-[200vw] z-0 md:hidden flex flex-wrap pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="w-[50vw] h-[50vw] border border-white/[0.05]"
            ></div>
          ))}
        </div>

        {/* Grid Coordinates (Desktop only) */}
        <div className="absolute top-0 w-full px-[2vw] hidden md:flex text-white/30 text-[10px] font-mono pt-2 z-0">
          {["A", "B", "C", "D", "E", "F", "G", "H"].map((col) => (
            <div key={col} className="w-[12vw] text-center">
              {col}
            </div>
          ))}
        </div>

        {/* Thin Left Gutter (Desktop only) */}
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

        {/* Thin Right Gutter (Desktop only) */}
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
          {/* Section Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={textVariants}
            className="absolute top-[8vw] md:top-[6vw] w-full md:w-auto text-center md:text-right right-0 md:right-[5vw] z-30 leading-[0.85]"
          >
            <div className="relative inline-block">
              <h2 className="flex flex-col uppercase font-cinzel font-bold tracking-[0.04em] md:tracking-[0.08em] leading-[0.8]">
                <span className="text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.6)] text-[10vw] md:text-[100px]">
                  PROVEN
                </span>
                <span className="text-[#9b1a1a] drop-shadow-[0_0_40px_rgba(155,26,26,0.6)] text-[10vw] md:text-[100px]">
                  PERFORMANCE
                </span>
              </h2>
            </div>
          </motion.div>

          {/* ─── Center Chess Piece 3D Model ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5 }}
            className="absolute left-1/2 top-[40vw] md:top-[-5vw] -translate-x-1/2 w-[100vw] md:w-[60vw] h-[200vw] md:h-[100vw] z-10 pointer-events-none rotate-[6deg]"
          >
            <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
              <ambientLight intensity={0.2} />
              <directionalLight position={[10, 10, 5]} intensity={0.5} />
              <Environment preset="night" />
              <ChessPieceModel scrollYProgress={scrollYProgress} />
            </Canvas>
          </motion.div>
        </div>

        {/* ─── Stats Boxes ─── */}

        {/* Box 1 (-35%): Row 1, Col 1 on mobile */}
        <motion.div
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={cardVariants}
          className="absolute top-[40vw] md:top-[36vw] left-0 md:left-auto md:right-[14vw] w-[50vw] md:w-[24vw] h-[50vw] md:h-[24vw] z-20"
        >
          <SpotlightCard className="bg-[#050505] border border-white/10 w-full h-full flex flex-col items-center justify-center p-4 text-center transition-all duration-300">
            <span className="text-white font-cinzel font-bold tabular-nums text-[12vw] md:text-[6vw] uppercase leading-none mb-2 md:mb-1">
              -35%
            </span>
            <span className="text-white/70 font-inter font-medium text-[12px] tracking-[0.1em] uppercase leading-[1.5] max-w-[80%]">
              CAC Reduction After Optimization
            </span>
          </SpotlightCard>
        </motion.div>

        {/* Box 2 (120+): Row 2, Col 2 on mobile */}
        <motion.div
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={cardVariants}
          className="absolute top-[90vw] md:top-[12vw] left-[50vw] md:left-[2vw] w-[50vw] md:w-[24vw] h-[50vw] md:h-[24vw] z-20"
        >
          <SpotlightCard className="bg-[#050505] border border-white/10 w-full h-full flex flex-col items-center justify-center p-4 text-center transition-all duration-300">
            <span className="text-white font-cinzel font-bold tabular-nums text-[12vw] md:text-[6vw] uppercase leading-none mb-2 md:mb-1">
              120+
            </span>
            <span className="text-white/70 font-inter font-medium text-[12px] tracking-[0.1em] uppercase leading-[1.5] max-w-[80%]">
              Successful Projects Delivered
            </span>
          </SpotlightCard>
        </motion.div>

        {/* Box 3 (8+): Row 3, Col 1 on mobile */}
        <motion.div
          custom={2}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={cardVariants}
          className="absolute top-[140vw] md:top-[60vw] left-0 md:left-[14vw] w-[50vw] md:w-[24vw] h-[50vw] md:h-[24vw] z-20"
        >
          <SpotlightCard className="bg-[#050505] border border-white/10 w-full h-full flex flex-col items-center justify-center p-4 text-center transition-all duration-300">
            <span className="text-white font-cinzel font-bold tabular-nums text-[12vw] md:text-[6vw] uppercase leading-none mb-2 md:mb-1">
              8+
            </span>
            <span className="text-white/70 font-inter font-medium text-[12px] tracking-[0.1em] uppercase leading-[1.5] max-w-[80%]">
              Years experience in Digital Growth
            </span>
          </SpotlightCard>
        </motion.div>

        {/* Box 4 (3x): Row 4, Col 2 on mobile */}
        <motion.div
          custom={3}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={cardVariants}
          className="absolute top-[190vw] md:top-[72vw] left-[50vw] md:left-auto md:right-[2vw] w-[50vw] md:w-[24vw] h-[50vw] md:h-[24vw] z-20"
        >
          <SpotlightCard className="bg-[#050505] border border-white/10 w-full h-full flex flex-col items-center justify-center p-4 text-center transition-all duration-300">
            <span className="text-white font-cinzel font-bold tabular-nums text-[12vw] md:text-[6vw] uppercase leading-none mb-2 md:mb-1">
              3X
            </span>
            <span className="text-white/70 font-inter font-medium text-[12px] tracking-[0.1em] uppercase leading-[1.5] max-w-[80%]">
              Average Lead Growth
            </span>
          </SpotlightCard>
        </motion.div>
      </div>

      {/* Bottom Fade — blends seamlessly into EcosystemSection */}
      <div className="absolute bottom-0 left-0 w-full h-[30vw] bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent z-10 pointer-events-none"></div>
    </section>
  );
}

useGLTF.preload("/king.glb");
