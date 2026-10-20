"use client";

import Link from "next/link";

export default function HeroEventButton() {
  return (
    <Link
      href="/events"
      className="btn-bracket group cursor-good"
    >
      <div className="btn-inner bg-[#990000] hover:bg-[#cc0000] text-white px-6 md:px-8 py-4 uppercase font-pezula font-normal text-[14px] tracking-[0.12em] transition-colors duration-200 ease-in-out whitespace-nowrap">
        Explore Events
      </div>
    </Link>
  );
}
