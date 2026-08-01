import Link from "next/link";
import LightRays from "@/components/LightRays";

export default function NotFound() {
  return (
    <main className="relative w-full h-screen bg-[#050505] flex flex-col items-center justify-center overflow-hidden font-sans">
      <div className="absolute inset-0 z-0 opacity-60">
        <LightRays />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 mt-[-10vh]">
        <h1 className="text-[#9b1a1a] font-black tracking-tighter leading-[0.8] text-[35vw] md:text-[20vw] select-none pointer-events-none">
          404
        </h1>
        <p className="text-white/90 text-2xl md:text-5xl font-bold tracking-tight mt-8 mb-12 select-none max-w-2xl leading-tight">
          May these lights guide<br />you on your path
        </p>
        
        <Link href="/" className="btn-bracket group">
          <div className="btn-inner bg-[#000000]/50 border border-white/20 hover:bg-white hover:text-black text-white px-8 py-4 uppercase font-bold tracking-widest text-xs transition-all duration-300 backdrop-blur-sm">
            Return to Base
          </div>
        </Link>
      </div>
    </main>
  );
}
