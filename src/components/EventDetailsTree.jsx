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

// =========================================================================
// 1. DETERMINISTIC PRNG & 2D SIMPLEX NOISE ENGINE
// =========================================================================
function createSeededRandom(seed = 12345) {
  let s = Math.abs(seed | 0) || 1;
  return function next() {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createSimplexNoise(seed = 12345) {
  const rand = createSeededRandom(seed);
  const perm = new Uint8Array(256);
  for (let i = 0; i < 256; i++) perm[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = perm[i];
    perm[i] = perm[j];
    perm[j] = tmp;
  }
  const p = new Uint8Array(512);
  for (let i = 0; i < 512; i++) p[i] = perm[i & 255];

  const grad2 = [
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  return function noise2D(xin, yin) {
    const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
    const s = (xin + yin) * F2;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
    const t = (i + j) * G2;
    const X0 = i - t;
    const Y0 = j - t;
    const x0 = xin - X0;
    const y0 = yin - Y0;

    const i1 = x0 > y0 ? 1 : 0;
    const j1 = x0 > y0 ? 0 : 1;

    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1.0 + 2.0 * G2;
    const y2 = y0 - 1.0 + 2.0 * G2;

    const ii = i & 255;
    const jj = j & 255;

    let n0 = 0;
    let n1 = 0;
    let n2 = 0;

    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 > 0) {
      t0 *= t0;
      const gi0 = p[ii + p[jj]] % 8;
      n0 = t0 * t0 * (grad2[gi0][0] * x0 + grad2[gi0][1] * y0);
    }

    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 > 0) {
      t1 *= t1;
      const gi1 = p[ii + i1 + p[jj + j1]] % 8;
      n1 = t1 * t1 * (grad2[gi1][0] * x1 + grad2[gi1][1] * y1);
    }

    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 > 0) {
      t2 *= t2;
      const gi2 = p[ii + 1 + p[jj + 1]] % 8;
      n2 = t2 * t2 * (grad2[gi2][0] * x2 + grad2[gi2][1] * y2);
    }

    return 70.0 * (n0 + n1 + n2);
  };
}

// =========================================================================
// 2. 2D CATMULL-ROM CUBIC SPLINE & EQUIDISTANT RESAMPLING
// =========================================================================
function smoothSpline(points, tension = 1.0) {
  if (!points || points.length < 2) {
    return { segments: [], d: "", points: points || [] };
  }
  const n = points.length;
  if (n === 2) {
    const p0 = points[0];
    const p1 = points[1];
    const dx = (p1.x - p0.x) / 3;
    const dy = (p1.y - p0.y) / 3;
    const segments = [
      {
        from: p0,
        to: p1,
        c1: { x: p0.x + dx, y: p0.y + dy },
        c2: { x: p1.x - dx, y: p1.y - dy },
      },
    ];
    const coord = (p) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
    return {
      segments,
      d: `M ${coord(p0)} C ${coord(segments[0].c1)} ${coord(segments[0].c2)} ${coord(p1)}`,
      tangents: [
        { x: p1.x - p0.x, y: p1.y - p0.y },
        { x: p1.x - p0.x, y: p1.y - p0.y },
      ],
      points,
    };
  }

  const tangents = [];
  for (let i = 0; i < n; i++) {
    const pt = points[i];
    if (pt.tangent) {
      const len = Math.hypot(pt.tangent.x, pt.tangent.y) || 1;
      tangents.push({ x: pt.tangent.x / len, y: pt.tangent.y / len });
      continue;
    }
    if (i === 0) {
      const dx = points[1].x - points[0].x;
      const dy = points[1].y - points[0].y;
      const len = Math.hypot(dx, dy) || 1;
      tangents.push({ x: dx / len, y: dy / len });
    } else if (i === n - 1) {
      const dx = points[n - 1].x - points[n - 2].x;
      const dy = points[n - 1].y - points[n - 2].y;
      const len = Math.hypot(dx, dy) || 1;
      tangents.push({ x: dx / len, y: dy / len });
    } else {
      const prev = points[i - 1];
      const next = points[i + 1];
      const d1 = Math.hypot(pt.x - prev.x, pt.y - prev.y) || 1;
      const d2 = Math.hypot(next.x - pt.x, next.y - pt.y) || 1;
      const u1x = (pt.x - prev.x) / d1;
      const u1y = (pt.y - prev.y) / d1;
      const u2x = (next.x - pt.x) / d2;
      const u2y = (next.y - pt.y) / d2;
      const wx = u1x + u2x;
      const wy = u1y + u2y;
      const wLen = Math.hypot(wx, wy);
      if (wLen > 0.0001) {
        tangents.push({ x: wx / wLen, y: wy / wLen });
      } else {
        tangents.push({ x: u2x, y: u2y });
      }
    }
  }

  const segments = [];
  for (let i = 0; i < n - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const dist = Math.hypot(p1.x - p0.x, p1.y - p0.y);
    const k = (dist / 3) * tension;
    const t0 = tangents[i];
    const t1 = tangents[i + 1];
    segments.push({
      from: p0,
      to: p1,
      c1: { x: p0.x + t0.x * k, y: p0.y + t0.y * k },
      c2: { x: p1.x - t1.x * k, y: p1.y - t1.y * k },
    });
  }

  const coord = (p) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
  const d = `M ${coord(points[0])} ${segments
    .map(
      ({ c1, c2, to }) => `C ${coord(c1)} ${coord(c2)} ${coord(to)}`,
    )
    .join(" ")}`;

  return { segments, d, tangents, points };
}

