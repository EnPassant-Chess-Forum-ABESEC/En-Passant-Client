import { useState, useEffect, useMemo } from "react";
import { useApi } from "@/lib/api";
import { toast } from "sonner";
import AdminSearchBar from "./AdminSearchBar";
import {
  User,
  Eye,
  Mail,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Loader2,
  Activity,
  CreditCard,
  Phone,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [appDetails, setAppDetails] = useState(null);
  const [appSubmissions, setAppSubmissions] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const groupedSubmissions = useMemo(() => {
    if (!appSubmissions || appSubmissions.length === 0) return {};
    const groups = {};
    appSubmissions.forEach((sub) => {
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

  async function loadData() {
    setLoading(true);
    try {
      const res = await fetchApi("/admin/applications");
      setApplications(res.applications || []);
    } catch (err) {
      toast.error("Error loading applications: " + err.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const updateApplicationStatus = async (id, newStatus) => {
    try {
      await fetchApi(`/admin/applications/${id}/status`, {
        method: "PATCH",
        body: { status: newStatus },
      });
      setApplications((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a)),
      );
      if (selectedAppId === id && appDetails) {
        setAppDetails({ ...appDetails, status: newStatus });
      }
      toast.success("Application status updated");
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };

  const [confirmDeleteAction, setConfirmDeleteAction] = useState(null);

  const deleteApplication = (id) => {
    setConfirmDeleteAction(id);
  };

  const executeDeleteApplication = async () => {
    if (!confirmDeleteAction) return;
    const id = confirmDeleteAction;
    setConfirmDeleteAction(null);

    try {
      await fetchApi(`/admin/applications/${id}`, {
        method: "DELETE",
      });
      setApplications((prev) => prev.filter((app) => app._id !== id));
      if (selectedAppId === id) {
        setSelectedAppId(null);
        setAppDetails(null);
      }
      toast.success("Application deleted successfully");
    } catch (err) {
      toast.error("Error deleting application: " + err.message);
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
      toast.error("Error loading details: " + err.message);
    }
    setLoadingDetails(false);
  };

  const [sortFilter, setSortFilter] = useState("NEWEST");

  const filteredAndSortedApps = useMemo(() => {
    let result = [...applications];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (app) =>
          app._id.toLowerCase().includes(q) ||
          (app.userId?.userName || "").toLowerCase().includes(q) ||
          (app.userId?.email || "").toLowerCase().includes(q),
      );
    }

    if (statusFilter !== "ALL") {
      result = result.filter((app) => app.status === statusFilter);
    }

    if (departmentFilter !== "ALL") {
      result = result.filter((app) => {
        const matchesPrimary =
          app.preferredDepartmentId?.name === departmentFilter;
        const matchesSecondary = app.secondaryDepartmentId?.some(
          (d) => d.name === departmentFilter,
        );
        return matchesPrimary || matchesSecondary;
      });
    }

    if (sortFilter === "NEWEST") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortFilter === "OLDEST") {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return result;
  }, [applications, searchQuery, statusFilter, departmentFilter, sortFilter]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, departmentFilter, sortFilter]);

  const totalPages = Math.ceil(filteredAndSortedApps.length / itemsPerPage);
  const paginatedApps = filteredAndSortedApps.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const deleteDialog = (
    <AlertDialog
      open={!!confirmDeleteAction}
      onOpenChange={(open) => {
        if (!open) setConfirmDeleteAction(null);
      }}
    >
      <AlertDialogContent className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-slate-900 dark:text-slate-50 font-bold">
            Confirm Deletion
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500 dark:text-slate-400">
            Are you sure you want to delete this application? This will also
            delete any attached payments and submissions. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={executeDeleteApplication}
            className="text-white bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  if (loading)
    return (
      <div className="p-12 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 uppercase tracking-widest text-sm gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-500" />
      </div>
    );

  if (selectedAppId) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <motion.div variants={itemVariants}>
          <button
            onClick={() => setSelectedAppId(null)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#020617] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold transition-colors shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to List
          </button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm"
        >
          {loadingDetails ? (
            <div className="p-12 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 uppercase tracking-widest text-sm gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-500" />
            </div>
          ) : appDetails ? (
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden border border-slate-200 dark:border-slate-700">
                    {appDetails.userId?.profilePictureUrl ? (
                      <img
                        src={appDetails.userId.profilePictureUrl}
                        alt={appDetails.userId?.userName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-black text-slate-600 dark:text-slate-300 tracking-wide">
                        {(appDetails.userId?.userName || "??")
                          .split(" ")
                          .map((w) => w[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
                      {appDetails.userId?.userName || "Unknown User"}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-slate-500 dark:text-slate-400 text-xs">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        {appDetails.userId?.email || "No Email"}
                      </span>
                      {appDetails.userId?.phoneNumber && (
                        <>
                          <span className="text-slate-300 dark:text-slate-600">
                            &bull;
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5" />
                            {appDetails.userId?.phoneNumber}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 pr-1">
                    Status
                  </span>
                  <Select
                    value={appDetails.status}
                    onValueChange={(value) =>
                      updateApplicationStatus(appDetails._id, value)
                    }
                  >
                    <SelectTrigger className="w-auto min-w-[110px] h-8 px-3 gap-2 border-green-200 dark:border-green-500/30 bg-green-50 dark:bg-green-500/10 rounded-full text-xs font-bold text-green-700 dark:text-green-400 shadow-none focus:ring-0 focus:ring-offset-0">
                      <span className="w-2 h-2 rounded-full bg-green-500 inline-block shrink-0" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent
                      align="end"
                      style={{ maxHeight: "none" }}
                      className="min-w-[220px] bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-xl"
                    >
                      {statusOptions.map((s) => (
                        <SelectItem
                          key={s.value}
                          value={s.value}
                          className="text-xs font-semibold cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-800/50"
                        >
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 mx-6" />

              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800 px-6 py-6 gap-6 md:gap-0">
                <div className="md:pr-8">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
                    Application
                  </p>
                  <div className="space-y-4">
                    {appDetails.preferredDepartmentId && (
                      <div className="pl-3 border-l-2 border-indigo-400 dark:border-indigo-500">
                        <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">
                          Primary
                        </p>
                        <p className="text-base font-bold text-slate-800 dark:text-slate-100">
                          {appDetails.preferredDepartmentId.name}
                        </p>
                      </div>
                    )}
                    {appDetails.secondaryDepartmentId?.length > 0 && (
                      <>
                        <div className="border-t border-slate-100 dark:border-slate-800" />
                        {appDetails.secondaryDepartmentId.map((dept) => (
                          <div
                            key={dept._id}
                            className="pl-3 border-l-2 border-slate-300 dark:border-slate-600"
                          >
                            <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">
                              Secondary
                            </p>
                            <p className="text-base font-bold text-slate-800 dark:text-slate-100">
                              {dept.name}
                            </p>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>

                <div className="md:pl-8 pt-6 md:pt-0">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
                    Payment
                  </p>
                  {appDetails.paymentStatus === "SUCCESS" ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 w-fit px-3 py-1.5 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-full">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                          Paid
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        Payment completed successfully
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 w-fit px-3 py-1.5 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-full">
                        <span className="text-sm font-bold text-yellow-700 dark:text-yellow-400">
                          {appDetails.paymentStatus || "Pending"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        Payment not yet completed
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 mx-6 px-0 py-4 flex justify-end">
                <button
                  onClick={() => deleteApplication(appDetails._id)}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl text-xs font-bold transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Application
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-red-500 uppercase">
              Failed to load application details.
            </div>
          )}
        </motion.div>

        {appDetails && (
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-50 tracking-tight px-2">
              Task Submissions
            </h3>
            {Object.keys(groupedSubmissions).length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 p-4 bg-slate-100 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-lg text-sm">
                No submissions found for this application.
              </p>
            ) : (
              Object.entries(groupedSubmissions).map(([deptName, subs]) => (
                <div
                  key={deptName}
                  className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden"
                >
                  <div className="bg-slate-50 dark:bg-[#020617] border-b border-slate-200 dark:border-slate-800 px-6 py-4">
                    <h4 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">
                      {deptName}
                    </h4>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {subs.map((sub, index) => (
                      <div
                        key={sub._id}
                        className="p-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <h5 className="text-blue-600 dark:text-blue-400 text-sm font-bold tracking-tight mb-4">
                          {sub.taskId?.title || `Task ${index + 1}`}
                        </h5>

                        {sub.text && (
                          <div className="mb-4">
                            <strong className="block text-[10px] uppercase text-slate-500 dark:text-slate-400 tracking-widest mb-1.5">
                              Text Response:
                            </strong>
                            <div className="p-4 bg-white dark:bg-[#020617] rounded-md text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap font-mono border border-slate-200 dark:border-slate-800 shadow-sm">
                              {sub.text}
                            </div>
                          </div>
                        )}

                        {sub.links && sub.links.length > 0 && (
                          <div className="mb-4">
                            <strong className="block text-[10px] uppercase text-slate-500 dark:text-slate-400 tracking-widest mb-1.5">
                              Links:
                            </strong>
                            <ul className="flex flex-wrap gap-2">
                              {sub.links.map((link, i) => (
                                <li key={i}>
                                  <a
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-md hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors border border-blue-100 dark:border-blue-500/20"
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
                            <strong className="block text-[10px] uppercase text-slate-500 dark:text-slate-400 tracking-widest mb-2">
                              Attached Files:
                            </strong>
                            <div className="flex flex-wrap gap-4">
                              {sub.files.map((file, i) => (
                                <a
                                  key={i}
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 p-3 bg-white dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-lg hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-sm transition-all min-w-[200px]"
                                >
                                  {file.resourceType === "image" ? (
                                    <img
                                      src={file.url}
                                      alt={file.originalName}
                                      className="w-10 h-10 object-cover rounded shadow-sm border border-slate-100 dark:border-slate-800"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 font-bold text-[10px]">
                                      FILE
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                                      {file.originalName}
                                    </div>
                                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
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
          </motion.div>
        )}
        {deleteDialog}
      </motion.div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <motion.div variants={itemVariants} className="mt-6 mb-8">
        <AdminSearchBar
          onRefresh={loadData}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          departmentFilter={departmentFilter}
          setDepartmentFilter={setDepartmentFilter}
          departmentOptions={departmentOptions}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          statusOptions={statusOptions}
          sortFilter={sortFilter}
          setSortFilter={setSortFilter}
          sortOptions={[
            { label: "Newest First", value: "NEWEST" },
            { label: "Oldest First", value: "OLDEST" },
          ]}
          totalCount={filteredAndSortedApps.length}
          countLabel="Total Applications"
        />
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        {paginatedApps.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="p-12 text-center border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] rounded-2xl text-slate-500 dark:text-slate-400 uppercase tracking-widest text-xs"
          >
            No applications match your criteria
          </motion.div>
        ) : (
          paginatedApps.map((app) => {
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
              <motion.div
                variants={itemVariants}
                key={app._id}
                className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-200 dark:hover:border-slate-700 group cursor-pointer"
                onClick={() => viewDetails(app._id)}
              >
                <div className="flex flex-col xl:flex-row gap-6 xl:items-center justify-between">
                  <div className="flex items-center gap-4 xl:w-[30%]">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-bold  tracking-tight text-slate-800 dark:text-slate-50 text-sm md:text-base truncate max-w-[200px] md:max-w-[300px]">
                        {app.userId?.userName || "Unknown User"}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {relativeTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-8 gap-y-4 flex-1 md:pl-8 md:border-l border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold">
                        Applied
                      </span>
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {appDate}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold">
                        Status
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${app.status === "ACTIVE" ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400" : "bg-slate-100 text-slate-700 dark:bg-[#020617] dark:text-slate-300 dark:border dark:border-slate-700"}`}
                      >
                        {app.status.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 xl:w-[20%] justify-end mt-4 xl:mt-0">
                    <button
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 rounded-full text-xs font-bold transition-colors shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        viewDetails(app._id);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 rounded-full text-xs font-bold transition-colors shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteApplication(app._id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-6 text-[10px] md:text-xs text-slate-500 dark:text-slate-400 tracking-widest">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-800/30 dark:text-slate-400/50" />
                    <span className="font-mono lowercase">
                      {app.userId?.email || "no-email@provided"}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}

        {totalPages > 1 && (
          <div className="flex flex-row items-center justify-between border-t border-slate-200 dark:border-slate-800 px-6 py-4 mt-4 bg-white dark:bg-[#0F172A] rounded-2xl shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-wider">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#020617] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#020617] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </motion.div>
      {deleteDialog}
    </motion.div>
  );
}
