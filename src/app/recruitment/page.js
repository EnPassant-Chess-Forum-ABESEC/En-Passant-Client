"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import dynamic from "next/dynamic";

const RecruitmentTimeline = dynamic(() => import("@/components/RecruitmentTimeline"), { ssr: true });
const WhyJoinSection = dynamic(() => import("@/components/WhyJoinSection"), { ssr: true });
const DepartmentsSection = dynamic(() => import("@/components/DepartmentsSection"), { ssr: true });
const RecruitmentCTASection = dynamic(() => import("@/components/RecruitmentCTASection"), { ssr: true });

export default function RecruitmentPage() {
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
    <main className="w-full bg-[#050505] font-sans">
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
            style={{ WebkitTransform: "translateZ(0)", backfaceVisibility: "hidden" }}
            className="w-full h-full relative"
          >
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
          <div
            className="absolute top-[46%] md:top-[49%] left-[25%] md:left-[41%]"
            style={{ width: "80vw" }}
          >
            <motion.h1
              initial={{ y: 50, opacity: 0, z: 0 }}
              animate={{ y: 0, opacity: 1, z: 0 }}
              transition={{
                type: "spring",
                stiffness: 60,
                damping: 20,
                delay: 0.4,
              }}
              style={{ WebkitTransform: "translateZ(0)", backfaceVisibility: "hidden" }}
              className="bg-gradient-to-b from-[#ffffff] via-[#cccccc] to-[#555555]
              bg-clip-text text-transparent font-pezula uppercase
              tracking-wider leading-[0.85]
              text-[15vw] md:text-[10vw] whitespace-nowrap"
            >
              RECRUITMENT
            </motion.h1>
          </div>

          <div className="absolute top-[56%] md:top-[58%] right-[10%] md:right-[20%]">
            <motion.span
              initial={{ y: 50, opacity: 0, z: 0 }}
              animate={{ y: 0, opacity: 1, z: 0 }}
              transition={{
                type: "spring",
                stiffness: 60,
                damping: 20,
                delay: 0.6,
              }}
              style={{ WebkitTransform: "translateZ(0)", backfaceVisibility: "hidden" }}
              className="inline-block text-[#9b1a1a] drop-shadow-[0_0_40px_rgba(155,26,26,0.6)] font-black tracking-tighter leading-[0.85] text-[15vw] md:text-[10vw]"
            >
              2026
            </motion.span>
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
            style={{ WebkitTransform: "translateZ(0)", backfaceVisibility: "hidden" }}
            className="w-full h-full relative"
          >
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
      </section>

      <RecruitmentTimeline />

      <DepartmentsSection />

      <RecruitmentCTASection />
    </main>
  );
}
