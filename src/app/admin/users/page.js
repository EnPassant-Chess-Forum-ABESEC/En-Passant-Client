"use client";

import { useState } from "react";
import UsersTab from "@/components/admin/UsersTab";
import { useApi } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, RefreshCw } from "lucide-react";

export default function UsersPage() {
  const fetchApi = useApi();
  const [syncing, setSyncing] = useState(false);

  const handleSyncAll = async () => {
    setSyncing(true);
    try {
      const res = await fetchApi("/admin/users/sync-all", { method: "POST" });
      toast.success(res.message || "Sync triggered successfully!");
    } catch (err) {
      toast.error("Error: " + err.message);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <>
      <header className="mb-12 flex flex-col md:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-50 mb-2">
            Users
          </h1>
          <p className="text-slate-400 dark:text-slate-500 text-xs md:text-sm tracking-widest uppercase font-bold">
            View and manage registered platform users.
          </p>
        </div>

        <button
          onClick={handleSyncAll}
          disabled={syncing}
          className="shrink-0 self-start md:mt-2 flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-blue-600 hover:bg-slate-700 dark:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-full transition-all shadow-sm"
        >
          {syncing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5" />
              Manual Sync All Users
            </>
          )}
        </button>
      </header>
      
      <UsersTab />
    </>
  );
}
