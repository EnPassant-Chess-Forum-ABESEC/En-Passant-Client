"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { useAuth } from "@clerk/nextjs";

const NumbersSection = dynamic(() => import("@/components/NumbersSection"), {
  ssr: false,
});
const StrategySection = dynamic(() => import("@/components/CommunityDesc"), {
  ssr: true,
});
const EcosystemSection = dynamic(() => import("@/components/AboutClub"), {
  ssr: true,
});
const ClubJournalSection = dynamic(
  () => import("@/components/ClubJournalSection"),
  { ssr: true },
);

export default function Home() {
  const { userId } = useAuth();
  const containerRef = useRef(null);
  const [imageReady, setImageReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const premiumEase = [0.16, 1, 0.3, 1];

  // Pre-decode the hero image before triggering any animation.
  // img.decode() guarantees the bitmap is ready in GPU memory —
  // unlike onLoad which fires before decode on priority images.
  useEffect(() => {
    const img = new window.Image();
    img.src = "/hero.png";
    img
      .decode()
      .then(() => {
        requestAnimationFrame(() => {
          setImageReady(true);
        });
      })
      .catch(() => {
        // Fallback: animate anyway
        requestAnimationFrame(() => {
          setImageReady(true);
        });
      });
  }, []);

  // Dissolve animation state for each letter — blur → sharp + opacity.
  // Applied per-letter across both "EN" and "PASSANT" as one continuous stagger.
  const dissolveIn = (delay) => ({
    initial: { opacity: 0, filter: "blur(16px)", y: 10 },
    animate: imageReady
      ? { opacity: 1, filter: "blur(0px)", y: 0 }
      : { opacity: 0, filter: "blur(16px)", y: 10 },
    transition: { duration: 1.4, delay, ease: premiumEase },
  });

  return (
    <>
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
          className="absolute top-[25%] md:top-[22%] w-full px-4 md:px-12 select-none pointer-events-none z-10 flex justify-center"
        >
          <div className="relative w-full max-w-7xl flex justify-center">
            <div className="relative flex items-baseline justify-center uppercase leading-[0.85] text-[13vw] md:text-[10vw] whitespace-nowrap w-max mx-auto">
              {/* EN — dissolves letter by letter */}
              {["E", "N"].map((letter, index) => (
                <motion.span
                  key={`en-${index}`}
                  className="inline-block text-[#c41e3a] font-cinzel font-bold tracking-[0.12em]"
                  {...dissolveIn(0.05 * index)}
                >
                  {letter}
                </motion.span>
              ))}

              {/* PASSANT — dissolves letter by letter, continues stagger from EN */}
              <span className="inline-flex ml-[0.15em]">
                {["P", "A", "S", "S", "A", "N", "T"].map((letter, index) => (
                  <motion.span
                    key={`p-${index}`}
                    className="inline-block bg-gradient-to-b from-[#ffffff] via-[#cccccc] to-[#555555] bg-clip-text text-transparent font-cinzel font-black tracking-[0.08em]"
                    {...dissolveIn(0.1 + 0.05 * index)}
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            </div>
          </div>
        </motion.div>

        <div
          className="absolute left-1/2 z-20 -translate-x-1/2 w-[200vw] sm:w-[150vw] md:w-[120vw] max-w-[1600px] h-[85vh] md:h-[110vh] bottom-0"
          style={{ contain: "layout style paint" }}
        >
          <motion.div style={{ y: yImage }} className="w-full h-full relative">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={
                imageReady ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }
              }
              transition={{ duration: 1.5, ease: premiumEase }}
              className="w-full h-full relative"
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
                className="object-contain object-bottom"
              />
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          style={{ opacity }}
          className="absolute bottom-10 md:bottom-14 left-0 w-full px-6 md:px-12 z-40 flex justify-center pointer-events-none"
        >
          <div className="w-full max-w-7xl flex justify-center md:justify-between items-end">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={
                imageReady ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }
              }
              transition={{ duration: 1.6, ease: premiumEase }}
              className="max-w-[340px] hidden md:block pointer-events-auto"
            >
              <p className="text-[#cccccc] font-inter font-normal text-[14px] leading-[1.8] tracking-[0.08em] uppercase opacity-80">
                Whether you're making
                <br />
                your first move or your thousandth,
                <br />
                there's a place for you here
              </p>
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={
                imageReady ? { x: 0, opacity: 1 } : { x: 20, opacity: 0 }
              }
              transition={{ duration: 1.6, ease: premiumEase }}
              className="flex flex-col items-center md:items-end text-center md:text-right gap-4 pointer-events-auto mx-auto md:ml-auto md:mr-0 w-full md:w-auto"
            >
              <div className="text-[#888888] text-xs md:text-sm tracking-wide hidden md:block">
                <span className="text-[#cccccc] font-inter font-medium text-[13px] tracking-[0.1em] opacity-80">
                  Chess forum
                </span>
                <br />
                Dedicated to spread the game of chess
              </div>
              <div className="group relative w-full sm:w-auto flex justify-center">
                <Link href={userId ? "/recruitment" : "/sign-up"} className="btn-bracket group">
                  <div className="btn-inner bg-[#990000] hover:bg-[#cc0000] text-white px-6 md:px-8 py-4 uppercase font-inter font-semibold text-[14px] tracking-[0.12em] transition-colors duration-200 ease-in-out whitespace-nowrap">
                    {userId ? "Go To Recruitment" : "Sign up here"}
                  </div>
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="absolute bottom-0 left-0 w-full h-32 md:h-56 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-30 pointer-events-none"></div>
      </section>
      <NumbersSection />
      <StrategySection />
      <EcosystemSection />
      <ClubJournalSection />
    </>
  );
}
