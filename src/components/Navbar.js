"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { UserButton, useAuth } from "@clerk/nextjs";
import { Menu, X, User } from "lucide-react";

import { userButtonAppearance } from "@/lib/clerkAppearance";
import { useApi } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import SpecularButton from "@/components/SpecularButton";

export default function Navbar() {
  const { userId } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const fetchApi = useApi();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [myApplication, setMyApplication] = useState(null);

  const [navVisible, setNavVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 20);

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
    } else {
      setMyApplication(null);
    }
  }, [userId, fetchApi]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const recruitmentPath =
    myApplication?.status &&
    !["DRAFT", "PAYMENT_FAILED"].includes(myApplication.status)
      ? "/recruitment/dashboard"
      : "/recruitment";

  const navLinks = [
    { name: "Leaderboard", path: "/leaderboard" },
    // { name: "Gallery", path: "/event-gallery" },
    // { name: "Team", path: "/team" },
    { name: "Recruitment", path: recruitmentPath },
  ];

  const isActive = (path) => pathname.startsWith(path) && path !== "/";

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
        style={{
          opacity: navVisible ? 1 : 0,
          pointerEvents: navVisible ? "auto" : "none",
          transition: "opacity 0.35s ease-out",
        }}
      >
        <div className="w-full transition-all duration-500 ease-out bg-transparent">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 h-16 md:h-20">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative z-50 flex items-center hover:opacity-70 transition-opacity"
            >
              <Image src="/common/logo.png" alt="EnPassant" width={26} height={26} />
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`
                    group relative font-sans font-semibold text-[13px] tracking-[0.14em] uppercase
                    transition-colors duration-200 py-1
                    ${
                      isActive(link.path)
                        ? "text-[#9b1a1a]"
                        : "text-[#a0a0a0] hover:text-white"
                    }
                  `}
                >
                  <span className="relative z-10 transition-colors duration-300">
                    {link.name}
                  </span>
                </Link>
              ))}

              <div className="w-px h-4 bg-white/15" />

              {userId ? (
                <UserButton
                  afterSignOutUrl="/"
                  appearance={userButtonAppearance}
                >
                  <UserButton.MenuItems>
                    <UserButton.Link
                      label="Profile"
                      labelIcon={
                        <User size={15} color="#ffffff" strokeWidth={2} />
                      }
                      href="/profile"
                    />
                    <UserButton.Action label="signOut" />
                  </UserButton.MenuItems>
                </UserButton>
              ) : (
                <SpecularButton
                  size="sm"
                  onClick={() => router.push("/auth/sign-in")}
                  className="font-sans font-semibold tracking-[0.12em] uppercase"
                  autoAnimate={true}
                >
                  GET STARTED
                </SpecularButton>
              )}
            </nav>

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
                  transition={{
                    delay: 0.05 * i,
                    duration: 0.3,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    href={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      group relative font-sans font-semibold text-[15px] tracking-[0.12em] uppercase
                      transition-colors duration-200 py-1
                      ${
                        isActive(link.path)
                          ? "text-[#9b1a1a]"
                          : "text-white/60 hover:text-white/90"
                      }
                    `}
                  >
                    <span className="relative z-10 transition-colors duration-300">
                      {link.name}
                    </span>
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  delay: 0.2,
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="w-10 h-px bg-white/15 my-2"
              />

              <motion.div
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.25,
                  duration: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {userId ? (
                  <div className="flex flex-col items-center gap-3 w-full">
                    <span className="text-white/30 text-[10px] tracking-[0.2em] uppercase font-sans">
                      Account
                    </span>
                    <div
                      className="flex justify-center items-center w-full"
                      style={{ isolation: "isolate" }}
                    >
                      <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                          ...userButtonAppearance,
                          elements: {
                            ...userButtonAppearance.elements,
                            rootBox: {
                              display: "flex",
                              justifyContent: "center",
                            },
                            userButtonBox: {
                              display: "flex",
                              justifyContent: "center",
                            },
                            userButtonPopoverCard: {
                              ...userButtonAppearance.elements
                                .userButtonPopoverCard,
                              position: "fixed !important",
                              top: "50% !important",
                              left: "50% !important",
                              transform: "translate(-50%, -50%) !important",
                              zIndex: "9999 !important",
                              width: "min(340px, 90vw) !important",
                            },
                          },
                        }}
                      >
                        <UserButton.MenuItems>
                          <UserButton.Link
                            label="Profile"
                            labelIcon={
                              <User size={15} color="#ffffff" strokeWidth={2} />
                            }
                            href="/profile"
                          />
                          <UserButton.Action label="manageAccount" />
                          <UserButton.Action label="signOut" />
                        </UserButton.MenuItems>
                      </UserButton>
                    </div>
                  </div>
                ) : (
                  <SpecularButton
                    size="md"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      router.push("/auth/sign-in");
                    }}
                    className="font-sans font-semibold tracking-[0.12em] uppercase"
                    autoAnimate={true}
                  >
                    GET STARTED
                  </SpecularButton>
                )}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
