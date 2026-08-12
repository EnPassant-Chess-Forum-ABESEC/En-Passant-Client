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
const CommunityDesc = dynamic(() => import("@/components/CommunityDesc"), {
  ssr: true,
});
const AboutClub = dynamic(() => import("@/components/AboutClub"), {
  ssr: true,
});
const DriftWallSection = dynamic(
  () => import("@/components/DriftWallSection"),
  {
    ssr: true,
  },
);
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

  useEffect(() => {
    const img = new window.Image();
    img.src = "/hero.png";
    img
      .decode()
      .then(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setImageReady(true);
          });
        });
      })
      .catch(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setImageReady(true);
          });
        });
      });
  }, []);

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
              {["E", "N"].map((letter, index) => (
                <span
                  key={`en-${index}`}
                  className="inline-block text-[#c41e3a] font-cinzel font-bold tracking-[0.12em] hero-letter"
                  style={{
                    animationDelay: `${imageReady ? 0.05 * index : 99}s`,
                    animationPlayState: imageReady ? "running" : "paused",
                  }}
                >
                  {letter}
                </span>
              ))}

              <span className="inline-flex ml-[0.15em]">
                {["P", "A", "S", "S", "A", "N", "T"].map((letter, index) => (
                  <span
                    key={`p-${index}`}
                    className="inline-block bg-gradient-to-b from-[#ffffff] via-[#cccccc] to-[#555555] bg-clip-text text-transparent font-cinzel font-black tracking-[0.08em] hero-letter"
                    style={{
                      animationDelay: `${imageReady ? 0.1 + 0.05 * index : 99}s`,
                      animationPlayState: imageReady ? "running" : "paused",
                    }}
                  >
                    {letter}
                  </span>
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
            <div
              className={`w-full h-full relative hero-image ${imageReady ? "hero-image--visible" : ""}`}
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
            </div>
          </motion.div>
        </div>

        <motion.div
          style={{ opacity }}
          className="absolute bottom-10 md:bottom-14 left-0 w-full px-6 md:px-12 z-40 flex justify-center pointer-events-none"
        >
          <div className="w-full max-w-7xl flex justify-center md:justify-between items-end">
            <div
              className={`max-w-[340px] hidden md:block pointer-events-auto hero-bottom-text ${imageReady ? "hero-bottom-text--visible" : ""}`}
              style={{ "--hero-slide-from": "-20px" }}
            >
              <p className="text-[#cccccc] font-inter font-normal text-[14px] leading-[1.8] tracking-[0.08em] uppercase opacity-80">
                Whether you're making
                <br />
                your first move or your thousandth,
                <br />
                there's a place for you here
              </p>
            </div>

            <div
              className={`flex flex-col items-center md:items-end text-center md:text-right gap-4 pointer-events-auto mx-auto md:ml-auto md:mr-0 w-full md:w-auto hero-bottom-text ${imageReady ? "hero-bottom-text--visible" : ""}`}
              style={{ "--hero-slide-from": "20px" }}
            >
              <div className="text-[#888888] text-xs md:text-sm tracking-wide hidden md:block">
                <span className="text-[#cccccc] font-inter font-medium text-[13px] tracking-[0.1em] opacity-80">
                  Chess forum
                </span>
                <br />
                Dedicated to spread the game of chess
              </div>
              <div className="group relative w-full sm:w-auto flex justify-center mt-2 md:mt-0">
                <Link
                  href={userId ? "/recruitment" : "/sign-up"}
                  className="btn-bracket group"
                >
                  <div className="btn-inner bg-[#990000] hover:bg-[#cc0000] text-white px-6 md:px-8 py-4 uppercase font-inter font-semibold text-[14px] tracking-[0.12em] transition-colors duration-200 ease-in-out whitespace-nowrap">
                    {userId ? "Go to Recruitment" : "Sign Up Here"}
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="absolute bottom-0 left-0 w-full h-32 md:h-56 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-30 pointer-events-none"></div>
      </section>
      <NumbersSection />
      <CommunityDesc />
      <AboutClub />
      <DriftWallSection />
      <ClubJournalSection />
    </>
  );
}
