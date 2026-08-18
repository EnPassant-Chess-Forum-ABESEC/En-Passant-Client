"use client";

import PaymentsTab from "@/components/admin/PaymentsTab";
import { useAuth } from "@clerk/nextjs";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";

export default function PaymentsPage() {
  const { getToken } = useAuth();
  const [exporting, setExporting] = useState(false);

  const handleExportPayments = async () => {
    setExporting(true);
    try {
      const token = await getToken();
      const API_BASE =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

      const response = await fetch(`${API_BASE}/admin/payments/export`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to export payments");

      const data = await response.json();
      if (data.success) {
        alert(data.message || "Export successful");
      } else {
        alert(data.message || "Export failed");
      }
      setExporting(false);
    } catch (error) {
      console.error(error);
      alert("Error exporting payments: " + error.message);
      setExporting(false);
    }
  };

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

        <button
          onClick={handleExportPayments}
          disabled={exporting}
          className="shrink-0 self-start mt-2 flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-blue-600 hover:bg-slate-700 dark:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-full transition-all shadow-sm"
        >
          {exporting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              Export Payments
            </>
          )}
        </button>
      </header>

      <PaymentsTab />
    </>
  );
}
