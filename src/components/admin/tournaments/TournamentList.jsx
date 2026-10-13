"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Users, Clock, Trash2, ChevronRight, Layers } from "lucide-react";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useApi } from "@/lib/api";
import { toast } from "sonner";
import AdminSearchBar from "@/components/admin/AdminSearchBar";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function TournamentList({
  tournaments = [],
  onDeleted,
  onRefresh,
}) {
  const fetchApi = useApi();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [sortFilter, setSortFilter] = useState("NEWEST");
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const categoryOptions = useMemo(() => {
    const opts = [];
    const seen = new Set();

    tournaments.forEach((t) => {
      if (t.eventTitle) {
        const val = `event:${t.eventTitle.toLowerCase()}`;
        if (!seen.has(val)) {
          seen.add(val);
          opts.push({
            label: `Event: ${t.eventTitle}`,
            value: val,
          });
        }
      }
      if (t.section && t.section !== "open") {
        const val = `sec:${t.section.toLowerCase()}`;
        if (!seen.has(val)) {
          seen.add(val);
          opts.push({
            label: `Section: ${t.section}`,
            value: val,
          });
        }
      }
      if (t.bracket && t.bracket !== "open") {
        const val = `brk:${t.bracket.toLowerCase()}`;
        if (!seen.has(val)) {
          seen.add(val);
          opts.push({
            label: `Bracket: ${t.bracket}`,
            value: val,
          });
        }
      }
    });

    return opts;
  }, [tournaments]);

  const filtered = useMemo(() => {
    let result = tournaments.filter((t) => {
      const q = search.toLowerCase();
      const matchesSearch =
        (t.title || "").toLowerCase().includes(q) ||
        (t.eventTitle || "").toLowerCase().includes(q) ||
        (t.section || "").toLowerCase().includes(q) ||
        (t.bracket || "").toLowerCase().includes(q) ||
        (t.format || "").toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "ALL" ? true : t.status === statusFilter;

      let matchesCategory = true;
      if (categoryFilter !== "ALL") {
        if (categoryFilter.startsWith("event:")) {
          const ev = categoryFilter.replace("event:", "");
          matchesCategory = (t.eventTitle || "").toLowerCase() === ev;
        } else if (categoryFilter.startsWith("sec:")) {
          const sec = categoryFilter.replace("sec:", "");
          matchesCategory = (t.section || "").toLowerCase() === sec;
        } else if (categoryFilter.startsWith("brk:")) {
          const brk = categoryFilter.replace("brk:", "");
          matchesCategory = (t.bracket || "").toLowerCase() === brk;
        }
      }

      return matchesSearch && matchesStatus && matchesCategory;
    });

    if (sortFilter === "NEWEST") {
      result.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      );
    } else if (sortFilter === "OLDEST") {
      result.sort(
        (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
      );
    } else if (sortFilter === "PLAYERS_DESC") {
      result.sort(
        (a, b) => (b.players?.length || 0) - (a.players?.length || 0),
      );
    } else if (sortFilter === "PROGRESS_DESC") {
      const progA =
        a.totalRounds > 0 ? a.currentRoundNumber / a.totalRounds : 0;
      const progB =
        b.totalRounds > 0 ? b.currentRoundNumber / b.totalRounds : 0;
      result.sort((a, b) => progB - progA);
    } else if (sortFilter === "TITLE_ASC") {
      result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    return result;
  }, [tournaments, search, statusFilter, categoryFilter, sortFilter]);

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await fetchApi(`/tournaments/${deleteTargetId}`, {
        method: "DELETE",
      });
      toast.success("Tournament deleted successfully");
      if (onDeleted) onDeleted(deleteTargetId);
    } catch (err) {
      toast.error("Failed to delete tournament: " + err.message);
    } finally {
      setIsDeleting(false);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-6">
      <AdminSearchBar
        searchQuery={search}
        setSearchQuery={setSearch}
        searchPlaceholder="Search tournaments by title, section, or bracket..."
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        statusLabel="Status"
        statusPlaceholder="All Statuses"
        statusOptions={[
          { label: "In Progress", value: "in_progress" },
          { label: "Setup", value: "setup" },
          { label: "Completed", value: "completed" },
        ]}
        departmentFilter={categoryFilter}
        setDepartmentFilter={setCategoryFilter}
        departmentLabel="Section / Bracket"
        departmentPlaceholder="All Categories"
        departmentOptions={categoryOptions}
        sortFilter={sortFilter}
        setSortFilter={setSortFilter}
        sortOptions={[
          { label: "Newest First", value: "NEWEST" },
          { label: "Oldest First", value: "OLDEST" },
          { label: "Most Players", value: "PLAYERS_DESC" },
          { label: "Highest Progress", value: "PROGRESS_DESC" },
          { label: "Alphabetical", value: "TITLE_ASC" },
        ]}
        totalCount={filtered.length}
        countLabel="Tournaments"
        onRefresh={onRefresh}
      />

      {filtered.length === 0 ? (
        <div className="p-16 text-center border border-b border-slate-200 dark:border-slate-800 rounded-3xl bg-white/50 dark:bg-[#0F172A]/50">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
            No Tournaments Found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5">
            {search || statusFilter !== "ALL" || categoryFilter !== "ALL"
              ? "No tournaments match your current search and filter criteria. Try clearing filters."
              : "Get started by creating a standalone tournament or initializing multi-bracket event tournaments."}
          </p>
          {(search || statusFilter !== "ALL" || categoryFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("ALL");
                setCategoryFilter("ALL");
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
        >
          {filtered.map((t) => {
            const isCompleted = t.status === "completed";
            const isInProgress = t.status === "in_progress";
            const isSetup = t.status === "setup" || !t.status;
            const progress =
              t.totalRounds > 0
                ? Math.min(
                    100,
                    Math.round(
                      ((t.currentRoundNumber || 0) / t.totalRounds) * 100,
                    ),
                  )
                : 0;

            return (
              <motion.div
                key={t._id}
                variants={itemVariants}
                className="group relative flex flex-col justify-between p-6 rounded-2xl md:rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#0F172A] hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-transparent via-slate-400 dark:via-slate-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  <div className="flex items-center justify-between gap-3 mb-3.5">
                    {isInProgress && (
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs">
                        <span>IN PROGRESS</span>
                      </div>
                    )}
                    {isCompleted && (
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs">
                        <span>COMPLETED</span>
                      </div>
                    )}
                    {isSetup && (
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800/80 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60 shadow-2xs">
                        <span>SETUP</span>
                      </div>
                    )}

                    <button
                      onClick={() => setDeleteTargetId(t._id)}
                      title="Delete Tournament"
                      className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <Link
                    href={`/admin/tournaments/${t._id}`}
                    className="block group/title"
                  >
                    <h3 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 group-hover/title:text-slate-700 dark:group-hover/title:text-white transition-colors line-clamp-1 mb-2.5">
                      {t.title}
                    </h3>
                  </Link>

                  <div className="flex flex-wrap items-center gap-1.5 mb-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-mono font-bold capitalize rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700/60">
                      {t.format || "swiss"}
                    </span>

                    {t.section && t.section !== "open" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-mono font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/70 dark:border-slate-700/60">
                        Sec: {t.section}
                      </span>
                    )}

                    {t.bracket && t.bracket !== "open" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-mono font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/70 dark:border-slate-700/60">
                        Brk: {t.bracket}
                      </span>
                    )}
                  </div>

                  <div className="bg-slate-50/70 dark:bg-[#020617]/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800/60 mb-5">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {isCompleted
                          ? "Final Round Reached"
                          : `Round ${t.currentRoundNumber || 0} of ${t.totalRounds || 0}`}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-3 mt-3 border-t border-slate-200/50 dark:border-slate-800/60 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                        <span className="font-semibold">
                          {t.players?.length || 0} Players
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                        <span className="font-semibold">
                          {t.totalRounds || 0} Total Rounds
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                    {isCompleted
                      ? "Completed"
                      : isInProgress
                        ? `Round ${t.currentRoundNumber || 1} in progress`
                        : "Setup"}
                  </span>

                  <Link
                    href={`/admin/tournaments/${t._id}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm shadow-blue-500/20 active:scale-[0.98]"
                  >
                    <span>Manage</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      <AlertDialog
        open={Boolean(deleteTargetId)}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
      >
        <AlertDialogContent className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900 dark:text-slate-50">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 dark:text-slate-400">
              This action cannot be undone. This will permanently delete the
              tournament, all round pairings, game results, and standings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              className="border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete Tournament"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
