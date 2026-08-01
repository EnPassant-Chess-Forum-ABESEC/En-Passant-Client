import Image from "next/image";
import Link from "next/link";
import RecruitmentTimeline from "@/components/RecruitmentTimeline";
import WhyJoinSection from "@/components/WhyJoinSection";
import DepartmentsSection from "@/components/DepartmentsSection";
import RecruitmentCTASection from "@/components/RecruitmentCTASection";

export default function RecruitmentPage() {
  return (
    <main className="w-full bg-[#050505] font-sans">
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
            className="object-cover object-[70%_center] md:object-center"
          />
          {/* Dark overlay so text is legible */}
          <div className="absolute inset-0 bg-black/50 pointer-events-none" />
        </div>

        {/* ── Layer 2 (z-20): Typography — sits ABOVE background, BELOW front figure ── */}
        <div className="absolute inset-0 w-full h-full select-none pointer-events-none z-20">
          {/* RECRUITMENT - starting below the hand, spanning right */}
          <div
            className="absolute top-[46%] md:top-[49%] left-[25%] md:left-[41%]"
            style={{ width: "80vw" }}
          >
            <h1
              className="bg-gradient-to-b from-[#ffffff] via-[#cccccc] to-[#555555]
              bg-clip-text text-transparent font-pezula uppercase
              tracking-wider leading-[0.85]
              text-[15vw] md:text-[10vw] whitespace-nowrap"
            >
              RECRUITMENT
            </h1>
          </div>

          {/* 2026 - Positioned below RECRUITMENT to avoid being hidden by the foreground piece */}
          <div className="absolute top-[56%] md:top-[58%] right-[10%] md:right-[20%]">
            <span className="text-[#9b1a1a] drop-shadow-[0_0_40px_rgba(155,26,26,0.6)] font-black tracking-tighter leading-[0.85] text-[15vw] md:text-[10vw]">
              2026
            </span>
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
            className="object-cover object-[70%_center] md:object-center"
          />
        </div>

        {/* Bottom Fade transition */}
        <div className="absolute bottom-0 left-0 w-full h-[15vw] bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-40 pointer-events-none"></div>
      </section>

      {/* Timeline Section */}
      <RecruitmentTimeline />

      {/* Featured Departments */}
      <DepartmentsSection />

      {/* Final CTA Section */}
      <RecruitmentCTASection />
    </main>
  );
}
