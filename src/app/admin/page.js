"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/lib/api";
import { 
  Menu, 
  FileText, 
  CheckSquare, 
  Building2, 
  Users, 
  CreditCard, 
  LogOut 
} from "lucide-react";
import ApplicationsTab from "@/components/admin/ApplicationsTab";
import UsersTab from "@/components/admin/UsersTab";
import DepartmentsTab from "@/components/admin/DepartmentsTab";
import TasksTab from "@/components/admin/TasksTab";
import PaymentsTab from "@/components/admin/PaymentsTab";
import { useClerk } from "@clerk/nextjs";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("applications");
  const [error, setError] = useState("");
  const { signOut } = useClerk();
  const fetchApi = useApi();
  const [stats, setStats] = useState({
    totalApplications: "...",
    activeTasks: "...",
    totalMembers: "...",
    totalRevenue: "..."
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetchApi("/admin/stats");
        if (res?.stats) {
          setStats({
            totalApplications: res.stats.totalApplications || 0,
            activeTasks: res.stats.activeTasks || 0,
            totalMembers: res.stats.totalMembers || 0,
            totalRevenue: `₹${((res.stats.totalRevenue || 0) / 100).toLocaleString('en-IN')}`
          });
        }
      } catch (err) {
        if (err.message.toLowerCase().includes("unauthorized") || err.message.includes("403")) {
          setError("unauthorized");
        }
        console.error("Failed to load stats:", err);
      }
    };
    loadStats();
  }, [fetchApi]);

  if (error && error.toLowerCase().includes("unauthorized")) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] font-sans">
        <div className="text-center p-8 border border-red-900/30 bg-[#1a0505] rounded-sm">
          <h1 className="text-4xl font-black uppercase text-[#9b1a1a] tracking-widest mb-4">Access Denied</h1>
          <p className="text-red-500/70 tracking-wider text-sm uppercase">You do not have administrative privileges.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "applications", icon: FileText, label: "Applications" },
    { id: "tasks", icon: CheckSquare, label: "Tasks" },
    { id: "departments", icon: Building2, label: "Departments" },
    { id: "users", icon: Users, label: "Users" },
    { id: "payments", icon: CreditCard, label: "Payments" },
  ];

  return (
    <div className="flex h-screen bg-[#050505] font-sans overflow-hidden">
      {/* ─── Sidebar Navigation (Expanded like Kariighar) ─── */}
      <aside className="w-[280px] flex-shrink-0 flex flex-col py-10 px-6 border-r border-white/5 bg-[#050505] z-10 relative">
        <div className="mb-14 px-4">
          <h2 className="text-2xl font-black tracking-[0.2em] uppercase text-white">EN PASSANT</h2>
          <p className="text-[10px] text-white/40 tracking-[0.3em] uppercase mt-2">Admin Portal</p>
        </div>

        <nav className="flex-1 flex flex-col gap-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 w-full text-left
                  ${isActive 
                    ? 'bg-[#1a0505] text-[#9b1a1a]' 
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="text-xs font-bold uppercase tracking-widest">{tab.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#9b1a1a] shadow-[0_0_8px_#9b1a1a]" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5">
          <button 
            onClick={() => signOut({ redirectUrl: "/" })}
            className="flex items-center gap-4 px-4 py-4 w-full text-left text-white/40 hover:text-[#9b1a1a] transition-colors rounded-2xl hover:bg-[#1a0505]"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ─── Main Content Area ─── */}
      <main className="flex-1 overflow-y-auto relative h-screen bg-[#030303]">
        {/* Background Texture (Optional subtle integration) */}
        <div 
          className="fixed inset-0 z-0 opacity-[0.08] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: 'url("/dark_marble_bg.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative z-10 px-10 py-16 md:px-16 md:py-20 lg:px-24 max-w-[1800px] mx-auto w-full min-h-full">
          {/* Header */}
          <header className="mb-16">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-[0.1em] text-white mb-4">
              Admin Dashboard
            </h1>
            <p className="text-white/40 text-xs md:text-sm uppercase tracking-widest">
              Manage operations, members, and content seamlessly.
            </p>
          </header>

          {/* Stats Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { label: "Total Applications", value: stats.totalApplications, icon: FileText },
              { label: "Active Tasks", value: stats.activeTasks, icon: CheckSquare },
              { label: "Total Members", value: stats.totalMembers, icon: Users },
              { label: "Revenue (INR)", value: stats.totalRevenue, icon: CreditCard },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-[#080808] border border-white/5 p-10 rounded-3xl relative overflow-hidden group shadow-2xl transition-all duration-500 hover:shadow-[#9b1a1a]/10 hover:-translate-y-1">
                  {/* Subtle red accent on hover */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#9b1a1a] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:bg-[#1a0505] transition-colors">
                      <Icon className="w-6 h-6 text-white/50 group-hover:text-[#9b1a1a] transition-colors" />
                    </div>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">{stat.value}</h3>
                  <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-[0.2em] font-bold">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Active Tab Content Area */}
          <section className="min-h-[500px]">
            {activeTab === "applications" && <ApplicationsTab />}
            {activeTab === "tasks" && <TasksTab />}
            {activeTab === "departments" && <DepartmentsTab />}
            {activeTab === "users" && <UsersTab />}
            {activeTab === "payments" && <PaymentsTab />}
          </section>
        </div>
      </main>
    </div>
  );
}
