"use client";

import { useEffect, useState, useMemo, useRef } from "react";
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
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Search,
  X,
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

const CLUB_OPTIONS = [
  "Cultural Club",
  "Dramatics Club",
  "Talentrove Club",
  "Geeksforgeeks",
  "Salaah Mentor Community",
  "Picturesque Club",
  "ENIGMA",
  "ECell ABES",
  "Technical Club",
  "Mechnophilla Club",
  "ABESEC ACM Students Chapter",
  "ACM",
  "ABESEC IEEE",
  "Women Progresscell",
  "Codechef",
  "Techovation Club",
  "ACES ABES",
  "Sports Club",
  "En Passant Chess Club",
  "Spritualandyoga Club",
  "Dare2Compete",
  "DataVerse Club",
  "Google DSC",
  "Creativeu Club",
  "Environ Club",
  "NSS",
  "Internal Complaints Committee and STAMBH",
  "Trishul Club",
];

const FALLBACK_INTERCLUB_SECTION = {
  name: "interclub",
  title: "Inter-College Club",
  description:
    "Inter-college club championship for visiting institution representatives & clubs",
  timeControl: "10 + 5",
  timeFormat: "10 + 5",
  brackets: [
    {
      name: "open",
      minRating: 0,
      maxRating: 3000,
      range: "0 - 3000 ELO",
      totalRounds: 5,
      timeControl: "10 + 5",
      timeFormat: "10 + 5",
    },
  ],
};

const FALLBACK_EVENT = {
  _id: "6acd6528d1a511d94bdb427d",
  title: "ACC — ABES Chess Championship 2026",
  root: "A C C",
  eventName: "ACC — ABES Chess Championship 2026",
  description:
    "The ABES Chess Championship (ACC) Inter-Club division stands as the institute's premier collegiate chess tournament for external clubs and visiting institutions. Bringing together tactical minds and seasoned arbiters under one banner.\n\nParticipants compete across rapid time controls with official FIDE-standard regulations, full arbiter oversight, and live digital pairing boards. Claim accolades, badges, and recognition for your home institution.",
  format: "Swiss System (5 Rounds)",
  timeControl: "10 + 5",
  participationMode: "solo",
  status: "upcoming",
  startDate: "2026-10-25T18:30:00.000Z",
  endDate: "2026-10-31T18:29:00.000Z",
  registrationDeadline: "2026-10-25T18:29:00.000Z",
  sections: [FALLBACK_INTERCLUB_SECTION],
};

const slideVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.15, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.08, ease: "easeIn" } },
};

