"use client";

import { useState } from "react";
import { useApi } from "@/lib/api";
import { toast } from "sonner";
import { UserPlus, UserX, UserCheck, Loader2, Users } from "lucide-react";

export default function PlayersManager({
  tournamentId,
  players = [],
  onPlayerUpdated,
}) {
  const fetchApi = useApi();
  const [name, setName] = useState("");
  const [rating, setRating] = useState(1200);
  const [title, setTitle] = useState("");
  const [adding, setAdding] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a player name");
      return;
    }

    setAdding(true);
    try {
      const res = await fetchApi(`/tournaments/${tournamentId}/players`, {
        method: "POST",
        body: {
          players: [
            {
              name: name.trim(),
              rating: Number(rating) || 1200,
              title: title.trim(),
              active: true,
            },
          ],
        },
      });

      toast.success("Player added successfully!");
      setName("");
      setRating(1200);
      setTitle("");
      if (onPlayerUpdated) onPlayerUpdated(res?.tournament);
    } catch (err) {
      toast.error("Error adding player: " + err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleToggleActive = async (playerId, currentActive) => {
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
    <div className="space-y-6">
      <form
        onSubmit={handleAddPlayer}
        className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-xs flex flex-wrap items-end gap-3"
      >
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Player Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Praggnanandhaa R"
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="w-28">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Rating
          </label>
          <input
            type="number"
            min="0"
            max="3500"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="w-28">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="GM, IM, FM"
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={adding}
          className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-xs transition-all h-[36px]"
        >
          {adding ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <UserPlus className="w-3.5 h-3.5" />
          )}
          Add Player
        </button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/40 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4 w-16">Seed #</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {players.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No players registered yet.
                </td>
              </tr>
            ) : (
              players.map((p, idx) => {
                const isUpdating = updatingId === p.id;
                return (
                  <tr
                    key={p.id || idx}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-400">
                      #{p.initialRank || idx + 1}
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                      {p.name}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">
                      {p.rating || 1200}
                    </td>

                    <td className="py-3 px-4">
                      {p.title ? (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 rounded">
                          {p.title}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {p.active ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          <UserCheck className="w-3.5 h-3.5" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 dark:text-slate-500">
                          <UserX className="w-3.5 h-3.5" />
                          Withdrawn
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(p.id, p.active)}
                        disabled={isUpdating}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                          p.active
                            ? "text-rose-600 border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                            : "text-emerald-600 border-emerald-200 dark:border-emerald-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                        }`}
                      >
                        {isUpdating ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : p.active ? (
                          "Withdraw"
                        ) : (
                          "Reactivate"
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
