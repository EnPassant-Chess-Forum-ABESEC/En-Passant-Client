import Image from "next/image";

export default function NumbersSection() {
  return (
    <section className="relative w-full bg-[#111111] font-sans pt-[20vh] border-none">
      <div className="relative w-full h-[100vw]">
        {/* ─── Faint Chess Board Grid Background ─── */}
        <div
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #ffffff 1px, transparent 1px),
              linear-gradient(to bottom, #ffffff 1px, transparent 1px)
            `,
            backgroundSize: "12.5vw 12.5vw",
          }}
        ></div>

        {/* Grid Coordinates (8x8 Chess Board) */}
        <div className="absolute top-0 w-full flex text-white/30 text-[10px] font-mono pt-2 z-0">
          {["A", "B", "C", "D", "E", "F", "G", "H"].map((col) => (
            <div key={col} className="w-[12.5vw] text-center">
              {col}
            </div>
          ))}
        </div>
        <div className="absolute top-0 h-full flex flex-col text-white/30 text-[10px] font-mono pl-2 z-0">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
            <div key={row} className="h-[12.5vw] flex items-center">
              {row}
            </div>
          ))}
        </div>

        <div className="relative w-full h-full max-w-screen-2xl mx-auto">
          {/* ─── Header: THE NUMBERS ─── */}
          <div className="absolute top-[8vw] right-[5vw] z-30 text-right pointer-events-none">
            <h2 className="flex flex-col uppercase font-black leading-[0.8] tracking-tighter">
              <span className="text-white text-[8vw] md:text-[100px]">THE</span>
              <span className="text-[#9b1a1a] text-[10vw] md:text-[140px]">
                NUMBERS
              </span>
            </h2>
          </div>

          {/* ─── Center Chess Piece ─── */}
          <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 w-[80vw] md:w-[600px] h-[80vw] md:h-[900px] z-10 pointer-events-none rotate-[12deg]">
            <Image
              src="/king.png"
              alt="Chess Piece"
              fill
              className="object-contain"
            />
          </div>

        </div>

        {/* ─── Stats Boxes (Locked perfectly to the 12.5vw Grid) ─── */}
        {/* Box 1: Club Members (Row 2, Col 1 -> 2x2 cells) */}
        <div className="absolute top-[25vw] left-[12.5vw] bg-[#0a0a0a] border border-white/10 w-[25vw] h-[25vw] z-20 flex flex-col items-center justify-center p-4 text-center">
          <span className="text-white font-black text-[5vw] tracking-tighter uppercase leading-none mb-2">
            120+
          </span>
          <span className="text-white/80 text-[1vw] md:text-xs lg:text-base font-medium">
            Club Members
          </span>
        </div>

        {/* Box 2: Events Conducted (Row 4, Col 5 -> 2x2 cells) */}
        <div className="absolute top-[50vw] right-[12.5vw] bg-[#0a0a0a] border border-white/10 w-[25vw] h-[25vw] z-20 flex flex-col items-center justify-center p-4 text-center">
          <span className="text-white font-black text-[5vw] tracking-tighter uppercase leading-none mb-2">
            25+
          </span>
          <span className="text-white/80 text-[1vw] md:text-xs lg:text-base font-medium">
            Events Conducted
          </span>
        </div>

        {/* Box 3: Events Participated (Row 6, Col 2 -> 2x2 cells) */}
        <div className="absolute top-[75vw] left-[25vw] bg-[#0a0a0a] border border-white/10 w-[25vw] h-[25vw] z-20 flex flex-col items-center justify-center p-4 text-center">
          <span className="text-white font-black text-[5vw] tracking-tighter uppercase leading-none mb-2">
            8+
          </span>
          <span className="text-white/80 text-[1vw] md:text-xs lg:text-base font-medium">
            Events Participated
          </span>
        </div>

        {/* Box 4: Tournaments Won (Row 6, Col 6 -> 2x2 cells) */}
        <div className="absolute top-[75vw] right-[25vw] bg-[#0a0a0a] border border-white/10 w-[25vw] h-[25vw] z-20 flex flex-col items-center justify-center p-4 text-center">
          <span className="text-white font-black text-[4vw] tracking-tighter uppercase leading-none mb-2">
            3X
          </span>
          <span className="text-white/80 text-[1vw] md:text-xs lg:text-base font-medium">
            Growth Rate
          </span>
        </div>
      </div>
    </section>
  );
}
