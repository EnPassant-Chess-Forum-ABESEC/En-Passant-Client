const departments = [
  // Row 1-2, Col A-B (top-left)
  { name: "Content Creation",   top: "12vw", left: "2vw",   size: "24vw" },
  // Row 1-2, Col D-E (top-center)
  { name: "Social Media",       top: "0vw",  left: "38vw",  size: "24vw" },
  // Row 2-3, Col G-H (top-right)
  { name: "Events &\nTournaments", top: "12vw", right: "2vw",  size: "24vw" },
  // Row 4-5, Col B-C
  { name: "Design",             top: "36vw", left: "14vw",  size: "24vw" },
  // Row 4-5, Col F-G
  { name: "Photography",        top: "36vw", right: "14vw", size: "24vw" },
  // Row 6-7, Col A-B
  { name: "Web\nDevelopment",   top: "60vw", left: "2vw",   size: "24vw" },
  // Row 6-7, Col E-F
  { name: "Strategy &\nCoaching", top: "60vw", left: "50vw", size: "24vw" },
  // Row 7-8, Col C-D
  { name: "Finance",            top: "72vw", left: "26vw",  size: "24vw" },
];

export default function DepartmentsSection() {
  return (
    <section className="relative w-full bg-[#050505] font-sans border-none overflow-hidden">
      {/* Dark Marble Texture Background */}
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'url("/dark_marble_bg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 z-0 bg-black/50 pointer-events-none" />

      {/* Top Fade */}
      <div className="absolute top-0 left-0 w-full h-[30vw] bg-gradient-to-b from-[#050505] via-[#050505]/60 to-transparent z-10 pointer-events-none" />

      {/* 8×8 grid container — exactly 8 rows × 12vw = 96vw tall */}
      <div className="relative w-full h-[96vw]">

        {/* ─── Faint Chess Board Grid ─── */}
        <div
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
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
        />

        {/* Column Labels A–H */}
        <div className="absolute top-0 w-full px-[2vw] flex text-white/30 text-[10px] font-mono pt-2 z-0">
          {["A", "B", "C", "D", "E", "F", "G", "H"].map((col) => (
            <div key={col} className="w-[12vw] text-center">
              {col}
            </div>
          ))}
        </div>

        {/* Row Labels — Left Gutter */}
        <div className="absolute top-0 left-0 h-full flex flex-col text-[#555555] text-[9px] font-mono pr-2 z-0">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
            <div key={row} className="h-[12vw] w-[2vw] flex justify-end items-center">
              {row}
            </div>
          ))}
        </div>

        {/* Row Labels — Right Gutter */}
        <div className="absolute top-0 right-0 h-full flex flex-col text-[#555555] text-[9px] font-mono pl-2 z-0">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
            <div key={row} className="h-[12vw] w-[2vw] flex justify-start items-center">
              {row}
            </div>
          ))}
        </div>

        {/* Inner container for header + dept boxes */}
        <div className="relative w-full h-full max-w-screen-2xl mx-auto">

          {/* Section Header — top-right, same style as NumbersSection */}
          <div className="absolute top-[6vw] right-[5vw] z-30 text-right leading-[0.85]">
            <h2 className="flex flex-col uppercase font-black leading-[0.8] tracking-tighter">
              <span className="text-white text-[5vw] md:text-[64px]">
                FEATURED
              </span>
              <span className="text-[#9b1a1a] text-[7vw] md:text-[100px]">
                DEPARTMENTS
              </span>
            </h2>
          </div>

          {/* ─── Department Boxes — locked to the 12vw grid ─── */}

          {/* Row 1-2, Col A-B */}
          <div className="absolute top-[12vw] left-[2vw] bg-[#000000] border border-white/10 w-[24vw] h-[24vw] z-20 flex flex-col items-start justify-end p-[2.5vw]">
            <span className="text-[#9b1a1a] font-mono text-[1vw] tracking-widest uppercase mb-1 opacity-70">01</span>
            <span className="text-white font-black text-[2.8vw] tracking-tight uppercase leading-[0.9]">Content<br/>Creation</span>
          </div>

          {/* Row 1-2, Col D-E */}
          <div className="absolute top-[0vw] left-[38vw] bg-[#000000] border border-white/10 w-[24vw] h-[24vw] z-20 flex flex-col items-start justify-end p-[2.5vw]">
            <span className="text-[#9b1a1a] font-mono text-[1vw] tracking-widest uppercase mb-1 opacity-70">02</span>
            <span className="text-white font-black text-[2.8vw] tracking-tight uppercase leading-[0.9]">Social<br/>Media</span>
          </div>

          {/* Row 2-3, Col G-H */}
          <div className="absolute top-[12vw] right-[2vw] bg-[#000000] border border-white/10 w-[24vw] h-[24vw] z-20 flex flex-col items-start justify-end p-[2.5vw]">
            <span className="text-[#9b1a1a] font-mono text-[1vw] tracking-widest uppercase mb-1 opacity-70">03</span>
            <span className="text-white font-black text-[2.8vw] tracking-tight uppercase leading-[0.9]">Events &amp;<br/>Tournaments</span>
          </div>

          {/* Row 4-5, Col B-C */}
          <div className="absolute top-[36vw] left-[14vw] bg-[#000000] border border-white/10 w-[24vw] h-[24vw] z-20 flex flex-col items-start justify-end p-[2.5vw]">
            <span className="text-[#9b1a1a] font-mono text-[1vw] tracking-widest uppercase mb-1 opacity-70">04</span>
            <span className="text-white font-black text-[2.8vw] tracking-tight uppercase leading-[0.9]">Design</span>
          </div>

          {/* Row 4-5, Col F-G */}
          <div className="absolute top-[36vw] right-[14vw] bg-[#000000] border border-white/10 w-[24vw] h-[24vw] z-20 flex flex-col items-start justify-end p-[2.5vw]">
            <span className="text-[#9b1a1a] font-mono text-[1vw] tracking-widest uppercase mb-1 opacity-70">05</span>
            <span className="text-white font-black text-[2.8vw] tracking-tight uppercase leading-[0.9]">Photography</span>
          </div>

          {/* Row 6-7, Col A-B */}
          <div className="absolute top-[60vw] left-[2vw] bg-[#000000] border border-white/10 w-[24vw] h-[24vw] z-20 flex flex-col items-start justify-end p-[2.5vw]">
            <span className="text-[#9b1a1a] font-mono text-[1vw] tracking-widest uppercase mb-1 opacity-70">06</span>
            <span className="text-white font-black text-[2.8vw] tracking-tight uppercase leading-[0.9]">Web<br/>Development</span>
          </div>

          {/* Row 6-7, Col E-F */}
          <div className="absolute top-[60vw] left-[50vw] bg-[#000000] border border-white/10 w-[24vw] h-[24vw] z-20 flex flex-col items-start justify-end p-[2.5vw]">
            <span className="text-[#9b1a1a] font-mono text-[1vw] tracking-widest uppercase mb-1 opacity-70">07</span>
            <span className="text-white font-black text-[2.8vw] tracking-tight uppercase leading-[0.9]">Strategy &amp;<br/>Coaching</span>
          </div>

          {/* Row 7-8, Col C-D */}
          <div className="absolute top-[72vw] left-[26vw] bg-[#000000] border border-white/10 w-[24vw] h-[24vw] z-20 flex flex-col items-start justify-end p-[2.5vw]">
            <span className="text-[#9b1a1a] font-mono text-[1vw] tracking-widest uppercase mb-1 opacity-70">08</span>
            <span className="text-white font-black text-[2.8vw] tracking-tight uppercase leading-[0.9]">Finance</span>
          </div>

        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-[30vw] bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent z-10 pointer-events-none" />
    </section>
  );
}
