"use client";

import { useState } from "react";
import { useApi } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function PlayersManager({
  tournamentId,
  players = [],
  tournamentStatus,
  onPlayerUpdated,
}) {
  const fetchApi = useApi();
  const [updatingId, setUpdatingId] = useState(null);

  const isCompleted = tournamentStatus?.toLowerCase() === "completed";

  const handleToggleActive = async (playerId, currentActive) => {
    if (isCompleted) {
      toast.error("Cannot modify players in a completed tournament");
      return;
    }
    setUpdatingId(playerId);
    try {
      const res = await fetchApi(
        `/tournaments/${tournamentId}/players/${playerId}`,
        {
          method: "PATCH",
          body: { active: !currentActive },
        },
      );

      toast.success(
        `Player ${!currentActive ? "reactivated" : "withdrawn/deactivated"}`,
      );
      if (onPlayerUpdated) onPlayerUpdated(res?.tournament);
    } catch (err) {
      toast.error("Error updating player: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/40 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <th className="py-3.5 px-4 whitespace-nowrap">Seed #</th>
            <th className="py-3.5 px-4">Name</th>
            <th className="py-3.5 px-4">Rating</th>
            <th className="py-3.5 px-4">Status</th>
            {!isCompleted && <th className="py-3.5 px-4 text-right">Action</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
          {players.length === 0 ? (
            <tr>
              <td
                colSpan={isCompleted ? 4 : 5}
                className="py-10 text-center text-slate-400"
              >
                No players registered yet.
              </td>
            </tr>
          ) : (
            players.map((p, idx) => {
              const isUpdating = updatingId === p.id;
              const isActive = p.active !== false;
              return (
                <tr
                  key={p.id || idx}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-400 whitespace-nowrap">
                    #{p.initialRank || idx + 1}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                    {p.name}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400">
                    {p.rating || 1200}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`text-xs font-semibold ${
                        isActive
                          ? "text-slate-800 dark:text-slate-200"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {isActive ? "Active" : "Withdrawn"}
                    </span>
                  </td>

                  {!isCompleted && (
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(p.id, p.active)}
                        disabled={isUpdating}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                          isActive
                            ? "text-rose-600 border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                            : "text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        {isUpdating && (
                          <Loader2 className="w-3 h-3 animate-spin inline mr-1" />
                        )}
                        {isActive ? "Withdraw" : "Reactivate"}
                      </button>
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
