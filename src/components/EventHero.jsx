"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";

export default function EventHero() {
  const premiumEase = [0.16, 1, 0.3, 1];
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);
  const yFront = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-[#050505] overflow-hidden select-none"
    >
      <motion.div
        style={{ y: yBg }}
        className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden"
      >
        <div
          style={{
            WebkitTransform: "translateZ(0)",
            backfaceVisibility: "hidden",
          }}
          className="w-full h-full relative"
        >
          <div
            className="absolute top-1/2 left-1/2 pointer-events-none"
            style={{
              width: "max(100vw, 177.68vh)",
              height: "max(100vh, 56.28vw)",
              transform: "translate(-51.97%, -50%)",
            }}
          >
            <Image
              src="/event/hero/event_hero_bg.webp"
              alt="ACC Background"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.5) 100%)",
            }}
          />
        </div>
      </motion.div>

      <motion.div
        style={{ y: yText, opacity }}
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20 select-none"
      >
        <div
          className="relative flex flex-col items-center justify-center"
          style={{ transform: "translateY(-2%)" }}
        >
          <div className="relative flex items-center justify-center">
            <div className="relative z-10 flex items-center justify-center gap-4 sm:gap-11 md:gap-16">
              {["A", "C", "C"].map((letter, index) => (
                <motion.span
                  key={index}
                  initial={{ y: 55, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 60,
                    damping: 20,
                    delay: 0.35 + index * 0.15,
                  }}
                  style={{
                    fontSize: "clamp(3.2rem, 10vw, 8.2rem)",
                    WebkitTransform: "translateZ(0)",
                    backfaceVisibility: "hidden",
                  }}
                  className="font-pezula font-bold bg-gradient-to-b from-[#ffffff] via-[#e0e0e0] to-[#777777] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.25)] leading-none select-none tracking-normal inline-block"
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </div>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 55,
              damping: 20,
              delay: 0.8,
            }}
            style={{
              fontSize: "clamp(0.55rem, 1.6vw, 0.95rem)",
              letterSpacing: "clamp(0.18em, 0.4vw, 0.38em)",
              color: "#e2e8f0",
              marginTop: "clamp(12px, 2.2vw, 26px)",
              textShadow: "0 2px 14px rgba(0,0,0,0.95)",
              WebkitTransform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
            className="font-sans font-medium uppercase text-center px-4 max-w-full"
          >
            ABES CHESS <span className="text-red-500">CHAMPIONSHIP</span>
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        style={{ y: yFront }}
        className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-hidden"
      >
        <div
          style={{
            WebkitTransform: "translateZ(0)",
            backfaceVisibility: "hidden",
          }}
          className="w-full h-full relative"
        >
          <div
            className="absolute top-1/2 left-1/2 pointer-events-none"
            style={{
              width: "max(100vw, 177.68vh)",
              height: "max(100vh, 56.28vw)",
              transform: "translate(-51.97%, -50%)",
            }}
          >
            <Image
              src="/event/hero/event_hero_fg.webp"
              alt="ACC ABES Chess Championship '26"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 w-full h-[15vw] max-h-[160px] bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-40 pointer-events-none" />

      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="flex flex-col items-center gap-2 cursor-default pointer-events-auto group"
        >
          <span className="text-[12px] uppercase tracking-[0.2em] text-white/40 font-bold ml-[0.2em] group-hover:text-white transition-colors duration-300">
            Scroll
          </span>
          <ChevronDown
            className="w-4 h-4 text-white/40 animate-bounce group-hover:text-white transition-colors duration-300"
            style={{ animationDuration: "1.5s" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