function sampleSplineEquidistant(segments, stepPx = 4.0) {
  const dense = [];
  segments.forEach((seg, sIdx) => {
    const steps = 24;
    const start = sIdx === 0 ? 0 : 1;
    for (let i = start; i <= steps; i++) {
      const t = i / steps;
      const u = 1 - t;
      dense.push([
        u * u * u * seg.from.x +
          3 * u * u * t * seg.c1.x +
          3 * u * t * t * seg.c2.x +
          t * t * t * seg.to.x,
        u * u * u * seg.from.y +
          3 * u * u * t * seg.c1.y +
          3 * u * t * t * seg.c2.y +
          t * t * t * seg.to.y,
      ]);
    }
  });
  if (dense.length < 2) return [];

  const dists = [0];
  for (let i = 1; i < dense.length; i++) {
    const d = Math.hypot(
      dense[i][0] - dense[i - 1][0],
      dense[i][1] - dense[i - 1][1],
    );
    dists.push(dists[i - 1] + d);
  }
  const totalDist = dists[dists.length - 1];
  if (totalDist < 1) return [];

  const numPoints = Math.max(12, Math.round(totalDist / stepPx));
  const pts = [];
  let denseIdx = 0;
  for (let i = 0; i <= numPoints; i++) {
    const targetD = (i / numPoints) * totalDist;
    while (denseIdx < dists.length - 2 && dists[denseIdx + 1] < targetD) {
      denseIdx++;
    }
    const segD = dists[denseIdx + 1] - dists[denseIdx];
    const frac = segD > 0.0001 ? (targetD - dists[denseIdx]) / segD : 0;
    pts.push({
      p: [
        dense[denseIdx][0] +
          (dense[denseIdx + 1][0] - dense[denseIdx][0]) * frac,
        dense[denseIdx][1] +
          (dense[denseIdx + 1][1] - dense[denseIdx][1]) * frac,
      ],
      u: i / numPoints,
    });
  }

  const m = pts.length;
  for (let i = 0; i < m; i++) {
    const prev = pts[Math.max(0, i - 1)].p;
    const next = pts[Math.min(m - 1, i + 1)].p;
    let dx = next[0] - prev[0];
    let dy = next[1] - prev[1];
    let d = Math.hypot(dx, dy);
    if (d < 0.0001) {
      dx = 0;
      dy = 1;
      d = 1;
    }
    pts[i].t = [dx / d, dy / d];
    pts[i].n = [-dy / d, dx / d];
  }

  return pts;
}

function smoothSplineWithRibbon(
  points,
  tension = 1.0,
  baseWidth = 5.5,
  tipWidth = 1.0,
  seed = 101,
) {
  const baseSpline = smoothSpline(points, tension);
  if (!baseSpline.segments.length) {
    return { ...baseSpline, ribbonD: "", resampled: [], totalLength: 0 };
  }

  const resampled = sampleSplineEquidistant(baseSpline.segments, 4.0);
  const m = resampled.length;
  if (m < 2) {
    return { ...baseSpline, ribbonD: baseSpline.d, resampled, totalLength: 0 };
  }

  let totalLength = 0;
  for (let i = 1; i < m; i++) {
    totalLength += Math.hypot(
      resampled[i].p[0] - resampled[i - 1].p[0],
      resampled[i].p[1] - resampled[i - 1].p[1],
    );
  }

  const leftEdge = [];
  const rightEdge = [];
  for (let i = 0; i < m; i++) {
    const pt = resampled[i];
    const u = i / (m - 1);
    const taper = baseWidth - (baseWidth - tipWidth) * Math.pow(u, 0.75);
    const nodeSwell = 1.0 + 0.15 * Math.pow(Math.sin(u * Math.PI * 6), 2);
    const barkWobble = 1.0 + 0.035 * Math.sin(u * 44 + seed);
    const r = Math.max(tipWidth * 0.5, taper * 0.5 * nodeSwell * barkWobble);

    leftEdge.push({
      x: pt.p[0] - pt.n[0] * r,
      y: pt.p[1] - pt.n[1] * r,
    });
    rightEdge.push({
      x: pt.p[0] + pt.n[0] * r,
      y: pt.p[1] + pt.n[1] * r,
    });
  }

  const coord = (p) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
  let ribbonD = `M ${coord(leftEdge[0])} `;
  for (let i = 1; i < leftEdge.length; i++) {
    ribbonD += `L ${coord(leftEdge[i])} `;
  }
  for (let i = rightEdge.length - 1; i >= 0; i--) {
    ribbonD += `L ${coord(rightEdge[i])} `;
  }
  ribbonD += "Z";

  return {
    ...baseSpline,
    ribbonD,
    resampled,
    totalLength,
    baseWidth,
    tipWidth,
  };
}

// =========================================================================
// 3. BOTANICAL GROWTH SIMULATION & HIERARCHY ENGINE
// =========================================================================

/**
 * Simulates growth of a climbing rose cane stepping 6-8px,
 * blending heading toward targets with smooth 2D simplex noise rotation (+/-25-35 deg),
 * reaching tendencies, gravity droop, and Catmull-Rom smoothing.
 */
function growCanePath(start, waypoints, target, options = {}) {
  const {
    seed = 101,
    stepSize = 7.5,
    noiseScale = 0.004,
    noiseAngle = 0.52, // ~30 degrees (+/- 25-35 deg)
    gravity = 0.12,
    minX = -Infinity,
    maxX = Infinity,
    baseWidth = 5.5,
    tipWidth = 1.0,
    tension = 1.0,
  } = options;

  const noise = createSimplexNoise(seed);
  const targets = [...(waypoints || []), target];
  const points = [{ ...start }];

  let current = { x: start.x, y: start.y };
  let currentAngle = Math.atan2(targets[0].y - start.y, targets[0].x - start.x);

  for (let tIdx = 0; tIdx < targets.length; tIdx++) {
    const tgt = targets[tIdx];
    let dist = Math.hypot(tgt.x - current.x, tgt.y - current.y);
    const maxSteps = Math.max(12, Math.ceil((dist / stepSize) * 2.5));
    let stepCount = 0;

    while (dist > stepSize * 1.15 && stepCount < maxSteps) {
      stepCount++;
      const dirAngle = Math.atan2(tgt.y - current.y, tgt.x - current.x);
      const nVal = noise(current.x * noiseScale, current.y * noiseScale);
      const rotPerturb = nVal * noiseAngle;

      const targetWeight = dist < 45 ? 0.45 : 0.22;
      let angleDiff = dirAngle - currentAngle;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

      currentAngle +=
        angleDiff * targetWeight + rotPerturb * (dist < 35 ? 0.35 : 1.0);

      // Ensure vine maintains forward/downward growth direction (never loops backwards upwards)
      if (tgt.y > current.y + 10) {
        currentAngle = Math.max(0.18, Math.min(Math.PI - 0.18, currentAngle));
      }

      const horizFactor = Math.abs(Math.cos(currentAngle));
      const gravityDroop = gravity * horizFactor;

      let nextX = current.x + Math.cos(currentAngle) * stepSize;
      let nextY = current.y + Math.sin(currentAngle) * stepSize + gravityDroop;

      if (nextX < minX) {
        nextX = minX;
        currentAngle = Math.atan2(tgt.y - nextY, tgt.x - nextX);
      } else if (nextX > maxX) {
        nextX = maxX;
        currentAngle = Math.atan2(tgt.y - nextY, tgt.x - nextX);
      }

      current = { x: nextX, y: nextY };
      points.push({ ...current });
      dist = Math.hypot(tgt.x - current.x, tgt.y - current.y);
    }

    current = { ...tgt };
    points.push({ ...current });
  }

  return smoothSplineWithRibbon(points, tension, baseWidth, tipWidth, seed);
}

