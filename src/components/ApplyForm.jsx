"use client";

import { useState } from "react";
import { useApi } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function ApplyForm({ initialApplication, initialDepartments }) {
  const fetchApi = useApi();
  const router = useRouter();
  
  const [application, setApplication] = useState(initialApplication);
  const [departments] = useState(initialDepartments || []);
  const [loading, setLoading] = useState(false);

  const [preferredId, setPreferredId] = useState(departments.length > 0 ? departments[0]._id : "");
  const [secondaryId, setSecondaryId] = useState("");
  const [paymentUtr, setPaymentUtr] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        preferredDepartmentId: preferredId,
        secondaryDepartmentId: secondaryId ? [secondaryId] : []
      };
      
      const data = await fetchApi("/recruitment/apply", {
        method: "POST",
        body: payload
      });

      if (data.success) {
        setApplication(data.newApplication);
      }
    } catch (err) {
      alert("Error applying: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    if (!paymentUtr.trim() || !paymentScreenshot) {
      alert("Please provide UTR and upload screenshot");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("utr", paymentUtr);
      formData.append("screenshot", paymentScreenshot);

      const data = await fetchApi("/payments/manual", { 
        method: "POST",
        body: formData,
      });

      if (data.success) {
        alert("Payment submitted successfully! It is pending verification.");
        // We can just update state locally or refresh
        setApplication(prev => ({ ...prev, paymentStatus: 'PENDING' }));
      } else {
        alert(data.message || "Payment submission failed");
      }
    } catch (err) {
      alert("Error submitting payment: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full p-8 mt-24 font-sans bg-[#111] min-h-screen">
      <h1 className="text-3xl font-bold uppercase tracking-widest text-white mb-8 border-b border-white/10 pb-4">Club Recruitment</h1>

      {application ? (
        <div className="bg-[#1a1a1a] p-6 border border-white/10 rounded-sm relative">
          {loading && <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center text-white/50 text-sm tracking-widest uppercase">Processing...</div>}
          
          <h2 className="text-xl font-bold uppercase text-[#9b1a1a] mb-4">Your Application</h2>
          
          <div className="space-y-4 text-white/80">
            <p>
              <span className="font-bold text-white/50 w-32 inline-block uppercase text-xs">Status:</span> 
              <span className="bg-white/10 px-2 py-1 text-xs font-mono">{application.status}</span>
            </p>
            <p>
              <span className="font-bold text-white/50 w-32 inline-block uppercase text-xs">Payment:</span> 
              <span className={`px-2 py-1 text-xs font-mono ${application.paymentStatus === 'SUCCESS' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                {application.paymentStatus}
              </span>
            </p>
            <p>
              <span className="font-bold text-white/50 w-32 inline-block uppercase text-xs">Preferred:</span> 
              {application.preferredDepartmentId?.name || application.preferredDepartmentId}
            </p>
          </div>

          {application.status === 'DRAFT' && application.paymentStatus === 'PENDING' && (
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-sm text-white/50 mb-4 uppercase tracking-wider">To proceed to the tasks, you must complete the registration fee.</p>
              <div className="space-y-4 max-w-sm mb-4">
                <div>
                  <label className="block text-sm text-white/60 uppercase mb-2 tracking-wider">Transaction ID (UTR)</label>
                  <input
                    type="text"
                    value={paymentUtr}
                    onChange={(e) => setPaymentUtr(e.target.value)}
                    className="w-full bg-[#222] border border-white/20 p-2 text-white focus:outline-none focus:border-[#9b1a1a]"
                    placeholder="Enter UTR"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 uppercase mb-2 tracking-wider">Payment Screenshot</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setPaymentScreenshot(e.target.files[0]);
                      }
                    }}
                    className="w-full bg-[#222] border border-white/20 p-2 text-white/70 file:mr-4 file:py-1 file:px-3 file:border-0 file:text-xs file:uppercase file:bg-[#9b1a1a] file:text-white"
                  />
                </div>
              </div>
              <button onClick={handlePay} className="bg-[#9b1a1a] text-white uppercase font-bold tracking-widest px-6 py-2 hover:bg-red-800 transition">
                Submit Payment
              </button>
            </div>
          )}

          {application.paymentStatus === 'SUCCESS' && (
            <div className="mt-8 pt-6 border-t border-white/10">
              <button onClick={() => router.push('/tasks')} className="bg-[#9b1a1a] text-white uppercase font-bold tracking-widest px-6 py-2 hover:bg-red-800 transition">
                Go to Tasks
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#1a1a1a] p-6 border border-white/10 rounded-sm relative">
          {loading && <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center text-white/50 text-sm tracking-widest uppercase">Applying...</div>}
          
          <h2 className="text-xl font-bold uppercase text-white mb-4">Start Application</h2>
          {departments.length === 0 ? (
            <p className="text-white/40">No departments found. Admin needs to create them and add tasks first.</p>
          ) : (
            <form onSubmit={handleApply} className="space-y-6 max-w-md">
              <div>
                <label className="block text-sm text-white/60 uppercase mb-2 tracking-wider">Preferred Department</label>
                <select 
                  value={preferredId} 
                  onChange={e => setPreferredId(e.target.value)}
                  className="w-full bg-[#222] border border-white/20 p-3 text-white focus:outline-none focus:border-[#9b1a1a]"
                  required
                >
                  {departments.map(d => (
                    <option key={d._id} value={d._id}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-white/60 uppercase mb-2 tracking-wider">Secondary Department (Optional)</label>
                <select 
                  value={secondaryId} 
                  onChange={e => setSecondaryId(e.target.value)}
                  className="w-full bg-[#222] border border-white/20 p-3 text-white focus:outline-none focus:border-[#9b1a1a]"
                >
                  <option value="">None</option>
                  {departments.filter(d => d._id !== preferredId).map(d => (
                    <option key={d._id} value={d._id}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="bg-[#9b1a1a] text-white uppercase font-bold tracking-widest px-8 py-3 hover:bg-red-800 transition w-full">
                Apply Now
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
