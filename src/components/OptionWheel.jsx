import {
  useRef,
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
} from "react";

const DEFAULT_ITEMS = [
  "Ambient",
  "House",
  "Techno",
  "Jazz",
  "Lo-Fi",
  "Synthwave",
  "Trance",
  "Funk",
  "Disco",
  "Hip-Hop",
  "Chillwave",
  "Drum & Bass",
];

// Pure layout math, shared by the imperative rAF loop AND the very first
// render, so items never paint stacked on top of each other before JS runs.
function computeLayout(pos, cfg) {
  const n = cfg.count;
  const mirror = cfg.side === "right" ? -1 : 1;
  const tiltRad = (cfg.tilt * Math.PI) / 180;
  const R = tiltRad > 0.0005 ? cfg.rowH / tiltRad : 0;

  const layouts = [];
  for (let i = 0; i < n; i++) {
    let d = i - pos;
    if (cfg.loop && n > 1) {
      d = ((d % n) + n) % n;
      if (d > n / 2) d -= n;
    }
    const dist = Math.abs(d);
    let x = 0;
    let y = d * cfg.rowH;
    let rot = 0;
    if (R > 0) {
      const ang = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, d * tiltRad));
      y = R * Math.sin(ang);
      x = -mirror * R * (1 - Math.cos(ang)) * cfg.curve;
      rot = (mirror * ang * 180) / Math.PI;
    }
    const opacity = Math.max(cfg.minOpacity, 1 - dist * cfg.fade);
    const filter =
      cfg.blur > 0 ? `blur(${(dist * cfg.blur).toFixed(2)}px)` : "none";
    const p = Math.max(0, 1 - Math.min(dist, 1));
    layouts.push({
      transform: `translate(${Number(x || 0).toFixed(2)}px, ${Number(y || 0).toFixed(2)}px) translateY(-50%) rotate(${Number(rot || 0).toFixed(3)}deg)`,
      opacity: String(opacity),
      filter,
      p: p.toFixed(4),
    });
  }
  return layouts;
}

