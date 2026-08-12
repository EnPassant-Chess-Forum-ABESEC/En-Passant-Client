"use client";

import DepartmentsTab from "@/components/admin/DepartmentsTab";

export default function DepartmentsPage() {
  return (
    <>
      <header className="mb-12">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-50 mb-2">
          Recruitment
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm uppercase tracking-widest font-bold">
          Departments
        </p>
      </header>
      
      <DepartmentsTab />
    </>
  );
}
