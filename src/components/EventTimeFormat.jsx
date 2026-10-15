"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import styles from "./EventTimeFormat.module.css";

function timeControlText(value) {
  if (typeof value === "string") return value.trim();
  if (!value || typeof value !== "object") return "";

  const minutes = value.minutes ?? value.initialMinutes ?? value.baseMinutes;
  const increment = value.incrementSeconds ?? value.increment;
  if (
    minutes != null &&
    increment != null &&
    String(minutes).trim() !== "" &&
    String(increment).trim() !== "" &&
    Number.isFinite(Number(minutes)) &&
    Number(minutes) >= 0 &&
    Number.isFinite(Number(increment)) &&
    Number(increment) >= 0
  ) {
    return `${Number(minutes)} + ${Number(increment)}`;
  }
  return typeof value.label === "string" ? value.label.trim() : "";
}

function getTimeMeta(control, tierIndex = 0) {
  const parts = String(control || "")
    .split("+")
    .map((s) => s.trim());
  if (parts.length === 2 && !isNaN(Number(parts[0]))) {
    const mins = Number(parts[0]);
    const inc = Number(parts[1]);
    const isRapid = mins <= 10;
    return {
      category: isRapid ? "RAPID FORMAT" : "CLASSICAL FORMAT",
      desc: `${mins} minutes base · ${inc} seconds increment per move`,
    };
  }
  return {
    category: tierIndex === 0 ? "PRIMARY TIME CONTROL" : "CHAMPIONSHIP TIER",
    desc: "Official tournament clock regulations",
  };
}

function extractTimeTiers(event) {
  if (!event || !Array.isArray(event.sections) || event.sections.length === 0) {
    return [
      {
        control: "10 + 5",
        brackets: [
          { name: "Open Section — Beginner", range: "0 – 899" },
          { name: "Open Section — Intermediate", range: "900 – 1499" },
          { name: "Women's Section", range: "0 – 3000" },
          { name: "Inter-Club", range: "0 – 3000" },
        ],
      },
      {
        control: "15 + 2",
        brackets: [{ name: "Open Section — Advanced", range: "1500 – 3000" }],
      },
    ];
  }

  const map = new Map();

  for (const section of event.sections) {
    const secTitle =
      section.title ||
      (section.name === "womens" || section.name === "women"
        ? "Women's Section"
        : section.name === "interclub"
          ? "Inter-Club"
          : section.name
            ? section.name.charAt(0).toUpperCase() + section.name.slice(1)
            : "Section");

    const rawBrackets = Array.isArray(section.brackets) ? section.brackets : [];

    if (rawBrackets.length > 0) {
      for (const brk of rawBrackets) {
        const tc =
          timeControlText(
            brk.timeControl ??
              brk.timeFormat ??
              section.timeControl ??
              section.timeFormat ??
              event.timeControl ??
              event.timeFormat,
          ) || "10 + 5";

        const brkName = brk.name
          ? brk.name.toLowerCase() === "open"
            ? "All Ratings"
            : brk.name.charAt(0).toUpperCase() + brk.name.slice(1)
          : "";

        const displayName = brkName ? `${secTitle} — ${brkName}` : secTitle;
        const range =
          brk.range ||
          (brk.minRating != null && brk.maxRating != null
            ? `${brk.minRating} – ${brk.maxRating}`
            : "");

        if (!map.has(tc)) {
          map.set(tc, []);
        }
        map.get(tc).push({ name: displayName, range });
      }
    } else {
      const tc =
        timeControlText(
          section.timeControl ??
            section.timeFormat ??
            event.timeControl ??
            event.timeFormat,
        ) || "10 + 5";

      if (!map.has(tc)) {
        map.set(tc, []);
      }
      map.get(tc).push({ name: secTitle, range: "" });
    }
  }

  if (map.size === 0) {
    const defaultCtrl =
      timeControlText(event?.timeControl ?? event?.timeFormat) || "10 + 5";
    return [
      {
        control: defaultCtrl,
        brackets: [{ name: "All Tournament Brackets", range: "" }],
      },
    ];
  }

  return Array.from(map.entries()).map(([control, brackets]) => ({
    control,
    brackets,
  }));
}