const OptionWheel = ({
  items = DEFAULT_ITEMS,
  defaultSelected = 3,
  onChange,
  textColor = "#a6a6a6",
  activeColor = "#ffffff",
  side = "left",
  fontSize = 3,
  spacing = 1.4,
  curve = 1,
  tilt = 6,
  blur = 2,
  fade = 0.25,
  minOpacity = 0.05,
  smoothing = 200,
  inset = 80,
  loop = false,
  draggable = true,
  soundUrl = "",
  soundVolume = 0.5,
  className = "",
}) => {
  const rootRef = useRef(null);
  const itemRefs = useRef([]);
  const posRef = useRef(defaultSelected);
  const targetRef = useRef(defaultSelected);
  const rafRef = useRef(null);
  const lastRef = useRef(0);
  const cfgRef = useRef({});
  const onChangeRef = useRef(onChange);
  const selectedRef = useRef(defaultSelected);
  const wheelTimerRef = useRef(null);
  const dragRef = useRef(null);
  const dragMovedRef = useRef(false);
  const audioRef = useRef(null);
  const audioUrlRef = useRef("");
  const lastTickRef = useRef(0);
  const [selectedIndex, setSelectedIndex] = useState(defaultSelected);
  const [isDragging, setIsDragging] = useState(false);

  const remPx = 16;

  onChangeRef.current = onChange;
  cfgRef.current = {
    count: items.length,
    items,
    rowH: Math.max(fontSize * spacing * remPx, 1),
    curve,
    tilt,
    blur,
    fade,
    minOpacity,
    side,
    loop,
    smoothing,
    draggable,
    soundUrl,
    soundVolume,
  };

  // Layout used for the very first paint, computed synchronously during
  // render (not in an effect), so items never flash stacked on top of
  // each other before the rAF loop has a chance to run.
  const initialLayout = useMemo(
    () => computeLayout(posRef.current, cfgRef.current),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Applies a layout snapshot to the live DOM nodes (used by both the rAF
  // loop and the imperative "jump to this position immediately" path).
  const paintLayout = useCallback((pos) => {
    const cfg = cfgRef.current;
    const layouts = computeLayout(pos, cfg);
    const els = itemRefs.current;
    for (let i = 0; i < layouts.length; i++) {
      const el = els[i];
      if (!el) continue;
      const l = layouts[i];
      el.style.transform = l.transform;
      el.style.opacity = l.opacity;
      el.style.filter = l.filter;
      el.style.setProperty("--ow-p", l.p);
    }
  }, []);

  // Single rAF loop that eases the wheel position toward its target with
  // frame-rate independent exponential smoothing, then lays every option out
  // along the curve based on its distance from the current position.
  const runFrame = useCallback(
    (now) => {
      const dt = Math.max(0.001, Math.min((now - lastRef.current) / 1000, 0.05));
      lastRef.current = now;
      const cfg = cfgRef.current;
      const tau = Math.max(cfg.smoothing, 1) / 1000;
      const k = 1 - Math.exp(-dt / tau);

      const target = Number(targetRef.current) || 0;
      const cur = Number(posRef.current) || 0;
      let next = cur + (target - cur) * k;
      if (Number.isNaN(next)) next = target;
      const settled = Math.abs(target - next) < 0.001;
      if (settled) next = target;
      posRef.current = next;

      paintLayout(next);

      rafRef.current = settled ? null : requestAnimationFrame(runFrame);
    },
    [paintLayout],
  );

  const startLoop = useCallback(() => {
    if (rafRef.current != null) return;
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(runFrame);
  }, [runFrame]);

  // Optional tick on selection change, throttled so fast scrolling can't spam
  // it, and with playback failures (e.g. autoplay policies) silently ignored.
  const playTick = useCallback(() => {
    const { soundUrl, soundVolume } = cfgRef.current;
    if (!soundUrl) return;
    const now = performance.now();
    if (now - lastTickRef.current < 70) return;
    lastTickRef.current = now;
    if (!audioRef.current || audioUrlRef.current !== soundUrl) {
      audioRef.current = new Audio(soundUrl);
      audioRef.current.preload = "auto";
      audioUrlRef.current = soundUrl;
    }
    const audio = audioRef.current;
    audio.volume = Math.min(Math.max(soundVolume, 0), 1);
    audio.currentTime = 0;
    audio.play()?.catch(() => {});
  }, []);

  const applyTarget = useCallback(
    (value, snap) => {
      const cfg = cfgRef.current;
      let v = Number(value);
      if (Number.isNaN(v)) v = 0;
      if (!cfg.loop) v = Math.min(Math.max(v, 0), Math.max(cfg.count - 1, 0));
      if (snap) v = Math.round(v);
      targetRef.current = v;
      const idx = ((Math.round(v) % cfg.count) + cfg.count) % cfg.count;
      if (idx !== selectedRef.current) {
        selectedRef.current = idx;
        setSelectedIndex(idx);
        onChangeRef.current?.(idx, cfg.items[idx]);
        playTick();
      }
      startLoop();
    },
    [startLoop, playTick],
  );

  // Wheel / touchpad scrolling, registered manually so it can be non-passive.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      const cfg = cfgRef.current;
      const delta = e.deltaMode === 1 ? e.deltaY * 24 : e.deltaY;
      // Cap each event at one step so notchy mouse wheels move exactly one
      // option per click, while touchpads still scroll continuously.
      const step = Math.max(-1, Math.min(1, delta / cfg.rowH));
      applyTarget(targetRef.current + step, false);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = setTimeout(
        () => applyTarget(targetRef.current, true),
        140,
      );
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    };
  }, [applyTarget]);

  const handlePointerDown = useCallback((e) => {
    if (!cfgRef.current.draggable) return;
    dragRef.current = {
      y: e.clientY,
      start: targetRef.current,
      id: e.pointerId,
    };
    dragMovedRef.current = false;
    setIsDragging(true);
  }, []);

  const handlePointerMove = useCallback(
    (e) => {
      const drag = dragRef.current;
      if (!drag) return;
      const dy = e.clientY - drag.y;
      if (!dragMovedRef.current && Math.abs(dy) > 4) {
        dragMovedRef.current = true;
        // Capture only once a real drag starts, so plain clicks still reach
        // the items and navigate to them.
        rootRef.current?.setPointerCapture(drag.id);
      }
      if (dragMovedRef.current)
        applyTarget(drag.start - dy / cfgRef.current.rowH, false);
    },
    [applyTarget],
  );

  const handlePointerEnd = useCallback(() => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setIsDragging(false);
    if (dragMovedRef.current) applyTarget(targetRef.current, true);
  }, [applyTarget]);

  const handleItemClick = useCallback(
    (index) => {
      if (dragMovedRef.current) return;
      const cfg = cfgRef.current;
      const cur = targetRef.current;
      let d = index - (((cur % cfg.count) + cfg.count) % cfg.count);
      if (cfg.loop && cfg.count > 1) {
        if (d > cfg.count / 2) d -= cfg.count;
        else if (d < -cfg.count / 2) d += cfg.count;
      }
      applyTarget(cur + d, true);
    },
    [applyTarget],
  );

  const handleKeyDown = useCallback(
    (e) => {
      let delta = null;
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") delta = -1;
      else if (e.key === "ArrowDown" || e.key === "ArrowRight") delta = 1;
      if (delta == null) return;
      e.preventDefault();
      applyTarget(Math.round(targetRef.current) + delta, true);
    },
    [applyTarget],
  );

  // useLayoutEffect (not useEffect) so the DOM is repositioned before the
  // browser paints whenever config props change — this is what prevents the
  // "everything stacked in the middle" flash from ever being visible.
  useLayoutEffect(() => {
    // Snap the DOM to the current position immediately (no easing) before
    // kicking off the animated loop, so there's never a blank/default frame.
    paintLayout(posRef.current);
    applyTarget(targetRef.current, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    items,
    fontSize,
    spacing,
    curve,
    tilt,
    blur,
    fade,
    minOpacity,
    side,
    loop,
    smoothing,
    applyTarget,
  ]);

  useEffect(
    () => {
      return () => {
        if (rafRef.current != null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
        audioRef.current?.pause();
      };
    },
    [],
  );

  return (
    <div
      ref={rootRef}
      role="listbox"
      tabIndex={0}
      aria-label="Option wheel"
      className={`relative h-full w-full select-none overflow-hidden outline-none [touch-action:none] ${isDragging ? "cursor-grabbing" : "cursor-grab"}${className ? ` ${className}` : ""}`}
      style={{
        "--ow-text-color": textColor,
        "--ow-active-color": activeColor,
        "--ow-font-size": `${fontSize}rem`,
        "--ow-inset": `${inset}px`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onKeyDown={handleKeyDown}
    >
      {items.map((label, index) => {
        const l = initialLayout[index];
        return (
          <div
            key={`${label}-${index}`}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            role="option"
            aria-selected={selectedIndex === index}
            className={`absolute top-1/2 cursor-pointer whitespace-nowrap leading-none will-change-[transform,opacity,filter] ${
              side === "right"
                ? "right-[var(--ow-inset)] origin-right"
                : "left-[var(--ow-inset)] origin-left"
            } ${selectedIndex === index ? "font-medium" : "font-extralight"}`}
            style={{
              fontSize: "var(--ow-font-size)",
              color:
                "color-mix(in srgb, var(--ow-active-color) calc(var(--ow-p, 0) * 100%), var(--ow-text-color))",
            }}
            onClick={() => handleItemClick(index)}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
};

export default OptionWheel;
