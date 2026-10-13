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
  Edit3,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTimePicker } from "@/components/ui/datetime-picker";

export default function EditEventPanel({ event, onClose, onSuccess }) {
  const fetchApi = useApi();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [bannerUrl, setBannerUrl] = useState(event?.bannerUrl || "");
  const [status, setStatus] = useState(event?.status || "upcoming");
  const [participationMode, setParticipationMode] = useState(
    event?.participationMode || "solo",
  );
  const [minTeamSize, setMinTeamSize] = useState(
    event?.teamConfig?.minSize || 4,
  );
  const [maxTeamSize, setMaxTeamSize] = useState(
    event?.teamConfig?.maxSize || 6,
  );

  const [startDate, setStartDate] = useState(
    event?.startDate ? new Date(event.startDate).toISOString() : "",
  );
  const [endDate, setEndDate] = useState(
    event?.endDate ? new Date(event.endDate).toISOString() : "",
  );
  const [registrationDeadline, setRegistrationDeadline] = useState(
    event?.registrationDeadline
      ? new Date(event.registrationDeadline).toISOString()
      : "",
  );

  const [sections, setSections] = useState(() => {
    if (Array.isArray(event?.sections) && event.sections.length > 0) {
      return event.sections.map((sec) => ({
        name: sec.name || "",
        description: sec.description || "",
        brackets: Array.isArray(sec.brackets)
          ? sec.brackets.map((b) => ({
              name: b.name || "",
              minRating: b.minRating ?? "",
              maxRating: b.maxRating ?? "",
              totalRounds: b.totalRounds ?? 5,
            }))
          : [],
      }));
    }
    return [
      {
        name: "open",
        description: "",
        brackets: [
          { name: "open", minRating: 0, maxRating: 3000, totalRounds: 5 },
        ],
      },
    ];
  });

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
            { name: "open", minRating: 0, maxRating: 3000, totalRounds: 5 },
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

      const res = await fetchApi(`/events/${event._id}`, {
        method: "PATCH",
        body: payload,
      });

      toast.success(res?.message || "Event updated successfully!");
      if (onSuccess) onSuccess(res?.event);
      if (onClose) onClose();
    } catch (err) {
      toast.error("Error updating event: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-sm p-6 md:p-8">
      <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800 mb-6">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
              Edit Event: {event?.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Update event dates, registration settings, and tournament sections
            </p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close Form"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="edit-panel-event-title"
              className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2"
            >
              Event Title *
            </label>
            <input
              id="edit-panel-event-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event Name"
              className="w-full h-11 px-4 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="edit-panel-event-description"
              className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2"
            >
              Description *
            </label>
            <textarea
              id="edit-panel-event-description"
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the event structure, rules, and eligibility..."
              className="w-full p-4 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors leading-relaxed"
            />
          </div>

          <div>
            <label
              htmlFor="edit-panel-event-banner"
              className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2"
            >
              Banner URL (Optional)
            </label>
            <input
              id="edit-panel-event-banner"
              type="url"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full h-11 px-4 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Status
              </label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full h-11 px-4 bg-slate-50 dark:bg-[#020617] border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-slate-100">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800">
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Participation Mode
              </label>
              <Select
                value={participationMode}
                onValueChange={setParticipationMode}
              >
                <SelectTrigger className="w-full h-11 px-4 bg-slate-50 dark:bg-[#020617] border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-slate-100">
                  <SelectValue placeholder="Select Mode" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800">
                  <SelectItem value="solo">Individual (Solo)</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {participationMode === "team" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50/70 dark:bg-[#020617]/50 border border-slate-200/80 dark:border-slate-800/80">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Min Team Size
                </label>
                <input
                  type="number"
                  min="1"
                  value={minTeamSize}
                  onChange={(e) => setMinTeamSize(e.target.value)}
                  className="w-full h-10 px-3.5 text-sm font-mono font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F172A] text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Max Team Size
                </label>
                <input
                  type="number"
                  min="1"
                  value={maxTeamSize}
                  onChange={(e) => setMaxTeamSize(e.target.value)}
                  className="w-full h-10 px-3.5 text-sm font-mono font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F172A] text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            <div className="space-y-2 flex flex-col">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-200 block">
                Application / Start Date *
              </label>
              <DateTimePicker
                date={startDate}
                setDate={(newDate) => setStartDate(newDate)}
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tournament opening date and time.
              </p>
            </div>

            <div className="space-y-2 flex flex-col">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-200 block">
                End Date *
              </label>
              <DateTimePicker
                date={endDate}
                setDate={(newDate) => setEndDate(newDate)}
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Final rounds conclusion time.
              </p>
            </div>

            <div className="space-y-2 flex flex-col">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-200 block">
                Registration Deadline *
              </label>
              <DateTimePicker
                date={registrationDeadline}
                setDate={(newDate) => setRegistrationDeadline(newDate)}
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Player registration cutoff.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-500" />
                <span>Sections & Brackets</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Configure event sections (e.g. Open, Women) and rating
                categories
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddSection}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-blue-500" />
              <span>Add Section</span>
            </button>
          </div>

          <div className="space-y-6">
            {sections.map((section, sIdx) => (
              <div
                key={sIdx}
                className="p-5 sm:p-7 rounded-2xl md:rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#020617]/50 space-y-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        Section Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={section.name}
                        onChange={(e) =>
                          handleSectionFieldChange(sIdx, "name", e.target.value)
                        }
                        placeholder="e.g. open, women, interclub"
                        className="w-full h-11 px-4 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
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
                        className="w-full h-11 px-4 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                  {sections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSection(sIdx)}
                      aria-label="Remove section"
                      title="Remove section"
                      className="p-2.5 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors mt-6"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-200/70 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Rating Brackets ({section.brackets.length})
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Rating boundaries and Swiss rounds for this section
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddBracket(sIdx)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-500/10 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Bracket</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {section.brackets.map((brk, bIdx) => (
                      <div
                        key={bIdx}
                        className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                              Bracket Name *
                            </label>
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
                              placeholder="e.g. beginner, intermediate, open"
                              className="w-full h-11 px-4 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          {section.brackets.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveBracket(sIdx, bIdx)}
                              aria-label="Remove bracket"
                              title="Remove bracket"
                              className="p-2.5 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors mt-6 shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                          <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                              Min Rating
                            </label>
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
                              placeholder="0"
                              className="w-full h-11 px-3.5 text-sm font-mono font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                              Max Rating
                            </label>
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
                              placeholder="3000"
                              className="w-full h-11 px-3.5 text-sm font-mono font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                              Rounds
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="15"
                              required
                              value={brk.totalRounds || 5}
                              onChange={(e) =>
                                handleBracketFieldChange(
                                  sIdx,
                                  bIdx,
                                  "totalRounds",
                                  e.target.value,
                                )
                              }
                              placeholder="5"
                              className="w-full h-11 px-3.5 text-sm font-mono font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                          <span>
                            Tier:{" "}
                            {brk.minRating !== "" && brk.minRating !== null
                              ? brk.minRating
                              : "0"}{" "}
                            –{" "}
                            {brk.maxRating !== "" && brk.maxRating !== null
                              ? brk.maxRating
                              : "3000"}{" "}
                            Rating
                          </span>
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {brk.totalRounds || 5} Rounds
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="h-11 px-5 text-sm font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="h-11 inline-flex items-center gap-2 px-6 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm shadow-blue-500/20 disabled:opacity-50 active:scale-[0.99]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes…</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
