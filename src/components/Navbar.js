import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default async function Navbar() {
  const { userId } = await auth();

  return (
    <header className="absolute top-8 left-0 right-0 z-50 flex justify-center w-full px-6 md:px-12">
      <div className="w-full max-w-7xl flex items-center justify-between">
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
            className="text-white text-xs md:text-sm font-medium tracking-widest uppercase hover:text-[var(--brand-crimson)] transition-colors"
          >
            Leaderboard
          </Link>
          <Link
            href="/events"
            className="text-white text-xs md:text-sm font-medium tracking-widest uppercase hover:text-[var(--brand-crimson)] transition-colors"
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
              <Link href="/sign-in" className="btn-bracket">
                <div className="btn-inner">GET STARTED</div>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
