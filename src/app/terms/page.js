"use client";

import ChessGridBackground from "@/components/ChessGridBackground";
import { motion } from "framer-motion";

export default function TermsPage() {
  const terms = [
    {
      title: "Fair Play & Integrity",
      content:
        "Strict adherence to fair play is required. The use of chess engines, unauthorized assistance, or rating manipulation during club events will result in disciplinary action, up to and including immediate expulsion.",
    },
    {
      title: "Equipment Handling",
      content:
        "Members are expected to treat all club property, including chess boards, pieces, and digital clocks, with the utmost care and respect. Intentional damage is strictly prohibited, and members may be held responsible for damage caused through intentional or negligent behavior.",
    },
    {
      title: "Conduct Standards",
      content:
        "We maintain a competitive yet respectful environment. Harassment, discrimination, bullying, threats, or disruptive behavior towards other members will not be tolerated.",
    },
    {
      title: "Event Participation",
      content:
        "Registration for limited-capacity events requires a commitment to attend. Unnotified absences disrupt event organization and may adversely affect your future event prioritization.",
    },
    {
      title: "Account & Identity",
      content:
        "Members must provide accurate information and must not impersonate another person or attempt to associate another member's account, chess account, or other external identity with their own club profile. Unauthorized access to another member's account is strictly prohibited.",
    },
    {
      title: "Platform Usage",
      content:
        "The club platform is provided for legitimate club-related activities, including membership, events, recruitment, chess profiles, and communication. Members must not misuse the platform, attempt to circumvent security controls, interfere with its operation, or use it for unlawful or abusive purposes.",
    },
    {
      title: "External Services",
      content:
        "The platform may integrate with external services such as Chess.com, and other third-party providers. Use of these services may also be subject to their respective terms and policies. Members are responsible for complying with applicable rules when using linked external accounts.",
    },
    {
      title: "Enforcement",
      content:
        "The club reserves the right to suspend or restrict access to club facilities, events, or the online platform when necessary to address violations of these terms, protect members, or maintain the integrity of club activities. Serious violations may result in removal from the club.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-hidden flex flex-col items-center justify-center pt-32 pb-12 px-6 md:px-16 lg:px-24">
      <ChessGridBackground showPieces={false} />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto flex flex-col gap-12 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col text-left border-b border-white/10 pb-10"
        >
          <h2 className="flex flex-row flex-wrap gap-4 uppercase font-pezula font-bold tracking-[0.04em] md:tracking-[0.08em] leading-none">
            <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] text-[12vw] md:text-[80px] lg:text-[100px]">
              TERMS OF
            </span>
            <span className="text-[#9b1a1a] drop-shadow-[0_0_20px_rgba(155,26,26,0.4)] text-[12vw] md:text-[80px] lg:text-[100px]">
              SERVICE
            </span>
          </h2>
          <div className="mt-6 text-[10px] md:text-[12px] text-white/40 font-mono tracking-[0.2em] normal-case">
            Effective Date:{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 lg:gap-y-16"
        >
          {terms.map((term, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col"
            >
              <h3 className="text-white font-pezula font-bold text-[18px] lg:text-[22px] tracking-[0.15em] uppercase mb-4 pb-3 border-b border-[#9b1a1a]/30 flex items-center gap-3">
                <span className="text-[#9b1a1a] font-sans text-[14px]">›</span>
                {term.title}
              </h3>
              <p className="text-white/60 font-sans font-light text-[14px] lg:text-[16px] leading-relaxed tracking-wide">
                {term.content}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
