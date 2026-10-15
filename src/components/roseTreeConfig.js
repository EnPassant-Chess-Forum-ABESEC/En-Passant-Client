/**
 * ============================================================================
 * 🌹 ROSE TREE CANVAS CONFIGURATION
 * ============================================================================
 *
 * Edit this file anytime to ADD, DELETE, or MODIFY roses and leaves
 * across the ACC monogram, bracket roots, and prize convergence vines!
 *
 * ----------------------------------------------------------------------------
 * 📖 QUICK CHEAT-SHEET:
 * ----------------------------------------------------------------------------
 *
 * 1. TO ADD A ROSE:
 *    { type: "rose", color: "red", u: 0.5, side: 1, size: 21 }
 *    - color:  "red" | "white" | "black"
 *    - u:      Position along vine from 0.0 (start) to 1.0 (end)
 *    - side:   -1 (left of stem) | 1 (right of stem) | 0 (center)
 *    - size:   Rose radius in pixels (default: 20-22, range: 16-28)
 *
 * 2. TO ADD A LEAF:
 *    { type: "leaf", u: 0.35, side: -1, length: 24 }
 *    - u:      Position along vine from 0.0 to 1.0
 *    - side:   -1 (left) | 1 (right)
 *    - length: Leaf length in pixels (default: 24, range: 18-30)
 *
 * 3. TO DELETE A ROSE OR LEAF:
 *    Simply remove or comment out (//) its line!
 *
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// 1. ACC MONOGRAM COLOR DISTRIBUTION
// Controls the color mix on the "A C C" letters and bridges.
// Red is dominant (60%), followed by White (25%), then Black (15%).
// ----------------------------------------------------------------------------
export const MONOGRAM_ROSE_DISTRIBUTION = {
  red: 0.6, // 60% Red (most dominant)
  white: 0.3, //30% White (second dominant)
  black: 0.19, // 19% Black (gothic accents)
};

/**
 * Weighted random color picker based on MONOGRAM_ROSE_DISTRIBUTION
 */
export function pickMonogramRoseColor(rand = Math.random) {
  const r = typeof rand === "function" ? rand() : rand;
  if (r < MONOGRAM_ROSE_DISTRIBUTION.red) return "red";
  if (r < MONOGRAM_ROSE_DISTRIBUTION.red + MONOGRAM_ROSE_DISTRIBUTION.white)
    return "white";
  return "black";
}