function ClockArtwork({ id, side = "left" }) {
  const isRight = side === "right";

  return (
    <div
      className={`${styles.clockArtwork} ${isRight ? styles.clockRight : styles.clockLeft}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1254 1254" focusable="false">
        <defs>
          <clipPath id={`minute-${id}`}>
            <polygon points="553,800 0,248 0,0 850,0" />
            <polygon points="553,800 900,1200 400,1200" />
          </clipPath>
          <clipPath id={`hour-${id}`}>
            <polygon points="553,800 1000,0 1254,560 1254,700" />
            <polygon points="553,800 0,1000 0,1254 250,1254" />
          </clipPath>
          <clipPath id={`second-${id}`}>
            <polygon points="553,800 1254,620 1254,1150" />
            <polygon points="553,800 0,650 0,930" />
          </clipPath>
          <clipPath id={`hub-${id}`}>
            <circle cx="553" cy="800" r="43" />
          </clipPath>
        </defs>
        <g transform="translate(412.8 295) scale(.4)">
          <g className={`${styles.handReveal} ${styles.hourReveal}`}>
            <g className={`${styles.clockHand} ${styles.hourHand}`}>
              <image
                href="/event/clock_hands.webp"
                width="1254"
                height="1254"
                clipPath={`url(#hour-${id})`}
                decoding="async"
              />
            </g>
          </g>

          <g className={`${styles.handReveal} ${styles.minuteReveal}`}>
            <g className={`${styles.clockHand} ${styles.minuteHand}`}>
              <image
                href="/event/clock_hands.webp"
                width="1254"
                height="1254"
                clipPath={`url(#minute-${id})`}
                decoding="async"
              />
            </g>
          </g>

          <g className={`${styles.handReveal} ${styles.secondReveal}`}>
            <g className={`${styles.clockHand} ${styles.secondHand}`}>
              <image
                href="/event/clock_hands.webp"
                width="1254"
                height="1254"
                clipPath={`url(#second-${id})`}
                decoding="async"
              />
            </g>
          </g>

          <g className={`${styles.handReveal} ${styles.hubReveal}`}>
            <image
              href="/event/clock_hands.webp"
              width="1254"
              height="1254"
              clipPath={`url(#hub-${id})`}
              decoding="async"
            />
          </g>
        </g>
        <image
          className={styles.clockFrameImg}
          href="/event/clock_frame.webp"
          width="1254"
          height="1254"
          decoding="async"
        />
      </svg>
    </div>
  );
}

function useClockStage(ref) {
  const [stage, setStage] = useState("idle");

  useEffect(() => {
    let timer1, timer2;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStage((prev) => {
            if (prev === "idle") {
              timer1 = setTimeout(() => {
                setStage("revealed");
                timer2 = setTimeout(() => {
                  setStage("moving");
                }, 750);
              }, 700);
              return "entered";
            }
            if (prev === "paused") {
              return "moving";
            }
            return prev;
          });
        } else {
          setStage((prev) => (prev === "moving" ? "paused" : prev));
        }
      },
      {
        rootMargin: "-30px 0px -30px 0px",
        threshold: 0.12,
      },
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [ref]);

  return stage;
}

export default function EventTimeFormat({
  event: providedEvent = null,
  className = "",
}) {
  const tier1Ref = useRef(null);
  const tier2Ref = useRef(null);
  const [request, setRequest] = useState({ loading: true, event: null });
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const event = providedEvent ?? request.event;
  const tiers = extractTimeTiers(event);

  const stage1 = useClockStage(tier1Ref);
  const stage2 = useClockStage(tier2Ref);

  useEffect(() => {
    if (providedEvent) return;
    let mounted = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    async function loadEvent() {
      try {
        const apiUrl = (
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
        ).replace(/\/$/, "");
        const response = await fetch(`${apiUrl}/events`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Failed to load event time format");
        const data = await response.json();
        const events = Array.isArray(data?.events)
          ? data.events.filter(Boolean)
          : [];
        const current =
          events.find((item) =>
            ["active", "in_progress", "upcoming"].includes(item.status),
          ) || events[0];
        if (mounted) setRequest({ loading: false, event: current ?? null });
      } catch {
        if (mounted) setRequest({ loading: false, event: null });
      } finally {
        clearTimeout(timeout);
      }
    }

    loadEvent();
    return () => {
      mounted = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [providedEvent]);

  const tier1Entered = stage1 !== "idle";
  const tier1Revealed =
    stage1 === "revealed" || stage1 === "moving" || stage1 === "paused";
  const tier1Moving = stage1 === "moving";

  const tier2Entered = stage2 !== "idle";
  const tier2Revealed =
    stage2 === "revealed" || stage2 === "moving" || stage2 === "paused";
  const tier2Moving = stage2 === "moving";

  const tier1 = tiers[0] || {
    control: "10 + 5",
    brackets: [{ name: "Open Section", range: "All Ratings" }],
  };
  const tier2 = tiers[1] || null;

  const tier1Meta = getTimeMeta(tier1.control, 0);
  const tier2Meta = tier2 ? getTimeMeta(tier2.control, 1) : null;

  return (
    <section
      className={`${styles.timeSection} ${className}`}
      aria-labelledby={`event-time-title-${id}`}
    >
      <div className={styles.intro}>
        <h2 id={`event-time-title-${id}`} className={styles.title}>
          <span className={styles.whiteLine}>ROYAL</span>
          <span className={styles.redLine}>HOURS</span>
        </h2>
      </div>

      <div
        ref={tier1Ref}
        className={`${styles.tier} ${tier1Entered ? styles.clockEntered : ""} ${tier1Revealed ? styles.needlesRevealed : ""} ${tier1Moving ? styles.clockMoving : ""}`}
      >
        <ClockArtwork id={`left-${id}`} side="left" />

        <div className={styles.tierContentRight}>
          <div className={styles.infoBlockRight}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.8,
                delay: 0.18,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={styles.timeBlock}
            >
              <div className={styles.timeHeader}>
                <span className={styles.timeDisplay}>{tier1.control}</span>
                <div className={styles.timeMeta}>
                  <span className={styles.timeDesc}>{tier1Meta.desc}</span>
                </div>
              </div>

              <div className={styles.divisionsWrapper}>
                <div className={styles.divisionsHeader}>
                  <h3 className={styles.divisionsKicker}>
                    DIVISIONS & RATING TIERS
                  </h3>
                </div>

                <div
                  className={`${styles.bracketGrid} ${tier1.brackets.length === 1 ? styles.bracketGridSingle : ""}`}
                >
                  {tier1.brackets.map((b, idx) => (
                    <div key={idx} className={styles.bracketRow}>
                      <span className={styles.bracketName}>{b.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {tier2 && (
        <div
          ref={tier2Ref}
          className={`${styles.tier} ${styles.tierSecond} ${tier2Entered ? styles.clockEntered : ""} ${tier2Revealed ? styles.needlesRevealed : ""} ${tier2Moving ? styles.clockMoving : ""}`}
        >
          <div className={styles.tierContentLeft}>
            <div className={styles.infoBlockLeft}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.8,
                  delay: 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={styles.timeBlock}
              >
                <div className={styles.timeHeader}>
                  <span className={styles.timeDisplay}>{tier2.control}</span>
                  {tier2Meta && (
                    <div className={styles.timeMeta}>
                      <span className={styles.timeDesc}>{tier2Meta.desc}</span>
                    </div>
                  )}
                </div>

                <div className={styles.divisionsWrapper}>
                  <div className={styles.divisionsHeader}>
                    <h3 className={styles.divisionsKicker}>
                      DIVISIONS & RATING TIERS
                    </h3>
                  </div>

                  <div
                    className={`${styles.bracketGrid} ${tier2.brackets.length === 1 ? styles.bracketGridSingle : ""}`}
                  >
                    {tier2.brackets.map((b, idx) => (
                      <div key={idx} className={styles.bracketRow}>
                        <span className={styles.bracketName}>{b.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <ClockArtwork id={`right-${id}`} side="right" />
        </div>
      )}
    </section>
  );
}