/**
 * Generates an Archimedean/logarithmic spiral curl at branch tips.
 */
function growSpiralTendril(startPt, startTangent, options = {}) {
  const { radius = 18, turns = 1.25, side = -1, steps = 24 } = options;
  const tX = startTangent?.x ?? 0;
  const tY = startTangent?.y ?? 1;
  const startAng = Math.atan2(tY, tX);

  const normAng = startAng + (side > 0 ? Math.PI / 2 : -Math.PI / 2);
  const cx = startPt.x + Math.cos(normAng) * radius;
  const cy = startPt.y + Math.sin(normAng) * radius;
  const baseAng = normAng + Math.PI;

  const points = [{ ...startPt }];
  for (let i = 1; i <= steps; i++) {
    const frac = i / steps;
    const ang = baseAng + side * frac * (turns * Math.PI * 2);
    const r = radius * Math.exp(-frac * 1.35);
    points.push({
      x: cx + Math.cos(ang) * r,
      y: cy + Math.sin(ang) * r,
    });
  }
  return points;
}

/**
 * Generates an arched lateral shoot with tangent-continuous emergence,
 * gravity droop, sub-twigs, and curled tendril tip.
 */
function growLateralBranch(nodePt, parentTangent, options = {}) {
  const {
    length = 85,
    angleRad = 0.72, // 30-55 degrees (~41 deg)
    side = -1,
    seed = 301,
    withTendril = true,
    tendrilRadius = 15,
    subTwig = null,
    gravity = 0.16,
    baseWidth = 2.4,
    tipWidth = 0.8,
  } = options;

  const pTanX = parentTangent?.x ?? 0;
  const pTanY = parentTangent?.y ?? 1;
  const pAng = Math.atan2(pTanY, pTanX);

  const targetForkAngle = pAng + side * angleRad;
  const stepSize = 6;
  const stepCount = Math.max(6, Math.round(length / stepSize));
  const noise = createSimplexNoise(seed);

  const points = [{ ...nodePt }];
  let current = { x: nodePt.x, y: nodePt.y };
  let currentAngle = pAng;

  for (let i = 1; i <= stepCount; i++) {
    const frac = i / stepCount;
    const peelFactor = Math.min(1.0, frac / 0.35);
    const desiredAngle = pAng + (targetForkAngle - pAng) * peelFactor;
    const nVal = noise(current.x * 0.008, current.y * 0.008) * 0.24;
    currentAngle = desiredAngle + nVal;

    const droop = gravity * Math.pow(frac, 1.4) * 4.2;
    current = {
      x: current.x + Math.cos(currentAngle) * stepSize,
      y: current.y + Math.sin(currentAngle) * stepSize + droop,
    };
    points.push({ ...current });
  }

  if (withTendril) {
    const tipTangent = {
      x: Math.cos(currentAngle),
      y: Math.sin(currentAngle),
    };
    const spiralPoints = growSpiralTendril(current, tipTangent, {
      radius: tendrilRadius,
      turns: 1.25,
      side,
    });
    for (let k = 1; k < spiralPoints.length; k++) {
      points.push(spiralPoints[k]);
    }
  }

  const stem = smoothSplineWithRibbon(points, 0.9, baseWidth, tipWidth, seed);

  let twigStem = null;
  if (subTwig && points.length > 8) {
    const twigNodeIdx = Math.floor(points.length * 0.45);
    const twigNodePt = points[twigNodeIdx];
    const prevPt = points[twigNodeIdx - 1];
    const twigTan = {
      x: twigNodePt.x - prevPt.x,
      y: twigNodePt.y - prevPt.y,
    };
    twigStem = growLateralBranch(twigNodePt, twigTan, {
      length: subTwig.length || 38,
      angleRad: 0.65,
      side: subTwig.side || -side,
      seed: seed + 57,
      withTendril: subTwig.withTendril ?? true,
      tendrilRadius: 11,
      gravity: 0.15,
      baseWidth: 1.6,
      tipWidth: 0.7,
    }).stem;
  }

  return { stem, twigStem, points };
}

/**
 * Verifies acceptance criteria metrics on a cane.
 */
function verifyLeftmostVine(stem) {
  if (!stem || !stem.points || stem.points.length < 2) {
    return { maxDev: 0, maxStraight: 0 };
  }
  const pts = stem.points;
  const p0 = pts[0];
  const pN = pts[pts.length - 1];

  const dx = pN.x - p0.x;
  const dy = pN.y - p0.y;
  const lineLen = Math.hypot(dx, dy) || 1;

  let maxDev = 0;
  for (const pt of pts) {
    const dist =
      Math.abs(dy * pt.x - dx * pt.y + pN.x * p0.y - pN.y * p0.x) / lineLen;
    if (dist > maxDev) maxDev = dist;
  }

  let maxStraight = 0;
  let currentStraight = 0;
  for (let i = 1; i < pts.length; i++) {
    const segLen = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    if (i >= 2) {
      const a1 = Math.atan2(
        pts[i - 1].y - pts[i - 2].y,
        pts[i - 1].x - pts[i - 2].x,
      );
      const a2 = Math.atan2(pts[i].y - pts[i - 1].y, pts[i].x - pts[i - 1].x);
      let diff = Math.abs(a2 - a1);
      while (diff > Math.PI) diff -= Math.PI * 2;
      diff = Math.abs(diff);

      if (diff < 0.02) {
        currentStraight += segLen;
      } else {
        if (currentStraight > maxStraight) maxStraight = currentStraight;
        currentStraight = segLen;
      }
    } else {
      currentStraight = segLen;
    }
  }
  if (currentStraight > maxStraight) maxStraight = currentStraight;

  return { maxDev, maxStraight };
}

