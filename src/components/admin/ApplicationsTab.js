import { useState, useEffect, useMemo } from "react";
import { useApi } from "@/lib/api";
import AdminSearchBar from "./AdminSearchBar";
import {
  User,
  Calendar,
  Briefcase,
  CreditCard,
  Eye,
  Phone,
  Mail,
  MapPin,
  ChevronLeft,
} from "lucide-react";
import SpecularButton from "../SpecularButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function timeAgo(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const weeks = Math.round(days / 7);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days < 7) return `${days} days ago`;
  return `${weeks} weeks ago`;
}

export default function ApplicationsTab() {
  const fetchApi = useApi();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Detail View State
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [appDetails, setAppDetails] = useState(null);
  const [appSubmissions, setAppSubmissions] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const groupedSubmissions = useMemo(() => {
    if (!appSubmissions || appSubmissions.length === 0) return {};
    const groups = {};
    appSubmissions.forEach(sub => {
      const deptName = sub.taskId?.departmentId?.name || "Unknown Department";
      if (!groups[deptName]) {
        groups[deptName] = [];
      }
      groups[deptName].push(sub);
    });
    return groups;
  }, [appSubmissions]);

  const statusOptions = [
    { label: "Draft", value: "DRAFT" },
    { label: "Payment Pending", value: "PAYMENT_PENDING" },
    { label: "Active", value: "ACTIVE" },
    { label: "Task Submitted", value: "TASK_SUBMITTED" },
    { label: "Under Review", value: "UNDER_REVIEW" },
    { label: "Shortlisted", value: "SHORTLISTED" },
    { label: "Interview", value: "INTERVIEW" },
    { label: "Selected", value: "SELECTED" },
    { label: "Rejected", value: "REJECTED" },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchApi("/admin/applications");
      setApplications(res.applications || []);
    } catch (err) {
      alert("Error loading applications: " + err.message);
    }
    setLoading(false);
  };

  const updateApplicationStatus = async (id, newStatus) => {
    try {
      await fetchApi(`/admin/applications/${id}/status`, {
        method: "PATCH",
        body: { status: newStatus },
      });
      // Update local state for fast UI
      setApplications((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a)),
      );
      if (selectedAppId === id && appDetails) {
        setAppDetails({ ...appDetails, status: newStatus });
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const viewDetails = async (id) => {
    setSelectedAppId(id);
    setLoadingDetails(true);
    try {
      const res = await fetchApi(`/admin/applications/${id}`);
      if (res.success) {
        setAppDetails(res.application);
        setAppSubmissions(res.submission || []);
      }
    } catch (err) {
      alert("Error loading details: " + err.message);
    }
    setLoadingDetails(false);
  };

  // Filter Logic
  const filteredAndSortedApps = useMemo(() => {
    let result = [...applications];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (app) =>
          app._id.toLowerCase().includes(q) ||
          (app.userId?.userName || "").toLowerCase().includes(q) ||
          (app.userId?.email || "").toLowerCase().includes(q),
      );
    }

    // Filter by status
    if (statusFilter !== "ALL") {
      result = result.filter((app) => app.status === statusFilter);
    }

    // Always sort by newest first natively
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

    return result;
  }, [applications, searchQuery, statusFilter]);

  if (loading)
    return (
      <div className="p-8 text-center text-slate-500 uppercase tracking-widest text-xs">
        Loading Applications...
      </div>
    );

  if (selectedAppId) {
    return (
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-lg p-8">
          <div className="mb-6">
            <button
              onClick={() => setSelectedAppId(null)}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-full text-xs font-bold transition-colors shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to List
            </button>
          </div>

        {loadingDetails ? (
          <div className="p-8 text-center text-slate-500 uppercase">
            Loading Application...
          </div>
        ) : appDetails ? (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-6 mb-6 gap-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-black  text-slate-800 tracking-tight mb-2">{appDetails._id}</h2>
                <div className="text-slate-500 font-mono text-[10px] md:text-xs mb-4">
                  {appDetails.userId?.userName || "Unknown User"} &bull; {appDetails.userId?.email || "No Email"}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-bold">
                  <span className="text-slate-500">Applied For:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-800 bg-slate-100 px-2 py-1 rounded">
                      Primary: <span className="text-slate-600">{appDetails.preferredDepartmentId?.name || "N/A"}</span>
                    </span>
                    {appDetails.secondaryDepartmentId && appDetails.secondaryDepartmentId.length > 0 && (
                      <span className="text-slate-800 bg-slate-100 px-2 py-1 rounded">
                        Secondary: <span className="text-slate-600">{appDetails.secondaryDepartmentId.map(d => d.name).join(", ")}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 text-right min-w-[200px]">
                <div className="flex items-center justify-end gap-3">
                  <span className="text-[10px] text-slate-500 font-bold">Status:</span>
                  <Select 
                    value={appDetails.status} 
                    onValueChange={(value) => updateApplicationStatus(appDetails._id, value)}
                  >
                    <SelectTrigger className="w-[190px] bg-white border-slate-200 hover:border-slate-300 rounded-lg h-9 text-[10px] font-black tracking-widest text-blue-600 uppercase shadow-lg focus:ring-blue-500">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200 text-slate-800">
                      {statusOptions.map(s => (
                        <SelectItem key={s.value} value={s.value} className="font-bold text-xs uppercase tracking-widest focus:bg-blue-50 focus:text-blue-600">
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-end gap-3 pr-2">
                  <span className="text-[10px] text-slate-500 font-bold">Payment:</span>
                  <span className={`text-[10px] font-black tracking-[0.1em] ${appDetails.paymentStatus === 'SUCCESS' ? 'text-green-500' : 'text-yellow-500'}`}>
                    {appDetails.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="p-8 text-center text-red-500 uppercase">
            Failed to load application details.
          </div>
        )}
        </div>

        {appDetails && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 tracking-tight px-2">
              Task Submissions
            </h3>
            {Object.keys(groupedSubmissions).length === 0 ? (
              <p className="text-slate-500 p-4 bg-slate-100 border border-slate-200 rounded-lg text-sm">
                No submissions found for this application.
              </p>
            ) : (
              Object.entries(groupedSubmissions).map(([deptName, subs]) => (
                <div key={deptName} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">{deptName}</h4>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {subs.map((sub, index) => (
                      <div key={sub._id} className="p-6 hover:bg-slate-50/50 transition-colors">
                        <h5 className="text-blue-600 text-sm font-bold tracking-tight mb-4">
                          {sub.taskId?.title || `Task ${index + 1}`}
                        </h5>

                        {sub.text && (
                          <div className="mb-4">
                            <strong className="block text-[10px] uppercase text-slate-500 tracking-widest mb-1.5">
                              Text Response:
                            </strong>
                            <div className="p-4 bg-white rounded-md text-sm text-slate-600 whitespace-pre-wrap font-mono border border-slate-200 shadow-sm">
                              {sub.text}
                            </div>
                          </div>
                        )}

                        {sub.links && sub.links.length > 0 && (
                          <div className="mb-4">
                            <strong className="block text-[10px] uppercase text-slate-500 tracking-widest mb-1.5">
                              Links:
                            </strong>
                            <ul className="flex flex-wrap gap-2">
                              {sub.links.map((link, i) => (
                                <li key={i}>
                                  <a
                                    href={link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-md hover:bg-blue-100 transition-colors border border-blue-100"
                                  >
                                    {link}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {sub.files && sub.files.length > 0 && (
                          <div>
                            <strong className="block text-[10px] uppercase text-slate-500 tracking-widest mb-2">
                              Attached Files:
                            </strong>
                            <div className="flex flex-wrap gap-4">
                              {sub.files.map((file, i) => (
                                <a
                                  key={i}
                                  href={file.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all min-w-[200px]"
                                >
                                  {file.resourceType === "image" ? (
                                    <img
                                      src={file.url}
                                      alt={file.originalName}
                                      className="w-10 h-10 object-cover rounded shadow-sm border border-slate-100"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-[10px]">
                                      FILE
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-semibold text-slate-700 truncate">
                                      {file.originalName}
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-medium">
                                      {(file.size / 1024).toFixed(1)} KB
                                    </div>
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <AdminSearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        statusOptions={statusOptions}
      />

      <div className="space-y-4">
        {filteredAndSortedApps.length === 0 ? (
          <div className="p-12 text-center border border-slate-200 bg-white rounded-2xl text-slate-500 uppercase tracking-widest text-xs">
            No applications match your criteria
          </div>
        ) : (
          filteredAndSortedApps.map((app) => {
            const relativeTime = timeAgo(app.createdAt);
            const appDate = app.createdAt
              ? new Date(app.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "Unknown";
            const shortId = app._id ? `${app._id.substring(0, 8)}` : "";

            return (
              <div
                key={app._id}
                className="bg-white border border-slate-200 rounded-2xl p-6 transition-all hover:bg-slate-50 hover:border-slate-200 group cursor-pointer"
                onClick={() => viewDetails(app._id)}
              >
                <div className="flex flex-col xl:flex-row gap-6 xl:items-center justify-between">
                  {/* Left: User Info */}
                  <div className="flex items-center gap-4 xl:w-[30%]">
                    <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-slate-500 group-hover:text-slate-800 transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-bold  tracking-tight text-slate-800 text-sm md:text-base truncate max-w-[200px] md:max-w-[300px]">
                        {app.userId?.userName || "Unknown User"}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500 font-medium">
                          {relativeTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Stats Row */}
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-4 flex-1 md:pl-8 md:border-l border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                       <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Applied</span>
                       <span className="text-sm font-semibold text-slate-800">{appDate}</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                       <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Status</span>
                       <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${app.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                         {app.status.replace(/_/g, " ")}
                       </span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-3 xl:w-[15%] justify-end mt-4 xl:mt-0">
                    <button
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-full text-xs font-bold transition-colors shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        viewDetails(app._id);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </div>
                </div>

                {/* Bottom Contact Footer */}
                <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap gap-6 text-[10px] md:text-xs text-slate-500  tracking-widest">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-800/30" />
                    <span className="font-mono lowercase">
                      {app.userId?.email || "no-email@provided"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
