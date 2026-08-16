"use client";

import ChessGridBackground from "@/components/ChessGridBackground";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  const policies = [
    {
      title: "Data Collection",
      content:
        "We collect essential information such as your name, student ID, and email address solely for membership verification, tournament organization, and official club communications.",
    },
    {
      title: "Data Usage",
      content:
        "Your information is securely maintained and strictly used for club operations. We do not distribute, share, or sell member data to any third parties under any circumstances.",
    },
    {
      title: "Media & Photography",
      content:
        "We document our events for promotional and archival purposes. By attending, you consent to being photographed. Formal removal requests for specific media are honored promptly.",
    },
    {
      title: "Cookies & Authentication",
      content:
        "We use essential cookies and local storage strictly to keep you logged in and secure your session. We do not use intrusive tracking cookies, analytics pixels, or cross-site trackers.",
    },
    {
      title: "Third-Party Services",
      content:
        "We utilize trusted infrastructure providers (like Clerk) for secure authentication. They process your login credentials directly to ensure industry-standard security for your account.",
    },
    {
      title: "Data Retention",
      content:
        "You maintain the right to request the deletion of your personal records from our active club rosters at any time upon officially leaving or concluding your tenure with the club.",
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
  };

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-hidden flex flex-col items-center justify-center pt-32 pb-12 px-6 md:px-16 lg:px-24">
      <ChessGridBackground showPieces={false} />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto flex flex-col gap-12 lg:gap-20">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col text-left border-b border-white/10 pb-10"
        >
          <h2 className="flex flex-row flex-wrap gap-4 uppercase font-pezula font-bold tracking-[0.04em] md:tracking-[0.08em] leading-none">
            <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] text-[12vw] md:text-[80px] lg:text-[100px]">
              PRIVACY
            </span>
            <span className="text-[#9b1a1a] drop-shadow-[0_0_20px_rgba(155,26,26,0.4)] text-[12vw] md:text-[80px] lg:text-[100px]">
              POLICY
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

        {/* Editorial Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 lg:gap-y-16"
        >
          {policies.map((policy, index) => (
            <motion.div key={index} variants={itemVariants} className="flex flex-col">
              <h3 className="text-white font-pezula font-bold text-[18px] lg:text-[22px] tracking-[0.15em] uppercase mb-4 pb-3 border-b border-[#9b1a1a]/30 flex items-center gap-3">
                <span className="text-[#9b1a1a] font-sans text-[14px]">›</span>
                {policy.title}
              </h3>
              <p className="text-white/60 font-sans font-light text-[14px] lg:text-[16px] leading-relaxed tracking-wide">
                {policy.content}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
