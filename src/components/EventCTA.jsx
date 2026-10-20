"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./EventCTA.module.css";

export default function EventCTA({ event = null }) {
  const eventSlug = event?._id || event?.title || "ACC";
  const registerHref = `/events/${eventSlug}/register`;

  return (
    <section
      className={styles.ctaSection}
      aria-label="Event Registration Call to Action"
    >
      <div className={styles.vignetteTop} aria-hidden="true" />
      <div className={styles.vignetteBottom} aria-hidden="true" />
      <div className={styles.radialVignette} aria-hidden="true" />

      {/* Layer 1: Marble Hands */}
      <div className={styles.handsLayer} aria-hidden="true">
        <Image
          src="/event/cta/hands.webp"
          alt=""
          fill
          sizes="100vw"
          className={styles.handsImg}
        />
      </div>

      {/* Layer 2: Blood & Roses Wreath Circle */}
      <div className={styles.wreathContainer} aria-hidden="true">
        <Image
          src="/event/cta/circle_btm.webp"
          alt=""
          fill
          className={styles.wreathBtm}
        />
        <Image
          src="/event/cta/circle_top.webp"
          alt=""
          fill
          className={styles.wreathTop}
        />
      </div>

      {/* Layer 3: Final Register CTA Button with Vine Canes & Roses */}
      <div className={styles.ctaWrapper}>
        <Link
          href={registerHref}
          className={`${styles.redBracketVineBtn} cursor-good group`}
          aria-label="Register for Event"
        >
          {/* Layer A: Leaves Layer (BEHIND the vine cane path so stems are hidden under the cane) */}
          <div className={styles.leafLayer} aria-hidden="true">
            {/* Edge Leaf 1: Stem tucked behind top vine cane near left corner */}
            <div className={styles.organicLeaf1}>
              <Image
                src="/roses/leaves/event_cta_leaves.webp"
                alt=""
                width={38}
                height={38}
                className={styles.edgeLeafImg}
              />
            </div>

            {/* Edge Leaf 2: Stem tucked behind top vine cane at center */}
            <div className={styles.organicLeaf2}>
              <Image
                src="/roses/leaves/event_cta_leaves.webp"
                alt=""
                width={38}
                height={38}
                className={styles.edgeLeafImg}
              />
            </div>

            {/* Edge Leaf 3: Stem tucked behind right vine cane */}
            <div className={styles.organicLeaf3}>
              <Image
                src="/roses/leaves/event_cta_leaves.webp"
                alt=""
                width={38}
                height={38}
                className={styles.edgeLeafImg}
              />
            </div>

            {/* Edge Leaf 4: Stem tucked behind bottom vine cane */}
            <div className={styles.organicLeaf4}>
              <Image
                src="/roses/leaves/event_cta_leaves.webp"
                alt=""
                width={38}
                height={38}
                className={styles.edgeLeafImg}
              />
            </div>

            {/* Edge Leaf 5: Stem tucked behind left vine cane */}
            <div className={styles.organicLeaf5}>
              <Image
                src="/roses/leaves/event_cta_leaves.webp"
                alt=""
                width={38}
                height={38}
                className={styles.edgeLeafImg}
              />
            </div>
          </div>

          {/* Layer B: Solid Red Center Plaque with Roughened Straight Lines */}
          <div className={styles.redBtnInner}>
            {/* Button Text */}
            <span className={styles.redBtnText}>COME FORTH</span>
          </div>

          {/* Layer C: Sinuous Bramble Vine Cane Frame (in FRONT of leaves so canes hide their stems!) */}
          <svg
            className={styles.bracketVineSvg}
            viewBox="0 0 270 80"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* Primary Sinuous Rose Cane */}
            <path
              d="M 16 8 C 55 5, 95 9, 135 6 C 175 4, 215 8, 252 6 C 262 6, 265 14, 264 24 C 263 38, 266 50, 264 62 C 263 70, 256 74, 246 73 C 210 74, 165 71, 130 74 C 90 76, 50 72, 22 74 C 12 74, 6 68, 6 58 C 6 46, 8 32, 6 20 C 6 12, 10 8, 16 8 Z"
              className={styles.vineCaneMain}
            />
            {/* Secondary Intertwining Tendril Cane */}
            <path
              d="M 12 12 C 50 3, 90 10, 130 4 C 175 0, 220 11, 256 5 C 266 8, 261 24, 265 36 C 261 50, 266 60, 254 70 C 215 76, 175 70, 130 75 C 85 71, 45 76, 14 70 C 4 62, 8 48, 5 36 C 8 22, 4 14, 12 12 Z"
              className={styles.vineCaneTendril}
            />

            {/* Organic Briar Thorns along canes */}
            <path
              d="M 72 7 Q 74 1 79 2 Q 76 7 74 8 Z"
              className={styles.bracketThorn}
            />
            <path
              d="M 182 6 Q 185 0 190 1 Q 187 6 185 7 Z"
              className={styles.bracketThorn}
            />
            <path
              d="M 264 26 Q 270 28 269 33 Q 265 32 264 30 Z"
              className={styles.bracketThorn}
            />
            <path
              d="M 265 48 Q 271 51 269 56 Q 265 54 264 51 Z"
              className={styles.bracketThorn}
            />
            <path
              d="M 198 73 Q 196 79 191 78 Q 193 73 196 72 Z"
              className={styles.bracketThorn}
            />
            <path
              d="M 88 74 Q 85 80 80 79 Q 83 74 85 73 Z"
              className={styles.bracketThorn}
            />
            <path
              d="M 6 26 Q 0 24 1 19 Q 5 21 6 23 Z"
              className={styles.bracketThorn}
            />
            <path
              d="M 6 50 Q 0 51 0 56 Q 5 54 6 52 Z"
              className={styles.bracketThorn}
            />

            {/* Curled Tendril Shoots */}
            <path
              d="M 256 5 Q 268 1 267 -5"
              className={styles.bracketTendril}
            />
            <path d="M 14 70 Q 4 77 1 83" className={styles.bracketTendril} />
            <path d="M 12 12 Q 2 6 3 0" className={styles.bracketTendril} />
            <path
              d="M 254 70 Q 265 77 263 84"
              className={styles.bracketTendril}
            />
          </svg>

          {/* Layer D: Roses on top of the cane & plaque edge */}
          <div className={styles.rosesLayer} aria-hidden="true">
            {/* Edge Rose 1: Top edge, left */}
            <div className={styles.organicRose1}>
              <Image
                src="/roses/white/white_rose.webp"
                alt=""
                width={36}
                height={36}
                className={styles.edgeRoseImg}
              />
            </div>

            {/* Edge Rose 2: Top edge, right */}
            <div className={styles.organicRose2}>
              <Image
                src="/roses/white/white_rose_angle.webp"
                alt=""
                width={30}
                height={30}
                className={styles.edgeRoseImg}
              />
            </div>

            {/* Edge Rose 3: Bottom edge, right */}
            <div className={styles.organicRose3}>
              <Image
                src="/roses/white/white_rose.webp"
                alt=""
                width={34}
                height={34}
                className={styles.edgeRoseImg}
              />
            </div>

            {/* Edge Rose 4: Bottom edge, left */}
            <div className={styles.organicRose4}>
              <Image
                src="/roses/red/red_rose_angle.webp"
                alt=""
                width={28}
                height={28}
                className={styles.edgeRoseImg}
              />
            </div>
          </div>
        </Link>
      </div>

      {/* Layer 4: Headline */}
      <div className={styles.headingWrapper}>
        <div className={styles.headingContainer}>
          <h2 className={styles.title}>
            <span className={styles.whiteLine}>
              {Array.from("THE TIME").map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 35, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: "0px 0px -20px 0px" }}
                  transition={{
                    type: "spring",
                    stiffness: 65,
                    damping: 18,
                    delay: i * 0.035,
                  }}
                  className="inline-block"
                >
                  {ch === " " ? "\u00A0" : ch}
                </motion.span>
              ))}
            </span>
            <span className={styles.redLine}>
              {Array.from("HAS COME").map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 35, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: "0px 0px -20px 0px" }}
                  transition={{
                    type: "spring",
                    stiffness: 65,
                    damping: 18,
                    delay: 0.16 + i * 0.035,
                  }}
                  className="inline-block"
                >
                  {ch === " " ? "\u00A0" : ch}
                </motion.span>
              ))}
            </span>
          </h2>
        </div>
      </div>
    </section>
  );
}
