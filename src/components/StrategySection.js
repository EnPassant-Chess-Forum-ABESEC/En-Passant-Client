"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SpotlightCard from "./SpotlightCard";

export default function StrategySection() {
  const premiumEase = [0.16, 1, 0.3, 1];

  const headerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease: premiumEase, delay: custom * 0.15 },
    }),
  };

  const textRightVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 1.2, ease: premiumEase, delay: 0.3 } 
    }
  };

  const textLeftVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 1.2, ease: premiumEase, delay: 0.5 } 
    }
  };

  return (
    <section className="relative w-full bg-[#050505] overflow-hidden font-sans">
      {/* Top Fade — blends seamlessly from NumbersSection */}
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-[#050505] to-transparent z-20 pointer-events-none"></div>
      {/* ─── Image as the layout driver on desktop, taller on mobile ─── */}
      <div className="relative w-full h-[180vw] md:h-auto overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: premiumEase }}
          className="w-full h-full md:h-auto"
        >
          <Image
            src="/image.png"
            alt="Think Before You Move"
            width={1920}
            height={1080}
            className="w-full h-full md:h-auto object-cover md:object-contain object-top block opacity-80"
            style={{ transform: "scale(1.25)", transformOrigin: "center top" }}
            priority
          />
        </motion.div>
        {/* Gradient overlay to fade the bottom */}
        <div className="absolute bottom-0 left-0 w-full h-[35%] bg-gradient-to-t from-[#050505] to-transparent z-10"></div>
      </div>

      {/* ─── Content Overlay ─── */}
      <div className="absolute inset-0 z-30 flex justify-center w-full pt-[6vw] md:pt-[2vw] px-6 md:px-12 pointer-events-none">
        <div className="relative w-full max-w-7xl flex flex-col h-full">
          {/* ─── Header ─── */}
          <div className="flex flex-col uppercase font-black leading-[0.85] tracking-tighter z-20 w-max pointer-events-auto">
            <motion.span 
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={headerVariants}
              className="text-white text-[12vw] md:text-[8vw] xl:text-[110px]"
            >
              STRATEGY
            </motion.span>
            <div className="flex gap-[2vw] md:gap-4">
              <motion.span 
                custom={1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={headerVariants}
                className="text-white text-[12vw] md:text-[8vw] xl:text-[110px]"
              >
                IS
              </motion.span>
              <motion.span 
                custom={2}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={headerVariants}
                className="text-[#9b1a1a] text-[12vw] md:text-[8vw] xl:text-[110px]"
              >
                OUR
              </motion.span>
            </div>
            <motion.span 
              custom={3}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={headerVariants}
              className="text-[#9b1a1a] text-[12vw] md:text-[8vw] xl:text-[110px]"
            >
              ADVANTAGE
            </motion.span>
          </div>

          {/* ─── Callouts (Pure Text) ─── */}

          {/* Text 1: Right Middle */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={textRightVariants}
            className="absolute top-[45%] md:top-[55%] lg:top-[60%] right-6 md:right-12 max-w-[65vw] md:max-w-[400px] text-[3.5vw] md:text-sm lg:text-base text-white/60 text-right pointer-events-auto bg-black/40 md:bg-transparent p-4 md:p-0 rounded-xl backdrop-blur-sm md:backdrop-blur-none"
          >
            <p>
              We define your{" "}
              <span className="text-white font-bold">strongest market</span>{" "}
              position before launch.
              <br className="hidden md:block" />
              We build <span className="text-white font-bold">
                systems
              </span>{" "}
              that scale sustainably.
              <br className="hidden md:block" /> No random campaigns.
            </p>
          </motion.div>

          {/* Text 2: Left Bottom */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={textLeftVariants}
            className="absolute top-[65%] md:top-[75%] lg:top-[80%] left-6 md:left-12 max-w-[65vw] md:max-w-[400px] text-[3.5vw] md:text-sm lg:text-base text-white/60 text-left pointer-events-auto bg-black/40 md:bg-transparent p-4 md:p-0 rounded-xl backdrop-blur-sm md:backdrop-blur-none"
          >
            <p>
              Only{" "}
              <span className="text-white font-bold">structured action.</span>{" "}
              <span className="text-white font-bold">Clear KPIs.</span>
              <br className="hidden md:block" />
              Transparent reporting.
              <br className="hidden md:block" /> Measurable impact.
              <br className="hidden md:block" /> Because real growth
              <br className="hidden md:block" />
              is built on structure
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
