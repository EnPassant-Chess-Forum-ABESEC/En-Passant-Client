"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/lib/api";
import { toast } from "sonner";
import {
  FileText,
  CheckSquare,
  Users,
  CreditCard,
  Layers,
  RefreshCw,
  ChevronRight,
  Loader2,
  Database,
  CloudLightning,
  ChartLine,
  Mail,
  ExternalLink,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

export default function AdminDashboard() {
  const fetchApi = useApi();
  const { getToken } = useAuth();
  const [exportingId, setExportingId] = useState(null);
  const [isCleaningRedis, setIsCleaningRedis] = useState(false);
  const [isRedisModalOpen, setIsRedisModalOpen] = useState(false);
  const [isCleaningCloud, setIsCleaningCloud] = useState(false);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);

  const handleCleanRedis = async () => {
    setIsCleaningRedis(true);
    try {
      const res = await fetchApi("/admin/redis/clean", { method: "POST" });

      if (res?.success) {
        toast.success("Redis sets cleaned successfully.");
      } else {
        toast.error(
          "Failed to clean Redis sets: " + (res?.message || "Unknown error"),
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Error cleaning Redis: " + error.message);
    } finally {
      setIsCleaningRedis(false);
      setIsRedisModalOpen(false);
    }
  };

  const handleCleanCloud = async () => {
    setIsCleaningCloud(true);
    try {
      const res = await fetchApi("/admin/cloud/clean", { method: "POST" });

      if (res?.success) {
        toast.success("Cloud files cleaned successfully.");
      } else {
        toast.error(
          "Failed to clean cloud files: " + (res?.message || "Unknown error"),
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Error cleaning cloud files: " + error.message);
    } finally {
      setIsCleaningCloud(false);
      setIsCloudModalOpen(false);
    }
  };

  const [isSendingReminders, setIsSendingReminders] = useState(false);
  const [isRemindersModalOpen, setIsRemindersModalOpen] = useState(false);

  const handleSendReminders = async () => {
    setIsSendingReminders(true);
    try {
      const res = await fetchApi("/admin/applications/remind-drafts", {
        method: "POST",
      });
      if (res?.success) {
        toast.success(res.message || "Draft reminders sent successfully.");
      } else {
        toast.error(
          "Failed to send reminders: " + (res?.message || "Unknown error"),
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Error sending reminders: " + error.message);
    } finally {
      setIsSendingReminders(false);
      setIsRemindersModalOpen(false);
    }
  };

  const createExportHandler = (id, endpoint) => async () => {
    setExportingId(id);
    try {
      const token = await getToken();
      const API_BASE =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Export failed");

      const data = await response.json();
      if (data.success) {
        toast.success(data.message || "Export successful");
      } else {
        toast.error(data.message || "Export failed");
      }
      setExportingId(null);
    } catch (error) {
      console.error(error);
      toast.error("Error exporting: " + error.message);
      setExportingId(null);
    }
  };

  const [stats, setStats] = useState({
    totalApplications: "...",
    activeTasks: "...",
    totalMembers: "...",
    totalRevenue: "...",
    chartData: [],
  });

  const [recentApps, setRecentApps] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);

  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsRes, appsRes, userRes] = await Promise.all([
          fetchApi("/admin/stats"),
          fetchApi("/admin/applications?pageSize=1000"),
          fetchApi("/users/me"),
        ]);

        if (userRes?.user?.role) {
          setUserRole(userRes.user.role);
        }

        if (statsRes?.stats) {
          setStats({
            totalApplications: statsRes.stats.totalApplications || 0,
            activeTasks: statsRes.stats.activeTasks || 0,
            totalMembers: statsRes.stats.totalMembers || 0,
            totalRevenue: `Rs. ${((statsRes.stats.totalRevenue || 0) / 100).toLocaleString("en-IN")}`,
            chartData: statsRes.stats.chartData || [],
          });
        }

        if (appsRes?.applications) {
          const sortedApps = [...appsRes.applications].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          );
          setRecentApps(sortedApps.slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoadingApps(false);
      }
    };
    loadData();
  }, [fetchApi]);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <motion.header
        variants={itemVariants}
        className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h1 className="text-3xl md:text-5xl font-black  tracking-tight text-slate-900 dark:text-slate-50 mb-2">
            Admin Dashboard
          </h1>
        </div>
      </motion.header>

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16"
      >
        {[
          {
            label: "Total Applications",
            value: stats.totalApplications,
            icon: FileText,
          },
          {
            label: "Active Tasks",
            value: stats.activeTasks,
            icon: CheckSquare,
          },
          { label: "Total Members", value: stats.totalMembers, icon: Users },
          {
            label: "Revenue (INR)",
            value: stats.totalRevenue,
            icon: CreditCard,
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-4 md:p-8 rounded-2xl md:rounded-3xl relative overflow-hidden group shadow-xl transition-all duration-500 hover:shadow-blue-500/10 hover:-translate-y-1"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="flex justify-between items-start mb-4 md:mb-6">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 flex items-center justify-center group-hover:bg-slate-100 dark:group-hover:bg-slate-800/50 transition-colors">
                  <Icon className="w-4 h-4 md:w-5 md:h-5 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                </div>
              </div>
              <h3 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-slate-50 mb-1 md:mb-2 tracking-tight flex items-center">
                {stat.value === "..." ? (
                  <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin text-blue-500" />
                ) : (
                  stat.value
                )}
              </h3>
              <p className="text-[9px] md:text-[10px] text-slate-400 tracking-wider">
                {stat.label}
              </p>
            </div>
          );
        })}
      </motion.div>

      <motion.section variants={itemVariants} className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col">
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-6 flex items-center gap-2">
              <ChartLine className="w-5 h-5 text-blue-500" />
              Recruitment Trends
            </h2>
            <div className="flex-1 min-h-[300px]">
              {stats.chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={stats.chartData}
                    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#334155"
                      opacity={0.2}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      dx={-10}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #1e293b",
                        borderRadius: "8px",
                        color: "#f8fafc",
                      }}
                      itemStyle={{ fontSize: "13px", fontWeight: "bold" }}
                    />
                    <Legend
                      iconType="plainline"
                      wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }}
                    />
                    <Line
                      type="monotone"
                      name="Primary Preference"
                      dataKey="PRIMARY"
                      stroke="#22c55e"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2, fill: "#fdfdfd" }}
                      activeDot={{ r: 6, fill: "#22c55e" }}
                    />
                    <Line
                      type="monotone"
                      name="Secondary Preference"
                      dataKey="SECONDARY"
                      stroke="#eab308"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2, fill: "#fdfdfd" }}
                      activeDot={{ r: 6, fill: "#eab308" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm font-medium tracking-wide">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Loading Chart Data...
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2 mb-1">
              <FileText className="w-5 h-5 text-blue-500" />
              Export Sheets
            </h2>

            {[
              {
                id: "applications_export",
                title: "Recruitment Applications",
                description:
                  "Update a spreadsheet of all submitted applications.",
                icon: FileText,
                sheetUrl:
                  "https://docs.google.com/spreadsheets/d/11f8MfcIZXmUZo5ENSVohHFfqxgUFMFg1ANFy1ASbn0M/edit?gid=0#gid=0",
                onClick: createExportHandler(
                  "applications_export",
                  "/admin/applications/export",
                ),
              },
              {
                id: "payments_export",
                title: "Recruitment Payments",
                description: "Update a spreadsheet of all payment records.",
                icon: CreditCard,
                sheetUrl:
                  "https://docs.google.com/spreadsheets/d/1awc6omtU9hJ4l7ZqDo8O3R1hW1o0GezAOFqsbU87ckk/edit?gid=0#gid=0",
                onClick: createExportHandler(
                  "payments_export",
                  "/admin/payments/export",
                ),
              },
            ].map((doc) => {
              const DocIcon = doc.icon;
              const isLoading = exportingId === doc.id;
              return (
                <div
                  key={doc.id}
                  className="relative bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-lg transition-all group h-full"
                >
                  {doc.sheetUrl && (
                    <a
                      href={doc.sheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                      title="Open Sheet"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 flex items-center justify-center mb-4 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 group-hover:border-blue-200 dark:group-hover:border-blue-500/30 transition-colors">
                    <DocIcon className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-50 mb-1 tracking-tight">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 flex-1 leading-relaxed">
                    {doc.description}
                  </p>
                  <button
                    onClick={doc.onClick}
                    disabled={isLoading}
                    className="w-full mt-auto py-2.5 bg-slate-50 dark:bg-[#020617] hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-center gap-2 group-hover:bg-slate-900 dark:group-hover:bg-slate-50 group-hover:text-white dark:group-hover:text-slate-900 group-hover:border-slate-900 dark:group-hover:border-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5" />
                        Update Sheet
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {userRole === "admin" && (
        <motion.section variants={itemVariants} className="mb-16">
          <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
              System Actions
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-lg transition-all group">
              <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 flex items-center justify-center mb-4 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 group-hover:border-blue-200 dark:group-hover:border-blue-500/30 transition-colors">
                <Database className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-50 mb-1 tracking-tight">
                Clean Redis Sets
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 flex-1 leading-relaxed">
                Clear cached data and active sets from Redis. Use this if the
                system state is stale or out of sync.
              </p>
              <AlertDialog
                open={isRedisModalOpen}
                onOpenChange={setIsRedisModalOpen}
              >
                <AlertDialogTrigger asChild>
                  <button
                    disabled={isCleaningRedis}
                    className="w-full py-2.5 bg-slate-50 dark:bg-[#020617] hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-center gap-2 group-hover:bg-slate-900 dark:group-hover:bg-slate-50 group-hover:text-white dark:group-hover:text-slate-900 group-hover:border-slate-900 dark:group-hover:border-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isCleaningRedis ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Cleaning...
                      </>
                    ) : (
                      <>
                        <Layers className="w-3.5 h-3.5" /> Clean Redis
                      </>
                    )}
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-slate-900 dark:text-slate-50 font-bold">
                      Clean Redis Leaderboard Sets?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-500 dark:text-slate-400">
                      This action cannot be undone. This will permanently remove
                      all cached leaderboard data and sorted sets from Redis.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCleanRedis}
                      className="bg-red-500 hover:bg-red-600 text-white border-0"
                    >
                      Yes, Clean Sets
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-lg transition-all group">
              <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 flex items-center justify-center mb-4 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 group-hover:border-blue-200 dark:group-hover:border-blue-500/30 transition-colors">
                <CloudLightning className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-50 mb-1 tracking-tight">
                Clean Cloud Files
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 flex-1 leading-relaxed">
                Delete all files stored in Cloudinary. Use this to clear
                uploaded receipts, submissions, and test files.
              </p>
              <AlertDialog
                open={isCloudModalOpen}
                onOpenChange={setIsCloudModalOpen}
              >
                <AlertDialogTrigger asChild>
                  <button
                    disabled={isCleaningCloud}
                    className="w-full py-2.5 bg-slate-50 dark:bg-[#020617] hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-center gap-2 group-hover:bg-slate-900 dark:group-hover:bg-slate-50 group-hover:text-white dark:group-hover:text-slate-900 group-hover:border-slate-900 dark:group-hover:border-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isCleaningCloud ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Cleaning...
                      </>
                    ) : (
                      <>
                        <CloudLightning className="w-3.5 h-3.5" /> Clean Cloud
                      </>
                    )}
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-slate-900 dark:text-slate-50 font-bold">
                      Clean Cloudinary Files?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-500 dark:text-slate-400">
                      This action cannot be undone. This will permanently delete
                      all files uploaded to Cloudinary, including receipts and
                      user submissions.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCleanCloud}
                      className="bg-red-500 hover:bg-red-600 text-white border-0"
                    >
                      Yes, Clean Files
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-lg transition-all group">
              <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 flex items-center justify-center mb-4 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 group-hover:border-blue-200 dark:group-hover:border-blue-500/30 transition-colors">
                <Mail className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-50 mb-1 tracking-tight">
                Draft Reminders
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 flex-1 leading-relaxed">
                Send reminder emails to users who have submitted an application
                but have not completed the payment.
              </p>
              <AlertDialog
                open={isRemindersModalOpen}
                onOpenChange={setIsRemindersModalOpen}
              >
                <AlertDialogTrigger asChild>
                  <button
                    disabled={isSendingReminders}
                    className="w-full py-2.5 bg-slate-50 dark:bg-[#020617] hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-center gap-2 group-hover:bg-slate-900 dark:group-hover:bg-slate-50 group-hover:text-white dark:group-hover:text-slate-900 group-hover:border-slate-900 dark:group-hover:border-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSendingReminders ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="w-3.5 h-3.5" /> Send Emails
                      </>
                    )}
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-slate-900 dark:text-slate-50 font-bold">
                      Send Draft Reminders?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-500 dark:text-slate-400">
                      This will queue reminder emails for all applicants with a
                      DRAFT or PAYMENT_PENDING status. Are you sure?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleSendReminders}
                      className="bg-blue-600 hover:bg-blue-700 text-white border-0"
                    >
                      Yes, Send Emails
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </motion.section>
      )}

      <motion.section variants={itemVariants}>
        <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Latest Applications
          </h2>
          <Link
            href="/admin/recruitment/applications"
            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 tracking-widest font-bold transition-colors flex items-center gap-1 group"
          >
            View All{" "}
            <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          {loadingApps ? (
            <div className="p-12 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 uppercase tracking-widest text-sm gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-500" />
              <span>Loading Recent Applications...</span>
            </div>
          ) : recentApps.length === 0 ? (
            <div className="p-12 text-center text-slate-400  tracking-widest text-xs">
              No recent applications found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="hidden md:table w-full text-left whitespace-nowrap">
                <thead className="bg-slate-50 dark:bg-[#020617] text-slate-400 dark:text-slate-500 text-[10px] font-bold  tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4 font-normal">Applicant Name</th>
                    <th className="px-6 py-4 font-normal">Department</th>
                    <th className="px-6 py-4 font-normal">Status</th>
                    <th className="px-6 py-4 font-normal">Payment</th>
                    <th className="px-6 py-4 font-normal text-right">
                      Applied At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-slate-900 dark:text-slate-200">
                  {recentApps.map((app) => (
                    <tr
                      key={app._id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="font-mono text-sm text-slate-800 dark:text-slate-200">
                          {app.userId?.userName || "Unknown"}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 tracking-widest  mt-1">
                          {app.userId?.email || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-5 font-mono text-xs text-slate-900/70 dark:text-slate-300">
                        {app.preferredDepartmentId?.name || "N/A"}
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`px-2 py-1 rounded text-[10px] font-bold tracking-widest ${app.status === "ACTIVE" ? "bg-green-500/10 text-green-500 dark:text-green-400" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`font-mono text-xs font-bold ${app.paymentStatus === "SUCCESS" ? "text-green-500 dark:text-green-400" : "text-yellow-500 dark:text-yellow-400"}`}
                        >
                          {app.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right font-mono text-xs text-slate-400 dark:text-slate-500">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="md:hidden flex flex-col divide-y divide-slate-100 dark:divide-slate-800/50">
                {recentApps.map((app) => (
                  <div key={app._id} className="p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200 tracking-wide text-sm truncate">
                          {app.userId?.userName || "Unknown"}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                          {app.userId?.email || "N/A"}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 mt-0.5">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">
                        Dept:
                      </span>
                      <span className="font-mono text-xs text-slate-900/70 dark:text-slate-300 truncate">
                        {app.preferredDepartmentId?.name || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-50 dark:border-slate-800/50">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">
                          Status:
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-widest ${app.status === "ACTIVE" ? "bg-green-500/10 text-green-500 dark:text-green-400" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}
                        >
                          {app.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">
                          Payment:
                        </span>
                        <span
                          className={`text-[10px] font-bold tracking-widest uppercase ${app.paymentStatus === "SUCCESS" ? "text-green-500 dark:text-green-400" : "text-yellow-500 dark:text-yellow-400"}`}
                        >
                          {app.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.section>
    </motion.div>
  );
}
