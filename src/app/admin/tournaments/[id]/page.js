"use client";

import { useState, useEffect, use, useMemo, useCallback } from "react";
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
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);

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
        setCrossTable(ctRes.value?.crossTable || ctRes.value?.matrix || []);
      }
      if (auditRes.status === "fulfilled") {
        setAudit(auditRes.value?.audit || auditRes.value?.auditReport || null);
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
            setCrossTable(ctRes.value?.crossTable || ctRes.value?.matrix || []);
          }
          if (auditRes.status === "fulfilled") {
            setAudit(
              auditRes.value?.audit || auditRes.value?.auditReport || null,
            );
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
    return (
      tournament.rounds.find((r) => r.roundNumber === selectedRoundNum) || null
    );
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
      setSelectedRoundNum(
        Math.max(1, res?.tournament?.currentRoundNumber || 1),
      );
      await loadSupplementaryData();
    } catch (err) {
      toast.error("Error rolling back round: " + err.message);
    } finally {
      setActionLoading(false);
      setIsRollbackOpen(false);
    }
  };

  const handleCompleteTournament = async () => {
    setActionLoading(true);
    try {
      const res = await fetchApi(`/tournaments/${id}/complete`, {
        method: "POST",
      });
      toast.success("Tournament completed! Final standings are locked.");
      setTournament(res?.tournament);
      await loadSupplementaryData();
    } catch (err) {
      toast.error("Error completing tournament: " + err.message);
    } finally {
      setActionLoading(false);
      setIsCompleteOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="py-32 text-center">
        <Loader2 className="w-10 h-10 animate-spin mx-auto text-blue-500 mb-4" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Loading Tournament Details...
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

  const isTournamentCompleted =
    tournament.status?.toLowerCase() === "completed";
  const isAllRoundsPaired = Boolean(
    tournament.rounds?.length >= tournament.totalRounds &&
    tournament.currentRoundNumber >= tournament.totalRounds,
  );
  const allGamesFinished = Boolean(
    isAllRoundsPaired &&
    tournament.rounds?.every(
      (r) => r.games?.length > 0 && r.games.every((g) => g.result !== null),
    ),
  );
  const activePlayersCount = (tournament.players || []).filter(
    (p) => p.active !== false,
  ).length;
  const hasEnoughPlayers = activePlayersCount >= 2;
  const isCurrentRoundCompleted = Boolean(selectedRound?.isCompleted);
  const canPairNext =
    !isAllRoundsPaired &&
    hasEnoughPlayers &&
    (tournament.currentRoundNumber === 0 || isCurrentRoundCompleted);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/tournaments"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Tournaments</span>
        </Link>
      </div>

      <header className="mb-8 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100">
            {tournament.title}
          </h1>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Round {tournament.currentRoundNumber} of {tournament.totalRounds} •{" "}
            {tournament.players?.length || 0} registered players
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleRefresh}
            disabled={actionLoading || pairingLoading}
            className="w-10 h-10 p-0 inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#020617] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs"
            title="Refresh Tournament"
            aria-label="Refresh Tournament"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {!isTournamentCompleted && selectedRound && (
            <button
              onClick={() => setIsRollbackOpen(true)}
              disabled={actionLoading}
              className="h-10 inline-flex items-center gap-1.5 px-3.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-[#020617] border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Rollback Round</span>
            </button>
          )}

          {!isTournamentCompleted &&
            selectedRound &&
            !selectedRound.isCompleted && (
              <button
                onClick={handleCompleteRound}
                disabled={actionLoading}
                className="h-10 inline-flex items-center gap-1.5 px-3.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-[#020617] border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors shadow-2xs"
              >
                <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>Complete Round {selectedRound.roundNumber}</span>
              </button>
            )}

          {isTournamentCompleted ? (
            <div className="h-10 inline-flex items-center gap-2 px-4 text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xs">
              Tournament Completed
            </div>
          ) : isAllRoundsPaired ? (
            <button
              onClick={() => setIsCompleteOpen(true)}
              disabled={actionLoading || !allGamesFinished}
              title={
                !allGamesFinished
                  ? "All games in all rounds must have recorded results before completing the tournament"
                  : "Finalize tournament and lock standings"
              }
              className="h-10 inline-flex items-center gap-2 px-5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-all"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Finalizing...</span>
                </>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  <span>Complete Tournament</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handlePairNextRound}
              disabled={pairingLoading || !canPairNext}
              title={
                !hasEnoughPlayers
                  ? `Requires at least 2 active players to pair (currently ${activePlayersCount})`
                  : !canPairNext
                    ? "Complete current round before pairing the next round"
                    : undefined
              }
              className="h-10 inline-flex items-center gap-2 px-5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm shadow-blue-500/20 transition-all active:scale-[0.98]"
            >
              {pairingLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Pairings...</span>
                </>
              ) : (
                <>
                  <span>
                    {tournament.currentRoundNumber === 0
                      ? "Pair Round 1"
                      : `Pair Next Round (${tournament.currentRoundNumber + 1})`}
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      </header>

      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        {[
          { key: "pairings", label: "Pairings & Results" },
          { key: "standings", label: "Standings" },
          { key: "crosstable", label: "Results Matrix" },
          {
            key: "players",
            label: `Players (${tournament.players?.length || 0})`,
          },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                isActive
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
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
            tournament={tournament}
            round={selectedRound}
            playerMap={playerMap}
            onSelectTab={setActiveTab}
            onRollbackRequest={() => setIsRollbackOpen(true)}
            onGameUpdated={(updated) => {
              setTournament(updated);
              loadSupplementaryData();
            }}
          />
        </div>
      )}

      {activeTab === "standings" && <StandingsTable standings={standings} />}

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
          tournamentStatus={tournament.status}
          onPlayerUpdated={(updated) => {
            setTournament(updated);
            loadSupplementaryData();
          }}
        />
      )}

      <AlertDialog open={isRollbackOpen} onOpenChange={setIsRollbackOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Rollback Round {selectedRound?.roundNumber}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all pairings and recorded game results for Round{" "}
              {selectedRound?.roundNumber}. The tournament will revert to the
              previous round.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>
              Cancel
            </AlertDialogCancel>
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
      <AlertDialog open={isCompleteOpen} onOpenChange={setIsCompleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Complete and Finalize Tournament?
            </AlertDialogTitle>
            <AlertDialogDescription>
              All {tournament.totalRounds} rounds have concluded. Finalizing
              will mark the tournament as completed and lock official standings
              and crosstable results.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCompleteTournament}
              disabled={actionLoading}
              className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            >
              {actionLoading ? "Finalizing..." : "Complete Tournament"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
