"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const PALETTE = {
  name: "Crimson Noir",
  bg: "#0a090b",
  flower: "#b30c24",
  stem: "#302622",
  line: "#e62b40",
  text: "#f2ede4",
  leaf: "#18241b",
  drip: "#940516",
  thorns: "#221915",
};

class TypeGardenEngine {
  constructor(canvas) {
    this.cv = canvas;
    this.ctx = canvas.getContext("2d");
    this.letters = [];
    this.uid = 1;
    this.cache = {};
    this.Sd = 0;
    this.St = 0;
    this.wrapped = false;
    this.t0 = performance.now();
    this.lastKey = 0;
    this.rand = Math.random;
    this.F = '"Playfair Display", Georgia, serif';
    this.mx = null;
    this.my = null;
    this.flies = [];
    this.perch = [];
    this.gifts = [];
    this.fa = {};
    this.assets = {};
    this.assetsLoaded = false;
    this.started = false;
    this.branches = [];

    this.W = canvas.width || 1200;
    this.H = 400;
    this.centerX = this.W / 2;
    this.centerY = 220;

    this.preloadAssets();
  }

  preloadAssets() {
    const list = [
      ["gothic_leaves", "/roses/leaves/gothic_leaves.webp?v=4"],
      ["red_rose", "/roses/red/red_rose.webp?v=4"],
      ["red_rose_angle", "/roses/red/red_rose_angle.webp?v=4"],
      ["white_rose", "/roses/white/white_rose.webp?v=4"],
      ["white_rose_angle", "/roses/white/white_rose_angle.webp?v=4"],
      ["black_rose", "/roses/black/black_rose.webp?v=4"],
      ["black_rose_angle", "/roses/black/black_rose_angle.webp?v=4"],
    ];
    let loaded = 0;
    list.forEach(([k, src]) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        if (img.decode) {
          img
            .decode()
            .catch(() => {})
            .finally(() => {
              this.assets[k] = img;
              loaded++;
              if (loaded === list.length) {
                this.assetsLoaded = true;
                if (this.wakeUp) this.wakeUp();
              }
            });
        } else {
          this.assets[k] = img;
          loaded++;
          if (loaded === list.length) {
            this.assetsLoaded = true;
            if (this.wakeUp) this.wakeUp();
          }
        }
      };
      img.onerror = () => {
        console.error("Failed to load asset:", src);
      };
      img.src = src;
    });

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts
        .load(`700 100px ${this.F}`)
        .then(() => {
          this.cache = {};
          this.layout(true);
          if (this.wakeUp) this.wakeUp();
        })
        .catch(() => {});
    }
  }

  // --- Math & Spring Helpers  ---
  h(n) {
    const x = Math.sin(n) * 43758.5453;
    return x - Math.floor(x);
  }

  spr(t, k = 7, w = 15) {
    if (t <= 0) return 0;
    return 1 - Math.exp(-t * k) * Math.cos(t * w);
  }

  eo(t) {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return 1 - Math.pow(1 - t, 3);
  }

  rng(seed) {
    let s = seed | 0;
    return () => {
      s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  bez(a, b, c, d, n = 40) {
    const P = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n,
        u = 1 - t;
      P.push([
        u * u * u * a[0] +
          3 * u * u * t * b[0] +
          3 * u * t * t * c[0] +
          t * t * t * d[0],
        u * u * u * a[1] +
          3 * u * u * t * b[1] +
          3 * u * t * t * c[1] +
          t * t * t * d[1],
      ]);
    }
    return P;
  }

  at(P, u) {
    const n = P.length;
    if (n < 2) return [P[0] || [0, 0], 0];
    const i = Math.min(n - 2, Math.max(1, Math.round(u * (n - 1))));
    return [
      P[i],
      Math.atan2(P[i + 1][1] - P[i - 1][1], P[i + 1][0] - P[i - 1][0]),
    ];
  }

  jit(id, f, amp) {
    return [0, 0, 0];
  }

  vine(base, dir, len, amp, waves, ph, bend, n = 40) {
    const P = [[base[0], base[1]]];
    const step = len / n;
    let x = base[0],
      y = base[1];
    for (let i = 1; i <= n; i++) {
      const u = i / n;
      const a =
        dir +
        bend * u +
        amp * Math.sin(u * Math.PI * waves + ph) * Math.min(1, u * 3);
      x += Math.cos(a) * step;
      y += Math.sin(a) * step;
      P.push([x, y]);
    }
    return P;
  }

  shoot(P, sign, len = 0.15) {
    const n = P.length;
    if (n < 2) return P;
    const e = P[n - 1];
    const a = Math.atan2(e[1] - P[n - 2][1], e[0] - P[n - 2][0]);
    let x = e[0],
      y = e[1];
    const m = 12;
    const step = len / m;
    for (let i = 1; i <= m; i++) {
      const u = i / m;
      const curA = a + sign * u * 0.45;
      x += Math.cos(curA) * step;
      y += Math.sin(curA) * step;
      P.push([x, y]);
    }
    return P;
  }

  weave(r, startLayer) {
    const cuts = [];
    const nc = 1 + Math.floor(r() * 3);
    for (let i = 0; i < nc; i++) cuts.push(0.15 + r() * 0.7);
    cuts.sort((a, b) => a - b);
    const segs = [];
    let u0 = 0,
      layer = startLayer;
    for (const c of cuts) {
      if (c <= u0) continue;
      segs.push({ u0, u1: c, layer });
      if (r() < 0.3) {
        const g = 0.02 + r() * 0.03;
        u0 = Math.min(0.98, c + g);
      } else {
        u0 = c;
      }
      layer = 1 - layer;
    }
    segs.push({ u0, u1: 1, layer });
    return segs;
  }

  layerAt(segs, u) {
    if (!segs || !segs.length) return 0;
    for (const s of segs) if (u >= s.u0 && u <= s.u1) return s.layer;
    return segs[segs.length - 1].layer;
  }

  // --- Layout Engine ---
  mw(ch) {
    if (this.cache[ch] != null) return this.cache[ch];
    this.ctx.font = `700 100px ${this.F}`;
    let w = this.ctx.measureText(ch).width / 100;
    // Balanced space between letters for A C C
    if (ch === " ") w = 1.2;
    return (this.cache[ch] = w);
  }

  layoutCore(A, W, H, prevWrapped) {
    const maxW = W * 0.94;
    const S0 = 135;
    const LH = 2.1;
    const ws = A.map((l) => this.mw(l.ch));
    const words = [];
    let cur = null;
    A.forEach((l, i) => {
      if (l.ch === " ") {
        if (cur) {
          words.push(cur);
          cur = null;
        }
        words.push({ sp: true, idx: [i] });
      } else {
        if (!cur) cur = { idx: [] };
        cur.idx.push(i);
      }
    });
    if (cur) words.push(cur);

    const lineW = (li, S) => {
      let e = li.length;
      while (e > 0 && A[li[e - 1]].ch === " ") e--;
      let w = 0;
      for (let k = 0; k < e; k++) w += ws[li[k]];
      return w * S;
    };

    let lines = [A.map((_, i) => i)];
    const unit = lineW(lines[0], 1);
    let S = unit > 0 ? Math.min(S0, maxW / unit) : S0;
    S = Math.max(115, Math.min(145, S));

    const n = lines.length;
    const lh = LH * S;
    lines.forEach((li, k) => {
      let x = this.centerX - lineW(li, S) / 2;
      const y = this.centerY;
      li.forEach((i) => {
        const l = A[i];
        const w = ws[i] * S;
        l.tx = x + w / 2;
        l.ty = y;
        l.tw = w;
        l.line = k;
        x += w;
      });
    });
    return { S, wrapped: false, n };
  }

  layout(snap) {
    const A = this.letters.filter((l) => !l.dead);
    if (!A.length) return;
    const res = this.layoutCore(A, this.W, this.H, this.wrapped);
    this.wrapped = res.wrapped;
    const S = res.S;
    this.St = S;
    this.Sd = S;
    A.forEach((l) => {
      if (snap || l.x == null) {
        l.x = l.tx;
        l.y = l.ty;
      }
    });
    const last = A[A.length - 1];
    this.ctx_ = last ? last.tx + last.tw / 2 + 0.07 * S : this.centerX;
    this.cty = last ? last.ty - 0.33 * S : this.centerY;
    this.cx = this.ctx_;
    this.cy = this.cty;
  }

  // --- Growth Generator ---
  wordParams(ws) {
    const r = this.rng(ws * 7 + 13);
    const dens = 1.0;
    return {
      roseP: 0.42 + r() * 0.28,
      leafy: 0.5 + r() * 0.25,
      dens,
      lean: (r() - 0.5) * 0.6,
      big: 0.95 + r() * 0.45,
      curvy: 0.85 + r() * 0.55,
      bridgeP: Math.min(0.95, (0.5 + r() * 0.35) * dens),
      w: 0.5,
    };
  }

  grow(r, E, nid, p, o) {
    const tip =
      o.tip || (r() < p.roseP ? "rose" : r() < 0.72 ? "shoot" : "leaf");
    let P =
      o.pts ||
      this.vine(
        o.base,
        o.dir,
        o.len,
        (0.35 + r() * 0.45) * p.curvy,
        1 + r() * 1.6,
        r() * 6.28,
        (r() - 0.5) * 1.2,
        40,
      );
    if (tip === "shoot" || tip === "curl")
      P = this.shoot(P, r() < 0.5 ? -1 : 1, 0.14 + r() * 0.1);
    const segs = this.weave(r, o.layer0 != null ? o.layer0 : r() < 0.5 ? 0 : 1);
    const dur = Math.max(340, (o.len || 0.8) * 620);

    // Gothic brambles: sharp curved thorns
    const thorns = [];
    const nt = 2 + Math.floor(r() * 3.5);
    for (let i = 0; i < nt; i++) {
      thorns.push({
        u: 0.12 + r() * 0.75,
        s: r() < 0.5 ? -1 : 1,
        size: 0.8 + r() * 0.5,
        curve: 0.3 + r() * 0.4,
      });
    }
    E.push({
      t: "stem",
      id: nid(),
      pts: P,
      segs,
      d0: o.d0,
      dur,
      w: o.depth ? 0.85 : 1,
      thorns,
    });

    // Clean, un-cluttered leaf density
    const nl = r() < 0.4 * p.leafy ? 1 : 0;
    let sd = r() < 0.5 ? -1 : 1;
    for (let i = 0; i < nl; i++) {
      const u = 0.32 + r() * 0.45;
      const [q, a] = this.at(P, u);
      sd = -sd;
      E.push({
        t: "leaf",
        id: nid(),
        x: q[0],
        y: q[1],
        a: a + sd * (0.55 + r() * 0.35),
        L: (0.16 + r() * 0.16) * (o.depth ? 0.8 : 1),
        bend: (r() - 0.5) * 0.8,
        layer: this.layerAt(segs, u),
        d0: o.d0 + dur * u,
      });
    }

    const [tp, ta] = this.at(P, 1);
    const td = o.d0 + dur * 0.8;
    const tl = this.layerAt(segs, 1);

    if (tip === "rose") {
      const R = (0.14 + r() * 0.16) * p.big * (o.depth ? 0.78 : 1);
      const over = tp[1] > -0.78 && tp[1] < 0.05 && Math.abs(tp[0]) < p.w * 0.5;
      const layer = over ? (r() < 0.22 ? 1 : 0) : r() < 0.6 ? 1 : tl;

      E.push({
        t: "rose",
        id: nid(),
        x: tp[0],
        y: tp[1],
        R,
        rot: (r() - 0.5) * 1.2,
        ph1: r() * 6.28,
        ph2: r() * 6.28,
        turns: 1.8 + r() * 1.0,
        layer,
        d0: td,
      });

      if (r() < 0.25) {
        const oo = ta + (r() < 0.5 ? 1 : -1) * 1.3;
        E.push({
          t: "rose",
          id: nid(),
          x: tp[0] + Math.cos(oo) * R * 1.35,
          y: tp[1] + Math.sin(oo) * R * 1.35,
          R: R * (0.65 + r() * 0.25),
          rot: (r() - 0.5) * 1.4,
          ph1: r() * 6.28,
          ph2: r() * 6.28,
          turns: 1.8 + r(),
          layer,
          d0: td + 120,
        });
      }
    } else if (tip === "leaf") {
      E.push({
        t: "leaf",
        id: nid(),
        x: tp[0],
        y: tp[1],
        a: ta + (r() - 0.5) * 0.35,
        L: 0.16 + r() * 0.14,
        bend: (r() - 0.5) * 0.6,
        layer: tl,
        d0: td,
      });
    }

    if (!o.depth && r() < 0.32) {
      const u = 0.35 + r() * 0.35;
      const [q, a] = this.at(P, u);
      this.grow(r, E, nid, p, {
        base: q,
        dir: a + (r() < 0.5 ? -1 : 1) * (0.7 + r() * 0.4),
        len: (o.len || 0.8) * (0.35 + r() * 0.2),
        d0: o.d0 + dur * u,
        depth: 1,
        layer0: this.layerAt(segs, u),
      });
    }
    return P;
  }

  gen(l) {
    const r = this.rng(
      (l.ws ^ Math.imul(l.wi + 1, 2654435761)) + Math.floor(this.rand() * 1e6),
    );
    const p = this.wordParams(l.ws);
    const E = [];
    let k0 = 0;
    const nid = () => l.id * 100 + k0++;
    const w = this.mw(l.ch);
    const inX = () => (r() - 0.5) * w * 0.7;
    p.w = w;

    const nUp = 1 + (r() < 0.6 ? 1 : 0);
    for (let i = 0; i < nUp; i++) {
      this.grow(r, E, nid, p, {
        base: [inX(), -r() * 0.3],
        dir: -Math.PI / 2 + p.lean * 0.4 + (r() - 0.5) * 0.6,
        len: 0.6 + r() * 0.45,
        d0: 40 + i * 120,
        tip: i === 0 ? "rose" : null,
      });
    }

    if (r() < 0.4 * p.dens) {
      this.grow(r, E, nid, p, {
        base: [inX(), -0.1 - r() * 0.35],
        dir: Math.PI / 2 + (r() - 0.5) * 0.8,
        len: 0.35 + r() * 0.35,
        d0: 160,
      });
    }

    // Continuous Living Botanical Bridge connecting across letters
    if (l.prev) {
      const centerDist = this.mw(" ") + (this.mw(l.prev.ch) + w) / 2;
      const px = -centerDist;

      // Right edge of previous letter
      const a = [
        px + (0.15 + r() * 0.15) * this.mw(l.prev.ch),
        -0.22 - r() * 0.25,
      ];
      // Left edge of current letter
      const b = [(-0.15 + r() * 0.2) * w, -0.22 - r() * 0.25];

      const dx = b[0] - a[0];
      const sway = (l.wi % 2 === 1 ? -1 : 1) * (0.22 + r() * 0.18);

      const p1 = [a[0] + dx * 0.28, a[1] + sway];
      const p2 = [a[0] + dx * 0.72, b[1] - sway * 0.5];

      // Full, unbroken Bezier path connecting the letters
      const P = this.bez(a, p1, p2, b, 48);
      const bridgeDur = Math.max(380, dx * 340);
      const segs = this.weave(r, 0);

      // Curved bramble thorns along bridge
      const thorns = [];
      const nt = 4 + Math.floor(r() * 3);
      for (let i = 0; i < nt; i++) {
        thorns.push({
          u: 0.12 + (i / nt) * 0.76 + (r() - 0.5) * 0.05,
          s: i % 2 === 0 ? 1 : -1,
          size: 0.8 + r() * 0.4,
          curve: 0.35 + r() * 0.3,
        });
      }

      E.push({
        t: "stem",
        id: nid(),
        pts: P,
        segs,
        d0: 40,
        dur: bridgeDur,
        w: 0.95,
        thorns,
      });

      // Mid-bridge features
      const midU = 0.5;
      const [midPt, midAng] = this.at(P, midU);

      if (l.wi === 1) {
        // Gap between A and C
        // Mid-bridge dark rose
        E.push({
          t: "rose",
          id: nid(),
          x: midPt[0],
          y: midPt[1],
          R: 0.16 * p.big,
          rot: -0.2 + (r() - 0.5) * 0.6,
          ph1: r() * 6.28,
          ph2: r() * 6.28,
          turns: 2.0,
          layer: 1,
          d0: 160,
        });

        // Gothic leaf sprig pointing upwards above the rose
        E.push({
          t: "leaf",
          id: nid(),
          x: midPt[0] + 0.04,
          y: midPt[1] - 0.15,
          a: -Math.PI / 2 + 0.18,
          L: 0.22,
          bend: 0.1,
          layer: 0,
          d0: 190,
        });
      } else {
        // Gap between C and C
        E.push({
          t: "leaf",
          id: nid(),
          x: midPt[0],
          y: midPt[1],
          a: midAng + 0.85,
          L: 0.18,
          bend: (r() - 0.5) * 0.6,
          layer: this.layerAt(segs, midU),
          d0: 150,
        });
      }
    }

    if (l.wi === 0) {
      this.grow(r, E, nid, p, {
        base: [-w * 0.25, -0.22 - r() * 0.25],
        dir: Math.PI + 0.15 + (r() - 0.5) * 0.4,
        len: 0.6 + r() * 0.25,
        d0: 90,
        tip: "leaf",
      });
    }

    l.els = E;
    l.endEls = null;
    const T = [];
    const tr = this.rng(l.id * 977 + Math.floor(this.rand() * 1e6));
    this.grow(tr, T, () => l.id * 100 + 90 + T.length, p, {
      base: [w * 0.25, -0.15 - tr() * 0.35],
      dir: (tr() - 0.5) * 1.2,
      len: 0.5 + tr() * 0.25,
      d0: 0,
      tip: "shoot",
      depth: 1,
    });
    l.tend = T.filter((e) => e.t === "stem").slice(0, 1);
  }

  genEnd(l, rel) {
    const r = this.rng(l.ws + l.wi * 31 + Math.floor(this.rand() * 1e6));
    const p = this.wordParams(l.ws);
    const E = [];
    let k0 = 50;
    const nid = () => l.id * 100 + k0++;
    const w = this.mw(l.ch);
    const n = 1 + Math.floor(r() * 2.5);
    p.w = w;
    for (let i = 0; i < n; i++) {
      const dir =
        -Math.PI / 2 + 0.6 + (i - (n - 1) / 2) * 0.9 + (r() - 0.5) * 0.4;
      this.grow(r, E, nid, p, {
        base: [(r() - 0.2) * w * 0.6, -r() * 0.5],
        dir,
        len: 0.4 + r() * 0.45,
        d0: rel + 40 + i * 90,
        depth: 1,
        tip: i === 0 || r() < 0.6 ? "rose" : "shoot",
      });
    }
    l.endEls = E;
  }

  add(ch, now = performance.now()) {
    const A = this.letters.filter((l) => !l.dead);
    const last = A[A.length - 1];

    if (ch === " ") {
      if (last && last.ch !== " ") {
        last.cut = now;
        this.genEnd(last, now - last.birth);
      }
      this.letters.push({ ch: " ", id: this.uid++, birth: now, els: [] });
      this.layout(true);
      return;
    }

    // Connect to previous non-space letter across the gap
    const prevLetter = A.filter((x) => x.ch !== " ").pop() || null;
    const wordIndex = prevLetter ? prevLetter.wi + 1 : 0;
    const wordSeed = prevLetter ? prevLetter.ws : Math.floor(this.rand() * 1e9);

    const l = {
      ch,
      id: this.uid++,
      birth: now,
      tb: now,
      ws: wordSeed,
      wi: wordIndex,
      prev: prevLetter,
    };
    this.gen(l);
    this.letters.push(l);
    this.layout(true);
  }

  // --- Section Branches & Botanical Growth Pipeline ---
  sampleBezierSegments(segments, stepPx = 6) {
    if (!segments || !segments.length) return [];
    // 1. Dense sampling of bezier curves
    const dense = [];
    segments.forEach((seg, sIdx) => {
      const steps = 32;
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
    if (dense.length < 2) return dense;

    // 2. Arc length parameterization
    const dists = [0];
    for (let i = 1; i < dense.length; i++) {
      const d = Math.hypot(
        dense[i][0] - dense[i - 1][0],
        dense[i][1] - dense[i - 1][1],
      );
      dists.push(dists[i - 1] + d);
    }
    const totalDist = dists[dists.length - 1];
    if (totalDist < 1) return dense;

    // 3. Resample strictly equidistant points
    const numPoints = Math.max(12, Math.round(totalDist / stepPx));
    const pts = [dense[0]];
    let denseIdx = 0;
    for (let i = 1; i < numPoints; i++) {
      const targetD = (i / numPoints) * totalDist;
      while (denseIdx < dists.length - 2 && dists[denseIdx + 1] < targetD) {
        denseIdx++;
      }
      const segD = dists[denseIdx + 1] - dists[denseIdx];
      const frac = segD > 0.0001 ? (targetD - dists[denseIdx]) / segD : 0;
      pts.push([
        dense[denseIdx][0] +
          (dense[denseIdx + 1][0] - dense[denseIdx][0]) * frac,
        dense[denseIdx][1] +
          (dense[denseIdx + 1][1] - dense[denseIdx][1]) * frac,
      ]);
    }
    pts.push(dense[dense.length - 1]);
    return pts;
  }

  getEdgeBranchConfig(edge) {
    const id = edge.id;

    // 1. Top Section Vines from ACC Monogram (Open: Red, Women's: White, Inter-Club: Black)
    if (id === "section-0") {
      return {
        id,
        color: "red",
        isLetterAnchored: true,
        letterIdx: 0,
        stemWidth: 1.05,
        elements: [
          { t: "leaf", u: 0.2, side: -1, L: 26, bend: 0.15 },
          {
            t: "rose",
            u: 0.35,
            side: -1,
            R: 21,
            id: 9101,
            color: "red",
            rot: -0.2,
          },
          { t: "leaf", u: 0.37, side: 1, L: 24, bend: -0.1 },
          { t: "leaf", u: 0.52, side: -1, L: 26, bend: 0.2 },
          {
            t: "rose",
            u: 0.68,
            side: 1,
            R: 23,
            id: 9102,
            color: "red",
            rot: 0.25,
          },
          { t: "leaf", u: 0.7, side: 1, L: 25, bend: -0.15 },
          { t: "leaf", u: 0.84, side: -1, L: 26, bend: 0.1 },
          // Terminal crown cluster at Open Section header arrival
          { t: "leaf", u: 0.94, side: -1, L: 27, bend: 0.25 },
          { t: "leaf", u: 0.95, side: 1, L: 27, bend: -0.25 },
          {
            t: "rose",
            u: 0.96,
            side: -1,
            R: 20,
            id: 9104,
            color: "red",
            rot: -0.35,
          },
          {
            t: "rose",
            u: 0.98,
            side: 0,
            R: 27,
            id: 9103,
            color: "red",
            rot: 0.1,
          },
        ],
      };
    }
    if (id === "section-1") {
      return {
        id,
        color: "white",
        isLetterAnchored: true,
        letterIdx: 1,
        stemWidth: 1.05,
        elements: [
          { t: "leaf", u: 0.19, side: 1, L: 26, bend: -0.15 },
          {
            t: "rose",
            u: 0.34,
            side: 1,
            R: 21,
            id: 9201,
            color: "white",
            rot: 0.2,
          },
          { t: "leaf", u: 0.36, side: -1, L: 24, bend: 0.1 },
          { t: "leaf", u: 0.51, side: 1, L: 26, bend: -0.2 },
          {
            t: "rose",
            u: 0.67,
            side: -1,
            R: 23,
            id: 9202,
            color: "white",
            rot: -0.25,
          },
          { t: "leaf", u: 0.69, side: -1, L: 25, bend: 0.15 },
          { t: "leaf", u: 0.83, side: 1, L: 26, bend: -0.1 },
          // Terminal crown cluster at Women's Section header arrival
          { t: "leaf", u: 0.94, side: -1, L: 27, bend: 0.25 },
          { t: "leaf", u: 0.95, side: 1, L: 27, bend: -0.25 },
          {
            t: "rose",
            u: 0.96,
            side: 1,
            R: 21,
            id: 9204,
            color: "white",
            rot: 0.35,
          },
          {
            t: "rose",
            u: 0.98,
            side: 0,
            R: 27,
            id: 9203,
            color: "white",
            rot: -0.1,
          },
        ],
      };
    }
    if (id === "section-2") {
      return {
        id,
        color: "black",
        isLetterAnchored: true,
        letterIdx: 2,
        stemWidth: 1.05,
        elements: [
          { t: "leaf", u: 0.19, side: -1, L: 26, bend: 0.15 },
          {
            t: "rose",
            u: 0.34,
            side: 1,
            R: 22,
            id: 9301,
            color: "black",
            rot: 0.2,
          },
          { t: "leaf", u: 0.36, side: -1, L: 24, bend: -0.1 },
          { t: "leaf", u: 0.51, side: 1, L: 26, bend: 0.2 },
          {
            t: "rose",
            u: 0.67,
            side: -1,
            R: 23,
            id: 9302,
            color: "black",
            rot: -0.25,
          },
          { t: "leaf", u: 0.69, side: 1, L: 25, bend: -0.15 },
          { t: "leaf", u: 0.83, side: -1, L: 26, bend: 0.1 },
          // Terminal crown cluster at Inter-Club Section header arrival
          { t: "leaf", u: 0.94, side: -1, L: 27, bend: 0.25 },
          { t: "leaf", u: 0.95, side: 1, L: 27, bend: -0.25 },
          {
            t: "rose",
            u: 0.96,
            side: 1,
            R: 21,
            id: 9304,
            color: "black",
            rot: 0.35,
          },
          {
            t: "rose",
            u: 0.98,
            side: 0,
            R: 27,
            id: 9303,
            color: "black",
            rot: 0.1,
          },
        ],
      };
    }

    // 2. Open and Different Rating Brackets (STEM ONLY with sparse thorns, NO roses/leaves)
    if (id.startsWith("tier-")) {
      return {
        id,
        color: "stem",
        isLetterAnchored: false,
        stemWidth: 0.95,
        elements: [],
      };
    }

    // 3. Convergence paths once brackets are crossed (Airy combination of all roses - strictly restrained)
    if (id === "merge-0") {
      return {
        id,
        color: "mixed",
        isLetterAnchored: false,
        stemWidth: 1.05,
        elements: [
          { t: "leaf", u: 0.3, side: -1, L: 22, bend: 0.15 },
          {
            t: "rose",
            u: 0.5,
            side: 1,
            R: 21,
            id: 9401,
            color: "red",
            rot: 0.2,
          },
          { t: "leaf", u: 0.68, side: -1, L: 22, bend: -0.15 },
        ],
      };
    }
    if (id === "merge-1") {
      return {
        id,
        color: "mixed",
        isLetterAnchored: false,
        stemWidth: 1.05,
        elements: [
          { t: "leaf", u: 0.3, side: 1, L: 22, bend: -0.15 },
          {
            t: "rose",
            u: 0.5,
            side: -1,
            R: 21,
            id: 9411,
            color: "white",
            rot: -0.2,
          },
          { t: "leaf", u: 0.68, side: 1, L: 22, bend: 0.15 },
        ],
      };
    }
    if (id === "merge-2") {
      return {
        id,
        color: "mixed",
        isLetterAnchored: false,
        stemWidth: 1.05,
        elements: [
          { t: "leaf", u: 0.3, side: 1, L: 22, bend: -0.15 },
          {
            t: "rose",
            u: 0.5,
            side: -1,
            R: 21,
            id: 9421,
            color: "black",
            rot: -0.2,
          },
          { t: "leaf", u: 0.68, side: -1, L: 22, bend: 0.15 },
        ],
      };
    }
    if (id.startsWith("merge-")) {
      return {
        id,
        color: "mixed",
        isLetterAnchored: false,
        stemWidth: 1.05,
        elements: [
          { t: "leaf", u: 0.35, side: 1, L: 22, bend: 0.15 },
          {
            t: "rose",
            u: 0.55,
            side: -1,
            R: 21,
            id: 9451,
            color: "red",
            rot: 0.2,
          },
        ],
      };
    }

    // 4. Converge to Prizes Header (Delicate, elegant triad crown right above PRIZES)
    if (id === "prizes-stem") {
      return {
        id,
        color: "mixed",
        isLetterAnchored: false,
        stemWidth: 1.15,
        elements: [
          { t: "leaf", u: 0.38, side: -1, L: 23, bend: 0.15 },
          // Delicate triad arrival crown above Prizes heading (Red, White, and Black)
          { t: "leaf", u: 0.91, side: -1, L: 25, bend: 0.25 },
          { t: "leaf", u: 0.93, side: 1, L: 25, bend: -0.25 },
          {
            t: "rose",
            u: 0.95,
            side: -1,
            R: 21,
            id: 9501,
            color: "red",
            rot: -0.25,
          },
          {
            t: "rose",
            u: 0.97,
            side: 1,
            R: 21,
            id: 9502,
            color: "white",
            rot: 0.25,
          },
        ],
      };
    }

    // 5. Short trunk from Prizes to podium fork
    if (id === "podium-stem") {
      return {
        id,
        color: "stem",
        isLetterAnchored: false,
        stemWidth: 1.1,
        elements: [],
      };
    }

    // 6. Branching according to color roses for prizes: First is Red, White, and Black
    if (id === "prize-0") {
      return {
        id,
        color: "red",
        isLetterAnchored: false,
        stemWidth: 1.05,
        elements: [
          { t: "leaf", u: 0.32, side: -1, L: 23, bend: 0.15 },
          {
            t: "rose",
            u: 0.56,
            side: 1,
            R: 21,
            id: 9601,
            color: "red",
            rot: 0.2,
          },
          { t: "leaf", u: 0.74, side: -1, L: 23, bend: -0.15 },
          // Terminal crown on 1st Place card
          { t: "leaf", u: 0.93, side: -1, L: 25, bend: 0.25 },
          { t: "leaf", u: 0.95, side: 1, L: 25, bend: -0.25 },
          {
            t: "rose",
            u: 0.97,
            side: 0,
            R: 26,
            id: 9602,
            color: "red",
            rot: 0.1,
          },
        ],
      };
    }
    if (id === "prize-1") {
      return {
        id,
        color: "white",
        isLetterAnchored: false,
        stemWidth: 1.05,
        elements: [
          { t: "leaf", u: 0.32, side: 1, L: 23, bend: -0.15 },
          {
            t: "rose",
            u: 0.56,
            side: -1,
            R: 21,
            id: 9701,
            color: "white",
            rot: -0.2,
          },
          { t: "leaf", u: 0.74, side: 1, L: 23, bend: 0.15 },
          // Terminal crown on 2nd Place card
          { t: "leaf", u: 0.93, side: -1, L: 25, bend: 0.25 },
          { t: "leaf", u: 0.95, side: 1, L: 25, bend: -0.25 },
          {
            t: "rose",
            u: 0.97,
            side: 0,
            R: 26,
            id: 9702,
            color: "white",
            rot: -0.1,
          },
        ],
      };
    }
    if (id === "prize-2") {
      return {
        id,
        color: "black",
        isLetterAnchored: false,
        stemWidth: 1.05,
        elements: [
          { t: "leaf", u: 0.28, side: -1, L: 23, bend: 0.15 },
          {
            t: "rose",
            u: 0.5,
            side: -1,
            R: 22,
            id: 9801,
            color: "black",
            rot: 0.15,
          },
          { t: "leaf", u: 0.72, side: 1, L: 23, bend: -0.15 },
          // Terminal crown on 3rd Place card
          { t: "leaf", u: 0.93, side: -1, L: 24, bend: 0.25 },
          { t: "leaf", u: 0.95, side: 1, L: 24, bend: -0.25 },
          {
            t: "rose",
            u: 0.97,
            side: 0,
            R: 25,
            id: 9802,
            color: "black",
            rot: 0.1,
          },
        ],
      };
    }

    // Default fallback (e.g. root-stem, root-prizes)
    return {
      id,
      color: "stem",
      isLetterAnchored: false,
      stemWidth: 1.0,
      elements: [],
    };
  }

  buildBranches(geometry) {
    if (!geometry?.edges) return;

    const nextBranches = [];
    const activeLetters = this.letters.filter((l) => l.ch !== " " && !l.dead);

    geometry.edges.forEach((edge, idx) => {
      if (!edge || !edge.segments) return;

      const cfg = this.getEdgeBranchConfig(edge);
      const pts = this.sampleBezierSegments(edge.segments, 6);
      if (pts.length < 2) return;

      // Physically anchor top section stems directly to their corresponding letter in the ACC title
      if (
        cfg.isLetterAnchored &&
        activeLetters[cfg.letterIdx] &&
        activeLetters[cfg.letterIdx].x != null
      ) {
        const ltr = activeLetters[cfg.letterIdx];
        const targetX =
          cfg.letterIdx === 0
            ? ltr.x - 10
            : cfg.letterIdx === 2
              ? ltr.x + 10
              : ltr.x;
        const targetY = ltr.y - 2;
        const dx = targetX - pts[0][0];
        const dy = targetY - pts[0][1];
        const blendN = Math.min(pts.length, 20);
        for (let k = 0; k < blendN; k++) {
          const weight = Math.pow(1 - k / blendN, 2);
          pts[k][0] += dx * weight;
          pts[k][1] += dy * weight;
        }
      }

      let totalLen = 0;
      for (let k = 1; k < pts.length; k++) {
        totalLen += Math.hypot(
          pts[k][0] - pts[k - 1][0],
          pts[k][1] - pts[k - 1][1],
        );
      }
      // Natural sparse thorn spacing: roughly 1 thorn every 125px, max 6 per stem
      const thornCount = Math.min(6, Math.floor(totalLen / 125));
      const thorns = [];
      for (let i = 0; i < thornCount; i++) {
        const u = thornCount === 1 ? 0.5 : 0.22 + (i / (thornCount - 1)) * 0.58;
        thorns.push({
          u,
          s: (i + idx) % 2 === 0 ? 1 : -1,
          size: 0.72,
          curve: 0.3,
        });
      }

      const stem = {
        t: "stem",
        id: 9001 + idx * 73,
        absolute: true,
        pts,
        segs: [{ u0: 0, u1: 1, layer: 0 }],
        thorns,
        w: cfg.stemWidth || 1.05,
      };

      const elements = cfg.elements.map((def) => {
        const [pt, ang] = this.at(pts, def.u);
        const nAng = ang + (def.side > 0 ? Math.PI / 2 : -Math.PI / 2);
        let x = pt[0],
          y = pt[1],
          a = ang;
        if (def.t === "leaf") {
          x = pt[0] + Math.cos(nAng) * 4;
          y = pt[1] + Math.sin(nAng) * 4;
          a = ang + (def.side > 0 ? 0.72 : -0.72);
        } else if (def.t === "rose") {
          const lat = def.side === 0 ? 0 : 13;
          x = def.side === 0 ? pt[0] : pt[0] + Math.cos(nAng) * lat;
          y = def.side === 0 ? pt[1] : pt[1] + Math.sin(nAng) * lat;
        }
        return {
          ...def,
          x,
          y,
          a,
          absolute: true,
          bloomedAt: null,
          bloomScale: 0,
        };
      });

      const existing = this.branches.find((b) => b.id === cfg.id);
      const fr = existing ? existing.fr : 0;
      const targetFr = existing ? existing.targetFr : 0;

      nextBranches.push({
        id: cfg.id,
        stem,
        elements,
        fr,
        targetFr,
        color: cfg.color,
      });
    });

    this.branches = nextBranches;
  }

  setBranchProgress(id, progress) {
    const b = this.branches.find((br) => br.id === id);
    if (b) {
      b.targetFr = Math.max(0, Math.min(1, progress));
      if (this.wakeUp) this.wakeUp();
    }
  }

  // --- Realistic Rendering Pipeline ---
  drawRealisticRose(ctx, cx, cy, R, rot, e, a, tl, C) {
    if (R <= 1) return;
    const bloomSpring =
      e.bloomScale != null ? e.bloomScale : this.spr(a / 800, 7, 14);
    if (bloomSpring <= 0.001) return;

    const effR = R * Math.min(1.05, bloomSpring);
    if (effR <= 1) return;
    const size = effR * 2.35;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot + (tl ? tl[0] * 0.16 : 0));

    // Fast hardware contact shadow (avoids heavy GPU Gaussian blur)
    ctx.beginPath();
    ctx.ellipse(0, size * 0.06, size * 0.44, size * 0.38, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 0, 0, 0.62)";
    ctx.fill();

    // Support e.color: "black", "white", "red_white", "red"
    let keys = ["red_rose", "red_rose_angle"];
    if (e.color === "black") {
      keys = ["black_rose", "black_rose_angle"];
    } else if (e.color === "white") {
      keys = ["white_rose", "white_rose_angle"];
    } else if (e.color === "red_white") {
      keys =
        Math.abs(e.id || 0) % 2 === 0
          ? ["white_rose", "white_rose_angle"]
          : ["red_rose", "red_rose_angle"];
    }
    const imgKey = keys[Math.abs(e.id || 0) % keys.length];
    let fallback = this.assets ? this.assets["red_rose"] : null;
    if (e.color === "black" && this.assets) {
      fallback =
        this.assets["black_rose"] ||
        this.assets["black_rose_angle"] ||
        fallback;
    } else if (e.color === "white" && this.assets) {
      fallback =
        this.assets["white_rose"] ||
        this.assets["white_rose_angle"] ||
        fallback;
    }
    const img = this.assets && (this.assets[imgKey] || fallback);

    if (img && img.complete && img.naturalWidth) {
      ctx.drawImage(img, -size / 2, -size / 2, size, size);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, effR, 0, Math.PI * 2);
      ctx.fillStyle = C?.flower || "#8a0212";
      ctx.fill();
    }

    ctx.restore();
  }

  drawThorn(ctx, P, u, s, S, C, stemWidth) {
    const [p, a] = this.at(P, u);
    const tx = Math.cos(a),
      ty = Math.sin(a);
    const nx = -ty * s,
      ny = tx * s;

    const sw = stemWidth || Math.max(2.4, S * 0.032);
    const rCane = Math.max(1.4, sw * 0.5 * (1 - 0.42 * u));

    const barkCenter = [p[0] + nx * (rCane * 0.76), p[1] + ny * (rCane * 0.76)];

    const baseL = Math.max(5.5, S * 0.054);
    const thornH = Math.max(7.2, S * 0.076);
    const hookBack = thornH * 0.42;

    const bFront = [
      barkCenter[0] + tx * (baseL * 0.48),
      barkCenter[1] + ty * (baseL * 0.48),
    ];
    const bBack = [
      barkCenter[0] - tx * (baseL * 0.52),
      barkCenter[1] - ty * (baseL * 0.52),
    ];

    const tip = [
      barkCenter[0] + nx * thornH - tx * hookBack,
      barkCenter[1] + ny * thornH - ty * hookBack,
    ];

    const ctrlDorsal = [
      barkCenter[0] + nx * (thornH * 0.74) + tx * (baseL * 0.12),
      barkCenter[1] + ny * (thornH * 0.74) + ty * (baseL * 0.12),
    ];

    const ctrlVentral = [
      barkCenter[0] + nx * (thornH * 0.22) - tx * (baseL * 0.28),
      barkCenter[1] + ny * (thornH * 0.22) - ty * (baseL * 0.28),
    ];

    ctx.save();
    // 1. Soft contact shadow under thorn
    ctx.beginPath();
    ctx.moveTo(bBack[0] + 0.8, bBack[1] + 1.4);
    ctx.quadraticCurveTo(
      ctrlVentral[0] + 0.8,
      ctrlVentral[1] + 1.4,
      tip[0] + 0.8,
      tip[1] + 1.4,
    );
    ctx.quadraticCurveTo(
      ctrlDorsal[0] + 0.8,
      ctrlDorsal[1] + 1.4,
      bFront[0] + 0.8,
      bFront[1] + 1.4,
    );
    ctx.closePath();
    ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
    ctx.fill();

    // 2. Thorn polygon & botanical gradient
    ctx.beginPath();
    ctx.moveTo(bBack[0], bBack[1]);
    ctx.quadraticCurveTo(ctrlVentral[0], ctrlVentral[1], tip[0], tip[1]);
    ctx.quadraticCurveTo(ctrlDorsal[0], ctrlDorsal[1], bFront[0], bFront[1]);
    ctx.closePath();

    const thornGrad = ctx.createLinearGradient(
      barkCenter[0],
      barkCenter[1],
      tip[0],
      tip[1],
    );
    thornGrad.addColorStop(0, "#241a15");
    thornGrad.addColorStop(0.25, "#3b1719");
    thornGrad.addColorStop(0.65, "#6a131e");
    thornGrad.addColorStop(0.9, "#b86252");
    thornGrad.addColorStop(1.0, "#faeae0");

    ctx.fillStyle = thornGrad;
    ctx.fill();

    // 3. Specular crest highlight
    ctx.beginPath();
    ctx.moveTo(bFront[0], bFront[1]);
    ctx.quadraticCurveTo(ctrlDorsal[0], ctrlDorsal[1], tip[0], tip[1]);
    ctx.strokeStyle = "rgba(255, 245, 235, 0.44)";
    ctx.lineWidth = Math.max(0.7, S * 0.0055);
    ctx.stroke();

    // 4. Ventral shadow
    ctx.beginPath();
    ctx.moveTo(tip[0], tip[1]);
    ctx.quadraticCurveTo(ctrlVentral[0], ctrlVentral[1], bBack[0], bBack[1]);
    ctx.strokeStyle = "rgba(10, 5, 5, 0.58)";
    ctx.lineWidth = Math.max(0.75, S * 0.006);
    ctx.stroke();
    ctx.restore();
  }

  // ONLY use gothic_leaves.png as requested by user
  drawLeaf(ctx, bx, by, a, L, bend, C) {
    if (L < 2.0) return;
    const lsz = L * 2.25;
    ctx.save();
    ctx.translate(bx, by);
    // Align thorny stem base along the vine tangent (approx -47 deg = -0.82 rad)
    ctx.rotate(a + 0.82 + (bend || 0) * 0.16);

    // Fast hardware contact shadow (avoids heavy GPU Gaussian blur)
    ctx.beginPath();
    ctx.ellipse(
      lsz * 0.35,
      -lsz * 0.38,
      lsz * 0.42,
      lsz * 0.3,
      0,
      0,
      Math.PI * 2,
    );
    ctx.fillStyle = "rgba(0, 0, 0, 0.52)";
    ctx.fill();

    const leafImg = this.assets && this.assets["gothic_leaves"];
    if (leafImg && leafImg.complete && leafImg.naturalWidth) {
      // gothic_leaves is 1315x1196. Stem base cut is at ~ (130, 1115), which is (0.099 * W, 0.932 * H)
      ctx.drawImage(leafImg, -lsz * 0.1, -lsz * 0.93, lsz * 1.1, lsz);
    } else {
      ctx.beginPath();
      ctx.ellipse(lsz * 0.35, 0, lsz * 0.45, lsz * 0.22, 0, 0, Math.PI * 2);
      ctx.fillStyle = C?.leaf || "#18241b";
      ctx.fill();
    }
    ctx.restore();
  }

  sampleSubpath(P, a, b, stemWidth, seedVar) {
    const n = P.length - 1;
    if (n < 1) return [];
    const distSeg = Math.max(10, Math.ceil((b - a) * n * 2.8));
    const pts = [];
    const lerp = (t) => {
      const i = Math.min(n - 1, Math.max(0, Math.floor(t)));
      const f = t - i;
      return [
        P[i][0] + (P[i + 1][0] - P[i][0]) * f,
        P[i][1] + (P[i + 1][1] - P[i][1]) * f,
      ];
    };

    const rBase = stemWidth * 0.5;
    for (let j = 0; j <= distSeg; j++) {
      const fr = j / distSeg;
      const u = a + fr * (b - a);
      const t = u * n;
      const p = lerp(t);

      const taper = 1.0 - 0.44 * u;
      const nodeSwell = 1.0 + 0.14 * Math.pow(Math.sin(u * Math.PI * 4), 2);
      const barkWobble = 1.0 + 0.04 * Math.sin(u * 36 + seedVar);
      const r = Math.max(1.15, rBase * taper * nodeSwell * barkWobble);

      pts.push({ p, u, r });
    }

    const m = pts.length;
    for (let i = 0; i < m; i++) {
      const prev = pts[Math.max(0, i - 1)].p;
      const next = pts[Math.min(m - 1, i + 1)].p;
      let dx = next[0] - prev[0];
      let dy = next[1] - prev[1];
      let d = Math.hypot(dx, dy);
      if (d < 0.0001) {
        dx = 1;
        dy = 0;
        d = 1;
      }
      pts[i].t = [dx / d, dy / d];
      pts[i].n = [-dy / d, dx / d];
    }
    return pts;
  }

  drawStem(ctx, e, l, age, kk, st, f, amp, layer, frO) {
    const S = e.absolute ? 115 : st.S;
    const fr = frO != null ? frO : this.eo((age - e.d0) / e.dur) * kk;
    if (fr <= 0) return;

    const P = e.absolute
      ? e.pts
      : e.pts.map((p) => this.wpt(st, l, l.x + p[0] * S, l.y + p[1] * S));
    const stemWidth = Math.max(2.6, S * 0.034 * (e.w || 1));
    const seedVar = ((e.id || 1) * 37) % 100;
    const segs = e.segs || [{ u0: 0, u1: 1, layer: 0 }];

    for (const sg of segs) {
      if (sg.layer !== layer) continue;
      const b = Math.min(sg.u1, fr);
      if (b <= sg.u0) continue;

      const pts = this.sampleSubpath(P, sg.u0, b, stemWidth, seedVar);
      const m = pts.length;
      if (m < 2) continue;

      // 1. Soft contact shadow
      ctx.save();
      ctx.beginPath();
      const sOffX = 1.0,
        sOffY = 2.2;
      ctx.moveTo(
        pts[0].p[0] - pts[0].n[0] * pts[0].r + sOffX,
        pts[0].p[1] - pts[0].n[1] * pts[0].r + sOffY,
      );
      for (let i = 1; i < m; i++) {
        ctx.lineTo(
          pts[i].p[0] - pts[i].n[0] * pts[i].r + sOffX,
          pts[i].p[1] - pts[i].n[1] * pts[i].r + sOffY,
        );
      }
      for (let i = m - 1; i >= 0; i--) {
        ctx.lineTo(
          pts[i].p[0] + pts[i].n[0] * pts[i].r + sOffX,
          pts[i].p[1] + pts[i].n[1] * pts[i].r + sOffY,
        );
      }
      ctx.closePath();
      ctx.fillStyle = "rgba(0, 0, 0, 0.42)";
      ctx.fill();
      ctx.restore();

      // 2. Base bark contour
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(
        pts[0].p[0] - pts[0].n[0] * pts[0].r,
        pts[0].p[1] - pts[0].n[1] * pts[0].r,
      );
      for (let i = 1; i < m; i++) {
        ctx.lineTo(
          pts[i].p[0] - pts[i].n[0] * pts[i].r,
          pts[i].p[1] - pts[i].n[1] * pts[i].r,
        );
      }
      for (let i = m - 1; i >= 0; i--) {
        ctx.lineTo(
          pts[i].p[0] + pts[i].n[0] * pts[i].r,
          pts[i].p[1] + pts[i].n[1] * pts[i].r,
        );
      }
      ctx.closePath();
      ctx.fillStyle = "#1c1410";
      ctx.fill();

      // 3. Core wood body
      ctx.beginPath();
      ctx.moveTo(
        pts[0].p[0] + pts[0].n[0] * (pts[0].r * 0.1),
        pts[0].p[1] + pts[0].n[1] * (pts[0].r * 0.1),
      );
      for (let i = 1; i < m; i++) {
        ctx.lineTo(
          pts[i].p[0] + pts[i].n[0] * (pts[0].r * 0.1),
          pts[i].p[1] + pts[i].n[1] * (pts[0].r * 0.1),
        );
      }
      ctx.strokeStyle = st.C?.stem || "#302622";
      ctx.lineWidth = stemWidth * 0.76;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      // 4. Living chlorophyll layer
      ctx.beginPath();
      ctx.moveTo(
        pts[0].p[0] + pts[0].n[0] * (pts[0].r * 0.22),
        pts[0].p[1] + pts[0].n[1] * (pts[0].r * 0.22),
      );
      for (let i = 1; i < m; i++) {
        ctx.lineTo(
          pts[i].p[0] + pts[i].n[0] * (pts[0].r * 0.22),
          pts[i].p[1] + pts[i].n[1] * (pts[0].r * 0.22),
        );
      }
      ctx.strokeStyle = "rgba(42, 54, 32, 0.35)";
      ctx.lineWidth = stemWidth * 0.44;
      ctx.stroke();

      // 5. Bark fibers
      const fibers = [
        { k: -0.62, col: "rgba(10, 6, 4, 0.65)", w: 0.85, freq: 48, ph: 0 },
        { k: -0.22, col: "rgba(28, 18, 14, 0.48)", w: 0.7, freq: 56, ph: 1.4 },
        { k: +0.22, col: "rgba(115, 96, 80, 0.42)", w: 0.8, freq: 44, ph: 2.8 },
        {
          k: +0.6,
          col: "rgba(180, 160, 138, 0.26)",
          w: 0.65,
          freq: 64,
          ph: 4.2,
        },
      ];
      for (const fib of fibers) {
        ctx.beginPath();
        for (let i = 0; i < m; i++) {
          const pt = pts[i];
          const ripple =
            Math.sin(pt.u * fib.freq + seedVar + fib.ph) * (pt.r * 0.06);
          const fx = pt.p[0] + pt.n[0] * (pt.r * fib.k + ripple);
          const fy = pt.p[1] + pt.n[1] * (pt.r * fib.k + ripple);
          if (i === 0) ctx.moveTo(fx, fy);
          else ctx.lineTo(fx, fy);
        }
        ctx.strokeStyle = fib.col;
        ctx.lineWidth = Math.max(0.6, fib.w);
        ctx.lineCap = "round";
        ctx.stroke();
      }

      // 6. Highlight sheen
      ctx.beginPath();
      for (let i = 0; i < m; i++) {
        const pt = pts[i];
        const hx = pt.p[0] + pt.n[0] * (pt.r * 0.38);
        const hy = pt.p[1] + pt.n[1] * (pt.r * 0.38);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.strokeStyle = "rgba(240, 228, 214, 0.22)";
      ctx.lineWidth = Math.max(0.7, stemWidth * 0.22);
      ctx.lineCap = "round";
      ctx.stroke();

      ctx.restore();
    }

    // Menacing thorns
    for (const th of e.thorns || []) {
      if (fr > th.u && this.layerAt(segs, th.u) === layer) {
        this.drawThorn(ctx, P, th.u, th.s, S, st.C, stemWidth);
      }
    }
  }

  // --- Mouse following & interaction ---
  wpt(st, l, x, y) {
    if (st.face && l.lean) {
      const hh = Math.min(2.5, Math.max(0, (l.y - y) / st.S));
      const f = hh * hh * 0.5 + hh * 0.5;
      x += l.lean[0] * st.S * 0.1 * f;
      y += l.lean[1] * st.S * 0.05 * f;
    }
    return [x, y];
  }

  faceTurn(e, x, y) {
    let wx = 0,
      wy = 0;
    if (this.mx != null) {
      const dx = this.mx - x,
        dy = this.my - y;
      const d = Math.hypot(dx, dy);
      const reach = 360;
      if (d < reach && d > 0.001) {
        const w = 1 - d / reach;
        const s = w * w * (3 - 2 * w) * Math.min(1, d / 40);
        wx = (dx / d) * s;
        wy = (dy / d) * s;
      }
    }
    const c = this.fa[e.id] || [0, 0];
    c[0] += (wx - c[0]) * 0.1;
    c[1] += (wy - c[1]) * 0.1;
    this.fa[e.id] = c;
    return c;
  }

  drawEl(ctx, e, l, age, kk, st, f, amp) {
    const S = st.S;
    const j = this.jit(e.id, f, amp);
    const wx = (x, y) =>
      this.wpt(st, l, l.x + x * S + j[0], l.y + y * S + j[1]);

    if (e.t === "leaf") {
      const sc = this.spr((age - e.d0) / 1000, 7, 15) * kk;
      if (sc <= 0) return;
      const p = wx(e.x, e.y);
      this.drawLeaf(ctx, p[0], p[1], e.a + j[2], e.L * S * sc, e.bend, st.C);
    } else if (e.t === "rose") {
      const a = age - e.d0;
      if (a < 0 || kk <= 0.001) return;
      const p = wx(e.x, e.y);
      const tl = st.face ? this.faceTurn(e, p[0], p[1]) : null;
      if (st.face && !l.dead && a > 700) {
        this.perch.push({ id: e.id, x: p[0], y: p[1], R: e.R * S * kk });
      }
      this.drawRealisticRose(
        ctx,
        p[0],
        p[1],
        e.R * S * kk,
        e.rot + j[2] + (tl ? tl[0] * 0.22 : 0),
        e,
        a,
        tl,
        st.C,
      );
    }
  }

  // --- Main Render Pipeline ---
  render(ctx, now, viewTop, viewBottom) {
    const S = this.Sd || this.St || 135;
    const L = this.letters;
    const act = L.filter((l) => !l.dead);
    const pal = PALETTE;
    this._now = now;

    let isAnimating = false;

    // Smoothly spring / converge letter positions to their true centered layout targets
    const dt = Math.min(48, now - (this.lt || now));
    this.lt = now;
    const k = 1 - Math.exp(-dt / 60);
    for (const l of L) {
      if (!l.dead && l.tx != null) {
        if (l.x == null) {
          l.x = l.tx;
          l.y = l.ty;
        } else {
          const dx = l.tx - l.x;
          const dy = l.ty - l.y;
          if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
            l.x += dx * k;
            l.y += dy * k;
            isAnimating = true;
          } else {
            l.x = l.tx;
            l.y = l.ty;
          }
        }
      }
    }

    const st = {
      S,
      letters: L,
      C: pal,
      face: true,
      recoil: 0,
      wither: 260,
    };

    // Interactive mouse lean
    if (st.face) {
      for (const l of L) {
        let tx = 0,
          ty = 0;
        if (!l.dead && l.ch !== " " && this.mx != null) {
          const dx = this.mx - l.x,
            dy = this.my - (l.y - S * 0.6);
          const d = Math.hypot(dx, dy);
          const reach = Math.max(260, S * 3.2);
          if (d < reach && d > 1) {
            const w = 1 - d / reach;
            const s = w * w * (3 - 2 * w);
            tx = (dx / d) * s;
            ty = (dy / d) * s;
          }
        }
        const c = l.lean || (l.lean = [0, 0]);
        const dLeanX = tx - c[0];
        const dLeanY = ty - c[1];
        if (Math.abs(dLeanX) > 0.005 || Math.abs(dLeanY) > 0.005) {
          c[0] += dLeanX * 0.07;
          c[1] += dLeanY * 0.07;
          isAnimating = true;
        }
      }
    }

    // Viewport Culling on Monogram Typography: only draw if near viewport!
    const monoVisible =
      viewTop == null ||
      (this.centerY >= viewTop - 350 && this.centerY <= viewBottom + 350);

    if (monoVisible) {
      const kd = (l) => (l.dead ? 1 - this.eo((now - l.dead) / st.wither) : 1);

      const drawLayer = (layer) => {
        for (const l of L) {
          if (l.ch === " " || !l.els || now < l.birth) continue;
          const age = now - l.birth;
          if (age < 850) isAnimating = true;
          const kk = kd(l);
          const each = (e) => {
            if (e.t === "stem") {
              this.drawStem(ctx, e, l, age, kk, st, 0, 0, layer);
            } else if (e.layer === layer) {
              this.drawEl(ctx, e, l, age, kk, st, 0, 0);
            }
          };
          l.els.forEach(each);
          if (l.endEls) l.endEls.forEach(each);

          const i = act.indexOf(l);
          const nx = i >= 0 ? act[i + 1] : null;
          if (l.tend && (l.dead || !nx || nx.ch === " ")) {
            let fr = this.eo((now - l.tb - 150) / 450);
            if (l.cut != null) {
              fr *=
                1 -
                this.eo((now - l.cut) / 150) *
                  Math.min(0.85, (st.recoil || 20) / (0.6 * S));
            }
            for (const e of l.tend) {
              this.drawStem(ctx, e, l, age, kk, st, 0, 0, layer, fr * kk);
            }
          }
        }
      };

      // Layer 0: Stems, leaves, roses BEHIND letters
      drawLayer(0);

      // Draw Typography: Playfair Display Bold
      ctx.save();
      ctx.font = `700 ${S}px ${this.F}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = pal.text;

      for (const l of L) {
        if (l.ch !== " " && !l.dead && now >= l.birth) {
          const textAge = now - l.birth;
          if (textAge < 400) isAnimating = true;
          const textAlpha = Math.min(1, textAge / 250);
          ctx.save();
          ctx.globalAlpha = textAlpha;
          const p = this.wpt(st, l, l.x, l.y);
          ctx.fillText(l.ch, p[0], p[1]);
          ctx.restore();
        }
      }
      ctx.restore();

      // Layer 1: Stems, leaves, roses IN FRONT of letters (weaving)
      drawLayer(1);
    }

    // Living Botanical Branches to Sections (with Viewport Culling)
    const branchesAnimating = this.drawBranches(
      ctx,
      now,
      st,
      viewTop,
      viewBottom,
    );
    if (branchesAnimating) isAnimating = true;

    return isAnimating;
  }

  drawBranches(ctx, now, st, viewTop, viewBottom) {
    if (!this.branches || !this.branches.length) return false;

    let isAnimating = false;

    for (const b of this.branches) {
      // Smooth lerp progress towards targetFr
      const diff = b.targetFr - b.fr;
      if (Math.abs(diff) > 0.0005) {
        b.fr += diff * 0.16;
        isAnimating = true;
      } else {
        b.fr = b.targetFr;
      }

      if (b.fr <= 0.001) continue;

      // Cache bounding Y range of branch for zero-allocation culling
      if (b.minY == null) {
        let minY = Infinity,
          maxY = -Infinity;
        for (const pt of b.stem.pts) {
          if (pt[1] < minY) minY = pt[1];
          if (pt[1] > maxY) maxY = pt[1];
        }
        b.minY = minY - 50;
        b.maxY = maxY + 50;
      }

      // Viewport Culling: Skip rendering if completely offscreen!
      if (viewTop != null && (b.maxY < viewTop || b.minY > viewBottom)) {
        continue;
      }

      // 1. Draw living cane with thorns
      this.drawStem(ctx, b.stem, null, 0, 1, st, 0, 0, 0, b.fr);

      // 2. Draw gothic leaves first
      for (const el of b.elements) {
        if (el.t !== "leaf") continue;
        if (b.fr < el.u - 0.02) {
          el.bloomedAt = null;
          el.bloomScale = 0;
          continue;
        }
        if (!el.bloomedAt) {
          el.bloomedAt = now;
          isAnimating = true;
        }
        const age = now - el.bloomedAt;
        if (age < 750) isAnimating = true;
        const spring = this.spr(Math.min(1.2, age / 650), 7, 14);
        const scrubGate = Math.min(1, (b.fr - el.u) / 0.04);
        el.bloomScale = spring * scrubGate;
        if (el.bloomScale <= 0.005) continue;

        this.drawLeaf(
          ctx,
          el.x,
          el.y,
          el.a,
          el.L * el.bloomScale,
          el.bend,
          st.C,
        );
      }

      // 3. Draw realistic roses second (sitting over leaves and stem)
      for (const el of b.elements) {
        if (el.t !== "rose") continue;
        if (b.fr < el.u - 0.02) {
          el.bloomedAt = null;
          el.bloomScale = 0;
          continue;
        }
        if (!el.bloomedAt) {
          el.bloomedAt = now;
          isAnimating = true;
        }
        const age = now - el.bloomedAt;
        if (age < 750) isAnimating = true;
        const spring = this.spr(Math.min(1.2, age / 650), 7, 14);
        const scrubGate = Math.min(1, (b.fr - el.u) / 0.04);
        el.bloomScale = spring * scrubGate;
        if (el.bloomScale <= 0.005) continue;

        const tl = st.face ? this.faceTurn(el, el.x, el.y) : null;
        this.drawRealisticRose(
          ctx,
          el.x,
          el.y,
          el.R,
          el.rot + (tl ? tl[0] * 0.22 : 0),
          el,
          age,
          tl,
          st.C,
        );
      }
    }

    return isAnimating;
  }
}

// =========================================================================
// REACT COMPONENT INTEGRATION
// =========================================================================

export default function RoseTreeCanvas({ geometry, data, canvasRef }) {
  const localCanvasRef = useRef(null);
  const engineRef = useRef(null);

  // 1. Initialize Engine & Mouse Interaction
  useEffect(() => {
    const canvas = localCanvasRef.current;
    if (!canvas) return;

    let engine = engineRef.current;
    if (!engine) {
      engine = new TypeGardenEngine(canvas);
      engineRef.current = engine;
    }

    const handlePointerMove = (e) => {
      const c = localCanvasRef.current;
      const eng = engineRef.current;
      if (!c || !eng) return;
      const rect = c.getBoundingClientRect();
      eng.mx = e.clientX - rect.left;
      eng.my = e.clientY - rect.top;
      if (eng.wakeUp) eng.wakeUp();
    };

    const handlePointerLeave = () => {
      const eng = engineRef.current;
      if (eng) {
        eng.mx = null;
        eng.my = null;
        if (eng.wakeUp) eng.wakeUp();
      }
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    document.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [geometry]);

  // 2. Initialize and trigger centered blooming for: "A", " ", "C", " ", "C"
  useEffect(() => {
    const canvasContainer = canvasRef?.current;
    const canvas = localCanvasRef.current;
    if (!canvasContainer || !canvas || !geometry) return;

    let started = false;
    const startTyping = () => {
      const engine = engineRef.current;
      if (!engine || started) return;
      started = true;
      engine.started = true;

      // Ensure exact horizontal centering relative to geometry width
      engine.W = geometry.width;
      engine.H = 450;
      engine.centerX = geometry.width / 2;

      // Align vertical center with the DOM root monogram
      const rootNode = canvasContainer.querySelector("[data-tree-node='root']");
      const monogramEl = rootNode?.querySelector("p:nth-child(2)");
      if (rootNode && monogramEl) {
        const canvasBounds = canvas.getBoundingClientRect();
        const mgBounds = monogramEl.getBoundingClientRect();
        engine.centerY =
          mgBounds.top - canvasBounds.top + mgBounds.height * 0.72;
      } else {
        engine.centerY = 220;
      }

      // Clear previous letters
      engine.letters = [];

      // Staggered blooming for A C C while maintaining permanent, perfect horizontal centering
      const baseNow = performance.now();
      const sequence = ["A", " ", "C", " ", "C"];
      sequence.forEach((ch, idx) => {
        engine.add(ch, baseNow + idx * 300);
      });
      engine.layout(true);
      engine.buildBranches(geometry);
      if (engine.wakeUp) engine.wakeUp();
    };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: canvasContainer,
        start: "top 85%",
        onEnter: () => startTyping(),
      });
    }, canvasContainer);

    // If canvasContainer is already in viewport on mount, start immediately!
    const rect = canvasContainer.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
      startTyping();
    }

    return () => ctx.revert();
  }, [geometry, canvasRef]);

  // 3. Branches Growth via ScrollTrigger across the full hierarchy
  useEffect(() => {
    const canvasContainer = canvasRef?.current;
    const engine = engineRef.current;
    if (!canvasContainer || !geometry || !geometry.edges || !engine) return;

    engine.buildBranches(geometry);

    const ctx = gsap.context(() => {
      geometry.edges.forEach((edge) => {
        const startY = Math.round(Math.min(edge.from, edge.to));
        const endY = Math.round(Math.max(edge.from, edge.to, startY + 60));

        const trigger = ScrollTrigger.create({
          trigger: canvasContainer,
          start: `top+=${startY} 85%`,
          end: `top+=${endY} 65%`,
          scrub: 0.35,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            engine.setBranchProgress(edge.id, self.progress);
          },
        });

        // Synchronize initial progress if already scrolled into view
        engine.setBranchProgress(edge.id, trigger.progress);
        const branch = engine.branches.find((b) => b.id === edge.id);
        if (branch && trigger.progress > 0 && branch.fr === 0) {
          branch.fr = trigger.progress;
        }
      });
    }, canvasContainer);

    return () => ctx.revert();
  }, [geometry, canvasRef]);

  // 4. Main Render Loop
  useEffect(() => {
    const canvas = localCanvasRef.current;
    if (!canvas || !geometry) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId;
    let running = true;
    let isLooping = false;
    let idleFrames = 0;

    const render = () => {
      if (!running) return;
      const now = performance.now();
      const engine = engineRef.current;
      // Cap DPR to 1.5 to prevent massive 30-40 megapixel backbuffers on high-DPI displays
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);

      const width = geometry.width;
      const height = geometry.height;
      if (
        canvas.width !== Math.round(width * dpr) ||
        canvas.height !== Math.round(height * dpr)
      ) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
      }
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      let isAnimating = false;

      // --- Always ensure engine remains dead-centered on resize and renders ---
      if (
        engine &&
        (engine.started || (engine.branches && engine.branches.length > 0))
      ) {
        if (!engine.branches || !engine.branches.length) {
          engine.buildBranches(geometry);
        }
        const targetCenterX = width / 2;
        if (
          engine.W !== width ||
          Math.abs(engine.centerX - targetCenterX) > 0.5
        ) {
          engine.W = width;
          engine.centerX = targetCenterX;
          engine.layout(true);
        }

        // Viewport bounds relative to canvas coordinates (with generous 250px margin)
        const rect = canvas.getBoundingClientRect();
        const viewTop = -rect.top - 250;
        const viewBottom = -rect.top + window.innerHeight + 250;

        try {
          isAnimating = engine.render(ctx, now, viewTop, viewBottom);
        } catch (err) {
          console.error("Error in engine.render:", err);
        }
      }

      ctx.restore();

      // Idle pause: if nothing is actively animating, count idle frames then pause loop
      if (!isAnimating) {
        idleFrames++;
        if (idleFrames > 15) {
          isLooping = false;
          return;
        }
      } else {
        idleFrames = 0;
      }

      animId = requestAnimationFrame(render);
    };

    const wakeUp = () => {
      idleFrames = 0;
      if (!isLooping && running) {
        isLooping = true;
        animId = requestAnimationFrame(render);
      }
    };

    const engine = engineRef.current;
    if (engine) engine.wakeUp = wakeUp;

    isLooping = true;
    animId = requestAnimationFrame(render);

    window.addEventListener("scroll", wakeUp, { passive: true });
    window.addEventListener("resize", wakeUp, { passive: true });

    return () => {
      running = false;
      cancelAnimationFrame(animId);
      window.removeEventListener("scroll", wakeUp);
      window.removeEventListener("resize", wakeUp);
      if (engineRef.current && engineRef.current.wakeUp === wakeUp) {
        engineRef.current.wakeUp = null;
      }
    };
  }, [geometry]);

  if (!geometry) return null;

  return (
    <canvas
      ref={localCanvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: `${geometry.width}px`,
        height: `${geometry.height}px`,
        pointerEvents: "none",
        zIndex: 2,
      }}
      aria-hidden="true"
    />
  );
}
