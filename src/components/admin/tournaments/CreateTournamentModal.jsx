"use client";

import { useState } from "react";
import { useApi } from "@/lib/api";
import { toast } from "sonner";
import { Plus, Loader2, X, Trophy } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateTournamentModal({ isOpen, onClose, onSuccess }) {
  const fetchApi = useApi();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [format, setFormat] = useState("swiss");
  const [totalRounds, setTotalRounds] = useState(7);
  const [timeControl, setTimeControl] = useState("10 + 5");
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
        timeControl: timeControl.trim() || "10 + 5",
        timeFormat: timeControl.trim() || "10 + 5",
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
              className="w-full h-[42px] px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Pairing Format
              </label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger className="w-full h-[42px] px-3.5 bg-white dark:bg-[#020617] border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:ring-blue-500">
                  <SelectValue placeholder="Select Format" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 z-[250]">
                  <SelectItem
                    value="swiss"
                    className="font-semibold text-xs focus:bg-slate-100 dark:focus:bg-slate-800/50"
                  >
                    FIDE Dutch Swiss
                  </SelectItem>
                  <SelectItem
                    value="round_robin"
                    className="font-semibold text-xs focus:bg-slate-100 dark:focus:bg-slate-800/50"
                  >
                    Round-Robin
                  </SelectItem>
                  <SelectItem
                    value="knockout"
                    className="font-semibold text-xs focus:bg-slate-100 dark:focus:bg-slate-800/50"
                  >
                    Knockout
                  </SelectItem>
                </SelectContent>
              </Select>
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
                className="w-full h-[42px] px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Round 1 Top Color
              </label>
              <Select
                value={round1TopSeedColor}
                onValueChange={setRound1TopSeedColor}
              >
                <SelectTrigger className="w-full h-[42px] px-3.5 bg-white dark:bg-[#020617] border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:ring-blue-500">
                  <SelectValue placeholder="Top Seed Color" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 z-[250]">
                  <SelectItem
                    value="W"
                    className="font-semibold text-xs focus:bg-slate-100 dark:focus:bg-slate-800/50"
                  >
                    White (W)
                  </SelectItem>
                  <SelectItem
                    value="B"
                    className="font-semibold text-xs focus:bg-slate-100 dark:focus:bg-slate-800/50"
                  >
                    Black (B)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Time Format
              </label>
              <input
                type="text"
                value={timeControl}
                onChange={(e) => setTimeControl(e.target.value)}
                placeholder="e.g. 10 + 5 or 15 + 2"
                className="w-full h-[42px] px-4 py-2 text-xs font-mono font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Section (Optional)
              </label>
              <input
                type="text"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                placeholder="open, women, interclub"
                className="w-full h-[42px] px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
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
                className="w-full h-[42px] px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
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
              rows={3}
              value={playersText}
              onChange={(e) => setPlayersText(e.target.value)}
              placeholder={
                "Magnus Carlsen, 2830\nHikaru Nakamura, 2802\nFabiano Caruana, 2795"
              }
              className="w-full px-4 py-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
            <p className="mt-1.5 text-[11px] text-slate-400">
              Note: For official events (like ACC), players are pulled directly
              from Event Registrations. This manual field is only for ad-hoc
              standalone tournaments.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white disabled:opacity-50 rounded-xl shadow-xs transition-all active:scale-[0.98]"
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
