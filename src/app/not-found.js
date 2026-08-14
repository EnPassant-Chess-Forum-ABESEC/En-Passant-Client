import Link from "next/link";
import LightRays from "@/components/LightRays";

export default function NotFound() {
  return (
    <main className="relative w-full h-screen bg-[#050505] flex flex-col items-center justify-center overflow-hidden font-sans">
      <div className="absolute inset-0 z-0 opacity-60">
        <LightRays />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 mt-[-10vh]">
        <h1 className="text-[#9b1a1a] font-black font-pezula tracking-wide leading-[0.8] text-[35vw] md:text-[20vw] select-none pointer-events-none">
          404
          <span className="font-light text-2xl tracking-[0.12em]">??</span>
        </h1>
        <p className="text-white/90 text-2xl md:text-5xl font-bold tracking-tight mt-8 mb-12 select-none max-w-2xl leading-tight">
          May these lights guide
          <br />
          you on your path
        </p>

        <Link href={"/"} className="btn-bracket group cursor-good">
          <div className="btn-inner bg-[#990000] hover:bg-[#cc0000] text-white px-6 md:px-8 py-4 uppercase font-pezula font-normal text-[14px] tracking-[0.12em] transition-colors duration-200 ease-in-out whitespace-nowrap">
            Return To Base
          </div>
        </Link>
      </div>
    </main>
  );
}
