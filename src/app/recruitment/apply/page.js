"use client";
import { useState } from "react";
import Image from "next/image";
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

        {/* Right Column - Modern Shadcn Form */}
        <div className="flex-1 h-full flex items-center justify-center p-8">
          <Card className="w-full max-w-lg bg-black/50 backdrop-blur-2xl border-white/10 text-white shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-white/5 pb-6">
              <CardTitle className="text-3xl font-bold tracking-tight">{getStepTitle()}</CardTitle>
              <CardDescription className="text-gray-400 mt-2">{getStepDesc()}</CardDescription>
            </CardHeader>
            <CardContent className="h-[380px] p-6 flex flex-col justify-center">
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                    <Input id="name" className="bg-black/40 border-white/10 text-white h-12 focus-visible:ring-[#9b1a1a]" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="John Doe" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                    <Input id="email" type="email" className="bg-black/40 border-white/10 text-white h-12 focus-visible:ring-[#9b1a1a]" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                    <Input id="phone" type="tel" className="bg-black/40 border-white/10 text-white h-12 focus-visible:ring-[#9b1a1a]" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+1 (555) 000-0000" />
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="w-full h-full relative fade-in">
                  <OptionWheel 
                    items={PRIMARY_DEPARTMENTS} 
                    defaultSelected={formData.primaryDept} 
                    onChange={(index) => setFormData({...formData, primaryDept: index})} 
                    activeColor="#9b1a1a"
                    textColor="#555555"
                    fontSize={2.5}
                    spacing={1.8}
                  />
                </div>
              )}

              {currentStep === 2 && (
                <div className="w-full h-full relative fade-in">
                  <OptionWheel 
                    items={SECONDARY_DEPARTMENTS} 
                    defaultSelected={formData.secondaryDept} 
                    onChange={(index) => setFormData({...formData, secondaryDept: index})} 
                    activeColor="#9b1a1a"
                    textColor="#555555"
                    fontSize={2.5}
                    spacing={1.8}
                  />
                </div>
              )}

              {currentStep === 3 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 fade-in">
                  <div className="w-24 h-24 rounded-full bg-[#9b1a1a]/20 flex items-center justify-center mb-4">
                    <span className="text-4xl">💳</span>
                  </div>
                  <h3 className="text-2xl font-bold">Ready for Checkout</h3>
                  <p className="text-gray-400 max-w-sm">
                    You have successfully completed all form details. Please proceed to payment to confirm your application.
                  </p>
                  <Button className="w-full max-w-xs h-12 text-lg bg-[#9b1a1a] hover:bg-[#b91c1c] text-white rounded-full transition-all mt-4">
                    Pay Now
                  </Button>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between border-t border-white/10 p-6 bg-black/20">
              <Button 
                variant="outline" 
                className={`h-11 px-8 rounded-full border-white/20 bg-transparent text-white hover:bg-white/10 transition-all ${currentStep === 0 ? 'invisible' : ''}`}
                onClick={handleBack}
              >
                Back
              </Button>
              {currentStep < 3 && (
                <Button 
                  className="h-11 px-8 rounded-full bg-[#9b1a1a] hover:bg-[#b91c1c] text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                  onClick={handleNext} 
                  disabled={!isStepValid(currentStep)}
                >
                  {currentStep === 2 ? 'Review & Pay' : 'Next Step'} 
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
