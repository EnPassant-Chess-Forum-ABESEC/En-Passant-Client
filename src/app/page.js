import Image from "next/image";
import Link from "next/link";
import NumbersSection from "@/components/NumbersSection";
import StrategySection from "@/components/StrategySection";
import EcosystemSection from "@/components/EcosystemSection";

export default function Home() {
  return (
    <>
      <section className="relative w-full h-screen bg-[#111111] overflow-hidden font-sans">
        <div className="absolute top-[22%] w-full px-6 md:px-12 select-none pointer-events-none z-0">
          <div className="relative w-full mx-auto">
            <p className="text-white font-bold uppercase absolute -top-4 md:-top-8 left-1 md:left-2 text-sm md:text-2xl tracking-[0.15em]">
              EN
            </p>

            <div className="flex justify-between items-center w-full text-white font-black uppercase leading-[0.75] text-[21vw] tracking-tighter">
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
            bottom: "-5%",
            width: "min(90vw,1300px)",
            height: "105vh",
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

        <div className="absolute bottom-14 right-14 z-40">
          <div className="group relative">
            <Link href="/sign-up" className="btn-bracket group">
              <div className="btn-inner">Join The Club</div>
            </Link>
          </div>
        </div>
      </section>
      <NumbersSection />
      <StrategySection />
      <EcosystemSection />
    </>
  );
}
