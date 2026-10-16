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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: premiumEase }}
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
        </motion.div>
      </motion.div>

      <motion.div
        style={{ y: yText, opacity }}
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20 select-none"
      >
        <div
          className="relative flex flex-col items-center justify-center gap-0"
          style={{ transform: "translateY(-6.5%)" }}
        >
          {/* A · C · C — Polished Imperial Monogram */}
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="relative z-10 flex items-center justify-center"
              style={{ gap: "clamp(14px, 2.1vw, 32px)" }}
            >
              {[
                { char: "A", delay: 0.35 },
                { char: "C", delay: 0.48 },
                { char: "C", delay: 0.60 },
              ].map((item, index) => (
                <motion.div
                  key={`char-${index}`}
                  initial={{ y: 50, opacity: 0, scale: 0.92 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 60,
                    damping: 20,
                    delay: item.delay,
                  }}
                  style={{
                    fontSize: "clamp(5.2rem, 12vw, 9.8rem)",
                    fontFamily: "var(--font-hero-acc)",
                    fontWeight: 900,
                    lineHeight: "0.9",
                    WebkitTransform: "translateZ(0)",
                    backfaceVisibility: "hidden",
                  }}
                  className="relative inline-block select-none"
                >
                  {/* Layer 1: Symmetrical Foundation Shadow & Ambient Crimson Bloom */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 select-none pointer-events-none text-black"
                    style={{
                      transform: "translateY(6px)",
                      filter:
                        "drop-shadow(0 20px 40px rgba(0,0,0,0.98)) drop-shadow(0 0 32px rgba(220,38,38,0.32))",
                    }}
                  >
                    {item.char}
                  </span>

                  {/* Layer 2: 3D Stepped Obsidian Bevel (pure vertical architectural drop) */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 select-none pointer-events-none text-[#0d0203]"
                    style={{ transform: "translateY(2px)" }}
                  >
                    {item.char}
                  </span>

                  {/* Layer 3: Front Chiseled Luminous Platinum Face */}
                  <span
                    className="relative z-10 inline-block bg-gradient-to-b from-[#ffffff] via-[#f8fafc] via-[#cbd5e1] to-[#334155] bg-clip-text text-transparent"
                    style={{
                      filter:
                        "drop-shadow(0 1px 2px rgba(255,255,255,0.4)) drop-shadow(0 4px 14px rgba(0,0,0,0.85))",
                    }}
                  >
                    {item.char}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Subheading — tightly below A.C.C., regal breathing room */}
          <motion.p
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 55,
              damping: 20,
              delay: 0.95,
            }}
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: "clamp(0.72rem, 1.25vw, 0.96rem)",
              letterSpacing: "0.38em",
              marginTop: "clamp(14px, 1.8vw, 24px)",
              WebkitTransform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
            className="font-black uppercase text-center select-none"
          >
            <span
              className="inline-block bg-gradient-to-b from-[#ffffff] via-[#e2e8f0] to-[#94a3b8] bg-clip-text text-transparent"
              style={{
                filter:
                  "drop-shadow(1px 1px 0px rgba(15,23,42,0.9)) drop-shadow(0 4px 10px rgba(0,0,0,0.95)) drop-shadow(0 0 12px rgba(255,255,255,0.18))",
              }}
            >
              ABES CHESS{" "}
            </span>
            <span
              className="inline-block font-black bg-gradient-to-b from-[#ff7171] via-[#ef4444] to-[#991b1b] bg-clip-text text-transparent ml-1"
              style={{
                filter:
                  "drop-shadow(1px 1px 0px rgba(70,4,12,0.95)) drop-shadow(0 4px 10px rgba(0,0,0,0.95)) drop-shadow(0 0 16px rgba(220,38,38,0.45))",
              }}
            >
              CHAMPIONSHIP
            </span>
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        style={{ y: yFront }}
        className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: premiumEase }}
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
        </motion.div>
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
          <span className="text-[12px] uppercase tracking-[0.2em] text-white/60 font-bold ml-[0.2em] group-hover:text-white transition-colors duration-300">
            Scroll
          </span>
          <ChevronDown
            className="w-4 h-4 text-white/60 animate-bounce group-hover:text-white transition-colors duration-300"
            style={{ animationDuration: "1.5s" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
