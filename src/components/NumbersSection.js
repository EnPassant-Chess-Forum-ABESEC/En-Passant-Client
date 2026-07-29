import Image from "next/image";

export default function NumbersSection() {
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
      ></div>
      <div className="absolute inset-0 z-0 bg-black/40 pointer-events-none"></div>

      {/* Top Fade — blends seamlessly with hero section below */}
      <div className="absolute top-0 left-0 w-full h-[30vw] bg-gradient-to-b from-[#050505] via-[#050505]/60 to-transparent z-10 pointer-events-none"></div>

      <div className="relative w-full h-[96vw]">
        {/* ─── Faint Chess Board Grid Background ─── */}
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
        ></div>

        {/* Grid Coordinates (8x8 Chess Board inside 12vw cells) */}
        <div className="absolute top-0 w-full px-[2vw] flex text-white/30 text-[10px] font-mono pt-2 z-0">
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

        <div className="relative w-full h-full max-w-screen-2xl mx-auto">
          {/* Section Header */}
          <div className="absolute top-[6vw] right-[5vw] z-30 text-right leading-[0.85]">
            <div className="relative inline-block">
              <h2 className="flex flex-col uppercase font-black leading-[0.8] tracking-tighter">
                <span className="text-white text-[8vw] md:text-[100px]">
                  THE
                </span>
                <span className="text-[#9b1a1a] text-[10vw] md:text-[140px]">
                  NUMBERS
                </span>
              </h2>
            </div>
          </div>

          {/* ─── Center Chess Piece (Ranks 3 to 7) ─── */}
          <div className="absolute left-1/2 top-[24vw] -translate-x-1/2 w-[60vw] md:w-[40vw] h-[60vw] z-10 pointer-events-none rotate-[6deg]">
            <Image
              src="/king.png"
              alt="Chess Piece"
              fill
              className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
            />
          </div>
        </div>

        {/* ─── Stats Boxes (Locked perfectly to the 12vw Grid) ─── */}
        {/* Box 1: Club Members (Row 2-3, Col A-B) */}
        <div className="absolute top-[12vw] left-[2vw] bg-[#000000] border border-white/10 w-[24vw] h-[24vw] z-20 flex flex-col items-center justify-center p-4 text-center">
          <span className="text-white font-black text-[7vw] md:text-[6vw] tracking-tighter uppercase leading-none mb-1">
            120+
          </span>
          <span className="text-white text-[1.5vw] md:text-sm lg:text-base font-normal tracking-wide">
            Club Members
          </span>
        </div>

        {/* Box 2: Events Conducted (Row 4-5, Col F-G) */}
        <div className="absolute top-[36vw] right-[14vw] bg-[#000000] border border-white/10 w-[24vw] h-[24vw] z-20 flex flex-col items-center justify-center p-4 text-center">
          <span className="text-white font-black text-[7vw] md:text-[6vw] tracking-tighter uppercase leading-none mb-1">
            -35%
          </span>
          <span className="text-white text-[1.5vw] md:text-sm lg:text-base font-normal tracking-wide">
            Events Conducted
          </span>
        </div>

        {/* Box 3: Events Participated (Row 6-7, Col B-C) */}
        <div className="absolute top-[60vw] left-[14vw] bg-[#000000] border border-white/10 w-[24vw] h-[24vw] z-20 flex flex-col items-center justify-center p-4 text-center">
          <span className="text-white font-black text-[7vw] md:text-[6vw] tracking-tighter uppercase leading-none mb-1">
            8+
          </span>
          <span className="text-white text-[1.5vw] md:text-sm lg:text-base font-normal tracking-wide">
            Events Participated
          </span>
        </div>

        {/* Box 4: Tournaments Won (Row 7-8, Col G-H) */}
        <div className="absolute top-[72vw] right-[2vw] bg-[#000000] border border-white/10 w-[24vw] h-[24vw] z-20 flex flex-col items-center justify-center p-4 text-center">
          <span className="text-white font-black text-[7vw] md:text-[6vw] tracking-tighter uppercase leading-none mb-1">
            3X
          </span>
          <span className="text-white text-[1.5vw] md:text-sm lg:text-base font-normal tracking-wide">
            Growth Rate
          </span>
        </div>
      </div>

      {/* Bottom Fade — blends seamlessly into EcosystemSection */}
      <div className="absolute bottom-0 left-0 w-full h-[30vw] bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent z-10 pointer-events-none"></div>
    </section>
  );
}
