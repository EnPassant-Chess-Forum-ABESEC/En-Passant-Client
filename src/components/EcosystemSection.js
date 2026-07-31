import SpotlightCard from "./SpotlightCard";

export default function EcosystemSection() {
  const cards = [
    {
      notation: "A1",
      title: "COMPETE",
      items: [
        "Weekly tournaments",
        "Campus leagues",
        "Intercollege events",
        "Arena nights",
      ],
      position: "top-[12vw] left-[2vw]",
    },
    {
      notation: "B2",
      title: "LEARN",
      items: ["Workshops", "Game reviews", "Opening theory", "Masterclasses"],
      position: "top-[24vw] left-[50vw]",
    },
    {
      notation: "C3",
      title: "CONNECT",
      items: ["Community", "Club nights", "Casual games", "Collaborations"],
      position: "top-[60vw] left-[14vw]",
    },
    {
      notation: "D4",
      title: "LEAD",
      items: [
        "Organize events",
        "Build projects",
        "Design media",
        "Grow the club",
      ],
      position: "top-[72vw] left-[62vw]",
    },
  ];

  return (
    <section className="relative w-full bg-[#050505] overflow-hidden font-sans">
      {/* Dark Marble Texture Background */}
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'url("/dark_marble_bg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <div className="absolute inset-0 z-0 bg-black/40 pointer-events-none"></div>

      {/* Top Fade — blends seamlessly from NumbersSection */}
      <div className="absolute top-0 left-0 w-full h-[30vw] bg-gradient-to-b from-[#050505] via-[#050505]/60 to-transparent z-10 pointer-events-none"></div>

      <div className="relative w-full h-[104vw]">
        {/* ─── Faint Chess Board Grid Background ─── */}
        <div
          className="absolute inset-0 z-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #ffffff 1px, transparent 1px),
              linear-gradient(to bottom, #ffffff 1px, transparent 1px)
            `,
            backgroundSize: "12vw 12vw",
            backgroundPosition: "2vw 0",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
            maskImage:
              "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
          }}
        ></div>

        {/* Grid Coordinates — Columns (A–H) */}
        <div className="absolute top-0 w-full px-[2vw] flex text-white/20 text-[10px] font-mono pt-2 z-0">
          {["A", "B", "C", "D", "E", "F", "G", "H"].map((col) => (
            <div key={col} className="w-[12vw] text-center">
              {col}
            </div>
          ))}
        </div>

        {/* Thin Left Gutter */}
        <div className="absolute top-0 left-0 h-full flex flex-col text-[#555555] text-[9px] font-mono pr-2 z-0">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
            <div
              key={row}
              className="h-[12vw] w-[2vw] flex justify-end items-center"
            >
              {row}
            </div>
          ))}
        </div>

        {/* Thin Right Gutter */}
        <div className="absolute top-0 right-0 h-full flex flex-col text-[#555555] text-[9px] font-mono pl-2 z-0">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
            <div
              key={row}
              className="h-[12vw] w-[2vw] flex justify-start items-center"
            >
              {row}
            </div>
          ))}
        </div>

        {/* ─── Header: THE CLUB IN ACTION ─── */}
        <div className="absolute top-[2vw] right-[4vw] z-30 text-right pointer-events-none leading-[0.85]">
          <h2 className="flex flex-col uppercase font-black leading-[0.8] tracking-tighter">
            <span className="text-white text-[7vw] bg-gradient-to-b from-white via-white/70 to-white/30 bg-clip-text text-transparent">
              THE CLUB
            </span>
            <span className="text-[7vw]">
              IN <span className="text-[#9b1a1a]">ACTION</span>
            </span>
          </h2>
        </div>

        {/* ─── Subtext (top-left, like the reference) ─── */}
        <div className="absolute top-[2vw] left-[2vw] z-30 max-w-[180px] md:max-w-[250px] text-[9px] md:text-xs text-white/40 uppercase tracking-widest leading-relaxed pointer-events-none">
          <p>Building the</p>
          <p>
            foundation <span className="text-white/80 font-bold">for</span>
          </p>
          <p>scalable</p>
          <p className="text-white/80 font-bold">growth</p>
        </div>

        {/* ─── Cards (snapped to 12vw grid) ─── */}
        {cards.map((card) => (
          <SpotlightCard
            key={card.notation}
            spotlightColor="rgba(155, 26, 26, 0.35)"
            className={`absolute ${card.position} z-20 w-[36vw] h-[24vw] p-[2vw] flex flex-col justify-between bg-[#000000] border border-white/10 pointer-events-auto`}
          >
            {/* Notation label — large, bold, red, top-right */}
            <div className="flex justify-between items-start">
              <h3 className="text-white text-[1.8vw] font-bold uppercase tracking-[0.2em] pt-[0.5vw] bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
                {card.title}
              </h3>
              <span className="text-[#9b1a1a] text-[5vw] font-black leading-none tracking-tighter">
                {card.notation}
              </span>
            </div>

            <ul className="space-y-[0.6vw] mb-[0.5vw]">
              {card.items.map((item) => (
                <li
                  key={item}
                  className="text-white/60 text-[1.1vw] flex items-center gap-[0.5vw]"
                >
                  <span className="text-white/30">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </SpotlightCard>
        ))}
        {/* Bottom Fade — sits in the 8vw gap below D4 (96vw–104vw) */}
        <div className="absolute bottom-0 left-0 w-full h-[10vw] bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-30 pointer-events-none" />
      </div>
    </section>
  );
}
