import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ApplicationForm from "@/components/ApplicationForm";

export const metadata = {
  title: "Apply | En Passant Recruitment 2026",
};

export default function RecruitmentApplyPage() {
  return (
    <main className="w-full h-screen bg-black flex overflow-hidden font-sans">
      
      {/* ── LEFT COLUMN (Image & Typography) ── */}
      <div className="hidden md:flex w-[45%] lg:w-[40%] relative bg-black flex-col justify-between overflow-hidden border-r border-white/10">
        
        {/* Back Button */}
        <div className="absolute top-8 left-8 z-40">
          <Link href="/recruitment" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Back to details
          </Link>
        </div>

        {/* Top Watermark */}
        <div className="absolute top-12 right-12 z-40 text-right opacity-30">
          <p className="font-mono text-xs text-white uppercase tracking-[0.3em]">Phase 01</p>
          <p className="font-mono text-[10px] text-[#9b1a1a] uppercase tracking-widest mt-1">Application</p>
        </div>

        {/* Typography (Behind the character - z-10) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 select-none opacity-80 mt-20">
          <h1 className="flex flex-col items-center text-center font-black uppercase leading-[0.8] tracking-tighter">
            <span className="text-white text-[12vw] md:text-[8vw]">JOIN</span>
            <span className="text-[#1a1a1a] text-[12vw] md:text-[8vw] drop-shadow-[0_0_20px_rgba(255,255,255,0.05)]">THE</span>
            <span className="text-[#9b1a1a] text-[12vw] md:text-[8vw]">ELITE</span>
          </h1>
        </div>

        {/* The Character Image (In front of the typography - z-20) */}
        <div className="absolute inset-x-0 bottom-0 top-[20%] z-20 pointer-events-none">
          <Image
            src="/recruitment_form_page_left_character.png"
            alt="Recruitment Character"
            fill
            className="object-contain object-bottom md:object-cover md:object-bottom lg:object-contain drop-shadow-2xl"
            priority
          />
        </div>

        {/* Bottom Fade Gradient for the image */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-30 pointer-events-none" />
      </div>

      {/* ── RIGHT COLUMN (The Form) ── */}
      <div className="w-full md:w-[55%] lg:w-[60%] bg-[#050505] h-full overflow-y-auto relative">
        {/* Subtle background texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
          }}
        />
        
        {/* Mobile Back Button (only shows on small screens) */}
        <div className="md:hidden absolute top-6 left-6 z-40">
          <Link href="/recruitment" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>

        <div className="relative z-10 w-full h-full px-6 sm:px-12 py-12">
          <ApplicationForm />
        </div>
      </div>
      
    </main>
  );
}
