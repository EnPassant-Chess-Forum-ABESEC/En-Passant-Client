"use client";
import { useState } from "react";
import Image from "next/image";
import { User, Mail, Phone, CreditCard } from "lucide-react";
import LineSidebar from "@/components/LineSidebar";
import OptionWheel from "@/components/OptionWheel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const PRIMARY_DEPARTMENTS = [
  "Not Selected",
  "Software Development",
  "Design / UI-UX",
  "Marketing & PR",
  "Event Management",
  "Content Writing",
  "Human Resources",
  "Finance & Sponsorship"
];

const SECONDARY_DEPARTMENTS = [
  "None (Skip)",
  "Software Development",
  "Design / UI-UX",
  "Marketing & PR",
  "Event Management",
  "Content Writing",
  "Human Resources",
  "Finance & Sponsorship"
];

export default function RecruitmentApplyPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    primaryDept: 0,
    secondaryDept: 0,
  });

  const isStepValid = (step) => {
    if (step === 0) {
      return formData.name.trim() !== "" && formData.email.trim() !== "" && formData.phone.trim() !== "";
    }
    if (step === 1) {
      return formData.primaryDept !== 0; // Must not be "Not Selected"
    }
    if (step === 2) {
      return true; // Secondary is completely optional
    }
    return true; // Payment step always valid as end state
  };

  const handleNext = () => {
    if (isStepValid(currentStep) && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSidebarClick = (index) => {
    // Validate all steps up to the requested index to prevent skipping constraints
    for (let i = 0; i < index; i++) {
      if (!isStepValid(i)) return; // Block jump if any previous step is invalid
    }
    setCurrentStep(index);
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 0: return "Applicant Details";
      case 1: return "Primary Department";
      case 2: return "Secondary Department";
      case 3: return "Checkout";
      default: return "";
    }
  };

  const getStepDesc = () => {
    switch (currentStep) {
      case 0: return "Please provide your basic contact information.";
      case 1: return "Select the main department you are applying for.";
      case 2: return "Select an optional secondary department. You can skip this.";
      case 3: return "Complete your registration payment to finalize.";
      default: return "";
    }
  };

  return (
    <main className="relative w-full h-screen flex overflow-hidden font-sans bg-black">
      {/* ── BACKGROUND LAYER (Gradiented Black) ── */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#151515] via-black to-[#0a0a0a]" />

      {/* ── FULL PAGE FOREGROUND IMAGE ── */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-70 mix-blend-screen">
        <Image
          src="/form_page_foreground.png"
          alt="Recruitment foreground"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* ── CONTENT CONTAINER ── */}
      <div className="relative z-30 w-full h-full flex flex-col md:flex-row">
        {/* Left Column - Sidebar hugging the queen */}
        <div className="hidden md:flex w-[35%] lg:w-[30%] h-full flex-col justify-center items-start pl-8">
          <LineSidebar
            items={["Details", "Primary Dept", "Secondary Dept", "Payment"]}
            activeItem={currentStep}
            onItemClick={handleSidebarClick}
            accentColor="#9b1a1a"
            textColor="#ffffff"
            markerColor="#444"
            markerLength={60}
            itemGap={30}
            fontSize={1.2}
          />
        </div>

        {/* Right Column - Clerk Aesthetic Form */}
        <div className="flex-1 h-full flex items-center justify-center p-6 md:p-12 relative z-20 pt-24 md:pt-12 overflow-y-auto">
          <div className="w-full max-w-[400px] bg-[#111111] border border-white/10 rounded-[20px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col my-auto" style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}>
            
            {/* Header */}
            <div className="px-8 pt-8 pb-4 relative overflow-hidden">
              <h2 className="text-[1.5rem] font-bold tracking-tight text-white mb-2" style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}>
                {getStepTitle()}
              </h2>
              <p className="text-[#a1a1aa] text-[14px] leading-relaxed">
                {getStepDesc()}
              </p>
            </div>

            {/* Content Area */}
            <div className="px-8 py-4 flex-1 flex flex-col justify-center relative min-h-[300px]">
              {currentStep === 0 && (
                <div className="space-y-4 fade-in w-full">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-[13px] font-semibold text-[#e4e4e7]">
                      Full name
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]">
                        <User className="w-[18px] h-[18px]" strokeWidth={2.5} />
                      </div>
                      <input 
                        id="name" 
                        type="text"
                        className="w-full bg-[#1c1c1c] border border-white/5 text-white rounded-lg h-10 pl-10 pr-3 text-[14px] focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all placeholder:text-[#52525b]" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-[13px] font-semibold text-[#e4e4e7]">
                      Email address
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]">
                        <Mail className="w-[18px] h-[18px]" strokeWidth={2.5} />
                      </div>
                      <input 
                        id="email" 
                        type="email"
                        className="w-full bg-[#1c1c1c] border border-white/5 text-white rounded-lg h-10 pl-10 pr-3 text-[14px] focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all placeholder:text-[#52525b]" 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="text-[13px] font-semibold text-[#e4e4e7]">
                      Phone number
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]">
                        <Phone className="w-[18px] h-[18px]" strokeWidth={2.5} />
                      </div>
                      <input 
                        id="phone" 
                        type="tel"
                        className="w-full bg-[#1c1c1c] border border-white/5 text-white rounded-lg h-10 pl-10 pr-3 text-[14px] focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all placeholder:text-[#52525b]" 
                        value={formData.phone} 
                        onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="w-full fade-in flex flex-col max-h-[300px]">
                  <div className="space-y-2 overflow-y-auto pr-1 custom-scrollbar">
                    {PRIMARY_DEPARTMENTS.map((dept, index) => {
                      if (index === 0) return null; // Skip "Not Selected"
                      const isSelected = formData.primaryDept === index;
                      return (
                        <button
                          key={index}
                          onClick={() => setFormData({...formData, primaryDept: index})}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all text-left ${
                            isSelected 
                              ? 'bg-[#e50914]/10 border-[#e50914]/50 text-white shadow-[0_0_15px_rgba(229,9,20,0.1)]' 
                              : 'bg-[#18181b] border-white/5 text-[#a1a1aa] hover:bg-[#27272a] hover:text-white'
                          }`}
                        >
                          <span className="text-[14px] font-medium">{dept}</span>
                          <div className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center transition-colors ${
                            isSelected ? 'border-[#e50914]' : 'border-[#52525b]'
                          }`}>
                            {isSelected && <div className="w-[10px] h-[10px] rounded-full bg-[#e50914]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="w-full fade-in flex flex-col max-h-[300px]">
                  <div className="space-y-2 overflow-y-auto pr-1 custom-scrollbar">
                    {SECONDARY_DEPARTMENTS.map((dept, index) => {
                      const isSelected = formData.secondaryDept === index;
                      const isNone = index === 0;
                      return (
                        <button
                          key={index}
                          onClick={() => setFormData({...formData, secondaryDept: index})}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all text-left ${
                            isSelected 
                              ? 'bg-[#e50914]/10 border-[#e50914]/50 text-white shadow-[0_0_15px_rgba(229,9,20,0.1)]' 
                              : 'bg-[#18181b] border-white/5 text-[#a1a1aa] hover:bg-[#27272a] hover:text-white'
                          }`}
                        >
                          <span className={`text-[14px] ${isNone ? 'italic opacity-70' : 'font-medium'}`}>{dept}</span>
                          <div className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center transition-colors ${
                            isSelected ? 'border-[#e50914]' : 'border-[#52525b]'
                          }`}>
                            {isSelected && <div className="w-[10px] h-[10px] rounded-full bg-[#e50914]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 fade-in">
                  <div className="w-20 h-20 rounded-full bg-[#e50914]/10 border border-[#e50914]/20 flex items-center justify-center mb-2">
                    <span className="text-3xl">💳</span>
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Ready for checkout</h3>
                  <p className="text-[#a1a1aa] max-w-[280px] text-[15px] leading-relaxed">
                    You have successfully completed all details. Proceed to payment to confirm.
                  </p>
                  <button className="h-11 w-full max-w-[280px] rounded-lg bg-[#e50914] hover:bg-[#b9090b] text-white font-bold text-[15px] transition-all mt-4 flex justify-center items-center gap-2">
                    Pay Now <span className="text-[10px]">▶</span>
                  </button>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="px-8 pb-8 pt-2 flex flex-col justify-end">
              {currentStep < 3 && (
                <button 
                  className="h-11 w-full rounded-lg bg-[#e50914] hover:bg-[#b9090b] text-white font-bold text-[15px] transition-all disabled:opacity-50 disabled:hover:bg-[#e50914] flex items-center justify-center gap-2 group" 
                  onClick={handleNext} 
                  disabled={!isStepValid(currentStep)}
                >
                  {currentStep === 2 ? 'Review & Pay' : 'Continue'}
                  <span className="text-[10px] group-hover:translate-x-0.5 transition-transform">▶</span>
                </button>
              )}

              {currentStep > 0 && (
                <div className="w-full text-center mt-4 fade-in">
                  <button 
                    className="text-[13px] font-medium text-[#a1a1aa] hover:text-white transition-colors"
                    onClick={handleBack}
                  >
                    Go back
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
