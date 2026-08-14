"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";

export default function RecruitmentHero() {
  const premiumEase = [0.16, 1, 0.3, 1];
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const yFront = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
          transform: "translateZ(0)",
          willChange: "transform",
        }}
      ></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.06)_0%,transparent_60%)] pointer-events-none z-0"></div>

      <motion.div style={{ y: yFront }} className="absolute inset-0 z-10">
        <motion.div
          initial={{ opacity: 0, z: 0 }}
          animate={{ opacity: 1, z: 0 }}
          transition={{ duration: 1.5, ease: premiumEase }}
          style={{
            WebkitTransform: "translateZ(0)",
            backfaceVisibility: "hidden",
          }}
          className="w-full h-full relative"
        >
          {/* REMOVED unoptimized FLAG TO ENABLE COMPRESSION */}
          <Image
            src="/recruitment_hero_front_background.png"
            alt="Background"
            fill
            priority
            className="object-cover object-[70%_center] md:object-center"
          />

          <div className="absolute inset-0 bg-black/50 pointer-events-none" />
        </motion.div>
      </motion.div>

      <motion.div
        style={{ y: yText, opacity }}
        className="absolute inset-0 w-full h-full select-none pointer-events-none z-20"
      >
        <div className="absolute top-[42%] md:top-[30%] right-[5%] md:right-[8%]">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.14 }}
            transition={{ duration: 1.5, delay: 0.6 }}
            style={{
              WebkitTransform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
            className="inline-block text-[#9b1a1a] font-black tracking-tighter leading-[0.85] text-[35vw] md:text-[30vw] lg:text-[25vw] transform scale-y-[1.8] origin-bottom"
          >
            26
          </motion.span>
        </div>

        <div className="absolute top-[48%] md:top-[49%] w-full flex justify-center md:justify-start md:w-auto md:left-[41%]">
          <motion.h1
            initial={{ y: 50, opacity: 0, z: 0 }}
            animate={{ y: 0, opacity: 1, z: 0 }}
            transition={{
              type: "spring",
              stiffness: 60,
              damping: 20,
              delay: 0.4,
            }}
            style={{
              WebkitTransform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
            className="bg-gradient-to-b from-[#ffffff] via-[#cccccc] to-[#555555]
            bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] font-pezula font-bold uppercase
            tracking-wider leading-[0.85]
            text-[12.5vw] sm:text-[11vw] md:text-[8.5vw] lg:text-[7.8vw] whitespace-nowrap"
          >
            RECRUITMENT
          </motion.h1>
        </div>
      </motion.div>

      <motion.div
        style={{ y: yFront }}
        className="absolute inset-0 z-30 pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, z: 0 }}
          animate={{ opacity: 1, z: 0 }}
          transition={{ duration: 1.5, ease: premiumEase }}
          style={{
            WebkitTransform: "translateZ(0)",
            backfaceVisibility: "hidden",
          }}
          className="w-full h-full relative"
        >
          {/* REMOVED unoptimized FLAG TO ENABLE COMPRESSION */}
          <Image
            src="/recruitment_hero_front.png"
            alt="Recruitment Hero"
            fill
            priority
            className="object-cover object-[70%_center] md:object-center"
          />
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 w-full h-[15vw] bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-40 pointer-events-none"></div>

      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="flex flex-col items-center gap-2 cursor-pointer pointer-events-auto group"
          onClick={() => {
            document
              .getElementById("recruitment-cta")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
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
