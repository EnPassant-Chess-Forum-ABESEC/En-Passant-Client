"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/lib/api";
import { Save, Calendar as CalendarIcon, Clock, Lock } from "lucide-react";
import { toast } from "sonner";
import { DateTimePicker } from "@/components/ui/datetime-picker";

export default function AdminSettingsPage() {
  const fetchApi = useApi();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    applicationStartDate: "",
    applicationEndDate: "",
    taskRevealDate: "",
    submissionEndDate: "",
  });

  useEffect(() => {
    loadSettings();
  }, [fetchApi]);

  const loadSettings = async () => {
    try {
      const res = await fetchApi("/settings/recruitment-phases");
      if (res.data) {
        // Convert to local datetime-local string format (YYYY-MM-DDThh:mm)
        const formatForInput = (isoString) => {
          if (!isoString) return "";
          const d = new Date(isoString);
          // Need to handle timezone offset so the input shows the correct local time
          const tzOffset = d.getTimezoneOffset() * 60000;
          return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
        };

        setSettings({
          applicationStartDate: formatForInput(res.data.applicationStartDate),
          applicationEndDate: formatForInput(res.data.applicationEndDate),
          taskRevealDate: formatForInput(res.data.taskRevealDate),
          submissionEndDate: formatForInput(res.data.submissionEndDate),
        });
      }
    } catch (err) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = {
        applicationStartDate: new Date(
          settings.applicationStartDate,
        ).toISOString(),
        applicationEndDate: new Date(settings.applicationEndDate).toISOString(),
        taskRevealDate: new Date(settings.taskRevealDate).toISOString(),
        submissionEndDate: new Date(settings.submissionEndDate).toISOString(),
      };

      await fetchApi("/settings/recruitment-phases", {
        method: "PUT",
        body: payload,
      });

      toast.success("Settings updated successfully!");
    } catch (err) {
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
          Recruitment Settings
        </h1>
        <p className="text-slate-500">
          Configure global settings and recruitment phases.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recruitment Phases
            </h2>
            <p className="text-sm text-slate-500">
              Manage when application windows open and close.
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 flex flex-col">
              <label className="text-sm font-bold text-slate-700 block">
                Application Start Date
              </label>
              <DateTimePicker
                date={settings.applicationStartDate}
                setDate={(newDate) => setSettings({ ...settings, applicationStartDate: newDate })}
              />
              <p className="text-xs text-slate-500">
                When the application form opens for candidates.
              </p>
            </div>

            <div className="space-y-2 flex flex-col">
              <label className="text-sm font-bold text-slate-700 block">
                Application End Date
              </label>
              <DateTimePicker
                date={settings.applicationEndDate}
                setDate={(newDate) => setSettings({ ...settings, applicationEndDate: newDate })}
              />
              <p className="text-xs text-slate-500">
                When the application form closes.
              </p>
            </div>

            <div className="space-y-2 flex flex-col">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                Task Reveal Date <Lock className="w-3 h-3 text-slate-400" />
              </label>
              <DateTimePicker
                date={settings.taskRevealDate}
                setDate={(newDate) => setSettings({ ...settings, taskRevealDate: newDate })}
              />
              <p className="text-xs text-slate-500">
                When candidates can see task descriptions.
              </p>
            </div>

            <div className="space-y-2 flex flex-col">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                Submission End Date <Clock className="w-3 h-3 text-slate-400" />
              </label>
              <DateTimePicker
                date={settings.submissionEndDate}
                setDate={(newDate) => setSettings({ ...settings, submissionEndDate: newDate })}
              />
              <p className="text-xs text-slate-500">
                When the submission window closes.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
