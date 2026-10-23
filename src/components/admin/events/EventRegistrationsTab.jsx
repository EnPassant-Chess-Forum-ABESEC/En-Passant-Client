"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useApi } from "@/lib/api";
import { toast } from "sonner";
import {
  Users,
  Copy,
  Check,
  Loader2,
  Trash2,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
} from "lucide-react";
import AdminSearchBar from "../AdminSearchBar";
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

function timeAgo(dateString) {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 30) return `${days}d ago`;
    return date.toLocaleDateString();
  } catch {
    return dateString;
  }
}

export default function EventRegistrationsTab({
  eventId,
  event = null,
  onRefreshEvent,
}) {
  const fetchApi = useApi();
  const fetchApiRef = useRef(fetchApi);
  useEffect(() => {
    fetchApiRef.current = fetchApi;
  }, [fetchApi]);

  const onRefreshEventRef = useRef(onRefreshEvent);
  useEffect(() => {
    onRefreshEventRef.current = onRefreshEvent;
  }, [onRefreshEvent]);

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [sectionFilter, setSectionFilter] = useState("ALL");
  const [bracketFilter, setBracketFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [copiedCode, setCopiedCode] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const loadRegistrations = useCallback(async () => {
    if (!eventId) return;
    try {
      setRefreshing(true);
      const res = await fetchApiRef.current(
        `/admin/event-registrations/${eventId}?pageSize=1000&pageNumber=1`,
      );

      if (res?.success) {
        setRegistrations(res.registrations || []);
      } else {
        toast.error(res?.message || "Failed to load registrations");
      }
    } catch (err) {
      toast.error("Failed to load event registrations: " + err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [eventId]);

  useEffect(() => {
    let ignore = false;
    async function init() {
      if (!eventId) return;
      try {
        setRefreshing(true);
        const res = await fetchApiRef.current(
          `/admin/event-registrations/${eventId}?pageSize=1000&pageNumber=1`,
        );
        if (!ignore) {
          if (res?.success) {
            setRegistrations(res.registrations || []);
          } else {
            toast.error(res?.message || "Failed to load registrations");
          }
        }
      } catch (err) {
        if (!ignore) {
          toast.error("Failed to load event registrations: " + err.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, [eventId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    sectionFilter,
    bracketFilter,
    typeFilter,
    statusFilter,
    itemsPerPage,
  ]);

  const handleManualRefresh = async () => {
    await loadRegistrations();
    if (onRefreshEventRef.current) {
      onRefreshEventRef.current();
    }
  };

  const handleExportSheet = async () => {
    if (!eventId) return;
    try {
      setIsExporting(true);
      const res = await fetchApiRef.current(
        `/admin/event-registrations/${eventId}/export`,
      );
      if (res?.success) {
        toast.success(
          res.message || "Event registrations exported successfully",
        );
        if (res.sheetUrl) {
          window.open(res.sheetUrl, "_blank");
        }
      } else {
        toast.error(res?.message || "Failed to export event registrations");
      }
    } catch (err) {
      toast.error("Failed to export: " + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteRegistration = async () => {
    if (!deleteTarget?._id) return;
    try {
      setIsDeleting(true);
      const res = await fetchApiRef.current(
        `/admin/event-registrations/${deleteTarget._id}`,
        { method: "DELETE" },
      );
      if (res?.success) {
        toast.success(res.message || "Registration deleted successfully");
        setDeleteTarget(null);
        await loadRegistrations();
        if (onRefreshEventRef.current) {
          onRefreshEventRef.current();
        }
      } else {
        toast.error(res?.message || "Failed to delete registration");
      }
    } catch (err) {
      toast.error("Failed to delete registration: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const availableSections = useMemo(() => {
    const map = new Map();

    if (event?.sections && Array.isArray(event.sections)) {
      event.sections.forEach((sec) => {
        const key = (sec.name || "").toLowerCase().trim();
        if (key) {
          map.set(
            key,
            sec.title ||
              (key === "womens"
                ? "Women's"
                : key.charAt(0).toUpperCase() + key.slice(1)),
          );
        }
      });
    }

    registrations.forEach((reg) => {
      const key = (reg.section || "").toLowerCase().trim();
      if (key && !map.has(key)) {
        map.set(
          key,
          key === "womens"
            ? "Women's"
            : key.charAt(0).toUpperCase() + key.slice(1),
        );
      }
    });

    if (!map.has("open")) map.set("open", "Open Section");
    if (!map.has("womens") && !map.has("women"))
      map.set("womens", "Women's Section");
    if (!map.has("interclub")) map.set("interclub", "Inter-Club");

    return Array.from(map.entries()).map(([value, label]) => ({
      value,
      label,
    }));
  }, [event, registrations]);

  const availableBrackets = useMemo(() => {
    const set = new Set();

    if (sectionFilter === "ALL") {
      registrations.forEach((reg) => {
        if (reg.bracket) set.add(reg.bracket.toLowerCase().trim());
      });
    } else {
      registrations
        .filter(
          (reg) => (reg.section || "").toLowerCase().trim() === sectionFilter,
        )
        .forEach((reg) => {
          if (reg.bracket) set.add(reg.bracket.toLowerCase().trim());
        });

      const currentSec = event?.sections?.find(
        (s) => (s.name || "").toLowerCase().trim() === sectionFilter,
      );
      if (currentSec?.brackets) {
        currentSec.brackets.forEach((b) => {
          if (b.name) set.add(b.name.toLowerCase().trim());
        });
      }
    }

    return Array.from(set);
  }, [registrations, sectionFilter, event]);

  const sectionCounts = useMemo(() => {
    const counts = { ALL: registrations.length };
    availableSections.forEach((sec) => {
      counts[sec.value] = registrations.filter(
        (r) => (r.section || "").toLowerCase().trim() === sec.value,
      ).length;
    });
    return counts;
  }, [registrations, availableSections]);

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const regSection = (reg.section || "open").toLowerCase().trim();
      const regBracket = (reg.bracket || "open").toLowerCase().trim();
      const regType = (reg.registrationType || "solo").toLowerCase().trim();
      const regStatus = (reg.status || "pending").toLowerCase().trim();

      if (sectionFilter !== "ALL" && regSection !== sectionFilter) {
        return false;
      }

      if (bracketFilter !== "ALL" && regBracket !== bracketFilter) {
        return false;
      }

      if (typeFilter !== "ALL" && regType !== typeFilter) {
        return false;
      }

      if (statusFilter !== "ALL" && regStatus !== statusFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const userName = (reg.registeredBy?.userName || "").toLowerCase();
        const email = (reg.registeredBy?.email || "").toLowerCase();
        const collegeEmail = (
          reg.registeredBy?.collegeEmail || ""
        ).toLowerCase();
        const phone = (reg.registeredBy?.phoneNumber || "").toLowerCase();
        const chessHandle = (
          reg.chessUsername ||
          reg.registeredBy?.chessAccounts?.chessCom?.username ||
          ""
        ).toLowerCase();
        const teamName = (
          reg.teamName ||
          reg.team?.teamName ||
          ""
        ).toLowerCase();
        const clubName = (reg.clubName || "").toLowerCase();
        const joinCode = (reg.team?.joinCode || "").toLowerCase();
        const utr = (reg.utr || "").toLowerCase();

        const matches =
          userName.includes(q) ||
          email.includes(q) ||
          collegeEmail.includes(q) ||
          phone.includes(q) ||
          chessHandle.includes(q) ||
          teamName.includes(q) ||
          clubName.includes(q) ||
          joinCode.includes(q) ||
          utr.includes(q) ||
          regSection.includes(q) ||
          regBracket.includes(q);

        if (!matches) return false;
      }

      return true;
    });
  }, [
    registrations,
    sectionFilter,
    bracketFilter,
    typeFilter,
    statusFilter,
    searchQuery,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRegistrations.length / itemsPerPage),
  );

  const paginatedRegistrations = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRegistrations.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRegistrations, currentPage, itemsPerPage]);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("Join code copied to clipboard!");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getSectionBadgeStyle = (secName) => {
    const s = (secName || "").toLowerCase();
    if (s === "open") {
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
    }
    if (s === "womens" || s === "women") {
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
    }
    if (s === "interclub" || s === "inter-club") {
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    }
    return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
  };

  const getStatusTextStyle = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "confirmed" || s === "success") {
      return "text-emerald-600 dark:text-emerald-400";
    }
    if (s === "pending") {
      return "text-amber-600 dark:text-amber-400";
    }
    if (s === "cancelled" || s === "rejected" || s === "failed") {
      return "text-red-600 dark:text-red-400";
    }
    return "text-slate-600 dark:text-slate-400";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Total Registrations
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-slate-50">
              {registrations.length}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              registered
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Open Section
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-slate-50">
              {sectionCounts["open"] || 0}
            </span>
            <span className="text-xs text-slate-400 font-medium">players</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Women&apos;s Section
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-slate-50">
              {sectionCounts["womens"] || sectionCounts["women"] || 0}
            </span>
            <span className="text-xs text-slate-400 font-medium">players</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Inter-Club
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-slate-50">
              {sectionCounts["interclub"] || 0}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              participants
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pb-1 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSectionFilter("ALL");
              setBracketFilter("ALL");
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              sectionFilter === "ALL"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <span>All Sections</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-black/10 dark:bg-white/20">
              {registrations.length}
            </span>
          </button>

          {availableSections.map((sec) => {
            const count = sectionCounts[sec.value] || 0;
            const isSelected = sectionFilter === sec.value;
            return (
              <button
                key={sec.value}
                type="button"
                onClick={() => {
                  setSectionFilter(sec.value);
                  setBracketFilter("ALL");
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-xs shadow-blue-500/20"
                    : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <span>{sec.label}</span>
                <span
                  className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isSelected
                      ? "bg-white/25 text-white"
                      : "bg-black/5 dark:bg-white/10"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleExportSheet}
          disabled={isExporting}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isExporting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <FileSpreadsheet className="w-3.5 h-3.5" />
          )}
          <span>Export to Sheet</span>
        </button>
      </div>

      <AdminSearchBar
        onRefresh={handleManualRefresh}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Search by name, email, handle, UTR, team, or code..."
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        statusLabel="Status"
        statusPlaceholder="All Status"
        statusOptions={[
          { label: "Pending", value: "pending" },
          { label: "Confirmed", value: "confirmed" },
          { label: "Cancelled", value: "cancelled" },
        ]}
        departmentFilter={bracketFilter}
        setDepartmentFilter={setBracketFilter}
        departmentLabel="Bracket"
        departmentPlaceholder="All Brackets"
        departmentOptions={availableBrackets.map((brk) => ({
          label: `${brk.charAt(0).toUpperCase() + brk.slice(1)} Bracket`,
          value: brk,
        }))}
        sortFilter={typeFilter}
        setSortFilter={setTypeFilter}
        sortLabel="Mode"
        sortPlaceholder="All Modes"
        sortOptions={[
          { label: "Solo", value: "solo" },
          { label: "Team", value: "team" },
        ]}
        totalCount={filteredRegistrations.length}
        countLabel="Registrations"
      />

      {loading ? (
        <div className="py-24 text-center border border-slate-200 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-[#0F172A]/50">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-3" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Loading Registered Applicants…
          </p>
        </div>
      ) : filteredRegistrations.length === 0 ? (
        <div className="py-20 text-center border border-slate-200 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-[#0F172A]/50 space-y-3">
          <Users className="w-8 h-8 text-slate-400 mx-auto" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No Registrations Found
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || sectionFilter !== "ALL" || bracketFilter !== "ALL"
              ? "No applicant matches your current filters. Try resetting the filters."
              : "No applicants have registered for this event yet."}
          </p>
          {(searchQuery ||
            sectionFilter !== "ALL" ||
            bracketFilter !== "ALL" ||
            typeFilter !== "ALL" ||
            statusFilter !== "ALL") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSectionFilter("ALL");
                setBracketFilter("ALL");
                setTypeFilter("ALL");
                setStatusFilter("ALL");
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] overflow-hidden shadow-xs">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-4">Participant</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Section & Bracket</th>
                  <th className="py-3 px-4">Mode / Team</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Registered</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {paginatedRegistrations.map((reg) => {
                  const applicant =
                    reg.registeredBy || reg.team?.leaderId || {};
                  const isTeam = reg.registrationType === "team";
                  const teamInfo = reg.team;

                  return (
                    <tr
                      key={reg._id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                              {applicant.userName || "Unnamed Participant"}
                            </span>
                            {reg.gender && (
                              <span
                                className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase tracking-wider border ${
                                  reg.gender === "female"
                                    ? "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20"
                                    : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                                }`}
                              >
                                {reg.gender}
                              </span>
                            )}
                          </div>
                          {reg.chessUsername ||
                          applicant.chessAccounts?.chessCom?.username ? (
                            <span className="block text-[11px] text-blue-600 dark:text-blue-400 font-mono font-medium">
                              @
                              {reg.chessUsername ||
                                applicant.chessAccounts?.chessCom?.username}
                            </span>
                          ) : applicant.collegeEmail ? (
                            <span className="block text-[10px] text-slate-400 font-mono truncate">
                              {applicant.collegeEmail}
                            </span>
                          ) : null}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        <div className="space-y-0.5">
                          {applicant.email ? (
                            <div className="text-[11px] truncate max-w-[220px] text-slate-700 dark:text-slate-200 font-medium">
                              {applicant.email}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[10px]">
                              —
                            </span>
                          )}

                          {applicant.phoneNumber && (
                            <div className="text-[10px] text-slate-400 font-mono">
                              {applicant.phoneNumber}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-col items-start gap-1">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getSectionBadgeStyle(
                              reg.section,
                            )}`}
                          >
                            {reg.section || "open"}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 capitalize">
                            Bracket:{" "}
                            <strong className="text-slate-700 dark:text-slate-300">
                              {reg.bracket || "open"}
                            </strong>
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {isTeam ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                                Team
                              </span>
                              <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                                {teamInfo?.teamName || "Unnamed Team"}
                              </span>
                            </div>
                            {teamInfo?.joinCode && (
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] font-mono text-slate-400">
                                  Code:
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleCopyCode(teamInfo.joinCode)
                                  }
                                  className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-600 dark:text-slate-300 hover:text-blue-500 cursor-pointer"
                                  title="Copy Join Code"
                                >
                                  <span>{teamInfo.joinCode}</span>
                                  {copiedCode === teamInfo.joinCode ? (
                                    <Check className="w-2.5 h-2.5 text-emerald-500" />
                                  ) : (
                                    <Copy className="w-2.5 h-2.5" />
                                  )}
                                </button>
                                {teamInfo.members && (
                                  <span className="text-[10px] text-slate-400 ml-1">
                                    ({teamInfo.members.length + 1} players)
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col items-start gap-0.5">
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              Solo
                            </span>
                            {(reg.clubName ||
                              reg.teamName ||
                              reg.team?.teamName) && (
                              <span
                                className="text-[11px] text-amber-600 dark:text-amber-400 font-medium truncate max-w-[200px]"
                                title={
                                  reg.clubName ||
                                  reg.teamName ||
                                  reg.team?.teamName
                                }
                              >
                                {reg.clubName ||
                                  reg.teamName ||
                                  reg.team?.teamName}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-xs font-semibold font-mono capitalize ${getStatusTextStyle(
                            reg.status,
                          )}`}
                        >
                          {reg.status || "pending"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <span className="text-slate-500 dark:text-slate-400 block text-xs">
                          {timeAgo(reg.createdAt)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          {reg.createdAt
                            ? new Date(reg.createdAt).toLocaleDateString()
                            : ""}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(reg)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer inline-flex items-center justify-center"
                          title="Delete Registration"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="md:hidden flex flex-col divide-y divide-slate-100 dark:divide-slate-800/60">
            {paginatedRegistrations.map((reg) => {
              const applicant = reg.registeredBy || reg.team?.leaderId || {};
              const isTeam = reg.registrationType === "team";
              const teamInfo = reg.team;
              const chessHandle =
                reg.chessUsername ||
                applicant.chessAccounts?.chessCom?.username;

              return (
                <div
                  key={reg._id}
                  className="p-4 space-y-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/15 to-indigo-500/15 border border-blue-500/20 flex items-center justify-center shrink-0">
                        <span className="text-xs font-black text-blue-600 dark:text-blue-400">
                          {(applicant.userName || "?").charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">
                            {applicant.userName || "Unnamed Participant"}
                          </span>
                          {reg.gender && (
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase tracking-wider border ${
                                reg.gender === "female"
                                  ? "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20"
                                  : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                              }`}
                            >
                              {reg.gender}
                            </span>
                          )}
                        </div>
                        {chessHandle && (
                          <span className="text-xs text-blue-600 dark:text-blue-400 font-mono font-medium block mt-0.5">
                            @{chessHandle}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono border ${
                          (reg.status || "").toLowerCase() === "confirmed" ||
                          (reg.status || "").toLowerCase() === "success"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : (reg.status || "").toLowerCase() === "pending"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                              : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                        }`}
                      >
                        {reg.status || "pending"}
                      </span>

                      <button
                        type="button"
                        onClick={() => setDeleteTarget(reg)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        title="Delete Registration"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 text-xs text-slate-600 dark:text-slate-300 bg-slate-50/80 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                    {applicant.email && (
                      <div className="flex items-center gap-2 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate font-medium">
                          {applicant.email}
                        </span>
                      </div>
                    )}
                    {applicant.collegeEmail &&
                      applicant.collegeEmail !== applicant.email && (
                        <div className="flex items-center gap-2 truncate text-slate-400 text-[11px] font-mono">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">
                            {applicant.collegeEmail}
                          </span>
                        </div>
                      )}
                    {applicant.phoneNumber && (
                      <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{applicant.phoneNumber}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getSectionBadgeStyle(
                          reg.section,
                        )}`}
                      >
                        {reg.section || "open"}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 capitalize">
                        {reg.bracket || "open"}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 capitalize">
                        {isTeam ? "Team" : "Solo"}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400 font-mono">
                      {timeAgo(reg.createdAt)}
                    </span>
                  </div>

                  {isTeam && teamInfo && (
                    <div className="flex items-center justify-between gap-2 p-2 bg-blue-50/60 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/40 text-xs">
                      <div className="min-w-0 flex items-center gap-1.5">
                        <span className="font-semibold text-blue-700 dark:text-blue-300 truncate">
                          {teamInfo.teamName || "Team"}
                        </span>
                        {teamInfo.members && (
                          <span className="text-[10px] text-slate-400">
                            ({teamInfo.members.length + 1} players)
                          </span>
                        )}
                      </div>
                      {teamInfo.joinCode && (
                        <button
                          type="button"
                          onClick={() => handleCopyCode(teamInfo.joinCode)}
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-500 shadow-xs cursor-pointer"
                          title="Copy Join Code"
                        >
                          <span>{teamInfo.joinCode}</span>
                          {copiedCode === teamInfo.joinCode ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3 text-slate-400" />
                          )}
                        </button>
                      )}
                    </div>
                  )}

                  {!isTeam && (reg.clubName || reg.teamName) && (
                    <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium px-2 py-1 bg-amber-500/10 rounded-lg w-fit">
                      Club: {reg.clubName || reg.teamName}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-slate-50/60 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-3 flex-wrap">
              <span>
                Showing{" "}
                <strong className="text-slate-900 dark:text-slate-100 font-mono">
                  {filteredRegistrations.length === 0
                    ? 0
                    : (currentPage - 1) * itemsPerPage + 1}
                </strong>
                -
                <strong className="text-slate-900 dark:text-slate-100 font-mono">
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredRegistrations.length,
                  )}
                </strong>{" "}
                of{" "}
                <strong className="text-slate-900 dark:text-slate-100 font-mono">
                  {filteredRegistrations.length}
                </strong>{" "}
                registrations
                {filteredRegistrations.length !== registrations.length && (
                  <span className="text-slate-400 ml-1">
                    ({registrations.length} total)
                  </span>
                )}
              </span>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400">Per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 bg-white dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono text-slate-700 dark:text-slate-300 focus:outline-hidden focus:border-blue-500 cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs uppercase tracking-wider text-slate-400">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#020617] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                    title="Previous Page"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#020617] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                    title="Next Page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900 dark:text-slate-50">
              Delete Registration?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 dark:text-slate-400">
              Are you sure you want to delete the registration for{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {deleteTarget?.registeredBy?.userName ||
                  deleteTarget?.team?.leaderId?.userName ||
                  "this participant"}
              </span>
              ? This action cannot be undone and will permanently delete this
              registration, associated payment records, and team memberships.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              className="border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRegistration}
              disabled={isDeleting}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete Registration"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
