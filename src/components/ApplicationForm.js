"use client";

import { useState } from "react";
import { CheckCircle2, ChevronRight, Loader2, ArrowRight } from "lucide-react";

const DEPARTMENTS = [
  { id: "dept_content", name: "Content Creation" },
  { id: "dept_social", name: "Social Media" },
  { id: "dept_events", name: "Events & Tournaments" },
  { id: "dept_design", name: "Design" },
  { id: "dept_photography", name: "Photography" },
  { id: "dept_web", name: "Web Development" },
  { id: "dept_strategy", name: "Strategy & Coaching" },
  { id: "dept_finance", name: "Finance" },
];

export default function ApplicationForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    branch: "",
    year: "1",
    chessComUsername: "",
    lichessUsername: "",
    preferredDepartment: "",
    secondaryDepartment: "",
  });

  const handleNext = async (e) => {
    e.preventDefault();
    if (step === 1) {
      // Simulate JIT account creation API call
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setLoading(false);
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    // Simulate Razorpay checkout creation
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    alert("Checkout flow would open here! Application created.");
  };

  return (
    <div className="w-full max-w-xl mx-auto font-sans flex flex-col h-full justify-center min-h-screen py-20">
      
      {/* ── Progress Indicator ── */}
      <div className="flex items-center gap-3 mb-12">
        <div className={`h-1 flex-1 rounded-full ${step >= 1 ? "bg-[#9b1a1a]" : "bg-white/10"}`} />
        <div className={`h-1 flex-1 rounded-full ${step >= 2 ? "bg-[#9b1a1a]" : "bg-white/10"}`} />
        <div className={`h-1 flex-1 rounded-full ${step >= 3 ? "bg-[#9b1a1a]" : "bg-white/10"}`} />
      </div>

      <div className="bg-[#0c0c0c] border border-white/5 p-8 md:p-12 rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Subtle glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#9b1a1a]/50 to-transparent" />
        
        {/* ── STEP 1: Personal Details ── */}
        {step === 1 && (
          <form onSubmit={handleNext} className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Your Details</h2>
              <p className="text-[#888] text-sm">Enter your academic and chess profile information.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold text-[#555] tracking-widest">Full Name</label>
                <input
                  required
                  type="text"
                  className="bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#9b1a1a] transition-colors"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold text-[#555] tracking-widest">College Email</label>
                <input
                  required
                  type="email"
                  className="bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#9b1a1a] transition-colors"
                  placeholder="john@college.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold text-[#555] tracking-widest">Branch</label>
                <input
                  required
                  type="text"
                  className="bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#9b1a1a] transition-colors"
                  placeholder="e.g. CSE"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold text-[#555] tracking-widest">Year</label>
                <select
                  required
                  className="bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#9b1a1a] transition-colors appearance-none"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                >
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold text-[#555] tracking-widest">Chess.com Username</label>
                <input
                  type="text"
                  className="bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#9b1a1a] transition-colors"
                  placeholder="Optional"
                  value={formData.chessComUsername}
                  onChange={(e) => setFormData({ ...formData, chessComUsername: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold text-[#555] tracking-widest">Lichess Username</label>
                <input
                  type="text"
                  className="bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#9b1a1a] transition-colors"
                  placeholder="Optional"
                  value={formData.lichessUsername}
                  onChange={(e) => setFormData({ ...formData, lichessUsername: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full bg-[#9b1a1a] hover:bg-[#cc0000] text-white font-pezula font-semibold text-[14px] tracking-[0.12em] uppercase py-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(155,26,26,0.2)] hover:shadow-[0_0_30px_rgba(155,26,26,0.4)] disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>Continue <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        )}

        {/* ── STEP 2: Departments ── */}
        {step === 2 && (
          <form onSubmit={handleNext} className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Role Selection</h2>
              <p className="text-[#888] text-sm">Choose the departments you wish to apply for.</p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold text-[#9b1a1a] tracking-widest">Preferred Department *</label>
                <div className="relative">
                  <select
                    required
                    className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-[#9b1a1a] transition-colors appearance-none"
                    value={formData.preferredDepartment}
                    onChange={(e) => setFormData({ ...formData, preferredDepartment: e.target.value })}
                  >
                    <option value="" disabled>Select primary choice...</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={`pref-${d.id}`} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555] pointer-events-none rotate-90" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold text-[#555] tracking-widest">Secondary Department</label>
                <div className="relative">
                  <select
                    className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-[#9b1a1a] transition-colors appearance-none"
                    value={formData.secondaryDepartment}
                    onChange={(e) => setFormData({ ...formData, secondaryDepartment: e.target.value })}
                  >
                    <option value="">None (Optional)</option>
                    {DEPARTMENTS.filter(d => d.id !== formData.preferredDepartment).map((d) => (
                      <option key={`sec-${d.id}`} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555] pointer-events-none rotate-90" />
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 bg-transparent border border-white/10 hover:border-white/20 text-white font-pezula font-semibold text-[14px] tracking-[0.12em] uppercase py-4 rounded-lg transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-[2] bg-[#9b1a1a] hover:bg-[#cc0000] text-white font-pezula font-semibold text-[14px] tracking-[0.12em] uppercase py-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(155,26,26,0.2)]"
              >
                Review & Pay <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* ── STEP 3: Checkout ── */}
        {step === 3 && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-[#9b1a1a]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#9b1a1a]/20">
                <CheckCircle2 className="w-8 h-8 text-[#9b1a1a]" />
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Final Step</h2>
              <p className="text-[#888] text-sm">Review your application and proceed to payment.</p>
            </div>

            <div className="bg-[#111] rounded-xl p-6 border border-white/5">
              <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-widest border-b border-white/5 pb-2">Application Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#555]">Applicant</span>
                  <span className="text-white font-medium">{formData.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#555]">Preferred Dept</span>
                  <span className="text-white font-medium">{DEPARTMENTS.find(d => d.id === formData.preferredDepartment)?.name}</span>
                </div>
                {formData.secondaryDepartment && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#555]">Secondary Dept</span>
                    <span className="text-white font-medium">{DEPARTMENTS.find(d => d.id === formData.secondaryDepartment)?.name}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center border-t border-white/5 pt-4">
                <span className="text-white font-bold uppercase tracking-widest text-sm">Total Fee</span>
                <span className="text-2xl font-black text-white">₹50</span>
              </div>
            </div>

            <div className="flex gap-4 mt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={loading}
                className="flex-1 bg-transparent border border-white/10 hover:border-white/20 text-white font-bold uppercase tracking-widest text-sm py-4 rounded-lg transition-all disabled:opacity-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={loading}
                className="flex-[2] bg-white text-black hover:bg-gray-200 font-bold uppercase tracking-widest text-sm py-4 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Pay via Razorpay"}
              </button>
            </div>
            
            <p className="text-center text-[#444] text-xs mt-2">
              Secure payments powered by Razorpay.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
