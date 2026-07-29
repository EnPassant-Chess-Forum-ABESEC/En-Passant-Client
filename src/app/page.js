import Image from "next/image";
import Link from "next/link";
import NumbersSection from "@/components/NumbersSection";
import StrategySection from "@/components/StrategySection";
import EcosystemSection from "@/components/EcosystemSection";
import WorkingProcessSection from "@/components/WorkingProcessSection";

export default function Home() {
  return (
    <>
      <section className="relative w-full h-screen bg-[#0a0a0a] overflow-hidden font-sans">
        {/* Premium Noise and Spotlight Texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
          }}
        ></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.06)_0%,transparent_60%)] pointer-events-none z-0"></div>

        <div className="absolute top-[22%] w-full px-6 md:px-12 select-none pointer-events-none z-10 flex justify-center">
          <div className="relative w-full max-w-7xl flex justify-center">
            
            <div className="relative flex justify-center gap-[1.5vw] md:gap-[2.5vw] bg-gradient-to-b from-[#ffffff] via-[#888888] to-[#111111] bg-clip-text text-transparent font-black uppercase leading-[0.75] text-[14vw] md:text-[13vw] tracking-tighter w-max mx-auto">
              {/* EN is now absolutely positioned relative to the start of the 'P' */}
              <p className="text-[#a3a3a3] font-bold uppercase absolute -top-8 md:-top-12 lg:-top-16 left-0 text-sm md:text-xl lg:text-2xl tracking-[0.4em]">
                EN
              </p>
              
              <span>P</span>
              <span>A</span>
              <span>S</span>
              <span>S</span>
              <span>A</span>
              <span>N</span>
              <span>T</span>
            </div>
          </div>
        </div>

        <div
          className="absolute left-1/2 z-20 -translate-x-1/2"
          style={{
            bottom: "0",
            width: "min(120vw, 1600px)",
            height: "110vh",
          }}
        >
          <Image
            src="/hero.png"
            alt="King"
            fill
            priority
            className="object-contain object-bottom"
          />
        </div>

        {/* Bottom content wrapped in max-w-7xl global margin */}
        <div className="absolute bottom-6 md:bottom-14 left-0 w-full px-6 md:px-12 z-40 flex justify-center pointer-events-none">
          <div className="w-full max-w-7xl flex justify-between items-end">
            <div className="max-w-[280px] hidden md:block pointer-events-auto">
              <p className="text-[#555555] text-[10px] md:text-xs font-semibold tracking-widest uppercase leading-relaxed">
                Strategic Mastery And
                <br />
                Performance-Driven Growth
                <br />
                For Ambitious Players
                <br />
                Ready To Scale
              </p>
            </div>

            <div className="flex flex-col items-end text-right gap-4 pointer-events-auto ml-auto">
              <div className="text-[#888888] text-xs md:text-sm tracking-wide hidden md:block">
                <span className="text-[#cccccc] font-bold">[chess community]</span>
                <br />
                that creates elite grandmaster systems
              </div>
              <div className="group relative">
                <Link href="/sign-up" className="btn-bracket group">
                  <div className="btn-inner bg-[#990000] hover:bg-[#cc0000] text-white px-8 py-4 uppercase font-bold tracking-widest text-xs transition-colors">
                    Book A Strategy Call
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Smooth Transition Gradient to Next Section */}
        <div className="absolute bottom-0 left-0 w-full h-32 md:h-56 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-30 pointer-events-none"></div>
      </section>
      <NumbersSection />
      <StrategySection />
      <EcosystemSection />
      <WorkingProcessSection />
    </>
  );
}
