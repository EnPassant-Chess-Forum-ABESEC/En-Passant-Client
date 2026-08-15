"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HeroSection({ children }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-[#0a0a0a] overflow-hidden font-sans"
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

      <motion.div
        style={{ y: yText, opacity }}
        className="absolute top-[15%] md:top-[18%] w-full px-6 md:px-12 select-none pointer-events-none z-10 flex justify-start md:justify-center"
      >
        <div className="relative w-full max-w-7xl flex justify-start md:justify-center">
          <div className="relative flex flex-col md:flex-row items-start md:items-baseline justify-start md:justify-between uppercase leading-[0.85] text-[19vw] md:text-[11vw] lg:text-[10.5vw] w-full transform scale-y-[1.1] origin-bottom">
            {/* EN on Mobile, inline on Desktop */}
            <div className="flex justify-start md:contents gap-[2vw] md:gap-0 w-full md:w-auto">
              {["E", "N"].map((letter, index) => (
                <span
                  key={`letter-${index}`}
                  className="inline-block font-prfaExtrabold font-black hero-letter text-[#9b1a1a] drop-shadow-[0_0_15px_rgba(155,26,26,0.25)]"
                  style={{ animationDelay: `${0.1 + 0.05 * index}s` }}
                >
                  {letter}
                </span>
              ))}
            </div>
            
            {/* Space on desktop */}
            <span className="hidden md:inline-block w-[2vw]" />
            
            {/* PASSANT on Mobile, inline on Desktop */}
            <div className="flex justify-start md:contents gap-[1vw] md:gap-0 w-full md:w-auto mt-[2vw] md:mt-0">
              {["P", "A", "S", "S", "A", "N", "T"].map((letter, index) => {
                const actualIndex = index + 2;
                return (
                  <span
                    key={`letter-${actualIndex}`}
                    className="inline-block font-prfaExtrabold font-black hero-letter bg-gradient-to-b from-[#ffffff] via-[#cccccc] to-[#555555] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                    style={{ animationDelay: `${0.1 + 0.05 * actualIndex}s` }}
                  >
                    {letter}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      <div
        className="absolute left-1/2 z-20 -translate-x-1/2 w-[250vw] sm:w-[150vw] md:w-[120vw] max-w-[1600px] h-[80vh] md:h-[110vh] bottom-[-5vh] md:bottom-0"
        style={{ contain: "layout style paint" }}
      >
        <motion.div style={{ y: yImage }} className="w-full h-full relative">
          <div
            className="w-full h-full relative hero-image scale-[3] md:scale-100"
            style={{
              transformOrigin: "bottom center",
              backfaceVisibility: "hidden",
              willChange: "transform, opacity",
            }}
          >
            <Image
              src="/hero.png"
              alt="King"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              className="object-contain object-bottom"
            />
          </div>
        </motion.div>
      </div>

      <motion.div
        style={{ opacity }}
        className="absolute bottom-12 md:bottom-14 left-0 w-full px-6 md:px-12 z-40 flex justify-center pointer-events-none"
      >
        {children}
      </motion.div>

      <div className="absolute bottom-0 left-0 w-full h-32 md:h-56 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-30 pointer-events-none"></div>
    </section>
  );
}
