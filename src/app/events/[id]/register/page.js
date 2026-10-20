"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  ExternalLink,
  Copy,
  Check,
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
  _id: "6acd6528d1a511d94bdb427d",
  title: "ACC — ABES Chess Championship 2026",
  root: "A C C",
  eventName: "ACC — ABES Chess Championship 2026",
  description:
    "The ABES Chess Championship (ACC) stands as the institute's premier collegiate chess tournament, bringing together tactical minds, strategic thinkers, and seasoned arbiters under one banner. Organized by the En Passant Chess Club, the championship serves as the proving ground to crown the undisputed chess champion of ABES Engineering College.\n\nDesigned to accommodate both rising novices and master-tier competitors, the tournament features rating-stratified brackets spanning Open and Women's divisions. Participants compete across rapid and classical time controls with official FIDE-standard regulations, full arbiter oversight, and live digital pairing boards.\n\nBeyond the silver and gold accolades, the championship awards custom goodies, memberships, etc. Prepare your openings, calculate every variation, and rise through the brackets to claim the throne.",
  format:
    "Swiss League & Knockout Finals\n\nThe championship features a multi-stage competitive progression:\n\n• Stage 1 — Swiss League Phase: All registered participants compete in a multi-round Swiss-system tournament. There is no early elimination; every participant plays all scheduled league rounds against opponents of matching tournament scores, ensuring fair and balanced competition across all rating tiers.\n\n• Stage 2 — Elimination Knockout Stage: Upon the conclusion of the Swiss league rounds, the highest-ranking seeds from each bracket advance into the single-elimination playoff bracket.\n\n• Stage 3 — The Grand Finals: The knockout playoffs culminate in the definitive top 2 finalists who clash in the official championship finals match to determine the champion, claim the champions title, and take the top prize.",
  timeControl: "10 + 5",
  participationMode: "solo",
  status: "upcoming",
  startDate: "2026-10-25T18:30:00.000Z",
  endDate: "2026-10-31T18:29:00.000Z",
  registrationDeadline: "2026-10-25T18:29:00.000Z",
  sections: [
    {
      name: "open",
      title: "Open Section",
      description: "Open Section with rating-tiered brackets",
      brackets: [
        {
          name: "beginner",
          minRating: 0,
          maxRating: 899,
          range: "0 - 899",
          totalRounds: 5,
          timeControl: "10 + 5",
          timeFormat: "10 + 5",
        },
        {
          name: "intermediate",
          minRating: 900,
          maxRating: 1499,
          range: "900 - 1499",
          totalRounds: 5,
          timeControl: "10 + 5",
          timeFormat: "10 + 5",
        },
        {
          name: "advanced",
          minRating: 1500,
          maxRating: 3000,
          range: "1500 - 3000",
          totalRounds: 5,
          timeControl: "15 + 2",
          timeFormat: "15 + 2",
        },
      ],
    },
    {
      name: "womens",
      title: "Women's Section",
      description: "women section for female participants",
      timeControl: "10 + 5",
      timeFormat: "10 + 5",
      brackets: [
        {
          name: "open",
          minRating: 0,
          maxRating: 3000,
          range: "0 - 3000",
          totalRounds: 5,
          timeControl: "10 + 5",
          timeFormat: "10 + 5",
        },
      ],
    },
  ],
  prizes: {
    label: "Prizes",
    items: [
      {
        id: "p1",
        place: "1st Place",
        reward: "Goodies + Medals, Certificate",
      },
      {
        id: "p2",
        place: "2nd Place",
        reward: "Goodies + Medals, Certificate",
      },
      {
        id: "p3",
        place: "3rd Place",
        reward: "Medal + Certificate",
      },
    ],
  },
  formatDetails: {
    overview:
      "The championship follows a two-stage hybrid progression: a comprehensive Swiss-system league phase followed by high-stakes single-elimination knockouts to crown the champion.",
    stages: [
      {
        stage: "Stage 01",
        badge: "SWISS SYSTEM",
        title: "Swiss League Phase",
        summary:
          "All registered participants begin in competitive Swiss-system league rounds. There are no early eliminations; every participant plays all scheduled rounds against opponents with equal match points.",
        bullets: [
          "Non-elimination league matches ensuring equal play opportunities for all participants.",
          "Players paired each round based on matching scores and progressive tournament records.",
          "Buchholz and Sonneborn-Berger tiebreak metrics compute definitive qualifying standings.",
        ],
      },
      {
        stage: "Stage 02",
        badge: "KNOCKOUT PLAYOFFS",
        title: "Single-Elimination Knockouts",
        summary:
          "Following the conclusion of the Swiss league rounds, the highest-ranking seeds advance directly into single-elimination knockout brackets.",
        bullets: [
          "Head-to-head sudden death duels where only victorious players advance.",
          "Seeding strictly determined by performance and tiebreak ranks from the Swiss league.",
          "High-pressure playoff encounters filtering down until only two finalists remain.",
        ],
      },
      {
        stage: "Stage 03",
        badge: "THE FINALS",
        title: "The Grand Finals (Top 2)",
        summary:
          "The knockout gauntlet narrows the entire field down to the top two finalists, who battle head-to-head in the championship decider.",
        bullets: [
          "The top 2 surviving grand finalists clash in the definitive championship match.",
          "Official arbiter oversight with standard classical/rapid clock regulations.",
          "Winner is crowned the ACC Champion and claims the 1st Place trophy and top cash prize.",
        ],
      },
    ],
  },
};

const slideVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.15, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.1, ease: "easeIn" } },
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
  const [gender, setGender] = useState("");
  const [isHosteler, setIsHosteler] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const [myRegistration, setMyRegistration] = useState(null);
  const [allRegistrations, setAllRegistrations] = useState([]);
  const [copiedUtr, setCopiedUtr] = useState(false);
  const [bracketPreview, setBracketPreview] = useState(null);
  const [loadingBracketPreview, setLoadingBracketPreview] = useState(false);

  const [paymentUtr, setPaymentUtr] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const isDraftLoadedRef = useRef(false);
  const draftStorageKey = useMemo(() => {
    const cleanId = id ? decodeURIComponent(id) : "ACC";
    return `acc_reg_draft_common_${cleanId}`;
  }, [id]);
  const draftScreenshotKey = useMemo(() => {
    const cleanId = id ? decodeURIComponent(id) : "ACC";
    return `acc_reg_screenshot_common_${cleanId}`;
  }, [id]);

  const clearDraft = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(draftStorageKey);
      sessionStorage.removeItem(draftScreenshotKey);
    } catch (e) {
      console.warn("Failed to clear registration draft:", e);
    }
  }, [draftStorageKey, draftScreenshotKey]);

  const dataURLtoFile = (dataurl, filename) => {
    try {
      const arr = dataurl.split(",");
      const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename || "payment_screenshot.png", {
        type: mime,
      });
    } catch (e) {
      console.warn("Failed to reconstruct file from dataURL:", e);
      return null;
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedDraftRaw = localStorage.getItem(draftStorageKey);
      if (savedDraftRaw) {
        const draft = JSON.parse(savedDraftRaw);
        if (
          typeof draft.currentStep === "number" &&
          draft.currentStep >= 0 &&
          draft.currentStep <= 2
        ) {
          setCurrentStep(draft.currentStep);
        }
        if (draft.selectedSectionName) {
          setSelectedSectionName(draft.selectedSectionName);
        }
        if (draft.gender) {
          setGender(draft.gender);
        }
        if (typeof draft.isHosteler === "boolean") {
          setIsHosteler(draft.isHosteler);
        }
        if (draft.paymentUtr) {
          setPaymentUtr(draft.paymentUtr);
        }
      }

      const savedScreenshotRaw = sessionStorage.getItem(draftScreenshotKey);
      if (savedScreenshotRaw) {
        const parsed = JSON.parse(savedScreenshotRaw);
        if (parsed?.data) {
          const file = dataURLtoFile(parsed.data, parsed.name);
          if (file) {
            setPaymentScreenshot(file);
          }
        }
      }
    } catch (err) {
      console.error("Failed to restore registration draft:", err);
    } finally {
      isDraftLoadedRef.current = true;
    }
  }, [draftStorageKey, draftScreenshotKey]);

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

        if (finalEvent.sections && finalEvent.sections.length > 0) {
          const validSections = finalEvent.sections.filter(
            (sec) =>
              sec.name?.toLowerCase() !== "interclub" &&
              sec.name?.toLowerCase() !== "inter-club",
          );
          const firstSec = validSections[0] || finalEvent.sections[0];
          setSelectedSectionName((prev) => prev || firstSec.name);
        }
      } catch (err) {
        console.error("Failed to load event data, using fallback:", err);
        setEvent(FALLBACK_EVENT);
        setSelectedSectionName((prev) => prev || "open");
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
            if (data.allRegistrations.length > 0) {
              const firstGender = data.allRegistrations[0].gender;
              if (firstGender) setGender(firstGender);
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
          `/event-registrations/${event._id}/preview-bracket?section=${encodeURIComponent(selectedSectionName || "open")}`,
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
  }, [isSignedIn, authLoaded, event?._id, selectedSectionName, fetchApi]);

  const availableSections = useMemo(() => {
    if (!event?.sections) return [];
    return event.sections.filter(
      (sec) =>
        sec.name?.toLowerCase() !== "interclub" &&
        sec.name?.toLowerCase() !== "inter-club",
    );
  }, [event]);

  const activeSection = useMemo(() => {
    if (!availableSections.length) return null;
    return (
      availableSections.find((s) => s.name === selectedSectionName) ||
      availableSections[0]
    );
  }, [availableSections, selectedSectionName]);

  const isRegistrationOpen = useMemo(() => {
    if (!event?.registrationDeadline) return true;
    return new Date() <= new Date(event.registrationDeadline);
  }, [event]);

  const isPaymentConfirmed = useMemo(() => {
    return (
      myRegistration?.paymentStatus?.toLowerCase() === "success" ||
      myRegistration?.status?.toLowerCase() === "confirmed"
    );
  }, [myRegistration]);

  const isWomensSelected = useMemo(() => {
    const sec = (selectedSectionName || "").toLowerCase().trim();
    return sec === "womens" || sec === "women";
  }, [selectedSectionName]);

  const hasInterclubRegistration = useMemo(() => {
    return allRegistrations.some(
      (r) =>
        r.section === "interclub" ||
        r.section === "inter-club" ||
        r.section === "inter club",
    );
  }, [allRegistrations]);

  const activeSectionRegistration = useMemo(() => {
    if (allRegistrations && allRegistrations.length > 0) {
      return (
        allRegistrations.find(
          (r) =>
            r.section?.toLowerCase().trim() ===
            selectedSectionName?.toLowerCase().trim(),
        ) || null
      );
    }
    if (
      myRegistration &&
      myRegistration.section?.toLowerCase().trim() ===
        selectedSectionName?.toLowerCase().trim()
    ) {
      return myRegistration;
    }
    return null;
  }, [allRegistrations, selectedSectionName, myRegistration]);

  const currentRegView = activeSectionRegistration;

  useEffect(() => {
    if (!isDraftLoadedRef.current || typeof window === "undefined") return;
    if (currentRegView) return;

    try {
      const draft = {
        currentStep,
        selectedSectionName,
        gender,
        isHosteler,
        paymentUtr,
      };
      localStorage.setItem(draftStorageKey, JSON.stringify(draft));
    } catch (err) {
      console.error("Failed to save registration draft:", err);
    }
  }, [
    currentStep,
    selectedSectionName,
    gender,
    isHosteler,
    paymentUtr,
    currentRegView,
    draftStorageKey,
  ]);

  useEffect(() => {
    if (!isDraftLoadedRef.current || typeof window === "undefined") return;
    if (currentRegView) return;

    if (!paymentScreenshot) {
      try {
        sessionStorage.removeItem(draftScreenshotKey);
      } catch (e) {}
      return;
    }

    if (
      paymentScreenshot instanceof File &&
      paymentScreenshot.size <= 3 * 1024 * 1024
    ) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const payload = JSON.stringify({
            name: paymentScreenshot.name,
            data: reader.result,
          });
          sessionStorage.setItem(draftScreenshotKey, payload);
        } catch (e) {
          console.warn("Could not save screenshot draft to sessionStorage:", e);
        }
      };
      reader.readAsDataURL(paymentScreenshot);
    }
  }, [paymentScreenshot, currentRegView, draftScreenshotKey]);

  const sectionFee = isWomensSelected ? 40 : 60;

  const chessAccount = userProfile?.chessAccounts?.chessCom;

  const placedBracket = useMemo(() => {
    if (!activeSection?.brackets || activeSection.brackets.length === 0)
      return null;
    if (activeSection.brackets.length === 1) return activeSection.brackets[0];

    if (bracketPreview?.bracket) {
      return bracketPreview.bracket;
    }

    const userRating =
      bracketPreview?.peakRating ??
      chessAccount?.ratings?.rapid ??
      chessAccount?.ratings?.bullet ??
      0;

    const matched = activeSection.brackets.find(
      (b) =>
        (b.minRating == null || userRating >= b.minRating) &&
        (b.maxRating == null || userRating <= b.maxRating),
    );

    if (matched) return matched;

    const sorted = [...activeSection.brackets].sort(
      (a, b) => (b.maxRating || 3000) - (a.maxRating || 3000),
    );
    if (userRating > (sorted[0].maxRating || 0)) {
      return sorted[0];
    }
    return activeSection.brackets[0];
  }, [activeSection, bracketPreview, chessAccount]);

  const handleSectionSelect = (sectionName) => {
    if (
      gender === "male" &&
      (sectionName === "womens" || sectionName === "women")
    ) {
      toast.error("Women's division is exclusive to female participants.");
      return;
    }
    setSelectedSectionName(sectionName);
  };

  const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
    if (
      selectedGender === "male" &&
      (selectedSectionName === "womens" || selectedSectionName === "women")
    ) {
      setSelectedSectionName("open");
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 0:
        return "1. Division & Details";
      case 1:
        return "2. Review Details";
      case 2:
        return "3. Payment";
      default:
        return "Registration";
    }
  };

  const isStepValid = (step) => {
    if (step === 0) {
      if (!selectedSectionName || !gender) return false;
      if (gender === "male" && isWomensSelected) return false;
      return true;
    }
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
      if (!selectedSectionName) {
        toast.error("Please choose a tournament division.");
        return;
      }
      if (gender === "male" && isWomensSelected) {
        toast.error(
          "Male participants cannot register for the Women's division.",
        );
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
      toast.error("Please sign in to complete your tournament registration.");
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

    if (gender === "male" && isWomensSelected) {
      toast.error(
        "Male participants cannot register for the Women's division.",
      );
      return;
    }

    if (!selectedSectionName) {
      toast.error("Please choose a tournament division.");
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
      formData.append("section", selectedSectionName);
      formData.append("bracket", placedBracket?.name || "open");
      formData.append("gender", gender);
      formData.append("isHosteler", String(Boolean(isHosteler)));
      formData.append("utr", paymentUtr.trim());
      formData.append("screenshot", paymentScreenshot);
      formData.append(
        "participation",
        JSON.stringify({
          participationType: "solo",
        }),
      );

      const res = await fetchApi(`/event-registrations/${event._id}/register`, {
        method: "POST",
        body: formData,
      });

      if (res?.success) {
        clearDraft();
        toast.success(
          `Registration submitted for ${event.title || "the event"}! Pending payment verification.`,
        );
        const newReg = res.registration || {
          eventId: event._id,
          section: selectedSectionName,
          bracket: placedBracket?.name || "open",
          gender: gender,
          isHosteler: Boolean(isHosteler),
          residentType: isHosteler
            ? "hosteler"
            : isWomensSelected
              ? "day_scholar"
              : null,
          status: "pending",
          paymentStatus: "pending",
          utr: paymentUtr.trim(),
          paymentAmount: sectionFee,
          createdAt: new Date().toISOString(),
        };
        setMyRegistration(newReg);
        setAllRegistrations((prev) => [
          ...prev.filter(
            (r) =>
              r.section?.toLowerCase().trim() !==
              selectedSectionName?.toLowerCase().trim(),
          ),
          newReg,
        ]);
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
    const targetSection = currentRegView?.section || selectedSectionName;
    try {
      setIsWithdrawing(true);
      const query = targetSection
        ? `?section=${encodeURIComponent(targetSection)}`
        : "";
      const res = await fetchApi(
        `/event-registrations/${event._id}/delete${query}`,
        {
          method: "DELETE",
        },
      );

      if (res?.success) {
        clearDraft();
        toast.success("Your registration has been withdrawn.");
        setAllRegistrations((prev) =>
          prev.filter(
            (r) =>
              r.section?.toLowerCase().trim() !==
              targetSection?.toLowerCase().trim(),
          ),
        );
        if (
          myRegistration?.section?.toLowerCase().trim() ===
          targetSection?.toLowerCase().trim()
        ) {
          setMyRegistration(null);
        }
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
            src="/event/registration/left_throne.png"
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
              <p className="font-pezula text-xs uppercase tracking-[0.2em]">
                Loading Tournament...
              </p>
            </div>
          ) : (
            <>
              <div className="shrink-0 mb-3">
                <h1 className="font-pezula text-xl sm:text-2xl md:text-[26px] lg:text-[30px] font-bold uppercase tracking-wider leading-[1.08] text-white drop-shadow-md">
                  <div>
                    TOURNAMENT <span className="text-[#9b1a1a]">EVENT</span>
                  </div>
                  <div className="mt-0.5">REGISTRATION</div>
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

              {allRegistrations.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {availableSections.map((sec) => {
                    const isSelected = selectedSectionName === sec.name;
                    const isSecRegistered = allRegistrations.some(
                      (r) =>
                        r.section?.toLowerCase().trim() ===
                        sec.name?.toLowerCase().trim(),
                    );
                    const isWomens =
                      sec.name?.toLowerCase() === "womens" ||
                      sec.name?.toLowerCase() === "women";
                    const isSecDisabled = gender === "male" && isWomens;

                    return (
                      <button
                        key={sec.name}
                        type="button"
                        disabled={isSecDisabled}
                        onClick={() => handleSectionSelect(sec.name)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-red-950/60 text-white border border-red-500/40"
                            : isSecDisabled
                              ? "bg-white/[0.02] text-white/20 border border-white/5 cursor-not-allowed"
                              : "bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/10"
                        }`}
                      >
                        <span>{sec.title || sec.name}</span>
                        {isSecRegistered && (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {!currentRegView &&
                isRegistrationOpen &&
                !hasInterclubRegistration && (
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
                  {hasInterclubRegistration ? (
                    <motion.div
                      key="interclub-guardrail"
                      variants={slideVariants}
                      initial="initial"
                      animate="animate"
                      className="p-5 rounded-2xl bg-amber-500/[0.05] border border-amber-500/20 text-center space-y-3 my-auto"
                    >
                      <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                      <h3 className="font-pezula text-base uppercase tracking-wide text-white">
                        Inter-Club Participant Guardrail
                      </h3>
                      <p className="text-white/60 text-xs max-w-md mx-auto leading-relaxed">
                        You are registered in the Inter-Club division for this
                        tournament. Participants representing a club cannot
                        register for solo divisions (Open or Women&apos;s).
                      </p>
                      <div className="pt-2">
                        <Link
                          href={`/events/${event?._id || id}/register/inter-club`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold uppercase tracking-wider transition-colors border border-white/10"
                        >
                          <span>View Inter-Club Registration</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </motion.div>
                  ) : currentRegView ? (
                    <motion.div
                      key={`registered-view-${currentRegView._id || currentRegView.section}`}
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
                                {currentRegView.paymentStatus === "success" ||
                                currentRegView.status === "confirmed"
                                  ? "Registration Confirmed"
                                  : currentRegView.paymentStatus === "failed"
                                    ? "Payment Rejected"
                                    : "Payment Verification Pending"}
                              </h3>
                              {currentRegView.paymentStatus === "success" ||
                              currentRegView.status === "confirmed" ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              ) : currentRegView.paymentStatus === "failed" ? (
                                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                              ) : (
                                <Clock className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                              )}
                            </div>

                            <p className="text-white/40 text-[11px] font-mono leading-relaxed">
                              {currentRegView.paymentStatus === "success" ||
                              currentRegView.status === "confirmed"
                                ? `Confirmed registration for ${event?.title || "ACC 2026"}`
                                : currentRegView.paymentStatus === "failed"
                                  ? "Payment verification was rejected."
                                  : "Your registration was recorded and is awaiting payment verification."}
                            </p>
                          </div>

                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-medium uppercase tracking-widest border shrink-0 ${
                              currentRegView.paymentStatus === "success" ||
                              currentRegView.status === "confirmed"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                : currentRegView.paymentStatus === "failed"
                                  ? "bg-red-500/10 text-red-400 border-red-500/30"
                                  : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            }`}
                          >
                            {currentRegView.paymentStatus === "success" ||
                            currentRegView.status === "confirmed"
                              ? "CONFIRMED"
                              : currentRegView.paymentStatus === "failed"
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
                            <span className="text-white font-medium text-xs sm:text-[13px] mt-0.5 block truncate capitalize">
                              {currentRegView.section || selectedSectionName}{" "}
                              Section
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
                              Rating Bracket
                            </span>
                            <span className="text-white font-medium text-xs sm:text-[13px] mt-0.5 block truncate capitalize">
                              {currentRegView.bracket
                                ? `${currentRegView.bracket} Bracket`
                                : "Assigned"}
                            </span>
                          </div>

                          {currentRegView.peakRapidRating != null && (
                            <div>
                              <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
                                Peak Bullet (30d)
                              </span>
                              <span className="text-white font-mono text-xs sm:text-[13px] mt-0.5 block">
                                {currentRegView.peakRapidRating}{" "}
                                <span className="text-white/40 text-[11px]">
                                  ({currentRegView.rapidGamesCount ?? 0} games)
                                </span>
                              </span>
                            </div>
                          )}

                          {currentRegView.chessUsername && (
                            <div>
                              <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
                                Chess.com
                              </span>
                              <span className="text-white font-mono text-xs sm:text-[13px] mt-0.5 block">
                                @{currentRegView.chessUsername}
                              </span>
                            </div>
                          )}

                          {(currentRegView.isHosteler ||
                            currentRegView.residentType === "hosteler") && (
                            <div className="col-span-2 pt-1 border-t border-white/[0.04]">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
                                Campus Residence
                              </span>
                              <span className="text-white font-medium text-xs sm:text-[13px] mt-0.5 block">
                                Hosteler
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
                                Rs.{currentRegView.paymentAmount || sectionFee}
                              </span>
                            </div>

                            {currentRegView.paymentScreenshotUrl && (
                              <div>
                                <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
                                  Payment Proof
                                </span>
                                <a
                                  href={currentRegView.paymentScreenshotUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-white/80 hover:text-white text-xs font-mono inline-flex items-center gap-1.5 mt-0.5 underline transition-colors"
                                >
                                  <span>Screenshot</span>
                                  <ExternalLink className="w-2.5 h-2.5 text-white/50" />
                                </a>
                              </div>
                            )}

                            {currentRegView.receiptUrl && (
                              <div>
                                <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
                                  Official Receipt
                                </span>
                                <a
                                  href={currentRegView.receiptUrl}
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

                          {currentRegView.utr && (
                            <div className="flex items-center justify-between sm:justify-end gap-2 min-w-0 sm:max-w-[260px]">
                              <div className="min-w-0">
                                <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 block">
                                  Transaction Reference
                                </span>
                                <span className="text-white/90 font-mono text-[11px] truncate block select-all">
                                  {currentRegView.utr}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  handleCopyUtr(currentRegView.utr)
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

                      {currentRegView.paymentStatus !== "success" &&
                        currentRegView.status !== "confirmed" && (
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
                                    Withdraw Registration?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="text-white/60 text-sm">
                                    Are you sure you want to withdraw your
                                    registration for {event?.title || "ACC"}?
                                    This action cannot be undone.
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
                    <div className="space-y-2">
                      {currentStep === 0 && (
                        <motion.div
                          key="step0"
                          variants={slideVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          className="space-y-3 w-full"
                        >
                          <div className="space-y-3 w-full">
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
                                  onClick={() => handleGenderSelect("male")}
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
                                  onClick={() => handleGenderSelect("female")}
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

                            <div className="space-y-2">
                              <span className="text-[11px] font-pezula uppercase tracking-widest text-white/80 block px-0.5">
                                Tournament Division{" "}
                                <span className="text-[#ff4444]">*</span>
                              </span>
                              {availableSections.map((sec) => {
                                const isSelected =
                                  selectedSectionName === sec.name;
                                const isWomens =
                                  sec.name?.toLowerCase() === "womens" ||
                                  sec.name?.toLowerCase() === "women";
                                const isMaleDisabled =
                                  gender === "male" && isWomens;
                                const isAlreadyRegistered =
                                  allRegistrations.some(
                                    (r) =>
                                      r.section?.toLowerCase().trim() ===
                                      sec.name?.toLowerCase().trim(),
                                  );

                                return (
                                  <button
                                    key={sec.name}
                                    type="button"
                                    disabled={isMaleDisabled}
                                    onClick={() =>
                                      handleSectionSelect(sec.name)
                                    }
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 text-left group ${
                                      isMaleDisabled
                                        ? "bg-white/[0.02] border-white/5 opacity-40 cursor-not-allowed text-white/30"
                                        : isSelected
                                          ? "bg-white/[0.06] border-red-500/40 text-white cursor-pointer"
                                          : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20 text-white/60 hover:text-white cursor-pointer"
                                    }`}
                                  >
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-[13px] sm:text-[14px] font-bold font-pezula uppercase tracking-wider block">
                                          {sec.title || sec.name}
                                        </span>
                                        {isAlreadyRegistered && (
                                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                                            Registered
                                          </span>
                                        )}
                                        {isWomens && (
                                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-pink-500/15 text-pink-400 border border-pink-500/20">
                                            Female Only
                                          </span>
                                        )}
                                      </div>
                                      <span className="text-[10px] text-white/40 font-sans block mt-0.5">
                                        {sec.description ||
                                          "Solo championship tier"}
                                      </span>
                                    </div>
                                    <span
                                      className={`text-xs font-mono font-bold shrink-0 ${
                                        isSelected
                                          ? "text-white"
                                          : "text-white/50 group-hover:text-white/80"
                                      }`}
                                    >
                                      ₹{isWomens ? 40 : 60}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>

                            {gender === "female" && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.15 }}
                                className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2.5"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="text-[11px] font-pezula uppercase tracking-widest text-white/80 shrink-0">
                                      Residence Status
                                    </span>
                                    <span className="px-1.5 py-0.5 rounded text-[11px] tracking-wider font-normal text-white/50 shrink-0">
                                      (Hostel Resident)
                                    </span>
                                  </div>
                                  {isHosteler && (
                                    <span className="px-2 py-0.5 rounded-md text-[9px] font-mono uppercase tracking-wider font-medium text-white/80 bg-white/5 border border-white/10 shrink-0">
                                      Hosteler
                                    </span>
                                  )}
                                </div>

                                <label className="flex items-start gap-3 cursor-pointer group select-none">
                                  <input
                                    type="checkbox"
                                    checked={isHosteler}
                                    onChange={(e) =>
                                      setIsHosteler(e.target.checked)
                                    }
                                    className="mt-0.5 h-4 w-4 rounded border-white/20 bg-black/40 text-[#9b1a1a] focus:ring-[#9b1a1a] focus:ring-offset-0 cursor-pointer accent-[#9b1a1a]"
                                  />
                                  <div className="space-y-0.5">
                                    <span className="text-xs text-white font-medium group-hover:text-white transition-colors block">
                                      Female Hosteler (ABES Hostel Resident)
                                    </span>
                                    <span className="text-[10px] text-white/40 block leading-tight">
                                      Check this box if you are a female
                                      participant residing in the college
                                      hostel. Leave unchecked if you are a Day
                                      Scholar.
                                    </span>
                                  </div>
                                </label>
                              </motion.div>
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
                                    ? clerkUser?.fullName || "Player"
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

                            {isHosteler && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#9b1a1a]/20 text-[#ff4444] text-[9px] font-mono font-bold border border-[#9b1a1a]/30 shrink-0">
                                Hosteler
                              </span>
                            )}
                          </div>

                          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-2 text-xs">
                            <div>
                              <span className="text-white/40 block text-[9px] uppercase tracking-wider font-bold mb-0.5">
                                Linked Chess.com Account
                              </span>
                              {chessAccount?.username ? (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-white font-mono font-semibold text-xs">
                                    @{chessAccount.username}
                                  </span>
                                  {chessAccount.verified ? (
                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8.5px] font-mono font-bold text-emerald-400">
                                      <CheckCircle2 className="w-2.5 h-2.5" />
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8.5px] font-mono font-bold text-amber-400 ">
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

                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="bg-white/5 border border-white/5 rounded-xl p-2.5">
                              <span className="text-white/40 block text-[9px] uppercase tracking-wider font-bold mb-0.5">
                                Division
                              </span>
                              <span className="text-white font-semibold capitalize font-pezula tracking-wide text-xs">
                                {activeSection?.title || selectedSectionName}
                              </span>
                            </div>

                            <div className="bg-white/5 border border-white/5 rounded-xl p-2.5">
                              <span className="text-white/40 block text-[9px] uppercase tracking-wider font-bold mb-0.5">
                                Gender
                              </span>
                              <span className="text-white font-semibold capitalize font-pezula tracking-wide text-xs">
                                {gender || "—"}
                              </span>
                            </div>

                            <div className="bg-white/5 border border-white/5 rounded-xl p-2.5">
                              <span className="text-white/40 block text-[9px] uppercase tracking-wider font-bold mb-0.5">
                                Placement
                              </span>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-white font-semibold capitalize font-pezula tracking-wide text-xs">
                                  {placedBracket?.name
                                    ? `${placedBracket.name}`
                                    : "Open"}
                                </span>
                              </div>
                            </div>
                          </div>

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
                                  Rs.{sectionFee}
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
                                {paymentScreenshot && (
                                  <span className="text-emerald-400 font-mono text-[9px] lowercase tracking-normal ml-2">
                                    ✓ (
                                    {paymentScreenshot.name ||
                                      "screenshot attached"}
                                    )
                                  </span>
                                )}
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
                {!currentRegView &&
                isRegistrationOpen &&
                !hasInterclubRegistration ? (
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
                          <span>Registering...</span>
                        </>
                      ) : currentStep === 2 ? (
                        <>
                          <span>Confirm Registration</span>
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
