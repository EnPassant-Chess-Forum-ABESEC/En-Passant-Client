import { useState, useEffect } from "react";
import { useApi } from "@/lib/api";

export default function PaymentsTab() {
  const fetchApi = useApi();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="p-12 text-center text-white/40 uppercase tracking-widest text-sm">Loading Data...</div>;

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-[#050505] text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-white/5">
            <tr>
              <th className="px-6 py-4 font-normal">Payment ID</th>
              <th className="px-6 py-4 font-normal">Application ID</th>
              <th className="px-6 py-4 font-normal">Amount</th>
              <th className="px-6 py-4 font-normal">Status</th>
              <th className="px-6 py-4 font-normal">Created At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-white">
            {payments.length === 0 ? (
              <tr><td colSpan="5" className="p-12 text-center text-white/40 uppercase tracking-widest text-xs">No payments found</td></tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment._id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-5 font-mono text-sm text-white/40">{payment.razorpayPaymentId || payment._id}</td>
                  <td className="px-6 py-5 font-mono text-xs text-white/70 tracking-wider">{payment.applicationId}</td>
                  <td className="px-6 py-5 font-mono font-bold tracking-wide text-white">₹{payment.amount / 100}</td>
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
