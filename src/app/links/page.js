"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FaInstagram, FaWhatsapp, FaDiscord, FaGithub, FaChessPawn } from "react-icons/fa6";

const links = [
  {
    title: "Instagram",
    url: "https://www.instagram.com/enpassant.abesec",
    icon: <FaInstagram size={20} />,
    description: "Follow us for updates and chess memes",
  },
  {
    title: "WhatsApp Community",
    url: "https://chat.whatsapp.com/IoiMk9ru9CpEew7dHJkHve",
    icon: <FaWhatsapp size={20} />,
    description: "Free to join our community group",
  },
  {
    title: "Discord Server",
    url: "https://discord.com/invite/Edtgnxnc37",
    icon: <FaDiscord size={20} />,
    description: "Join the voice channels & discussions",
  },
  {
    title: "Chess.com Club",
    url: "https://www.chess.com/club/en-passant-abesec/join",
    icon: <FaChessPawn size={20} />,
    description: "Compete in our online tournaments",
  },
  {
    title: "GitHub Organization",
    url: "https://github.com/EnPassant-Chess-Forum-ABESEC",
    icon: <FaGithub size={20} />,
    description: "Check out our open source projects",
  },
];

export default function LinksPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center pt-32 pb-20 px-4 relative overflow-hidden font-sans">
      
      {/* Noise Texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
          transform: "translateZ(0)",
          willChange: "transform",
        }}
      />
      
      {/* Subtle Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.06)_0%,transparent_60%)] pointer-events-none z-0" />

      <div className="z-10 w-full max-w-lg flex flex-col items-center">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-16 w-full"
        >
          <div className="w-24 h-24 mb-6 relative">
            <Image
              src="/common/logo.png"
              alt="En Passant Logo"
              fill
              className="object-contain"
            />
          </div>
          
          <h1 
            className="font-prfaExtrabold text-3xl md:text-4xl text-white uppercase tracking-wider mb-2"
          >
            <span className="text-[#9b1a1a]">EN</span>
            <span className="bg-gradient-to-b from-[#ffffff] via-[#cccccc] to-[#555555] bg-clip-text text-transparent">PASSANT</span>
          </h1>
          
          <div className="w-12 h-[2px] bg-gradient-to-r from-[#9b1a1a] to-transparent mb-6" />
          
          <p className="text-white/60 text-center font-sans text-sm tracking-wide max-w-sm">
            Join the ABESEC Chess Community.
            <br />
            Connect, compete, and improve together.
          </p>
        </motion.div>

        {/* Links Section */}
        <div className="w-full flex flex-col gap-5">
          {links.map((link, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.1 }}
              className="w-full flex justify-center"
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-bracket group w-full cursor-good"
              >
                <div 
                  className="btn-inner w-full flex items-center justify-between !bg-[#0a0a0a] hover:!bg-[#9b1a1a] !text-white transition-all duration-300 ease-in-out !px-5 !py-4"
                  style={{ textTransform: "none", letterSpacing: "normal" }}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="text-white/70 group-hover:text-white transition-colors duration-300 shrink-0">
                      {link.icon}
                    </div>
                    <div className="flex flex-col min-w-0 text-left">
                      <span className="font-sans font-bold text-[15px] uppercase tracking-wider text-white">
                        {link.title}
                      </span>
                      <span className="font-sans text-[12px] text-white/50 group-hover:text-white/80 truncate mt-0.5">
                        {link.description}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-[#9b1a1a] group-hover:text-white transition-colors duration-300 shrink-0 ml-4 opacity-50 group-hover:opacity-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </div>
        
        {/* Footer Branding */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-20 flex flex-col items-center"
        >
          <span className="font-sans text-[10px] text-white/30 uppercase tracking-[0.2em] mb-2">
            For the game must always go on
          </span>
          <div className="flex items-center gap-3 opacity-20">
            <span className="w-12 h-px bg-white" />
            <span className="font-pezula text-sm">EN PASSANT</span>
            <span className="w-12 h-px bg-white" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
