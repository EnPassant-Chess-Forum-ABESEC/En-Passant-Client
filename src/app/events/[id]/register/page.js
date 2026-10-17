"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Shield,
  Trophy,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  User as UserIcon,
} from "lucide-react";

import { useApi } from "@/lib/api";
import SpecularButton from "@/components/SpecularButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const FALLBACK_EVENT = {
  _id: "6ad20250a2f66658e43ccf6f",
  title: "ACC",
  root: "ACC",
  eventName: "ACC — ABES Chess Championship 2026",
  description:
    "The ABES Chess Championship (ACC) stands as the institute's premier collegiate chess tournament, bringing together tactical minds, strategic thinkers, and seasoned arbiters under one banner.",
  format: "Swiss League & Knockout Finals",
  timeControl: "10 + 5",
  participationMode: "solo",
  status: "upcoming",
  registrationDeadline: "2026-10-24T00:00:00.000Z",
  sections: [
    {
      name: "open",
      title: "Open Championship",
      description: "Open Section with rating-tiered divisions",
      timeControl: "10 + 5",
      brackets: [
        {
          name: "beginner",
          minRating: 0,
          maxRating: 899,
          range: "< 900 ELO",
          totalRounds: 5,
          timeControl: "10 + 5",
        },
        {
          name: "intermediate",
          minRating: 900,
          maxRating: 1500,
          range: "900 - 1500 ELO",
          totalRounds: 5,
          timeControl: "10 + 5",
        },
        {
          name: "advanced",
          minRating: 1501,
          maxRating: 3000,
          range: "1500+ ELO",
          totalRounds: 5,
          timeControl: "15 + 2",
        },
      ],
    },
    {
      name: "women",
      title: "Women's Championship",
      description: "Exclusive division for female competitors",
      timeControl: "10 + 5",
      brackets: [
        {
          name: "open",
          minRating: 0,
          maxRating: 3000,
          range: "Open Rating",
          totalRounds: 5,
          timeControl: "10 + 5",
        },
      ],
    },
    {
      name: "interclub",
      title: "Inter-College Club",
      description: "Inter-College Club Solo Showdown",
      timeControl: "10 + 5",
      brackets: [
        {
          name: "open",
          minRating: 0,
          maxRating: 3000,
          range: "Open Rating",
          totalRounds: 5,
          timeControl: "10 + 5",
        },
      ],
    },
  ],
};

const slideVariants = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -16 },
};

