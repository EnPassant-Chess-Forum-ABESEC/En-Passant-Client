"use client";

import { useState } from "react";

export default function CrossTableMatrix({ crossTable = [] }) {
  const [selectedMatch, setSelectedMatch] = useState(null);

  if (!crossTable || crossTable.length === 0) {
    return (
      <div className="p-12 text-center border  border-slate-200 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-[#0F172A]/50">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          No round matrix data available yet
        </p>
      </div>
    );
  }

  const maxRounds = crossTable.reduce(
    (max, row) => Math.max(max, row.rounds ? row.rounds.length : 0),
    0,
  );

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-sm scrollbar-thin [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.4)_transparent] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50/95 dark:bg-slate-900/95 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider backdrop-blur-xs">
              <th className="py-3 px-2 w-11 min-w-[44px] max-w-[44px] font-mono text-center sticky left-0 z-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                #
              </th>

              <th className="py-3 pl-4 pr-3 w-52 min-w-[180px] text-left sticky left-11 z-20 bg-slate-50 dark:bg-slate-900 border-b border-r border-slate-200/80 dark:border-slate-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                Player
              </th>

              {Array.from({ length: maxRounds }).map((_, idx) => (
                <th
                  key={idx}
                  className="py-3 px-2 text-center w-16 min-w-[56px] max-w-[68px] font-bold text-slate-700 dark:text-slate-300 border-b border-r border-slate-200 dark:border-slate-800 whitespace-nowrap font-mono"
                >
                  R{idx + 1}
                </th>
              ))}

              <th className="py-3 px-3 text-center font-mono w-16 min-w-[64px] max-w-[64px] sticky right-0 z-20 bg-slate-50 dark:bg-slate-900 border-b border-l border-slate-200/80 dark:border-slate-800 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {crossTable.map((row, rowIdx) => (
              <tr
                key={row.playerId || rowIdx}
                className="group hover:bg-slate-50/40 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="py-2.5 px-2 w-11 min-w-[44px] max-w-[44px] font-semibold text-slate-400 font-mono text-xs text-center sticky left-0 z-10 bg-white dark:bg-[#0F172A] group-hover:bg-slate-50 dark:group-hover:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800/60 transition-colors">
                  #{row.rank || rowIdx + 1}
                </td>

                <td className="py-2.5 pl-4 pr-3 text-left w-52 min-w-[180px] sticky left-11 z-10 bg-white dark:bg-[#0F172A] group-hover:bg-slate-50 dark:group-hover:bg-slate-800/80 border-b border-r border-slate-200/80 dark:border-slate-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] transition-colors">
                  <div className="flex items-baseline min-w-0">
                    <span
                      className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate"
                      title={row.name}
                    >
                      {row.name}
                    </span>
                    <span className="text-xs font-normal text-slate-400 ml-1.5 font-mono shrink-0">
                      ({row.rating || 1200})
                    </span>
                  </div>
                </td>

                {Array.from({ length: maxRounds }).map((_, rIdx) => {
                  const cell = row.rounds ? row.rounds[rIdx] : null;
                  if (!cell) {
                    return (
                      <td
                        key={rIdx}
                        className="py-2.5 px-2 text-center text-slate-300 dark:text-slate-700 font-mono text-xs border-b border-r border-slate-100 dark:border-slate-800/60"
                      >
                        —
                      </td>
                    );
                  }

                  if (cell.isBye) {
                    const matchInfo = {
                      round: rIdx + 1,
                      playerName: row.name,
                      oppName: "Pairing Bye",
                      colorLabel: "None",
                      outcomeLabel: "+1.0 Pt (Bye)",
                    };
                    return (
                      <td
                        key={rIdx}
                        onClick={() => setSelectedMatch(matchInfo)}
                        onMouseEnter={() => setSelectedMatch(matchInfo)}
                        className="py-2 px-1 text-center border-b border-r border-slate-100 dark:border-slate-800/60 cursor-pointer hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-colors"
                        title={`Round ${rIdx + 1}: Pairing Bye (+1.0)`}
                      >
                        <div className="flex flex-col items-center justify-center py-0.5">
                          <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 leading-none">
                            1.0
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-1 leading-none uppercase">
                            bye
                          </span>
                        </div>
                      </td>
                    );
                  }

                  const isOngoing =
                    cell.isOngoing ||
                    cell.result === null ||
                    cell.result === "*";
                  const pts =
                    cell.score !== undefined && cell.score !== null
                      ? cell.score
                      : cell.points;
                  const isWin = !isOngoing && pts === 1;
                  const isDraw = !isOngoing && pts === 0.5;

                  const colorLabel =
                    cell.color === "W"
                      ? "White"
                      : cell.color === "B"
                        ? "Black"
                        : "";
                  const oppName =
                    cell.opponentName && cell.opponentName !== "-"
                      ? cell.opponentName
                      : cell.opponentRank
                        ? `Player #${cell.opponentRank}`
                        : "Opponent";

                  const oppRank = cell.opponentRank || "";

                  const outcomeLabel = isOngoing
                    ? "In Progress"
                    : isWin
                      ? "1.0 Win"
                      : isDraw
                        ? "0.5 Draw"
                        : "0.0 Loss";

                  const matchInfo = {
                    round: rIdx + 1,
                    playerName: row.name,
                    oppName,
                    colorLabel: colorLabel ? `Played ${colorLabel}` : "",
                    outcomeLabel,
                  };

                  return (
                    <td
                      key={rIdx}
                      onClick={() => setSelectedMatch(matchInfo)}
                      onMouseEnter={() => setSelectedMatch(matchInfo)}
                      className="py-2 px-1 text-center border-b border-r border-slate-100 dark:border-slate-800/60 cursor-pointer hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-colors"
                      title={`Round ${rIdx + 1}: vs ${oppName} (${colorLabel}) — ${outcomeLabel}`}
                    >
                      <div className="flex flex-col items-center justify-center py-0.5">
                        <span
                          className={`font-mono text-xs font-bold leading-none ${
                            isOngoing
                              ? "text-slate-400 animate-pulse"
                              : isWin
                                ? "text-slate-900 dark:text-slate-100"
                                : isDraw
                                  ? "text-slate-600 dark:text-slate-300 font-semibold"
                                  : "text-slate-400 dark:text-slate-500 font-normal"
                          }`}
                        >
                          {isOngoing
                            ? "•"
                            : pts !== undefined && pts !== null
                              ? pts.toFixed(1)
                              : "—"}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-1 leading-none">
                          {oppRank ? `${oppRank}` : ""}
                          {cell.color ? cell.color.toLowerCase() : ""}
                        </span>
                      </div>
                    </td>
                  );
                })}

                <td className="py-2.5 px-3 text-center w-16 min-w-[64px] max-w-[64px] sticky right-0 z-10 bg-white dark:bg-[#0F172A] group-hover:bg-slate-50 dark:group-hover:bg-slate-800/80 border-b border-l border-slate-200/80 dark:border-slate-800 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.06)] transition-colors">
                  <span className="inline-block font-mono font-bold text-sm text-slate-900 dark:text-slate-100">
                    {Number(row.points || row.score || 0).toFixed(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedMatch && (
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-3 text-xs transition-all">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
              Round {selectedMatch.round}:
            </span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              {selectedMatch.playerName}
            </span>
            <span className="text-slate-400 font-normal">vs</span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              {selectedMatch.oppName}
            </span>
            {selectedMatch.colorLabel && (
              <span className="text-slate-400 font-mono text-[11px]">
                ({selectedMatch.colorLabel})
              </span>
            )}
          </div>
          <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 shadow-2xs">
            {selectedMatch.outcomeLabel}
          </span>
        </div>
      )}
    </div>
  );
}