// =========================================================================
// 4. MEASURE TREE & BOTANICAL GARDEN COMPOSITION
// =========================================================================
function measureTree(canvas, data) {
  const bounds = canvas.getBoundingClientRect();
  const mobile = window.matchMedia("(max-width: 820px)").matches;
  const positions = new Map();

  canvas.querySelectorAll("[data-tree-node]").forEach((element) => {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    let ty = 0;
    let tx = 0;
    if (style.transform && style.transform !== "none") {
      try {
        const matrix = new DOMMatrix(style.transform);
        tx = matrix.m41;
        ty = matrix.m42;
      } catch {}
    }
    const left = rect.left - bounds.left - tx;
    const topY = rect.top - bounds.top - ty;
    const bottomY = rect.bottom - bounds.top - ty;
    const width = rect.width;
    const height = rect.height;
    const centerX = left + width / 2;

    positions.set(element.dataset.treeNode, {
      left,
      right: left + width,
      top: { x: centerX, y: topY },
      bottom: { x: centerX, y: bottomY },
      center: { x: centerX, y: topY + height / 2 },
      width,
      height,
    });
  });

  const edges = [];
  const junctions = [];
  const addStem = (id, stem, parentMeta = null) => {
    edges.push({
      id,
      d: stem.d,
      ribbonD: stem.ribbonD || stem.d,
      from: stem.segments[0].from.y,
      to: stem.segments.at(-1).to.y,
      segments: stem.segments,
      points: stem.points,
      parentEdgeId: parentMeta?.parentEdgeId || null,
      parentNodeU: parentMeta?.parentNodeU ?? null,
      baseWidth: stem.baseWidth || 5.0,
      tipWidth: stem.tipWidth || 1.0,
    });
    return stem;
  };

  const root = positions.get("root");
  const mono = positions.get("monogram") || root;
  const h0 = positions.get("section-0");
  const h1 = positions.get("section-1");
  const h2 = positions.get("section-2");
  const prizes = positions.get("prizes");
  const prize0 = positions.get("prize-0"); // 1st Place
  const prize1 = positions.get("prize-1"); // 2nd Place
  const prize2 = positions.get("prize-2"); // 3rd Place

  if (!h0 || !prizes) {
    return { width: bounds.width, height: bounds.height, edges, junctions };
  }

  const b0_0 = positions.get("bracket-0-0");
  const b0_1 = positions.get("bracket-0-1");
  const b0_2 = positions.get("bracket-0-2");
  const b1_0 = positions.get("bracket-1-0");
  const b2_0 = positions.get("bracket-2-0");

  const monoCenter = mono ? mono.center.x : bounds.width / 2;
  const monoBottom = mono ? mono.bottom.y : 220;
  const col0_X = h0.center.x;
  const col1_X = h1 ? h1.center.x : bounds.width / 2;
  const col2_X = h2 ? h2.center.x : bounds.width * 0.82;

  // =========================================================================
  // MOBILE TOPOLOGY (Stacked Layout with Organic Spine)
  // =========================================================================
  if (mobile) {
    const leftMargin = 22;
    const startY = monoBottom + 12;
    const lastPrize = prize2 || prize1 || prize0 || prizes;
    const endY = lastPrize.bottom.y + 40;

    const spinePoints = [
      { x: leftMargin + 2, y: startY },
      { x: leftMargin + 8, y: startY + (h0.top.y - startY) * 0.5 },
      { x: leftMargin + 2, y: h0.top.y },
      ...(b0_0 ? [{ x: leftMargin - 4, y: b0_0.top.y }] : []),
      ...(h1 ? [{ x: leftMargin + 7, y: h1.top.y }] : []),
      ...(h2 ? [{ x: leftMargin - 3, y: h2.top.y }] : []),
      { x: leftMargin + 6, y: prizes.top.y },
      { x: leftMargin + 2, y: endY },
    ];
    addStem(
      "mobile-spine",
      smoothSplineWithRibbon(spinePoints, 0.95, 4.2, 1.0, 901),
    );

    [h0, h1, h2].filter(Boolean).forEach((header, idx) => {
      addStem(
        `mobile-branch-h${idx}`,
        smoothSplineWithRibbon(
          [
            { x: leftMargin + 4, y: header.center.y, tangent: { x: 1, y: 0.1 } },
            { x: leftMargin + 14, y: header.center.y - 2 },
            { x: header.left + 4, y: header.center.y, tangent: { x: 1, y: 0 } },
          ],
          0.9,
          2.4,
          1.0,
          911 + idx,
        ),
      );
    });

    [prize0, prize1, prize2].filter(Boolean).forEach((prize, idx) => {
      addStem(
        `mobile-branch-p${idx}`,
        smoothSplineWithRibbon(
          [
            { x: leftMargin + 4, y: prize.top.y + 28, tangent: { x: 1, y: 0.1 } },
            { x: leftMargin + 14, y: prize.top.y + 26 },
            { x: prize.left + 4, y: prize.top.y + 28, tangent: { x: 1, y: 0 } },
          ],
          0.9,
          2.2,
          1.0,
          921 + idx,
        ),
      );
    });

    return { width: bounds.width, height: bounds.height, edges, junctions };
  }

  // =========================================================================
  // DESKTOP TOPOLOGY: BOTANICAL CLIMBING-ROSE ARCHITECTURE
  // =========================================================================

  // 1. FREE GUTTER GEOMETRY FOR THE LEFTMOST VINE
  // Text bounding boxes in Open column:
  const openBracketLeft = Math.min(
    b0_0?.left ?? col0_X - 98,
    b0_1?.left ?? col0_X - 98,
    b0_2?.left ?? col0_X - 98,
  );
  // Strict text safe zone: text box + 20px padding
  const textSafeLeft = Math.round(openBracketLeft - 20);
  // Outer margin boundary
  const gutterLeft = Math.max(14, Math.round(textSafeLeft * 0.16));
  const freeGutterWidth = textSafeLeft - gutterLeft;

  // Meander targets across > 70% of free gutter:
  const meanderOuterX = Math.round(gutterLeft + 4); // Leaning out toward section margin
  const meanderInnerX = Math.round(textSafeLeft - 8); // Swinging in toward brackets
  const meanderMidX = Math.round((meanderOuterX + meanderInnerX) / 2);

  // Common baseline & Central Y-Fork
  const baselineY = Math.round(b0_2 ? b0_2.bottom.y + 60 : h0.bottom.y + 360);
  const forkMerge = { x: col1_X, y: baselineY - 12 };

  // 2. TOP MONOGRAM ARMS (Growing from ACC letters to columns)
  const originA = { x: monoCenter - 140, y: monoBottom - 8 };
  addStem(
    "section-0",
    growCanePath(
      originA,
      [
        {
          x: originA.x - 45,
          y: originA.y + (h0.top.y - originA.y) * 0.35,
        },
        {
          x: meanderMidX + 18,
          y: originA.y + (h0.top.y - originA.y) * 0.72,
        },
      ],
      { x: meanderMidX, y: h0.top.y - 12 },
      {
        seed: 301,
        stepSize: 7,
        noiseAngle: 0.48,
        baseWidth: 5.8,
        tipWidth: 4.8,
        minX: gutterLeft,
        maxX: textSafeLeft - 6,
      },
    ),
  );

  const originC1 = { x: monoCenter, y: monoBottom - 8 };
  addStem(
    "section-1",
    growCanePath(
      originC1,
      [
        {
          x: monoCenter - 8,
          y: originC1.y + (h1.top.y - originC1.y) * 0.45,
        },
      ],
      { x: col1_X, y: h1.top.y - 12 },
      {
        seed: 342,
        stepSize: 7,
        noiseAngle: 0.42,
        baseWidth: 5.6,
        tipWidth: 4.6,
      },
    ),
  );

  const originC2 = { x: monoCenter + 140, y: monoBottom - 8 };
  addStem(
    "section-2",
    growCanePath(
      originC2,
      [
        {
          x: originC2.x + 40,
          y: originC2.y + (h2.top.y - originC2.y) * 0.35,
        },
        {
          x: col2_X + 22,
          y: originC2.y + (h2.top.y - originC2.y) * 0.72,
        },
      ],
      { x: col2_X, y: h2.top.y - 12 },
      {
        seed: 383,
        stepSize: 7,
        noiseAngle: 0.48,
        baseWidth: 5.8,
        tipWidth: 4.8,
      },
    ),
  );

  // 3. THE LEFTMOST VINE (tier-stem-0) - S-FLOW MEANDER (>70% of free gutter)
  // Lean out to margin -> swing back in -> lean out -> swing back in:
  const b0_0_midY = b0_0 ? b0_0.center.y : h0.bottom.y + 60;
  const b0_0_1_gapY =
    b0_0 && b0_1 ? (b0_0.bottom.y + b0_1.top.y) / 2 : h0.bottom.y + 130;
  const b0_1_midY = b0_1 ? b0_1.center.y : h0.bottom.y + 190;
  const b0_1_2_gapY =
    b0_1 && b0_2 ? (b0_1.bottom.y + b0_2.top.y) / 2 : h0.bottom.y + 260;
  const b0_2_midY = b0_2 ? b0_2.center.y : h0.bottom.y + 320;
  const b0_2_bottomY = b0_2 ? b0_2.bottom.y : h0.bottom.y + 360;

  const openMeanderWaypoints = [
    { x: meanderOuterX + 2, y: h0.top.y + 50 }, // 1. Leaning way out toward margin
    { x: meanderInnerX - 4, y: b0_0_midY }, // 2. Swinging in toward Beginner
    { x: meanderOuterX + 5, y: b0_0_1_gapY }, // 3. Leaning out between Beginner & Intermediate
    { x: meanderInnerX - 2, y: b0_1_midY }, // 4. Swinging in beside Intermediate
    { x: meanderOuterX + 6, y: b0_1_2_gapY }, // 5. Leaning out between Intermediate & Advanced
    { x: meanderInnerX - 5, y: b0_2_midY }, // 6. Swinging in beside Advanced
    { x: meanderOuterX + 8, y: b0_2_bottomY + 16 }, // 7. Bottom outer sweep point
    { x: meanderInnerX - 16, y: b0_2_bottomY + 45 }, // 8. Sweeping arc curving down and inward
  ];

  // Wide bottom sweeping arc corner (radius > 120px) curving down and inward:
  const openCornerTarget = { x: gutterLeft + 68, y: baselineY + 14 };

  const openMainCane = growCanePath(
    { x: meanderMidX, y: h0.top.y - 12 },
    openMeanderWaypoints,
    openCornerTarget,
    {
      seed: 411,
      stepSize: 7,
      noiseAngle: 0.54,
      baseWidth: 5.6,
      tipWidth: 4.4,
      minX: gutterLeft,
      maxX: textSafeLeft - 6,
    },
  );
  addStem("tier-stem-0", openMainCane);

  // Verification check on leftmost vine:
  const leftmostMetrics = verifyLeftmostVine(openMainCane);
  if (typeof window !== "undefined") {
    window.__openVineMetrics = leftmostMetrics;
  }

  // Twining runner around leftmost vine (crosses over and under every ~180px):
  if (openMainCane.resampled && openMainCane.resampled.length > 10) {
    const runnerPoints = openMainCane.resampled.map((pt, i) => {
      const u = pt.u;
      const wave = Math.sin(u * (openMainCane.totalLength / 180) * Math.PI * 2);
      const lateralShift = wave * 7.5;
      return {
        x: pt.p[0] + pt.n[0] * lateralShift,
        y: pt.p[1] + pt.n[1] * lateralShift,
      };
    });
    addStem(
      "tier-stem-0-runner",
      smoothSplineWithRibbon(runnerPoints, 0.95, 2.2, 0.9, 412),
      { parentEdgeId: "tier-stem-0", parentNodeU: 0.05 },
    );
  }

  // Feeder branches peeling smoothly from Open vine into brackets:
  if (b0_0) {
    addStem(
      "tier-0-0",
      smoothSplineWithRibbon(
        [
          { x: meanderInnerX - 4, y: b0_0_midY, tangent: { x: 0.8, y: 0.3 } },
          { x: meanderInnerX + 8, y: b0_0_midY + 4 },
          { x: b0_0.left - 4, y: b0_0_midY, tangent: { x: 1, y: 0 } },
        ],
        0.9,
        2.4,
        1.1,
        501,
      ),
      { parentEdgeId: "tier-stem-0", parentNodeU: 0.22 },
    );
  }
  if (b0_1) {
    addStem(
      "tier-0-1",
      smoothSplineWithRibbon(
        [
          { x: meanderInnerX - 2, y: b0_1_midY, tangent: { x: 0.8, y: 0.3 } },
          { x: meanderInnerX + 8, y: b0_1_midY - 4 },
          { x: b0_1.left - 4, y: b0_1_midY, tangent: { x: 1, y: 0 } },
        ],
        0.9,
        2.4,
        1.1,
        502,
      ),
      { parentEdgeId: "tier-stem-0", parentNodeU: 0.52 },
    );
  }
  if (b0_2) {
    addStem(
      "tier-0-2",
      smoothSplineWithRibbon(
        [
          { x: meanderInnerX - 5, y: b0_2_midY, tangent: { x: 0.8, y: 0.3 } },
          { x: meanderInnerX + 8, y: b0_2_midY + 4 },
          { x: b0_2.left - 4, y: b0_2_midY, tangent: { x: 1, y: 0 } },
        ],
        0.9,
        2.4,
        1.1,
        503,
      ),
      { parentEdgeId: "tier-stem-0", parentNodeU: 0.82 },
    );
  }

  // 4. WOMEN'S COLUMN (tier-1-0 & tier-1-run)
  if (b1_0) {
    addStem(
      "tier-1-0",
      smoothSplineWithRibbon(
        [
          { x: col1_X, y: h1.bottom.y, tangent: { x: 0.2, y: 1 } },
          { x: col1_X + 6, y: h1.bottom.y + (b1_0.top.y - h1.bottom.y) * 0.5 },
          { x: b1_0.top.x, y: b1_0.top.y, tangent: { x: 0, y: 1 } },
        ],
        0.9,
        2.6,
        1.4,
        511,
      ),
    );

    // Lower run below single tier (0 - 3000) sways with organic lean and bend into forkMerge:
    addStem(
      "tier-1-run",
      growCanePath(
        { x: col1_X, y: b1_0.bottom.y + 12 },
        [
          {
            x: col1_X - 26,
            y: b1_0.bottom.y + (forkMerge.y - b1_0.bottom.y) * 0.35,
          },
          {
            x: col1_X + 22,
            y: b1_0.bottom.y + (forkMerge.y - b1_0.bottom.y) * 0.72,
          },
        ],
        forkMerge,
        {
          seed: 441,
          stepSize: 7,
          noiseAngle: 0.46,
          baseWidth: 5.2,
          tipWidth: 4.4,
        },
      ),
    );
  }

  // 5. INTER-CLUB COLUMN (tier-2-0 & tier-2-run)
  const b2_0_bottomY = b2_0 ? b2_0.bottom.y : h2.bottom.y + 360;
  if (b2_0) {
    addStem(
      "tier-2-0",
      smoothSplineWithRibbon(
        [
          { x: col2_X, y: h2.bottom.y, tangent: { x: -0.2, y: 1 } },
          { x: col2_X - 6, y: h2.bottom.y + (b2_0.top.y - h2.bottom.y) * 0.5 },
          { x: b2_0.top.x, y: b2_0.top.y, tangent: { x: 0, y: 1 } },
        ],
        0.9,
        2.6,
        1.4,
        521,
      ),
    );

    // Lower run sways with visible lean and sweeps inward in wide arc (radius > 120px):
    const interCornerTarget = { x: col2_X - 68, y: baselineY + 14 };
    addStem(
      "tier-2-run",
      growCanePath(
        { x: col2_X, y: b2_0.bottom.y + 12 },
        [
          {
            x: col2_X + 28,
            y: b2_0.bottom.y + (baselineY - b2_0.bottom.y) * 0.35,
          },
          {
            x: col2_X - 24,
            y: b2_0.bottom.y + (baselineY - b2_0.bottom.y) * 0.72,
          },
          { x: col2_X - 10, y: b2_0_bottomY + 16 },
        ],
        interCornerTarget,
        {
          seed: 461,
          stepSize: 7,
          noiseAngle: 0.46,
          baseWidth: 5.2,
          tipWidth: 4.4,
        },
      ),
    );
  }

  // 6. BASELINE MERGE: DEEP HANGING BOTANICAL GARLAND SWAG (58px Sag!)
  // Left sweep droops down 58px and rises to forkMerge; Right sweep does the same.
  // NO flat horizontal lines, NO 90-degree corners.
  const swagSagY = baselineY + 58;
  const swagLeftDipX = gutterLeft + 68 + (col1_X - (gutterLeft + 68)) * 0.46;
  const swagRightDipX = col1_X + (col2_X - 68 - col1_X) * 0.54;

  const swagPoints = [
    { x: gutterLeft + 68, y: baselineY + 14 },
    { x: swagLeftDipX - 35, y: swagSagY - 12 },
    { x: swagLeftDipX, y: swagSagY }, // Lowest sag point on left (58px droop)
    { x: swagLeftDipX + 45, y: swagSagY - 16 },
    { x: col1_X - 26, y: baselineY + 2 },
    { x: forkMerge.x, y: forkMerge.y }, // Natural Y-fork merge
    { x: col1_X + 26, y: baselineY + 2 },
    { x: swagRightDipX - 45, y: swagSagY - 16 },
    { x: swagRightDipX, y: swagSagY }, // Lowest sag point on right (58px droop)
    { x: swagRightDipX + 35, y: swagSagY - 12 },
    { x: col2_X - 68, y: baselineY + 14 },
  ];
  addStem(
    "baseline-merge",
    smoothSplineWithRibbon(swagPoints, 0.95, 5.2, 4.4, 551),
  );

  // 7. CENTER TRUNK TO PRIZES (prizes-stem & prizes-stem-runner)
  // Continuous majestic climbing cane descending from Y-fork directly into crown cluster:
  const pHeadText = positions.get("prizes-heading-text") || prizes;
  const pHeadTextTop = pHeadText.top.y;
  const pHeadTextBottom = pHeadText.bottom.y;
  const pHeadCenter = pHeadText.center.x || col1_X;

  // Crown cluster anchor: exactly 36px directly above the heading text
  const crownY = Math.round(pHeadTextTop - 36);
  const crownPoint = { x: pHeadCenter, y: crownY };

  const centerTrunk = growCanePath(
    forkMerge,
    [
      {
        x: pHeadCenter + 14,
        y: forkMerge.y + (crownY - forkMerge.y) * 0.35,
      },
      {
        x: pHeadCenter - 12,
        y: forkMerge.y + (crownY - forkMerge.y) * 0.72,
      },
    ],
    crownPoint,
    {
      seed: 601,
      stepSize: 7,
      noiseAngle: 0.38,
      baseWidth: 6.0,
      tipWidth: 4.6,
    },
  );
  addStem("prizes-stem", centerTrunk);

  // Twining runner spiraling around center trunk down to crown:
  if (centerTrunk.resampled && centerTrunk.resampled.length > 8) {
    const trunkRunnerPoints = centerTrunk.resampled.map((pt, i) => {
      const u = pt.u;
      const wave = Math.sin(u * (centerTrunk.totalLength / 160) * Math.PI * 2);
      const lateralShift = -wave * 6.8;
      return {
        x: pt.p[0] + pt.n[0] * lateralShift,
        y: pt.p[1] + pt.n[1] * lateralShift,
      };
    });
    addStem(
      "prizes-stem-runner",
      smoothSplineWithRibbon(trunkRunnerPoints, 0.95, 2.2, 0.9, 602),
    );
  }

  // Lateral curling spiral tendrils flaring out from the crown:
  const crownTendrilLeft = growSpiralTendril(
    { x: crownPoint.x - 6, y: crownPoint.y - 4 },
    { x: -0.85, y: -0.5 },
    { radius: 15, turns: 1.25, side: -1 },
  );
  addStem(
    "crown-tendril-left",
    smoothSplineWithRibbon(crownTendrilLeft, 0.95, 1.2, 0.6, 611),
  );

  const crownTendrilRight = growSpiralTendril(
    { x: crownPoint.x + 6, y: crownPoint.y - 4 },
    { x: 0.85, y: -0.5 },
    { radius: 15, turns: 1.25, side: 1 },
  );
  addStem(
    "crown-tendril-right",
    smoothSplineWithRibbon(crownTendrilRight, 0.95, 1.2, 0.6, 612),
  );

  // 8. CONTINUOUS ORGANIC BOUGH UNDER HEADING (prizes-bough-left & prizes-bough-right)
  // Springs from central fork directly under heading, spanning across the prize row:
  const forkY = Math.round(pHeadTextBottom + 26);
  const centralForkPt = { x: pHeadCenter, y: forkY };

  // Prize column centers (aligned to category columns above):
  const p0Center = prize0 ? prize0.center.x : col0_X;
  const p1Center = prize1 ? prize1.center.x : col1_X;
  const p2Center = prize2 ? prize2.center.x : col2_X;

  // Labels top positions:
  const label0 = positions.get("prize-0-label");
  const label1 = positions.get("prize-1-label");
  const label2 = positions.get("prize-2-label");
  const label0Top = label0 ? label0.top.y : (prize0 ? prize0.top.y + 12 : forkY + 70);
  const label1Top = label1 ? label1.top.y : (prize1 ? prize1.top.y + 12 : forkY + 70);
  const label2Top = label2 ? label2.top.y : (prize2 ? prize2.top.y + 12 : forkY + 70);

  // Exact 22px distance clear above each prize label:
  const tip0Y = Math.round(label0Top - 22);
  const tip1Y = Math.round(label1Top - 22);
  const tip2Y = Math.round(label2Top - 22);

  // Left Bough Arm: arches from centralForkPt out to the left over 1st place
  const boughLeftCrestX = centralForkPt.x - (centralForkPt.x - p0Center) * 0.48;
  const boughLeftPoints = [
    { x: centralForkPt.x, y: centralForkPt.y, tangent: { x: -0.85, y: -0.2 } },
    { x: boughLeftCrestX, y: forkY - 14 },
    { x: p0Center + 16, y: forkY - 4 },
    { x: p0Center - 32, y: forkY + 12 },
    { x: p0Center - 54, y: forkY + 22 },
  ];
  const boughLeft = smoothSplineWithRibbon(boughLeftPoints, 0.95, 4.4, 0.9, 651);
  addStem("prizes-bough-left", boughLeft);

  // Right Bough Arm: arches from centralForkPt out to the right over 3rd place
  const boughRightCrestX = centralForkPt.x + (p2Center - centralForkPt.x) * 0.48;
  const boughRightPoints = [
    { x: centralForkPt.x, y: centralForkPt.y, tangent: { x: 0.85, y: -0.2 } },
    { x: boughRightCrestX, y: forkY - 14 },
    { x: p2Center - 16, y: forkY - 4 },
    { x: p2Center + 32, y: forkY + 12 },
    { x: p2Center + 54, y: forkY + 22 },
  ];
  const boughRight = smoothSplineWithRibbon(boughRightPoints, 0.95, 4.4, 0.9, 652);
  addStem("prizes-bough-right", boughRight);

  // 9. THREE HANGING BRANCHES TO PRIZES (prize-hang-0, prize-hang-1, prize-hang-2)
  // Each ends exactly above the horizontal center of its prize block (22px clear of label)

  // 1st Place (Left): Peels smoothly from left bough, drops into 1st place center
  addStem(
    "prize-hang-0",
    smoothSplineWithRibbon(
      [
        { x: p0Center + 16, y: forkY - 4, tangent: { x: -0.2, y: 1 } },
        { x: p0Center + 4, y: forkY + (tip0Y - forkY) * 0.45 },
        { x: p0Center, y: tip0Y, tangent: { x: 0, y: 1 } },
      ],
      0.9,
      3.2,
      1.5,
      661,
    ),
  );

  // 2nd Place (Center): Drops straight from central fork with slight natural bend
  addStem(
    "prize-hang-1",
    smoothSplineWithRibbon(
      [
        { x: centralForkPt.x, y: centralForkPt.y, tangent: { x: 0.05, y: 1 } },
        { x: centralForkPt.x + 3, y: forkY + (tip1Y - forkY) * 0.48 },
        { x: p1Center, y: tip1Y, tangent: { x: 0, y: 1 } },
      ],
      0.9,
      3.0,
      1.4,
      662,
    ),
  );

  // 3rd Place (Right): Peels smoothly from right bough, drops into 3rd place center
  addStem(
    "prize-hang-2",
    smoothSplineWithRibbon(
      [
        { x: p2Center - 16, y: forkY - 4, tangent: { x: 0.2, y: 1 } },
        { x: p2Center - 4, y: forkY + (tip2Y - forkY) * 0.45 },
        { x: p2Center, y: tip2Y, tangent: { x: 0, y: 1 } },
      ],
      0.9,
      3.0,
      1.4,
      663,
    ),
  );

  // =========================================================================
  // 5. BRANCH HIERARCHY: LATERALS, TWIGS, AND TENDRIL CURLS
  // Every lateral arches outward at 30-55 deg, droops with gravity,
  // has tangent-continuous emergence, sub-twigs, and curled spiral tips.
  // =========================================================================

  // [A] Open Column Laterals (emerging into outer gutter)
  const latOpen0 = growLateralBranch(
    { x: meanderOuterX + 3, y: h0.top.y + 60 },
    { x: 0, y: 1 },
    {
      length: 85,
      angleRad: 0.74,
      side: -1,
      seed: 701,
      withTendril: true,
      tendrilRadius: 16,
      subTwig: { length: 34, side: 1 },
    },
  );
  addStem("lateral-open-0", latOpen0.stem, {
    parentEdgeId: "tier-stem-0",
    parentNodeU: 0.15,
  });
  if (latOpen0.twigStem) {
    addStem("twig-open-0-sub", latOpen0.twigStem, {
      parentEdgeId: "lateral-open-0",
      parentNodeU: 0.45,
    });
  }

  const latOpen1 = growLateralBranch(
    { x: meanderOuterX + 5, y: b0_0_1_gapY },
    { x: 0, y: 1 },
    {
      length: 105,
      angleRad: 0.72,
      side: -1,
      seed: 702,
      withTendril: true,
      tendrilRadius: 17,
      subTwig: { length: 38, side: 1 },
    },
  );
  addStem("lateral-open-1", latOpen1.stem, {
    parentEdgeId: "tier-stem-0",
    parentNodeU: 0.42,
  });
  if (latOpen1.twigStem) {
    addStem("twig-open-1-sub", latOpen1.twigStem, {
      parentEdgeId: "lateral-open-1",
      parentNodeU: 0.45,
    });
  }

  const latOpen2 = growLateralBranch(
    { x: meanderOuterX + 6, y: b0_1_2_gapY },
    { x: 0, y: 1 },
    {
      length: 115,
      angleRad: 0.75,
      side: -1,
      seed: 703,
      withTendril: true,
      tendrilRadius: 18,
      subTwig: { length: 42, side: 1 },
    },
  );
  addStem("lateral-open-2", latOpen2.stem, {
    parentEdgeId: "tier-stem-0",
    parentNodeU: 0.72,
  });
  if (latOpen2.twigStem) {
    addStem("twig-open-2-sub", latOpen2.twigStem, {
      parentEdgeId: "lateral-open-2",
      parentNodeU: 0.45,
    });
  }

  // [B] Women's Column Laterals (in open space below rating tier)
  if (b1_0) {
    const latW0 = growLateralBranch(
      { x: col1_X - 18, y: b1_0.bottom.y + 65 },
      { x: 0, y: 1 },
      {
        length: 75,
        angleRad: 0.68,
        side: 1,
        seed: 711,
        withTendril: true,
        tendrilRadius: 14,
        subTwig: { length: 30, side: -1 },
      },
    );
    addStem("lateral-womens-0", latW0.stem, {
      parentEdgeId: "tier-1-run",
      parentNodeU: 0.28,
    });

    const latW1 = growLateralBranch(
      { x: col1_X + 16, y: b1_0.bottom.y + 145 },
      { x: 0, y: 1 },
      {
        length: 70,
        angleRad: 0.68,
        side: -1,
        seed: 712,
        withTendril: true,
        tendrilRadius: 14,
      },
    );
    addStem("lateral-womens-1", latW1.stem, {
      parentEdgeId: "tier-1-run",
      parentNodeU: 0.65,
    });
  }

  // [C] Inter-Club Column Laterals (in open space below rating tier)
  if (b2_0) {
    const latI0 = growLateralBranch(
      { x: col2_X + 22, y: b2_0.bottom.y + 65 },
      { x: 0, y: 1 },
      {
        length: 75,
        angleRad: 0.68,
        side: -1,
        seed: 721,
        withTendril: true,
        tendrilRadius: 14,
        subTwig: { length: 30, side: 1 },
      },
    );
    addStem("lateral-interclub-0", latI0.stem, {
      parentEdgeId: "tier-2-run",
      parentNodeU: 0.28,
    });

    const latI1 = growLateralBranch(
      { x: col2_X - 18, y: b2_0.bottom.y + 145 },
      { x: 0, y: 1 },
      {
        length: 70,
        angleRad: 0.68,
        side: 1,
        seed: 722,
        withTendril: true,
        tendrilRadius: 14,
      },
    );
    addStem("lateral-interclub-1", latI1.stem, {
      parentEdgeId: "tier-2-run",
      parentNodeU: 0.65,
    });
  }

  return { width: bounds.width, height: bounds.height, edges, junctions };
}

