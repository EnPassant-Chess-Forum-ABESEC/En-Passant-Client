import EventHero from "@/components/EventHero";
import EventDesc from "@/components/EventDesc";
import EventDetailsTree from "@/components/EventDetailsTree";
import EventTimeFormat from "@/components/EventTimeFormat";
import EventRegulation from "@/components/EventRegulation";
import EventSponsors from "@/components/EventSponsors";
import EventCTA from "@/components/EventCTA";

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

async function getEvents() {
  try {
    let apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080/api";

    const res = await fetch(`${apiUrl}/events`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.events || [];
  } catch {
    return [];
  }
}

export default async function EventsPage() {
  const events = await getEvents();
  const currentEvent =
    events.find(
      (e) =>
        e.status === "active" ||
        e.status === "in_progress" ||
        e.status === "upcoming",
    ) || events[0];

  return (
    <div className="w-full bg-[#050505] min-h-screen text-white font-sans flex flex-col">
      <EventHero />
      <EventDesc initialDescription={currentEvent?.description || ""} />
      <EventDetailsTree event={currentEvent} />
      <EventTimeFormat event={currentEvent} />
      <EventRegulation
        event={currentEvent}
        initialFormat={
          currentEvent?.format || currentEvent?.tournamentFormat || ""
        }
      />
      {/* <EventSponsors sponsors={currentEvent?.sponsors || []} /> */}
      <EventCTA event={currentEvent} />
    </div>
  );
}
