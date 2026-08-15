"use client";

import { motion } from "framer-motion";
import DriftWall from "./DriftWall";

// Some placeholder chess/club images for the wall
const clubImages = [
  "https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&q=80&w=600&h=400",
  "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80&w=600&h=400",
  "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?auto=format&fit=crop&q=80&w=600&h=400",
  "https://images.unsplash.com/photo-1560174038-da43ac74f01b?auto=format&fit=crop&q=80&w=600&h=400",
  "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?auto=format&fit=crop&q=80&w=600&h=400",
  "https://images.unsplash.com/photo-1588412079929-790d9f59729a?auto=format&fit=crop&q=80&w=600&h=400",
  "https://images.unsplash.com/photo-1610631070868-b80c35f29f04?auto=format&fit=crop&q=80&w=600&h=400",
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600&h=400",
];

const items = Array.from({ length: 15 }, (_, i) => ({
  image: clubImages[i % clubImages.length],
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

      {/* Top Fade */}
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

      {/* DriftWall Container */}
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

      {/* Bottom Fade - transitions into ClubJournalSection's #0a0a0a */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-30 pointer-events-none" />
    </section>
  );
}
