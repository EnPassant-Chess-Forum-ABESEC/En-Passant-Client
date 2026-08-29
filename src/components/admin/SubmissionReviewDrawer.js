import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApi } from "@/lib/api";
import { toast } from "sonner";
import { X, Mail, Phone, Loader2, ExternalLink, File } from "lucide-react";
import { createPortal } from "react-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SubmissionReviewDrawer({
  isOpen,
  onClose,
  applicationId,
  onStatusUpdated,
}) {
  const fetchApi = useApi();
  const [loading, setLoading] = useState(true);
  const [appDetails, setAppDetails] = useState(null);
  const [appSubmissions, setAppSubmissions] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && applicationId) {
      loadDetails();
    } else {
      setAppDetails(null);
      setAppSubmissions([]);
    }
  }, [isOpen, applicationId]);

  const loadDetails = async () => {
    setLoading(true);
    try {
      const res = await fetchApi(`/admin/applications/${applicationId}`);
      if (res.success) {
        setAppDetails(res.application);
        setAppSubmissions(res.submission || []);
      }
    } catch (err) {
      toast.error("Error loading details: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (newStatus) => {
    try {
      await fetchApi(`/admin/applications/${applicationId}/status`, {
        method: "PATCH",
        body: { status: newStatus },
      });
      setAppDetails((prev) => ({ ...prev, status: newStatus }));
      toast.success("Status updated to " + newStatus.replace(/_/g, " "));
      if (onStatusUpdated) onStatusUpdated(applicationId, newStatus);
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };

  const groupedSubmissions = useMemo(() => {
    if (!appSubmissions || appSubmissions.length === 0) return {};
    const groups = {};
    appSubmissions.forEach((sub) => {
      const deptName = sub.taskId?.departmentId?.name || "Unknown Department";
      if (!groups[deptName]) groups[deptName] = [];
      groups[deptName].push(sub);
    });
    return groups;
  }, [appSubmissions]);

  if (!mounted) return null;

  const drawerContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed top-16 lg:top-0 inset-x-0 bottom-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed top-16 lg:top-0 right-0 h-[calc(100dvh-64px)] lg:h-full w-full max-w-3xl bg-white dark:bg-[#0F172A] shadow-2xl z-[101] flex flex-col border-l border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="text-sm uppercase tracking-widest font-semibold">
                  Loading Details...
                </span>
              </div>
            ) : !appDetails ? (
              <div className="flex-1 flex items-center justify-center text-red-500 p-8">
                Failed to load application details.
              </div>
            ) : (
              <>
                <div className="flex-shrink-0">
                  <div className="px-6 sm:px-8 pt-6 pb-5 bg-slate-50 dark:bg-[#0a1628] border-b border-slate-100 dark:border-slate-800 relative">
                    <button
                      onClick={onClose}
                      className="absolute top-5 sm:top-6 right-4 sm:right-6 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500 z-10"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="pr-12">
                      <h2 className="font-black text-xl text-slate-900 dark:text-white truncate">
                        {appDetails.userId?.userName}
                      </h2>
                    </div>

                    <div className="mt-3 flex flex-row flex-wrap items-end justify-between gap-4">
                      <div className="flex flex-col gap-2 text-xs text-slate-500 min-w-0 flex-1">
                        <span className="flex items-center gap-1.5 min-w-0">
                          <Mail className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{appDetails.userId?.email}</span>
                        </span>
                        {appDetails.userId?.phoneNumber && (
                          <span className="flex items-center gap-1.5 min-w-0">
                            <Phone className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{appDetails.userId.phoneNumber}</span>
                          </span>
                        )}
                      </div>

                      <div className="shrink-0">
                        <Select
                          value={appDetails.status}
                          onValueChange={(value) => updateApplicationStatus(value)}
                        >
                          <SelectTrigger className="w-[140px] sm:w-[160px] h-8 sm:h-9 bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-700 text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 focus:ring-blue-500/20 shadow-sm">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DRAFT" className="text-xs font-semibold">Draft</SelectItem>
                            <SelectItem value="PAYMENT_PENDING" className="text-xs font-semibold">Payment Pending</SelectItem>
                            <SelectItem value="ACTIVE" className="text-xs font-semibold">Active</SelectItem>
                            <SelectItem value="TASK_SUBMITTED" className="text-xs font-semibold text-blue-600 dark:text-blue-400">Task Submitted</SelectItem>
                            <SelectItem value="UNDER_REVIEW" className="text-xs font-semibold text-amber-600 dark:text-amber-400">Under Review</SelectItem>
                            <SelectItem value="INTERVIEW" className="text-xs font-semibold text-orange-600 dark:text-orange-400">Interview</SelectItem>
                            <SelectItem value="SELECTED" className="text-xs font-semibold text-green-600 dark:text-green-400">Selected</SelectItem>
                            <SelectItem value="REJECTED" className="text-xs font-semibold text-red-600 dark:text-red-400">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  data-lenis-prevent="true"
                  className="flex-1 overflow-y-auto p-8 space-y-8"
                >
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-5">
                      Submitted Tasks
                    </h4>
                    {Object.keys(groupedSubmissions).length === 0 ? (
                      <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 text-sm">
                        No submissions found for this candidate yet.
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {Object.entries(groupedSubmissions).map(
                          ([dept, subs]) => (
                            <div key={dept} className="space-y-4">
                              <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest pl-3 border-l-2 border-blue-500">
                                {dept}
                              </h5>
                              {subs.map((sub, i) => (
                                <div
                                  key={sub._id}
                                  className="bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden"
                                >
                                  <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                                    <span className="font-bold text-sm text-slate-700 dark:text-slate-200">
                                      {sub.taskId?.title || `Task ${i + 1}`}
                                    </span>
                                    {sub.updatedAt && (
                                      <span className="text-[10px] text-slate-400">
                                        {new Date(
                                          sub.updatedAt,
                                        ).toLocaleString()}
                                      </span>
                                    )}
                                  </div>
                                  <div className="p-5 space-y-4">
                                    {sub.text && (
                                      <div>
                                        <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">
                                          Response
                                        </span>
                                        <div className="p-4 bg-white dark:bg-[#0F172A] rounded-xl text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap font-mono border border-slate-200 dark:border-slate-800">
                                          {sub.text}
                                        </div>
                                      </div>
                                    )}
                                    {sub.links && sub.links.length > 0 && (
                                      <div>
                                        <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">
                                          Links
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                          {sub.links.map((link, idx) => (
                                            <a
                                              key={idx}
                                              href={link}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              title={link}
                                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 border border-blue-100 dark:border-blue-500/20 transition-colors max-w-full"
                                            >
                                              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                              <span className="truncate">{link}</span>
                                            </a>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    {sub.files && sub.files.length > 0 && (
                                      <div>
                                        <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">
                                          Files
                                        </span>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                          {sub.files.map((file, idx) => (
                                            <a
                                              key={idx}
                                              href={file.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="flex items-center gap-3 p-3 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                            >
                                              {file.resourceType === "image" ? (
                                                <img
                                                  src={file.url}
                                                  alt="Attached"
                                                  className="w-10 h-10 object-cover rounded-lg shadow-sm"
                                                />
                                              ) : (
                                                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
                                                  <File className="w-4 h-4 text-slate-400" />
                                                </div>
                                              )}
                                              <div className="min-w-0">
                                                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                                                  {file.originalName}
                                                </p>
                                                <p className="text-[10px] text-slate-500">
                                                  {(file.size / 1024).toFixed(
                                                    1,
                                                  )}{" "}
                                                  KB
                                                </p>
                                              </div>
                                            </a>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(drawerContent, document.body);
}
