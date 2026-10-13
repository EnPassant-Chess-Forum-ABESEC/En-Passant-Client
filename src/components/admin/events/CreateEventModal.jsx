"use client";

import { useState } from "react";
import { useApi } from "@/lib/api";
import { toast } from "sonner";
import {
  Calendar,
  Layers,
  Plus,
  Trash2,
  X,
  Loader2,
  Users,
  Clock,
  ShieldCheck,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateEventModal({ isOpen, onClose, onSuccess }) {
  const fetchApi = useApi();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [status, setStatus] = useState("upcoming");
  const [participationMode, setParticipationMode] = useState("solo");
  const [minTeamSize, setMinTeamSize] = useState(4);
  const [maxTeamSize, setMaxTeamSize] = useState(6);

  const now = new Date();
  const defaultStart = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);
  const defaultEnd = new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);
  const defaultDeadline = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [registrationDeadline, setRegistrationDeadline] =
    useState(defaultDeadline);

  const [sections, setSections] = useState([
    {
      name: "open",
      description: "Open Section with rating-tiered brackets",
      brackets: [
        { name: "beginner", minRating: 0, maxRating: 1000, totalRounds: 5 },
        { name: "open", minRating: 1001, maxRating: 3000, totalRounds: 5 },
      ],
    },
  ]);

  if (!isOpen) return null;

  const handleAddSection = () => {
    setSections((prev) => [
      ...prev,
      {
        name: `section-${prev.length + 1}`,
        description: "",
        brackets: [
          { name: "open", minRating: 0, maxRating: 3000, totalRounds: 5 },
        ],
      },
    ]);
  };

  const handleRemoveSection = (sectionIndex) => {
    setSections((prev) => prev.filter((_, idx) => idx !== sectionIndex));
  };

  const handleSectionFieldChange = (sectionIndex, field, value) => {
    setSections((prev) =>
      prev.map((sec, idx) =>
        idx === sectionIndex ? { ...sec, [field]: value } : sec,
      ),
    );
  };

  const handleAddBracket = (sectionIndex) => {
    setSections((prev) =>
      prev.map((sec, idx) => {
        if (idx !== sectionIndex) return sec;
        return {
          ...sec,
          brackets: [
            ...sec.brackets,
            { name: "bracket", minRating: 0, maxRating: 3000, totalRounds: 5 },
          ],
        };
      }),
    );
  };

  const handleRemoveBracket = (sectionIndex, bracketIndex) => {
    setSections((prev) =>
      prev.map((sec, idx) => {
        if (idx !== sectionIndex) return sec;
        return {
          ...sec,
          brackets: sec.brackets.filter((_, bIdx) => bIdx !== bracketIndex),
        };
      }),
    );
  };

  const handleBracketFieldChange = (
    sectionIndex,
    bracketIndex,
    field,
    value,
  ) => {
    setSections((prev) =>
      prev.map((sec, idx) => {
        if (idx !== sectionIndex) return sec;
        const updatedBrackets = sec.brackets.map((brk, bIdx) => {
          if (bIdx !== bracketIndex) return brk;
          return { ...brk, [field]: value };
        });
        return { ...sec, brackets: updatedBrackets };
      }),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter an event title");
      return;
    }
    if (!description.trim()) {
      toast.error("Please enter an event description");
      return;
    }
    if (!startDate || !endDate || !registrationDeadline) {
      toast.error("Please enter valid start, end, and registration dates");
      return;
    }

    setLoading(true);
    try {
      const formattedSections = sections.map((sec) => ({
        name: sec.name.trim().toLowerCase(),
        description: sec.description ? sec.description.trim() : undefined,
        brackets: sec.brackets.map((brk) => ({
          name: brk.name.trim().toLowerCase(),
          minRating:
            brk.minRating !== "" && brk.minRating !== null
              ? Number(brk.minRating)
              : null,
          maxRating:
            brk.maxRating !== "" && brk.maxRating !== null
              ? Number(brk.maxRating)
              : null,
          totalRounds: brk.totalRounds ? Number(brk.totalRounds) : 5,
        })),
      }));

      const payload = {
        title: title.trim(),
        description: description.trim(),
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        registrationDeadline: new Date(registrationDeadline).toISOString(),
        participationMode,
        status,
        sections: formattedSections,
      };

      if (bannerUrl.trim()) {
        payload.bannerUrl = bannerUrl.trim();
      }

      if (participationMode === "team") {
        payload.teamConfig = {
          minSize: Number(minTeamSize),
          maxSize: Number(maxTeamSize),
        };
      }

      const res = await fetchApi("/events", {
        method: "POST",
        body: payload,
      });

      toast.success(res?.message || "Event created successfully!");
      if (onSuccess) onSuccess(res?.event);
      onClose();
    } catch (err) {
      toast.error("Error creating event: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-event-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl my-8 bg-white dark:bg-[#0F172A] rounded-2xl md:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="create-event-title"
                className="text-lg font-bold text-slate-900 dark:text-slate-50"
              >
                Create New Event
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Set event dates, registration settings, and tournament sections
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto flex-1 space-y-6"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="event-title"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Event Title *
              </label>
              <input
                id="event-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event Name"
                className="w-full bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="event-description"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Description *
              </label>
              <textarea
                id="event-description"
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the event, eligibility, structure, and prizes..."
                className="w-full bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="event-banner"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Banner URL (Optional)
              </label>
              <input
                id="event-banner"
                type="url"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Participation Mode
                </label>
                <Select
                  value={participationMode}
                  onValueChange={setParticipationMode}
                >
                  <SelectTrigger className="w-full bg-slate-50 dark:bg-[#020617] border-slate-200 dark:border-slate-800 h-11 text-sm rounded-xl">
                    <SelectValue placeholder="Select Mode" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800">
                    <SelectItem value="solo">Solo (Individual)</SelectItem>
                    <SelectItem value="team">Team (Squads)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Initial Status
                </label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full bg-slate-50 dark:bg-[#020617] border-slate-200 dark:border-slate-800 h-11 text-sm rounded-xl">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800">
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {participationMode === "team" && (
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800">
                <div>
                  <label
                    htmlFor="min-team-size"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1"
                  >
                    Min Team Size
                  </label>
                  <input
                    id="min-team-size"
                    type="number"
                    min="1"
                    value={minTeamSize}
                    onChange={(e) => setMinTeamSize(e.target.value)}
                    className="w-full bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label
                    htmlFor="max-team-size"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1"
                  >
                    Max Team Size
                  </label>
                  <input
                    id="max-team-size"
                    type="number"
                    min="1"
                    value={maxTeamSize}
                    onChange={(e) => setMaxTeamSize(e.target.value)}
                    className="w-full bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="start-date"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
                >
                  Start Date *
                </label>
                <input
                  id="start-date"
                  type="datetime-local"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="end-date"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
                >
                  End Date *
                </label>
                <input
                  id="end-date"
                  type="datetime-local"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="deadline-date"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
                >
                  Reg Deadline *
                </label>
                <input
                  id="deadline-date"
                  type="datetime-local"
                  required
                  value={registrationDeadline}
                  onChange={(e) => setRegistrationDeadline(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-500" />
                  <span>Sections & Brackets</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Configure event sections and rating brackets
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddSection}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Section</span>
              </button>
            </div>

            <div className="space-y-4">
              {sections.map((section, sIdx) => (
                <div
                  key={sIdx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#020617]/50 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                          Section Name
                        </label>
                        <input
                          type="text"
                          required
                          value={section.name}
                          onChange={(e) =>
                            handleSectionFieldChange(
                              sIdx,
                              "name",
                              e.target.value,
                            )
                          }
                          placeholder="e.g. open, women, interclub"
                          className="w-full bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={section.description || ""}
                          onChange={(e) =>
                            handleSectionFieldChange(
                              sIdx,
                              "description",
                              e.target.value,
                            )
                          }
                          placeholder="Optional section description"
                          className="w-full bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100"
                        />
                      </div>
                    </div>
                    {sections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(sIdx)}
                        aria-label="Remove section"
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors mt-5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="pl-3 border-l-2 border-slate-200 dark:border-slate-700 space-y-2 mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-600 dark:text-slate-400">
                        Brackets ({section.brackets.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddBracket(sIdx)}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Bracket</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {section.brackets.map((brk, bIdx) => (
                        <div
                          key={bIdx}
                          className="grid grid-cols-12 gap-2 items-center bg-white dark:bg-[#0F172A] p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs"
                        >
                          <div className="col-span-4">
                            <input
                              type="text"
                              required
                              value={brk.name}
                              onChange={(e) =>
                                handleBracketFieldChange(
                                  sIdx,
                                  bIdx,
                                  "name",
                                  e.target.value,
                                )
                              }
                              placeholder="Bracket name"
                              className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 pb-1 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <div className="col-span-2">
                            <input
                              type="number"
                              value={
                                brk.minRating !== null ? brk.minRating : ""
                              }
                              onChange={(e) =>
                                handleBracketFieldChange(
                                  sIdx,
                                  bIdx,
                                  "minRating",
                                  e.target.value === "" ? "" : e.target.value,
                                )
                              }
                              placeholder="Min Rtg"
                              className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 pb-1 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                            />
                          </div>
                          <div className="col-span-2">
                            <input
                              type="number"
                              value={
                                brk.maxRating !== null ? brk.maxRating : ""
                              }
                              onChange={(e) =>
                                handleBracketFieldChange(
                                  sIdx,
                                  bIdx,
                                  "maxRating",
                                  e.target.value === "" ? "" : e.target.value,
                                )
                              }
                              placeholder="Max Rtg"
                              className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 pb-1 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                            />
                          </div>
                          <div className="col-span-3">
                            <input
                              type="number"
                              min="1"
                              value={brk.totalRounds || 5}
                              onChange={(e) =>
                                handleBracketFieldChange(
                                  sIdx,
                                  bIdx,
                                  "totalRounds",
                                  e.target.value,
                                )
                              }
                              placeholder="Rounds"
                              className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 pb-1 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                            />
                          </div>
                          <div className="col-span-1 flex justify-end">
                            {section.brackets.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveBracket(sIdx, bIdx)}
                                aria-label="Remove bracket"
                                className="text-slate-400 hover:text-rose-500 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm shadow-blue-500/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Creating…</span>
                </>
              ) : (
                <span>Create Event</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
