"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import styles from "./EventRegulation.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const premiumEase = [0.16, 1, 0.3, 1];
const STAGE_CODES = ["e3", "e4", "e5"];

function parseFormatText(rawText) {
  if (!rawText || !rawText.trim()) {
    return {
      title: "Swiss League & Knockout Finals",
      intro: [
        "The championship features a multi-stage competitive progression:",
      ],
      stages: [
        {
          num: "1",
          heading: "Stage 1 — Swiss League Phase",
          title: "Swiss League Phase",
          body: "All registered contenders compete in a multi-round Swiss-system tournament. There is no early elimination; every participant plays all scheduled league rounds against opponents of matching tournament scores, ensuring fair and balanced competition across all rating tiers.",
        },
        {
          num: "2",
          heading: "Stage 2 — Elimination Knockout Stage",
          title: "Elimination Knockout Stage",
          body: "Upon the conclusion of the Swiss league rounds, the highest-ranking seeds from each bracket advance into the single-elimination playoff bracket. Every match is a high-stakes, sudden-death knockout duel.",
        },
        {
          num: "3",
          heading: "Stage 3 — The Grand Finals",
          title: "The Grand Finals",
          body: "The knockout playoffs culminate in the definitive top 2 finalists who clash in the official championship finals match to determine the champion, claim the prestigious trophy, and take the top prize.",
        },
      ],
      paragraphs: [],
    };
  }

  const rawParagraphs = rawText
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (rawParagraphs.length === 0) {
    return { title: "", intro: [], stages: [], paragraphs: [] };
  }

  if (rawParagraphs.length === 1 && !rawParagraphs[0].includes("Stage")) {
    return {
      title: rawParagraphs[0],
      intro: [],
      stages: [],
      paragraphs: [],
    };
  }

  const title = rawParagraphs[0];
  const remaining = rawParagraphs.slice(1);

  const intro = [];
  const stages = [];
  const paragraphs = [];

  for (const p of remaining) {
    const match = p.match(
      /^[•\-*]?\s*Stage\s*(\d+)\s*[:—–-]\s*([^:]+?)(?::|\s*—|\s*–)?:\s*([\s\S]+)$/i,
    );

    if (match) {
      stages.push({
        num: match[1].trim(),
        heading: `Stage ${match[1].trim()} — ${match[2].trim()}`,
        title: match[2].trim(),
        body: match[3].trim(),
      });
    } else {
      const looseMatch = p.match(
        /^[•\-*]?\s*(Stage\s*(\d+)[^:]*):\s*([\s\S]+)$/i,
      );
      if (looseMatch) {
        const stageNum = looseMatch[2]?.trim() || `${stages.length + 1}`;
        const parts = looseMatch[1].split(/[—–-]/);
        const stageTitle = parts[1]?.trim() || parts[0]?.trim();
        stages.push({
          num: stageNum,
          heading: looseMatch[1].trim(),
          title: stageTitle,
          body: looseMatch[3].trim(),
        });
      } else if (stages.length === 0) {
        intro.push(p);
      } else {
        paragraphs.push(p);
      }
    }
  }

  return {
    title,
    intro,
    stages,
    paragraphs,
  };
}

