"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="w-full h-screen bg-black text-[#a3a3a3] font-sans flex flex-col justify-between overflow-hidden relative">
      
      {/* Push content down slightly from the very top if needed */}
      <div className="pt-20 md:pt-32">
        {/* Borderless Grid Section */}
        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-0 px-4 md:px-0">
          
          {/* Column 1: Subscribe */}
          <div className="p-4 md:p-12 flex flex-col justify-start">
            <h3 className="text-[#666666] text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-6">
              Subscribe to stay in touch
            </h3>
            <input
              type="email"
              placeholder="ENTER EMAIL ADDRESS..."
              className="w-full bg-[#0a0a0a] text-[#e5e5e5] text-xs px-4 py-3 focus:outline-none focus:bg-[#111111] transition-colors placeholder:text-[#444444] rounded-none"
            />
          </div>

          {/* Column 2: Navigation */}
          <div className="p-4 md:p-12 flex flex-col justify-start">
            <h3 className="text-[#666666] text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-6">
              Navigation
            </h3>
            <ul className="flex flex-col gap-3 text-xs md:text-sm text-[#a3a3a3] font-medium tracking-wide">
              <li><Link href="/about" className="hover:text-white transition-colors duration-200 block">About us</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors duration-200 block">Services</Link></li>
              <li><Link href="/cases" className="hover:text-white transition-colors duration-200 block">Cases</Link></li>
              <li><Link href="/team" className="hover:text-white transition-colors duration-200 block">Team</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors duration-200 block">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="p-4 md:p-12 flex flex-col justify-start">
            <h3 className="text-[#666666] text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-6">
              Make your move
            </h3>
            <div className="flex flex-col gap-4 text-xs md:text-sm text-[#a3a3a3] font-medium tracking-wide">
              <p className="flex flex-col gap-1">
                <span className="text-[#555555] text-[10px] uppercase tracking-wider">Text</span>
                <a href="mailto:contact@enpassant.com" className="hover:text-white transition-colors duration-200">
                  contact@enpassant.com
                </a>
              </p>
              <p className="flex flex-col gap-1">
                <span className="text-[#555555] text-[10px] uppercase tracking-wider">Call</span>
                <a href="tel:+15550000000" className="hover:text-white transition-colors duration-200">
                  +1 (555) 000-0000
                </a>
              </p>
            </div>
          </div>

          {/* Column 4: Legal */}
          <div className="p-4 md:p-12 flex flex-col justify-start">
            <h3 className="text-[#666666] text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-6 invisible hidden md:block">
              Legal
            </h3>
            <ul className="flex flex-col gap-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[#666666]">
              <li><Link href="/privacy" className="hover:text-white transition-colors duration-200 block">Privacy Policy</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition-colors duration-200 block">Cookies</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors duration-200 block">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Giant Hero Text Section */}
      <div className="w-full flex justify-center items-end pb-4 mt-auto">
        <h1 className="text-[18vw] leading-[0.8] font-black tracking-tighter m-0 p-0 text-transparent bg-clip-text bg-gradient-to-b from-white via-[#888888] to-black uppercase select-none w-full text-center">
          PASSANT
        </h1>
      </div>
    </footer>
  );
}
