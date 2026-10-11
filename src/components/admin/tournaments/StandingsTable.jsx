"use client";

import { Trophy, Medal, Award } from "lucide-react";

export default function StandingsTable({ standings = [] }) {
  if (!standings || standings.length === 0) {
    return (
      <div className="p-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
        <Trophy className="w-8 h-8 mx-auto text-slate-400 mb-2" />
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          No standings available yet
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Standings will calculate automatically once round 1 results are recorded.
        </p>
      </div>
    );
  }

  const getRankBadge = (rank) => {
    if (rank === 1) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 font-bold text-xs">
          1
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 font-bold text-xs">
          2
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/20 text-amber-800 dark:bg-amber-700/30 dark:text-amber-300 font-bold text-xs">
          3
        </span>
      );
    }
    return <span className="font-mono text-slate-400 font-semibold pl-1.5">#{rank}</span>;
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/40 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <th className="py-3.5 px-4 w-16">Rank</th>
            <th className="py-3.5 px-4">Player</th>
            <th className="py-3.5 px-4">Rating</th>
            <th className="py-3.5 px-4 text-center font-mono">Pts</th>
            <th className="py-3.5 px-4 text-center font-mono">BH-C1</th>
            <th className="py-3.5 px-4 text-center font-mono">BH-Full</th>
            <th className="py-3.5 px-4 text-center font-mono">SB</th>
            <th className="py-3.5 px-4 text-center font-mono">Wins</th>
            <th className="py-3.5 px-4 text-center">W/B Bal</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
          {standings.map((row) => (
            <tr
              key={row.playerId || row.id || row.rank}
              className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
            >
              <td className="py-3.5 px-4">{getRankBadge(row.rank)}</td>

              <td className="py-3.5 px-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {row.name}
                  </span>
                  {row.title && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 rounded">
                      {row.title}
                    </span>
                  )}
                </div>
              </td>

              <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400">
                {row.rating || 1200}
              </td>

              <td className="py-3.5 px-4 text-center font-mono font-black text-sm text-blue-600 dark:text-blue-400">
                {Number(row.points || row.score || 0).toFixed(1)}
              </td>

              <td className="py-3.5 px-4 text-center font-mono text-slate-600 dark:text-slate-300">
                {Number(row.buchholzCut1 || 0).toFixed(1)}
              </td>

              <td className="py-3.5 px-4 text-center font-mono text-slate-600 dark:text-slate-300">
                {Number(row.buchholz || 0).toFixed(1)}
              </td>

              <td className="py-3.5 px-4 text-center font-mono text-slate-600 dark:text-slate-300">
                {Number(row.sonnebornBerger || 0).toFixed(2)}
              </td>

              <td className="py-3.5 px-4 text-center font-mono text-slate-600 dark:text-slate-300 font-semibold">
                {row.wins || 0}
              </td>

              <td className="py-3.5 px-4 text-center">
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                    (row.colorBalance || 0) === 0
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      : (row.colorBalance || 0) > 0
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                  }`}
                >
                  {(row.colorBalance || 0) > 0 ? `+${row.colorBalance}` : row.colorBalance || 0}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
