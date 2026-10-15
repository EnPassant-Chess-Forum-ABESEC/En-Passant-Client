import { NextResponse } from "next/server";

export async function GET() {
  const fallbackData = {
    root: "ACC",
    eventName: "ACC - ABES Chess Championship 2026",
    description: "ABES chess championship to crown the best player of ABES.",
    sections: [
      {
        id: "open",
        title: "Open Section",
        description: "Open Section with rating-tiered brackets",
        brackets: [
          { id: "beginner", label: "Beginner (0 - 899)" },
          { id: "intermediate", label: "Intermediate (900 - 1499)" },
          { id: "advanced", label: "Advanced (1500 - 3000)" },
        ],
      },
      {
        id: "womens",
        title: "Women's Section",
        description: "Women section for female participants",
        brackets: [{ id: "womens-open", label: "All Ratings (0 - 3000)" }],
      },
      {
        id: "interclub",
        title: "Inter-Club",
        description: "Inter club section for different club representatives",
        brackets: [{ id: "interclub-open", label: "All Ratings (0 - 3000)" }],
      },
    ],
    prizes: {
      label: "Prizes",
      items: [
        { id: "p1", place: "1st Place", reward: "₹5,000 + Trophy" },
        { id: "p2", place: "2nd Place", reward: "₹3,000 + Trophy" },
        { id: "p3", place: "3rd Place", reward: "₹1,500 + Medal" },
      ],
    },
  };

  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
    const res = await fetch(`${apiUrl}/events`, {
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) {
      return NextResponse.json(fallbackData);
    }

    const data = await res.json();
    const eventsList = data?.events || [];
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

    // Map backend sections and brackets
    const formattedSections = (event.sections || []).map((sec, idx) => {
      const sectionId = sec.name || `sec-${idx}`;
      const title =
        sec.name === "open"
          ? "Open Section"
          : sec.name === "womens"
            ? "Women's Section"
            : sec.name === "interclub"
              ? "Inter-Club"
              : sec.name.charAt(0).toUpperCase() + sec.name.slice(1);

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
        return {
          id: `${sectionId}-${brk.name || bIdx}`,
          label: `${bName} (${minR} - ${maxR})`,
        };
      });

      return {
        id: sectionId,
        title,
        description: sec.description || "",
        brackets,
      };
    });

    return NextResponse.json({
      root: "ACC",
      eventName: event.title || "ACC - ABES Chess Championship 2026",
      description:
        event.description ||
        "ABES chess championship to crown the best player of ABES.",
      sections: formattedSections,
      prizes: fallbackData.prizes,
    });
  } catch (err) {
    console.error("API /api/event fallback triggered:", err.message);
    return NextResponse.json(fallbackData);
  }
}
