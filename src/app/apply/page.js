"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function ApplyPage() {
  const fetchApi = useApi();
  const router = useRouter();
  const [application, setApplication] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [preferredId, setPreferredId] = useState("");
  const [secondaryId, setSecondaryId] = useState("");
  
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Try to load existing application
      const appData = await fetchApi("/recruitment/my-application").catch(() => null);
      if (appData?.success && appData.myApplication) {
        setApplication(appData.myApplication);
      }

      // Hack: fetch tasks to extract available departments since /admin/departments is protected
      // Ideally backend would have a public /departments route
      const tasksData = await fetchApi("/tasks?year=2026").catch(() => null);
      if (tasksData?.tasks) {
        const uniqueDepts = [];
        tasksData.tasks.forEach(t => {
          if (!uniqueDepts.find(d => d._id === t.departmentId._id)) {
            uniqueDepts.push(t.departmentId);
          }
        });
        setDepartments(uniqueDepts);
        if (uniqueDepts.length > 0) {
          setPreferredId(uniqueDepts[0]._id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
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
    }
  };

  const handlePay = async () => {
    try {
      // In a real flow, this redirects to Razorpay checkout / returns order ID
      const data = await fetchApi("/payments/checkout", { method: "POST" });
      if (data.success) {
        alert("Payment session created! Order ID: " + data.order.id);
        // Refresh app state
        loadData();
      }
    } catch (err) {
      alert("Error initiating payment: " + err.message);
    }
  };

  if (loading) {
    return <div className="p-8 mt-24">Loading application...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto w-full p-8 mt-24 font-sans bg-[#111] min-h-screen">
      <h1 className="text-3xl font-bold uppercase tracking-widest text-white mb-8 border-b border-white/10 pb-4">Club Recruitment</h1>

      {application ? (
        <div className="bg-[#1a1a1a] p-6 border border-white/10 rounded-sm">
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
              <button onClick={handlePay} className="bg-[#9b1a1a] text-white uppercase font-bold tracking-widest px-6 py-2 hover:bg-red-800 transition">
                Pay with Razorpay
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
        <div className="bg-[#1a1a1a] p-6 border border-white/10 rounded-sm">
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
