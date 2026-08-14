import dynamic from "next/dynamic";
import RecruitmentHero from "@/components/RecruitmentHero";
import LazyLoad from "@/components/LazyLoad";

// Dynamically import heavy sections
const RecruitmentTimeline = dynamic(
  () => import("@/components/RecruitmentTimeline"),
  { ssr: true },
);
const DepartmentsSection = dynamic(
  () => import("@/components/DepartmentsSection"),
  { ssr: true },
);
const RecruitmentCTASection = dynamic(
  () => import("@/components/RecruitmentCTASection"),
  { ssr: true },
);

export default function RecruitmentPage() {
  return (
    <main className="w-full bg-[#050505] font-sans">
      <RecruitmentHero />

      {/* Use LazyLoad to completely defer JavaScript parsing of these sections until scrolled into view */}
      <LazyLoad minHeight="100vh">
        <RecruitmentTimeline />
      </LazyLoad>

      <LazyLoad minHeight="100vh">
        <DepartmentsSection />
      </LazyLoad>

      <LazyLoad minHeight="50vh">
        <RecruitmentCTASection />
      </LazyLoad>
    </main>
  );
}