// ----------------------------------------------------------------------------
// 2. TREE VINES & ROOTS DECORATION CONFIGURATION
// Keyed by branch ID. You can add or remove roses/leaves on ANY branch!
// ----------------------------------------------------------------------------
export const TREE_DECORATIONS = {
  // ==========================================================================
  // [A] TOP SECTION VINES (Monogram -> Section Headers)
  // Gracefully crowns headings without covering the title text.
  // ==========================================================================

  // Monogram "A" -> Open Section Header (Red themed)
  "section-0": {
    stemColor: "red",
    stemWidth: 1.05,
    isLetterAnchored: true,
    letterIdx: 0,
    elements: [
      { type: "leaf", u: 0.18, side: -1, length: 25, bend: 0.15 },
      { type: "rose", color: "red", u: 0.32, side: 1, size: 21, rot: 0.2 },
      { type: "leaf", u: 0.36, side: -1, length: 23, bend: -0.15 },
      { type: "leaf", u: 0.50, side: 1, length: 25, bend: 0.2 },
      { type: "rose", color: "red", u: 0.64, side: -1, size: 22, rot: -0.25 },
      { type: "leaf", u: 0.68, side: 1, length: 23, bend: -0.15 },
      // Terminal crown framing above Open Section heading (clear of text)
      { type: "leaf", u: 0.82, side: -1, length: 24, bend: 0.15 },
      { type: "rose", color: "red", u: 0.85, side: -1, size: 21, rot: -0.2 },
      { type: "rose", color: "white", u: 0.86, side: 1, size: 19, rot: 0.2 },
      { type: "leaf", u: 0.88, side: 1, length: 24, bend: -0.15 },
    ],
  },

  // Monogram "C" (center) -> Women's Section Header (White themed with red accent)
  "section-1": {
    stemColor: "white",
    stemWidth: 1.05,
    isLetterAnchored: true,
    letterIdx: 1,
    elements: [
      { type: "leaf", u: 0.18, side: 1, length: 25, bend: -0.15 },
      { type: "rose", color: "white", u: 0.32, side: -1, size: 21, rot: -0.2 },
      { type: "leaf", u: 0.36, side: 1, length: 23, bend: 0.15 },
      { type: "leaf", u: 0.50, side: -1, length: 25, bend: -0.2 },
      { type: "rose", color: "white", u: 0.64, side: 1, size: 22, rot: 0.25 },
      { type: "leaf", u: 0.68, side: -1, length: 23, bend: 0.15 },
      // Terminal crown framing above Women's Section heading (clear of text)
      { type: "leaf", u: 0.82, side: 1, length: 24, bend: -0.15 },
      { type: "rose", color: "white", u: 0.85, side: 1, size: 21, rot: 0.2 },
      { type: "rose", color: "red", u: 0.86, side: -1, size: 19, rot: -0.2 },
      { type: "leaf", u: 0.88, side: -1, length: 24, bend: 0.15 },
    ],
  },

  // Monogram "C" (right) -> Inter-Club Section Header (Black themed with red accent)
  "section-2": {
    stemColor: "black",
    stemWidth: 1.05,
    isLetterAnchored: true,
    letterIdx: 2,
    elements: [
      { type: "leaf", u: 0.18, side: -1, length: 25, bend: 0.15 },
      { type: "rose", color: "black", u: 0.32, side: 1, size: 21, rot: 0.2 },
      { type: "leaf", u: 0.36, side: -1, length: 23, bend: -0.15 },
      { type: "leaf", u: 0.50, side: 1, length: 25, bend: 0.2 },
      { type: "rose", color: "black", u: 0.64, side: -1, size: 22, rot: -0.25 },
      { type: "leaf", u: 0.68, side: 1, length: 23, bend: -0.15 },
      // Terminal crown framing above Inter-Club heading (clear of text)
      { type: "leaf", u: 0.82, side: -1, length: 24, bend: 0.15 },
      { type: "rose", color: "black", u: 0.85, side: -1, size: 21, rot: -0.2 },
      { type: "rose", color: "red", u: 0.86, side: 1, size: 19, rot: 0.2 },
      { type: "leaf", u: 0.88, side: 1, length: 24, bend: -0.15 },
    ],
  },

  // ==========================================================================
  // [B] SECTION RATING BRACKET VINES (Continuous Serial Trellis)
  // Each bracket transition has harmonious alternating leaves and a central bloom.
  // ==========================================================================

  // Open Section: Header -> Beginner Bracket (0 - 899)
  "tier-0-0": {
    stemColor: "stem",
    stemWidth: 0.95,
    elements: [
      { type: "leaf", u: 0.28, side: 1, length: 22, bend: -0.15 },
      { type: "rose", color: "red", u: 0.50, side: -1, size: 20, rot: 0.15 },
      { type: "leaf", u: 0.72, side: -1, length: 21, bend: 0.15 },
    ],
  },

  // Open Section: Beginner -> Intermediate Bracket (900 - 1499)
  "tier-0-1": {
    stemColor: "stem",
    stemWidth: 0.95,
    elements: [
      { type: "leaf", u: 0.28, side: -1, length: 22, bend: 0.15 },
      { type: "rose", color: "white", u: 0.50, side: 1, size: 20, rot: -0.15 },
      { type: "leaf", u: 0.72, side: 1, length: 21, bend: -0.15 },
    ],
  },

  // Open Section: Intermediate -> Advanced Bracket (1500 - 3000)
  "tier-0-2": {
    stemColor: "stem",
    stemWidth: 0.95,
    elements: [
      { type: "leaf", u: 0.28, side: 1, length: 22, bend: -0.15 },
      { type: "rose", color: "red", u: 0.50, side: -1, size: 20, rot: 0.15 },
      { type: "leaf", u: 0.72, side: -1, length: 21, bend: 0.15 },
    ],
  },

  // Open Section: Advanced -> Exit Collector Vine
  "tier-collector-0": {
    stemColor: "stem",
    stemWidth: 1.0,
    elements: [
      { type: "leaf", u: 0.26, side: -1, length: 22, bend: 0.15 },
      { type: "rose", color: "black", u: 0.52, side: 1, size: 20, rot: -0.2 },
      { type: "leaf", u: 0.76, side: 1, length: 21, bend: -0.15 },
    ],
  },

  // Women's Section: Header -> All Ratings Bracket (0 - 3000)
  "tier-1-0": {
    stemColor: "stem",
    stemWidth: 0.95,
    elements: [
      { type: "leaf", u: 0.28, side: 1, length: 22, bend: -0.15 },
      { type: "rose", color: "white", u: 0.50, side: -1, size: 20, rot: 0.15 },
      { type: "leaf", u: 0.72, side: -1, length: 21, bend: 0.15 },
    ],
  },

  // Women's Section: All Ratings -> Exit Collector Vine
  "tier-return-1-0": {
    stemColor: "stem",
    stemWidth: 0.95,
    elements: [
      { type: "leaf", u: 0.26, side: -1, length: 22, bend: 0.15 },
      { type: "rose", color: "white", u: 0.52, side: 1, size: 20, rot: -0.2 },
      { type: "leaf", u: 0.76, side: 1, length: 21, bend: -0.15 },
    ],
  },

  // Inter-Club Section: Header -> All Ratings Bracket (0 - 3000)
  "tier-2-0": {
    stemColor: "stem",
    stemWidth: 0.95,
    elements: [
      { type: "leaf", u: 0.28, side: -1, length: 22, bend: 0.15 },
      { type: "rose", color: "black", u: 0.50, side: 1, size: 20, rot: -0.15 },
      { type: "leaf", u: 0.72, side: 1, length: 21, bend: -0.15 },
    ],
  },

  // Inter-Club Section: All Ratings -> Exit Collector Vine
  "tier-return-2-0": {
    stemColor: "stem",
    stemWidth: 0.95,
    elements: [
      { type: "leaf", u: 0.26, side: 1, length: 22, bend: -0.15 },
      { type: "rose", color: "black", u: 0.52, side: -1, size: 20, rot: 0.2 },
      { type: "leaf", u: 0.76, side: -1, length: 21, bend: 0.15 },
    ],
  },

  // ==========================================================================
  // [C] SECTION ROOTS LEADING TO PRIZE MERGER
  // Cascading gracefully downward to converge into the central prize trunk.
  // ==========================================================================

  // Open Section exit vine -> Prizes merger (Red dominant with white accent)
  "merge-0": {
    stemColor: "red",
    stemWidth: 1.05,
    elements: [
      { type: "leaf", u: 0.25, side: -1, length: 23, bend: 0.15 },
      { type: "rose", color: "red", u: 0.45, side: 1, size: 21, rot: 0.2 },
      { type: "leaf", u: 0.65, side: 1, length: 22, bend: -0.15 },
      { type: "rose", color: "red", u: 0.85, side: -1, size: 20, rot: -0.15 },
    ],
  },

  // Women's Section exit vine -> Prizes merger (White roses & red accents)
  "merge-1": {
    stemColor: "white",
    stemWidth: 1.05,
    elements: [
      { type: "leaf", u: 0.20, side: 1, length: 23, bend: -0.15 },
      { type: "rose", color: "red", u: 0.38, side: -1, size: 21, rot: 0.2 },
      { type: "leaf", u: 0.55, side: 1, length: 22, bend: 0.15 },
      { type: "rose", color: "white", u: 0.70, side: 1, size: 22, rot: -0.2 },
      { type: "leaf", u: 0.84, side: -1, length: 22, bend: -0.15 },
      { type: "rose", color: "white", u: 0.90, side: -1, size: 20, rot: 0.15 },
    ],
  },

  // Inter-Club Section exit vine -> Prizes merger (Black roses & red accents)
  "merge-2": {
    stemColor: "black",
    stemWidth: 1.05,
    elements: [
      { type: "leaf", u: 0.20, side: -1, length: 23, bend: 0.15 },
      { type: "rose", color: "red", u: 0.38, side: 1, size: 21, rot: -0.2 },
      { type: "leaf", u: 0.55, side: -1, length: 22, bend: -0.15 },
      { type: "rose", color: "black", u: 0.70, side: -1, size: 22, rot: 0.2 },
      { type: "leaf", u: 0.84, side: 1, length: 22, bend: 0.15 },
      { type: "rose", color: "black", u: 0.90, side: 1, size: 20, rot: -0.15 },
    ],
  },

  // Convergence trunk into "Prizes & Accolades" heading (Delicate triad)
  "prizes-stem": {
    stemColor: "mixed",
    stemWidth: 1.15,
    elements: [
      { type: "leaf", u: 0.32, side: -1, length: 23, bend: 0.15 },
      { type: "leaf", u: 0.52, side: 1, length: 24, bend: -0.15 },
      // Arrival crown above Prizes heading (flanking, leaves text completely clear)
      { type: "rose", color: "red", u: 0.84, side: -1, size: 21, rot: -0.25 },
      { type: "rose", color: "white", u: 0.86, side: 1, size: 21, rot: 0.25 },
      { type: "leaf", u: 0.88, side: -1, length: 24, bend: 0.2 },
      { type: "leaf", u: 0.90, side: 1, length: 24, bend: -0.2 },
    ],
  },

  // ==========================================================================
  // [D] PRIZE ROOTS (Prizes heading -> 1st, 2nd, 3rd place podium cards)
  // ==========================================================================

  // 1st Place Podium Root (Red themed)
  "prize-0": {
    stemColor: "red",
    stemWidth: 1.05,
    elements: [
      { type: "leaf", u: 0.32, side: -1, length: 23, bend: 0.15 },
      { type: "rose", color: "red", u: 0.56, side: 1, size: 21, rot: 0.2 },
      { type: "leaf", u: 0.74, side: -1, length: 23, bend: -0.15 },
      { type: "leaf", u: 0.88, side: -1, length: 24, bend: 0.25 },
      { type: "leaf", u: 0.90, side: 1, length: 24, bend: -0.25 },
      { type: "rose", color: "red", u: 0.93, side: 0, size: 24, rot: 0.1 },
    ],
  },

  // 2nd Place Podium Root (White themed)
  "prize-1": {
    stemColor: "white",
    stemWidth: 1.05,
    elements: [
      { type: "leaf", u: 0.32, side: 1, length: 23, bend: -0.15 },
      { type: "rose", color: "white", u: 0.56, side: -1, size: 21, rot: -0.2 },
      { type: "leaf", u: 0.74, side: 1, length: 23, bend: 0.15 },
      { type: "leaf", u: 0.88, side: -1, length: 24, bend: 0.25 },
      { type: "leaf", u: 0.90, side: 1, length: 24, bend: -0.25 },
      { type: "rose", color: "white", u: 0.93, side: 0, size: 24, rot: -0.1 },
    ],
  },

  // 3rd Place Podium Root (Black themed)
  "prize-2": {
    stemColor: "black",
    stemWidth: 1.05,
    elements: [
      { type: "leaf", u: 0.28, side: -1, length: 23, bend: 0.15 },
      { type: "rose", color: "black", u: 0.50, side: -1, size: 22, rot: 0.15 },
      { type: "leaf", u: 0.72, side: 1, length: 23, bend: -0.15 },
      { type: "leaf", u: 0.88, side: -1, length: 24, bend: 0.25 },
      { type: "leaf", u: 0.90, side: 1, length: 24, bend: -0.25 },
      { type: "rose", color: "black", u: 0.93, side: 0, size: 24, rot: 0.1 },
    ],
  },
};

/**
 * Normalizes any element definition so both beginner-friendly keys
 * (type, size, length, position) and internal shorthand (t, R, L, u) work!
 */
export function normalizeTreeElement(def, index = 0) {
  const t = def.type || def.t || "rose";
  const u = def.position != null ? def.position : def.u != null ? def.u : 0.5;
  const side = def.side != null ? def.side : 0;
  const rot = def.rot != null ? def.rot : 0;
  const color = def.color || "red";
  const R = def.size != null ? def.size : def.R != null ? def.R : 21;
  const L = def.length != null ? def.length : def.L != null ? def.L : 24;
  const bend = def.bend != null ? def.bend : side < 0 ? 0.15 : -0.15;
  const id = def.id || 90000 + index * 101;

  return {
    t,
    u,
    side,
    rot,
    color,
    R,
    L,
    bend,
    id,
  };
}
