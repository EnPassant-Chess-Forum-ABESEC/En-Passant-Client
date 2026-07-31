import Image from "next/image";
import Link from "next/link";
import RecruitmentTimeline from "@/components/RecruitmentTimeline";
import WhyJoinSection from "@/components/WhyJoinSection";
import DepartmentsSection from "@/components/DepartmentsSection";
import RecruitmentCTASection from "@/components/RecruitmentCTASection";

export default function RecruitmentPage() {
  return (
    <main className="w-full bg-[#0a0a0a] font-sans">
      {/* Hero Section */}
      <section className="relative w-full h-screen overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
          }}
        ></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.06)_0%,transparent_60%)] pointer-events-none z-0"></div>

        {/* ── Layer 1 (z-10): Background image ── */}
        <div className="absolute inset-0 z-10">
          <Image
            src="/recruitment_hero_front_background.png"
            alt="Background"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Dark overlay so text is legible */}
          <div className="absolute inset-0 bg-black/50 pointer-events-none" />
        </div>

        {/* ── Layer 2 (z-20): Typography — sits ABOVE background, BELOW front figure ── */}
        <div className="absolute top-[15%] md:top-[20%] w-full px-6 md:px-12 select-none pointer-events-none z-20 flex justify-center">
          <div className="relative w-full max-w-7xl flex flex-col items-center text-center">
            <p className="text-[#a3a3a3] font-bold uppercase text-sm md:text-xl tracking-[0.4em] mb-4 md:mb-6">
              Join The Elite
            </p>
            <div className="relative flex flex-col items-center bg-gradient-to-b from-[#ffffff] via-[#aaaaaa] to-[#222222] bg-clip-text text-transparent font-black uppercase leading-[0.85] text-[12vw] md:text-[9vw] tracking-tighter">
              <span>Test</span>
              <span>Recruitment</span>
              <span className="text-[#990000] bg-none drop-shadow-[0_0_30px_rgba(153,0,0,0.5)]">
                2026
              </span>
            </div>
          </div>
        </div>

        {/* ── Layer 2 (z-20): Apply Now button ── */}
        <div className="absolute bottom-12 left-0 w-full px-6 md:px-12 z-20 flex justify-center pointer-events-none">
          <div className="group relative pointer-events-auto">
            <Link href="/recruitment/apply" className="btn-bracket group">
              <div className="btn-inner bg-[#990000] hover:bg-[#cc0000] text-white px-10 py-5 uppercase font-bold tracking-widest text-sm transition-colors shadow-[0_0_30px_rgba(153,0,0,0.3)]">
                Apply Now
              </div>
            </Link>
          </div>
        </div>

        {/* ── Layer 3 (z-30): Foreground figure — overlaps text for depth ── */}
        <div className="absolute inset-0 z-30 pointer-events-none">
          <Image
            src="/recruitment_hero_front.png"
            alt="Recruitment Hero"
            fill
            priority
            className="object-cover object-center"
          />
        </div>

        {/* Bottom Fade transition */}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#0a0a0a] to-transparent z-40 pointer-events-none"></div>
      </section>

      {/* Timeline Section */}
      <RecruitmentTimeline />

      {/* Why Join Section */}
      <WhyJoinSection />

      {/* Featured Departments */}
      <DepartmentsSection />

      {/* Final CTA Section */}
      <RecruitmentCTASection />
    </main>
  );
}
