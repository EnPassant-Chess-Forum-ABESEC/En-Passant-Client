export default function EcosystemSection() {
  const cards = [
    {
      notation: "E4",
      title: "COMPETE",
      items: ["Weekly tournaments", "Campus leagues", "Intercollege events", "Arena nights"],
      // 3 cols x 2 rows: Col 1-3, Row 2-3
      position: "top-[12.5vw] left-0",
    },
    {
      notation: "D5",
      title: "LEARN",
      items: ["Workshops", "Game reviews", "Opening theory", "Masterclasses"],
      // 3 cols x 2 rows: Col 5-7, Row 3-4
      position: "top-[25vw] left-[50vw]",
    },
    {
      notation: "C6",
      title: "CONNECT",
      items: ["Community", "Club nights", "Casual games", "Collaborations"],
      // 3 cols x 2 rows: Col 2-4, Row 5-6
      position: "top-[50vw] left-[12.5vw]",
    },
    {
      notation: "F7",
      title: "LEAD",
      items: ["Organize events", "Build projects", "Design media", "Grow the club"],
      // 3 cols x 2 rows: Col 5-7, Row 6-7
      position: "top-[62.5vw] left-[50vw]",
    },
  ];

  return (
    <section className="relative w-full bg-[#0a0a0a] overflow-hidden font-sans">
      <div className="relative w-full h-[100vw]">

        {/* ─── Faint Chess Board Grid Background ─── */}
        <div
          className="absolute inset-0 z-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #ffffff 1px, transparent 1px),
              linear-gradient(to bottom, #ffffff 1px, transparent 1px)
            `,
            backgroundSize: "12.5vw 12.5vw",
          }}
        ></div>

        {/* Grid Coordinates — Columns (A–H) */}
        <div className="absolute top-0 w-full flex text-white/20 text-[10px] font-mono pt-2 z-0">
          {["A", "B", "C", "D", "E", "F", "G", "H"].map((col) => (
            <div key={col} className="w-[12.5vw] text-center">
              {col}
            </div>
          ))}
        </div>

        {/* Grid Coordinates — Rows (1–8) */}
        <div className="absolute top-0 h-full flex flex-col text-white/20 text-[10px] font-mono pl-2 z-0">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
            <div key={row} className="h-[12.5vw] flex items-center">
              {row}
            </div>
          ))}
        </div>

        {/* ─── Header: THE CLUB IN ACTION ─── */}
        <div className="absolute top-[2vw] right-[2vw] z-30 text-right pointer-events-none">
          <h2 className="flex flex-col uppercase font-black leading-[0.8] tracking-tighter">
            <span className="text-white text-[6vw] md:text-[80px]">THE CLUB</span>
            <span className="text-white text-[6vw] md:text-[80px]">
              IN <span className="text-[#9b1a1a]">ACTION</span>
            </span>
          </h2>
        </div>

        {/* ─── Subtext (top-left, like the reference) ─── */}
        <div className="absolute top-[2vw] left-[2vw] z-30 max-w-[180px] md:max-w-[250px] text-[9px] md:text-xs text-white/40 uppercase tracking-widest leading-relaxed pointer-events-none">
          <p>Building the</p>
          <p>foundation <span className="text-white/80 font-bold">for</span></p>
          <p>scalable</p>
          <p className="text-white/80 font-bold">growth</p>
        </div>

        {/* ─── Cards (3 columns x 2 rows each: 37.5vw x 25vw) ─── */}
        {cards.map((card) => (
          <div
            key={card.notation}
            className={`absolute ${card.position} z-20 w-[37.5vw] h-[25vw] p-[2vw] flex flex-col justify-between bg-[#0a0a0a]/90 border border-white/5 pointer-events-auto`}
          >
            {/* Corner Brackets */}
            <div className="absolute top-0 left-0 w-[1.5vw] h-[1.5vw] border-t border-l border-white/30"></div>
            <div className="absolute top-0 right-0 w-[1.5vw] h-[1.5vw] border-t border-r border-white/30"></div>
            <div className="absolute bottom-0 left-0 w-[1.5vw] h-[1.5vw] border-b border-l border-white/30"></div>
            <div className="absolute bottom-0 right-0 w-[1.5vw] h-[1.5vw] border-b border-r border-white/30"></div>

            <div className="flex justify-between items-start">
              <h3 className="text-white text-[1.6vw] font-bold uppercase tracking-[0.15em] pt-[0.5vw]">
                {card.title}
              </h3>
              <span className="text-[#9b1a1a] text-[5vw] font-black leading-none tracking-tighter">
                {card.notation}
              </span>
            </div>

            <ul className="space-y-[0.5vw] mb-[0.5vw]">
              {card.items.map((item) => (
                <li
                  key={item}
                  className="text-white/70 text-[1.1vw] flex items-center gap-[0.5vw]"
                >
                  <span className="text-white/30">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
