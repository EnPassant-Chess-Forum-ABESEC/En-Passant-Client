import Image from "next/image";

/* ─── Grid square colours ──────────────────────────────────────── */
const dark  = { backgroundColor: "#0a0a0a" };
const light = { background: "linear-gradient(145deg,#e8e8e8 0%,#c0c0c0 100%)" };

function D() { return <div className="aspect-square" style={dark} />; }
function W() { return <div className="aspect-square" style={light} />; }

function Phase({ tag, label, title, body }) {
  return (
    <div
      className="aspect-square flex flex-col justify-between p-4 md:p-7"
      style={{ ...dark, border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex justify-between items-start">
        <span className="text-gray-500 font-bold uppercase tracking-widest"
          style={{ fontSize: "clamp(7px,0.9vw,11px)" }}>
          {tag}
        </span>
        <span className="text-white font-black"
          style={{ fontSize: "clamp(1rem,2.2vw,2rem)" }}>
          {label}
        </span>
      </div>
      <div>
        <h3 className="text-white font-bold uppercase tracking-widest mb-1"
          style={{ fontSize: "clamp(8px,0.9vw,12px)" }}>
          {title}
        </h3>
        <p className="text-gray-500 leading-relaxed"
          style={{ fontSize: "clamp(7px,0.85vw,11px)" }}>
          {body}
        </p>
      </div>
    </div>
  );
}

export default function WorkingProcessSection() {
  return (
    <section className="relative w-full font-sans" style={{ backgroundColor: "#0a0a0a" }}>

      {/*
        ════════════════════════════════════════════
        TOP BAND  — same height as one grid row (25vw)
        Title sits in top-right corner, large, flush to edge
        ════════════════════════════════════════════
      */}
      <div className="relative w-full" style={{ height: "25vw" }}>
        <div
          className="absolute top-0 right-0 flex flex-col items-end justify-start"
          style={{ paddingTop: "1.5vw", paddingRight: "2vw", zIndex: 30 }}
        >
          <h2
            className="text-white font-black uppercase text-right leading-none tracking-tight"
            style={{ fontSize: "clamp(2rem, 5.5vw, 6.5rem)", lineHeight: 0.88 }}
          >
            OUR WORKING
            <br />
            <span style={{ color: "var(--brand-crimson)" }}>PROCESS</span>
          </h2>
        </div>
      </div>

      {/*
        ════════════════════════════════════════════
        CHESSBOARD GRID — 4 cols × 6 rows
        Each cell = aspect-square (25vw × 25vw)

        Row 1:  B  |  W  |  B  |  W        ← row y: 25vw–50vw
        Row 2:  W  | E1  |  W  |  B        ← row y: 50vw–75vw
        Row 3:  B  |  W  | F2  |  W        ← row y: 75vw–100vw
        Row 4:  W  | E3  |  W  |  B        ← row y: 100vw–125vw
        Row 5: D4  |  W  | F5  |  W        ← row y: 125vw–150vw
        Row 6:  W  | CTA |  W  |  B        ← row y: 150vw–175vw
        ════════════════════════════════════════════
      */}
      <div className="relative grid grid-cols-4 w-full">

        {/* Row 1 */}
        <D /><W /><D /><W />

        {/* Row 2 */}
        <W />
        <Phase tag="[ PHASE 1 ]" label="E1" title="INTRO & ALIGNMENT"
          body="We connect to clarify your goals, challenges and KPIs. Clear expectations from the start." />
        <W /><D />

        {/* Row 3 */}
        <D /><W />
        <Phase tag="[ PHASE 2 ]" label="F2" title="AUDIT & INSIGHTS"
          body="We analyze your product, positioning and current performance. We identify key growth opportunities." />
        <W />

        {/* Row 4 */}
        <W />
        <Phase tag="[ PHASE 3 ]" label="E3" title="STRATEGY DEVELOPMENT"
          body="We build a structured roadmap with defined channels, funnel logic and KPIs." />
        <W /><D />

        {/* Row 5 */}
        <Phase tag="[ PHASE 4 ]" label="D4" title="LAUNCH & ACTIVATION"
          body="We connect to clarify your goals, challenges and KPIs. Clear expectations from the start." />
        <W />
        <Phase tag="[ PHASE 5 ]" label="F5" title="OPTIMIZATION & SCALING"
          body="We test, optimize and scale high-performing channels. Performance becomes predictable." />
        <W />

        {/* Row 6 */}
        <W />
        <div className="aspect-square flex flex-col justify-center items-center text-center p-4 cursor-pointer"
          style={{ backgroundColor: "var(--brand-crimson)" }}>
          <span className="text-white font-bold uppercase"
            style={{ fontSize: "clamp(0.5rem,1.1vw,0.9rem)", letterSpacing: "0.12em", lineHeight: 1.4 }}>
            BOOK A STRATEGY CALL
          </span>
        </div>
        <W /><D />

        {/*
          Gradient fade — covers top ~1.5 rows of grid so it emerges
          smoothly from the dark top band, no hard line visible
        */}
        <div
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{
            height: "42vw",
            background: "linear-gradient(to bottom, #0a0a0a 0%, rgba(10,10,10,0.75) 40%, transparent 100%)",
            zIndex: 10,
          }}
        />
      </div>

      {/*
        ════════════════════════════════════════════
        OVERLAY IMAGES
        All absolute relative to <section>

        COORDINATE SYSTEM:
          x: left edge = 0, right edge = 100vw
          y: top of section = 0
             grid starts at y = 25vw (after top band)
             row n starts at y = 25vw + (n-1)*25vw

        HAND  — col 1–2, top-band + row 1
                x: 0 → 52vw,  y: 0 → 68vw

        QUEEN — col 4, rows 1–3
                centre of col 4 = 87.5vw
                x: 68vw → 100vw (right:-0), y: 10vw → 90vw
                slight clockwise tilt matching the reference photo

        KING  — col 2–3 border, rows 5–6 (bottom)
                centre between col 2 start (25vw) & col 3 end (75vw) = 50vw
                x: 25vw → 62vw, y: (175vw - 55vw) → 175vw = bottom of section
        ════════════════════════════════════════════
      */}

      {/* HAND */}
      <div className="absolute pointer-events-none"
        style={{ top: 0, left: 0, width: "52vw", height: "68vw", zIndex: 20 }}>
        <Image src="/hand.png" alt="Hand" fill priority
          className="object-contain object-left-top" />
      </div>

      {/* QUEEN — col 4 (x: 75vw–100vw), rows 1-3 (y: 25vw–100vw)
          Slight clockwise rotation to match reference tilt            */}
      <div className="absolute pointer-events-none"
        style={{
          top: "12vw",
          right: "0",
          width: "28vw",
          height: "65vw",
          zIndex: 18,
          transform: "rotate(8deg)",
          transformOrigin: "center top",
        }}>
        <Image src="/queen.png" alt="Queen" fill
          className="object-contain object-right-top" />
      </div>

      {/* KING — between col 2 start (25vw) and col 3 midpoint (~62vw)
          Sits at the bottom of rows 5–6, peeking upward               */}
      <div className="absolute pointer-events-none"
        style={{
          bottom: 0,
          left: "28vw",
          width: "36vw",
          height: "52vw",
          zIndex: 20,
        }}>
        <Image src="/king.png" alt="King" fill
          className="object-contain object-bottom" />
      </div>

    </section>
  );
}
