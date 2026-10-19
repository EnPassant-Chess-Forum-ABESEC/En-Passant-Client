"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useApi } from "@/lib/api";
import { toast } from "sonner";
import {
  Calendar,
  Loader2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import EventRegistrationsTab from "@/components/admin/events/EventRegistrationsTab";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function AdminEventRegistrationsPage() {
  const fetchApi = useApi();
  const fetchApiRef = useRef(fetchApi);
  useEffect(() => {
    fetchApiRef.current = fetchApi;
  }, [fetchApi]);

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState("");

  const loadEvents = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setLoadingEvents(true);
      const res = await fetchApiRef.current("/events");
      const list = res?.events || [];
      setEvents(list);

      if (list.length > 0) {
        setSelectedEventId((prev) => {
          if (prev && list.some((e) => e._id === prev)) return prev;
          const activeEvent =
            list.find((e) => e.status === "active" || e.status === "upcoming" || e.status === "ongoing") ||
            list[0];
          return activeEvent._id;
        });
      }
    } catch (err) {
      toast.error("Failed to load events: " + err.message);
    } finally {
      if (isInitial) setLoadingEvents(false);
    }
  }, []);

  useEffect(() => {
    loadEvents(true);
  }, [loadEvents]);

  const selectedEvent = events.find((e) => e._id === selectedEventId) || null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.header
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-6 border-b border-slate-200 dark:border-slate-800"
      >
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-50 mb-2">
            Event Registrations
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-medium">
            Review registered participants and manage registrations
          </p>
        </div>

        {events.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <div className="w-full sm:w-80">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Select Tournament Event
              </label>
              <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                <SelectTrigger className="w-full h-10 bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-xs font-semibold rounded-xl text-left truncate">
                  <SelectValue placeholder="Select an Event">
                    {selectedEvent?.title || "Select an Event"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-xs font-medium max-h-72">
                  {events.map((ev) => (
                    <SelectItem key={ev._id} value={ev._id}>
                      {ev.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedEvent && (
              <Link
                href={`/admin/events/${selectedEvent._id}`}
                className="h-10 mt-auto inline-flex items-center gap-1.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-2xs"
                title="View Event Details & Brackets"
              >
                <span>Event Details</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            )}
          </div>
        )}
      </motion.header>

      <motion.div variants={itemVariants}>
        {loadingEvents ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-3" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Loading Events Ledger…
            </p>
          </div>
        ) : events.length === 0 ? (
          <div className="p-16 text-center border border-slate-200 dark:border-slate-800 rounded-3xl bg-white/50 dark:bg-[#0F172A]/50">
            <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
              No Events Found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
              Create an event first to start accepting and managing tournament registrations.
            </p>
            <Link
              href="/admin/events"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              <span>Go to Events Manager</span>
            </Link>
          </div>
        ) : selectedEventId ? (
          <EventRegistrationsTab
            eventId={selectedEventId}
            event={selectedEvent}
            onRefreshEvent={loadEvents}
          />
        ) : null}
      </motion.div>
    </motion.div>
  );
}
