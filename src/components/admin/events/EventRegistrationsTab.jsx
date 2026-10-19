"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useApi } from "@/lib/api";
import { toast } from "sonner";
import {
  Users,
  Search,
  RefreshCw,
  CheckCircle2,
  Copy,
  Check,
  Shield,
  Building2,
  Trophy,
  Loader2,
  Phone,
  Mail,
  User as UserIcon,
  Layers,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [sectionFilter, setSectionFilter] = useState("ALL");
  const [bracketFilter, setBracketFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [pageNumber] = useState(1);
  const [pageSize] = useState(50);
  const [copiedCode, setCopiedCode] = useState(null);

  const loadRegistrations = useCallback(async () => {
    if (!eventId) return;
    try {
      setRefreshing(true);
      const res = await fetchApi(
        `/admin/event-registrations/${eventId}?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      );

      if (res?.success) {
        setRegistrations(res.registrations || []);
        if (onRefreshEvent) onRefreshEvent();
      } else {
        toast.error(res?.message || "Failed to load registrations");
      }
    } catch (err) {
      toast.error("Failed to load event registrations: " + err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [eventId, pageSize, pageNumber, fetchApi, onRefreshEvent]);

  useEffect(() => {
    loadRegistrations();
  }, [loadRegistrations]);

  const availableSections = useMemo(() => {
    const map = new Map();

    if (event?.sections && Array.isArray(event.sections)) {
      event.sections.forEach((sec) => {
        const key = (sec.name || "").toLowerCase().trim();
        if (key) {
          map.set(key, sec.title || (key === "womens" ? "Women's" : key.charAt(0).toUpperCase() + key.slice(1)));
        }
      });
    }

    registrations.forEach((reg) => {
      const key = (reg.section || "").toLowerCase().trim();
      if (key && !map.has(key)) {
        map.set(key, key === "womens" ? "Women's" : key.charAt(0).toUpperCase() + key.slice(1));
      }
    });

    if (!map.has("open")) map.set("open", "Open Section");
    if (!map.has("womens") && !map.has("women")) map.set("womens", "Women's Section");
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
        .filter((reg) => (reg.section || "").toLowerCase().trim() === sectionFilter)
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
        const phone = (reg.registeredBy?.phoneNumber || "").toLowerCase();
        const teamName = (reg.team?.teamName || "").toLowerCase();
        const joinCode = (reg.team?.joinCode || "").toLowerCase();

        const matches =
          userName.includes(q) ||
          email.includes(q) ||
          phone.includes(q) ||
          teamName.includes(q) ||
          joinCode.includes(q) ||
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Total Applicants
            </span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-slate-50">
              {registrations.length}
            </span>
            <span className="text-xs text-slate-500">registered</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Open Section
            </span>
            <Trophy className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-blue-600 dark:text-blue-400">
              {sectionCounts["open"] || 0}
            </span>
            <span className="text-xs text-slate-500">contenders</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Women's Section
            </span>
            <Shield className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-purple-600 dark:text-purple-400">
              {sectionCounts["womens"] || sectionCounts["women"] || 0}
            </span>
            <span className="text-xs text-slate-500">contenders</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Inter-Club
            </span>
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-amber-600 dark:text-amber-400">
              {sectionCounts["interclub"] || 0}
            </span>
            <span className="text-xs text-slate-500">visiting/reps</span>
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
            <Layers className="w-3.5 h-3.5" />
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
                    isSelected ? "bg-white/25 text-white" : "bg-black/5 dark:bg-white/10"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={loadRegistrations}
            disabled={refreshing}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Refresh registrations list"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-blue-500" : ""}`}
            />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search by Name, Email, Phone, Team Name, Join Code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {availableBrackets.length > 0 && (
          <div className="w-full md:w-44 shrink-0">
            <Select value={bracketFilter} onValueChange={setBracketFilter}>
              <SelectTrigger className="w-full h-10 bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-xs rounded-xl">
                <SelectValue placeholder="All Brackets" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-xs">
                <SelectItem value="ALL">All Brackets</SelectItem>
                {availableBrackets.map((brk) => (
                  <SelectItem key={brk} value={brk} className="capitalize">
                    {brk} Bracket
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="w-full md:w-36 shrink-0">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full h-10 bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-xs rounded-xl">
              <SelectValue placeholder="All Modes" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-xs">
              <SelectItem value="ALL">All Modes</SelectItem>
              <SelectItem value="solo">Solo Only</SelectItem>
              <SelectItem value="team">Team Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-36 shrink-0">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full h-10 bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-xs rounded-xl">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-xs">
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-4">Contender</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Section & Bracket</th>
                  <th className="py-3 px-4">Mode / Team</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredRegistrations.map((reg) => {
                  const applicant = reg.registeredBy || reg.team?.leaderId || {};
                  const isTeam = reg.registrationType === "team";
                  const teamInfo = reg.team;

                  return (
                    <tr
                      key={reg._id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 text-slate-500 font-bold font-mono text-xs">
                            {applicant.userName
                              ? applicant.userName.charAt(0).toUpperCase()
                              : "U"}
                          </div>
                          <div className="min-w-0">
                            <span className="block font-semibold text-slate-900 dark:text-slate-100 truncate">
                              {applicant.userName || "Unnamed Contender"}
                            </span>
                            <span className="block text-[10px] text-slate-400 font-mono">
                              ID: {reg._id ? reg._id.slice(-6) : "N/A"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        <div className="space-y-0.5">
                          {applicant.email ? (
                            <div className="flex items-center gap-1.5 text-[11px] truncate max-w-[200px]">
                              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{applicant.email}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[10px]">—</span>
                          )}

                          {applicant.phoneNumber && (
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                              <Phone className="w-2.5 h-2.5 shrink-0" />
                              <span>{applicant.phoneNumber}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-col items-start gap-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getSectionBadgeStyle(
                              reg.section,
                            )}`}
                          >
                            {reg.section || "open"}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 capitalize">
                            Bracket: <strong className="text-slate-700 dark:text-slate-300">{reg.bracket || "open"}</strong>
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {isTeam ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                Team
                              </span>
                              <span className="font-semibold text-slate-800 dark:text-slate-200">
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
                                  onClick={() => handleCopyCode(teamInfo.joinCode)}
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-300 hover:text-blue-500 cursor-pointer"
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
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                            <UserIcon className="w-2.5 h-2.5" />
                            Solo
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          {reg.status || "CONFIRMED"}
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50/60 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing {filteredRegistrations.length} of {registrations.length} applicant{registrations.length === 1 ? "" : "s"}
            </span>
            <span className="font-mono text-[11px]">
              Page {pageNumber}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
