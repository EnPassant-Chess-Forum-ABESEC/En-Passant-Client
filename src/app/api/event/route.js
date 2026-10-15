import { NextResponse } from "next/server";

export async function GET() {
  const fallbackData = {
    root: "A C C",
    eventName: "ACC — ABES Chess Championship 2026",
    description: "The ABES Chess Championship (ACC) stands as the institute's premier collegiate chess tournament, bringing together tactical minds, strategic thinkers, and seasoned arbiters under one banner. Organized by the En Passant Chess Club, the championship serves as the proving ground to crown the undisputed chess champion of ABES Engineering College.\n\nDesigned to accommodate both rising novices and master-tier competitors, the tournament features rating-stratified brackets spanning Open, Women's, and Inter-Club divisions. Contenders duel across rapid and classical time controls with official FIDE-standard regulations, full arbiter oversight, and live digital pairing boards.\n\nBeyond the silver and gold accolades, the championship awards substantial cash prize pools, custom handcrafted trophies, and official ranking supremacy. Prepare your openings, calculate every variation, and rise through the brackets to claim the throne.",
    format: "Swiss League & Knockout Finals",
    sections: [
      {
        id: "open",
        title: "Open Section",
        description: "Open Section with rating-tiered brackets",
        brackets: [
          { id: "beginner", name: "Beginner", range: "0 - 899", label: "Beginner (0 - 899)", timeControl: "10 + 5", timeFormat: "10 + 5" },
          { id: "intermediate", name: "Intermediate", range: "900 - 1499", label: "Intermediate (900 - 1499)", timeControl: "10 + 5", timeFormat: "10 + 5" },
          { id: "advanced", name: "Advanced", range: "1500 - 3000", label: "Advanced (1500 - 3000)", timeControl: "15 + 2", timeFormat: "15 + 2" },
        ],
      },
      {
        id: "womens",
        title: "Women's Section",
        description: "Women section for female participants",
        timeControl: "10 + 5",
        timeFormat: "10 + 5",
        brackets: [{ id: "womens-open", name: "All Ratings", range: "0 - 3000", label: "All Ratings (0 - 3000)", timeControl: "10 + 5", timeFormat: "10 + 5" }],
      },
      {
        id: "interclub",
        title: "Inter-Club",
        description: "Inter club section for different club representatives",
        timeControl: "10 + 5",
        timeFormat: "10 + 5",
        brackets: [{ id: "interclub-open", name: "All Ratings", range: "0 - 3000", label: "All Ratings (0 - 3000)", timeControl: "10 + 5", timeFormat: "10 + 5" }],
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
        const timeControl =
          brk.timeControl ||
          brk.timeFormat ||
          sec.timeControl ||
          sec.timeFormat ||
          (bName === "Advanced" ? "15 + 2" : "10 + 5");

        return {
          id: brk.id || `${sectionId}-${brk.name || bIdx}`,
          name: bName,
          range,
          label: `${bName} (${range})`,
          timeControl,
          timeFormat: timeControl,
        };
      });

      return {
        id: sectionId,
        title,
        description: sec.description || "",
        timeControl: sec.timeControl || sec.timeFormat || (sec.name === "open" ? null : "10 + 5"),
        timeFormat: sec.timeFormat || sec.timeControl || (sec.name === "open" ? null : "10 + 5"),
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
