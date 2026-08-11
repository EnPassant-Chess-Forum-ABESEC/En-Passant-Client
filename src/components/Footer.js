"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaWhatsapp, FaInstagram, FaDiscord } from "react-icons/fa";
import { SiChessdotcom } from "react-icons/si";
import { motion, useScroll, useTransform } from "framer-motion";

const columns = [
  {
    heading: "PLATFORM",
    links: [
      { label: "About", href: "#" },
      { label: "Services", href: "#" },
      { label: "Recruitment", href: "/recruitment" },
      { label: "Tournaments", href: "#" },
    ],
  },
  {
    heading: "RESOURCES",
    links: [
      { label: "Club Journal", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Openings", href: "#" },
      { label: "Endgames", href: "#" },
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

  const y = useTransform(scrollYProgress, [0, 1], ["30%", "0%"]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer
      ref={containerRef}
      className="w-full relative h-[100dvh] overflow-hidden"
      style={{ backgroundColor: "#080808" }}
    >
      <motion.div
        style={{ y }}
        className="w-full h-full flex flex-col relative z-0"
      >
        <div
          className="absolute top-0 left-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(155,26,26,0.12) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 flex flex-col flex-1 px-8 md:px-16 lg:px-24 pt-32 md:pt-[120px] lg:pt-[150px] pb-8">
          <div className="flex flex-col md:flex-row items-start md:justify-between w-full mb-6 md:mb-8 gap-6 md:gap-0">
            <div>
              <span
                className="font-cinzel font-black text-white uppercase"
                style={{
                  fontSize: "clamp(28px, 4vw, 52px)",
                  letterSpacing: "0.06em",
                  lineHeight: 1,
                }}
              >
                Vive L' EN<span style={{ color: "#c41e3a" }}>PASSANT</span>
              </span>
              <p className="text-white/30 text-sm mt-3 font-inter tracking-widest uppercase">
                For the game must always go on
              </p>
            </div>

            <div className="flex items-center gap-5 mt-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/25 hover:text-[#c41e3a] transition-all duration-300 hover:scale-110 cursor-pointer"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="hidden md:flex flex-col justify-center w-full mb-6 lg:mb-10 flex-1">
            <div
              className="w-10 h-[2px] mb-8"
              style={{
                background: "linear-gradient(to right, #c41e3a, transparent)",
              }}
            />
            <blockquote>
              <p
                className="font-eb-garamond italic leading-relaxed text-white/70"
                style={{ fontSize: "clamp(20px, 2.5vw, 32px)" }}
              >
                "The beauty of a move lies not in its appearance but in the
                thought behind it."
              </p>
              <footer
                className="font-cinzel text-[11px] uppercase tracking-[0.22em] mt-6"
                style={{ color: "rgba(196,30,58,0.7)" }}
              >
                — Savielly Tartakower
              </footer>
            </blockquote>
          </div>

          <div className="flex w-full justify-center md:justify-start mt-auto pb-4 lg:pl-[58%] xl:pl-[61%] 2xl:pl-[63%]">
            <div className="flex justify-between w-full md:grid md:grid-cols-2 md:w-auto md:justify-start gap-x-4 md:gap-x-24 lg:gap-x-32 gap-y-0 lg:min-w-[500px]">
              {columns.map((col) => (
                <div key={col.heading} className="flex flex-col">
                  <h3
                    className="font-cinzel font-bold text-[13px] uppercase select-none"
                    style={{
                      letterSpacing: "0.15em",
                      color: "rgba(255,255,255,0.45)",
                      borderBottom: "1px solid rgba(196,30,58,0.3)",
                      paddingBottom: "14px",
                      marginBottom: "24px",
                    }}
                  >
                    {col.heading}
                  </h3>
                  <div className="flex flex-col">
                    {col.links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center font-eb-garamond font-normal text-[18px] text-white/85 transition-all duration-300 ease-out hover:text-[#c41e3a]"
                        style={{
                          lineHeight: "2.4",
                          letterSpacing: "0.015em",
                        }}
                      >
                        <span className="h-[1px] bg-[#c41e3a] transition-all duration-300 ease-out w-0 group-hover:w-6 group-hover:mr-3" />
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-3 pt-6 mt-6"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <span className="font-cinzel text-[10px] text-white/50 uppercase tracking-[0.18em] text-center sm:text-left">
              © {new Date().getFullYear()} En Passant · ABESEC
            </span>
            
            <div className="flex items-center justify-center gap-4">
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="font-inter text-[12px] text-white/50 hover:text-white/80 transition-colors duration-200"
              >
                Privacy
              </Link>
              <span className="text-white/20 pointer-events-none">·</span>
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="font-inter text-[12px] text-white/50 hover:text-white/80 transition-colors duration-200"
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
