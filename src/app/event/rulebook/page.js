"use client";

import ChessGridBackground from "@/components/ChessGridBackground";
import { motion } from "framer-motion";

export default function RulebookPage() {
  const rules = [
    {
      title: "Time Control & Increment",
      content:
        "Each player has 10 minutes for the entire game with an increment of 5 seconds per move (10 + 5 format). If a player's time runs out, they lose the game unless their opponent has insufficient material to deliver checkmate, in which case the game is declared a draw.",
    },
    {
      title: "Chess.com Profile Requirement",
      content:
        "Players must have an active Chess.com account with at least 5 games played in the stated tournament format (10+5 Rapid) to be eligible for active participation in events.",
    },
    {
      title: "Reporting & Attendance",
      content:
        "Players must reach the venue at least 15 minutes before the match start time to participate. No excuses for late arrival will be entertained, and failure to report on time may result in match forfeiture.",
    },
    {
      title: "Touch-Move: Own Pieces",
      content:
        "If a player touches one of their own pieces with the intention of moving it, they must move that piece if it has a legal move available on the board.",
    },
    {
      title: "Touch-Move: Opponent Pieces",
      content:
        "If a player touches an opponent's piece with the intention of capturing it, they must capture that piece if it is legally possible to do so.",
    },
    {
      title: "Piece Adjustment",
      content:
        'A player may adjust a piece on the board only by clearly saying "adjust" before touching it. Failure to say that beforehand will lead to the assumption that the piece was touched with the intention of moving or capturing.',
    },
    {
      title: "Move Execution & Clock Protocol",
      content:
        "Moves are made by physically moving a piece on the board and pressing the clock to indicate the completion of your turn. The piece must be moved and the clock pressed with the same hand.",
    },
    {
      title: "Claiming Illegal Moves",
      content:
        "If an illegal move is made, the arbiter will step in to enforce the rules. The player must immediately pause the clock and call the arbiter to claim the illegal move at that particular move only, before playing their reply.",
    },
    {
      title: "First Illegal Move Penalty",
      content:
        "If a player makes an illegal move for the first time, an official warning will be issued to the player by the arbiter and 2 minutes will be added to the opponent's clock.",
    },
    {
      title: "Second Illegal Move",
      content:
        "If a player makes an illegal move for the second time in the same match, their match will be immediately forfeited and the win awarded to the opponent.",
    },
    {
      title: "End of the Game & Draw Rules",
      content:
        "A game concludes by Checkmate, Resignation, or a Draw. Valid draw conditions include Draw by Stalemate, 3-Fold Repetition of position, Mutual Agreement between players, or the 50-Move Rule.",
    },
    {
      title: "Fair Play & Ethics",
      content:
        "Players are strictly expected to adhere to fair play. Cheating, including the use of outside assistance, electronic engines, or unauthorized communication, is strictly prohibited and leads to immediate expulsion.",
    },
    {
      title: "Role & Authority of the Arbiter",
      content:
        "The arbiter's role is to oversee the tournament and enforce the rules. The arbiter has the authority to penalize players for rule violations and settle disputes. Players must accept the arbiter's rulings, which are final.",
    },
    {
      title: "Match Pairings & Scheduling",
      content:
        "Match pairings will be determined by the Arbiter and Organizers using impartial Swiss-system tools and software as the tournament progresses. Once finalized, the pairings will be promptly shared with participants through our official WhatsApp group and Instagram handle.",
    },
    {
      title: "Equipment & Wrap-Up Protocol",
      content:
        "Players are requested to set up the board accordingly after reporting the match result to the arbiter. In case of the last match of the day, players are supposed to neatly pack their respective chess set.",
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
              EVENT
            </span>
            <span className="text-[#9b1a1a] drop-shadow-[0_0_20px_rgba(155,26,26,0.4)] text-[12vw] md:text-[80px] lg:text-[100px]">
              RULEBOOK
            </span>
          </h2>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-[10px] md:text-[12px] text-white/40 font-mono tracking-[0.2em] normal-case">
            <span>Official Tournament Regulations</span>

          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 lg:gap-y-16"
        >
          {rules.map((rule, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col"
            >
              <h3 className="text-white font-pezula font-bold text-[18px] lg:text-[22px] tracking-[0.15em] uppercase mb-4 pb-3 border-b border-[#9b1a1a]/30 flex items-center gap-3">
                <span className="text-[#9b1a1a] font-sans text-[14px]">›</span>
                {rule.title}
              </h3>
              <p className="text-white/60 font-sans font-light text-[14px] lg:text-[16px] leading-relaxed tracking-wide">
                {rule.content}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
