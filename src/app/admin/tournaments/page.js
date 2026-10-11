"use client";

import { useState, useEffect, useCallback } from "react";
import { useApi } from "@/lib/api";
import { toast } from "sonner";
import {
  Trophy,
  Plus,
  Layers,
  RefreshCw,
  Loader2,
  Users,
  CheckCircle2,
  PlayCircle,
  ShieldCheck,
} from "lucide-react";
import TournamentList from "@/components/admin/tournaments/TournamentList";
import CreateTournamentModal from "@/components/admin/tournaments/CreateTournamentModal";
import InitEventBracketsModal from "@/components/admin/tournaments/InitEventBracketsModal";

export default function AdminTournamentsPage() {
  const fetchApi = useApi();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
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

  const activeCount = tournaments.filter((t) => t.status === "in_progress").length;
  const completedCount = tournaments.filter((t) => t.status === "completed").length;
  const totalPlayers = tournaments.reduce(
    (acc, t) => acc + (t.players?.length || 0),
    0,
  );

  return (
    <>
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>FIDE Dutch Swiss Pairing Engine</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-50 mb-2">
            Tournaments
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm uppercase tracking-widest font-bold">
            Tournament Cockpit & Multi-Bracket Pairings
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors shadow-2xs"
            title="Refresh list"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>

          <button
            onClick={() => setIsInitBracketsOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold rounded-xl transition-all shadow-xs"
          >
            <Layers className="w-4 h-4" />
            <span>Event Brackets</span>
          </button>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>New Tournament</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Events</span>
            <Trophy className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">
            {tournaments.length}
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">In Progress</span>
            <PlayCircle className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">
            {activeCount}
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {completedCount}
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Players</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">
            {totalPlayers}
          </p>
        </div>
      </div>

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
        />
      )}

      <CreateTournamentModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={(created) => {
          if (created) setTournaments((prev) => [created, ...prev]);
          else handleRefresh();
        }}
      />

      <InitEventBracketsModal
        isOpen={isInitBracketsOpen}
        onClose={() => setIsInitBracketsOpen(false)}
        onSuccess={() => handleRefresh()}
      />
    </>
  );
}
