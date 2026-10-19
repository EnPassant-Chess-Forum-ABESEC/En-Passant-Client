"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  Layers,
  Clock,
  Trash2,
  Edit2,
  ChevronRight,
  Users,
  Trophy,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";
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
import { useApi } from "@/lib/api";
import { toast } from "sonner";
import AdminSearchBar from "@/components/admin/AdminSearchBar";

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

function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  } catch {
    return dateStr;
  }
}

export default function EventList({
  events = [],
  onDeleted,
  onRefresh,
  onEdit,
}) {
  const fetchApi = useApi();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [modeFilter, setModeFilter] = useState("ALL");
  const [sortFilter, setSortFilter] = useState("NEWEST");
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = useMemo(() => {
    let result = events.filter((ev) => {
      const q = search.toLowerCase();
      const matchesSearch =
        (ev.title || "").toLowerCase().includes(q) ||
        (ev.description || "").toLowerCase().includes(q) ||
        (ev.sections || []).some((s) =>
          (s.name || "").toLowerCase().includes(q),
        );

      const matchesStatus =
        statusFilter === "ALL" ? true : ev.status === statusFilter;

      const matchesMode =
        modeFilter === "ALL" ? true : ev.participationMode === modeFilter;

      return matchesSearch && matchesStatus && matchesMode;
    });

    if (sortFilter === "NEWEST") {
      result.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      );
    } else if (sortFilter === "OLDEST") {
      result.sort(
        (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
      );
    } else if (sortFilter === "START_DATE") {
      result.sort(
        (a, b) => new Date(a.startDate || 0) - new Date(b.startDate || 0),
      );
    } else if (sortFilter === "SECTIONS_DESC") {
      result.sort(
        (a, b) => (b.sections?.length || 0) - (a.sections?.length || 0),
      );
    } else if (sortFilter === "TITLE_ASC") {
      result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    return result;
  }, [events, search, statusFilter, modeFilter, sortFilter]);

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await fetchApi(`/events/${deleteTargetId}`, {
        method: "DELETE",
      });
      toast.success("Event deleted successfully");
      if (onDeleted) onDeleted(deleteTargetId);
    } catch (err) {
      toast.error("Failed to delete event: " + err.message);
    } finally {
      setIsDeleting(false);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-6">
      <AdminSearchBar
        searchQuery={search}
        setSearchQuery={setSearch}
        searchPlaceholder="Search events by title, description, or sections..."
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        statusLabel="Status"
        statusPlaceholder="All Statuses"
        statusOptions={[
          { label: "Draft", value: "draft" },
          { label: "Upcoming", value: "upcoming" },
          { label: "Ongoing", value: "ongoing" },
          { label: "Completed", value: "completed" },
        ]}
        departmentFilter={modeFilter}
        setDepartmentFilter={setModeFilter}
        departmentLabel="Mode"
        departmentPlaceholder="All Modes"
        departmentOptions={[
          { label: "Individual", value: "solo" },
          { label: "Team", value: "team" },
        ]}
        sortFilter={sortFilter}
        setSortFilter={setSortFilter}
        sortOptions={[
          { label: "Newest First", value: "NEWEST" },
          { label: "Oldest First", value: "OLDEST" },
          { label: "By Start Date", value: "START_DATE" },
          { label: "Most Sections", value: "SECTIONS_DESC" },
          { label: "Alphabetical", value: "TITLE_ASC" },
        ]}
        totalCount={filtered.length}
        countLabel="Events"
        onRefresh={onRefresh}
      />

      {filtered.length === 0 ? (
        <div className="p-16 text-center border border-b border-slate-200 dark:border-slate-800 rounded-3xl bg-white/50 dark:bg-[#0F172A]/50">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
            No Events Found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5">
            {search || statusFilter !== "ALL" || modeFilter !== "ALL"
              ? "No events match your current search and filter criteria. Try resetting filters."
              : "Get started by creating your first event."}
          </p>
          {(search || statusFilter !== "ALL" || modeFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("ALL");
                setModeFilter("ALL");
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
        >
          {filtered.map((ev) => {
            const sectionsCount = ev.sections?.length || 0;
            const bracketsCount = (ev.sections || []).reduce(
              (acc, sec) => acc + (sec.brackets?.length || 0),
              0,
            );

            return (
              <motion.div
                key={ev._id}
                variants={itemVariants}
                className="group relative flex flex-col justify-between p-6 rounded-2xl md:rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#0F172A] hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  <div className="flex items-center justify-between gap-3 mb-3.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                        {ev.status || "draft"}
                      </span>

                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-600 dark:bg-slate-800/80 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60">
                        {ev.participationMode || "solo"}
                      </span>

                      {ev.root && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                          {ev.root}
                        </span>
                      )}

                      {ev.timeControl && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {ev.timeControl}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(ev)}
                          aria-label={`Edit ${ev.title}`}
                          title="Edit Event"
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteTargetId(ev._id)}
                        aria-label={`Delete ${ev.title}`}
                        title="Delete Event"
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <Link
                    href={`/admin/events/${ev._id}`}
                    className="block group/title mb-2"
                  >
                    <h3 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400 transition-colors line-clamp-1">
                      {ev.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {ev.description || "No description provided."}
                  </p>

                  <div className="bg-slate-50/70 dark:bg-[#020617]/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800/60 mb-5 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-medium font-mono text-[11px]">
                        {formatDate(ev.startDate)} – {formatDate(ev.endDate)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-[11px]">
                        Deadline:{" "}
                        <span className="font-mono font-medium">
                          {formatDate(ev.registrationDeadline)}
                        </span>
                      </span>
                    </div>

                    <div className="pt-2.5 border-t border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                        <Layers className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="font-semibold">
                          {sectionsCount}{" "}
                          {sectionsCount === 1 ? "Section" : "Sections"}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">
                        {bracketsCount}{" "}
                        {bracketsCount === 1 ? "Bracket" : "Brackets"}
                      </span>
                    </div>
                  </div>

                  {ev.sections && ev.sections.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {ev.sections.slice(0, 3).map((sec, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 capitalize"
                        >
                          {sec.name}
                        </span>
                      ))}
                      {ev.sections.length > 3 && (
                        <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400">
                          +{ev.sections.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/admin/events/${ev._id}?tab=registrations`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 font-semibold transition-colors"
                      title="View Registered Applicants"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Registrations</span>
                    </Link>

                    <Link
                      href={`/admin/tournaments/events/${ev._id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold transition-colors"
                    >
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      <span className="hidden sm:inline">Tournaments</span>
                    </Link>
                  </div>

                  <Link
                    href={`/admin/events/${ev._id}`}
                    className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline ml-auto"
                  >
                    <span>Manage</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      <AlertDialog
        open={Boolean(deleteTargetId)}
        onOpenChange={(open) => {
          if (!open) setDeleteTargetId(null);
        }}
      >
        <AlertDialogContent className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900 dark:text-slate-50">
              Delete Event?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
              Are you sure you want to delete this event? This action cannot be
              undone. Connected brackets, schedules, and tournament references
              may be affected.
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
    </div>
  );
}
