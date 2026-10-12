import EventHero from "@/components/EventHero";

export const metadata = {
  title: "Events | En Passant Chess Forum",
  description:
    "Explore upcoming chess tournaments, flagship championships, and competitive showdowns organized by En Passant at ABESEC.",
  openGraph: {
    title: "Events | En Passant Chess Forum",
    description:
      "Explore upcoming chess tournaments, flagship championships, and competitive showdowns organized by En Passant at ABESEC.",
    images: [
      {
        url: "/event/event-hero.png",
        width: 1200,
        height: 675,
        alt: "En Passant Event Hero",
      },
    ],
  },
};

export default function EventsPage() {
  return (
    <div className="w-full bg-[#050505] min-h-screen text-white font-sans flex flex-col">
      {/* Section 1: Hero Section */}
      <EventHero />
    </div>
  );
}
