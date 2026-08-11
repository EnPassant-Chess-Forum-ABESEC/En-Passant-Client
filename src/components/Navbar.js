"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { UserButton, useAuth } from "@clerk/nextjs";
import { Menu, X, User } from "lucide-react";

import { userButtonAppearance } from "@/lib/clerkAppearance";
import { useApi } from "@/lib/api";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

export default function Navbar() {
  const { userId } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const fetchApi = useApi();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [myApplication, setMyApplication] = useState(null);

  // Scroll direction detection
  const [navVisible, setNavVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 20);

      // Only hide/show after we've scrolled a bit to avoid flicker
      if (currentY > 100) {
        setNavVisible(currentY < lastScrollY.current);
      } else {
        setNavVisible(true);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (userId) {
      fetchApi("/recruitment/my-application")
        .then((res) => setMyApplication(res.myApplication))
        .catch(() => {});
    }
  }, [userId, fetchApi]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
  }, [isMobileMenuOpen]);

  const recruitmentPath =
    myApplication &&
    !["DRAFT", "PAYMENT_PENDING", "PAYMENT_FAILED"].includes(
      myApplication.status,
    )
      ? "/recruitment/dashboard"
      : "/recruitment";

  const navLinks = [
    { name: "Leaderboard", path: "/leaderboard" },
    { name: "Gallery", path: "/gallery" },
    { name: "Team", path: "/team" },
    { name: "Recruitment", path: recruitmentPath },
  ];

  const isActive = (path) => pathname.startsWith(path) && path !== "/";

  return (
    <>
      {/* ── Desktop & Mobile Header ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
        style={{
          opacity: navVisible ? 1 : 0,
          pointerEvents: navVisible ? "auto" : "none",
          transition: "opacity 0.35s ease-out",
        }}
      >
        <div
          className="w-full transition-all duration-500 ease-out bg-transparent"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 h-16 md:h-20">
            {/* Logo */}
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative z-50 flex items-center hover:opacity-70 transition-opacity"
            >
              <Image
                src="/logo.png"
                alt="EnPassant"
                width={26}
                height={26}
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`
                    group relative font-inter font-semibold text-[13px] tracking-[0.14em] uppercase
                    transition-colors duration-200 py-1
                    ${isActive(link.path)
                      ? "text-[#c41e3a]"
                      : "text-[#a0a0a0] group-hover:text-white"
                    }
                  `}
                >
                  {/* Light Flair Background */}
                  <div
                    className={`
                      absolute inset-0 top-1/2 -translate-y-1/2 -z-10
                      bg-[radial-gradient(ellipse_at_center,rgba(196,30,58,0.35)_0%,transparent_70%)]
                      blur-[4px] scale-150 transition-all duration-300 ease-out pointer-events-none
                      ${isActive(link.path) ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
                    `}
                  />
                  <span className={`relative z-10 transition-all duration-300 ${isActive(link.path) ? "drop-shadow-[0_0_8px_rgba(196,30,58,0.8)]" : "group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"}`}>
                    {link.name}
                  </span>
                </Link>
              ))}

              {/* Divider */}
              <div className="w-px h-4 bg-white/15" />

              {/* Auth */}
              {userId ? (
                <UserButton
                  afterSignOutUrl="/"
                  appearance={userButtonAppearance}
                >
                  <UserButton.MenuItems>
                    <UserButton.Link
                      label="Profile"
                      labelIcon={<User size={15} color="#ffffff" strokeWidth={2} />}
                      href="/profile"
                    />
                    <UserButton.Action label="signOut" />
                  </UserButton.MenuItems>
                </UserButton>
              ) : (
                <button
                  onClick={() => router.push("/auth/sign-in")}
                  className="
                    relative font-inter font-semibold text-[12px] tracking-[0.12em] uppercase
                    text-white/80 hover:text-white px-4 py-2 rounded-md
                    bg-white/5 hover:bg-[#c41e3a]/10
                    border border-white/10 hover:border-[#c41e3a]/50
                    transition-all duration-300
                    active:scale-[0.97]
                  "
                >
                  GET STARTED
                </button>
              )}
            </nav>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative z-50 text-white/80 hover:text-white transition-colors p-1"
              aria-label="Toggle Menu"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="x"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X size={22} strokeWidth={2} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="m"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu size={22} strokeWidth={2} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Overlay ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-[#0a0a0a]/98 backdrop-blur-md flex flex-col items-center justify-center md:hidden"
          >
            <nav className="flex flex-col items-center gap-7">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.05 * i, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      group relative font-inter font-semibold text-[15px] tracking-[0.12em] uppercase
                      transition-colors duration-200 py-1
                      ${isActive(link.path)
                        ? "text-[#c41e3a]"
                        : "text-white/60 hover:text-white/90"
                      }
                    `}
                  >
                    {/* Light Flair Background */}
                    <div
                      className={`
                        absolute inset-0 top-1/2 -translate-y-1/2 -z-10
                        bg-[radial-gradient(ellipse_at_center,rgba(196,30,58,0.35)_0%,transparent_70%)]
                        blur-[4px] scale-150 transition-all duration-300 ease-out pointer-events-none
                        ${isActive(link.path) ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
                      `}
                    />
                    <span className={`relative z-10 transition-all duration-300 ${isActive(link.path) ? "drop-shadow-[0_0_8px_rgba(196,30,58,0.8)]" : "group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"}`}>
                      {link.name}
                    </span>
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-10 h-px bg-white/15 my-2"
              />

              <motion.div
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {userId ? (
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-white/30 text-[10px] tracking-[0.2em] uppercase font-inter">
                      Account
                    </span>
                    <UserButton afterSignOutUrl="/" appearance={userButtonAppearance}>
                      <UserButton.MenuItems>
                        <UserButton.Link
                          label="Profile"
                          labelIcon={<User size={15} color="#ffffff" strokeWidth={2} />}
                          href="/profile"
                        />
                        <UserButton.Action label="manageAccount" />
                        <UserButton.Action label="signOut" />
                      </UserButton.MenuItems>
                    </UserButton>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      router.push("/auth/sign-in");
                    }}
                    className="
                      font-inter font-semibold text-[12px] tracking-[0.12em] uppercase
                      text-white/80 hover:text-white px-5 py-2.5 rounded-md
                      bg-white/5 hover:bg-[#c41e3a]/10
                      border border-white/10 hover:border-[#c41e3a]/50
                      transition-all duration-300
                      active:scale-[0.97]
                    "
                  >
                    GET STARTED
                  </button>
                )}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
