"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Users,
  Calendar,
  PlayCircle,
  CheckCircle2,
  Clock,
  Trash2,
  ChevronRight,
  Layers,
  Search,
  Filter,
} from "lucide-react";
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

export default function TournamentList({ tournaments = [], onDeleted }) {
  const fetchApi = useApi();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = tournaments.filter((t) => {
    const matchesSearch =
      (t.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.section || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.bracket || "").toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tournaments by title, section, or bracket..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="setup">Setup</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white/50 dark:bg-[#0F172A]/50">
          <Trophy className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No Tournaments Found
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Get started by creating a standalone tournament or initializing multi-bracket event tournaments above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((t) => {
            const isCompleted = t.status === "completed";
            const isInProgress = t.status === "in_progress";
            const progress = t.totalRounds > 0
              ? Math.min(100, Math.round((t.currentRoundNumber / t.totalRounds) * 100))
              : 0;

            return (
              <div
                key={t._id}
                className="group relative flex flex-col justify-between p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0F172A] hover:border-blue-500/50 dark:hover:border-blue-500/50 shadow-xs hover:shadow-md transition-all duration-300"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        isCompleted
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : isInProgress
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isCompleted
                            ? "bg-emerald-500"
                            : isInProgress
                              ? "bg-blue-500 animate-pulse"
                              : "bg-slate-400"
                        }`}
                      />
                      {t.status?.replace("_", " ")?.toUpperCase()}
                    </span>

                    <button
                      onClick={() => setDeleteTargetId(t._id)}
                      title="Delete Tournament"
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <Link href={`/admin/tournaments/${t._id}`} className="block">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 mb-1">
                      {t.title}
                    </h3>
                  </Link>

                  <div className="flex flex-wrap items-center gap-1.5 mt-2 mb-4">
                    <span className="px-2 py-0.5 text-[10px] font-bold font-mono uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded">
                      {t.format || "swiss"}
                    </span>
                    {t.section && t.section !== "open" && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                        Sec: {t.section}
                      </span>
                    )}
                    {t.bracket && t.bracket !== "open" && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded">
                        Brk: {t.bracket}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                      <span>
                        Round {t.currentRoundNumber || 0} of {t.totalRounds || 0}
                      </span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <Users className="w-3.5 h-3.5" />
                    <span>{t.players?.length || 0} players</span>
                  </div>

                  <Link
                    href={`/admin/tournaments/${t._id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    <span>Manage Cockpit</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AlertDialog
        open={Boolean(deleteTargetId)}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the tournament, all round pairings, game results, and standings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
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
