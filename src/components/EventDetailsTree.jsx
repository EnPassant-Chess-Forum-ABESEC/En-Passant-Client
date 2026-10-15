"use client";

import { useEffect, useRef, useState } from "react";
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
        { id: "advanced", name: "Advanced", range: "1500 - 3000" },
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

function normalizeData(json) {
  return {
    root: json.root || DEFAULT_TREE_DATA.root,
    eventName: json.eventName || DEFAULT_TREE_DATA.eventName,
    description: json.description || "",
    sections: (Array.isArray(json.sections)
      ? json.sections
      : DEFAULT_TREE_DATA.sections
    )
      .filter(Boolean)
      .map((section, index) => ({
        ...section,
        id: section.id || `section-${index}`,
        title: section.title || "Tournament section",
        brackets: (Array.isArray(section.brackets) ? section.brackets : [])
          .filter(Boolean)
          .map((bracket, bracketIndex) => {
            const match = (bracket.label || "").match(/^(.*?)\s*\((.*?)\)$/);
            return {
              id: bracket.id || `bracket-${bracketIndex}`,
              name:
                bracket.name ||
                (match ? match[1].trim() : bracket.label) ||
                "All Ratings",
              range: bracket.range || (match ? match[2].trim() : "All Ratings"),
            };
          }),
      })),
    prizes: {
      label: json.prizes?.label || DEFAULT_TREE_DATA.prizes.label,
      items: Array.isArray(json.prizes?.items)
        ? json.prizes.items.filter(Boolean)
        : DEFAULT_TREE_DATA.prizes.items,
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
  const bow =
    Math.sin(seed * 2.39996) *
    Math.min(42, Math.abs(dx) * 0.12 + Math.abs(dy) * 0.045) *
    sway;
  return stemThrough([
    from,
    { x: from.x + dx * 0.2 + bow, y: from.y + dy * 0.32 },
    { x: from.x + dx * 0.76 - bow * 0.65, y: from.y + dy * 0.71 },
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
      const exit = { x: bracket.bottom.x, y: bracket.bottom.y + 90 };
      connect(
        `tier-${index}-0`,
        position.bottom,
        bracket.top,
        401 + index,
        0.9,
      );
      connect(`tier-return-${index}-0`, bracket.bottom, exit, 601 + index, 0.8);
      return exit;
    }

    const leftX = Math.max(
      leftMargin + 18,
      Math.min(...brackets.map((bracket) => bracket.left)) - 30,
    );
    const rightX = Math.min(
      rightMargin - 18,
      Math.max(...brackets.map((bracket) => bracket.right)) + 30,
    );
    const last = brackets.at(-1);
    const supply = addStem(
      `tier-stem-${index}`,
      stemThrough([
        position.bottom,
        ...brackets.map((bracket, bracketIndex) => ({
          x: leftX + Math.sin(bracketIndex * 1.8 + index) * 10,
          y: bracket.top.y - 80,
        })),
        last.top,
      ]),
    );
    brackets
      .slice(0, -1)
      .forEach((bracket, bracketIndex) =>
        connect(
          `tier-${index}-${bracketIndex}`,
          pointOnStem(supply, bracket.top.y - 80),
          bracket.top,
          501 + bracketIndex,
          0.6,
        ),
      );

    const exit = { x: position.bottom.x, y: last.bottom.y + 128 };
    const returning = addStem(
      `tier-collector-${index}`,
      stemThrough([
        brackets[0].bottom,
        ...brackets.map((bracket, bracketIndex) => ({
          x: rightX + Math.sin(bracketIndex * 1.6 + index + 0.8) * 10,
          y: bracket.bottom.y + 64,
        })),
        exit,
      ]),
    );
    brackets
      .slice(1)
      .forEach((bracket, bracketIndex) =>
        connect(
          `tier-return-${index}-${bracketIndex + 1}`,
          bracket.bottom,
          pointOnStem(returning, bracket.bottom.y + 64),
          601 + bracketIndex,
          0.6,
        ),
      );
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

        addStem(
          `merge-${index}`,
          stemThrough([
            exit,
            { x: exit.x + Math.sin(index * 2.1 + 0.4) * 20, y: shoulderY },
            {
              x: exit.x + (merge.x - exit.x) * 0.7,
              y: shoulderY + (mergeY - shoulderY) * 0.6,
            },
            merge,
          ]),
        );
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
    prizeNodes.forEach((prize, index) =>
      connect(`prize-${index}`, fork, prize.top, 1001 + index * 43, 0.9),
    );
  }
  return { width: bounds.width, height: bounds.height, edges, junctions };
}
export default function EventDetailsTree() {
  const [data, setData] = useState(DEFAULT_TREE_DATA);
  const [geometry, setGeometry] = useState(null);
  const canvasRef = useRef(null);
  const lenis = useLenis();

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    async function load() {
      try {
        const response = await fetch("/api/event", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) return;
        const json = await response.json();
        if (!controller.signal.aborted && json && typeof json === "object")
          setData(normalizeData(json));
      } catch {
        // The full local fallback stays visible when the backend is unavailable.
      } finally {
        clearTimeout(timeout);
      }
    }
    load();
    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, []);

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
    if (!geometry || !canvas) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        canvas.querySelectorAll("[data-tree-path]").forEach((path, index) => {
          const edge = geometry.edges[index];
          const length = path.getTotalLength();
          gsap.fromTo(
            path,
            { strokeDasharray: length, strokeDashoffset: length },
            {
              strokeDashoffset: 0,
              ease: "none",
              scrollTrigger: {
                trigger: canvas,
                start: `top+=${edge.from} 82%`,
                end: `top+=${Math.max(edge.to, edge.from + 60)} 68%`,
                scrub: 0.45,
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
  }, [geometry]);

  const year = data.eventName.match(/\b20\d{2}\b/)?.[0];

  return (
    <section className={styles.tree} aria-labelledby="championship-hierarchy">
      <div className={styles.intro}>
        <div className={styles.kicker}>
          <span /> Tournament structure
        </div>
        <h2 id="championship-hierarchy" className={styles.title}>
          CHAMPIONSHIP
          <br />
          <span>HIERARCHY.</span>
        </h2>
        <p className={styles.introNote}>
          ABES Chess Championship
          <br />
          Sections, ratings &amp; prizes
        </p>
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
          <p className={styles.eyebrow}>
            ABES Chess Championship{year ? ` / ${year}` : ""}
          </p>
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
              >
                <p className={styles.eyebrow}>
                  Section / {String(index + 1).padStart(2, "0")}
                </p>
                <h3>{section.title}</h3>
                {section.description && (
                  <p className={styles.description}>{section.description}</p>
                )}
              </header>
              {section.brackets.length > 0 && (
                <ul
                  className={styles.brackets}
                  aria-label={`${section.title} rating brackets`}
                >
                  {section.brackets.map((bracket, bracketIndex) => (
                    <li
                      className={styles.bracket}
                      key={`${bracket.id}-${bracketIndex}`}
                      data-tree-node={`bracket-${index}-${bracketIndex}`}
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

        <div className={styles.prizeHeading} data-tree-node="prizes">
          <p className={styles.eyebrow}>Championship honours</p>
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
