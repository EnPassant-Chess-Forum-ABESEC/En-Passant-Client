"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useApi } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import SpecularButton from "@/components/SpecularButton";
import TaskCountdown from "@/components/TaskCountdown";
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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    collegeEmail: "",
    phone: "",
    primaryDept: null,
    secondaryDept: null,
  });
  const [prefilledFields, setPrefilledFields] = useState({
    collegeEmail: false,
    phone: false,
  });

  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { user: clerkUser } = useUser();
  const clerk = useClerk();
  const { signUp } = useSignUp();
  const { signIn } = useSignIn();

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [authMode, setAuthMode] = useState("signUp");
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentUtr, setPaymentUtr] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);

  const fetchApi = useApi();
  const [departments, setDepartments] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(true);

  const [settings, setSettings] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [isBeforeStart, setIsBeforeStart] = useState(false);
  const [isAfterEnd, setIsAfterEnd] = useState(false);

  useEffect(() => {
    if (settings?.applicationStartDate && settings?.applicationEndDate) {
      const start = new Date(settings.applicationStartDate);
      const end = new Date(settings.applicationEndDate);
      
      setIsBeforeStart(new Date() < start);
      setIsAfterEnd(new Date() > end);

      const interval = setInterval(() => {
        setIsBeforeStart(new Date() < start);
        setIsAfterEnd(new Date() > end);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [settings]);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetchApi("/settings/recruitment-phases").catch(
          () => null,
        );
        if (res?.data) {
          setSettings(res.data);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoadingSettings(false);
      }
    }
    loadSettings();
  }, [fetchApi]);

  useEffect(() => {
    if (clerkUser) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || clerkUser.fullName || "",
        email: prev.email || clerkUser.primaryEmailAddress?.emailAddress || "",
      }));
    }
  }, [clerkUser]);

  useEffect(() => {
    async function loadProfile() {
      if (!isSignedIn || !authLoaded) return;
      try {
        const res = await fetchApi("/users/me");
        if (res?.success && res?.user) {
          setFormData((prev) => ({
            ...prev,
            collegeEmail: res.user.collegeEmail || prev.collegeEmail,
            phone: res.user.phoneNumber || prev.phone,
          }));
          setPrefilledFields({
            collegeEmail: !!res.user.collegeEmail,
            phone: !!res.user.phoneNumber,
          });
        }
      } catch (err) {}
    }
    loadProfile();
  }, [isSignedIn, authLoaded, fetchApi]);

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
            toast.info(
              "Your application is already submitted! Redirecting to dashboard...",
              { id: "app-submitted-toast" },
            );
            setTimeout(() => {
              window.location.href = "/recruitment/dashboard";
            }, 2500);
          } else if (app.status === "PAYMENT_PENDING") {
            setCurrentStep(4);
          } else if (
            app.status === "DRAFT" ||
            app.status === "PAYMENT_FAILED" ||
            app.paymentStatus === "PENDING"
          ) {
            setFormData((prev) => ({
              ...prev,
              name: clerkUser?.fullName || prev.name,
              email: clerkUser?.primaryEmailAddress?.emailAddress || prev.email,
            }));
            setCurrentStep(3);
            if (app.status === "PAYMENT_FAILED") {
              toast.error(
                "Your previous payment failed or was rejected. Please try again.",
                { id: "payment-failed-toast" },
              );
            }
          }
        }
      } catch (err) {}
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
        formData.collegeEmail.trim() !== "" &&
        formData.phone.trim() !== ""
      );
    }
    if (step === 1) {
      return formData.primaryDept !== null;
    }
    if (step === 2) {
      return true;
    }
    if (step === 3) {
      return paymentUtr.trim() !== "" && paymentScreenshot !== null;
    }
    return true;
  };

  const handleNext = async () => {
    if (!isStepValid(currentStep)) {
      if (currentStep === 0)
        toast.error("Please fill all required fields correctly.");
      if (currentStep === 1) toast.error("Please select a primary department.");
      return;
    }
    if (currentStep >= 3) return;

    if (currentStep === 0) {
      const sanitizedName = formData.name.trim();
      const sanitizedEmail = formData.email.trim();
      const sanitizedCollegeEmail = formData.collegeEmail.trim().toLowerCase();
      const sanitizedPhone = formData.phone.replace(/\D/g, "");

      const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

      if (!emailRegex.test(sanitizedEmail)) {
        toast.error("Please enter a valid personal email address");
        return;
      }

      const commonTypos = [
        "g2ail.com",
        "gamil.com",
        "gmaill.com",
        "gnail.com",
        "gmail.con",
        "gmail.co",
        "gmai.com",
      ];
      const emailDomain = sanitizedEmail.split("@")[1];
      if (commonTypos.includes(emailDomain)) {
        toast.error(`Did you mean @gmail.com? Please check your email.`);
        return;
      }

      if (
        !emailRegex.test(sanitizedCollegeEmail) ||
        !sanitizedCollegeEmail.endsWith("@abes.ac.in")
      ) {
        toast.error("College email must be a valid @abes.ac.in address");
        return;
      }

      if (sanitizedPhone.length !== 10) {
        toast.error("Phone number must be exactly 10 digits");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        name: sanitizedName,
        email: sanitizedEmail,
        collegeEmail: sanitizedCollegeEmail,
        phone: sanitizedPhone,
      }));

      if (!isSignedIn) {
        if (!clerk?.client) {
          alert(
            "Authentication is still loading. Please wait a second and try again.",
          );
          return;
        }

        try {
          setIsSubmitting(true);
          const res = await fetch("/api/auth/fast-signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: sanitizedEmail,
              firstName: sanitizedName.split(" ")[0] || sanitizedName,
              lastName: sanitizedName.split(" ").slice(1).join(" ") || "",
            }),
          });
          const data = await res.json();

          if (data.success && data.ticket) {
            const signInAttempt = await clerk.client.signIn.create({
              strategy: "ticket",
              ticket: data.ticket,
            });
            if (signInAttempt.status === "complete") {
              await clerk.setActive({
                session: signInAttempt.createdSessionId,
              });
              setCurrentStep(1);
            } else {
              throw new Error(
                "Sign in not complete. Status: " + signInAttempt.status,
              );
            }
          } else if (data.error === "EXISTS") {
            const rawSignIn = clerk.client.signIn;
            await rawSignIn.create({
              identifier: sanitizedEmail,
            });
            const emailFactor = rawSignIn.supportedFirstFactors?.find(
              (f) =>
                f.strategy === "email_code" &&
                f.safeIdentifier === sanitizedEmail,
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
            throw new Error(data.error || "Failed to create account");
          }
        } catch (err) {
          console.error("Auth init failed", err);
          let msg = "An unknown error occurred.";
          if (
            err instanceof SyntaxError &&
            err.message.includes("is not valid JSON")
          ) {
            msg =
              "Clerk Authentication Service is currently rate-limited or unavailable. Please wait a moment and try again.";
          } else {
            msg =
              err.errors?.[0]?.longMessage ||
              err.errors?.[0]?.message ||
              err.message ||
              JSON.stringify(err);
          }
          alert(
            `Authentication failed: ${msg}. If OTP is disabled in your Clerk Dashboard, you'll need to enable it or sign in manually.`,
          );
        } finally {
          setIsSubmitting(false);
        }
        return;
      } else {
        setCurrentStep(1);
      }
    } else if (currentStep === 2) {
      try {
        setIsSubmitting(true);

        if (formData.collegeEmail || formData.phone) {
          await fetchApi("/users/me", {
            method: "PUT",
            body: {
              collegeEmail: formData.collegeEmail || undefined,
              phoneNumber: formData.phone || undefined,
            },
          }).catch((err) =>
            console.error("Failed to update user profile", err),
          );
        }

        const body = {
          name: formData.name,
          email: formData.email,
          collegeEmail: formData.collegeEmail,
          phone: formData.phone,
          preferredDepartmentId: formData.primaryDept,
          secondaryDepartmentId: formData.secondaryDept
            ? [formData.secondaryDept]
            : [],
        };

        const res = await fetchApi("/recruitment/apply", {
          method: "POST",
          body: body,
        });

        if (res.success) {
          setCurrentStep(3);
        } else {
          toast.error(res.message || "Failed to submit application");
        }
      } catch (err) {
        console.error("Failed to create application", err);
        toast.error(err.message || "Failed to submit application");
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
          const missingFields = completeSignUp.missingFields
            ? completeSignUp.missingFields.join(", ")
            : "unknown";
          alert(
            `Sign up status is: ${completeSignUp.status}. Missing requirements: ${missingFields}. Please update your Clerk Dashboard settings (e.g. disable Password requirement if using passwordless).`,
          );
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

  const handlePayment = async () => {
    if (!isStepValid(3)) {
      toast.error("Please provide UTR and payment screenshot to proceed.");
      return;
    }
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
        toast.success("Payment submitted successfully! Redirecting...", {
          id: "payment-toast",
        });
        setTimeout(() => {
          window.location.href = "/recruitment/dashboard";
        }, 2500);
      } else {
        toast.error(res.message || "Failed to submit payment", {
          id: "payment-toast",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error submitting payment.", { id: "payment-toast" });
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
      case 4:
        return "Under Review";
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
      case 4:
        return "Your payment is being verified by administrators.";
      default:
        return "";
    }
  };

  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="relative min-h-screen w-full bg-black overflow-x-hidden overflow-y-auto flex items-center justify-center px-4 sm:px-6 py-12 md:py-20 font-sans">
      <div
        className="hidden md:block absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage:
            "url('/recruitment/recruitment_apply_background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div
        className="relative z-10 flex w-full max-w-5xl overflow-hidden rounded-[2rem]"
        style={{
          height: "min(670px, 85vh)",
          boxShadow:
            "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)",
        }}
      >
        <div
          className="hidden lg:block relative flex-1"
          style={{
            backgroundColor: "#050505",
            backgroundImage: "url('/common/dark_marble_bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <Image
            src="/recruitment/apply_page.png"
            alt="Club Recruitment"
            aria-hidden="true"
            fill
            style={{
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
              mixBlendMode: "screen",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)",
              zIndex: 2,
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)",
              maskImage:
                "linear-gradient(to bottom, transparent 30%, black 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 30%, black 100%)",
              zIndex: 3,
            }}
          />

          <div className="absolute bottom-8 left-8 z-30 flex items-center">
            <span
              className="text-white text-xl font-bold tracking-wide uppercase opacity-90 drop-shadow-md"
              style={{
                fontFamily: "var(--font-orbitron, 'Orbitron', sans-serif)",
                letterSpacing: "0.2em",
              }}
            >
              Recruitment 2026
            </span>
          </div>
        </div>

        <div
          className="flex flex-col justify-between w-full lg:w-[55%] flex-shrink-0 px-6 sm:px-10 py-8 relative overflow-x-hidden"
          style={{
            background: "rgba(10, 10, 10, 0.92)",
            backdropFilter: "blur(24px) saturate(150%)",
            WebkitBackdropFilter: "blur(24px) saturate(150%)",
          }}
        >
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

          {isBeforeStart ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 px-4">
              <h2 className="text-[1.8rem] md:text-[2.2rem] font-pezula uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 mb-8 leading-tight">
                Applications Opening Soon
              </h2>
              <TaskCountdown
                targetDate={new Date(settings.applicationStartDate)}
              />
              <p className="text-white/40 text-[12px] uppercase tracking-widest mt-8">
                Stay tuned
              </p>
            </div>
          ) : isAfterEnd ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 px-4">
              <h2 className="text-[1.8rem] md:text-[2.2rem] font-pezula uppercase tracking-tight text-[#ff3333] mb-4 leading-tight">
                Recruitments are Closed
              </h2>
              <p className="text-white/60 text-sm md:text-base mb-8 max-w-md">
                The application window for this recruitment cycle has closed. Thank you for your interest!
              </p>
              <SpecularButton onClick={() => window.location.href = "/"}>
                Return to Home
              </SpecularButton>
            </div>
          ) : (
            <>
              <div className="pb-2 relative z-10 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-[2rem] font-pezula uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 mb-1 leading-none">
                    {getStepTitle()}
                  </h2>
                  <p className="text-white/50 text-[14px] font-inter font-medium tracking-wide">
                    {getStepDesc()}
                  </p>
                </div>

                {currentStep > 0 && currentStep < 4 && (
                  <button
                    onClick={handleBack}
                    className="text-white/40 hover:text-white transition-colors p-1 flex items-center gap-1 text-[11px] font-normal uppercase tracking-widest self-start mt-2 shrink-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                )}
              </div>

              <div
                className="pt-6 pb-8 flex-1 min-h-0 relative overflow-y-auto overflow-x-hidden -mx-6 px-6 sm:-mx-10 sm:px-10 z-10 custom-scrollbar"
                onWheel={(e) => {
                  const el = e.currentTarget;
                  const atBottom =
                    el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
                  const atTop = el.scrollTop <= 0;
                  const scrollingDown = e.deltaY > 0;
                  if ((scrollingDown && atBottom) || (!scrollingDown && atTop))
                    return;
                  e.stopPropagation();
                }}
              >
                <AnimatePresence mode="wait">
                  {currentStep === 0 && (
                    <motion.div
                      key="step0"
                      variants={slideVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="space-y-3 w-full"
                    >
                      {(isSignedIn ||
                        prefilledFields.collegeEmail ||
                        prefilledFields.phone) && (
                        <p className="text-[10.5px] text-white/80 bg-white/5 border border-white/10 px-3 py-2 rounded-lg font-medium tracking-wide">
                          * Some fields have been fetched from your profile.
                          Update them there if needed.
                        </p>
                      )}
                      <div className="space-y-1.5 group">
                        <label
                          htmlFor="name"
                          className="text-[11px] font-bold normalcase tracking-widest text-white/50 group-focus-within:text-[#9b1a1a]"
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
                            className={`w-full bg-white/5 border border-white/10 text-white rounded-xl h-12 pl-12 pr-4 text-[15px] focus:outline-none focus:border-[#9b1a1a]/50 focus:ring-1 focus:ring-[#9b1a1a]/50 focus:bg-white/10 placeholder:text-white/20 font-medium ${
                              isSignedIn ? "opacity-60 cursor-not-allowed" : ""
                            }`}
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder="Your Name"
                            disabled={isSignedIn}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5 group">
                        <label
                          htmlFor="email"
                          className="text-[11px] font-bold normalcase tracking-widest text-white/50 group-focus-within:text-[#9b1a1a]"
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
                            className={`w-full bg-white/5 border border-white/10 text-white rounded-xl h-12 pl-12 pr-4 text-[15px] focus:outline-none focus:border-[#9b1a1a]/50 focus:ring-1 focus:ring-[#9b1a1a]/50 focus:bg-white/10 placeholder:text-white/20 font-medium ${
                              isSignedIn ? "opacity-60 cursor-not-allowed" : ""
                            }`}
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                            placeholder="youremail@gmail.com"
                            disabled={isSignedIn}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5 group">
                        <label
                          htmlFor="collegeEmail"
                          className="text-[11px] font-bold normalcase tracking-widest text-white/50 group-focus-within:text-[#9b1a1a]"
                        >
                          College Email
                        </label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#9b1a1a]">
                            <Mail
                              className="w-[18px] h-[18px]"
                              strokeWidth={2.5}
                            />
                          </div>
                          <input
                            id="collegeEmail"
                            type="email"
                            className={`w-full bg-white/5 border border-white/10 text-white rounded-xl h-12 pl-12 pr-4 text-[15px] focus:outline-none focus:border-[#9b1a1a]/50 focus:ring-1 focus:ring-[#9b1a1a]/50 focus:bg-white/10 placeholder:text-white/20 font-medium ${
                              prefilledFields.collegeEmail
                                ? "opacity-60 cursor-not-allowed"
                                : ""
                            }`}
                            value={formData.collegeEmail}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                collegeEmail: e.target.value,
                              })
                            }
                            placeholder="name.admNo@abes.ac.in"
                            disabled={prefilledFields.collegeEmail}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5 group">
                        <label
                          htmlFor="phone"
                          className="text-[11px] font-bold normalcase tracking-widest text-white/50 group-focus-within:text-[#9b1a1a]"
                        >
                          WhatsApp Number
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
                            className={`w-full bg-white/5 border border-white/10 text-white rounded-xl h-12 pl-12 pr-4 text-[15px] focus:outline-none focus:border-[#9b1a1a]/50 focus:ring-1 focus:ring-[#9b1a1a]/50 focus:bg-white/10 placeholder:text-white/20 font-medium ${
                              prefilledFields.phone
                                ? "opacity-60 cursor-not-allowed"
                                : ""
                            }`}
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                            placeholder="e.g. 9876543210"
                            disabled={prefilledFields.phone}
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
                            const isSelected =
                              formData.primaryDept === dept._id;
                            return (
                              <button
                                key={dept._id}
                                onClick={() =>
                                  setFormData({
                                    ...formData,
                                    primaryDept: dept._id,
                                  })
                                }
                                className={`w-full flex items-center justify-center px-5 py-4 rounded-xl border transition-all duration-300 text-center group ${
                                  isSelected
                                    ? "bg-[#9b1a1a]/25 border-[#9b1a1a] shadow-[0_0_25px_rgba(155,26,26,0.2)] text-white"
                                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white/70 hover:text-white"
                                }`}
                              >
                                <span className="text-[15px] font-bold">
                                  {dept.name.toLowerCase() === "community" ? "Community & PR" : dept.name}
                                </span>
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
                            className={`w-full flex items-center justify-center px-5 py-4 rounded-xl border transition-all duration-300 text-center group ${
                              formData.secondaryDept === null
                                ? "bg-white/15 border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.05)] text-white"
                                : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white/50 hover:text-white/70"
                            }`}
                          >
                            <span className="text-[15px] font-bold italic">
                              None (Skip)
                            </span>
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
                                className={`w-full flex items-center justify-center px-5 py-4 rounded-xl border transition-all duration-300 text-center group ${
                                  isSelected
                                    ? "bg-[#9b1a1a]/25 border-[#9b1a1a] shadow-[0_0_25px_rgba(155,26,26,0.2)] text-white"
                                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white/70 hover:text-white"
                                }`}
                              >
                                <span className="text-[15px] font-bold">
                                  {dept.name.toLowerCase() === "community" ? "Community & PR" : dept.name}
                                </span>
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
                      <div className="flex items-center justify-between gap-6 bg-white/5 border border-white/10 p-5 rounded-2xl my-2">
                        <div className="flex-1 text-left">
                          <h4 className="text-s font-pezula normalcase tracking-wider text-white mb-1.5">
                            Registration Fee
                          </h4>
                          <p className="text-white/50 text-[12px] font-medium leading-relaxed mb-2">
                            Please pay{" "}
                            <span className="text-[#9b1a1a] ">Rs. 40</span> to
                            the UPI ID mentioned below and upload the screenshot
                            of the payment.
                          </p>
                          <div className="text-[11px] font-bold tracking-wide text-white/70 normalcase break-all">
                            UPI ID:{" "}
                            <span className="text-[#ff3333] select-all font-medium normal-case">
                              8933905351@ybl
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-center justify-center shrink-0">
                          <Image
                            src="/recruitment/recruitment_payment_qr.jpeg"
                            alt="Payment QR Code"
                            width={112}
                            height={112}
                            priority
                            className="object-contain rounded-md mb-2"
                            style={{ width: "112px", height: "auto" }}
                          />
                          <span className="text-white font-black text-[11px] bg-[#9b1a1a] px-3 py-1 rounded w-full text-center tracking-wider border border-[#9b1a1a]/50">
                            Rs. 40
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1.5 group">
                          <label className="text-[11px] font-bold normalcase tracking-widest text-white/50 group-focus-within:text-[#9b1a1a]">
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

                        <div className="space-y-1.5 group">
                          <label className="text-[11px] font-bold normalcase tracking-widest text-white/50 group-focus-within:text-[#9b1a1a]">
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

                      <div className="w-full mt-12 pt-3">
                        <SpecularButton
                          onClick={handlePayment}
                          disabled={isSubmitting}
                          className={`w-full h-14 group ${!isStepValid(3) && !isSubmitting ? "opacity-55" : ""}`}
                          radius={12}
                          lineColor="#ff4444"
                          baseColor="#550000"
                          textColor="#ffffff"
                          tint="#9b1a1a"
                          tintOpacity={0.15}
                          autoAnimate={true}
                        >
                          <div className="flex justify-center items-center gap-3 font-normal uppercase tracking-[0.2em] text-[13px]">
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Submitting...</span>
                              </>
                            ) : (
                              <>
                                <span>Submit Payment</span>
                                <span className="text-[11px] group-hover:translate-x-1 transition-transform">
                                  <ChevronRight className="w-5 h-5" />
                                </span>
                              </>
                            )}
                          </div>
                        </SpecularButton>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 4 && (
                    <motion.div
                      key="step4"
                      variants={slideVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="w-full flex flex-col items-center justify-center space-y-6 text-center py-8"
                    >
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          Payment Submitted
                        </h3>
                        <p className="text-white/50 text-[14px] leading-relaxed max-w-sm mx-auto">
                          Your payment details have been received and are
                          currently being verified by our administrators. Please
                          check back later.
                        </p>
                      </div>
                      <div className="w-full pt-4 max-w-[280px]">
                        <SpecularButton
                          onClick={() => {
                            window.location.href = "/recruitment/dashboard";
                          }}
                          className="w-full h-14 group"
                          radius={12}
                          lineColor="#ff4444"
                          baseColor="#550000"
                          textColor="#ffffff"
                          tint="#9b1a1a"
                          tintOpacity={0.15}
                          autoAnimate={true}
                        >
                          <div className="flex justify-center items-center gap-3 font-normal uppercase tracking-[0.2em] text-[13px] relative z-10">
                            <span>Go to Dashboard</span>
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

              <div className="pt-2 flex flex-col justify-end z-10 relative">
                {currentStep === 0 && (
                  <p className="text-white/40 text-[11px] text-center mb-2 tracking-widest font-normal">
                    We will create your account upon submission if account does
                    not exist
                  </p>
                )}
                {currentStep < 3 && (
                  <div className="w-full">
                    <SpecularButton
                      onClick={handleNext}
                      disabled={isSubmitting}
                      className={`w-full h-14 group ${!isStepValid(currentStep) && !isSubmitting ? "opacity-55" : ""}`}
                      radius={12}
                      lineColor="#ffffff"
                      baseColor="#555555"
                      textColor="#ffffff"
                      tint="#ffffff"
                      tintOpacity={0.1}
                      autoAnimate={true}
                    >
                      <div className="flex items-center justify-center gap-3 font-normal uppercase tracking-[0.2em] text-[13px]">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>
                              {currentStep === 0
                                ? "Creating Account..."
                                : "Processing..."}
                            </span>
                          </>
                        ) : (
                          <>
                            <span>
                              {currentStep === 2 ? "Review & Pay" : "Continue"}
                            </span>
                            <span className="group-hover:translate-x-1 transition-transform">
                              <ChevronRight className="w-5 h-5" />
                            </span>
                          </>
                        )}
                      </div>
                    </SpecularButton>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div id="clerk-captcha" className="hidden"></div>

      <AnimatePresence>
        {showOtpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md"
          >
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl max-w-sm w-full mx-4 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

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
                className="w-full bg-white/5 border border-white/10 text-white text-center rounded-xl h-14 text-2xl tracking-[0.5em] focus:outline-none focus:border-[#9b1a1a]/50 mb-6 font-mono transition-colors duration-200"
              />

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowOtpModal(false)}
                  className="flex-1 h-12 rounded-xl bg-white/5 hover:bg-white/10 text-white font-normal text-[13px] uppercase tracking-widest transition-colors"
                >
                  Cancel
                </button>
                <SpecularButton
                  onClick={handleVerifyOtp}
                  disabled={isVerifying || otpCode.length !== 6}
                  className="flex-1 h-12"
                  radius={12}
                  lineColor="rgba(255,255,255,0.5)"
                  baseColor="#ffffff"
                  textColor="#ffffffff"
                  tint="#ffffff"
                  tintOpacity={0.3}
                  autoAnimate={true}
                >
                  {isVerifying ? (
                    <div className="flex items-center justify-center gap-2 w-full h-full">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="font-bold text-[12px] uppercase tracking-[0.2em]">
                        Verifying
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <span className="font-bold text-[12px] uppercase tracking-[0.2em]">
                        Verify
                      </span>
                    </div>
                  )}
                </SpecularButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
