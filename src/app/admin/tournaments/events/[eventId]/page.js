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
  RefreshCw,
  Loader2,
  ChevronRight,
  UserCheck,
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
      toast.error("Failed to load event tournaments: " + err.message);
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
          toast.error("Failed to load event tournaments: " + err.message);
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
      const res = await fetchApi(`/events/${eventId}/tournaments/pair`, {
        method: "POST",
        body: {},
      });
      const pairedCount = (res?.result || []).filter((r) => r.success).length;
      if (pairedCount > 0) {
        toast.success(`Paired round for ${pairedCount} bracket(s)!`);
      } else {
        const skippedReasons = (res?.result || [])
          .map((r) => r.reason)
          .filter(Boolean);
        toast.warning(
          skippedReasons[0] ||
            "No brackets paired. Seed players into brackets first.",
        );
      }
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
        <Loader2 className="w-10 h-10 animate-spin mx-auto text-blue-500 mb-4" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Loading Event Tournaments…
        </p>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="p-16 text-center border border-slate-200 dark:border-slate-800 rounded-3xl bg-white/50 dark:bg-[#0F172A]/50">
        <p className="text-base font-bold text-slate-700 dark:text-slate-300 mb-2">
          No Tournaments Initialized
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          This event does not have active tournament brackets initialized yet.
        </p>
        <Link
          href={`/admin/events/${eventId}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Event Details</span>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <Link
          href={`/admin/events/${eventId}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Event</span>
        </Link>
      </div>

      <header className="mb-8 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Event Tournaments</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100">
            {dashboard.eventTitle}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {dashboard.totalBrackets} Brackets • Mode:{" "}
            {dashboard.participationMode === "team" ? "Team" : "Individual"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={actionLoading}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#020617] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            title="Refresh"
            aria-label="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleSeedPlayers}
            disabled={actionLoading}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all shadow-xs"
          >
            <span>Seed Players from Registrations</span>
          </button>

          <button
            onClick={handlePairAll}
            disabled={
              actionLoading ||
              (dashboard.brackets || []).every((b) => (b.playerCount || 0) < 2)
            }
            title={
              (dashboard.brackets || []).every((b) => (b.playerCount || 0) < 2)
                ? "At least one bracket must have at least 2 registered players to generate pairings"
                : "Pair next round across all active brackets"
            }
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm shadow-blue-500/20 transition-all active:scale-[0.98]"
          >
            <span>Pair All Brackets</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboard.brackets.map((b) => (
          <div
            key={b.tournamentId}
            className="p-6 rounded-2xl md:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-1 text-xs font-bold font-mono uppercase rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {b.bracket}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                {b.title}
              </h3>

              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2 mb-4">
                <span className="flex items-center gap-1 font-semibold">
                  Round {b.currentRoundNumber} / {b.totalRounds}
                </span>
                <span className="flex items-center gap-1">
                  {b.playerCount} Players
                </span>
              </div>
            </div>

            <Link
              href={`/admin/tournaments/${b.tournamentId}`}
              className="inline-flex items-center justify-between w-full px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors mt-2"
            >
              <span>View Bracket</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
