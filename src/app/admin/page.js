"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/lib/api";
import {
  FileText,
  CheckSquare,
  Users,
  CreditCard,
  Download,
  ChevronRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

export default function AdminDashboard() {
  const fetchApi = useApi();
  const { getToken } = useAuth();
  const [exportingId, setExportingId] = useState(null);

  const createExportHandler = (id, endpoint, filename) => async () => {
    setExportingId(id);
    try {
      const token = await getToken();
      const API_BASE =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Keep spinner until the browser save dialog is dismissed (window regains focus)
      const reset = () => {
        window.URL.revokeObjectURL(url);
        setExportingId(null);
      };
      window.addEventListener("focus", reset, { once: true });
      // Safety fallback: reset after 60s if focus never fires
      const fallback = setTimeout(() => {
        window.removeEventListener("focus", reset);
        reset();
      }, 60000);
      // Clean up fallback if focus fires first
      window.addEventListener("focus", () => clearTimeout(fallback), {
        once: true,
      });
    } catch (error) {
      console.error(error);
      alert("Error exporting: " + error.message);
      setExportingId(null);
    }
  };

  const [stats, setStats] = useState({
    totalApplications: "...",
    activeTasks: "...",
    totalMembers: "...",
    totalRevenue: "...",
  });

  const [recentApps, setRecentApps] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsRes, appsRes] = await Promise.all([
          fetchApi("/admin/stats"),
          fetchApi("/admin/applications?limit=5"),
        ]);

        if (statsRes?.stats) {
          setStats({
            totalApplications: statsRes.stats.totalApplications || 0,
            activeTasks: statsRes.stats.activeTasks || 0,
            totalMembers: statsRes.stats.totalMembers || 0,
            totalRevenue: `₹${((statsRes.stats.totalRevenue || 0) / 100).toLocaleString("en-IN")}`,
          });
        }

        if (appsRes?.applications) {
          // Slice the first 5 just in case the backend didn't respect the limit query
          setRecentApps(appsRes.applications.slice(0, 5));
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
    <>
      {/* Header */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black  tracking-tight text-slate-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-400 text-xs md:text-sm  tracking-widest">
            Manage operations, members, and content seamlessly.
          </p>
        </div>
      </header>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
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
              className="bg-white border border-slate-200 p-8 rounded-3xl relative overflow-hidden group shadow-xl transition-all duration-500 hover:shadow-blue-500/10 hover:-translate-y-1"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                  <Icon className="w-5 h-5 text-slate-500 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight">
                {stat.value}
              </h3>
              <p className="text-[10px] text-slate-400 tracking-wider">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Export Sheets Section */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            Export Sheets
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              id: "applications",
              title: "Recruitment Applications",
              description:
                "Download a spreadsheet of all submitted applications.",
              icon: FileText,
              onClick: createExportHandler(
                "applications",
                "/admin/applications/export",
                "applications_export",
              ),
            },
            {
              id: "payments",
              title: "Recruitment Payments",
              description: "Export the full payment log with UTR and statuses.",
              icon: CreditCard,
              onClick: createExportHandler(
                "payments",
                "/admin/payments/export",
                "payments_export",
              ),
            },
          ].map((doc) => {
            const DocIcon = doc.icon;
            const isLoading = exportingId === doc.id;
            return (
              <div
                key={doc.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col hover:border-blue-300 hover:shadow-lg transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mb-4 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
                  <DocIcon className="w-4 h-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1 tracking-tight">
                  {doc.title}
                </h3>
                <p className="text-xs text-slate-500 mb-6 flex-1 leading-relaxed">
                  {doc.description}
                </p>
                <button
                  onClick={doc.onClick}
                  disabled={isLoading}
                  className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-2 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" /> Generate Report
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Applications Table */}
      <section>
        <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
          <h2 className="text-lg font-bold tracking-tight text-slate-900 ">
            Latest Applications
          </h2>
          <Link
            href="/admin/recruitment/applications"
            className="text-xs text-blue-600 hover:text-blue-800 tracking-widest font-bold transition-colors flex items-center gap-1 group"
          >
            View All{" "}
            <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {loadingApps ? (
            <div className="p-12 text-center text-slate-400  tracking-widest text-xs">
              Loading Recent Applications...
            </div>
          ) : recentApps.length === 0 ? (
            <div className="p-12 text-center text-slate-400  tracking-widest text-xs">
              No recent applications found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold  tracking-wider border-b border-slate-200">
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
                <tbody className="divide-y divide-white/5 text-slate-900">
                  {recentApps.map((app) => (
                    <tr
                      key={app._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="font-mono text-sm text-slate-800">
                          {app.userId?.userName || "Unknown"}
                        </div>
                        <div className="text-[10px] text-slate-400 tracking-widest  mt-1">
                          {app.userId?.email || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-5 font-mono text-xs text-slate-900/70">
                        {app.preferredDepartmentId?.name || "N/A"}
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`px-2 py-1 rounded text-[10px] font-bold tracking-widest ${app.status === "ACTIVE" ? "bg-green-500/10 text-green-400" : "bg-slate-100 text-slate-600"}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`font-mono text-xs font-bold ${app.paymentStatus === "SUCCESS" ? "text-green-400" : "text-yellow-400"}`}
                        >
                          {app.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right font-mono text-xs text-slate-400">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
