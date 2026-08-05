import { useState, useEffect } from "react";
import { useApi } from "@/lib/api";
import { ExternalLink, Check, X } from "lucide-react";

export default function PaymentsTab() {
  const fetchApi = useApi();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchApi("/admin/payments");
      setPayments(res.payments || []);
    } catch (err) {
      alert("Error: " + err.message);
    }
    setLoading(false);
  };

  const handleVerify = async (paymentId, status) => {
    if (!window.confirm(`Are you sure you want to mark this payment as ${status}?`)) return;
    
    setVerifyingId(paymentId);
    try {
      await fetchApi(`/admin/payments/${paymentId}/verify`, {
        method: "PATCH",
        body: { status }
      });
      alert(`Payment marked as ${status}`);
      loadData();
    } catch (err) {
      alert("Error: " + err.message);
    }
    setVerifyingId(null);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading && payments.length === 0) return <div className="p-12 text-center text-white/40 uppercase tracking-widest text-sm">Loading Data...</div>;

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-[#050505] text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-white/5">
            <tr>
              <th className="px-4 py-4 font-normal">Applicant Name</th>
              <th className="px-4 py-4 font-normal">App ID</th>
              <th className="px-6 py-4 font-normal">Amount</th>
              <th className="px-6 py-4 font-normal">Receipt & UTR</th>
              <th className="px-6 py-4 font-normal">Status</th>
              <th className="px-6 py-4 font-normal">Created At</th>
              <th className="px-6 py-4 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-white">
            {payments.length === 0 ? (
              <tr><td colSpan="7" className="p-12 text-center text-white/40 uppercase tracking-widest text-xs">No payments found</td></tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment._id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-4 py-5 font-mono text-sm text-white/90">
                    {payment.userId?.userName || "Unknown User"}
                    {payment.userId?.collegeEmail && (
                      <div className="text-[10px] text-white/40 uppercase tracking-widest mt-1">
                        {payment.userId.collegeEmail}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-5">
                    {payment.applicationId ? (
                      <button 
                        onClick={() => handleCopy(payment.applicationId)}
                        className="font-mono text-xs text-white/70 tracking-wider hover:text-white transition-colors flex items-center gap-2"
                        title="Click to copy Application ID"
                      >
                        {`${payment.applicationId.substring(0, 6)}...${payment.applicationId.substring(payment.applicationId.length - 4)}`}
                        {copiedId === payment.applicationId && <span className="text-[10px] text-green-400 font-sans tracking-widest uppercase">Copied!</span>}
                      </button>
                    ) : (
                      <span className="font-mono text-xs text-white/30">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-5 font-mono font-bold tracking-wide text-white">₹{payment.amount / 100}</td>
                  <td className="px-6 py-5">
                    {payment.paymentScreenshotUrl ? (
                      <div className="flex flex-col gap-1">
                        <a 
                          href={payment.paymentScreenshotUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[#9b1a1a] hover:text-[#ff3333] transition-colors text-xs font-bold uppercase tracking-widest"
                        >
                          View Receipt <ExternalLink className="w-3 h-3" />
                        </a>
                        {payment.utr && <span className="text-[10px] text-white/50 font-mono">UTR: {payment.utr}</span>}
                      </div>
                    ) : (
                      <span className="text-[10px] text-white/30 uppercase tracking-widest">No Receipt</span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                      payment.status === 'SUCCESS' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : payment.status === 'FAILED' 
                          ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-white/50 tracking-wide">
                    {new Date(payment.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-5 text-right">
                    {payment.status === "PENDING" && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleVerify(payment._id, "SUCCESS")}
                          disabled={verifyingId === payment._id}
                          className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors disabled:opacity-50"
                          title="Approve Payment"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleVerify(payment._id, "FAILED")}
                          disabled={verifyingId === payment._id}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                          title="Reject Payment"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
