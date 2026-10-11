"use client";

import { useState } from "react";
import { useApi } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, CheckCircle, ShieldAlert, Award, AlertCircle } from "lucide-react";

export default function RoundPairingsTable({
  tournamentId,
  round,
  playerMap,
  onGameUpdated,
}) {
  const fetchApi = useApi();
  const [updatingGameId, setUpdatingGameId] = useState(null);

  if (!round || !round.games || round.games.length === 0) {
    return (
      <div className="p-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
        <AlertCircle className="w-8 h-8 mx-auto text-slate-400 mb-2" />
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          No games paired for this round yet
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Click &quot;Pair Next Round&quot; above to generate FIDE Dutch Swiss pairings.
        </p>
      </div>
    );
  }

  const handleResultChange = async (gameId, newResult) => {
    setUpdatingGameId(gameId);
    try {
      const res = await fetchApi(
        `/tournaments/${tournamentId}/rounds/${round.roundNumber}/games/${gameId}`,
        {
          method: "PATCH",
          body: { result: newResult === "CLEAR" ? null : newResult },
        },
      );

      toast.success(`Board result updated to ${newResult === "CLEAR" ? "Pending" : newResult}`);
      if (onGameUpdated) onGameUpdated(res?.tournament);
    } catch (err) {
      toast.error("Failed to update result: " + err.message);
    } finally {
      setUpdatingGameId(null);
    }
  };

  const RESULT_OPTIONS = [
    { label: "1 - 0", value: "1-0", badgeClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" },
    { label: "½ - ½", value: "1/2-1/2", badgeClass: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-800" },
    { label: "0 - 1", value: "0-1", badgeClass: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800" },
    { label: "1 - 0F", value: "1-0F", badgeClass: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-800" },
    { label: "0 - 1F", value: "0-1F", badgeClass: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-800" },
  ];

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/40 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <th className="py-3.5 px-4 w-16">Board</th>
            <th className="py-3.5 px-4">White Player</th>
            <th className="py-3.5 px-4 text-center w-24">Score</th>
            <th className="py-3.5 px-4">Black Player</th>
            <th className="py-3.5 px-4 text-right">Result Control</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
          {round.games.map((game) => {
            const white = playerMap.get(game.whitePlayerId);
            const black = playerMap.get(game.blackPlayerId);
            const isUpdating = updatingGameId === game.id;
            const isBye = !game.blackPlayerId;

            return (
              <tr
                key={game.id}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="py-3.5 px-4 font-mono font-bold text-slate-400">
                  #{game.boardNumber}
                </td>

                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full border border-slate-400 bg-white shrink-0 shadow-xs" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100">
                        {white?.name || game.whitePlayerId || "BYE"}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Rating: {white?.rating || "—"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-4 text-center">
                  {game.result ? (
                    <span
                      className={`inline-block px-2.5 py-1 font-mono font-bold text-xs rounded-lg border ${
                        game.result === "1-0"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                          : game.result === "0-1"
                            ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800"
                            : game.result === "1/2-1/2"
                              ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                              : "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200 dark:border-purple-800"
                      }`}
                    >
                      {game.result}
                    </span>
                  ) : (
                    <span className="text-slate-400 font-mono text-[11px]">
                      vs
                    </span>
                  )}
                </td>

                <td className="py-3.5 px-4">
                  {isBye ? (
                    <div className="flex items-center gap-2 text-slate-400 italic">
                      <Award className="w-3.5 h-3.5 text-purple-500" />
                      <span>Pairing Bye (PAB)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-600 bg-slate-900 shrink-0 shadow-xs" />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-slate-100">
                          {black?.name || game.blackPlayerId}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Rating: {black?.rating || "—"}
                        </p>
                      </div>
                    </div>
                  )}
                </td>

                <td className="py-3.5 px-4 text-right">
                  {isUpdating ? (
                    <div className="inline-flex items-center gap-1.5 text-xs text-blue-500 font-semibold">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : isBye ? (
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-md">
                      Auto-Allocated 1.0
                    </span>
                  ) : (
                    <div className="inline-flex items-center gap-1">
                      {RESULT_OPTIONS.map((opt) => {
                        const isCurrent = game.result === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => handleResultChange(game.id, opt.value)}
                            className={`px-2.5 py-1 font-mono text-xs font-bold rounded-lg border transition-all ${
                              isCurrent
                                ? `${opt.badgeClass} ring-2 ring-blue-500/50 shadow-xs`
                                : "bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                      {game.result && (
                        <button
                          type="button"
                          onClick={() => handleResultChange(game.id, "CLEAR")}
                          title="Reset result to pending"
                          className="px-2 py-1 text-[11px] text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                        >
                          Clear
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
  );
}
