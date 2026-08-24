import Link from "next/link";
import dynamic from "next/dynamic";
import { auth } from "@clerk/nextjs/server";

import LazyLoad from "@/components/LazyLoad";
import HeroSection from "@/components/HeroSection";

const NumbersSection = dynamic(() => import("@/components/NumbersSection"));
const CommunityDesc = dynamic(() => import("@/components/CommunityDesc"));
const AboutClub = dynamic(() => import("@/components/AboutClub"));
const DriftWallSection = dynamic(() => import("@/components/DriftWallSection"));
const ClubJournalSection = dynamic(
  () => import("@/components/ClubJournalSection"),
);

export default async function Home() {
  const { userId } = await auth();

  return (
    <main className="w-full bg-[#050505] font-sans">
      <HeroSection>
        <div className="w-full max-w-7xl flex justify-center md:justify-between items-end">
          <div
            className="max-w-[340px] hidden md:block pointer-events-auto hero-bottom-text"
            style={{ "--hero-slide-from": "-20px" }}
          >
            <p className="text-[#cccccc] font-sans font-normal text-[14px] leading-[1.8] tracking-[0.08em] uppercase opacity-80">
              Whether you're making
              <br />
              your first move or your thousandth,
              <br />
              there's a place for you here
            </p>
          </div>

          <div
            className="flex flex-col items-center md:items-end text-center md:text-right gap-4 pointer-events-auto mx-auto md:ml-auto md:mr-0 w-full md:w-auto hero-bottom-text"
            style={{ "--hero-slide-from": "20px" }}
          >
            <div className="text-[#888888] text-xs md:text-sm tracking-wide hidden md:block">
              <span className="text-[#cccccc] font-sans font-medium text-[13px] tracking-[0.1em] opacity-80">
                Chess forum
              </span>
              <br />
              Dedicated to spread the game of chess
            </div>
            <div className="group relative w-full sm:w-auto flex justify-center mt-2 md:mt-0">
              <Link
                href={userId ? "/recruitment/dashboard" : "/sign-up"}
                className="btn-bracket group cursor-good"
              >
                <div className="btn-inner bg-[#990000] hover:bg-[#cc0000] text-white px-6 md:px-8 py-4 uppercase font-pezula font-normal text-[14px] tracking-[0.12em] transition-colors duration-200 ease-in-out whitespace-nowrap">
                  {userId ? "Go to Recruitment" : "Sign Up Here"}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </HeroSection>

      <LazyLoad minHeight="100vh">
        <NumbersSection />
      </LazyLoad>

      <LazyLoad minHeight="100vh">
        <CommunityDesc />
      </LazyLoad>

      <LazyLoad minHeight="100vh">
        <AboutClub />
      </LazyLoad>

      <LazyLoad minHeight="100vh">
        <DriftWallSection />
      </LazyLoad>

      <LazyLoad minHeight="100vh">
        <ClubJournalSection />
      </LazyLoad>
    </main>
  );
}