export default function EventSoloRegistrationPage() {
  const { id } = useParams();
  const router = useRouter();
  const fetchApi = useApi();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { user: clerkUser } = useUser();

  const [currentStep, setCurrentStep] = useState(0);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [event, setEvent] = useState(null);

  const [selectedSectionName, setSelectedSectionName] = useState("");
  const [selectedBracketName, setSelectedBracketName] = useState("");

  const [myRegistration, setMyRegistration] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  useEffect(() => {
    async function loadEventData() {
      try {
        setLoadingEvent(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
        const cleanId = id ? decodeURIComponent(id) : "ACC";

        let fetchedEvent = null;

        if (cleanId && /^[0-9a-fA-F]{24}$/.test(cleanId)) {
          const res = await fetch(`${apiUrl}/events/${cleanId}`, { cache: "no-store" }).catch(() => null);
          if (res?.ok) {
            const data = await res.json().catch(() => null);
            if (data?.event) fetchedEvent = data.event;
          }
        }

        if (!fetchedEvent) {
          const res = await fetch(`${apiUrl}/events`, { cache: "no-store" }).catch(() => null);
          if (res?.ok) {
            const data = await res.json().catch(() => null);
            const events = data?.events || [];
            fetchedEvent =
              events.find((e) => e._id === cleanId || e.title?.toLowerCase() === cleanId.toLowerCase()) ||
              events.find((e) => e.status === "active" || e.status === "upcoming" || e.status === "in_progress") ||
              events[0];
          }
        }

        const finalEvent = fetchedEvent || FALLBACK_EVENT;
        setEvent(finalEvent);

        if (finalEvent.sections && finalEvent.sections.length > 0) {
          const firstSec = finalEvent.sections[0];
          setSelectedSectionName(firstSec.name);
          if (firstSec.brackets && firstSec.brackets.length > 0) {
            setSelectedBracketName(firstSec.brackets[0].name);
          }
        }
      } catch (err) {
        console.error("Failed to load event data, using fallback:", err);
        setEvent(FALLBACK_EVENT);
        setSelectedSectionName("open");
        setSelectedBracketName("beginner");
      } finally {
        setLoadingEvent(false);
      }
    }

    loadEventData();
  }, [id]);

  useEffect(() => {
    async function checkMyRegistration() {
      if (!isSignedIn || !authLoaded || !event?._id) return;

      try {
        const data = await fetchApi(`/event-registrations/${event._id}/my-registration`);
        if (data?.success && data?.registration) {
          setMyRegistration(data.registration);
        } else {
          setMyRegistration(null);
        }
      } catch {
        setMyRegistration(null);
      }
    }

    checkMyRegistration();
  }, [event?._id, isSignedIn, authLoaded, fetchApi]);

  const activeSection = useMemo(() => {
    if (!event?.sections) return null;
    return event.sections.find((s) => s.name === selectedSectionName) || event.sections[0];
  }, [event, selectedSectionName]);

  const activeBrackets = useMemo(() => {
    return activeSection?.brackets || [];
  }, [activeSection]);

  const activeBracket = useMemo(() => {
    return activeBrackets.find((b) => b.name === selectedBracketName) || activeBrackets[0];
  }, [activeBrackets, selectedBracketName]);

  const isRegistrationOpen = useMemo(() => {
    if (!event?.registrationDeadline) return true;
    return new Date() <= new Date(event.registrationDeadline);
  }, [event]);

  const handleSectionSelect = (sectionName) => {
    setSelectedSectionName(sectionName);
    const target = event?.sections?.find((s) => s.name === sectionName);
    if (target?.brackets && target.brackets.length > 0) {
      setSelectedBracketName(target.brackets[0].name);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 0:
        return "1. Select Division";
      case 1:
        return "2. Rating Bracket";
      case 2:
        return "3. Contender Review";
      default:
        return "Registration";
    }
  };

  const getStepDesc = () => {
    switch (currentStep) {
      case 0:
        return "Select your championship tournament division.";
      case 1:
        return "Select your rating-stratified bracket.";
      case 2:
        return "Confirm your credentials and reserve seat.";
      default:
        return "";
    }
  };

  const isStepValid = (step) => {
    if (step === 0) return !!selectedSectionName;
    if (step === 1) return !!selectedBracketName;
    if (step === 2) return true;
    return true;
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleRegister();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRegister = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to complete your tournament registration.");
      const currentUrl = window.location.href;
      router.push(`/auth/sign-in?redirect_url=${encodeURIComponent(currentUrl)}`);
      return;
    }

    if (!isRegistrationOpen) {
      toast.error("Registration deadline has passed for this tournament.");
      return;
    }

    if (!selectedSectionName || !selectedBracketName) {
      toast.error("Please choose a division and rating bracket.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        section: selectedSectionName,
        bracket: selectedBracketName,
        participation: {
          participationType: "solo",
        },
      };

      const res = await fetchApi(`/event-registrations/${event._id}/register`, {
        method: "POST",
        body: payload,
      });

      if (res?.success) {
        toast.success(`Registered successfully for ${event.title || "the event"}!`);
        setMyRegistration(
          res.registration || {
            eventId: event._id,
            section: selectedSectionName,
            bracket: selectedBracketName,
            status: "pending",
            createdAt: new Date().toISOString(),
          },
        );
      } else {
        toast.error(res?.message || "Failed to complete registration.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(err.message || "An error occurred during registration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWithdraw = async () => {
    if (!event?._id) return;

    try {
      setIsWithdrawing(true);
      const res = await fetchApi(`/event-registrations/${event._id}/delete`, {
        method: "DELETE",
      });

      if (res?.success) {
        toast.success("Your registration has been withdrawn.");
        setMyRegistration(null);
        setCurrentStep(0);
      } else {
        toast.error(res?.message || "Failed to withdraw registration.");
      }
    } catch (err) {
      console.error("Withdraw error:", err);
      toast.error(err.message || "Failed to withdraw registration.");
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <section className="relative w-full min-h-[100dvh] lg:h-[100dvh] bg-[#050505] text-white font-sans flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 pt-16 sm:pt-20 lg:pt-22 pb-6 lg:pb-8 select-none selection:bg-[#9b1a1a]/40">
      <div
        className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden"
        style={{
          backgroundImage: "url('/event/registration/background.webp')",
          backgroundSize: "cover",
          backgroundPosition: "bottom center",
          backgroundRepeat: "no-repeat",
          opacity: 0.8,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/90 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#050505]/50 to-[#050505] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 flex flex-col lg:flex-row w-full max-w-[460px] sm:max-w-xl lg:max-w-5xl overflow-hidden rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] border border-white/10 bg-[#080808]/95 shadow-[0_24px_80px_rgba(0,0,0,0.8),0_0_40px_rgba(155,26,26,0.12)] h-auto max-h-[85dvh] lg:max-h-none lg:h-[min(590px,calc(100dvh-130px))] shrink-0"
      >
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-30" />

        <div className="hidden lg:flex relative lg:w-[40%] xl:w-[42%] h-full bg-[#030303] overflow-hidden items-center justify-center shrink-0">
          <Image
            src="/event/registration/left throne.webp"
            alt="Throne of ACC"
            fill
            priority
            sizes="(max-width: 1024px) 0vw, 40vw"
            className="object-cover object-center"
          />

          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#080808] to-transparent pointer-events-none" />
        </div>

        <div className="flex-1 flex flex-col justify-between w-full lg:w-[60%] xl:w-[58%] min-h-0 px-4 sm:px-7 lg:px-9 py-5 sm:py-6 lg:py-7 relative overflow-hidden">
          {loadingEvent ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-3 py-16 text-white/50">
              <Loader2 className="w-7 h-7 animate-spin text-[#9b1a1a]" />
              <p className="font-pezula text-xs uppercase tracking-[0.2em]">Summoning Tournament Ledger...</p>
            </div>
          ) : (
            <>
              <div className="shrink-0 mb-3">
                <h1 className="font-pezula text-xl sm:text-2xl md:text-[26px] lg:text-[30px] font-bold uppercase tracking-wider leading-[1.08] text-white drop-shadow-md">
                  <div>
                    COMETH THE <span className="text-[#9b1a1a]">HOUR,</span>
                  </div>
                  <div className="mt-0.5">
                    COMETH THE <span className="text-[#9b1a1a]">MAN</span>
                  </div>
                </h1>

                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span className="text-white/40 text-[10px] sm:text-[11px] uppercase tracking-[0.16em] font-medium font-pezula">
                    {event?.title || "ACC"} &bull; Solo Registration
                  </span>
                  {isRegistrationOpen ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Open
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
                      Closed
                    </span>
                  )}
                </div>
              </div>

              {!myRegistration && isRegistrationOpen && (
                <div className="pb-1.5 relative z-10 flex items-start justify-between gap-3 border-b border-white/5 mb-2.5 shrink-0">
                  <div>
                    <h2 className="text-base sm:text-lg font-pezula uppercase tracking-tight text-white mb-0.5">
                      {getStepTitle()}
                    </h2>
                    <p className="text-white/50 text-[11px] font-sans">
                      {getStepDesc()}
                    </p>
                  </div>

                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-white/40 hover:text-white transition-colors p-1 flex items-center gap-1 text-[11px] font-normal uppercase tracking-widest self-start shrink-0 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                  )}
                </div>
              )}

              <div
                className="flex-1 min-h-0 relative overflow-y-auto custom-scrollbar pr-1 py-1"
                onWheel={(e) => {
                  const el = e.currentTarget;
                  const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
                  const atTop = el.scrollTop <= 0;
                  const scrollingDown = e.deltaY > 0;
                  if ((scrollingDown && atBottom) || (!scrollingDown && atTop)) return;
                  e.stopPropagation();
                }}
              >
                <AnimatePresence mode="wait">
                  {myRegistration ? (
                    <motion.div
                      key="registered-view"
                      variants={slideVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md relative overflow-hidden space-y-3.5 my-auto"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-lg bg-[#9b1a1a]/20 border border-[#9b1a1a]/40 flex items-center justify-center text-[#ff4444]">
                            <Trophy className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-white font-bold text-sm uppercase font-pezula tracking-wide">
                                You Are Registered
                              </span>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            </div>
                            <p className="text-white/40 text-[11px] font-mono">
                              Confirmed seat for {event.title || "ACC 2026"}
                            </p>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-[#9b1a1a]/20 text-[#ff4444] border border-[#9b1a1a]/30">
                          {myRegistration.status || "CONFIRMED"}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5 text-xs">
                        <div className="bg-white/5 border border-white/5 rounded-lg p-2.5">
                          <span className="text-white/40 block text-[9px] uppercase tracking-wider font-bold mb-0.5">
                            Division
                          </span>
                          <span className="text-white font-semibold capitalize font-pezula tracking-wide text-xs">
                            {myRegistration.section || selectedSectionName} Section
                          </span>
                        </div>
                        <div className="bg-white/5 border border-white/5 rounded-lg p-2.5">
                          <span className="text-white/40 block text-[9px] uppercase tracking-wider font-bold mb-0.5">
                            Rating Bracket
                          </span>
                          <span className="text-white font-semibold capitalize font-pezula tracking-wide text-xs">
                            {myRegistration.bracket || selectedBracketName} Bracket
                          </span>
                        </div>
                      </div>

                      <div className="pt-1.5 flex items-center justify-between text-xs border-t border-white/5">
                        <span className="text-white/40 text-[10px]">
                          Need to withdraw before the deadline?
                        </span>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              disabled={isWithdrawing || !isRegistrationOpen}
                              className="text-xs text-red-400 hover:text-red-300 underline font-medium cursor-pointer transition-colors"
                            >
                              Withdraw
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-[#0c0c0c] border border-white/10 text-white rounded-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="font-pezula uppercase tracking-wide text-lg">
                                Withdraw Registration?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-white/60 text-sm">
                                Are you sure you want to withdraw your solo registration for {event.title || "ACC"}? Your seat will be released.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-white/5 hover:bg-white/10 text-white border-white/10 rounded-xl">
                                Keep My Seat
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleWithdraw}
                                className="bg-[#9b1a1a] hover:bg-[#b01e1e] text-white rounded-xl"
                              >
                                {isWithdrawing ? "Withdrawing..." : "Confirm Withdrawal"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </motion.div>
                  ) : !isRegistrationOpen ? (
                    <motion.div
                      key="closed-state"
                      variants={slideVariants}
                      initial="initial"
                      animate="animate"
                      className="p-5 rounded-xl bg-white/[0.02] border border-white/10 text-center space-y-2.5 my-auto"
                    >
                      <AlertCircle className="w-7 h-7 text-white/40 mx-auto" />
                      <h3 className="font-pezula text-base uppercase tracking-wide text-white">
                        Registrations Closed
                      </h3>
                      <p className="text-white/50 text-xs max-w-sm mx-auto leading-relaxed">
                        The registration deadline has passed for this tournament cycle. Round pairings and live broadcast will be posted on the event board.
                      </p>
                    </motion.div>
                  ) : (
                    <div className="space-y-2">
                      {currentStep === 0 && (
                        <motion.div
                          key="step0"
                          variants={slideVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={{ duration: 0.25 }}
                          className="space-y-2 w-full"
                        >
                          {event.sections?.map((sec) => {
                            const isSelected = selectedSectionName === sec.name;
                            return (
                              <button
                                key={sec.name}
                                type="button"
                                onClick={() => handleSectionSelect(sec.name)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 text-left group cursor-pointer ${isSelected
                                  ? "bg-[#9b1a1a]/25 border-[#9b1a1a] shadow-[0_0_20px_rgba(155,26,26,0.2)] text-white"
                                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white/70 hover:text-white"
                                  }`}
                              >
                                <div>
                                  <span className="text-[13px] sm:text-[14px] font-bold font-pezula uppercase tracking-wider block">
                                    {sec.title || sec.name}
                                  </span>
                                  <span className="text-[10px] text-white/40 font-sans block">
                                    {sec.description || "Solo championship tier"}
                                  </span>
                                </div>
                                <div className="text-right shrink-0 ml-2">
                                  <span className="text-[10px] font-mono text-white/50 block">
                                    {sec.brackets?.length || 1} Brackets
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </motion.div>
                      )}

                      {currentStep === 1 && (
                        <motion.div
                          key="step1"
                          variants={slideVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={{ duration: 0.25 }}
                          className="space-y-2 w-full"
                        >
                          {activeBrackets.map((brk) => {
                            const isSelected = selectedBracketName === brk.name;
                            return (
                              <button
                                key={brk.name}
                                type="button"
                                onClick={() => setSelectedBracketName(brk.name)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 text-left group cursor-pointer ${isSelected
                                  ? "bg-[#9b1a1a]/25 border-[#9b1a1a] shadow-[0_0_20px_rgba(155,26,26,0.2)] text-white"
                                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white/70 hover:text-white"
                                  }`}
                              >
                                <div>
                                  <span className="text-[13px] sm:text-[14px] font-bold font-pezula uppercase tracking-wider block capitalize">
                                    {brk.name} Bracket
                                  </span>
                                  <span className="text-[10px] text-white/40 font-mono block">
                                    Rating Tier: {brk.range}
                                  </span>
                                </div>
                                <div className="text-right shrink-0 ml-2 flex flex-col items-end gap-0.5">
                                  <span className="inline-block px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-mono text-white/80">
                                    {brk.timeControl || "10 + 5"}
                                  </span>
                                  <span className="text-[9px] text-white/40 font-mono">
                                    {brk.totalRounds || 5} Rounds
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </motion.div>
                      )}

                      {currentStep === 2 && (
                        <motion.div
                          key="step2"
                          variants={slideVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={{ duration: 0.25 }}
                          className="space-y-2.5 w-full"
                        >
                          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-2.5 text-xs">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0 text-white/80 overflow-hidden">
                                {clerkUser?.imageUrl ? (
                                  <Image
                                    src={clerkUser.imageUrl}
                                    alt="User Avatar"
                                    width={36}
                                    height={36}
                                    className="object-cover"
                                  />
                                ) : (
                                  <UserIcon className="w-4 h-4" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <span className="block text-white font-medium truncate font-pezula tracking-wide text-xs sm:text-sm">
                                  {isSignedIn ? clerkUser?.fullName || "Contender" : "Guest Player"}
                                </span>
                                <span className="block text-white/40 text-[10px] truncate font-mono">
                                  {isSignedIn
                                    ? clerkUser?.primaryEmailAddress?.emailAddress || "Verified Account"
                                    : "Sign in required to finalize seat"}
                                </span>
                              </div>
                            </div>

                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#9b1a1a]/20 text-[#ff4444] text-[9px] font-mono font-bold border border-[#9b1a1a]/30 shrink-0">
                              <Shield className="w-3 h-3" />
                              SOLO
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-white/5 border border-white/5 rounded-xl p-2.5">
                              <span className="text-white/40 block text-[9px] uppercase tracking-wider font-bold mb-0.5">
                                Division Selected
                              </span>
                              <span className="text-white font-semibold capitalize font-pezula tracking-wide text-xs">
                                {activeSection?.title || selectedSectionName}
                              </span>
                            </div>
                            <div className="bg-white/5 border border-white/5 rounded-xl p-2.5">
                              <span className="text-white/40 block text-[9px] uppercase tracking-wider font-bold mb-0.5">
                                Rating Bracket
                              </span>
                              <span className="text-white font-semibold capitalize font-pezula tracking-wide text-xs">
                                {activeBracket?.name} ({activeBracket?.range})
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </AnimatePresence>
              </div>

              <div className="pt-2.5 shrink-0 border-t border-white/5 mt-2">
                {!myRegistration && isRegistrationOpen ? (
                  <SpecularButton
                    onClick={handleNext}
                    disabled={isSubmitting || !isStepValid(currentStep)}
                    className="w-full h-11 sm:h-12 group"
                    radius={12}
                    lineColor="#ff4444"
                    baseColor="#550000"
                    textColor="#ffffff"
                    tint="#9b1a1a"
                    tintOpacity={0.15}
                    autoAnimate={true}
                  >
                    <div className="flex justify-center items-center gap-2 font-normal uppercase tracking-[0.16em] text-[11.5px] sm:text-[13px] relative z-10">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Securing Seat...</span>
                        </>
                      ) : currentStep === 2 ? (
                        <>
                          <span>Confirm Solo Registration</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      ) : (
                        <>
                          <span>Continue to {currentStep === 0 ? "Bracket" : "Review"}</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </SpecularButton>
                ) : (
                  <Link href="/events" className="w-full block">
                    <button
                      type="button"
                      className="w-full h-11 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs uppercase tracking-widest font-pezula border border-white/10 transition-colors cursor-pointer"
                    >
                      Return to Events Overview
                    </button>
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </section>
  );
}
