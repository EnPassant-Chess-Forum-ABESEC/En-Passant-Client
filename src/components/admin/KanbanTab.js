import React, { useState, useEffect, useMemo } from "react";
import { useApi } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import SubmissionReviewDrawer from "./SubmissionReviewDrawer";
import AdminSearchBar from "./AdminSearchBar";

const PIPELINE_STAGES = [
  {
    id: "TASK_SUBMITTED",
    label: "Submitted",
    color: "border-sky-400",
    bg: "bg-sky-400/10",
    text: "text-sky-500 dark:text-sky-400",
  },
  {
    id: "UNDER_REVIEW",
    label: "Under Review",
    color: "border-violet-400",
    bg: "bg-violet-400/10",
    text: "text-violet-500 dark:text-violet-400",
  },
  {
    id: "INTERVIEW",
    label: "Interview",
    color: "border-amber-400",
    bg: "bg-amber-400/10",
    text: "text-amber-500 dark:text-amber-400",
  },
  {
    id: "SELECTED",
    label: "Selected",
    color: "border-emerald-400",
    bg: "bg-emerald-400/10",
    text: "text-emerald-500 dark:text-emerald-400",
  },
  {
    id: "REJECTED",
    label: "Rejected",
    color: "border-rose-400",
    bg: "bg-rose-400/10",
    text: "text-rose-500 dark:text-rose-400",
  },
];

export default function KanbanTab() {
  const fetchApi = useApi();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");

  const [selectedAppId, setSelectedAppId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [draggedAppId, setDraggedAppId] = useState(null);
  const [activeMobileStageId, setActiveMobileStageId] = useState(PIPELINE_STAGES[0].id);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchApi("/admin/applications");
      const pipelineApps = (res.applications || []).filter(
        (app) => !["DRAFT", "PAYMENT_PENDING", "ACTIVE"].includes(app.status),
      );
      setApplications(pipelineApps);
    } catch (err) {
      toast.error("Error loading pipeline: " + err.message);
    }
    setLoading(false);
  };

  const updateApplicationStatus = async (id, newStatus) => {
    const previousApps = [...applications];

    setApplications((prev) =>
      prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a)),
    );

    try {
      await fetchApi(`/admin/applications/${id}/status`, {
        method: "PATCH",
        body: { status: newStatus },
      });
      toast.success("Status updated");
    } catch (err) {
      setApplications(previousApps);
      toast.error("Error: " + err.message);
    }
  };

  const handleDragStart = (e, appId) => {
    setDraggedAppId(appId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    if (draggedAppId) {
      const app = applications.find((a) => a._id === draggedAppId);
      if (app && app.status !== targetStatus) {
        updateApplicationStatus(draggedAppId, targetStatus);
      }
      setDraggedAppId(null);
    }
  };

  const openDrawer = (appId) => {
    setSelectedAppId(appId);
    setIsDrawerOpen(true);
  };

  const handleDrawerStatusUpdate = (appId, newStatus) => {
    setApplications((prev) =>
      prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a)),
    );
  };

  const filteredApps = useMemo(() => {
    let result = applications;

    if (departmentFilter !== "ALL") {
      result = result.filter((app) => {
        return app.submittedDepartments?.includes(departmentFilter);
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (app) =>
          app.userId?.userName?.toLowerCase().includes(q) ||
          app.userId?.email?.toLowerCase().includes(q) ||
          app.preferredDepartmentId?.name?.toLowerCase().includes(q),
      );
    }

    return result;
  }, [applications, searchQuery, departmentFilter]);

  const departmentOptions = useMemo(() => {
    const deptSet = new Set();
    applications.forEach((app) => {
      if (app.preferredDepartmentId?.name)
        deptSet.add(app.preferredDepartmentId.name);
      if (app.secondaryDepartmentId) {
        app.secondaryDepartmentId.forEach((d) => {
          if (d.name) deptSet.add(d.name);
        });
      }
    });
    return Array.from(deptSet)
      .sort()
      .map((d) => ({ label: d, value: d }));
  }, [applications]);

  const columns = useMemo(() => {
    const cols = {};
    PIPELINE_STAGES.forEach((stage) => {
      cols[stage.id] = filteredApps.filter((app) => app.status === stage.id);
    });
    return cols;
  }, [filteredApps]);

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-slate-500 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AdminSearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
        departmentOptions={departmentOptions}
        statusFilter="ALL"
        setStatusFilter={() => {}}
        statusOptions={[]}
        sortFilter="NEWEST"
        setSortFilter={() => {}}
        sortOptions={[]}
        totalCount={filteredApps.length}
        countLabel="Candidates"
        onRefresh={loadData}
      />

      {/* Mobile Stage Selector */}
      <div className="lg:hidden flex flex-wrap gap-2 pb-2">
        {PIPELINE_STAGES.map((stage) => (
          <button
            key={stage.id}
            onClick={() => setActiveMobileStageId(stage.id)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-colors ${
              activeMobileStageId === stage.id
                ? "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 shadow-sm"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            {stage.label} <span className="opacity-60 ml-0.5">({columns[stage.id]?.length || 0})</span>
          </button>
        ))}
      </div>

      <div
        data-lenis-prevent="true"
        className="flex gap-3 xl:gap-4 overflow-x-auto pb-2 pt-2 w-full scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700"
      >
        {PIPELINE_STAGES.map((stage) => (
          <div
            key={stage.id}
            className={`w-full lg:flex-1 lg:min-w-[200px] max-w-full lg:max-w-[320px] flex-col bg-slate-50/50 dark:bg-[#020617]/50 rounded-2xl border border-slate-200 dark:border-slate-800 ${
              activeMobileStageId === stage.id ? "flex shrink-0" : "hidden lg:flex"
            }`}
            style={{ height: "calc(100vh - 350px)", minHeight: "400px" }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            <div
              className={`p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 border-t-4 ${stage.color} rounded-t-2xl`}
            >
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm tracking-wide">
                {stage.label}
              </h3>
              <span
                className={`text-xs font-black px-2 py-0.5 rounded-full ${stage.bg} ${stage.text}`}
              >
                {columns[stage.id]?.length || 0}
              </span>
            </div>

            <div
              data-lenis-prevent="true"
              className="overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700"
              style={{ flex: "1 1 0", minHeight: 0 }}
            >
              {columns[stage.id]?.map((app) => (
                <div
                  key={app._id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, app._id)}
                  onClick={() => openDrawer(app._id)}
                  className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-xl p-4 cursor-pointer hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-md transition-all shadow-sm group"
                >
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                    {app.userId?.userName || "Unknown"}
                  </h4>

                  <div className="flex flex-wrap gap-1.5">
                    {app.preferredDepartmentId?.name && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 px-2 py-0.5 bg-blue-50 dark:bg-blue-500/10 rounded-md border border-blue-100 dark:border-blue-500/20">
                        {app.preferredDepartmentId.name}
                      </span>
                    )}
                    {app.secondaryDepartmentId?.map((dept) => (
                      <span
                        key={dept._id}
                        className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2 py-0.5 bg-slate-50 dark:bg-[#020617] rounded-md border border-slate-100 dark:border-slate-800"
                      >
                        {dept.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              {columns[stage.id]?.length === 0 && (
                <div className="h-20 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-xs font-medium uppercase tracking-widest opacity-50">
                  Drop Here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <SubmissionReviewDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        applicationId={selectedAppId}
        onStatusUpdated={handleDrawerStatusUpdate}
      />
    </div>
  );
}
