"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { User, Mail, Phone, ChevronLeft, ChevronRight, QrCode } from "lucide-react";
import LineSidebar from "@/components/LineSidebar";
import { useApi } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import SpecularButton from "@/components/SpecularButton";
import {
  useSignUp,
  useSignIn,
  useAuth,
  useUser,
  useClerk,
} from "@clerk/nextjs";

export default function RecruitmentApplyPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    primaryDept: null,
    secondaryDept: null,
  });

  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { user: clerkUser } = useUser();
  const clerk = useClerk();
  const { signUp } = useSignUp();
  const { signIn } = useSignIn();

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [authMode, setAuthMode] = useState("signUp"); // "signUp" | "signIn"
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentUtr, setPaymentUtr] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);

  const fetchApi = useApi();
  const [departments, setDepartments] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(true);

  // Sync application state if user is already signed in
  useEffect(() => {
    async function syncApplication() {
      if (!isSignedIn || !authLoaded) return;
      try {
        const res = await fetchApi("/recruitment/my-application");
        if (res?.myApplication) {
          const app = res.myApplication;
          if (
            app.status === "ACTIVE" ||
            app.status === "TASK_SUBMITTED" ||
            app.status === "SHORTLISTED" ||
            app.status === "UNDER_REVIEW" ||
            app.status === "INTERVIEW" ||
            app.status === "SELECTED" ||
            app.status === "REJECTED"
          ) {
            setToastMessage("Your application is already submitted! Redirecting...");
            setTimeout(() => {
              window.location.href = "/recruitment"; // Redirect fully processed
            }, 2500);
          } else if (
            app.status === "DRAFT" ||
            app.paymentStatus === "PENDING"
          ) {
            // Already created, jump to payment
            setFormData((prev) => ({
              ...prev,
              name: clerkUser?.fullName || prev.name,
              email: clerkUser?.primaryEmailAddress?.emailAddress || prev.email,
            }));
            setCurrentStep(3);
          }
        }
      } catch (err) {
        // No existing application found, ignore
      }
    }
    syncApplication();
  }, [isSignedIn, authLoaded, fetchApi, clerkUser]);

  useEffect(() => {
    async function loadDepts() {
      try {
        const data = await fetchApi("/tasks/all-departments").catch(() => null);
        if (data?.departments) {
          setDepartments(data.departments);
        }
      } catch (err) {
        console.error("Failed to load departments:", err);
      } finally {
        setLoadingDepts(false);
      }
    }
    loadDepts();
  }, [fetchApi]);

  const isStepValid = (step) => {
    if (step === 0) {
      return (
        formData.name.trim() !== "" &&
        formData.email.trim() !== "" &&
        formData.phone.trim() !== ""
      );
    }
    if (step === 1) {
      return formData.primaryDept !== null;
    }
    if (step === 2) {
      return true; // Secondary is completely optional
    }
    if (step === 3) {
      return paymentUtr.trim() !== "" && paymentScreenshot !== null;
    }
    return true;
  };

  const handleNext = async () => {
    if (!isStepValid(currentStep) || currentStep >= 3) return;

    if (currentStep === 0) {
      if (!isSignedIn) {
        if (!clerk?.client) {
          alert(
            "Authentication is still loading. Please wait a second and try again.",
          );
          return;
        }
        // Trigger Clerk Custom Auth Flow
        try {
          setIsSubmitting(true);
          try {
            // Use clerk.client.signUp — the raw SignUpResource, not the hook wrapper
            const rawSignUp = clerk.client.signUp;
            await rawSignUp.create({
              emailAddress: formData.email,
              firstName: formData.name.split(" ")[0] || formData.name,
              lastName: formData.name.split(" ").slice(1).join(" ") || "",
            });

            await rawSignUp.prepareEmailAddressVerification({
              strategy: "email_code",
            });

            setAuthMode("signUp");
            setShowOtpModal(true);
          } catch (signUpErr) {
            // If email exists, fallback to signIn
            if (signUpErr.errors?.[0]?.code === "form_identifier_exists") {
              // Create a sign-in attempt using the raw client
              const rawSignIn = clerk.client.signIn;
              await rawSignIn.create({
                identifier: formData.email,
              });
              const emailFactor = rawSignIn.supportedFirstFactors?.find(
                (f) =>
                  f.strategy === "email_code" &&
                  f.safeIdentifier === formData.email,
              );
              if (emailFactor) {
                await rawSignIn.prepareFirstFactor({
                  strategy: "email_code",
                  emailAddressId: emailFactor.emailAddressId,
                });
                setAuthMode("signIn");
                setShowOtpModal(true);
              } else {
                throw new Error(
                  "Passwordless email sign-in is not supported for this account.",
                );
              }
            } else {
              throw signUpErr;
            }
          }
        } catch (err) {
          console.error("Auth init failed", err);
          const msg =
            err.errors?.[0]?.longMessage ||
            err.errors?.[0]?.message ||
            err.message ||
            JSON.stringify(err);
          alert(
            `Authentication failed: ${msg}. If OTP is disabled in your Clerk Dashboard, you'll need to enable it or sign in manually.`,
          );
        } finally {
          setIsSubmitting(false);
        }
        return; // Pause UI here to show OTP modal
      } else {
        // User is already signed in
        setCurrentStep(1);
      }
    } else if (currentStep === 2) {
      try {
        setIsSubmitting(true);
        const body = {
          preferredDepartmentId: formData.primaryDept,
          secondaryDepartmentId: formData.secondaryDept
            ? [formData.secondaryDept]
            : [],
          secondaryDepartmentIds: formData.secondaryDept
            ? [formData.secondaryDept]
            : [],
        };

        await fetchApi("/recruitment/apply", {
          method: "POST",
          body: body,
        });
        setCurrentStep(3);
      } catch (err) {
        console.error("Failed to create application", err);
        // Proceeding to checkout anyway in case it was already created (e.g. DRAFT exists)
        setCurrentStep(3);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setIsVerifying(true);
      if (authMode === "signUp") {
        const verifyWrapper =
          await clerk.client.signUp.attemptEmailAddressVerification({
            code: otpCode,
          });
        if (verifyWrapper?.error) {
          throw verifyWrapper.error;
        }
        const completeSignUp = verifyWrapper?.result ?? verifyWrapper;
        if (completeSignUp.status === "complete") {
          await clerk.setActive({ session: completeSignUp.createdSessionId });
          setShowOtpModal(false);
          setCurrentStep(1);
        } else {
          alert(`Sign up status is: ${completeSignUp.status}`);
        }
      } else {
        const attemptWrapper = await clerk.client.signIn.attemptFirstFactor({
          strategy: "email_code",
          code: otpCode,
        });
        if (attemptWrapper?.error) {
          throw attemptWrapper.error;
        }
        const completeSignIn = attemptWrapper?.result ?? attemptWrapper;
        if (completeSignIn.status === "complete") {
          await clerk.setActive({ session: completeSignIn.createdSessionId });
          setShowOtpModal(false);
          setCurrentStep(1);
        } else {
          alert(`Sign in status is: ${completeSignIn.status}`);
        }
      }
    } catch (err) {
      console.error("OTP verification failed", err);
      alert(
        err.errors?.[0]?.longMessage ||
          err.errors?.[0]?.message ||
          err.message ||
          "Invalid OTP code.",
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSidebarClick = (index) => {
    // Only allow navigating back, or forward to already completed steps
    // To prevent skipping the API call, we do not allow jumping to Step 3 directly from sidebar
    if (index === 3 && currentStep < 2) return;
    for (let i = 0; i < index; i++) {
      if (!isStepValid(i)) return;
    }
    setCurrentStep(index);
  };

  const handlePayment = async () => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("utr", paymentUtr);
      formData.append("screenshot", paymentScreenshot);

      const res = await fetchApi("/payments/manual", {
        method: "POST",
        body: formData,
      });

      if (res.success) {
        alert("Payment submitted successfully! It is pending verification.");
        window.location.href = "/recruitment";
      } else {
        alert(res.message || "Failed to submit payment");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting payment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 0:
        return "Applicant Details";
      case 1:
        return "Primary Choice";
      case 2:
        return "Secondary Choice";
      case 3:
        return "Finalize";
      default:
        return "";
    }
  };

  const getStepDesc = () => {
    switch (currentStep) {
      case 0:
        return "Provide your contact information.";
      case 1:
        return "Select your main department of interest.";
      case 2:
        return "Select an optional secondary department.";
      case 3:
        return "Complete your registration payment.";
      default:
        return "";
    }
  };

  // Animation variants
  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <main className="relative w-full h-screen flex overflow-hidden font-sans bg-black">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className="absolute bottom-8 right-4 md:right-8 z-[100] px-6 py-3 bg-[#9b1a1a]/90 backdrop-blur-md border border-[#ff3333]/30 rounded-full shadow-[0_0_40px_rgba(155,26,26,0.5)] flex items-center gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <p className="text-white text-sm font-bold tracking-widest uppercase">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

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

        {/* Right Column - Premium Glassmorphism Form */}
        <div className="flex-1 h-full flex items-center justify-center p-6 md:p-12 relative z-20 pt-24 md:pt-12 overflow-y-auto">
          <div className="w-full max-w-[440px] bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8),inset_0_0_40px_rgba(255,255,255,0.02)] flex flex-col my-auto relative">
            {/* Subtle top glare */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="px-10 pt-10 pb-2 relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[#9b1a1a] font-black font-mono tracking-widest text-xs border border-[#9b1a1a]/30 bg-[#9b1a1a]/10 px-2 py-1 rounded-md">
                  STEP 0{currentStep + 1}
                </span>
                {currentStep > 0 && (
                  <button
                    onClick={handleBack}
                    className="text-white/40 hover:text-white transition-colors ml-auto p-1"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
              </div>
              <h2 className="text-[2rem] font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 mb-1 leading-none">
                {getStepTitle()}
              </h2>
              <p className="text-white/50 text-[14px] font-medium tracking-wide">
                {getStepDesc()}
              </p>
            </div>

            {/* Content Area */}
            <div className="px-10 py-6 flex-1 flex flex-col justify-center relative min-h-[360px] z-10">
              <AnimatePresence mode="wait">
                {currentStep === 0 && (
                  <motion.div
                    key="step0"
                    variants={slideVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-5 w-full"
                  >
                    <div className="space-y-1.5 group">
                      <label
                        htmlFor="name"
                        className="text-[11px] font-bold uppercase tracking-widest text-white/50 group-focus-within:text-[#9b1a1a]"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#9b1a1a]">
                          <User
                            className="w-[18px] h-[18px]"
                            strokeWidth={2.5}
                          />
                        </div>
                        <input
                          id="name"
                          type="text"
                          className="w-full bg-white/5 border border-white/10 text-white rounded-xl h-14 pl-12 pr-4 text-[15px] focus:outline-none focus:border-[#9b1a1a]/50 focus:ring-1 focus:ring-[#9b1a1a]/50 focus:bg-white/10 placeholder:text-white/20 font-medium"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="Magnus Carlsen"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5 group">
                      <label
                        htmlFor="email"
                        className="text-[11px] font-bold uppercase tracking-widest text-white/50 group-focus-within:text-[#9b1a1a]"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#9b1a1a]">
                          <Mail
                            className="w-[18px] h-[18px]"
                            strokeWidth={2.5}
                          />
                        </div>
                        <input
                          id="email"
                          type="email"
                          className="w-full bg-white/5 border border-white/10 text-white rounded-xl h-14 pl-12 pr-4 text-[15px] focus:outline-none focus:border-[#9b1a1a]/50 focus:ring-1 focus:ring-[#9b1a1a]/50 focus:bg-white/10 placeholder:text-white/20 font-medium"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="grandmaster@example.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5 group">
                      <label
                        htmlFor="phone"
                        className="text-[11px] font-bold uppercase tracking-widest text-white/50 group-focus-within:text-[#9b1a1a]"
                      >
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#9b1a1a]">
                          <Phone
                            className="w-[18px] h-[18px]"
                            strokeWidth={2.5}
                          />
                        </div>
                        <input
                          id="phone"
                          type="tel"
                          className="w-full bg-white/5 border border-white/10 text-white rounded-xl h-14 pl-12 pr-4 text-[15px] focus:outline-none focus:border-[#9b1a1a]/50 focus:ring-1 focus:ring-[#9b1a1a]/50 focus:bg-white/10 placeholder:text-white/20 font-medium"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="+91 00000 00000"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    variants={slideVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="w-full flex flex-col"
                  >
                    {loadingDepts ? (
                      <div className="text-white/50 text-[14px] text-center py-4 uppercase tracking-widest font-bold animate-pulse">
                        Scanning Data...
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {departments.map((dept) => {
                          const isSelected = formData.primaryDept === dept._id;
                          return (
                            <button
                              key={dept._id}
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  primaryDept: dept._id,
                                })
                              }
                              className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border transition-all duration-300 text-left group ${
                                isSelected
                                  ? "bg-[#9b1a1a]/20 border-[#9b1a1a]/60 shadow-[0_0_25px_rgba(155,26,26,0.15)]"
                                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                              }`}
                            >
                              <span
                                className={`text-[15px] font-bold ${isSelected ? "text-white" : "text-white/70 group-hover:text-white transition-colors"}`}
                              >
                                {dept.name}
                              </span>
                              <div
                                className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center transition-colors ${
                                  isSelected
                                    ? "border-[#9b1a1a] bg-[#9b1a1a]/20"
                                    : "border-white/20 group-hover:border-white/40"
                                }`}
                              >
                                {isSelected && (
                                  <motion.div
                                    layoutId="primaryDot"
                                    className="w-[10px] h-[10px] rounded-full bg-[#ff3333] shadow-[0_0_10px_#ff3333]"
                                  />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    variants={slideVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="w-full flex flex-col"
                  >
                    {loadingDepts ? (
                      <div className="text-white/50 text-[14px] text-center py-4 uppercase tracking-widest font-bold animate-pulse">
                        Scanning Data...
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        <button
                          onClick={() =>
                            setFormData({ ...formData, secondaryDept: null })
                          }
                          className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border transition-all duration-300 text-left group ${
                            formData.secondaryDept === null
                              ? "bg-white/15 border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                              : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                          }`}
                        >
                          <span
                            className={`text-[15px] font-bold italic ${formData.secondaryDept === null ? "text-white" : "text-white/50 group-hover:text-white/70"}`}
                          >
                            None (Skip)
                          </span>
                          <div
                            className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center transition-colors ${
                              formData.secondaryDept === null
                                ? "border-white"
                                : "border-white/20"
                            }`}
                          >
                            {formData.secondaryDept === null && (
                              <motion.div
                                layoutId="secondaryDot"
                                className="w-[10px] h-[10px] rounded-full bg-white shadow-[0_0_10px_white]"
                              />
                            )}
                          </div>
                        </button>

                        {departments.map((dept) => {
                          if (dept._id === formData.primaryDept) return null;
                          const isSelected =
                            formData.secondaryDept === dept._id;
                          return (
                            <button
                              key={dept._id}
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  secondaryDept: dept._id,
                                })
                              }
                              className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border transition-all duration-300 text-left group ${
                                isSelected
                                  ? "bg-[#9b1a1a]/20 border-[#9b1a1a]/60 shadow-[0_0_25px_rgba(155,26,26,0.15)]"
                                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                              }`}
                            >
                              <span
                                className={`text-[15px] font-bold ${isSelected ? "text-white" : "text-white/70 group-hover:text-white transition-colors"}`}
                              >
                                {dept.name}
                              </span>
                              <div
                                className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center transition-colors ${
                                  isSelected
                                    ? "border-[#9b1a1a] bg-[#9b1a1a]/20"
                                    : "border-white/20 group-hover:border-white/40"
                                }`}
                              >
                                {isSelected && (
                                  <motion.div
                                    layoutId="secondaryDot"
                                    className="w-[10px] h-[10px] rounded-full bg-[#ff3333] shadow-[0_0_10px_#ff3333]"
                                  />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    variants={slideVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="w-full flex flex-col space-y-4"
                  >
                    <div className="text-center mb-2">
                      <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-1">
                        Manual Payment
                      </h3>
                      <p className="text-white/50 text-[13px] font-medium leading-relaxed max-w-[280px] mx-auto">
                        Please pay ₹50 to our UPI ID and upload the receipt.
                      </p>
                    </div>

                    <div className="flex justify-center my-4">
                      <div className="w-40 h-40 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center p-4 relative overflow-hidden group hover:border-white/20 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#9b1a1a]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="w-full h-full border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center relative z-10 transition-colors group-hover:border-[#9b1a1a]/30">
                          <div className="flex flex-col items-center gap-2">
                            <QrCode className="w-8 h-8 text-white/20 group-hover:text-[#9b1a1a]/60 transition-colors" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/20 group-hover:text-[#9b1a1a]/60 transition-colors">
                              QR Code
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 group">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-white/50 group-focus-within:text-[#9b1a1a]">
                          Transaction ID (UTR)
                        </label>
                        <input
                          type="text"
                          className="w-full bg-white/5 border border-white/10 text-white rounded-xl h-14 px-4 text-[15px] focus:outline-none focus:border-[#9b1a1a]/50 focus:ring-1 focus:ring-[#9b1a1a]/50 focus:bg-white/10 placeholder:text-white/20 font-medium"
                          value={paymentUtr}
                          onChange={(e) => setPaymentUtr(e.target.value)}
                          placeholder="e.g. 123456789012"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-white/50 group-focus-within:text-[#9b1a1a]">
                          Payment Screenshot
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setPaymentScreenshot(e.target.files[0]);
                            }
                          }}
                          className="w-full bg-white/5 border border-white/10 text-white/70 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#9b1a1a]/50 focus:ring-1 focus:ring-[#9b1a1a]/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-[#9b1a1a]/20 file:text-[#ff4444] hover:file:bg-[#9b1a1a]/40 file:transition-colors"
                        />
                      </div>
                    </div>

                    <div className="w-full mt-2">
                      <SpecularButton
                        onClick={handlePayment}
                        disabled={
                          isSubmitting ||
                          paymentUtr.trim() === "" ||
                          paymentScreenshot === null
                        }
                        className="w-full h-14 group"
                        radius={12}
                        lineColor="#ff4444"
                        baseColor="#550000"
                        textColor="#ffffff"
                        tint="#9b1a1a"
                        tintOpacity={0.15}
                        autoAnimate={true}
                      >
                        <div className="flex justify-center items-center gap-3 font-black uppercase tracking-[0.2em] text-[13px]">
                          {isSubmitting ? "Submitting..." : "Submit Payment"}
                          <span className="text-[11px] group-hover:translate-x-1 transition-transform">
                            <ChevronRight className="w-5 h-5" />
                          </span>
                        </div>
                      </SpecularButton>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer / Nav Area */}
            <div className="px-10 pb-10 pt-4 flex flex-col justify-end z-10 relative">
              {currentStep < 3 && (
                <div className="w-full">
                  <SpecularButton
                    onClick={handleNext}
                    disabled={!isStepValid(currentStep) || isSubmitting}
                    className="w-full h-14 group"
                    radius={12}
                    lineColor="#ffffff"
                    baseColor="#555555"
                    textColor="#ffffff"
                    tint="#ffffff"
                    tintOpacity={0.1}
                    autoAnimate={true}
                  >
                    <div className="flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] text-[13px]">
                      {currentStep === 2 ? "Review & Pay" : "Continue"}
                      <span className="group-hover:translate-x-1 transition-transform">
                        <ChevronRight className="w-5 h-5" />
                      </span>
                    </div>
                  </SpecularButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div id="clerk-captcha" className="hidden"></div>

      {/* OTP Verification Modal */}
      <AnimatePresence>
        {showOtpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md"
          >
            <div className="bg-black/80 border border-white/10 p-8 rounded-3xl shadow-[0_0_80px_rgba(155,26,26,0.2)] max-w-sm w-full mx-4 flex flex-col items-center text-center">
              <Mail className="w-12 h-12 text-[#ff3333] mb-4" />
              <h3 className="text-xl font-bold text-white mb-2 tracking-wide">
                CHECK YOUR EMAIL
              </h3>
              <p className="text-white/60 text-sm mb-6 leading-relaxed">
                We've sent a 6-digit verification code to <br />
                <span className="text-white font-medium">{formData.email}</span>
              </p>

              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full bg-white/5 border border-white/10 text-white text-center rounded-xl h-14 text-2xl tracking-[0.5em] focus:outline-none focus:border-[#9b1a1a]/50 mb-6 font-mono"
              />

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowOtpModal(false)}
                  className="flex-1 h-12 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-[13px] uppercase tracking-widest transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerifyOtp}
                  disabled={isVerifying || otpCode.length !== 6}
                  className="flex-1 h-12 rounded-xl bg-[#9b1a1a] hover:bg-[#b01e1e] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-[13px] uppercase tracking-[0.2em] transition-colors shadow-[0_0_20px_rgba(155,26,26,0.3)]"
                >
                  {isVerifying ? "Verifying" : "Verify"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
