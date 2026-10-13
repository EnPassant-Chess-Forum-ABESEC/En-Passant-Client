"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/lib/api";
import { toast } from "sonner";
import { Layers, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TournamentList from "@/components/admin/tournaments/TournamentList";
import InitEventBracketsModal from "@/components/admin/tournaments/InitEventBracketsModal";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function AdminTournamentsPage() {
  const fetchApi = useApi();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isInitBracketsOpen, setIsInitBracketsOpen] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetchApi("/tournaments");
      setTournaments(res?.tournaments || []);
    } catch (err) {
      toast.error("Failed to load tournaments: " + err.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetchApi("/tournaments");
        if (!ignore) setTournaments(res?.tournaments || []);
      } catch (err) {
        if (!ignore) toast.error("Failed to load tournaments: " + err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [fetchApi]);

  const activeCount = tournaments.filter(
    (t) => t.status === "in_progress",
  ).length;
  const completedCount = tournaments.filter(
    (t) => t.status === "completed",
  ).length;
  const totalPlayers = tournaments.reduce(
    (acc, t) => acc + (t.players?.length || 0),
    0,
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <div>
        <motion.header
          variants={itemVariants}
          className="flex flex-col md:flex-row md:items-end justify-between gap-5"
        >
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-50 mb-2">
              Tournaments
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-medium">
              Manage tournament brackets, rounds, and pairings
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsInitBracketsOpen((prev) => !prev)}
              className="h-[44px] inline-flex items-center gap-2 px-5 text-sm font-semibold rounded-xl transition-all shadow-sm active:scale-[0.98] bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 hover:shadow-blue-500/30"
            >
              <span>
                {isInitBracketsOpen
                  ? "Close Brackets Setup"
                  : "Initialize Event Brackets"}
              </span>
            </button>
          </div>
        </motion.header>

        <AnimatePresence initial={false}>
          {isInitBracketsOpen && (
            <motion.div
              key="init-brackets-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: 1,
                height: "auto",
                transition: {
                  height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 0.25, ease: "easeOut" },
                },
              }}
              exit={{
                opacity: 0,
                height: 0,
                transition: {
                  opacity: { duration: 0.2, ease: "easeIn" },
                  height: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className="overflow-hidden"
            >
              <div className="pt-6">
                <InitEventBracketsModal
                  onClose={() => setIsInitBracketsOpen(false)}
                  onSuccess={() => {
                    setIsInitBracketsOpen(false);
                    handleRefresh();
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
      >
        <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-5 md:p-6 rounded-2xl md:rounded-3xl relative overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <h3 className="text-2xl md:text-3xl font-black font-mono text-slate-900 dark:text-slate-50 mb-1 tracking-tight">
            {tournaments.length}
          </h3>
          <p className="text-[10px] md:text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Total Tournaments
          </p>
        </div>

        <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-5 md:p-6 rounded-2xl md:rounded-3xl relative overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <h3 className="text-2xl md:text-3xl font-black font-mono text-slate-900 dark:text-slate-50 mb-1 tracking-tight">
            {activeCount}
          </h3>
          <p className="text-[10px] md:text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            In Progress
          </p>
        </div>

        <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-5 md:p-6 rounded-2xl md:rounded-3xl relative overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <h3 className="text-2xl md:text-3xl font-black font-mono text-slate-900 dark:text-slate-50 mb-1 tracking-tight">
            {completedCount}
          </h3>
          <p className="text-[10px] md:text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Completed
          </p>
        </div>

        <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-5 md:p-6 rounded-2xl md:rounded-3xl relative overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <h3 className="text-2xl md:text-3xl font-black font-mono text-slate-900 dark:text-slate-50 mb-1 tracking-tight">
            {totalPlayers}
          </h3>
          <p className="text-[10px] md:text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Total Players
          </p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-3" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Loading Tournaments...
            </p>
          </div>
        ) : (
          <TournamentList
            tournaments={tournaments}
            onDeleted={(id) =>
              setTournaments((prev) => prev.filter((t) => t._id !== id))
            }
            onRefresh={handleRefresh}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
