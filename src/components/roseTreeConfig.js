/**
 * ============================================================================
 * 🌹 ROSE TREE CANVAS CONFIGURATION
 * ============================================================================
 *
 * Configures the botanical decoration layer: roses, gothic leaves, and thorns.
 * Restores the rich visual look of Screenshot A with:
 * - Three rose tones: Deep Crimson (red), Ivory/Cream (white), Charcoal (black)
 * - Detailed webp rose and leaf assets
 * - Generous density (~1 rose/cluster + 2-3 leaves every 120-160px)
 * - Large hero roses at ACC heading, junctions, and 1st place finale
 * - Safe zones: roses sit in margins, gaps, and junctions, NEVER covering text glyphs
 * ============================================================================
 */

export const MONOGRAM_ROSE_DISTRIBUTION = {
  red: 0.6,
  white: 0.25,
  black: 0.15,
};

export function pickMonogramRoseColor(rand = Math.random) {
  const r = typeof rand === "function" ? rand() : rand;
  if (r < MONOGRAM_ROSE_DISTRIBUTION.red) return "red";
  if (r < MONOGRAM_ROSE_DISTRIBUTION.red + MONOGRAM_ROSE_DISTRIBUTION.white)
    return "white";
  return "black";
}

export const ROSE_SIZES = {
  hero: 28,
  large: 24,
  medium: 20,
  small: 16,
};

export const LEAF_SIZES = {
  large: 26,
  medium: 23,
  small: 19,
};

/**
 * Branch-by-branch decoration mapping.
 * Each branch ID corresponds to an edge calculated by measureTree().
 */
