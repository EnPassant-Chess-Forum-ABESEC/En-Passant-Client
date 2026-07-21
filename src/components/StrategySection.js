import Image from "next/image";

export default function StrategySection() {
  return (
    <section className="relative w-full bg-[#0a0a0a] overflow-hidden font-sans">
      {/* ─── Image as the layout driver — never crops, scales to push black borders offscreen ─── */}
      <div className="relative w-full overflow-hidden">
        {/* The image sits in normal flow so its full aspect ratio determines the section height.
             scale(1.25) zooms it 25% larger, pushing any baked-in black borders off the edges.
             overflow-hidden on the parent clips the overflow so no scrollbar appears. */}
        <Image
          src="/image.png"
          alt="Think Before You Move"
          width={1920}
          height={1080}
          className="w-full h-auto block opacity-80"
          style={{ transform: "scale(1.25)", transformOrigin: "center top" }}
          priority
        />
        {/* Gradient overlay to fade the bottom */}
        <div className="absolute bottom-0 left-0 w-full h-[25%] bg-gradient-to-t from-[#0a0a0a] to-transparent z-10"></div>
      </div>

      {/* ─── Content Overlay ─── */}
      <div className="absolute inset-0 z-10 flex flex-col pt-[5vw] px-6 md:px-12 pointer-events-none">
        {/* ─── Header ─── */}
        <div className="flex flex-col uppercase font-black leading-[0.85] tracking-tighter z-20 w-max pointer-events-auto">
          <span className="text-white text-[12vw] md:text-[100px] xl:text-[130px]">
            THINK
          </span>
          <div className="flex gap-4">
            <span className="text-white text-[12vw] md:text-[100px] xl:text-[130px]">
              BEFORE
            </span>
            <span className="text-[#9b1a1a] text-[12vw] md:text-[100px] xl:text-[130px]">
              YOU
            </span>
          </div>
          <span className="text-[#9b1a1a] text-[12vw] md:text-[100px] xl:text-[130px]">
            MOVE
          </span>
        </div>

        {/* ─── Top Right Faint Text ─── */}
        <div className="absolute top-[5vw] right-6 md:right-12 text-right max-w-[300px] md:max-w-[400px] text-[10px] md:text-xs text-white/40 uppercase tracking-widest leading-relaxed hidden sm:block pointer-events-auto">
          <p>We don't act impulsively.</p>
          <p>
            We analyze, position and execute with{" "}
            <span className="text-white/80 font-bold">precision</span>.
          </p>
          <p>
            Every move is intentional. Every{" "}
            <span className="text-white/80 font-bold">decision</span> is
            measurable.
          </p>
        </div>

        {/* ─── Callouts ─── */}

        {/* Callout 1: Left */}
        <div className="absolute top-[45%] left-6 md:left-12 max-w-[200px] md:max-w-[280px] text-[10px] md:text-sm text-white/60 text-right pointer-events-auto">
          <div className="relative pr-4 py-2">
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/20"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/20"></div>

            <p>
              No random campaigns. Only{" "}
              <span className="text-white font-bold">structured action.</span>
              <br />
              <span className="text-white font-bold">Clear KPIs.</span>{" "}
              Transparent reporting.
              <br />
              Measurable impact
            </p>
          </div>
        </div>

        {/* Callout 2: Right Middle */}
        <div className="absolute top-[35%] right-6 md:right-12 max-w-[200px] md:max-w-[300px] text-[10px] md:text-sm text-white/60 text-left pointer-events-auto">
          <div className="relative pl-4 py-2">
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/20"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/20"></div>

            <p>
              We define your{" "}
              <span className="text-white font-bold">strongest market</span>{" "}
              position before launch. We build{" "}
              <span className="text-white font-bold">systems</span> that scale
              sustainably.
            </p>
          </div>
        </div>

        {/* Callout 3: Right Bottom */}
        <div className="absolute bottom-[20%] right-6 md:right-[20%] max-w-[200px] md:max-w-[250px] text-[10px] md:text-sm text-white/60 text-right pointer-events-auto">
          <div className="relative pr-4 py-2">
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/20"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/20"></div>

            <p>
              Because real <span className="text-white font-bold">growth</span>{" "}
              is built on structure — not luck
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
