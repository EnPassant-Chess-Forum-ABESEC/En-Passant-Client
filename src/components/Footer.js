"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaWhatsapp, FaInstagram, FaDiscord } from "react-icons/fa";
import { SiChessdotcom } from "react-icons/si";
import { Copyright, ArrowUp } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import FloatingDustParticles from "@/components/ui/FloatingDustParticles";

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
    icon: <FaWhatsapp size={18} />,
  },
  {
    label: "Chess.com",
    href: "https://www.chess.com/club/en-passant-abesec",
    icon: <SiChessdotcom size={18} />,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/enpassant.abesec/",
    icon: <FaInstagram size={18} />,
  },
  {
    label: "Discord",
    href: "https://discord.gg/WDF4UXrXC",
    icon: <FaDiscord size={18} />,
  },
];

export default function Footer() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const footerRef = useRef(null);

  // Parallax Scroll Tracking: target is the footer, tracking as it enters and leaves viewport
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });

  // Parallax Layer Transforms (coming in & going out based on scroll):
  // 1. Content Translation & Smooth Fade In/Out with scroll
  const yContent = useTransform(scrollYProgress, [0, 1], ["36px", "0px"]);
  const opacityContent = useTransform(scrollYProgress, [0, 0.45, 1], [0.4, 0.95, 1]);
  const scaleContent = useTransform(scrollYProgress, [0, 1], [0.985, 1]);

  // 2. Ambient Crimson Glow Parallax
  const yGlow = useTransform(scrollYProgress, [0, 1], ["14%", "0%"]);
  const scaleGlow = useTransform(scrollYProgress, [0, 1], [0.88, 1.08]);

  // 3. Atmospheric Transition Fade Overlay at top of footer
  const fadeOpacity = useTransform(scrollYProgress, [0, 0.35, 1], [0.65, 0.95, 1]);

  const contentStyle = shouldReduceMotion
    ? {}
    : {
        y: yContent,
        opacity: opacityContent,
        scale: scaleContent,
      };

  const glowStyle = shouldReduceMotion
    ? {}
    : {
        y: yGlow,
        scale: scaleGlow,
      };

  const fadeStyle = shouldReduceMotion
    ? {}
    : {
        opacity: fadeOpacity,
      };

  // Soft cursor-following spotlight tracking (React Bits / Aceternity style)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!footerRef.current) return;
    const rect = footerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Scroll into view staggered blur-to-sharp animation variants (Magic UI BlurFade pattern)
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: shouldReduceMotion
      ? { opacity: 0 }
      : {
          opacity: 0,
          y: 18,
          filter: "blur(6px)",
        },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer
      ref={footerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full relative z-20 bg-[#050505] text-[#f1f5f9] select-none"
      aria-label="Site Footer"
    >
      {/* 
        === SEAMLESS FADE-IN / FADE-OUT TRANSITION ZONE === 
        Ensures the preceding website page dissolves gracefully into the footer
        with zero sharp cuts or hard lines.
      */}
      {/* 1. Upward bleed overlay: dissolves page content above footer into #050505 */}
      <motion.div
        style={fadeStyle}
        className="absolute -top-28 sm:-top-36 md:-top-48 inset-x-0 h-28 sm:h-36 md:h-48 bg-gradient-to-t from-[#050505] via-[#050505]/85 via-50% to-transparent pointer-events-none z-30"
        aria-hidden="true"
      />

      {/* 2. Atmospheric Crimson Mist bridging the page and footer boundary */}
      <div
        className="absolute -top-16 sm:-top-24 inset-x-0 h-28 sm:h-40 bg-[radial-gradient(ellipse_75%_55%_at_50%_100%,rgba(155,26,26,0.06),transparent_75%)] pointer-events-none z-25"
        aria-hidden="true"
      />

      {/* 3. Downward feathering overlay: smoothly introduces footer atmosphere */}
      <motion.div
        style={fadeStyle}
        className="absolute top-0 inset-x-0 h-24 sm:h-36 md:h-48 bg-gradient-to-b from-[#050505] via-[#050505]/90 via-40% to-transparent pointer-events-none z-20"
        aria-hidden="true"
      />

      {/* Clipped background elements container (ensures no horizontal overflow on mobile) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        {/* Film-grain / Noise Texture overlay for cinematic tangible depth */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.025] z-[1]"
          aria-hidden="true"
        >
          <filter id="footer-grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#footer-grain)" />
        </svg>

        {/* Tiny Floating Dust Particles / Embers drifting upward slowly */}
        <FloatingDustParticles />

        {/* Soft Crimson Radial Glow Behind Title Area with Parallax */}
        <motion.div
          style={glowStyle}
          className="absolute top-10 left-4 sm:left-12 w-[340px] sm:w-[480px] h-[340px] sm:h-[480px] rounded-full pointer-events-none z-0"
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(155, 26, 26, 0.08) 0%, rgba(155, 26, 26, 0.02) 45%, transparent 70%)",
            }}
          />
        </motion.div>

        {/* Soft Vignette so edges fall off seamlessly into pure black */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background:
              "radial-gradient(ellipse 95% 85% at 50% 50%, transparent 40%, rgba(5, 5, 5, 0.75) 85%, #050505 100%)",
          }}
          aria-hidden="true"
        />

        {/* Soft Cursor-Following Spotlight Overlay (React Bits / Aceternity style) */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-700 ease-out z-[1]"
          style={{
            opacity: isHovered && !shouldReduceMotion ? 1 : 0,
            background: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, rgba(155, 26, 26, 0.045), transparent 75%)`,
          }}
          aria-hidden="true"
        />
      </div>

      {/* Main Content Container with Scroll Parallax (coming in and going out with scroll) */}
      <motion.div
        style={contentStyle}
        className="relative z-10 w-full"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="max-w-7xl mx-auto w-full px-6 md:px-10 pt-20 sm:pt-24 lg:pt-28 pb-12 sm:pb-14"
        >
          {/* 12-Column Desktop Grid / Single-Column Mobile Stack */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start w-full">
            {/* Left Column (Brand, Tagline, Socials, Quote) - ~60% Width */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left"
            >
              {/* Brand Title: VIVE L' EN PASSANT */}
              <h2
                className="font-black uppercase tracking-[0.04em] leading-[1.05] select-none"
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: "clamp(30px, 4.2vw, 54px)",
                }}
              >
                <span
                  style={{
                    background:
                      "linear-gradient(180deg, #ffffff 0%, #e2e8f0 45%, #94a3b8 80%, #64748b 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    filter: "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.9))",
                  }}
                  className="inline-block"
                >
                  Vive L&apos; EN
                </span>{" "}
                {/* PASSANT with gentle breathing ambient crimson glow */}
                <motion.span
                  animate={
                    shouldReduceMotion
                      ? {}
                      : {
                          filter: [
                            "drop-shadow(0 4px 14px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 16px rgba(220, 38, 38, 0.2))",
                            "drop-shadow(0 4px 14px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 24px rgba(220, 38, 38, 0.38))",
                            "drop-shadow(0 4px 14px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 16px rgba(220, 38, 38, 0.2))",
                          ],
                        }
                  }
                  transition={{
                    duration: 5,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                  style={{
                    background:
                      "linear-gradient(180deg, #ff7171 0%, #ef4444 25%, #dc2626 50%, #991b1b 75%, #550707 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                  className="inline-block"
                >
                  PASSANT
                </motion.span>
              </h2>

              {/* Tagline */}
              <p
                className="mt-3.5 text-[11px] sm:text-xs text-[#94a3b8] uppercase font-semibold select-none"
                style={{
                  fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                  letterSpacing: "0.26em",
                }}
              >
                For the game must always go on
              </p>

              {/* Social Outlined Circular Buttons (44px min tap target, silvery refined hover) */}
              <div className="flex items-center gap-3 mt-7">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center text-white/45 transition-all duration-300 ease-out hover:border-white/40 hover:text-white hover:bg-white/[0.05] hover:shadow-[0_0_16px_rgba(255,255,255,0.18)] hover:-translate-y-[2px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 cursor-pointer"
                  >
                    <span className="transition-transform duration-200">
                      {s.icon}
                    </span>
                  </a>
                ))}
              </div>

              {/* Quote: Subtle, minimal, clean & understated */}
              <div className="mt-8 sm:mt-10 max-w-lg w-full">
                <blockquote>
                  <p
                    className="text-[#e2e8f0]/90 select-none font-normal"
                    style={{
                      fontFamily: "var(--font-pinyon), 'Pinyon Script', cursive",
                      fontSize: "clamp(1.15rem, 1.35vw, 1.35rem)",
                      lineHeight: 1.6,
                      letterSpacing: "0.01em",
                    }}
                  >
                    &ldquo;The beauty of a move lies not in its appearance but in
                    the thought behind it.&rdquo;
                  </p>
                  {/* Attribution: Clean, minimal small-caps standing alone under the quote */}
                  <footer className="mt-2.5 flex items-center justify-center lg:justify-start">
                    <span
                      className="text-[10px] uppercase font-bold text-[#ff7171]/85 select-none"
                      style={{
                        fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                        letterSpacing: "0.24em",
                      }}
                    >
                      SAVIELLY TARTAKOWER
                    </span>
                  </footer>
                </blockquote>
              </div>
            </motion.div>

            {/* Right Column (Directory Link Columns) - ~40% Width */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-8 sm:gap-12 w-full lg:pl-6 pt-2 lg:pt-4">
              {columns.map((col) => (
                <motion.nav
                  key={col.heading}
                  variants={itemVariants}
                  aria-label={`${col.heading} Navigation`}
                  className="flex flex-col"
                >
                  {/* Clean Plain Tracked Small-Caps Heading */}
                  <h3
                    className="text-[12px] sm:text-[13px] uppercase font-bold select-none text-[#e2e8f0]"
                    style={{
                      fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                      letterSpacing: "0.22em",
                    }}
                  >
                    {col.heading}
                  </h3>

                  {/* Thin Hairline Divider Underneath */}
                  <div
                    className="h-[1px] w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent mt-2 mb-4"
                    aria-hidden="true"
                  />

                  {/* Directory Links: Smooth Brightening, Soft Text Glow, 3px Nudge (NO RED LINES) */}
                  <div className="flex flex-col gap-1 items-start">
                    {col.links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="flex items-center min-h-[44px] py-1 text-[13px] sm:text-[14px] text-[#94a3b8] transition-all duration-300 ease-out hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] hover:translate-x-[3px] focus:outline-none focus-visible:text-white focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:shadow-[0_0_12px_rgba(255,255,255,0.2)] rounded px-1 select-none"
                        style={{
                          fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                          fontWeight: 600,
                          letterSpacing: "0.16em",
                        }}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </motion.nav>
              ))}
            </div>
          </div>

          {/* Bottom Bar: Formal Inscription, Legal Links, and Back to Top */}
          <motion.div
            variants={itemVariants}
            className="mt-16 sm:mt-20 pt-7 border-t border-[#2c1717]/60 flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-4 w-full"
          >
            {/* Left: Copyright */}
            <span
              className="text-[11px] text-[#94a3b8] uppercase text-center sm:text-left flex items-center justify-center sm:justify-start gap-1.5 select-none"
              style={{
                fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                letterSpacing: "0.2em",
                fontWeight: 600,
              }}
            >
              <Copyright
                strokeWidth={2.5}
                className="w-[12px] h-[12px] mt-px text-[#94a3b8]/60"
                aria-hidden="true"
              />{" "}
              {new Date().getFullYear()} EN PASSANT · ABESEC
            </span>

            {/* Right: Legal & Back to Top (with extra clearance to avoid floating elements) */}
            <div className="flex items-center justify-center flex-wrap gap-5 sm:gap-6 pr-2 sm:pr-0">
              <Link
                href="/privacy"
                className="text-[11px] text-[#94a3b8] hover:text-white hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.35)] uppercase transition-all duration-200 focus:outline-none focus-visible:text-white focus-visible:ring-2 focus-visible:ring-white/20 rounded px-1 select-none"
                style={{
                  fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                  letterSpacing: "0.18em",
                  fontWeight: 600,
                }}
              >
                Privacy
              </Link>

              <span className="text-[#94a3b8]/30 pointer-events-none select-none">
                ·
              </span>

              <Link
                href="/terms"
                className="text-[11px] text-[#94a3b8] hover:text-white hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.35)] uppercase transition-all duration-200 focus:outline-none focus-visible:text-white focus-visible:ring-2 focus-visible:ring-white/20 rounded px-1 select-none"
                style={{
                  fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                  letterSpacing: "0.18em",
                  fontWeight: 600,
                }}
              >
                Terms
              </Link>

              <span className="text-[#94a3b8]/30 pointer-events-none select-none">
                ·
              </span>

              {/* Back to Top */}
              <button
                type="button"
                onClick={scrollToTop}
                className="group flex items-center gap-1.5 text-[11px] uppercase text-[#94a3b8] hover:text-white hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.35)] transition-all duration-200 cursor-pointer focus:outline-none focus-visible:text-white focus-visible:ring-2 focus-visible:ring-white/20 rounded px-1 select-none"
                style={{
                  fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                  letterSpacing: "0.18em",
                  fontWeight: 600,
                }}
                aria-label="Scroll back to top"
              >
                <span>Top</span>
                <ArrowUp
                  className="w-3.5 h-3.5 text-white/50 group-hover:text-white transition-all duration-300 ease-out group-hover:-translate-y-1"
                  aria-hidden="true"
                />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
