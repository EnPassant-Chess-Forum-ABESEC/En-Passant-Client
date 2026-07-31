"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";

export default function Navbar() {
  const { userId } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 z-50 flex justify-center w-full px-4 md:px-8 transition-all duration-300 ${
        scrolled ? "top-4 md:top-6" : "top-8"
      }`}
    >
      <div
        className={`w-full max-w-7xl flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? "bg-[#050505]/70 backdrop-blur-md shadow-2xl rounded-2xl md:rounded-full px-6 md:px-10 py-4"
            : "bg-transparent px-2 md:px-0 py-2 md:py-0"
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          className="text-white text-base md:text-lg font-bold tracking-[0.3em] uppercase hover:opacity-70 transition-opacity"
        >
          LOGO
        </Link>

        {/* Nav Links & Auth */}
        <nav className="flex items-center gap-5 md:gap-8">
          <Link
            href="/leaderboard"
            className="text-white text-xs md:text-sm font-medium tracking-widest uppercase hover:text-[#9b1a1a] transition-colors"
          >
            Leaderboard
          </Link>
          <Link
            href="/events"
            className="text-white text-xs md:text-sm font-medium tracking-widest uppercase hover:text-[#9b1a1a] transition-colors"
          >
            Events
          </Link>

          {/* Subtle vertical divider to separate links from auth actions */}
          <div className="hidden md:block w-px h-5 bg-white/20 mx-2"></div>

          {userId ? (
            <div className="flex items-center pl-2">
              <UserButton
                afterSignOutUrl="/"
                appearance={{ elements: { avatarBox: "w-9 h-9 shadow-md" } }}
              />
            </div>
          ) : (
            <div className="flex items-center gap-4 md:gap-6">
              <Link href="/auth/sign-in" className="btn-bracket">
                <div className="btn-inner">GET STARTED</div>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
