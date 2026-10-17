"use client";

import { useState } from "react";
import Link from "next/link";
import { useApi } from "@/lib/api";
import { toast } from "sonner";
import {
  Loader2,
  Award,
  AlertCircle,
  RotateCcw,
  Lock,
  Users,
  FileText,
} from "lucide-react";

export default function RoundPairingsTable({
  tournamentId,
  tournament,
  round,
  playerMap,
  onGameUpdated,
  onSelectTab,
  onRollbackRequest,
}) {
  const fetchApi = useApi();
  const [updatingGameId, setUpdatingGameId] = useState(null);
  const [showForfeits, setShowForfeits] = useState({});

  const maxRoundNumber =
    tournament?.rounds?.reduce(
      (max, r) => Math.max(max, r.roundNumber),
      round?.roundNumber || 1,
    ) ||
    round?.roundNumber ||
    1;

  const isSubsequentRoundGenerated = (round?.roundNumber || 1) < maxRoundNumber;
  const isTournamentCompleted =
    tournament?.status?.toLowerCase() === "completed";
  const isLocked = isSubsequentRoundGenerated || isTournamentCompleted;

  const activeCount = (tournament?.players || []).filter(
    (p) => p.active !== false,
  ).length;

  if (!round || !round.games || round.games.length === 0) {
    if (activeCount < 2) {
      return (
        <div className="p-12 text-center border border-b border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-[#0F172A]">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Cannot Generate Pairings: Insufficient Players
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            At least 2 active players are required to pair a tournament round.
            Currently, there{" "}
            {activeCount === 1
              ? "is only 1 registered player"
              : "are 0 registered players"}
            .
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
            {onSelectTab && (
              <button
                onClick={() => onSelectTab("players")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90 transition-opacity shadow-xs"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Go to Players Tab</span>
              </button>
            )}
            {tournament?.referenceId && (
              <Link
                href={`/admin/tournaments/events/${tournament.eventId || tournament.referenceId}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
              >
                <span>Seed from Event Registrations</span>
              </Link>
            )}
            {round && onRollbackRequest && (
              <button
                onClick={onRollbackRequest}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-[#020617] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Rollback Empty Round</span>
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="p-12 text-center border border-slate-200 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-[#0F172A]/50">
        <AlertCircle className="w-8 h-8 mx-auto text-slate-400 mb-2" />
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          No games paired for this round yet
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Click &quot;Pair Next Round&quot; above to generate pairings for Round{" "}
          {round?.roundNumber || 1}.
        </p>
      </div>
    );
  }

  const handleResultChange = async (gameId, newResult) => {
    if (isLocked) {
      toast.error(
        `Round ${round.roundNumber} is finalized because Round ${round.roundNumber + 1} pairings have already been generated.`,
      );
      return;
    }
    setUpdatingGameId(gameId);
    try {
      const res = await fetchApi(
        `/tournaments/${tournamentId}/rounds/${round.roundNumber}/games/${gameId}`,
        {
          method: "PATCH",
          body: { result: newResult === "CLEAR" ? null : newResult },
        },
      );

      const displayResult =
        newResult === "CLEAR"
          ? "Pending"
          : newResult === "1/2-1/2"
            ? "0.5 - 0.5"
            : newResult;

      toast.success(`Result updated to ${displayResult}`);
      if (onGameUpdated) onGameUpdated(res?.tournament);
    } catch (err) {
      toast.error("Failed to update result: " + err.message);
    } finally {
      setUpdatingGameId(null);
    }
  };

  const pdfUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}/tournaments/${tournamentId}/rounds/${round.roundNumber}/pdf`;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 px-1">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
          Round {round.roundNumber} &bull; {round.games.length} Board{round.games.length === 1 ? "" : "s"}
        </span>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 shadow-2xs transition-colors"
          title={`Download or Print Round ${round.roundNumber} Pairings PDF`}
        >
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span>Export PDF</span>
        </a>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-sm">
        <table className="w-full table-fixed min-w-[820px] text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-4 px-4 w-14 text-left">Board</th>
              <th className="py-4 pl-4 pr-2 text-left w-48">White Player</th>
              <th className="py-4 px-1 text-center w-20">Score</th>
              <th className="py-4 pl-10 pr-4 text-left w-48">Black Player</th>
              <th className="py-4 px-5 text-right w-auto">Record Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {round.games.map((game) => {
              const white = playerMap.get(game.whitePlayerId);
              const black = playerMap.get(game.blackPlayerId);
              const isUpdating = updatingGameId === game.id;
              const isBye = !game.blackPlayerId;
              const hasForfeit =
                game.result === "1-0F" || game.result === "0-1F";
              const isForfeitsOpen = showForfeits[game.id];

              return (
                <tr
                  key={game.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-4 px-4 font-mono font-bold text-slate-400">
                    #{game.boardNumber}
                  </td>

                  <td className="py-4 pl-4 pr-2 text-left w-48">
                    <div className="flex items-baseline truncate">
                      <span
                        className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate"
                        title={white?.name || game.whitePlayerId}
                      >
                        {white?.name || game.whitePlayerId || "BYE"}
                      </span>
                      <span className="text-xs font-normal text-slate-400 ml-1.5 font-mono shrink-0">
                        ({white?.rating || "—"})
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-1 text-center w-20">
                    {game.result ? (
                      <span className="inline-block px-2.5 py-1 font-mono font-bold text-xs rounded-lg bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 whitespace-nowrap shadow-2xs">
                        {game.result === "1/2-1/2" ? "0.5 - 0.5" : game.result}
                      </span>
                    ) : (
                      <span className="text-slate-300 dark:text-slate-600 font-mono text-base font-bold select-none">
                        —
                      </span>
                    )}
                  </td>

                  <td className="py-4 pl-10 pr-4 text-left w-48">
                    {isBye ? (
                      <div className="flex items-center gap-1.5 text-slate-400 italic">
                        <Award className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                        <span className="truncate">Bye Assigned (1.0 Pt)</span>
                      </div>
                    ) : (
                      <div className="flex items-baseline truncate">
                        <span
                          className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate"
                          title={black?.name || game.blackPlayerId}
                        >
                          {black?.name || game.blackPlayerId}
                        </span>
                        <span className="text-xs font-normal text-slate-400 ml-1.5 font-mono shrink-0">
                          ({black?.rating || "—"})
                        </span>
                      </div>
                    )}
                  </td>

                  <td className="py-4 px-5 text-right w-auto">
                    {isUpdating ? (
                      <div className="inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-bold">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </div>
                    ) : isLocked ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/80 select-none">
                        <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Round Finalized</span>
                      </div>
                    ) : isBye ? (
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                        Automatic 1.0 Point
                      </span>
                    ) : (
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleResultChange(game.id, "1-0")}
                          title="White Wins (1 - 0)"
                          className={`h-10 px-4 font-mono text-xs font-black rounded-xl border transition-all active:scale-95 ${
                            game.result === "1-0"
                              ? "bg-slate-100 text-slate-900 border-slate-400 dark:bg-slate-700 dark:text-white dark:border-slate-500 shadow-xs ring-2 ring-slate-900/10 dark:ring-white/10"
                              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white shadow-2xs"
                          }`}
                        >
                          1 - 0
                        </button>

                        <button
                          type="button"
                          onClick={() => handleResultChange(game.id, "1/2-1/2")}
                          title="Draw (0.5 - 0.5)"
                          className={`h-10 px-4 font-mono text-xs font-black rounded-xl border transition-all active:scale-95 ${
                            game.result === "1/2-1/2"
                              ? "bg-slate-100 text-slate-900 border-slate-400 dark:bg-slate-700 dark:text-white dark:border-slate-500 shadow-xs ring-2 ring-slate-900/10 dark:ring-white/10"
                              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white shadow-2xs"
                          }`}
                        >
                          0.5 - 0.5
                        </button>

                        <button
                          type="button"
                          onClick={() => handleResultChange(game.id, "0-1")}
                          title="Black Wins (0 - 1)"
                          className={`h-10 px-4 font-mono text-xs font-black rounded-xl border transition-all active:scale-95 ${
                            game.result === "0-1"
                              ? "bg-slate-100 text-slate-900 border-slate-400 dark:bg-slate-700 dark:text-white dark:border-slate-500 shadow-xs ring-2 ring-slate-900/10 dark:ring-white/10"
                              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white shadow-2xs"
                          }`}
                        >
                          0 - 1
                        </button>

                        {(isForfeitsOpen || hasForfeit) && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                handleResultChange(game.id, "1-0F")
                              }
                              title="White Win by Forfeit (1 - 0F)"
                              className={`h-9 px-2.5 font-mono text-[11px] font-bold rounded-xl border transition-all ${
                                game.result === "1-0F"
                                  ? "bg-slate-100 text-slate-900 border-slate-400 dark:bg-slate-700 dark:text-white dark:border-slate-500 shadow-xs ring-2 ring-slate-900/10"
                                  : "bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              1-0F
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleResultChange(game.id, "0-1F")
                              }
                              title="Black Win by Forfeit (0 - 1F)"
                              className={`h-9 px-2.5 font-mono text-[11px] font-bold rounded-xl border transition-all ${
                                game.result === "0-1F"
                                  ? "bg-slate-100 text-slate-900 border-slate-400 dark:bg-slate-700 dark:text-white dark:border-slate-500 shadow-xs ring-2 ring-slate-900/10"
                                  : "bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              0-1F
                            </button>
                          </>
                        )}

                        {!isForfeitsOpen && !hasForfeit && (
                          <button
                            type="button"
                            onClick={() =>
                              setShowForfeits((prev) => ({
                                ...prev,
                                [game.id]: true,
                              }))
                            }
                            title="Show Forfeit Options"
                            className="h-9 px-2 text-[10px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            Forfeit...
                          </button>
                        )}

                        {game.result && (
                          <button
                            type="button"
                            onClick={() => handleResultChange(game.id, "CLEAR")}
                            title="Reset result to pending"
                            className="h-9 px-2.5 inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reset</span>
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
