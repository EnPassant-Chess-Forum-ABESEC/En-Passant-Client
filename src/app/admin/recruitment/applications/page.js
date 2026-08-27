"use client";

import { useState } from "react";
import ApplicationsTab from "@/components/admin/ApplicationsTab";
import KanbanTab from "@/components/admin/KanbanTab";

export default function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState("list");

  return (
    <>
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-50 mb-2">
            Recruitment
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm uppercase tracking-widest font-bold">
            Applications & Submissions
          </p>
        </div>
        <div className="inline-flex w-fit bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("list")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === "list"
                ? "bg-white dark:bg-[#0F172A] text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setActiveTab("pipeline")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === "pipeline"
                ? "bg-white dark:bg-[#0F172A] text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            Review View
          </button>
        </div>
      </header>

      {activeTab === "list" ? (
        <ApplicationsTab onSwitchToPipeline={() => setActiveTab("pipeline")} />
      ) : (
        <KanbanTab />
      )}
    </>
  );
}
