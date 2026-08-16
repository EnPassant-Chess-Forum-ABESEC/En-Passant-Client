"use client";

import { motion } from "framer-motion";
import DriftWall from "./DriftWall";

const clubImages = [
  "/our_legacy/1.jpg",
  "/our_legacy/2.jpg",
  "/our_legacy/3.jpg",
  "/our_legacy/4.jpg",
  "/our_legacy/5.jpg",
  "/our_legacy/6.jpg",
  "/our_legacy/7.jpg",
  "/our_legacy/8.jpg",
  "/our_legacy/9.png",
  "/our_legacy/10.jpg",
];

const randomizedIndices = [2, 9, 5, 6, 1, 7, 1, 0, 4, 8, 4, 8, 3, 2, 9];

const items = randomizedIndices.map((imgIndex, i) => ({
  image: clubImages[imgIndex],
  title: `Memory ${i + 1}`,
}));

export default function DriftWallSection() {
  const premiumEase = [0.16, 1, 0.3, 1];

  const headerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease: premiumEase, delay: custom * 0.15 },
    }),
  };

  return (
    <section className="relative w-full bg-[#050505] overflow-hidden font-sans py-24">
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'url("/common/dark_marble_bg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <div className="absolute inset-0 z-0 bg-black/40 pointer-events-none"></div>

      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#050505] via-[#050505]/60 to-transparent z-10 pointer-events-none"></div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 mb-16 text-left">
        <h2 className="flex flex-col uppercase font-pezula font-bold tracking-[0.04em] md:tracking-[0.08em] leading-[0.8]">
          <motion.span
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={headerVariants}
            className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] text-[15vw] md:text-[100px]"
          >
            OUR
          </motion.span>
          <span className="text-[15vw] md:text-[100px]">
            <motion.span
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={headerVariants}
              className="text-[#9b1a1a] drop-shadow-[0_0_20px_rgba(155,26,26,0.4)] inline-block"
            >
              LEGACY
            </motion.span>
          </span>
        </h2>
      </div>

      <div className="relative w-full h-[600px] md:h-[800px] z-20">
        <DriftWall
          items={items}
          columns={5}
          speed={30}
          pauseOnHover={true}
          overlayColor="#050505"
          dim={0.6}
          fade={0.5}
          tilt={0}
          turn={0}
          roll={0}
          depth={0}
          parallax={0}
        />
      </div>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-30 pointer-events-none" />
    </section>
  );
}
