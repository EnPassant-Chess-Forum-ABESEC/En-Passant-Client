"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useApi } from "@/lib/api";
import { toast } from "sonner";
import {
  Trophy,
  ArrowLeft,
  Layers,
  PlayCircle,
  Users,
  CheckCircle2,
  RefreshCw,
  Loader2,
  ExternalLink,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export default function EventTournamentsDashboardPage({ params }) {
  const { eventId } = use(params);
  const fetchApi = useApi();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const handleRefresh = async () => {
    try {
      const res = await fetchApi(`/events/${eventId}/tournaments/dashboard`);
      setDashboard(res?.dashboard || null);
    } catch (err) {
      toast.error("Failed to load event tournament dashboard: " + err.message);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const res = await fetchApi(`/events/${eventId}/tournaments/dashboard`);
        if (!ignore) {
          setDashboard(res?.dashboard || null);
        }
      } catch (err) {
        if (!ignore) {
          toast.error("Failed to load event tournament dashboard: " + err.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, [fetchApi, eventId]);

  const handlePairAll = async () => {
    setActionLoading(true);
    try {
      await fetchApi(`/events/${eventId}/tournaments/pair`, {
        method: "POST",
      });
      toast.success("Round paired across all active event brackets!");
      await handleRefresh();
    } catch (err) {
      toast.error("Pairing Error: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSeedPlayers = async () => {
    setActionLoading(true);
    try {
      const res = await fetchApi(`/events/${eventId}/tournaments/seed`, {
        method: "POST",
        body: { autoAssignByRating: true },
      });
      toast.success(
        res?.message || `Seeded ${res?.result?.totalSeeded || 0} participants!`,
      );
      await handleRefresh();
    } catch (err) {
      toast.error("Seeding Error: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-32 text-center">
        <Loader2 className="w-10 h-10 animate-spin mx-auto text-purple-500 mb-4" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Loading Multi-Bracket Dashboard...
        </p>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="py-24 text-center">
        <p className="text-base font-bold text-slate-700 dark:text-slate-300">
          No Tournament Brackets Initialized
        </p>
        <Link
          href="/admin/tournaments"
          className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tournaments
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <Link
          href="/admin/tournaments"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Tournaments Hub</span>
        </Link>
      </div>

      <header className="mb-8 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-bold mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Multi-Bracket Event</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100">
            {dashboard.eventTitle}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {dashboard.totalBrackets} Brackets Configured • Participation Mode: {dashboard.participationMode?.toUpperCase()}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={actionLoading}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#020617] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleSeedPlayers}
            disabled={actionLoading}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 rounded-xl transition-all shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>Auto-Seed from Registrations</span>
          </button>

          <button
            onClick={handlePairAll}
            disabled={actionLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-md transition-all"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Pair All Brackets</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboard.brackets.map((b) => (
          <div
            key={b.tournamentId}
            className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-1 text-xs font-black uppercase rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  {b.bracket}
                </span>

                <span className="text-[11px] font-semibold text-slate-400">
                  Sec: {b.section}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                {b.title}
              </h3>

              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2 mb-4">
                <span className="flex items-center gap-1 font-semibold">
                  <PlayCircle className="w-3.5 h-3.5 text-blue-500" />
                  Round {b.currentRoundNumber} / {b.totalRounds}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-purple-500" />
                  {b.playerCount} Players
                </span>
              </div>

              {b.topStandings && b.topStandings.length > 0 && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#020617] border border-slate-100 dark:border-slate-800 mb-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Top Leaders
                  </p>
                  <div className="space-y-1.5 text-xs">
                    {b.topStandings.slice(0, 3).map((lead, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-slate-700 dark:text-slate-300"
                      >
                        <span className="truncate font-semibold">
                          #{lead.rank} {lead.name}
                        </span>
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs">
                          {Number(lead.points || lead.score || 0).toFixed(1)} pts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href={`/admin/tournaments/${b.tournamentId}`}
              className="inline-flex items-center justify-between w-full px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors mt-2"
            >
              <span>Open Bracket Cockpit</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
