import Image from "next/image";
import LineSidebar from "@/components/LineSidebar";

export const metadata = {
  title: "Apply | En Passant Recruitment 2026",
};

export default function RecruitmentApplyPage() {
  return (
    <main className="relative w-full h-screen flex overflow-hidden font-sans bg-black">
      {/* ── BACKGROUND LAYER (Gradiented Black) ── */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#151515] via-black to-[#0a0a0a]" />

      {/* ── FULL PAGE FOREGROUND IMAGE ── */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-70 mix-blend-screen">
        <Image
          src="/form_page_foreground.png"
          alt="Recruitment foreground"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* ── TEXTURE OVERLAY ── */}
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none z-20 mix-blend-overlay"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
        }}
      />

      {/* ── CONTENT CONTAINER ── */}
      <div className="relative z-30 w-full h-full flex flex-col md:flex-row">
        
        {/* Left Column - Sidebar hugging the queen */}
        <div className="hidden md:flex w-[35%] lg:w-[30%] h-full flex-col justify-center items-start pl-8">
          <LineSidebar 
            items={["Details", "Department", "Tasks", "Interview", "Checkout"]}
            accentColor="#9b1a1a"
            textColor="#ffffff"
            markerColor="#ffffff"
            showIndex={true}
            showMarker={true}
            defaultActive={0}
            fontSize={1.2}
          />
        </div>

        {/* Right Column - Empty as requested */}
        <div className="flex-1 h-full flex items-center justify-center p-8">
           
        </div>

      </div>
    </main>
  );
}
