"use client";

import PaymentsTab from "@/components/admin/PaymentsTab";

export default function PaymentsPage() {
  return (
    <>
      <header className="mb-12 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-50 mb-2">
            Payments
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm uppercase tracking-widest font-bold">
            Recruitment
          </p>
        </div>
      </header>

      <PaymentsTab />
    </>
  );
}