export default function EventRegulation({
  event: providedEvent = null,
  initialFormat = "",
}) {
  const [format, setFormat] = useState(
    initialFormat ||
      providedEvent?.format ||
      providedEvent?.tournamentFormat ||
      "",
  );
  const [loading, setLoading] = useState(!format && !providedEvent);

  const lenis = useLenis();
  const stackWrapperRef = useRef(null);
  const cardRefs = useRef([]);
  const overlayRefs = useRef([]);
  const numeralRefs = useRef([]);

  useEffect(() => {
    if (initialFormat || providedEvent) {
      const f =
        initialFormat ||
        providedEvent?.format ||
        providedEvent?.tournamentFormat ||
        "";
      if (f) setFormat(f);
      setLoading(false);
      return;
    }

    let isMounted = true;
    async function loadFormat() {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
        const res = await fetch(`${apiUrl}/events`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        const eventsList = data?.events || [];

        const targetEvent =
          eventsList.find(
            (e) =>
              e.status === "active" ||
              e.status === "in_progress" ||
              e.status === "upcoming",
          ) || eventsList[0];

        if (isMounted) {
          const rawFmt = targetEvent?.format || targetEvent?.tournamentFormat;
          if (rawFmt) {
            setFormat(rawFmt);
          }
          setLoading(false);
        }
      } catch {
        if (isMounted) setLoading(false);
      }
    }

    loadFormat();
    return () => {
      isMounted = false;
    };
  }, [initialFormat, providedEvent]);

  const parsed = parseFormatText(format);

  // GSAP Stacking Cards Parallax Timeline (Desktop)
  useEffect(() => {
    if (loading || !parsed.stages || parsed.stages.length === 0) return;
    if (!stackWrapperRef.current) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return;

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (!isDesktop) return;

    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean);
      const overlays = overlayRefs.current.filter(Boolean);
      const numerals = numeralRefs.current.filter(Boolean);
      const totalStages = cards.length;
      if (totalStages <= 1) return;

      // Card 0 starts locked in at top: 0, scale: 1
      gsap.set(cards[0], { yPercent: 0, scale: 1, zIndex: 10 });

      // Cards 1..N start below the viewport at yPercent: 100 with ascending zIndex
      for (let i = 1; i < totalStages; i++) {
        gsap.set(cards[i], {
          yPercent: 100,
          scale: 1,
          zIndex: 10 + i,
        });
      }

      // Master ScrollTrigger timeline that pins stackWrapperRef
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stackWrapperRef.current,
          start: "top top",
          end: `+=${(totalStages - 1) * 115}%`,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: () => {
            lenis?.resize();
          },
        },
      });

      // Animate each subsequent stage stacking over the previous ones
      for (let i = 1; i < totalStages; i++) {
        const incomingCard = cards[i];
        const prevCard = cards[i - 1];
        const prevOverlay = overlays[i - 1];
        const incomingNumeral = numerals[i];
        const prevNumeral = numerals[i - 1];

        const label = `stage-stack-${i}`;

        // 1. Incoming card slides up onto the stack
        tl.to(
          incomingCard,
          {
            yPercent: 0,
            duration: 1,
            ease: "none",
          },
          label,
        );

        // 2. Incoming card's giant numeral glides up with subtle parallax
        if (incomingNumeral) {
          gsap.set(incomingNumeral, { yPercent: 16 });
          tl.to(
            incomingNumeral,
            {
              yPercent: 0,
              duration: 1,
              ease: "none",
            },
            label,
          );
        }

        // 3. Previous card scales down slightly (0.94) and darkens
        if (prevCard) {
          tl.to(
            prevCard,
            {
              scale: 0.94,
              duration: 1,
              ease: "none",
            },
            label,
          );
        }

        if (prevOverlay) {
          tl.to(
            prevOverlay,
            {
              opacity: 0.45,
              duration: 1,
              ease: "none",
            },
            label,
          );
        }

        if (prevNumeral) {
          tl.to(
            prevNumeral,
            {
              yPercent: -12,
              duration: 1,
              ease: "none",
            },
            label,
          );
        }

        // 4. If there is an older card (i - 2), recede it further
        if (i >= 2) {
          const olderCard = cards[i - 2];
          const olderOverlay = overlays[i - 2];
          if (olderCard) {
            tl.to(
              olderCard,
              {
                scale: 0.89,
                duration: 1,
                ease: "none",
              },
              label,
            );
          }
          if (olderOverlay) {
            tl.to(
              olderOverlay,
              {
                opacity: 0.7,
                duration: 1,
                ease: "none",
              },
              label,
            );
          }
        }
      }

      ScrollTrigger.refresh();
      lenis?.resize();
    }, stackWrapperRef);

    return () => ctx.revert();
  }, [loading, parsed.stages, lenis]);

  return (
    <section className={styles.section} aria-label="Tournament Regulation">
      {/* Atmospheric top fade */}
      <div className={styles.topFade} />

      {/* Top Header: THE REGULATION */}
      <div className={styles.headerContainer}>
        <h2 className={styles.sectionHeader}>
          <span className="flex flex-wrap">
            {Array.from("THE").map((letter, i) => (
              <motion.span
                key={i}
                initial={{ y: 35, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  type: "spring",
                  stiffness: 65,
                  damping: 18,
                  delay: i * 0.035,
                }}
                className="inline-block bg-gradient-to-b from-[#ffffff] via-[#e2e2e2] to-[#777777] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                {letter}
              </motion.span>
            ))}
          </span>
          <span className="flex flex-wrap mt-2">
            {Array.from("REGULATION").map((letter, i) => (
              <motion.span
                key={i}
                initial={{ y: 35, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  type: "spring",
                  stiffness: 65,
                  damping: 18,
                  delay: 0.14 + i * 0.035,
                }}
                className="inline-block text-[#9b1a1a]"
              >
                {letter}
              </motion.span>
            ))}
          </span>
        </h2>
      </div>

      {/* Pinned Stacking Cards Wrapper */}
      <div ref={stackWrapperRef} className={styles.stackWrapper}>
        {parsed.stages.map((stg, sIdx) => {
          const stageCode = STAGE_CODES[sIdx] || `e${sIdx + 3}`;
          const isNormalLayout = sIdx % 2 === 0;

          return (
            <div
              key={sIdx}
              ref={(el) => (cardRefs.current[sIdx] = el)}
              className={styles.stageSection}
              data-card-index={sIdx}
              id={`stage-${stageCode}`}
            >
              <div
                ref={(el) => (overlayRefs.current[sIdx] = el)}
                className={styles.cardDimOverlay}
              />

              <div
                className={`${styles.stageInner} ${
                  isNormalLayout
                    ? styles.stageLayoutNormal
                    : styles.stageLayoutReversed
                }`}
              >
                {/* Content Column */}
                <motion.div
                  initial={{ opacity: 0, x: isNormalLayout ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.8, ease: premiumEase }}
                  className={styles.contentCol}
                >
                  <h3 className={styles.stageTitle}>
                    {stg.title || `STAGE ${sIdx + 1}`}
                  </h3>

                  <p className={styles.stageBody}>{stg.body}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: isNormalLayout ? 60 : -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.8,
                    delay: 0.05,
                    ease: premiumEase,
                  }}
                  className={styles.numberCol}
                >
                  <span
                    ref={(el) => (numeralRefs.current[sIdx] = el)}
                    className={styles.giantNumeral}
                  >
                    {stageCode}
                  </span>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trailing paragraphs (if any) */}
      {parsed.paragraphs.length > 0 && (
        <div className={styles.trailingContainer}>
          <div className="space-y-4 max-w-3xl">
            {parsed.paragraphs.map((p, idx) => (
              <p
                key={idx}
                className="text-sm sm:text-base md:text-lg text-slate-300 font-normal leading-relaxed md:leading-[1.8]"
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Atmospheric bottom fade */}
      <div className={styles.bottomFade} />
    </section>
  );
}
