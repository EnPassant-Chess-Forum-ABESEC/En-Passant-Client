"use client";

import { Grid } from "lucide-react";

export default function CrossTableMatrix({ crossTable = [] }) {
  if (!crossTable || crossTable.length === 0) {
    return (
      <div className="p-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
        <Grid className="w-8 h-8 mx-auto text-slate-400 mb-2" />
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          No cross-table data available
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Cross-table entries generate as rounds progress.
        </p>
      </div>
    );
  }

  const maxRounds = crossTable.reduce(
    (max, row) => Math.max(max, row.rounds ? row.rounds.length : 0),
    0,
  );

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/40 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <th className="py-3 px-3 w-12">#</th>
            <th className="py-3 px-4 min-w-[180px]">Player Name</th>
            <th className="py-3 px-3 w-16">Rating</th>
            {Array.from({ length: maxRounds }).map((_, idx) => (
              <th key={idx} className="py-3 px-2 text-center w-14 font-mono">
                R{idx + 1}
              </th>
            ))}
            <th className="py-3 px-3 text-center font-mono w-16">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
          {crossTable.map((row, rowIdx) => (
            <tr
              key={row.playerId || rowIdx}
              className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors font-mono"
            >
              <td className="py-2.5 px-3 font-bold text-slate-400">
                {row.rank || rowIdx + 1}
              </td>

              <td className="py-2.5 px-4 font-sans font-bold text-slate-900 dark:text-slate-100 truncate">
                {row.name}
              </td>

              <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 text-xs">
                {row.rating || 1200}
              </td>

              {Array.from({ length: maxRounds }).map((_, rIdx) => {
                const cell = row.rounds ? row.rounds[rIdx] : null;
                if (!cell) {
                  return (
                    <td key={rIdx} className="py-2.5 px-2 text-center text-slate-300 dark:text-slate-700">
                      —
                    </td>
                  );
                }

                const scoreColor =
                  cell.score === 1
                    ? "text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/30"
                    : cell.score === 0.5
                      ? "text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/30"
                      : cell.score === 0
                        ? "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30"
                        : "text-slate-400";

                return (
                  <td key={rIdx} className="py-2.5 px-2 text-center">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[11px] ${scoreColor}`}
                      title={`Round ${rIdx + 1}: Opponent #${cell.opponentRank || "?"} (${cell.color || ""})`}
                    >
                      {cell.opponentRank ? `${cell.opponentRank}${cell.color?.toLowerCase() || ""}` : "BYE"}
                      <span className="ml-0.5 font-black">
                        {cell.score === 1 ? "+" : cell.score === 0.5 ? "=" : "-"}
                      </span>
                    </span>
                  </td>
                );
              })}

              <td className="py-2.5 px-3 text-center font-black text-sm text-blue-600 dark:text-blue-400">
                {Number(row.points || row.score || 0).toFixed(1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