export default function EventInterClubRegistrationPage() {
  const { id } = useParams();
  const router = useRouter();
  const fetchApi = useApi();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { user: clerkUser } = useUser();

  const [currentStep, setCurrentStep] = useState(0);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [event, setEvent] = useState(null);

  const [userProfile, setUserProfile] = useState(null);
  const [bracketPreview, setBracketPreview] = useState(null);
  const [loadingBracketPreview, setLoadingBracketPreview] = useState(false);

  const [gender, setGender] = useState("");
  const [clubName, setClubName] = useState("");
  const [customClubName, setCustomClubName] = useState("");
  const [clubSearchQuery, setClubSearchQuery] = useState("");
  const [isClubOpen, setIsClubOpen] = useState(false);
  const clubDropdownRef = useRef(null);
  const clubSearchInputRef = useRef(null);
  const [paymentUtr, setPaymentUtr] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);

  const effectiveClubName = useMemo(() => {
    if (clubName === "Other / External Club") {
      return customClubName.trim() || "External Club";
    }
    return clubName.trim();
  }, [clubName, customClubName]);

  const filteredClubOptions = useMemo(() => {
    const query = clubSearchQuery.trim();
    if (!query) return CLUB_OPTIONS;
    try {
      const regex = new RegExp(query, "i");
      return CLUB_OPTIONS.filter((club) => regex.test(club));
    } catch {
      const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const fallbackRegex = new RegExp(escaped, "i");
      return CLUB_OPTIONS.filter((club) => fallbackRegex.test(club));
    }
  }, [clubSearchQuery]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        clubDropdownRef.current &&
        !clubDropdownRef.current.contains(event.target)
      ) {
        setIsClubOpen(false);
      }
    }
    if (isClubOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isClubOpen]);

  const [myRegistration, setMyRegistration] = useState(null);
  const [allRegistrations, setAllRegistrations] = useState([]);
  const [copiedUtr, setCopiedUtr] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleCopyUtr = (utr) => {
    if (!utr) return;
    navigator.clipboard.writeText(utr);
    setCopiedUtr(true);
    setTimeout(() => setCopiedUtr(false), 2000);
    toast.success("Reference copied to clipboard");
  };

  useEffect(() => {
    async function loadEventData() {
      try {
        setLoadingEvent(true);
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
        const cleanId = id ? decodeURIComponent(id) : "ACC";

        let fetchedEvent = null;

        if (cleanId && /^[0-9a-fA-F]{24}$/.test(cleanId)) {
          const res = await fetch(`${apiUrl}/events/${cleanId}`, {
            cache: "no-store",
          }).catch(() => null);
          if (res?.ok) {
            const data = await res.json().catch(() => null);
            if (data?.event) fetchedEvent = data.event;
          }
        }

        if (!fetchedEvent) {
          const res = await fetch(`${apiUrl}/events`, {
            cache: "no-store",
          }).catch(() => null);
          if (res?.ok) {
            const data = await res.json().catch(() => null);
            const events = data?.events || [];
            fetchedEvent =
              events.find(
                (e) =>
                  e._id === cleanId ||
                  e.title?.toLowerCase() === cleanId.toLowerCase(),
              ) ||
              events.find(
                (e) =>
                  e.status === "active" ||
                  e.status === "upcoming" ||
                  e.status === "in_progress",
              ) ||
              events[0];
          }
        }

        const finalEvent = fetchedEvent || FALLBACK_EVENT;
        setEvent(finalEvent);
      } catch {
        setEvent(FALLBACK_EVENT);
      } finally {
        setLoadingEvent(false);
      }
    }

    loadEventData();
  }, [id]);

  useEffect(() => {
    async function loadUserProfile() {
      if (!isSignedIn || !authLoaded) return;
      try {
        const data = await fetchApi("/users/me");
        if (data?.success && data?.user) {
          setUserProfile(data.user);
        }
      } catch {}
    }

    loadUserProfile();
  }, [isSignedIn, authLoaded, fetchApi]);

  useEffect(() => {
    async function checkMyRegistration() {
      if (!isSignedIn || !authLoaded || !event?._id) return;

      try {
        const data = await fetchApi(
          `/event-registrations/${event._id}/my-registration`,
        );
        if (data?.success) {
          if (data.allRegistrations && Array.isArray(data.allRegistrations)) {
            setAllRegistrations(data.allRegistrations);
            if (
              data.allRegistrations.length > 0 &&
              data.allRegistrations[0].gender
            ) {
              setGender(data.allRegistrations[0].gender);
            }
          }
          if (data.registration) {
            setMyRegistration(data.registration);
          }
        } else {
          setMyRegistration(null);
          setAllRegistrations([]);
        }
      } catch {
        setMyRegistration(null);
        setAllRegistrations([]);
      }
    }

    checkMyRegistration();
  }, [event?._id, isSignedIn, authLoaded, fetchApi]);

  useEffect(() => {
    async function loadBracketPreview() {
      if (!isSignedIn || !authLoaded || !event?._id) return;
      try {
        setLoadingBracketPreview(true);
        const data = await fetchApi(
          `/event-registrations/${event._id}/preview-bracket?section=interclub`,
        );
        if (data?.success) {
          setBracketPreview(data);
        }
      } catch {
        setBracketPreview(null);
      } finally {
        setLoadingBracketPreview(false);
      }
    }

    loadBracketPreview();
  }, [isSignedIn, authLoaded, event?._id, fetchApi]);

  const interclubSection = useMemo(() => {
    if (!event?.sections) return FALLBACK_INTERCLUB_SECTION;
    return (
      event.sections.find(
        (s) =>
          s.name?.toLowerCase() === "interclub" ||
          s.name?.toLowerCase() === "inter-club" ||
          s.title?.toLowerCase().includes("inter"),
      ) || FALLBACK_INTERCLUB_SECTION
    );
  }, [event]);

  const isRegistrationOpen = useMemo(() => {
    if (!event?.registrationDeadline) return true;
    return new Date() <= new Date(event.registrationDeadline);
  }, [event]);

  const hasSoloRegistration = useMemo(() => {
    return (
      allRegistrations.some(
        (r) =>
          r.section === "open" ||
          r.section === "womens" ||
          r.section === "women",
      ) ||
      (myRegistration &&
        myRegistration.section !== "interclub" &&
        myRegistration.section !== "inter-club")
    );
  }, [allRegistrations, myRegistration]);

  const interclubRegistration = useMemo(() => {
    if (allRegistrations?.length) {
      return (
        allRegistrations.find(
          (r) =>
            r.section === "interclub" ||
            r.section === "inter-club" ||
            r.section === "inter club",
        ) || null
      );
    }
    if (
      myRegistration?.section === "interclub" ||
      myRegistration?.section === "inter-club"
    ) {
      return myRegistration;
    }
    return null;
  }, [allRegistrations, myRegistration]);

  const isPaymentConfirmed = useMemo(() => {
    return (
      interclubRegistration?.paymentStatus?.toLowerCase() === "success" ||
      interclubRegistration?.status?.toLowerCase() === "confirmed"
    );
  }, [interclubRegistration]);

  const chessAccount = userProfile?.chessAccounts?.chessCom;

  const placedBracket = useMemo(() => {
    if (!interclubSection?.brackets || interclubSection.brackets.length === 0)
      return null;
    if (interclubSection.brackets.length === 1)
      return interclubSection.brackets[0];

    if (bracketPreview?.bracket) {
      return bracketPreview.bracket;
    }

    const userRating =
      bracketPreview?.peakRating ??
      chessAccount?.ratings?.rapid ??
      chessAccount?.ratings?.bullet ??
      0;

    const matched = interclubSection.brackets.find(
      (b) =>
        (b.minRating == null || userRating >= b.minRating) &&
        (b.maxRating == null || userRating <= b.maxRating),
    );

    if (matched) return matched;

    const sorted = [...interclubSection.brackets].sort(
      (a, b) => (b.maxRating || 3000) - (a.maxRating || 3000),
    );
    if (userRating > (sorted[0].maxRating || 0)) {
      return sorted[0];
    }
    return interclubSection.brackets[0];
  }, [interclubSection, bracketPreview, chessAccount]);

  const getStepTitle = () => {
    switch (currentStep) {
      case 0:
        return "1. Club Details";
      case 1:
        return "2. Review Details";
      case 2:
        return "3. Payment";
      default:
        return "Inter-Club Registration";
    }
  };

  const isStepValid = (step) => {
    if (step === 0) return Boolean(gender) && Boolean(effectiveClubName);
    if (step === 1) return true;
    if (step === 2)
      return paymentUtr.trim() !== "" && Boolean(paymentScreenshot);
    return true;
  };

  const handleNext = () => {
    if (currentStep === 0) {
      if (!gender) {
        toast.error("Please select your gender (Male or Female).");
        return;
      }
      if (!effectiveClubName) {
        toast.error("Please select or enter your representing club / college.");
        return;
      }
      setCurrentStep(1);
    } else if (currentStep === 1) {
      setCurrentStep(2);
    } else {
      if (!paymentUtr.trim()) {
        toast.error("Please enter the payment UTR / transaction ID.");
        return;
      }
      if (!paymentScreenshot) {
        toast.error("Please upload your payment screenshot.");
        return;
      }
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
      toast.error("Please sign in to complete your inter-club registration.");
      const currentUrl = window.location.href;
      router.push(
        `/auth/sign-in?redirect_url=${encodeURIComponent(currentUrl)}`,
      );
      return;
    }

    if (!isRegistrationOpen) {
      toast.error("Registration deadline has passed for this tournament.");
      return;
    }

    if (!gender) {
      toast.error("Please select your gender (Male or Female).");
      return;
    }

    if (!effectiveClubName) {
      toast.error("Please select or enter your representing club / college.");
      return;
    }

    if (!paymentUtr.trim()) {
      toast.error("Please enter your transaction UTR.");
      return;
    }

    if (!paymentScreenshot) {
      toast.error("Please upload your payment screenshot.");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("section", "interclub");
      formData.append("bracket", placedBracket?.name || "open");
      formData.append("gender", gender);
      formData.append("isHosteler", "false");
      formData.append("utr", paymentUtr.trim());
      formData.append("screenshot", paymentScreenshot);
      formData.append("clubName", effectiveClubName);
      formData.append("teamName", effectiveClubName);
      formData.append(
        "participation",
        JSON.stringify({
          participationType: "solo",
          teamName: effectiveClubName,
          clubName: effectiveClubName,
        }),
      );

      const res = await fetchApi(`/event-registrations/${event._id}/register`, {
        method: "POST",
        body: formData,
      });

      if (res?.success) {
        toast.success(
          `Registration submitted for Inter-Club in ${event.title || "the event"}! Pending payment verification.`,
        );
        const newReg = res.registration || {
          eventId: event._id,
          section: "interclub",
          bracket: placedBracket?.name || "open",
          gender: gender,
          clubName: effectiveClubName,
          teamName: effectiveClubName,
          status: "pending",
          paymentStatus: "pending",
          utr: paymentUtr.trim(),
          paymentAmount: 80,
          createdAt: new Date().toISOString(),
        };
        setMyRegistration(newReg);
        setAllRegistrations((prev) => [
          ...prev.filter(
            (r) => r.section !== "interclub" && r.section !== "inter-club",
          ),
          newReg,
        ]);
      } else {
        toast.error(res?.message || "Failed to complete registration.");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred during registration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWithdraw = async () => {
    if (!event?._id) return;
    if (isPaymentConfirmed) {
      toast.error("Withdrawal is not allowed once payment is confirmed.");
      return;
    }

    try {
      setIsWithdrawing(true);
      const res = await fetchApi(
        `/event-registrations/${event._id}/delete?section=interclub`,
        {
          method: "DELETE",
        },
      );

      if (res?.success) {
        toast.success("Your inter-club registration has been withdrawn.");
        setAllRegistrations((prev) =>
          prev.filter(
            (r) => r.section !== "interclub" && r.section !== "inter-club",
          ),
        );
        setMyRegistration(null);
        setCurrentStep(0);
      } else {
        toast.error(res?.message || "Failed to withdraw registration.");
      }
    } catch (err) {
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
            alt="Throne of ACC Inter-Club"
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
              <p className="font-pezula text-xs uppercase tracking-[0.2em]">
                Loading Registration...
              </p>
            </div>
          ) : (
            <>
              <div className="shrink-0 mb-3">
                <div className="mb-1">
                  <h1 className="font-pezula text-xl sm:text-2xl md:text-[26px] lg:text-[30px] font-bold uppercase tracking-wider leading-[1.08] text-white drop-shadow-md">
                    <div>
                      INTER-CLUB <span className="text-[#9b1a1a]">CHESS</span>
                    </div>
                    <div className="mt-0.5">REGISTRATION</div>
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span className="text-white/40 text-[10px] sm:text-[11px] uppercase tracking-[0.16em] font-medium font-pezula">
                    {event?.title || "ACC"} &bull; Inter-Club Division
                  </span>
                  {isRegistrationOpen ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Open
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
                      Closed
                    </span>
                  )}
                </div>
              </div>

              {!interclubRegistration &&
                isRegistrationOpen &&
                !hasSoloRegistration && (
                  <div className="pb-1.5 relative z-10 flex items-center justify-between gap-3 border-b border-white/5 mb-2.5 shrink-0">
                    <h2 className="text-base sm:text-lg font-pezula uppercase tracking-tight text-white">
                      {getStepTitle()}
                    </h2>

                    {currentStep > 0 && (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="text-white/40 hover:text-white transition-colors p-1 flex items-center gap-1 text-[11px] font-normal uppercase tracking-widest shrink-0 cursor-pointer"
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
                  {hasSoloRegistration ? (
                    <motion.div
                      key="solo-guardrail"
                      variants={slideVariants}
                      initial="initial"
                      animate="animate"
                      className="p-5 rounded-2xl bg-amber-500/[0.05] border border-amber-500/20 text-center space-y-3 my-auto"
                    >
                      <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                      <h3 className="font-pezula text-base uppercase tracking-wide text-white">
                        Solo Participant Guardrail
                      </h3>
                      <p className="text-white/60 text-xs max-w-md mx-auto leading-relaxed">
                        You are registered in a solo division (Open /
                        Women&apos;s) for this tournament. Participants in solo
                        divisions cannot register for the Inter-Club division.
                      </p>
                      <div className="pt-2">
                        <Link
                          href={`/events/${event?._id || id}/register`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold uppercase tracking-wider transition-colors border border-white/10"
                        >
                          <span>View Solo Registration</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </motion.div>
                  ) : interclubRegistration ? (
                    <motion.div
                      key={`registered-view-${interclubRegistration._id || "interclub"}`}
                      variants={slideVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="relative rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md overflow-hidden my-auto"
                    >
                      <div className="p-4 sm:p-5 border-b border-white/[0.06] bg-white/[0.015]">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-white font-pezula text-base sm:text-lg uppercase tracking-wide">
                                {interclubRegistration.paymentStatus ===
                                  "success" ||
                                interclubRegistration.status === "confirmed"
                                  ? "Registration Confirmed"
                                  : interclubRegistration.paymentStatus ===
                                      "failed"
                                    ? "Payment Rejected"
                                    : "Payment Verification Pending"}
                              </h3>
                              {interclubRegistration.paymentStatus ===
                                "success" ||
                              interclubRegistration.status === "confirmed" ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              ) : interclubRegistration.paymentStatus ===
                                "failed" ? (
                                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                              ) : (
                                <Clock className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                              )}
                            </div>

                            <p className="text-white/40 text-[11px] font-mono leading-relaxed">
                              {interclubRegistration.paymentStatus ===
                                "success" ||
                              interclubRegistration.status === "confirmed"
                                ? `Confirmed registration for ${event?.title || "ACC 2026"}`
                                : interclubRegistration.paymentStatus ===
                                    "failed"
                                  ? "Payment verification was rejected."
                                  : "Your registration was recorded and is awaiting payment verification."}
                            </p>
                          </div>

                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-medium uppercase tracking-widest border shrink-0 ${
                              interclubRegistration.paymentStatus ===
                                "success" ||
                              interclubRegistration.status === "confirmed"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                : interclubRegistration.paymentStatus ===
                                    "failed"
                                  ? "bg-red-500/10 text-red-400 border-red-500/30"
                                  : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            }`}
                          >
                            {interclubRegistration.paymentStatus ===
                              "success" ||
                            interclubRegistration.status === "confirmed"
                              ? "CONFIRMED"
                              : interclubRegistration.paymentStatus === "failed"
                                ? "FAILED"
                                : "PENDING"}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 sm:p-5 py-4">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-3.5 text-xs">
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
                              Division
                            </span>
                            <span className="text-white font-medium text-xs sm:text-[13px] mt-0.5 block truncate">
                              Inter-College Section
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
                              Rating Bracket
                            </span>
                            <span className="text-white font-medium text-xs sm:text-[13px] mt-0.5 block truncate capitalize">
                              {interclubRegistration.bracket
                                ? `${interclubRegistration.bracket} Bracket`
                                : placedBracket?.name
                                  ? `${placedBracket.name} Bracket`
                                  : "Assigned"}
                            </span>
                          </div>

                          {interclubRegistration.peakRapidRating != null && (
                            <div>
                              <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
                                Peak Bullet (30d)
                              </span>
                              <span className="text-white font-mono text-xs sm:text-[13px] mt-0.5 block">
                                {interclubRegistration.peakRapidRating}{" "}
                                <span className="text-white/40 text-[11px]">
                                  ({interclubRegistration.rapidGamesCount ?? 0}{" "}
                                  games)
                                </span>
                              </span>
                            </div>
                          )}

                          {interclubRegistration.chessUsername && (
                            <div>
                              <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
                                Chess.com
                              </span>
                              <span className="text-white font-mono text-xs sm:text-[13px] mt-0.5 block">
                                @{interclubRegistration.chessUsername}
                              </span>
                            </div>
                          )}

                          {(interclubRegistration.clubName ||
                            effectiveClubName ||
                            interclubRegistration.teamName ||
                            interclubRegistration.team?.teamName) && (
                            <div className="col-span-2 pt-1 border-t border-white/[0.04]">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
                                Affiliated Organization / College
                              </span>
                              <span className="text-white font-medium text-xs sm:text-[13px] mt-0.5 block truncate">
                                {interclubRegistration.clubName ||
                                  effectiveClubName ||
                                  interclubRegistration.teamName ||
                                  interclubRegistration.team?.teamName}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="px-4 sm:px-5 py-3 border-t border-white/[0.06] bg-white/[0.02]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-6">
                            <div>
                              <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
                                Registration Fee
                              </span>
                              <span className="text-white font-mono font-semibold text-xs sm:text-sm mt-0.5 block">
                                Rs.{interclubRegistration.paymentAmount || 80}
                              </span>
                            </div>

                            {interclubRegistration.paymentScreenshotUrl && (
                              <div>
                                <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
                                  Payment Proof
                                </span>
                                <a
                                  href={
                                    interclubRegistration.paymentScreenshotUrl
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-white/80 hover:text-white text-xs font-mono inline-flex items-center gap-1.5 mt-0.5 underline transition-colors"
                                >
                                  <span>Screenshot</span>
                                  <ExternalLink className="w-2.5 h-2.5 text-white/50" />
                                </a>
                              </div>
                            )}

                            {interclubRegistration.receiptUrl && (
                              <div>
                                <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
                                  Official Receipt
                                </span>
                                <a
                                  href={interclubRegistration.receiptUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-400 hover:text-emerald-300 text-xs font-mono inline-flex items-center gap-1 mt-0.5 underline font-medium transition-colors"
                                >
                                  <span>Download PDF</span>
                                  <ExternalLink className="w-2.5 h-2.5 text-emerald-400/60" />
                                </a>
                              </div>
                            )}
                          </div>

                          {interclubRegistration.utr && (
                            <div className="flex items-center justify-between sm:justify-end gap-2 min-w-0 sm:max-w-[260px]">
                              <div className="min-w-0">
                                <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 block">
                                  Transaction Reference
                                </span>
                                <span className="text-white/90 font-mono text-[11px] truncate block select-all">
                                  {interclubRegistration.utr}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  handleCopyUtr(interclubRegistration.utr)
                                }
                                className="p-1 px-2 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors text-[10px] flex items-center gap-1 font-mono border border-white/5 shrink-0 cursor-pointer"
                                title="Copy Reference"
                              >
                                {copiedUtr ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span className="text-emerald-400">
                                      Copied
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {!isPaymentConfirmed && (
                        <div className="px-4 sm:px-5 py-2.5 bg-black/40 border-t border-white/[0.06] flex items-center justify-between text-xs">
                          <span className="text-white/40 text-[10px] sm:text-[11px]">
                            Need to withdraw before the deadline?
                          </span>

                          <AlertDialog>
                            <AlertDialogTrigger
                              disabled={isWithdrawing || !isRegistrationOpen}
                              className="text-xs text-red-400 hover:text-red-300 underline font-medium cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              Withdraw
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-[#0c0c0c] border border-white/10 text-white rounded-2xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="font-pezula uppercase tracking-wide text-lg">
                                  Withdraw Inter-Club Registration?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-white/60 text-sm">
                                  Are you sure you want to withdraw your
                                  inter-club registration for{" "}
                                  {event?.title || "ACC"}? This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-white/5 hover:bg-white/10 text-white border-white/10 rounded-xl">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleWithdraw}
                                  className="bg-[#9b1a1a] hover:bg-[#b01e1e] text-white rounded-xl"
                                >
                                  {isWithdrawing
                                    ? "Withdrawing..."
                                    : "Confirm Withdrawal"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
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
                        The registration deadline has passed for this tournament
                        cycle. Round pairings and live broadcast will be posted
                        on the event board.
                      </p>
                    </motion.div>
                  ) : (
                    <div className="space-y-3">
                      {currentStep === 0 && (
                        <motion.div
                          key="step0"
                          variants={slideVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          className="space-y-3 w-full"
                        >
                          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-pezula uppercase tracking-widest text-white/80">
                                Participant Gender{" "}
                                <span className="text-[#ff4444]">*</span>
                              </span>
                              {gender && (
                                <span className="text-[10px] font-mono uppercase text-white/60 font-medium">
                                  {gender}
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-2.5">
                              <button
                                type="button"
                                onClick={() => setGender("male")}
                                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                                  gender === "male"
                                    ? "bg-white/[0.08] border-red-500/40 text-white"
                                    : "bg-white/[0.03] border-white/10 text-white/50 hover:text-white/80 hover:bg-white/[0.06]"
                                }`}
                              >
                                <span
                                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                                    gender === "male"
                                      ? "border-red-400/80 bg-red-500/20"
                                      : "border-white/25 bg-transparent"
                                  }`}
                                >
                                  {gender === "male" && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                  )}
                                </span>
                                <span>Male</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setGender("female")}
                                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                                  gender === "female"
                                    ? "bg-white/[0.08] border-red-500/40 text-white"
                                    : "bg-white/[0.03] border-white/10 text-white/50 hover:text-white/80 hover:bg-white/[0.06]"
                                }`}
                              >
                                <span
                                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                                    gender === "female"
                                      ? "border-red-400/80 bg-red-500/20"
                                      : "border-white/25 bg-transparent"
                                  }`}
                                >
                                  {gender === "female" && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                  )}
                                </span>
                                <span>Female</span>
                              </button>
                            </div>
                          </div>

                          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h3 className="text-sm font-pezula uppercase tracking-wider text-white">
                                  {interclubSection.title ||
                                    "Inter-College Division"}
                                </h3>
                                <p className="text-[11px] text-white/50 leading-relaxed mt-0.5">
                                  {interclubSection.description ||
                                    "Championship division for visiting colleges and affiliated clubs."}
                                </p>
                              </div>
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono text-white/70 bg-white/5 border border-white/10 shrink-0">
                                {interclubSection.timeControl || "10 + 5"} Rapid
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-white/5 text-xs">
                              <div>
                                <span className="text-[9px] uppercase tracking-wider text-white/40 block font-mono">
                                  Format
                                </span>
                                <span className="text-white/80 font-medium text-[11px]">
                                  Swiss System &bull; 5 Rounds
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1.5 pt-1 relative" ref={clubDropdownRef}>
                            <div className="flex items-center justify-between">
                              <label className="block text-[11px] font-pezula uppercase tracking-wider text-white/80">
                                Representing Club <span className="text-[#ff4444]">*</span>
                              </label>
                              {clubName && (
                                <span className="text-[10px] font-mono text-white/50 truncate max-w-[200px]">
                                  {clubName}
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setIsClubOpen((prev) => {
                                  const next = !prev;
                                  if (next) {
                                    setTimeout(() => clubSearchInputRef.current?.focus(), 50);
                                  }
                                  return next;
                                });
                              }}
                              className={`w-full flex items-center justify-between bg-white/[0.04] border ${
                                isClubOpen
                                  ? "border-red-500/40 bg-white/[0.07]"
                                  : "border-white/10 hover:border-white/20"
                              } rounded-lg h-10 px-3 text-xs text-white hover:bg-white/[0.06] transition-all cursor-pointer font-mono select-none`}
                            >
                              <span className={clubName ? "text-white truncate" : "text-white/30"}>
                                {clubName || "Select Club / Organization"}
                              </span>
                              <ChevronDown
                                className={`w-3.5 h-3.5 text-white/40 shrink-0 transition-transform duration-200 ${
                                  isClubOpen ? "rotate-180 text-white" : ""
                                }`}
                              />
                            </button>

                            {isClubOpen && (
                              <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-[#0e0e0e] border border-white/15 rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-2xl animate-in fade-in-0 zoom-in-95 duration-100">
                                <div className="p-2 border-b border-white/10 bg-white/[0.02]">
                                  <div className="relative flex items-center">
                                    <Search className="w-3.5 h-3.5 absolute left-2.5 text-white/40 pointer-events-none" />
                                    <input
                                      ref={clubSearchInputRef}
                                      type="text"
                                      value={clubSearchQuery}
                                      onChange={(e) => setClubSearchQuery(e.target.value)}
                                      placeholder="Search club or organization..."
                                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-7 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-red-500/40 focus:bg-white/[0.08] font-mono transition-all"
                                    />
                                    {clubSearchQuery && (
                                      <button
                                        type="button"
                                        onClick={() => setClubSearchQuery("")}
                                        className="absolute right-2 text-white/40 hover:text-white transition-colors cursor-pointer p-0.5"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                  {clubSearchQuery && (
                                    <div className="flex items-center justify-between text-[9px] font-mono text-white/40 px-1 pt-1.5">
                                      <span>Searching: &quot;{clubSearchQuery}&quot;</span>
                                      <span>
                                        {filteredClubOptions.length} match{filteredClubOptions.length === 1 ? "" : "es"}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                <div className="max-h-52 overflow-y-auto custom-scrollbar p-1 space-y-0.5">
                                  {filteredClubOptions.length > 0 ? (
                                    filteredClubOptions.map((club) => {
                                      const isSelected = clubName === club;
                                      return (
                                        <button
                                          key={club}
                                          type="button"
                                          onClick={() => {
                                            setClubName(club);
                                            setIsClubOpen(false);
                                          }}
                                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-mono text-left transition-colors cursor-pointer ${
                                            isSelected
                                              ? "bg-white/[0.08] text-white font-medium border border-white/10"
                                              : "text-white/70 hover:text-white hover:bg-white/5 border border-transparent"
                                          }`}
                                        >
                                          <span className="truncate">{club}</span>
                                          {isSelected && (
                                            <Check className="w-3.5 h-3.5 text-red-400 shrink-0" />
                                          )}
                                        </button>
                                      );
                                    })
                                  ) : (
                                    <div className="py-5 px-3 text-center space-y-1">
                                      <p className="text-xs font-mono text-white/40">
                                        No clubs found matching &quot;{clubSearchQuery}&quot;
                                      </p>
                                      <button
                                        type="button"
                                        onClick={() => setClubSearchQuery("")}
                                        className="text-[11px] font-mono text-red-400 hover:text-red-300 underline cursor-pointer"
                                      >
                                        Clear Search
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {clubName === "Other / External Club" && (
                              <input
                                type="text"
                                value={customClubName}
                                onChange={(e) =>
                                  setCustomClubName(e.target.value)
                                }
                                placeholder="Enter club or college name"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#9b1a1a] focus:bg-white/10 transition-colors font-mono mt-1.5"
                              />
                            )}
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
                                  {isSignedIn
                                    ? clerkUser?.fullName ||
                                      "Club Representative"
                                    : "Guest Player"}
                                </span>
                                <span className="block text-white/40 text-[10px] truncate font-mono">
                                  {isSignedIn
                                    ? clerkUser?.primaryEmailAddress
                                        ?.emailAddress || "Verified Account"
                                    : "Sign in required to register"}
                                </span>
                              </div>
                            </div>

                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider text-white/70 bg-white/5 border border-white/10 shrink-0">
                              Inter-Club
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-2 text-xs">
                            <div>
                              <span className="text-white/40 block text-[9px] uppercase tracking-wider font-mono font-medium mb-0.5">
                                Chess.com Account
                              </span>
                              {chessAccount?.username ? (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-white font-mono font-semibold text-xs">
                                    @{chessAccount.username}
                                  </span>
                                  {chessAccount.verified ? (
                                    <span className="inline-flex items-center gap-0.5 text-[10px] font-mono text-emerald-400">
                                      <CheckCircle2 className="w-3 h-3" />
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-mono text-amber-400">
                                      Unverified
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-red-400 font-mono text-[11px]">
                                  No Chess.com account linked
                                </span>
                              )}
                            </div>

                            {!chessAccount?.verified && (
                              <Link
                                href="/profile"
                                className="text-[10px] text-white/60 hover:text-white underline font-mono shrink-0"
                              >
                                Manage Profile
                              </Link>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-white/5 border border-white/5 rounded-xl p-2.5">
                              <span className="text-white/40 block text-[9px] uppercase tracking-wider font-mono font-medium mb-0.5">
                                Division
                              </span>
                              <span className="text-white font-medium capitalize text-xs">
                                Inter-College
                              </span>
                            </div>

                            <div className="bg-white/5 border border-white/5 rounded-xl p-2.5">
                              <span className="text-white/40 block text-[9px] uppercase tracking-wider font-mono font-medium mb-0.5">
                                Bracket Placement
                              </span>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-white font-medium capitalize text-xs">
                                  {placedBracket?.name
                                    ? `${placedBracket.name} Bracket`
                                    : "Open Bracket"}
                                </span>
                                {placedBracket?.range && (
                                  <span className="text-white/40 font-mono text-[10px]">
                                    ({placedBracket.range})
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {effectiveClubName && (
                            <div className="bg-white/5 border border-white/5 rounded-xl p-2.5 text-xs">
                              <span className="text-white/40 block text-[9px] uppercase tracking-wider font-mono font-medium mb-0.5">
                                Affiliated Organization
                              </span>
                              <span className="text-white font-medium font-mono text-xs">
                                {effectiveClubName}
                              </span>
                            </div>
                          )}

                          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                            <span className="text-white/70 font-medium block text-[10px] uppercase font-mono tracking-wider">
                              Placement Policy
                            </span>
                            <p className="text-white/45 text-[11px] leading-relaxed">
                              Placed automatically by peak Chess.com rating in
                              the past 30 days (minimum 5 games required) for
                              fair matchmaking.
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {currentStep === 2 && (
                        <motion.div
                          key="step2"
                          variants={slideVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          className="space-y-3 w-full"
                        >
                          <div className="flex items-center justify-between gap-4 bg-white/[0.03] border border-white/10 p-3.5 rounded-xl">
                            <div className="flex-1 text-left min-w-0">
                              <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-lg font-mono font-bold text-white">
                                  Rs.80
                                </span>
                                <span className="text-[10px] font-mono uppercase tracking-wider text-white/50">
                                  Registration Fee
                                </span>
                              </div>
                              <p className="text-white/50 text-[11px] leading-relaxed mb-2 font-sans">
                                Pay via any UPI app using the QR code or ID,
                                then enter your transaction reference below.
                              </p>
                              <div className="text-[11px] font-mono text-white/80 bg-white/5 border border-white/10 px-2.5 py-1 rounded inline-block select-all">
                                8933905351@ybl
                              </div>
                            </div>

                            <div className="flex flex-col items-center justify-center shrink-0">
                              <Image
                                src="/recruitment/recruitment_payment_qr.jpeg"
                                alt="Payment QR Code"
                                width={84}
                                height={84}
                                priority
                                className="object-contain rounded-lg border border-white/10 mb-1"
                                style={{ width: "84px", height: "auto" }}
                              />
                              <span className="text-white/60 font-mono text-[9px] uppercase tracking-wider">
                                Scan to Pay
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2.5">
                            <div className="space-y-1">
                              <label className="text-[10px] font-mono uppercase tracking-wider text-white/60 block">
                                Transaction ID (UTR)
                              </label>
                              <input
                                type="text"
                                className="w-full bg-white/5 border border-white/10 text-white rounded-lg h-9 px-3 text-xs focus:outline-none focus:border-[#9b1a1a] focus:bg-white/10 placeholder:text-white/20 font-mono transition-colors"
                                value={paymentUtr}
                                onChange={(e) => setPaymentUtr(e.target.value)}
                                placeholder="12-digit transaction reference"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-mono uppercase tracking-wider text-white/60 block">
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
                                className="w-full bg-white/5 border border-white/10 text-white/70 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#9b1a1a] file:mr-3 file:py-0.5 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-mono file:font-medium file:uppercase file:tracking-wider file:bg-white/10 file:text-white hover:file:bg-white/20 file:transition-colors cursor-pointer"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </AnimatePresence>
              </div>

              <div className="pt-2.5 shrink-0 border-t border-white/5 mt-2">
                {!interclubRegistration &&
                isRegistrationOpen &&
                !hasSoloRegistration ? (
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
                          <span>Submitting Registration...</span>
                        </>
                      ) : currentStep === 2 ? (
                        <>
                          <span>Confirm Inter-Club Registration</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      ) : currentStep === 1 ? (
                        <>
                          <span>Continue to Payment</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      ) : (
                        <>
                          <span>Continue to Review</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </SpecularButton>
                ) : (
                  <Link
                    href="/events"
                    className="w-full h-11 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs uppercase tracking-widest font-pezula border border-white/10 transition-colors flex items-center justify-center cursor-pointer"
                  >
                    Return to Events Overview
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
