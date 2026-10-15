import { NextResponse } from "next/server";

export async function GET() {
  const fallbackData = {
    root: "A C C",
    eventName: "ACC — ABES Chess Championship 2026",
    description: "ABES chess championship to crown the best player of ABES.",
    sections: [
      {
        id: "open",
        title: "Open Section",
        description: "Open Section with rating-tiered brackets",
        brackets: [
          { id: "beginner", name: "Beginner", range: "0 - 899", label: "Beginner (0 - 899)" },
          { id: "intermediate", name: "Intermediate", range: "900 - 1499", label: "Intermediate (900 - 1499)" },
          { id: "advanced", name: "Advanced", range: "1500 - 3000", label: "Advanced (1500 - 3000)" },
        ],
      },
      {
        id: "womens",
        title: "Women's Section",
        description: "Women section for female participants",
        brackets: [{ id: "womens-open", name: "All Ratings", range: "0 - 3000", label: "All Ratings (0 - 3000)" }],
      },
      {
        id: "interclub",
        title: "Inter-Club",
        description: "Inter club section for different club representatives",
        brackets: [{ id: "interclub-open", name: "All Ratings", range: "0 - 3000", label: "All Ratings (0 - 3000)" }],
      },
    ],
    prizes: {
      label: "Prizes & Accolades",
      items: [
        { id: "p1", place: "1st Place", reward: "₹5,000 + Trophy" },
        { id: "p2", place: "2nd Place", reward: "₹3,000 + Trophy" },
        { id: "p3", place: "3rd Place", reward: "₹1,500 + Medal" },
      ],
    },
  };

  try {
    const apiUrl = (
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
    ).replace(/\/$/, "");

    const res = await fetch(`${apiUrl}/events`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      return NextResponse.json(fallbackData);
    }

    const data = await res.json();
    const eventsList = Array.isArray(data?.events) ? data.events : [];
    const event =
      eventsList.find(
        (e) =>
          e.status === "active" ||
          e.status === "in_progress" ||
          e.status === "upcoming",
      ) || eventsList[0];

    if (!event) {
      return NextResponse.json(fallbackData);
    }

    const formattedSections = (event.sections || []).map((sec, idx) => {
      const sectionId = sec.id || sec.name || `sec-${idx}`;
      const title =
        sec.title ||
        (sec.name === "open"
          ? "Open Section"
          : sec.name === "womens" || sec.name === "women"
            ? "Women's Section"
            : sec.name === "interclub"
              ? "Inter-Club"
              : sec.name
                ? sec.name.charAt(0).toUpperCase() + sec.name.slice(1)
                : `Section ${idx + 1}`);

      const rawBrackets = Array.isArray(sec.brackets) ? sec.brackets : [];
      const brackets = rawBrackets.map((brk, bIdx) => {
        const minR = brk.minRating ?? 0;
        const maxR = brk.maxRating ?? 3000;
        const bName =
          brk.name === "open"
            ? "All Ratings"
            : brk.name
              ? brk.name.charAt(0).toUpperCase() + brk.name.slice(1)
              : `Bracket ${bIdx + 1}`;
        const range = brk.range || `${minR} - ${maxR}`;

        return {
          id: brk.id || `${sectionId}-${brk.name || bIdx}`,
          name: bName,
          range,
          label: `${bName} (${range})`,
        };
      });

      return {
        id: sectionId,
        title,
        description: sec.description || "",
        brackets,
      };
    });

    const prizes =
      event.prizes && event.prizes.items?.length > 0
        ? event.prizes
        : fallbackData.prizes;

    return NextResponse.json({
      root: event.root || fallbackData.root,
      eventName: event.title || fallbackData.eventName,
      description: event.description || fallbackData.description,
      sections:
        formattedSections.length > 0
          ? formattedSections
          : fallbackData.sections,
      prizes,
      timeControl: event.timeControl || "10 + 5",
      format: event.format || "Swiss System",
    });
  } catch {
    return NextResponse.json(fallbackData);
  }
}
