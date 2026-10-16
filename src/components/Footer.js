"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaWhatsapp, FaInstagram, FaDiscord } from "react-icons/fa";
import { SiChessdotcom } from "react-icons/si";
import { Copyright } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

const columns = [
  {
    heading: "THE CLUB",
    links: [
      { label: "Home", href: "/" },
      { label: "Leaderboard", href: "/leaderboard" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "ENGAGE",
    links: [
      { label: "Recruitment", href: "/recruitment" },
      { label: "Profile", href: "/profile" },
    ],
  },
];

const socials = [
  {
    label: "WhatsApp",
    href: "https://chat.whatsapp.com/IoiMk9ru9CpEew7dHJkHve",
    icon: <FaWhatsapp size={20} />,
  },
  {
    label: "Chess.com",
    href: "https://www.chess.com/club/en-passant-abesec",
    icon: <SiChessdotcom size={20} />,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/enpassant.abesec/",
    icon: <FaInstagram size={20} />,
  },
  {
    label: "Discord",
    href: "https://discord.gg/WDF4UXrXC",
    icon: <FaDiscord size={20} />,
  },
];

export default function Footer() {
  const pathname = usePathname();
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["25%", "0%"]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer
      ref={containerRef}
      className="w-full relative min-h-screen md:h-[100dvh] overflow-hidden"
      style={{ backgroundColor: "#080808" }}
    >
      <motion.div
        style={{ y }}
        className="w-full h-full flex flex-col relative z-0"
      >
        <div className="relative z-10 flex flex-col justify-between flex-1 max-w-7xl mx-auto w-full px-6 sm:px-10 md:px-14 lg:px-16 pt-24 sm:pt-28 md:pt-32 pb-8">
          {/* Top Section: Brand Identity & Social Guild */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-6 pb-8 border-b border-white/[0.07]">
            <div>
              <span
                className="font-black uppercase block select-none"
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: "clamp(28px, 4vw, 50px)",
                  letterSpacing: "0.05em",
                  lineHeight: 1,
                }}
              >
                <span
                  className="bg-gradient-to-b from-[#ffffff] via-[#e2e8f0] to-[#94a3b8] bg-clip-text text-transparent inline-block"
                  style={{
                    filter:
                      "drop-shadow(0 2px 8px rgba(0,0,0,0.9)) drop-shadow(0 0 12px rgba(255,255,255,0.15))",
                  }}
                >
                  Vive L&apos; EN
                </span>
                <span
                  className="bg-gradient-to-b from-[#ff7171] via-[#ef4444] via-[#dc2626] to-[#991b1b] bg-clip-text text-transparent inline-block ml-2"
                  style={{
                    filter:
                      "drop-shadow(0 4px 14px rgba(0,0,0,0.95)) drop-shadow(0 0 20px rgba(220,38,38,0.25))",
                  }}
                >
                  PASSANT
                </span>
              </span>
              <p
                className="text-white/50 text-[11px] sm:text-xs mt-3 uppercase"
                style={{
                  fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                  letterSpacing: "0.26em",
                  fontWeight: 600,
                }}
              >
                For the game must always go on
              </p>
            </div>

            {/* Social Guild Links */}
            <div className="flex items-center gap-6">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-[#ff7171] transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_12px_rgba(239,68,68,0.7)] cursor-pointer"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Middle Section: Grand Quote (Left) & Nav Columns (Right) in Harmonious Balance */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center my-auto py-8 sm:py-10 md:py-12 w-full">
            {/* Left: The Grand Chess Maxim */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <blockquote>
                <p
                  className="italic leading-[1.6] text-slate-200"
                  style={{
                    fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                    fontSize: "clamp(19px, 2.2vw, 30px)",
                    letterSpacing: "0.015em",
                  }}
                >
                  &ldquo;The beauty of a move lies not in its appearance but in the
                  thought behind it.&rdquo;
                </p>
                <footer
                  className="mt-5 text-[11px] uppercase"
                  style={{
                    fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                    letterSpacing: "0.24em",
                    fontWeight: 700,
                    color: "rgba(239, 68, 68, 0.9)",
                  }}
                >
                  — Savielly Tartakower
                </footer>
              </blockquote>
            </div>

            {/* Right: Editorial Nav Directories */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-8 sm:gap-12 w-full lg:pl-6">
              {columns.map((col) => (
                <div key={col.heading} className="flex flex-col">
                  <h3
                    className="uppercase select-none text-[12px] sm:text-[13px]"
                    style={{
                      fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                      fontWeight: 700,
                      letterSpacing: "0.22em",
                      color: "rgba(255, 255, 255, 0.65)",
                      borderBottom: "1px solid rgba(239, 68, 68, 0.35)",
                      paddingBottom: "12px",
                      marginBottom: "18px",
                    }}
                  >
                    {col.heading}
                  </h3>
                  <div className="flex flex-col gap-2.5 items-start">
                    {col.links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="text-[13px] sm:text-[14px] text-white/50 hover:text-white transition-colors duration-200 py-0.5"
                        style={{
                          fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                          fontWeight: 600,
                          letterSpacing: "0.18em",
                        }}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Section: Formal Inscription & Legal Disclaimers */}
          <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-3 pt-6 border-t border-white/[0.08] w-full">
            <span
              className="text-[11px] text-white/50 uppercase text-center sm:text-left flex items-center justify-center sm:justify-start gap-1.5"
              style={{
                fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                letterSpacing: "0.2em",
                fontWeight: 600,
              }}
            >
              <Copyright
                strokeWidth={2.5}
                className="w-[12px] h-[12px] mt-px text-white/40"
              />{" "}
              {new Date().getFullYear()} En Passant · ABESEC
            </span>

            <div className="flex items-center justify-center gap-5">
              <Link
                href="/privacy"
                className="text-[11px] text-white/50 hover:text-[#ff7171] uppercase transition-colors duration-200"
                style={{
                  fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                  letterSpacing: "0.18em",
                  fontWeight: 600,
                }}
              >
                Privacy
              </Link>
              <span className="text-white/20 pointer-events-none">·</span>
              <Link
                href="/terms"
                className="text-[11px] text-white/50 hover:text-[#ff7171] uppercase transition-colors duration-200"
                style={{
                  fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                  letterSpacing: "0.18em",
                  fontWeight: 600,
                }}
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
