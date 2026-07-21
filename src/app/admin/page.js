"use client";

import { useState } from "react";
import ApplicationsTab from "@/components/admin/ApplicationsTab";
import UsersTab from "@/components/admin/UsersTab";
import DepartmentsTab from "@/components/admin/DepartmentsTab";
import TasksTab from "@/components/admin/TasksTab";
import PaymentsTab from "@/components/admin/PaymentsTab";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("applications");
  const [error, setError] = useState("");

  // In a real app we'd fetch user profile to check role before rendering,
  // or rely on middleware. Since backend returns 403 for unauthorized API calls,
  // the tabs will internally handle errors or we can catch it globally if we lift state.
  // For now, if a user is not admin, the API calls inside the tabs will fail.

  if (error && error.toLowerCase().includes("unauthorized")) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111]">
        <div className="text-center p-8 border border-red-900/30 bg-[#1a0505] rounded-sm">
          <h1 className="text-4xl font-black uppercase text-[#9b1a1a] tracking-widest mb-4">Access Denied</h1>
          <p className="text-red-500/70 tracking-wider text-sm uppercase">You do not have administrative privileges.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full p-8 mt-24 font-sans bg-[#111] min-h-screen">
      <h1 className="text-3xl font-bold uppercase tracking-widest text-white mb-8 border-b border-white/10 pb-4">Admin Dashboard</h1>

      <div className="flex gap-4 mb-8 border-b border-white/10 pb-4 overflow-x-auto">
        {["applications", "tasks", "departments", "users", "payments"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 uppercase font-bold tracking-widest text-sm transition border whitespace-nowrap ${activeTab === tab ? 'bg-[#9b1a1a] text-white border-transparent' : 'bg-transparent text-white/50 border-white/20 hover:text-white hover:border-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div>
        {activeTab === "applications" && <ApplicationsTab />}
        {activeTab === "tasks" && <TasksTab />}
        {activeTab === "departments" && <DepartmentsTab />}
        {activeTab === "users" && <UsersTab />}
        {activeTab === "payments" && <PaymentsTab />}
      </div>
    </div>
  );
}
