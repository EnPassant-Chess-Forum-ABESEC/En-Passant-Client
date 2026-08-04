"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const columns = [
  {
    heading: "PLATFORM",
    links: [
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Recruitment", href: "/recruitment" },
      { label: "Tournaments", href: "/tournaments" },
    ],
  },
  {
    heading: "RESOURCES",
    links: [
      { label: "Club Journal", href: "/journal" },
      { label: "Blog", href: "/blog" },
      { label: "Openings", href: "/openings" },
      { label: "Endgames", href: "/endgames" },
    ],
  },
  {
    heading: "COMPANY",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer
      className="w-full relative overflow-hidden"
      style={{ boxShadow: "0 -10px 40px rgba(196,30,58,0.06)" }}
    >
      {/* Gradient glow divider — heated crack in obsidian */}
      <div
        className="w-full h-[1px] relative z-20"
        style={{
          background: "linear-gradient(to right, transparent 0%, rgba(196,30,58,0.4) 20%, rgba(196,30,58,0.8) 50%, rgba(196,30,58,0.4) 80%, transparent 100%)",
          boxShadow: "0 1px 20px rgba(196,30,58,0.12), 0 0 40px rgba(196,30,58,0.04)",
        }}
      />

      {/* Bevel gradient */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.04) 0%, transparent 8%)" }}
      />

      {/* Grain texture */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E")',
          transform: "translateZ(0)",
          willChange: "transform",
        }}
      />

      {/* Subliminal chessboard */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.015]"
        style={{
          backgroundImage: "repeating-conic-gradient(rgba(255,255,255,0.02) 0% 25%, transparent 0% 50%)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Main content */}
      <div
        className="relative z-10 w-full"
        style={{ backgroundColor: "#0f0f0f", padding: "48px 60px 24px 60px" }}
      >
        <div className="w-full max-w-[1100px] mx-auto">

          {/* Brand Bar */}
          <div
            className="flex items-center justify-between"
            style={{ paddingBottom: "20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <span
              className="font-cinzel font-bold text-[24px] text-white uppercase"
              style={{ letterSpacing: "0.12em", textShadow: "0 0 30px rgba(255,255,255,0.05)" }}
            >
              ENPASSANT
            </span>
            <div className="flex items-center gap-4">
              {/* GitHub */}
              <a href="#" className="text-white opacity-[0.35] hover:opacity-100 hover:text-[#c41e3a] transition-all duration-200">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
              {/* X / Twitter */}
              <a href="#" className="text-white opacity-[0.35] hover:opacity-100 hover:text-[#c41e3a] transition-all duration-200">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              {/* LinkedIn */}
              <a href="#" className="text-white opacity-[0.35] hover:opacity-100 hover:text-[#c41e3a] transition-all duration-200">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              {/* Discord */}
              <a href="#" className="text-white opacity-[0.35] hover:opacity-100 hover:text-[#c41e3a] transition-all duration-200">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 9a5 5 0 0 0-3.89-1.89l-.61.12A5 5 0 0 0 10.5 7.1l-.61-.12A5 5 0 0 0 6 9"></path><path d="M20.27 16c.93-1.65 1.58-3.44 1.73-5.32a8.46 8.46 0 0 0-3.44-2.18"></path><path d="M3.73 16c-.93-1.65-1.58-3.44-1.73-5.32A8.46 8.46 0 0 1 5.44 8.5"></path><path d="M15 18s0 2-3 2-3-2-3-2"></path><circle cx="9" cy="12" r="1"></circle><circle cx="15" cy="12" r="1"></circle></svg>
              </a>
            </div>
          </div>

          {/* Three Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 pt-8" style={{ gap: "0" }}>
            {columns.map((col, colIdx) => (
              <div
                key={col.heading}
                className="flex flex-col px-6 md:px-10"
                style={{
                  borderLeft: colIdx > 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}
              >
                {/* Chiseled heading — Cinzel */}
                <h3
                  className="font-cinzel font-bold text-[14px] uppercase select-none"
                  style={{
                    letterSpacing: "0.12em",
                    color: "rgba(255,255,255,0.45)",
                    borderBottom: "1px solid rgba(196,30,58,0.3)",
                    paddingBottom: "12px",
                    marginBottom: "24px",
                  }}
                >
                  {col.heading}
                </h3>

                {/* Manuscript links — EB Garamond */}
                <div className="flex flex-col">
                  {col.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group font-eb-garamond font-normal text-[16px] block transition-all duration-[250ms] ease-in-out hover:pl-[6px] hover:italic hover:text-[#c41e3a]"
                      style={{ lineHeight: "2.2", color: "rgba(255,255,255,0.6)", letterSpacing: "0.01em" }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "#c41e3a"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
                    >
                      <span className="inline-block w-0 overflow-hidden opacity-0 group-hover:w-[14px] group-hover:opacity-100 transition-all duration-200 ease-in-out text-[6px] text-[#c41e3a] align-middle leading-none not-italic">
                        •
                      </span>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Chess Quote Block */}
          <div className="w-full flex flex-col items-center" style={{ margin: "40px auto" }}>
            {/* Thin manuscript rule — top */}
            <div className="w-[120px] mx-auto" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }} />

            <div className="max-w-[600px] text-center mt-6 mb-6">
              <p
                className="font-eb-garamond italic font-normal text-[20px]"
                style={{ lineHeight: "1.6", color: "rgba(255,255,255,0.45)", letterSpacing: "0.02em" }}
              >
                The beauty of a move lies not in its appearance but in the thought behind it.
              </p>
              <p
                className="font-cinzel font-medium text-[11px] uppercase"
                style={{ letterSpacing: "0.16em", color: "rgba(196,30,58,0.6)", marginTop: "16px" }}
              >
                — Savielly Tartakower
              </p>
            </div>

            {/* Thin manuscript rule — bottom */}
            <div className="w-[120px] mx-auto" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }} />
          </div>

          {/* Bottom Copyright Bar */}
          <div
            className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              paddingTop: "16px",
              marginTop: "32px",
            }}
          >
            <span
              className="font-cinzel font-medium text-[11px] text-white uppercase"
              style={{ letterSpacing: "0.14em", opacity: "0.4" }}
            >
              © 2026 ENPASSANT
            </span>
            <span
              className="font-cinzel font-medium text-[11px] text-white uppercase"
              style={{ letterSpacing: "0.14em", opacity: "0.35" }}
            >
              FORGED IN TACTICAL EXCELLENCE
            </span>
            <span className="font-eb-garamond font-normal text-[13px] text-white flex items-center gap-2" style={{ letterSpacing: "0.04em", opacity: "0.45" }}>
              <Link href="/privacy" className="hover:text-[#c41e3a] hover:italic transition-all duration-200">Privacy</Link>
              <span className="opacity-30">·</span>
              <Link href="/terms" className="hover:text-[#c41e3a] hover:italic transition-all duration-200">Terms</Link>
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
}
