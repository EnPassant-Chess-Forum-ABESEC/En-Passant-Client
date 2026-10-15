"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import RoseTreeCanvas from "./RoseTreeCanvas";
import styles from "./EventDetailsTree.module.css";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const DEFAULT_TREE_DATA = {
  root: "A C C",
  eventName: "ACC - ABES Chess Championship 2026",
  description: "ABES chess championship to crown the best player of ABES.",
  sections: [
    {
      id: "open",
      title: "Open Section",
      description: "Open Section with rating-tiered brackets",
      brackets: [
        { id: "beginner", name: "Beginner", range: "0 - 899" },
        { id: "intermediate", name: "Intermediate", range: "900 - 1499" },
        { id: "advance", name: "Advance", range: "1500 - 3000" },
      ],
    },
    {
      id: "womens",
      title: "Women's Section",
      description: "Exclusive section for female participants",
      brackets: [{ id: "womens-open", name: "All Ratings", range: "0 - 3000" }],
    },
    {
      id: "interclub",
      title: "Inter-Club",
      description: "Inter-club showdown for college representatives",
      brackets: [
        { id: "interclub-open", name: "All Ratings", range: "0 - 3000" },
      ],
    },
  ],
  prizes: {
    label: "Prizes & Accolades",
    items: [
      { id: "p1", place: "1st Place", reward: "₹5,000 + Trophy" },
      { id: "p2", place: "2nd Place", reward: "₹3,000 + Trophy" },
      { id: "p3", place: "3rd Place", reward: "₹1,500 + Medal" },
    ],
  },
};

function formatSectionTitle(sec, index) {
  if (sec.title && sec.title.trim()) return sec.title.trim();
  const name = sec.name ? String(sec.name).toLowerCase().trim() : "";
  if (name === "open") return "Open Section";
  if (name === "womens" || name === "women") return "Women's Section";
  if (name === "interclub") return "Inter-Club";
  if (name) return name.charAt(0).toUpperCase() + name.slice(1);
  return `Section ${index + 1}`;
}

function formatBracketName(brk, bracketIndex) {
  if (brk.name && brk.name.trim()) {
    const raw = brk.name.trim();
    if (raw.toLowerCase() === "open") return "All Ratings";
    if (raw.toLowerCase() === "advanced" || raw.toLowerCase() === "advance") return "Advance";
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }
  return `Bracket ${bracketIndex + 1}`;
}

function formatBracketRange(brk) {
  if (brk.range && String(brk.range).trim()) return String(brk.range).trim();
  if (brk.minRating != null && brk.maxRating != null) {
    return `${brk.minRating} - ${brk.maxRating}`;
  }
  return "All Ratings";
}

function formatRoot(event) {
  if (event.root && String(event.root).trim()) return String(event.root).trim();
  const title = event.title || event.eventName || "";
  const match = title.match(/^([A-Za-z0-9]+)\s*[—–-]/);
  if (match) {
    return match[1].split("").join(" ");
  }
  return "A C C";
}

function normalizeData(json) {
  if (!json || typeof json !== "object") return DEFAULT_TREE_DATA;

  const rawSections = Array.isArray(json.sections)
    ? json.sections
    : DEFAULT_TREE_DATA.sections;

  const sections = rawSections.filter(Boolean).map((section, index) => {
    const rawBrackets = Array.isArray(section.brackets) ? section.brackets : [];
    const brackets = rawBrackets
      .filter(Boolean)
      .map((bracket, bracketIndex) => {
        const match = (bracket.label || "").match(/^(.*?)\s*\((.*?)\)$/);
        const name =
          formatBracketName(bracket, bracketIndex) ||
          (match ? match[1].trim() : bracket.label) ||
          "All Ratings";
        const range =
          formatBracketRange(bracket) ||
          (match ? match[2].trim() : "All Ratings");

        return {
          id:
            bracket.id ||
            `${section.name || index}-${bracket.name || bracketIndex}`,
          name,
          range,
        };
      });

    return {
      id: section.id || section.name || `section-${index}`,
      title: formatSectionTitle(section, index),
      description: section.description || "",
      brackets,
    };
  });

  const rawPrizes = json.prizes;
  let prizesItems = [];
  let prizesLabel = "Prizes & Accolades";

  if (rawPrizes && typeof rawPrizes === "object") {
    prizesLabel = rawPrizes.label || "Prizes & Accolades";
    if (Array.isArray(rawPrizes.items) && rawPrizes.items.length > 0) {
      prizesItems = rawPrizes.items.filter(Boolean);
    } else if (Array.isArray(rawPrizes) && rawPrizes.length > 0) {
      prizesItems = rawPrizes.filter(Boolean);
    }
  }

  if (prizesItems.length === 0) {
    prizesItems = DEFAULT_TREE_DATA.prizes.items;
  }

  return {
    root: formatRoot(json),
    eventName: json.eventName || json.title || DEFAULT_TREE_DATA.eventName,
    description: json.description || DEFAULT_TREE_DATA.description,
    sections: sections.length > 0 ? sections : DEFAULT_TREE_DATA.sections,
    prizes: {
      label: prizesLabel,
      items: prizesItems,
    },
  };
}

