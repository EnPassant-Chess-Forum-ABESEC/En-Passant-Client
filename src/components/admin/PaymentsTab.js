import { useState, useEffect, useMemo } from "react";
import { useApi } from "@/lib/api";
import { ExternalLink, Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AdminSearchBar from "./AdminSearchBar";
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
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function PaymentsTab() {
  const fetchApi = useApi();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredPayments = useMemo(() => {
    let result = [...payments];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.applicationId?.toLowerCase().includes(q) ||
          (p.userId?.userName || "").toLowerCase().includes(q) ||
          (p.userId?.email || "").toLowerCase().includes(q),
      );
    }
    if (statusFilter !== "ALL") {
      result = result.filter((p) => p.status === statusFilter);
    }
    return result;
  }, [payments, searchQuery, statusFilter]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const res = await fetchApi("/admin/payments?pageSize=1000");
      setPayments(res.payments || []);
    } catch (err) {
      alert("Error: " + err.message);
    }
    setLoading(false);
  }

  const [confirmAction, setConfirmAction] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleVerify = (paymentId, status) => {
    setConfirmAction({ id: paymentId, status });
  };

  const executeVerify = async () => {
    if (!confirmAction) return;

    if (confirmAction.status === "FAILED" && !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason.");
      return;
    }

    const { id: paymentId, status } = confirmAction;
    setVerifyingId(paymentId);
    setConfirmAction(null);

    try {
      await fetchApi(`/admin/payments/${paymentId}/verify`, {
        method: "PATCH",
        body: { status, reason: rejectionReason.trim() },
      });
      toast.success(`Payment marked as ${status}`);
      loadData();
    } catch (err) {
      toast.error("Error: " + err.message);
    }
    setVerifyingId(null);
    setRejectionReason("");
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading && payments.length === 0)
    return (
      <div className="p-12 text-center text-slate-500 dark:text-slate-400 uppercase tracking-widest text-sm">
        Loading Data...
      </div>
    );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <AdminSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          statusOptions={[
            { label: "Pending", value: "PENDING" },
            { label: "Success", value: "SUCCESS" },
            { label: "Failed", value: "FAILED" },
          ]}
        />
      </motion.div>
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-colors"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-[#020617] text-slate-500 dark:text-slate-400 text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-4 font-normal">Applicant Name</th>
                <th className="px-4 py-4 font-normal">App ID</th>
                <th className="px-6 py-4 font-normal">Amount</th>
                <th className="px-6 py-4 font-normal">ScreenShot & UTR</th>
                <th className="px-6 py-4 font-normal">Status</th>
                <th className="px-6 py-4 font-normal">Created At</th>
                <th className="px-6 py-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <motion.tbody
              variants={containerVariants}
              className="divide-y divide-slate-100 dark:divide-slate-800/50 text-slate-800 dark:text-slate-200"
            >
              {filteredPayments.length === 0 ? (
                <motion.tr variants={itemVariants}>
                  <td
                    colSpan="7"
                    className="p-12 text-center text-slate-500 dark:text-slate-400 uppercase tracking-widest text-xs"
                  >
                    No payments found
                  </td>
                </motion.tr>
              ) : (
                filteredPayments.map((payment) => (
                  <motion.tr
                    variants={itemVariants}
                    key={payment._id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    <td className="px-4 py-5 font-mono text-sm text-slate-800/90 dark:text-slate-200">
                      {payment.userId?.userName || "Unknown User"}
                      {payment.userId?.email && (
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                          {payment.userId.email}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-5">
                      {payment.applicationId ? (
                        <button
                          onClick={() => handleCopy(payment.applicationId)}
                          className="font-mono text-xs text-slate-600 dark:text-slate-400 tracking-wider hover:text-slate-800 dark:hover:text-slate-200 transition-colors flex items-center gap-2"
                          title="Click to copy Application ID"
                        >
                          {`${payment.applicationId.substring(0, 6)}...${payment.applicationId.substring(payment.applicationId.length - 4)}`}
                          {copiedId === payment.applicationId && (
                            <span className="text-[10px] text-green-500 dark:text-green-400 font-sans tracking-widest uppercase">
                              Copied!
                            </span>
                          )}
                        </button>
                      ) : (
                        <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
                          N/A
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 font-mono font-bold tracking-wide text-slate-800 dark:text-slate-50">
                      {payment.amount / 100}
                    </td>
                    <td className="px-6 py-5">
                      {payment.paymentScreenshotUrl ? (
                        <div className="flex flex-col gap-1">
                          <a
                            href={payment.paymentScreenshotUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-[#ff3333] dark:hover:text-[#ff4444] transition-colors text-xs font-bold uppercase tracking-widest"
                          >
                            View Screenshot <ExternalLink className="w-3 h-3" />
                          </a>
                          {payment.utr && (
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                              UTR: {payment.utr}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                          No Receipt
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                          payment.status === "SUCCESS"
                            ? "bg-green-500/10 text-green-500 dark:text-green-400 border-green-500/20"
                            : payment.status === "FAILED"
                              ? "bg-red-500/10 text-red-500 dark:text-red-400 border-red-500/20"
                              : "bg-yellow-500/10 text-yellow-500 dark:text-yellow-400 border-yellow-500/20"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-500 dark:text-slate-400 tracking-wide">
                      {new Date(payment.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-5 text-right">
                      {payment.status === "PENDING" && (
                        <div className="flex items-center justify-end gap-2">
                          {verifyingId === payment._id ? (
                            <div className="p-2 text-slate-400 flex justify-center items-center">
                              <Loader2 className="w-4 h-4 animate-spin" />
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={() =>
                                  handleVerify(payment._id, "SUCCESS")
                                }
                                disabled={verifyingId === payment._id}
                                className="p-2 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 transition-colors disabled:opacity-50"
                                title="Approve Payment"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleVerify(payment._id, "FAILED")
                                }
                                disabled={verifyingId === payment._id}
                                className="p-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                                title="Reject Payment"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </motion.tbody>
          </table>
        </div>
      </motion.div>

      <AlertDialog
        open={!!confirmAction}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmAction(null);
            setRejectionReason("");
          }
        }}
      >
        <AlertDialogContent className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900 dark:text-slate-50 font-bold">
              Confirm Action
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 dark:text-slate-400 space-y-4">
              <p>
                Are you sure you want to mark this payment as{" "}
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {confirmAction?.status}
                </span>
                ? This action cannot be easily undone.
              </p>
              {confirmAction?.status === "FAILED" && (
                <div className="space-y-2 mt-4 text-left">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Rejection Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="E.g., Screenshot is blurry, UTR does not match..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none h-24 text-slate-900 dark:text-white"
                  />
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={executeVerify}
              className={`text-white ${
                confirmAction?.status === "SUCCESS"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
