"use client";

import { useState } from "react";
import { useApi } from "@/lib/api";
import { toast } from "sonner";
import { Layers, Loader2, X, CheckCircle2 } from "lucide-react";

export default function InitEventBracketsModal({ isOpen, onClose, onSuccess }) {
  const fetchApi = useApi();
  const [loading, setLoading] = useState(false);
  const [eventId, setEventId] = useState("");
  const [section, setSection] = useState("college_masters");
  const [bracketsString, setBracketsString] = useState("beginner, intermediate, advanced");
  const [totalRounds, setTotalRounds] = useState(10);
  const [format, setFormat] = useState("swiss");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventId.trim()) {
      toast.error("Please enter a valid Event ID");
      return;
    }

    const brackets = bracketsString
      .split(",")
      .map((b) => b.trim().toLowerCase())
      .filter(Boolean);

    if (brackets.length === 0) {
      toast.error("At least one bracket name is required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        section: section.trim().toLowerCase() || "main",
        brackets,
        totalRounds: Number(totalRounds),
        format,
      };

      const res = await fetchApi(`/events/${eventId.trim()}/tournaments/initialize`, {
        method: "POST",
        body: payload,
      });

      toast.success(
        res?.message ||
          `Initialized ${brackets.length} tournament brackets for event!`,
      );
      if (onSuccess) onSuccess(res?.tournaments);
      onClose();
    } catch (err) {
      toast.error("Error initializing brackets: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                Initialize Event Brackets
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Create isolated Swiss tournaments for event divisions
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Event ID (MongoDB ObjectId) *
            </label>
            <input
              type="text"
              required
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              placeholder="e.g. 660f89b91e92c287113e1104"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Section Name
              </label>
              <input
                type="text"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                placeholder="college_masters, open"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
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
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Brackets (Comma-separated)
            </label>
            <input
              type="text"
              value={bracketsString}
              onChange={(e) => setBracketsString(e.target.value)}
              placeholder="beginner, intermediate, advanced"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Each bracket generates an independent FIDE pairing engine instance.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="swiss">FIDE Dutch Swiss</option>
              <option value="round_robin">Round-Robin</option>
              <option value="knockout">Knockout</option>
            </select>
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
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-xl shadow-md transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Initializing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Initialize Brackets
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