function stemThrough(points) {
  const slopes = points.map((point, index) => {
    if (index === 0 || index === points.length - 1) return point.slope || 0;
    const before = points[index - 1];
    const after = points[index + 1];
    const beforeGap = point.y - before.y;
    const afterGap = after.y - point.y;
    const incoming = (point.x - before.x) / beforeGap;
    const outgoing = (after.x - point.x) / afterGap;

    if (incoming * outgoing <= 0) return 0;
    const firstWeight = 2 * afterGap + beforeGap;
    const secondWeight = afterGap + 2 * beforeGap;
    return (
      (firstWeight + secondWeight) /
      (firstWeight / incoming + secondWeight / outgoing)
    );
  });
  const segments = points.slice(1).map((to, index) => {
    const from = points[index];
    const third = (to.y - from.y) / 3;
    return {
      from,
      to,
      c1: { x: from.x + slopes[index] * third, y: from.y + third },
      c2: { x: to.x - slopes[index + 1] * third, y: to.y - third },
    };
  });
  const coordinate = (point) => `${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
  return {
    segments,
    d: `M ${coordinate(points[0])} ${segments
      .map(
        ({ c1, c2, to }) =>
          `C ${coordinate(c1)} ${coordinate(c2)} ${coordinate(to)}`,
      )
      .join(" ")}`,
  };
}

function pointOnStem(stem, y) {
  const segment =
    stem.segments.find(({ to }) => y <= to.y) || stem.segments.at(-1);
  const { from, c1, c2, to } = segment;
  const t = Math.max(0, Math.min(1, (y - from.y) / (to.y - from.y)));
  const u = 1 - t;
  return {
    x:
      u ** 3 * from.x +
      3 * u * u * t * c1.x +
      3 * u * t * t * c2.x +
      t ** 3 * to.x,
    y: from.y + (to.y - from.y) * t,
    slope:
      (3 * u * u * (c1.x - from.x) +
        6 * u * t * (c2.x - c1.x) +
        3 * t * t * (to.x - c2.x)) /
      (to.y - from.y),
  };
}

function organicVine(from, to, seed = 1, sway = 1) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.hypot(dx, dy);
  const naturalAmp = Math.max(16, Math.min(36, dist * 0.12));
  const sine = Math.sin(seed * 2.39996);
  const dir = sine >= 0 ? 1 : -1;
  const bow = dir * naturalAmp * (0.65 + 0.35 * Math.abs(sine)) * sway;
  return stemThrough([
    from,
    { x: from.x + dx * 0.25 + bow, y: from.y + dy * 0.32 },
    { x: from.x + dx * 0.75 - bow * 0.6, y: from.y + dy * 0.68 },
    to,
  ]);
}

function measureTree(canvas, data) {
  const bounds = canvas.getBoundingClientRect();
  const mobile = window.matchMedia("(max-width: 820px)").matches;
  const positions = new Map();
  canvas.querySelectorAll("[data-tree-node]").forEach((element) => {
    const rect = element.getBoundingClientRect();
    const x = rect.left - bounds.left + rect.width / 2;
    positions.set(element.dataset.treeNode, {
      left: rect.left - bounds.left,
      right: rect.right - bounds.left,
      top: { x, y: rect.top - bounds.top },
      bottom: { x, y: rect.bottom - bounds.top },
    });
  });
  const edges = [];
  const junctions = [];
  const addStem = (id, stem) => {
    edges.push({
      id,
      d: stem.d,
      from: stem.segments[0].from.y,
      to: stem.segments.at(-1).to.y,
      segments: stem.segments,
    });
    return stem;
  };
  const connect = (id, from, to, seed, sway) =>
    addStem(id, organicVine(from, to, seed, sway));
  const root = positions.get("root");
  const prizes = positions.get("prizes");
  if (!root || !prizes)
    return { width: bounds.width, height: bounds.height, edges, junctions };
  const sections = data.sections
    .map((section, index) => ({
      section,
      index,
      position: positions.get(`section-${index}`),
    }))
    .filter(({ position }) => position);
  const leftMargin = 12;
  const rightMargin = bounds.width - 12;

  if (sections.length && mobile) {
    const stem = addStem(
      "root-stem",
      stemThrough([
        root.bottom,
        ...sections.map(({ position }, index) => ({
          x: leftMargin + Math.sin(index * 1.7) * 6,
          y: position.top.y - 100,
        })),
      ]),
    );
    sections.forEach(({ position, index }) =>
      connect(
        `section-${index}`,
        pointOnStem(stem, position.top.y - 100),
        position.top,
        201 + index,
        0.7,
      ),
    );
  } else if (sections.length) {
    const mono = positions.get("monogram") || root;
    const monoCenter = mono.top.x;
    const monoBottom = mono.bottom.y;
    sections.forEach(({ position, index }) => {
      const spread =
        sections.length === 1 ? 0 : (index / (sections.length - 1) - 0.5) * 330;
      const origin = { x: monoCenter + spread, y: monoBottom - 6 };
      connect(`section-${index}`, origin, position.top, 301 + index * 41, 1.1);
    });
  } else {
    connect("root-prizes", root.bottom, prizes.top, 105, 0.8);
  }

  const exits = sections.map(({ section, index, position }) => {
    const brackets = section.brackets
      .map((_, bracketIndex) =>
        positions.get(`bracket-${index}-${bracketIndex}`),
      )
      .filter(Boolean);
    if (!brackets.length) return position.bottom;
    if (brackets.length === 1) {
      const bracket = brackets[0];
      const exit = { x: bracket.bottom.x, y: bracket.bottom.y + 100 };
      connect(
        `tier-${index}-0`,
        position.bottom,
        bracket.top,
        401 + index * 47,
        0.75,
      );
      connect(
        `tier-return-${index}-0`,
        bracket.bottom,
        exit,
        601 + index * 53,
        0.7,
      );
      return exit;
    }

    // Multiple brackets (e.g. Open Section: Beginner, Intermediate, Advance):
    // Cascading 3-way botanical branch directly from Section heading to each category
    // Exactly matching the smooth, natural botanical structure of Prizes!
    brackets.forEach((bracket, bracketIndex) => {
      connect(
        `tier-${index}-${bracketIndex}`,
        position.bottom,
        bracket.top,
        401 + index * 31 + bracketIndex * 47,
        0.8,
      );
    });

    // Convergence from brackets toward the central merge
    const last = brackets.at(-1);
    const exit = { x: position.bottom.x, y: last.bottom.y + 110 };

    // From lowest bracket (Advance) down into exit
    connect(
      `tier-collector-${index}`,
      last.bottom,
      exit,
      701 + index * 41,
      0.7,
    );

    // From Beginner and Intermediate downward into the exit convergence
    if (brackets[0]) {
      connect(
        `tier-return-${index}-0`,
        brackets[0].bottom,
        { x: position.bottom.x - 24, y: exit.y - 45 },
        601 + index,
        0.7,
      );
    }
    if (brackets[1]) {
      connect(
        `tier-return-${index}-1`,
        brackets[1].bottom,
        { x: position.bottom.x + 12, y: exit.y - 25 },
        602 + index,
        0.7,
      );
    }

    return exit;
  });

  if (exits.length) {
    const lowestExit = Math.max(...exits.map((point) => point.y));
    const mergeY = lowestExit + (prizes.top.y - lowestExit) * 0.58;
    const merge = { x: mobile ? rightMargin : prizes.top.x, y: mergeY };
    if (mobile) {
      const returning = addStem(
        "merge-0",
        stemThrough([
          exits[0],
          ...exits.map((exit, index) => ({
            x: rightMargin - Math.sin(index * 1.5) * 6,
            y: exit.y + 66,
          })),
          merge,
        ]),
      );
      exits
        .slice(1)
        .forEach((exit, index) =>
          connect(
            `merge-${index + 1}`,
            exit,
            pointOnStem(returning, exit.y + 66),
            801 + index,
            0.7,
          ),
        );
    } else {
      exits.forEach((exit, index) => {
        const shoulderY = lowestExit + 40;
        const span = shoulderY - exit.y;
        const waypoints = [exit];
        if (span > 120) {
          const steps = Math.min(3, Math.floor(span / 110));
          for (let s = 1; s <= steps; s++) {
            const fract = s / (steps + 1);
            const swayX = Math.sin(index * 3.7 + s * 2.2) * 20;
            waypoints.push({
              x: exit.x + swayX,
              y: exit.y + span * fract,
            });
          }
        }
        waypoints.push(
          { x: exit.x + Math.sin(index * 2.1 + 0.4) * 20, y: shoulderY },
          {
            x: exit.x + (merge.x - exit.x) * 0.7,
            y: shoulderY + (mergeY - shoulderY) * 0.6,
          },
          merge,
        );
        addStem(`merge-${index}`, stemThrough(waypoints));
      });
    }
    connect("prizes-stem", merge, prizes.top, 901, 0.8);
  }

  const prizeNodes = data.prizes.items
    .map((_, index) => positions.get(`prize-${index}`))
    .filter(Boolean);
  if (prizeNodes.length && mobile) {
    const stem = addStem(
      "podium-stem",
      stemThrough([
        prizes.bottom,
        ...prizeNodes.map((prize, index) => ({
          x: leftMargin + Math.sin(index * 1.7 + 0.4) * 6,
          y: prize.top.y - 80,
        })),
      ]),
    );
    prizeNodes.forEach((prize, index) =>
      connect(
        `prize-${index}`,
        pointOnStem(stem, prize.top.y - 80),
        prize.top,
        1001 + index,
        0.7,
      ),
    );
  } else if (prizeNodes.length) {
    const forkY =
      prizes.bottom.y + (prizeNodes[0].top.y - prizes.bottom.y) * 0.28;
    const stem = addStem(
      "podium-stem",
      organicVine(prizes.bottom, { x: prizes.bottom.x + 8, y: forkY }, 1000),
    );
    const fork = pointOnStem(stem, forkY);
    prizeNodes.forEach((prize, index) => {
      if (index === 2) {
        const dx = prize.top.x - fork.x;
        const dy = prize.top.y - fork.y;
        const target = { x: prize.top.x, y: prize.top.y - 14, slope: 0 };
        addStem(
          "prize-2",
          stemThrough([
            fork,
            { x: fork.x + dx * 0.38 + 10, y: fork.y + dy * 0.12 },
            { x: fork.x + dx * 0.72 - 12, y: fork.y + dy * 0.4 },
            { x: fork.x + dx * 0.94 + 14, y: fork.y + dy * 0.74 },
            target,
          ]),
        );
      } else {
        connect(`prize-${index}`, fork, prize.top, 1001 + index * 43, 0.9);
      }
    });
  }
  return { width: bounds.width, height: bounds.height, edges, junctions };
}
export default function EventDetailsTree({ event: initialEvent = null }) {
  const [data, setData] = useState(() =>
    initialEvent ? normalizeData(initialEvent) : DEFAULT_TREE_DATA,
  );
  const [geometry, setGeometry] = useState(null);
  const canvasRef = useRef(null);
  const lenis = useLenis();

  useEffect(() => {
    if (initialEvent) {
      setData(normalizeData(initialEvent));
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    async function load() {
      try {
        const apiUrl = (
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
        ).replace(/\/$/, "");
        const response = await fetch(`${apiUrl}/events`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) return;
        const resData = await response.json();
        const events = Array.isArray(resData?.events) ? resData.events : [];
        const current =
          events.find((e) =>
            ["active", "in_progress", "upcoming"].includes(e.status),
          ) || events[0];
        if (!controller.signal.aborted && current) {
          setData(normalizeData(current));
        }
      } catch {
      } finally {
        clearTimeout(timeout);
      }
    }
    load();
    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [initialEvent]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let frame;
    let disposed = false;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (disposed) return;
        const next = measureTree(canvas, data);
        setGeometry((previous) =>
          JSON.stringify(previous) === JSON.stringify(next) ? previous : next,
        );
        lenis?.resize();
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(canvas);
    canvas
      .querySelectorAll("[data-tree-node]")
      .forEach((node) => observer.observe(node));
    document.fonts.ready.then(measure);
    window.addEventListener("resize", measure);
    measure();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [data, lenis]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        // Text content nodes to reveal as scroll reaches them
        const revealElements = canvas.querySelectorAll("[data-tree-reveal]");
        revealElements.forEach((el) => {
          gsap.fromTo(
            el,
            {
              opacity: 0,
              y: 32,
              filter: "blur(6px)",
            },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top 86%",
                toggleActions: "play none none reverse",
                invalidateOnRefresh: true,
              },
            },
          );
        });

        ScrollTrigger.refresh();
      }, canvas);
      return () => context.revert();
    });
    return () => media.revert();
  }, [geometry, data]);

  const year = data.eventName.match(/\b20\d{2}\b/)?.[0];

  return (
    <section className={styles.tree} aria-labelledby="championship-hierarchy">
      <div className={styles.intro}>
        <motion.h2
          id="championship-hierarchy"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className={styles.title}
        >
          <span className={styles.whiteLine}>THE CROWN&apos;S</span>
          <span className={styles.redLine}>HIERARCHY</span>
        </motion.h2>
      </div>

      <div className={styles.canvas} ref={canvasRef}>
        <RoseTreeCanvas geometry={geometry} data={data} canvasRef={canvasRef} />

        {geometry && (
          <svg
            className={styles.paths}
            width={geometry.width}
            height={geometry.height}
            viewBox={`0 0 ${geometry.width} ${geometry.height}`}
            aria-hidden="true"
            focusable="false"
          >
            {geometry.edges.map((edge) => (
              <path
                key={`track-${edge.id}`}
                data-tree-guide={edge.id}
                className={`${styles.track} ${styles.canvasStem}`}
                d={edge.d}
              />
            ))}
            {geometry.junctions.map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="4"
                className={styles.junction}
              />
            ))}
          </svg>
        )}

        <div className={styles.root} data-tree-node="root">
          <p
            className={`${styles.monogram} ${geometry ? styles.monogramHidden : ""}`}
            data-tree-node="monogram"
          >
            {data.root}
          </p>
        </div>

        <div className={styles.divisions}>
          {data.sections.map((section, index) => (
            <article className={styles.division} key={`${section.id}-${index}`}>
              <header
                className={styles.sectionHeading}
                data-tree-node={`section-${index}`}
                data-tree-reveal
              >
                <h3>{section.title}</h3>
              </header>
              {section.brackets.length > 0 && (
                <ul
                  className={`${styles.brackets} ${section.brackets.length > 1 ? styles.bracketsCascading : ""}`}
                  aria-label={`${section.title} rating brackets`}
                >
                  {section.brackets.map((bracket, bracketIndex) => (
                    <li
                      className={`${styles.bracket} ${section.brackets.length > 1 ? styles[`bracketStep${bracketIndex}`] : ""}`}
                      key={`${bracket.id}-${bracketIndex}`}
                      data-tree-node={`bracket-${index}-${bracketIndex}`}
                      data-tree-reveal
                    >
                      <h4>{bracket.name}</h4>
                      <p className={styles.rating}>{bracket.range}</p>
                      <span className={styles.ratingLabel}>Rating range</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>

        <div
          className={styles.prizeHeading}
          data-tree-node="prizes"
          data-tree-reveal
        >
          <h3>{data.prizes.label}</h3>
        </div>
        <ol className={styles.podium} aria-label="Championship prizes">
          {data.prizes.items.map((prize, index) => {
            const [amount, ...accolades] = String(prize.reward || "").split(
              /\s*\+\s*/,
            );
            return (
              <li
                className={styles.prize}
                key={prize.id || index}
                data-tree-node={`prize-${index}`}
                data-tree-reveal
              >
                <p className={styles.eyebrow}>{prize.place}</p>
                <p className={styles.amount}>{amount}</p>
                {accolades.length > 0 && (
                  <p className={styles.accolade}>+ {accolades.join(" + ")}</p>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
