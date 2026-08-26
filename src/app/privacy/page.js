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
        "Your information is securely maintained and used only for club operations and services provided through the platform. We do not sell member data or share it with third parties for advertising or unrelated purposes.",
    },
    {
      title: "Chess Account Integration",
      content:
        "Members may optionally link external chess accounts, such as Chess.com, to their club profile. We may receive account identifiers, usernames, ratings, and other chess-related information made available by these platforms. This information is used to verify account ownership, maintain chess profiles, and operate club rankings and related features.",
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
        "We use trusted third-party service providers where necessary to operate the platform, including services for authentication, cloud storage, email delivery, and chess account integration. These providers process only the information necessary for the services they provide and are not permitted to use member information for unrelated purposes.",
    },
    {
      title: "Data Retention",
      content:
        "We retain personal information only for as long as reasonably necessary for club operations, membership records, and legitimate administrative purposes. Members may request deletion of their personal records from active club rosters after leaving or concluding their tenure with the club, subject to records that may need to be retained for legitimate administrative or legal purposes.",
    },
    {
      title: "Account Security",
      content:
        "Members are responsible for maintaining the security of their club accounts and must not share account credentials or attempt to access another member's account. We may suspend or remove accounts involved in unauthorized access, impersonation, abuse, or other violations of our Terms of Service.",
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

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 lg:gap-y-16"
        >
          {policies.map((policy, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col"
            >
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