export default function EventDetailsTree({ event: initialEvent = null }) {
  const [fetchedData, setFetchedData] = useState(null);
  const data = initialEvent
    ? normalizeData(initialEvent)
    : fetchedData || DEFAULT_TREE_DATA;

  const [geometry, setGeometry] = useState(null);
  const canvasRef = useRef(null);
  const lenis = useLenis();

  useEffect(() => {
    if (initialEvent) return;

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
          setFetchedData(normalizeData(current));
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

  // Smooth reveal animation for content nodes as user scrolls
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !geometry?.edges) return;

    const media = gsap.matchMedia();
    media.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        noPreference: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const { reduceMotion } = context.conditions;

        const revealElements = canvas.querySelectorAll("[data-tree-reveal]");
        revealElements.forEach((el) => {
          if (reduceMotion) {
            gsap.set(el, { opacity: 1, y: 0, filter: "none" });
            return;
          }

          // Specific tailored reveal for "PRIZES & ACCOLADES" heading: light opacity/glow fade
          if (el.getAttribute("data-tree-node") === "prizes") {
            gsap.fromTo(
              el,
              { opacity: 0.15, filter: "blur(4px)" },
              {
                opacity: 1,
                filter: "blur(0px)",
                duration: 0.75,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: el,
                  start: "top 82%",
                  toggleActions: "play none none reverse",
                  invalidateOnRefresh: true,
                },
              },
            );
            return;
          }

          // Staggered reveal for prize cards in 1st, 2nd, 3rd place order as branch tips arrive
          const nodeName = el.getAttribute("data-tree-node") || "";
          if (nodeName.startsWith("prize-")) {
            const prizeIndex = parseInt(nodeName.replace("prize-", ""), 10);
            const delay = (prizeIndex || 0) * 0.14;
            gsap.fromTo(
              el,
              {
                opacity: 0,
                y: 20,
                filter: "blur(4px)",
              },
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.7,
                delay,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: el,
                  start: "top 82%",
                  toggleActions: "play none none reverse",
                  invalidateOnRefresh: true,
                },
              },
            );
            return;
          }

          // Default reveal for category sections and rating brackets
          gsap.fromTo(
            el,
            {
              opacity: 0,
              y: 28,
              filter: "blur(4px)",
            },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.75,
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
      },
      canvas,
    );

    return () => media.revert();
  }, [geometry]);

  return (
    <section className={styles.tree} aria-labelledby="championship-hierarchy">
      <div className={styles.intro}>
        <h2 id="championship-hierarchy" className={styles.title}>
          <motion.span
            initial={{ y: 25, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={styles.whiteLine}
          >
            THE
          </motion.span>
          <motion.span
            initial={{ y: 25, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className={styles.whiteLine}
          >
            CROWN&apos;S
          </motion.span>
          <motion.span
            initial={{ y: 35, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className={styles.redLine}
          >
            HIERARCHY
          </motion.span>
        </h2>
      </div>

      <div className={styles.canvas} ref={canvasRef}>
        <RoseTreeCanvas
          geometry={geometry}
          data={data}
          canvasRef={canvasRef}
        />

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
                  className={styles.brackets}
                  aria-label={`${section.title} rating brackets`}
                >
                  {section.brackets.map((bracket, bracketIndex) => (
                    <li
                      className={styles.bracket}
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
          <h3 data-tree-node="prizes-heading-text">{data.prizes.label}</h3>
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
                <p
                  className={styles.eyebrow}
                  data-tree-node={`prize-${index}-label`}
                >
                  {prize.place}
                </p>
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
