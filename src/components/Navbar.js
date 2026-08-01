"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserButton, useAuth } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import SpecularButton from "@/components/SpecularButton";

export default function Navbar() {
  const { userId } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed left-0 right-0 z-50 flex justify-center w-full px-4 md:px-8 transition-all duration-300 ${
          scrolled ? "top-4 md:top-6" : "top-8"
        }`}
      >
        <div
          className={`w-full max-w-7xl flex items-center justify-between transition-all duration-300 ${
            scrolled
              ? "bg-[#050505]/70 backdrop-blur-md shadow-2xl rounded-2xl md:rounded-full px-6 md:px-10 py-4"
              : "bg-transparent px-4 md:px-0 py-2 md:py-0"
          }`}
        >
          {/* Logo */}
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-white text-base md:text-lg font-bold tracking-[0.3em] uppercase hover:opacity-70 transition-opacity z-50"
          >
            <Image src={"/logo.png"} alt="Logo" width={28} height={28} />
          </Link>

          {/* Nav Links & Auth (Desktop) */}
          <nav className="hidden md:flex items-center gap-5 md:gap-8">
            <Link
              href="/leaderboard"
              className="text-white text-xs md:text-sm font-medium tracking-widest uppercase hover:text-[#9b1a1a] transition-colors"
            >
              Leaderboard
            </Link>
            <Link
              href="/recruitment"
              className="text-white text-xs md:text-sm font-medium tracking-widest uppercase hover:text-[#9b1a1a] transition-colors"
            >
              Recruitment
            </Link>

            {/* Subtle vertical divider */}
            <div className="w-px h-5 bg-white/20 mx-2"></div>

            {userId ? (
              <div className="flex items-center pl-2">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{ elements: { avatarBox: "w-9 h-9 shadow-md" } }}
                />
              </div>
            ) : (
              <div className="flex items-center gap-4 md:gap-6">
                <SpecularButton
                  size="sm"
                  radius={8}
                  lineColor="#ff3333"
                  baseColor="#444444"
                  textColor="#ffffff"
                  intensity={2}
                  thickness={2}
                  onClick={() => router.push("/auth/sign-in")}
                  className="font-bold tracking-widest uppercase"
                >
                  GET STARTED
                </SpecularButton>
              </div>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center z-50">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-[#9b1a1a] transition-colors p-2"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-[#050505]/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center transition-all duration-300 md:hidden ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col items-center gap-8">
          <Link
            href="/leaderboard"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-white text-2xl font-black tracking-widest uppercase hover:text-[#9b1a1a] transition-colors"
          >
            Leaderboard
          </Link>
          <Link
            href="/recruitment"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-white text-2xl font-black tracking-widest uppercase hover:text-[#9b1a1a] transition-colors"
          >
            Recruitment
          </Link>

          <div className="w-12 h-px bg-white/20 my-4"></div>

          {userId ? (
            <div className="flex flex-col items-center gap-4 mt-2">
              <span className="text-white/50 text-xs tracking-widest uppercase">
                Account
              </span>
              <UserButton
                afterSignOutUrl="/"
                appearance={{ elements: { avatarBox: "w-14 h-14 shadow-md" } }}
              />
            </div>
          ) : (
            <div className="mt-4">
              <SpecularButton
                size="md"
                radius={12}
                lineColor="#ff3333"
                baseColor="#444444"
                textColor="#ffffff"
                intensity={2}
                thickness={3}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push("/auth/sign-in");
                }}
                className="font-bold tracking-widest uppercase text-base"
              >
                GET STARTED
              </SpecularButton>
            </div>
          )}
        </nav>
      </div>
    </>
  );
}
