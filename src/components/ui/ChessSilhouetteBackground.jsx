"use client";

import { useReducedMotion, motion } from "framer-motion";

/**
 * ChessSilhouetteBackground component
 * Sourced from standard open-source Staunton vectors (cburnett Wikimedia / Lichess set, CC BY-SA 3.0).
 * Features a regal King and Knight silhouette cropped at the right and bottom edges with a faint crimson rim-light.
 */
export default function ChessSilhouetteBackground() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className="absolute right-[-40px] sm:right-[-20px] lg:right-[0px] bottom-[-20px] sm:bottom-[-10px] w-[340px] sm:w-[460px] lg:w-[560px] h-[380px] sm:h-[480px] lg:h-[540px] pointer-events-none select-none overflow-hidden z-0"
      aria-hidden="true"
    >
      <motion.div
        className="relative w-full h-full text-white/5"
        style={{
          filter: "drop-shadow(-6px 0 18px rgba(220, 38, 38, 0.32))",
        }}
        animate={
          shouldReduceMotion
            ? {}
            : {
                x: [0, 6, 0],
                y: [0, -5, 0],
              }
        }
        transition={{
          duration: 26,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* King Silhouette (Standing taller on the right) */}
          <g transform="translate(180, 40) scale(1.15)">
            {/* King Cross */}
            <path d="M120 28 h12 v18 h-12 z M110 33 h32 v8 h-32 z" />
            {/* King Crown & Head Structure */}
            <path d="M126 46 c-12 0 -22 10 -22 22 c0 7 4 14 10 18 c-20 8 -34 25 -34 47 c0 18 9 32 22 42 c-18 10 -30 30 -30 52 c0 22 12 42 30 52 c-22 8 -40 28 -40 52 h128 c0 -24 -18 -44 -40 -52 c18 -10 30 -30 30 -52 c0 -22 -12 -42 -30 -52 c13 -10 22 -24 22 -42 c0 -22 -14 -39 -34 -47 c6 -4 10 -11 10 -18 c0 -12 -10 -22 -22 -22 z" />
            {/* King Stepped Base Plinth */}
            <rect x="52" y="340" width="148" height="18" rx="4" />
            <rect x="42" y="358" width="168" height="22" rx="4" />
          </g>

          {/* Knight Silhouette (Standing in front on the left, facing towards content) */}
          <g transform="translate(20, 130) scale(0.95)">
            {/* Standard Staunton Knight outline */}
            <path d="M150 70 c-18 -12 -38 -8 -50 4 c-8 8 -12 18 -16 30 c-10 6 -24 16 -30 30 c-8 18 -6 38 4 52 c8 12 20 18 34 20 c-4 8 -6 18 -4 28 c4 20 18 36 36 46 c-18 6 -32 20 -38 38 h138 c-4 -18 -18 -32 -36 -38 c14 -8 24 -22 28 -38 c6 -24 0 -48 -14 -68 c-10 -14 -24 -24 -36 -32 c4 -12 10 -22 18 -30 c8 -8 14 -10 18 -12 c-10 -16 -28 -24 -50 -30 z" />
            {/* Knight Base Plinth */}
            <rect x="80" y="300" width="128" height="16" rx="3" />
            <rect x="70" y="316" width="148" height="20" rx="3" />
          </g>
        </svg>
      </motion.div>
    </div>
  );
}
