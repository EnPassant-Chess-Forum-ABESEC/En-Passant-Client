"use client";

import UsersTab from "@/components/admin/UsersTab";

export default function UsersPage() {
  return (
    <>
      <header className="mb-12">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-50 mb-2">
          Users
        </h1>
        <p className="text-slate-400 dark:text-slate-500 text-xs md:text-sm tracking-widest">
          View and manage registered platform users.
        </p>
      </header>
      
      <UsersTab />
    </>
  );
}
