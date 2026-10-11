"use client";

import { useState } from "react";
import { useApi } from "@/lib/api";
import { toast } from "sonner";
import { Plus, Loader2, X, Users, Trophy } from "lucide-react";

export default function CreateTournamentModal({ isOpen, onClose, onSuccess }) {
  const fetchApi = useApi();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [format, setFormat] = useState("swiss");
  const [totalRounds, setTotalRounds] = useState(7);
  const [round1TopSeedColor, setRound1TopSeedColor] = useState("W");
  const [section, setSection] = useState("open");
  const [bracket, setBracket] = useState("open");
  const [playersText, setPlayersText] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a tournament title");
      return;
    }

    setLoading(true);
    try {
      const players = [];
      const lines = playersText.split("\n").filter((l) => l.trim() !== "");
      for (const line of lines) {
        const parts = line.split(",").map((s) => s.trim());
        const name = parts[0];
        const rating = parts[1] ? parseInt(parts[1], 10) : 1200;
        if (name) {
          players.push({
            name,
            rating: isNaN(rating) ? 1200 : rating,
            active: true,
          });
        }
      }

      const payload = {
        title: title.trim(),
        format,
        totalRounds: Number(totalRounds),
        round1TopSeedColor,
        section: section.trim().toLowerCase() || "open",
        bracket: bracket.trim().toLowerCase() || "open",
        players,
      };

      const res = await fetchApi("/tournaments", {
        method: "POST",
        body: payload,
      });

      toast.success(res?.message || "Tournament created successfully!");
      if (onSuccess) onSuccess(res?.tournament);
      onClose();
    } catch (err) {
      toast.error("Error creating tournament: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                Create New Tournament
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure tournament format, rounds, and initial participants
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Tournament Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. En-Passant Inter-College Masters 2026"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Pairing Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="swiss">FIDE Dutch Swiss</option>
                <option value="round_robin">Round-Robin</option>
                <option value="knockout">Knockout</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Total Rounds
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={totalRounds}
                onChange={(e) => setTotalRounds(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Round 1 Top Color
              </label>
              <select
                value={round1TopSeedColor}
                onChange={(e) => setRound1TopSeedColor(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="W">White (W)</option>
                <option value="B">Black (B)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Section (Optional)
              </label>
              <input
                type="text"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                placeholder="open, solo, section-a"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Bracket (Optional)
              </label>
              <input
                type="text"
                value={bracket}
                onChange={(e) => setBracket(e.target.value)}
                placeholder="beginner, intermediate, advanced"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Initial Players (Optional)
              </label>
              <span className="text-[11px] text-slate-400">
                Format: Name, Rating (one per line)
              </span>
            </div>
            <textarea
              rows={4}
              value={playersText}
              onChange={(e) => setPlayersText(e.target.value)}
              placeholder={"Magnus Carlsen, 2830\nHikaru Nakamura, 2802\nFabiano Caruana, 2795"}
              className="w-full px-4 py-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-md transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create Tournament
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
