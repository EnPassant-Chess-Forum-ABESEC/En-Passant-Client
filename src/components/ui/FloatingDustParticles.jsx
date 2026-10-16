"use client";

import { useReducedMotion, motion } from "framer-motion";

const PARTICLES = [
  { id: 1, x: "12%", size: 2, duration: 18, delay: 0 },
  { id: 2, x: "24%", size: 1.5, duration: 22, delay: 3 },
  { id: 3, x: "35%", size: 2.5, duration: 16, delay: 6 },
  { id: 4, x: "48%", size: 1.5, duration: 24, delay: 1 },
  { id: 5, x: "58%", size: 2, duration: 19, delay: 8 },
  { id: 6, x: "67%", size: 1.5, duration: 21, delay: 4 },
  { id: 7, x: "78%", size: 2.5, duration: 17, delay: 10 },
  { id: 8, x: "88%", size: 2, duration: 23, delay: 2 },
  { id: 9, x: "18%", size: 1.5, duration: 20, delay: 7 },
  { id: 10, x: "42%", size: 2, duration: 18, delay: 11 },
  { id: 11, x: "72%", size: 1.5, duration: 22, delay: 5 },
  { id: 12, x: "92%", size: 2, duration: 19, delay: 9 },
];

/**
 * FloatingDustParticles component
 * Inspired by Magic UI Particles / Aceternity ambient particles.
 * Renders tiny, whisper-quiet floating dust motes drifting upward very slowly.
 */
export default function FloatingDustParticles() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-[2]"
      aria-hidden="true"
    >
      {PARTICLES.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-gradient-to-t from-[#ff7171]/40 to-white/70"
          style={{
            left: p.x,
            bottom: "-10px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            boxShadow: `0 0 ${p.size * 2}px rgba(255, 255, 255, 0.4)`,
          }}
          animate={{
            y: ["0px", "-650px"],
            x: [0, (p.id % 2 === 0 ? 1 : -1) * 14, 0],
            opacity: [0, 0.45, 0.6, 0.2, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
