"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function EventPaymentsPage() {
  return (
    <>
      <header className="mb-12 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-50 mb-2">
            Event Registrations
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm uppercase tracking-widest font-bold">
            Free Entry · No Payments Required
          </p>
        </div>
      </header>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 max-w-xl text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Events are 100% Free
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Tournament events have no registration fee and require no manual payment verification. All player registrations are automatically confirmed upon submission.
        </p>
        <div className="pt-2">
          <Link
            href="/admin/events"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-medium text-sm hover:opacity-90 transition-opacity"
          >
            <span>Manage Events & Registrations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </>
  );
}

