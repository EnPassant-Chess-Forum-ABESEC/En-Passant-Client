"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/lib/api";
import { CheckCircle2, Loader2, MailOpen, Clock, Search } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function QueriesTab() {
  const fetchApi = useApi();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  async function loadQueries() {
    setLoading(true);
    try {
      const res = await fetchApi("/contact");
      setQueries(res.queries || []);
    } catch (err) {
      toast.error(err.message || "Failed to load queries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueries();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await fetchApi(`/contact/${id}/status`, {
        method: "PATCH",
        body: { status },
      });
      toast.success(`Query marked as ${status.toLowerCase()}`);

      setQueries(queries.map((q) => (q._id === id ? { ...q, status } : q)));
    } catch (err) {
      toast.error(err.message || "Failed to update query status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading && queries.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const filteredQueries = queries.filter((q) => {
    const term = searchTerm.toLowerCase();
    return (
      (q.email || "").toLowerCase().includes(term) ||
      (q.name || "").toLowerCase().includes(term) ||
      (q.subject || "").toLowerCase().includes(term)
    );
  });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-50 mb-2">
            User Queries
          </h1>
        </div>
        <div className="relative max-w-md w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col gap-4">
        {filteredQueries.length === 0 ? (
          <motion.div variants={itemVariants} className="p-8 text-center text-slate-500 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-3xl">
            No queries found.
          </motion.div>
        ) : (
          filteredQueries.map((query) => (
            <motion.div
              variants={itemVariants}
              key={query._id}
              className="p-6 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6"
            >
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                        {query.name}
                      </h3>
                      <a
                        href={`mailto:${query.email}`}
                        className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                      >
                        {query.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                      <Clock className="w-3 h-3" />
                      {format(new Date(query.createdAt), "MMM d, yyyy h:mm a")}
                    </div>
                  </div>

                  <div className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-xl text-slate-700 dark:text-slate-300 text-sm border border-slate-200 dark:border-slate-800/50">
                    {query.subject && (
                      <div className="font-semibold text-slate-900 dark:text-white mb-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                        Subject: {query.subject}
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">{query.message}</div>
                  </div>
                </div>

                <div className="md:w-48 flex flex-row md:flex-col items-center justify-end md:justify-center gap-3 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
                  {query.status === "UNREAD" && (
                    <button
                      onClick={() => handleUpdateStatus(query._id, "READ")}
                      disabled={updatingId === query._id}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors font-medium text-sm disabled:opacity-50"
                    >
                      {updatingId === query._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <MailOpen className="w-4 h-4" />
                      )}
                      Mark Read
                    </button>
                  )}
                  {query.status !== "RESOLVED" && (
                    <button
                      onClick={() => handleUpdateStatus(query._id, "RESOLVED")}
                      disabled={updatingId === query._id}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-500/20 transition-colors font-medium text-sm disabled:opacity-50"
                    >
                      {updatingId === query._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      Resolve
                    </button>
                  )}
                  {query.status === "RESOLVED" && (
                    <div className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg font-medium text-sm border border-slate-200 dark:border-slate-700">
                      <CheckCircle2 className="w-4 h-4" />
                      Resolved
                    </div>
                  )}
                </div>
              </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
}
