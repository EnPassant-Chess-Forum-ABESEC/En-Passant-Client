"use client";

import { useState, useEffect, use, useMemo } from "react";
import Link from "next/link";
import { useApi } from "@/lib/api";
import { toast } from "sonner";
import {
  Trophy,
  ArrowLeft,
  PlayCircle,
  CheckCircle,
  RotateCcw,
  RefreshCw,
  Loader2,
  Users,
  Grid,
  ShieldCheck,
  Award,
  Layers,
  ChevronRight,
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
import RoundPairingsTable from "@/components/admin/tournaments/RoundPairingsTable";
import StandingsTable from "@/components/admin/tournaments/StandingsTable";
import CrossTableMatrix from "@/components/admin/tournaments/CrossTableMatrix";
import ArbiterAuditView from "@/components/admin/tournaments/ArbiterAuditView";
import PlayersManager from "@/components/admin/tournaments/PlayersManager";

export default function TournamentDetailPage({ params }) {
  const { id } = use(params);
  const fetchApi = useApi();

  const [tournament, setTournament] = useState(null);
  const [standings, setStandings] = useState([]);
  const [crossTable, setCrossTable] = useState([]);
  const [audit, setAudit] = useState(null);

  const [loading, setLoading] = useState(true);
  const [pairingLoading, setPairingLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("pairings");
  const [selectedRoundNum, setSelectedRoundNum] = useState(1);
  const [isRollbackOpen, setIsRollbackOpen] = useState(false);

  const loadSupplementaryData = useCallback(async () => {
    try {
      const [stdRes, ctRes, auditRes] = await Promise.allSettled([
        fetchApi(`/tournaments/${id}/standings`),
        fetchApi(`/tournaments/${id}/crosstable`),
        fetchApi(`/tournaments/${id}/audit`),
      ]);

      if (stdRes.status === "fulfilled") {
        setStandings(stdRes.value?.standings || []);
      }
      if (ctRes.status === "fulfilled") {
        setCrossTable(ctRes.value?.crossTable || []);
      }
      if (auditRes.status === "fulfilled") {
        setAudit(auditRes.value?.audit || null);
      }
    } catch (err) {
      console.error("Supplementary load error:", err);
    }
  }, [fetchApi, id]);

  const handleRefresh = async () => {
    try {
      const data = await fetchApi(`/tournaments/${id}`);
      if (data?.tournament) {
        setTournament(data.tournament);
      }
      await loadSupplementaryData();
    } catch (err) {
      toast.error("Failed to refresh: " + err.message);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const [tournRes, stdRes, ctRes, auditRes] = await Promise.allSettled([
          fetchApi(`/tournaments/${id}`),
          fetchApi(`/tournaments/${id}/standings`),
          fetchApi(`/tournaments/${id}/crosstable`),
          fetchApi(`/tournaments/${id}/audit`),
        ]);
        if (!ignore) {
          if (tournRes.status === "fulfilled" && tournRes.value?.tournament) {
            const t = tournRes.value.tournament;
            setTournament(t);
            if (t.currentRoundNumber > 0) {
              setSelectedRoundNum(t.currentRoundNumber);
            }
          }
          if (stdRes.status === "fulfilled") {
            setStandings(stdRes.value?.standings || []);
          }
          if (ctRes.status === "fulfilled") {
            setCrossTable(ctRes.value?.crossTable || []);
          }
          if (auditRes.status === "fulfilled") {
            setAudit(auditRes.value?.audit || null);
          }
        }
      } catch (err) {
        if (!ignore) toast.error("Failed to load tournament: " + err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, [fetchApi, id]);

  const playerMap = useMemo(() => {
    const map = new Map();
    if (tournament?.players) {
      for (const p of tournament.players) {
        map.set(p.id, p);
      }
    }
    return map;
  }, [tournament]);

  const selectedRound = useMemo(() => {
    if (!tournament?.rounds) return null;
    return tournament.rounds.find((r) => r.roundNumber === selectedRoundNum) || null;
  }, [tournament, selectedRoundNum]);

  const handlePairNextRound = async () => {
    setPairingLoading(true);
    try {
      const res = await fetchApi(`/tournaments/${id}/rounds/pair`, {
        method: "POST",
      });
      toast.success(
        res?.message ||
          `Round ${res?.tournament?.currentRoundNumber} pairings generated!`,
      );
      setTournament(res?.tournament);
      setSelectedRoundNum(res?.tournament?.currentRoundNumber);
      await loadSupplementaryData();
    } catch (err) {
      toast.error("Pairing Error: " + err.message);
    } finally {
      setPairingLoading(false);
    }
  };

  const handleCompleteRound = async () => {
    if (!selectedRound) return;
    setActionLoading(true);
    try {
      const res = await fetchApi(
        `/tournaments/${id}/rounds/${selectedRound.roundNumber}/complete`,
        { method: "POST" },
      );
      toast.success(`Round ${selectedRound.roundNumber} marked as completed!`);
      setTournament(res?.tournament);
      await loadSupplementaryData();
    } catch (err) {
      toast.error("Error completing round: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRollbackRound = async () => {
    if (!selectedRound) return;
    setActionLoading(true);
    try {
      const res = await fetchApi(
        `/tournaments/${id}/rounds/${selectedRound.roundNumber}/rollback`,
        { method: "POST" },
      );
      toast.success(`Round ${selectedRound.roundNumber} rolled back!`);
      setTournament(res?.tournament);
      setSelectedRoundNum(Math.max(1, (res?.tournament?.currentRoundNumber || 1)));
      await loadSupplementaryData();
    } catch (err) {
      toast.error("Error rolling back round: " + err.message);
    } finally {
      setActionLoading(false);
      setIsRollbackOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="py-32 text-center">
        <Loader2 className="w-10 h-10 animate-spin mx-auto text-blue-500 mb-4" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Loading Tournament Cockpit...
        </p>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="py-24 text-center">
        <p className="text-base font-bold text-slate-700 dark:text-slate-300">
          Tournament Not Found
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

  const isCurrentRoundCompleted = Boolean(selectedRound?.isCompleted);
  const canPairNext =
    tournament.currentRoundNumber === 0 ||
    (isCurrentRoundCompleted &&
      tournament.currentRoundNumber < tournament.totalRounds);

  return (
    <>
      <div className="mb-6">
        <Link
          href="/admin/tournaments"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Tournaments</span>
        </Link>
      </div>

      <header className="mb-8 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                tournament.status === "completed"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                  : tournament.status === "in_progress"
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  tournament.status === "completed"
                    ? "bg-emerald-500"
                    : tournament.status === "in_progress"
                      ? "bg-blue-500 animate-pulse"
                      : "bg-slate-400"
                }`}
              />
              {tournament.status?.replace("_", " ")?.toUpperCase()}
            </span>

            <span className="px-2 py-0.5 text-[10px] font-bold font-mono uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded">
              {tournament.format}
            </span>

            {tournament.section && tournament.section !== "open" && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                Section: {tournament.section}
              </span>
            )}
            {tournament.bracket && tournament.bracket !== "open" && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded">
                Bracket: {tournament.bracket}
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100">
            {tournament.title}
          </h1>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Round {tournament.currentRoundNumber} of {tournament.totalRounds} • {tournament.players?.length || 0} registered players
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => loadTournament(true)}
            disabled={actionLoading || pairingLoading}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#020617] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {selectedRound && !selectedRound.isCompleted && (
            <button
              onClick={handleCompleteRound}
              disabled={actionLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 rounded-xl transition-all shadow-xs"
            >
              <CheckCircle className="w-4 h-4" />
              Complete Round {selectedRound.roundNumber}
            </button>
          )}

          {selectedRound && (
            <button
              onClick={() => setIsRollbackOpen(true)}
              disabled={actionLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 rounded-xl transition-all shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Rollback Round
            </button>
          )}

          <button
            onClick={handlePairNextRound}
            disabled={pairingLoading || !canPairNext}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md transition-all"
          >
            {pairingLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Pairing Dutch Swiss...
              </>
            ) : (
              <>
                <PlayCircle className="w-4 h-4" />
                {tournament.currentRoundNumber === 0
                  ? "Pair Round 1"
                  : `Pair Next Round (${tournament.currentRoundNumber + 1})`}
              </>
            )}
          </button>
        </div>
      </header>

      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        {[
          { key: "pairings", label: "Pairings & Live Results", icon: PlayCircle },
          { key: "standings", label: "Standings & Tiebreaks", icon: Trophy },
          { key: "crosstable", label: "Cross-Table", icon: Grid },
          { key: "audit", label: "FIDE Arbiter Audit", icon: ShieldCheck },
          { key: "players", label: `Players (${tournament.players?.length || 0})`, icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                isActive
                  ? "bg-slate-900 text-white dark:bg-blue-600 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "pairings" && (
        <div className="space-y-5">
          {tournament.rounds && tournament.rounds.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">
                Rounds:
              </span>
              {tournament.rounds.map((r) => {
                const isSelected = selectedRoundNum === r.roundNumber;
                return (
                  <button
                    key={r.roundNumber}
                    onClick={() => setSelectedRoundNum(r.roundNumber)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                      isSelected
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-300 dark:border-blue-700 shadow-2xs"
                        : "bg-white dark:bg-[#0F172A] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    <span>Round {r.roundNumber}</span>
                    {r.isCompleted && (
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <RoundPairingsTable
            tournamentId={id}
            round={selectedRound}
            playerMap={playerMap}
            onGameUpdated={(updated) => {
              setTournament(updated);
              loadSupplementaryData();
            }}
          />
        </div>
      )}

      {activeTab === "standings" && (
        <StandingsTable standings={standings} />
      )}

      {activeTab === "crosstable" && (
        <CrossTableMatrix crossTable={crossTable} />
      )}

      {activeTab === "audit" && (
        <ArbiterAuditView
          audit={audit}
          onRefresh={loadSupplementaryData}
          loading={actionLoading}
        />
      )}

      {activeTab === "players" && (
        <PlayersManager
          tournamentId={id}
          players={tournament.players || []}
          onPlayerUpdated={(updated) => {
            setTournament(updated);
            loadSupplementaryData();
          }}
        />
      )}

      <AlertDialog open={isRollbackOpen} onOpenChange={setIsRollbackOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rollback Round {selectedRound?.roundNumber}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all pairings and recorded game results for Round {selectedRound?.roundNumber}. The tournament will revert to the previous round.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRollbackRound}
              disabled={actionLoading}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              {actionLoading ? "Rolling back..." : "Confirm Rollback"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
