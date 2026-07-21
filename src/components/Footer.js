import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#0a0a0a] text-white/40 py-8">
      <div className="max-w-screen-xl mx-auto px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs tracking-widest uppercase">
        <span>© {new Date().getFullYear()} En Passant</span>
        <div className="flex items-center gap-8">
          <Link href="#privacy" className="hover:text-white transition-colors">
            Privacy
          </Link>
          <Link href="#terms" className="hover:text-white transition-colors">
            Terms
          </Link>
          <Link href="#contact" className="hover:text-white transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
