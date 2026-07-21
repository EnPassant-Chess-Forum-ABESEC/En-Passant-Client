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

  if (loading) return <div className="p-8 text-center text-white/40 uppercase">Loading...</div>;

  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-sm overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-[#222] text-white/50 text-xs uppercase tracking-widest">
          <tr>
            <th className="p-4 font-normal">Payment ID</th>
            <th className="p-4 font-normal">Application ID</th>
            <th className="p-4 font-normal">Amount</th>
            <th className="p-4 font-normal">Status</th>
            <th className="p-4 font-normal">Created At</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-white">
          {payments.length === 0 ? (
            <tr><td colSpan="5" className="p-8 text-center text-white/40 uppercase">No payments found</td></tr>
          ) : (
            payments.map((payment) => (
              <tr key={payment._id} className="hover:bg-white/5 transition">
                <td className="p-4 font-mono text-xs text-white/50">{payment.razorpayPaymentId || payment._id}</td>
                <td className="p-4 font-mono text-xs">{payment.applicationId}</td>
                <td className="p-4 font-mono">₹{payment.amount / 100}</td>
                <td className={`p-4 text-xs font-mono font-bold ${payment.status === 'SUCCESS' ? 'text-green-400' : payment.status === 'FAILED' ? 'text-red-400' : 'text-yellow-400'}`}>
                  {payment.status}
                </td>
                <td className="p-4 text-sm text-white/50">
                  {new Date(payment.createdAt).toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