export const TREE_DECORATIONS = {
  // ==========================================================================
  // [A] TOP ARMS: "A C C" Monogram -> Section Columns
  // ==========================================================================

  // Monogram "A" -> Open Section (Red dominant with white accent)
  "section-0": {
    stemColor: "red",
    stemWidth: 1.12,
    isLetterAnchored: true,
    letterIdx: 0,
    elements: [
      { type: "leaf", u: 0.18, side: -1, length: LEAF_SIZES.large, bend: 0.15 },
      { type: "rose", color: "red", u: 0.32, side: -1, size: ROSE_SIZES.large, rot: -0.2 },
      { type: "leaf", u: 0.36, side: 1, length: LEAF_SIZES.medium, bend: -0.12 },
      { type: "leaf", u: 0.52, side: -1, length: LEAF_SIZES.medium, bend: 0.18 },
      { type: "rose", color: "white", u: 0.68, side: 1, size: ROSE_SIZES.medium, rot: 0.2 },
      { type: "leaf", u: 0.72, side: 1, length: LEAF_SIZES.medium, bend: -0.15 },
      { type: "leaf", u: 0.86, side: -1, length: LEAF_SIZES.large, bend: 0.15 },
      // Entrance anchor above Open column (outside text)
      { type: "rose", color: "red", u: 0.94, side: -1, size: ROSE_SIZES.large, rot: -0.25 },
      { type: "leaf", u: 0.96, side: 1, length: LEAF_SIZES.medium, bend: 0.2 },
    ],
  },

  // Monogram "C" (center) -> Women's Section (Ivory/White dominant with red accents)
  "section-1": {
    stemColor: "white",
    stemWidth: 1.12,
    isLetterAnchored: true,
    letterIdx: 1,
    elements: [
      { type: "leaf", u: 0.18, side: 1, length: LEAF_SIZES.large, bend: -0.15 },
      { type: "rose", color: "white", u: 0.35, side: 1, size: ROSE_SIZES.large, rot: 0.2 },
      { type: "leaf", u: 0.38, side: -1, length: LEAF_SIZES.medium, bend: 0.12 },
      { type: "leaf", u: 0.55, side: 1, length: LEAF_SIZES.medium, bend: -0.18 },
      { type: "rose", color: "red", u: 0.7, side: -1, size: ROSE_SIZES.medium, rot: -0.2 },
      { type: "leaf", u: 0.74, side: -1, length: LEAF_SIZES.medium, bend: 0.15 },
      { type: "leaf", u: 0.88, side: 1, length: LEAF_SIZES.large, bend: -0.15 },
      // Drop entrance anchor above Women's column (clear of text)
      { type: "rose", color: "white", u: 0.95, side: 1, size: ROSE_SIZES.large, rot: 0.2 },
    ],
  },

  // Monogram "C" (right) -> Inter-Club (Charcoal Black dominant with red accents)
  "section-2": {
    stemColor: "black",
    stemWidth: 1.12,
    isLetterAnchored: true,
    letterIdx: 2,
    elements: [
      { type: "leaf", u: 0.18, side: -1, length: LEAF_SIZES.large, bend: 0.15 },
      { type: "rose", color: "black", u: 0.35, side: 1, size: ROSE_SIZES.large, rot: 0.2 },
      { type: "leaf", u: 0.38, side: -1, length: LEAF_SIZES.medium, bend: -0.12 },
      { type: "leaf", u: 0.55, side: 1, length: LEAF_SIZES.medium, bend: 0.18 },
      { type: "rose", color: "red", u: 0.7, side: -1, size: ROSE_SIZES.medium, rot: -0.2 },
      { type: "leaf", u: 0.74, side: 1, length: LEAF_SIZES.medium, bend: -0.15 },
      { type: "leaf", u: 0.88, side: -1, length: LEAF_SIZES.large, bend: 0.15 },
      // Entrance anchor above Inter-Club column (clear of text)
      { type: "rose", color: "black", u: 0.95, side: 1, size: ROSE_SIZES.large, rot: 0.2 },
    ],
  },

  // ==========================================================================
  // [B] OPEN COLUMN: Continuous vine along left side of text to baseline
  // Roses & leaves strictly on outer side (-1 = leftwards into margin)
  // ==========================================================================
  "tier-stem-0": {
    stemColor: "stem",
    stemWidth: 1.0,
    elements: [
      { type: "leaf", u: 0.08, side: -1, length: LEAF_SIZES.large, bend: 0.18 },
      // Beside Beginner bracket (outer margin)
      { type: "rose", color: "red", u: 0.18, side: -1, size: ROSE_SIZES.large, rot: -0.2 },
      { type: "leaf", u: 0.22, side: -1, length: LEAF_SIZES.medium, bend: 0.15 },
      { type: "leaf", u: 0.32, side: 1, length: LEAF_SIZES.small, bend: -0.1 },
      // Gap between Beginner and Intermediate
      { type: "rose", color: "white", u: 0.42, side: -1, size: ROSE_SIZES.medium, rot: 0.18 },
      { type: "leaf", u: 0.46, side: -1, length: LEAF_SIZES.medium, bend: 0.15 },
      // Beside Intermediate bracket (outer margin)
      { type: "rose", color: "red", u: 0.58, side: -1, size: ROSE_SIZES.large, rot: -0.22 },
      { type: "leaf", u: 0.62, side: -1, length: LEAF_SIZES.large, bend: 0.18 },
      // Gap between Intermediate and Advanced
      { type: "rose", color: "black", u: 0.74, side: -1, size: ROSE_SIZES.medium, rot: 0.2 },
      { type: "leaf", u: 0.78, side: -1, length: LEAF_SIZES.medium, bend: 0.15 },
      // Beside Advanced bracket & down to baseline
      { type: "rose", color: "red", u: 0.88, side: -1, size: ROSE_SIZES.large, rot: -0.2 },
      { type: "leaf", u: 0.92, side: -1, length: LEAF_SIZES.large, bend: 0.2 },
      { type: "leaf", u: 0.96, side: 1, length: LEAF_SIZES.small, bend: -0.15 },
    ],
  },

  // Feeder branches to Open brackets
  "tier-0-0": {
    stemColor: "stem",
    stemWidth: 0.95,
    elements: [
      { type: "leaf", u: 0.4, side: 1, length: LEAF_SIZES.small, bend: 0.15 },
      { type: "rose", color: "red", u: 0.75, side: -1, size: ROSE_SIZES.small, rot: 0.15 },
    ],
  },

  "tier-0-1": {
    stemColor: "stem",
    stemWidth: 0.95,
    elements: [
      { type: "leaf", u: 0.4, side: -1, length: LEAF_SIZES.small, bend: -0.15 },
      { type: "rose", color: "white", u: 0.75, side: 1, size: ROSE_SIZES.small, rot: -0.15 },
    ],
  },

  "tier-0-2": {
    stemColor: "stem",
    stemWidth: 0.95,
    elements: [
      { type: "leaf", u: 0.4, side: 1, length: LEAF_SIZES.small, bend: 0.15 },
      { type: "rose", color: "red", u: 0.75, side: -1, size: ROSE_SIZES.small, rot: 0.15 },
    ],
  },

  // ==========================================================================
  // [C] WOMEN'S & INTER-CLUB COLUMNS:
  // Runs down center after last text block through empty space to baseline.
  // Generously decorated with roses and leaves matching Screenshot A!
  // ==========================================================================

  // Women's Column Center Vine (White/Cream dominant with red accents)
  "tier-1-run": {
    stemColor: "stem",
    stemWidth: 1.0,
    elements: [
      { type: "leaf", u: 0.1, side: -1, length: LEAF_SIZES.medium, bend: 0.15 },
      { type: "rose", color: "white", u: 0.22, side: 1, size: ROSE_SIZES.large, rot: 0.2 },
      { type: "leaf", u: 0.28, side: 1, length: LEAF_SIZES.large, bend: -0.15 },
      { type: "leaf", u: 0.42, side: -1, length: LEAF_SIZES.medium, bend: 0.18 },
      { type: "rose", color: "white", u: 0.52, side: -1, size: ROSE_SIZES.large, rot: -0.22 },
      { type: "rose", color: "red", u: 0.56, side: 1, size: ROSE_SIZES.medium, rot: 0.18 },
      { type: "leaf", u: 0.62, side: 1, length: LEAF_SIZES.medium, bend: -0.15 },
      { type: "leaf", u: 0.75, side: -1, length: LEAF_SIZES.large, bend: 0.15 },
      { type: "rose", color: "white", u: 0.84, side: 1, size: ROSE_SIZES.large, rot: 0.2 },
      { type: "leaf", u: 0.88, side: -1, length: LEAF_SIZES.medium, bend: -0.15 },
      { type: "rose", color: "red", u: 0.95, side: -1, size: ROSE_SIZES.medium, rot: -0.15 },
    ],
  },

  // Inter-Club Column Center Vine (Charcoal Black dominant with red accents)
  "tier-2-run": {
    stemColor: "stem",
    stemWidth: 1.0,
    elements: [
      { type: "leaf", u: 0.1, side: 1, length: LEAF_SIZES.medium, bend: -0.15 },
      { type: "rose", color: "black", u: 0.22, side: -1, size: ROSE_SIZES.large, rot: -0.2 },
      { type: "leaf", u: 0.28, side: -1, length: LEAF_SIZES.large, bend: 0.15 },
      { type: "leaf", u: 0.42, side: 1, length: LEAF_SIZES.medium, bend: -0.18 },
      { type: "rose", color: "black", u: 0.52, side: 1, size: ROSE_SIZES.large, rot: 0.22 },
      { type: "rose", color: "red", u: 0.56, side: -1, size: ROSE_SIZES.medium, rot: -0.18 },
      { type: "leaf", u: 0.62, side: -1, length: LEAF_SIZES.medium, bend: 0.15 },
      { type: "leaf", u: 0.75, side: 1, length: LEAF_SIZES.large, bend: -0.15 },
      { type: "rose", color: "black", u: 0.84, side: -1, size: ROSE_SIZES.large, rot: -0.2 },
      { type: "leaf", u: 0.88, side: 1, length: LEAF_SIZES.medium, bend: 0.15 },
      { type: "rose", color: "red", u: 0.95, side: 1, size: ROSE_SIZES.medium, rot: 0.15 },
    ],
  },

  // ==========================================================================
  // [D] BASELINE MERGE & PRIZES STEM
  // Horizontal baseline connecting all 3 columns -> Center trunk to Prizes
  // ==========================================================================

  // Horizontal baseline vine connecting Open, Women's, and Inter-Club
  "baseline-merge": {
    stemColor: "stem",
    stemWidth: 1.1,
    elements: [
      { type: "leaf", u: 0.08, side: 1, length: LEAF_SIZES.large, bend: 0.15 },
      { type: "rose", color: "red", u: 0.16, side: 1, size: ROSE_SIZES.large, rot: 0.2 },
      { type: "leaf", u: 0.24, side: -1, length: LEAF_SIZES.medium, bend: -0.15 },
      { type: "rose", color: "white", u: 0.38, side: 1, size: ROSE_SIZES.medium, rot: -0.18 },
      { type: "leaf", u: 0.44, side: 1, length: LEAF_SIZES.medium, bend: 0.15 },
      // Center junction below Women's column
      { type: "rose", color: "red", u: 0.5, side: 1, size: ROSE_SIZES.hero, rot: 0.1 },
      { type: "leaf", u: 0.52, side: -1, length: LEAF_SIZES.large, bend: 0.2 },
      { type: "leaf", u: 0.58, side: 1, length: LEAF_SIZES.medium, bend: -0.15 },
      { type: "rose", color: "white", u: 0.65, side: 1, size: ROSE_SIZES.medium, rot: 0.18 },
      { type: "leaf", u: 0.74, side: -1, length: LEAF_SIZES.medium, bend: 0.15 },
      { type: "rose", color: "black", u: 0.84, side: 1, size: ROSE_SIZES.large, rot: -0.2 },
      { type: "leaf", u: 0.92, side: 1, length: LEAF_SIZES.large, bend: -0.15 },
    ],
  },

  // Center trunk descending from baseline directly into the CROWN cluster above "PRIZES & ACCOLADES"
  "prizes-stem": {
    stemColor: "stem",
    stemWidth: 1.25,
    elements: [
      { type: "leaf", u: 0.2, side: -1, length: LEAF_SIZES.medium, bend: 0.15 },
      { type: "rose", color: "red", u: 0.4, side: 1, size: ROSE_SIZES.medium, rot: 0.18 },
      { type: "leaf", u: 0.58, side: 1, length: LEAF_SIZES.medium, bend: -0.15 },
      { type: "leaf", u: 0.76, side: -1, length: LEAF_SIZES.large, bend: 0.18 },
      // DELIBERATE CROWN CLUSTER centered directly above heading (24-40px clear)
      { type: "leaf", u: 0.9, side: -1, length: LEAF_SIZES.large, bend: 0.2 },
      { type: "leaf", u: 0.9, side: 1, length: LEAF_SIZES.large, bend: -0.2 },
      { type: "rose", color: "white", u: 0.94, side: 1, size: ROSE_SIZES.small + 2, rot: 0.2 },
      { type: "rose", color: "black", u: 0.94, side: -1, size: ROSE_SIZES.small, rot: -0.2 },
      { type: "leaf", u: 0.97, side: -1, length: LEAF_SIZES.small, bend: 0.15 },
      { type: "leaf", u: 0.97, side: 1, length: LEAF_SIZES.small, bend: -0.15 },
      { type: "rose", color: "red", u: 1.0, side: 0, size: ROSE_SIZES.large + 2, rot: 0.05 },
    ],
  },

  // ==========================================================================
  // [E] PRIZES CONTINUOUS BOUGH & HANGING BRANCHES
  // Springs from central fork directly under heading, spanning across 1st, 2nd, 3rd
  // ==========================================================================

  // Left bough arm (springs from fork under heading -> curves left over 1st place)
  "prizes-bough-left": {
    stemColor: "stem",
    stemWidth: 1.1,
    elements: [
      { type: "leaf", u: 0.22, side: 1, length: LEAF_SIZES.medium, bend: -0.15 },
      { type: "rose", color: "white", u: 0.38, side: -1, size: ROSE_SIZES.medium, rot: 0.18 },
      { type: "leaf", u: 0.55, side: -1, length: LEAF_SIZES.large, bend: 0.15 },
      { type: "rose", color: "red", u: 0.65, side: 1, size: ROSE_SIZES.small, rot: -0.18 },
      { type: "rose", color: "black", u: 0.82, side: -1, size: ROSE_SIZES.small, rot: 0.15 },
      { type: "leaf", u: 0.88, side: 1, length: LEAF_SIZES.medium, bend: -0.15 },
    ],
  },

  // Right bough arm (springs from fork under heading -> curves right over 3rd place)
  "prizes-bough-right": {
    stemColor: "stem",
    stemWidth: 1.1,
    elements: [
      { type: "leaf", u: 0.22, side: -1, length: LEAF_SIZES.medium, bend: 0.15 },
      { type: "rose", color: "red", u: 0.38, side: 1, size: ROSE_SIZES.medium, rot: -0.18 },
      { type: "leaf", u: 0.55, side: 1, length: LEAF_SIZES.large, bend: -0.15 },
      { type: "rose", color: "white", u: 0.65, side: -1, size: ROSE_SIZES.small, rot: 0.18 },
      { type: "rose", color: "black", u: 0.82, side: 1, size: ROSE_SIZES.small, rot: -0.15 },
      { type: "leaf", u: 0.88, side: -1, length: LEAF_SIZES.medium, bend: 0.15 },
    ],
  },

  // 1st Place Hanging Branch (drops from left bough, centered over 1st place)
  // Subtle grand finale emphasis: slightly denser hero crimson + ivory cluster
  "prize-hang-0": {
    stemColor: "stem",
    stemWidth: 0.95,
    elements: [
      { type: "leaf", u: 0.38, side: -1, length: LEAF_SIZES.medium, bend: 0.15 },
      { type: "rose", color: "white", u: 0.9, side: 1, size: ROSE_SIZES.small, rot: 0.18 },
      { type: "leaf", u: 0.94, side: -1, length: LEAF_SIZES.large, bend: 0.2 },
      { type: "leaf", u: 0.94, side: 1, length: LEAF_SIZES.medium, bend: -0.15 },
      { type: "rose", color: "red", u: 0.98, side: 0, size: ROSE_SIZES.large, rot: -0.12 },
    ],
  },

  // 2nd Place Hanging Branch (drops straight from central fork with slight bend)
  "prize-hang-1": {
    stemColor: "stem",
    stemWidth: 0.95,
    elements: [
      { type: "leaf", u: 0.42, side: 1, length: LEAF_SIZES.medium, bend: -0.15 },
      { type: "rose", color: "red", u: 0.92, side: -1, size: ROSE_SIZES.small, rot: -0.15 },
      { type: "leaf", u: 0.95, side: 1, length: LEAF_SIZES.small, bend: -0.15 },
      { type: "rose", color: "white", u: 0.98, side: 0, size: ROSE_SIZES.medium, rot: 0.1 },
    ],
  },

  // 3rd Place Hanging Branch (drops from right bough, centered over 3rd place)
  "prize-hang-2": {
    stemColor: "stem",
    stemWidth: 0.95,
    elements: [
      { type: "leaf", u: 0.38, side: 1, length: LEAF_SIZES.medium, bend: -0.15 },
      { type: "rose", color: "red", u: 0.9, side: -1, size: ROSE_SIZES.small, rot: -0.18 },
      { type: "leaf", u: 0.94, side: 1, length: LEAF_SIZES.large, bend: -0.2 },
      { type: "leaf", u: 0.94, side: -1, length: LEAF_SIZES.small, bend: 0.15 },
      { type: "rose", color: "black", u: 0.98, side: 0, size: ROSE_SIZES.medium, rot: 0.15 },
    ],
  },

  // ==========================================================================
  // [F] MOBILE VINE (Narrow Screens)
  // ==========================================================================
  "mobile-spine": {
    stemColor: "stem",
    stemWidth: 1.05,
    elements: [
      { type: "leaf", u: 0.08, side: 1, length: LEAF_SIZES.small, bend: 0.15 },
      { type: "rose", color: "red", u: 0.16, side: 1, size: ROSE_SIZES.medium, rot: 0.2 },
      { type: "leaf", u: 0.26, side: 1, length: LEAF_SIZES.small, bend: -0.15 },
      { type: "rose", color: "white", u: 0.38, side: 1, size: ROSE_SIZES.medium, rot: -0.2 },
      { type: "leaf", u: 0.5, side: 1, length: LEAF_SIZES.small, bend: 0.15 },
      { type: "rose", color: "black", u: 0.62, side: 1, size: ROSE_SIZES.medium, rot: 0.2 },
      { type: "leaf", u: 0.74, side: 1, length: LEAF_SIZES.small, bend: -0.15 },
      { type: "rose", color: "red", u: 0.86, side: 1, size: ROSE_SIZES.large, rot: 0.15 },
      { type: "leaf", u: 0.94, side: 1, length: LEAF_SIZES.small, bend: 0.15 },
    ],
  },
};

/**
 * Normalizes element configuration
 */
export function normalizeTreeElement(def, index = 0) {
  const t = def.type || def.t || "rose";
  const u = def.position != null ? def.position : def.u != null ? def.u : 0.5;
  const side = def.side != null ? def.side : 0;
  const rot = def.rot != null ? def.rot : 0;
  const color = def.color || "red";
  const R =
    def.size != null
      ? def.size
      : def.R != null
        ? def.R
        : ROSE_SIZES.medium;
  const L =
    def.length != null
      ? def.length
      : def.L != null
        ? def.L
        : LEAF_SIZES.medium;
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
