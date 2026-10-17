"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/lib/api";
import { toast } from "sonner";
import { Layers, Loader2, X, CheckCircle2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function InitEventBracketsModal({ onClose, onSuccess }) {
  const fetchApi = useApi();
  const [loading, setLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState("");
  const [section, setSection] = useState("open");
  const [bracketsString, setBracketsString] = useState("beginner, intermediate, advanced");
  const [totalRounds, setTotalRounds] = useState(5);
  const [timeControl, setTimeControl] = useState("10 + 5");
  const [format, setFormat] = useState("swiss");

  const selectedEvent = events.find((x) => x._id === eventId);
  const availableSections = selectedEvent?.sections || [];

  useEffect(() => {
    async function loadEvents() {
      setEventsLoading(true);
      try {
        const res = await fetchApi("/events");
        const list = res?.events || [];
        setEvents(list);
        if (list.length > 0) {
          const first = list[0];
          setEventId(first._id);
          if (first.sections && first.sections.length > 0) {
            const firstSec = first.sections[0];
            setSection(firstSec.name);
            const brks = firstSec.brackets?.map((b) => b.name).join(", ");
            if (brks) setBracketsString(brks);
            if (firstSec.brackets?.[0]?.totalRounds) {
              setTotalRounds(firstSec.brackets[0].totalRounds);
            }
            if (firstSec.timeControl || first.timeControl) {
              setTimeControl(firstSec.timeControl || first.timeControl);
            }
          }
        }
      } catch (err) {
        toast.error("Failed to load events: " + err.message);
      } finally {
        setEventsLoading(false);
      }
    }
    loadEvents();
  }, [fetchApi]);

  const handleEventChange = (selectedId) => {
    setEventId(selectedId);
    const ev = events.find((x) => x._id === selectedId);
    if (ev?.sections && ev.sections.length > 0) {
      const firstSec = ev.sections[0];
      setSection(firstSec.name);
      const brks = firstSec.brackets?.map((b) => b.name).join(", ");
      if (brks) setBracketsString(brks);
      if (firstSec.brackets?.[0]?.totalRounds) {
        setTotalRounds(firstSec.brackets[0].totalRounds);
      }
      if (firstSec.timeControl || ev.timeControl) {
        setTimeControl(firstSec.timeControl || ev.timeControl);
      }
    } else {
      setSection("open");
      setBracketsString("beginner, intermediate, advanced");
      if (ev?.timeControl) setTimeControl(ev.timeControl);
    }
  };

  const handleSectionChange = (newSection) => {
    setSection(newSection);
    const sec = availableSections.find(
      (s) => s.name?.toLowerCase() === newSection?.toLowerCase(),
    );
    if (sec) {
      const brks = sec.brackets?.map((b) => b.name).join(", ");
      if (brks) setBracketsString(brks);
      if (sec.brackets?.[0]?.totalRounds) {
        setTotalRounds(sec.brackets[0].totalRounds);
      }
      if (sec.timeControl) {
        setTimeControl(sec.timeControl);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventId) {
      toast.error("Please select an event");
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
        section: section.trim().toLowerCase() || "open",
        brackets,
        totalRounds: Number(totalRounds),
        format,
        timeControl: timeControl.trim() || "10 + 5",
        timeFormat: timeControl.trim() || "10 + 5",
      };

      const res = await fetchApi(`/events/${eventId}/tournaments/initialize`, {
        method: "POST",
        body: payload,
      });

      toast.success(
        res?.message ||
          `Initialized ${brackets.length} tournament brackets for event!`,
      );
      if (onSuccess) onSuccess(res?.tournaments);
      if (onClose) onClose();
    } catch (err) {
      toast.error("Error initializing brackets: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-sm p-6 md:p-8">
      <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800 mb-6">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
              Initialize Event Brackets
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Generate linked Swiss tournaments directly from an official event
            </p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close Setup"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Select Event *
          </label>
          <Select
            value={eventId}
            onValueChange={handleEventChange}
            disabled={eventsLoading}
          >
            <SelectTrigger className="w-full h-[42px] px-3.5 bg-white dark:bg-[#020617] border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:ring-blue-500">
              <SelectValue
                placeholder={
                  eventsLoading ? "Loading available events..." : "Select Event"
                }
              >
                {eventsLoading ? (
                  <span className="flex items-center gap-2 text-slate-400">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-500" />
                    <span>Loading available events...</span>
                  </span>
                ) : selectedEvent ? (
                  `${selectedEvent.title} (${availableSections.length} sections)`
                ) : (
                  "Select Event"
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 z-[250]">
              {events.map((ev) => (
                <SelectItem
                  key={ev._id}
                  value={ev._id}
                  className="font-semibold text-xs focus:bg-slate-100 dark:focus:bg-slate-800/50"
                >
                  {ev.title} ({ev.sections?.length || 0} sections)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Section Name *
            </label>
            {availableSections.length > 0 ? (
              <Select value={section} onValueChange={handleSectionChange}>
                <SelectTrigger className="w-full h-[42px] px-3.5 bg-white dark:bg-[#020617] border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:ring-blue-500">
                  <SelectValue placeholder="Select Section">
                    {availableSections.find(
                      (s) => s.name?.toLowerCase() === section?.toLowerCase(),
                    )?.name || section}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 z-[250]">
                  {availableSections.map((sec, sIdx) => (
                    <SelectItem
                      key={sec.name || sIdx}
                      value={sec.name}
                      className="font-semibold text-xs uppercase focus:bg-slate-100 dark:focus:bg-slate-800/50"
                    >
                      {sec.name} ({sec.brackets?.length || 0} brackets)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <input
                type="text"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                placeholder="open, women, interclub"
                className="w-full h-[42px] px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            )}
          </div>

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
              Total Rounds *
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
            className="w-full h-[42px] px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
          {availableSections.find(
            (s) => s.name?.toLowerCase() === section?.toLowerCase(),
          )?.brackets?.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[11px] font-medium text-slate-400">
                Configured brackets:
              </span>
              {availableSections
                .find((s) => s.name?.toLowerCase() === section?.toLowerCase())
                .brackets.map((b, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                  >
                    <span className="font-semibold">{b.name}</span>
                    <span className="text-slate-400">
                      ({b.minRating ?? 0}–{b.maxRating ?? 3000})
                    </span>
                  </span>
                ))}
            </div>
          )}
          <p className="mt-1.5 text-[11px] text-slate-400">
            Each bracket generates an independent Swiss tournament connected to this event. Confirmed participants can be seeded directly from the Event dashboard.
          </p>
        </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Format
            </label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger className="w-full h-[42px] px-3.5 bg-white dark:bg-[#020617] border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:ring-blue-500">
                <SelectValue placeholder="Select Format" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 z-[250]">
                <SelectItem value="swiss" className="font-semibold text-xs focus:bg-slate-100 dark:focus:bg-slate-800/50">
                  FIDE Dutch Swiss
                </SelectItem>
                <SelectItem value="round_robin" className="font-semibold text-xs focus:bg-slate-100 dark:focus:bg-slate-800/50">
                  Round-Robin
                </SelectItem>
                <SelectItem value="knockout" className="font-semibold text-xs focus:bg-slate-100 dark:focus:bg-slate-800/50">
                  Knockout
                </SelectItem>
              </SelectContent>
            </Select>
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
              disabled={loading || eventsLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-sm shadow-blue-500/20 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Initializing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Initialize Event Brackets
                </>
              )}
            </button>
          </div>
        </form>
    </div>
  );
}
