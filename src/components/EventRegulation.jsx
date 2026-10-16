"use client";

import { useEffect, useState } from "react";
import ScrollStack, { ScrollStackItem } from "./ScrollStack";
import styles from "./EventRegulation.module.css";

const STAGE_CODES = ["e3", "e4", "e5"];

function splitStageTitle(rawTitle) {
  if (!rawTitle) return { upper: "", lower: "" };
  const cleaned = rawTitle.trim();
  const lower = cleaned.toLowerCase();

  if (lower.includes("swiss")) {
    return { upper: "SWISS", lower: "LEAGUE PHASE" };
  }
  if (lower.includes("grand") || lower.includes("final")) {
    return { upper: "THE", lower: "GRAND FINALS" };
  }
  if (lower.includes("knockout") || lower.includes("elimination")) {
    return { upper: "ELIMINATION", lower: "KNOCKOUT STAGE" };
  }

  const words = cleaned.split(/\s+/);
  if (words.length <= 1) return { upper: cleaned, lower: "" };
  if (words.length === 2) return { upper: words[0], lower: words[1] };
  if (words[0].toLowerCase() === "the") {
    return { upper: words[0], lower: words.slice(1).join(" ") };
  }
  return { upper: words[0], lower: words.slice(1).join(" ") };
}

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
      } catch (err) {
        if (isMounted) setLoading(false);
      }
    }

    loadFormat();
    return () => {
      isMounted = false;
    };
  }, [initialFormat, providedEvent]);

  const parsed = parseFormatText(format);

  return (
    <section className={styles.section} aria-label="Tournament Regulation">
      {/* Atmospheric top fade */}
      <div className={styles.topFade} />

      {/* Top Header: THE REGULATION */}
      <div className={styles.headerContainer}>
        <h2 className={styles.sectionHeader}>
          <span className={styles.whiteLine}>THE</span>
          <span className={styles.redLine}>REGULATION</span>
        </h2>
      </div>

      {/* Stacking Cards Container using ReactBits ScrollStack */}
      <div className={styles.stackOuterWrapper}>
        <ScrollStack
          useWindowScroll={true}
          smoothScroll={false}
          stackPosition="12%"
          itemDistance={140}
          itemStackDistance={28}
          itemScale={0.045}
          baseScale={0.88}
          dimAmount={0.2}
          tiltAmount={0}
          rotationAmount={0}
          holdDistance={180}
          className={styles.stackWrapper}
        >
          {parsed.stages.map((stg, sIdx) => {
            const stageCode = STAGE_CODES[sIdx] || `e${sIdx + 3}`;
            const isNormalLayout = sIdx % 2 === 0;

            return (
              <ScrollStackItem
                key={sIdx}
                itemClassName={styles.regulationCard}
              >
                <div
                  className={`${styles.cardInner} ${
                    isNormalLayout
                      ? styles.stageLayoutNormal
                      : styles.stageLayoutReversed
                  }`}
                >
                  {/* Content Column */}
                  <div className={styles.contentCol}>
                    <span className={styles.stageKicker}>
                      STAGE 0{stg.num || sIdx + 1}
                    </span>

                    {(() => {
                      const { upper, lower } = splitStageTitle(
                        stg.title || `STAGE ${sIdx + 1}`,
                      );
                      return (
                        <h3 className={styles.stageTitle}>
                          {upper && (
                            <span className={styles.stageTitleUpper}>{upper}</span>
                          )}
                          {lower && (
                            <span className={styles.stageTitleLower}>{lower}</span>
                          )}
                        </h3>
                      );
                    })()}

                    <p className={styles.stageBody}>{stg.body}</p>
                  </div>

                  {/* Numeral Column */}
                  <div className={styles.numberCol}>
                    <span className={styles.giantNumeral}>{stageCode}</span>
                  </div>
                </div>
              </ScrollStackItem>
            );
          })}
        </ScrollStack>
      </div>

      {/* Trailing paragraphs (if any) */}
      {parsed.paragraphs.length > 0 && (
        <div className={styles.trailingContainer}>
          <div className="space-y-4 max-w-3xl">
            {parsed.paragraphs.map((p, idx) => (
              <p
                key={idx}
                className="text-base sm:text-lg md:text-[20px] text-slate-200 font-normal leading-relaxed md:leading-[1.85] tracking-[0.015em]"
                style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif" }}
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
