"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useApi } from "@/lib/api";
import { toast } from "sonner";
import {
  Layers,
  Trash2,
  Edit2,
  ArrowLeft,
  Users,
  Trophy,
  ExternalLink,
  Loader2,
  Sparkles,
  UserCheck,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import EditEventPanel from "@/components/admin/events/EditEventPanel";

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

export default function AdminEventDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const fetchApi = useApi();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadEvent = async () => {
    try {
      const res = await fetchApi(`/events/${id}`);
      setEvent(res?.event || null);
    } catch (err) {
      toast.error("Failed to load event: " + err.message);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const res = await fetchApi(`/events/${id}`);
        if (!ignore) setEvent(res?.event || null);
      } catch (err) {
        if (!ignore) toast.error("Failed to load event: " + err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, [id, fetchApi]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await fetchApi(`/events/${id}`, {
        method: "DELETE",
      });
      toast.success("Event deleted successfully");
      router.push("/admin/events");
    } catch (err) {
      toast.error("Failed to delete event: " + err.message);
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  };

  const handleInitializeBrackets = async () => {
    setActionLoading(true);
    try {
      const res = await fetchApi(`/events/${id}/tournaments/initialize`, {
        method: "POST",
        body: {},
      });
      toast.success(
        res?.message || "Tournament brackets initialized successfully!",
      );
      await loadEvent();
    } catch (err) {
      toast.error("Initialization error: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSeedPlayers = async () => {
    setActionLoading(true);
    try {
      const res = await fetchApi(`/events/${id}/tournaments/seed`, {
        method: "POST",
        body: { autoAssignByRating: true },
      });
      const seededCount = res?.result?.totalSeeded || 0;
      if (seededCount === 0) {
        toast.info("No confirmed participant registrations found to seed yet.");
      } else {
        toast.success(
          `Seeded ${seededCount} participants into tournament brackets!`,
        );
      }
      await loadEvent();
    } catch (err) {
      toast.error("Seeding error: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-32 text-center">
        <Loader2 className="w-10 h-10 animate-spin mx-auto text-blue-500 mb-4" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Loading Event Details…
        </p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-16 text-center border border-slate-200 dark:border-slate-800 rounded-3xl bg-white/50 dark:bg-[#0F172A]/50">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
          Event Not Found
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          The requested event could not be found or may have been deleted.
        </p>
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Events</span>
        </Link>
      </div>
    );
  }

  const sectionsCount = event.sections?.length || 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-2">
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Events</span>
        </Link>
      </motion.div>

      <div>
        <motion.header
          variants={itemVariants}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800"
        >
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                {event.status || "draft"}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-600 dark:bg-slate-800/80 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60">
                {event.participationMode === "team" ? "Team" : "Individual"}
              </span>
              {event.root && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  {event.root}
                </span>
              )}
              {event.format && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  Format: {event.format}
                </span>
              )}
              {event.timeControl && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  Time: {event.timeControl}
                </span>
              )}
              {event.participationMode === "team" && event.teamConfig && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono text-slate-500 border border-slate-200 dark:border-slate-800">
                  Team Size: {event.teamConfig.minSize} –{" "}
                  {event.teamConfig.maxSize} players
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-50 mb-2">
              {event.title}
            </h1>

            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              {event.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsEditOpen((prev) => !prev)}
              className={`h-10 inline-flex items-center gap-1.5 px-4 rounded-xl text-xs font-semibold transition-all shadow-2xs active:scale-[0.98] ${
                isEditOpen
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs"
                  : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
              }`}
            >
              {isEditOpen ? (
                <>
                  <X className="w-3.5 h-3.5" />
                  <span>Close Edit</span>
                </>
              ) : (
                <>
                  <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Edit Event</span>
                </>
              )}
            </button>

            <Link
              href={`/admin/tournaments/events/${id}`}
              className="h-10 inline-flex items-center gap-1.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-2xs"
            >
              <span>Tournaments</span>
            </Link>

            <button
              onClick={handleInitializeBrackets}
              disabled={actionLoading}
              className="h-10 inline-flex items-center gap-1.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-sm shadow-blue-500/20 disabled:opacity-50"
            >
              {actionLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <></>
              )}
              <span>Initialize Tournaments</span>
            </button>

            <button
              onClick={handleSeedPlayers}
              disabled={actionLoading}
              className="h-10 inline-flex items-center gap-1.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors disabled:opacity-50"
            >
              <span>Seed Players</span>
            </button>

            <button
              onClick={() => setIsDeleteOpen(true)}
              aria-label="Delete Event"
              className="h-10 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </motion.header>

        <AnimatePresence initial={false}>
          {isEditOpen && (
            <motion.div
              key="edit-event-panel"
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{
                opacity: 1,
                height: "auto",
                marginTop: 24,
                transition: {
                  height: { duration: 0.38, ease: [0.04, 0.62, 0.23, 0.98] },
                  marginTop: { duration: 0.38, ease: [0.04, 0.62, 0.23, 0.98] },
                  opacity: { duration: 0.24, delay: 0.08 },
                },
              }}
              exit={{
                opacity: 0,
                height: 0,
                marginTop: 0,
                transition: {
                  opacity: { duration: 0.15 },
                  height: { duration: 0.32, ease: [0.04, 0.62, 0.23, 0.98] },
                  marginTop: { duration: 0.32, ease: [0.04, 0.62, 0.23, 0.98] },
                },
              }}
              className="overflow-hidden"
            >
              <EditEventPanel
                event={event}
                onClose={() => setIsEditOpen(false)}
                onSuccess={(updated) => {
                  setIsEditOpen(false);
                  if (updated) setEvent(updated);
                  else loadEvent();
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {event.bannerUrl && (
        <motion.div
          variants={itemVariants}
          className="relative h-48 md:h-64 w-full rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900"
        >
          <Image
            src={event.bannerUrl}
            alt={event.title}
            fill
            unoptimized
            className="object-cover"
          />
        </motion.div>
      )}

      <motion.section variants={itemVariants} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Sections & Brackets
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sections and rating brackets for this event
            </p>
          </div>

          <Link
            href={`/admin/tournaments/events/${id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <span>View Tournaments</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {sectionsCount === 0 ? (
          <div className="p-12 text-center border border-slate-200 dark:border-slate-800 rounded-3xl bg-white/50 dark:bg-[#0F172A]/50">
            <Layers className="w-8 h-8 text-slate-400 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
              No Sections Created
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
              Edit this event to add tournament sections (e.g. Open, Women) and
              rating brackets.
            </p>
            <button
              onClick={() => setIsEditOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              Add Sections
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {event.sections.map((section, sIdx) => (
              <div
                key={sIdx}
                className="p-6 rounded-2xl md:rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#0F172A] shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tight flex items-center gap-2">
                      <span>{section.title || section.name}</span>
                      <span className="text-xs font-normal normal-case text-slate-500 dark:text-slate-400">
                        ({section.brackets?.length || 0}{" "}
                        {section.brackets?.length === 1
                          ? "bracket"
                          : "brackets"}
                        )
                      </span>
                      {section.timeControl && (
                        <span className="px-2 py-0.5 text-[11px] font-mono font-semibold rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {section.timeControl}
                        </span>
                      )}
                    </h3>
                    {section.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {section.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(section.brackets || []).map((brk, bIdx) => (
                    <div
                      key={bIdx}
                      className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#020617]/50 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                          {brk.name}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold">
                            {brk.timeFormat || brk.timeControl || section.timeControl || event.timeControl || "10 + 5"}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
                            {brk.totalRounds}R
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs">
                        {brk.range && (
                          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                            <span>Range:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {brk.range}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                          <span>Rating:</span>
                          <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                            {brk.minRating !== null &&
                            brk.minRating !== undefined
                              ? brk.minRating
                              : "0"}{" "}
                            –{" "}
                            {brk.maxRating !== null &&
                            brk.maxRating !== undefined
                              ? brk.maxRating
                              : "3000"}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs">
                        <Link
                          href={`/admin/tournaments/events/${id}`}
                          className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          <span>View Bracket</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.section>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900 dark:text-slate-50">
              Delete Event?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
              Are you sure you want to delete &ldquo;{event.title}&rdquo;? This
              action cannot be undone. Associated tournaments and participant
              brackets may also be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              className="text-slate-600 dark:text-slate-300"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold"
            >
              {isDeleting ? "Deleting…" : "Delete Event"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
