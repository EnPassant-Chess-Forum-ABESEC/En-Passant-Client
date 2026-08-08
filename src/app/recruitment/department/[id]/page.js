"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, ChevronLeft, CheckCircle2 } from "lucide-react";
import TaskAccordion from "@/components/TaskAccordion";
import Image from "next/image";
import TaskCountdown from "@/components/TaskCountdown";
import SpecularButton from "@/components/SpecularButton";

export default function DepartmentTasksPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const fetchApi = useApi();
  const initialTaskId = searchParams.get("taskId");
  const tasksSectionRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [submittedTasks, setSubmittedTasks] = useState([]);

  const [application, setApplication] = useState(null);
  const [isRevealed, setIsRevealed] = useState(true);
  const [revealDate, setRevealDate] = useState(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const [data, appData] = await Promise.all([
          fetchApi("/tasks?year=2026"),
          fetchApi("/recruitment/my-application").catch(() => null),
        ]);
        const allTasks = data.tasks || [];

        // Filter tasks by the department code from the URL
        const deptTasks = allTasks.filter(
          (t) => t.departmentId?.code?.toLowerCase() === id?.toLowerCase(),
        );

        setTasks(deptTasks);

        if (data.isRevealed !== undefined) {
          setIsRevealed(data.isRevealed);
        }
        if (data.revealDate) {
          setRevealDate(data.revealDate);
        }

        if (appData?.myApplication) {
          setApplication(appData.myApplication);
          if (appData.myApplication.submittedTaskIds) {
            setSubmittedTasks(appData.myApplication.submittedTaskIds);
          }
        }

        if (deptTasks.length > 0) {
          setDepartmentName(deptTasks[0].departmentId.name);
        } else {
          // If no tasks are found, we can try to format the ID nicely
          setDepartmentName(id.charAt(0).toUpperCase() + id.slice(1));
        }
      } catch (err) {
        console.error("Failed to load tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadTasks();
    }
  }, [id, fetchApi]);

  useEffect(() => {
    if (!loading && tasksSectionRef.current) {
      // Scroll down so the accordion is visible after a short delay to ensure rendering
      setTimeout(() => {
        tasksSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
    }
  }, [loading]);

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden text-white font-sans selection:bg-[#9b1a1a]/40">
      {/* Heavy Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
          transform: "translateZ(0)",
          willChange: "transform",
        }}
      ></div>

      {/* Crimson Ambient Glows */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-[#9b1a1a]/10 rounded-full blur-[150px] pointer-events-none translate-x-[-20%] translate-y-[-20%]"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#9b1a1a]/5 rounded-full blur-[120px] pointer-events-none translate-x-[20%] translate-y-[20%]"></div>

      {/* Hero Section */}
      <div className="relative min-h-[60vh] md:min-h-[90vh] pt-20 flex items-center justify-end px-6 md:px-12 lg:px-24 max-w-[1920px] mx-auto z-10">
        {/* Absolute Hand Image anchored to the absolute left of the browser viewport */}
        <div
          className="absolute left-[calc(50%-50vw)] top-[55%] md:top-[60%] -translate-y-1/2 w-[95vw] md:w-[60vw] lg:w-[45vw] max-w-[850px] z-0 pointer-events-none"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, black 60%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, black 60%, transparent 100%)",
          }}
        >
          <Image
            src="/hand.png"
            alt="Hand holding chess piece"
            width={850}
            height={850}
            className="scale-x-[-1] w-full h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] object-left object-contain"
          />
        </div>
        {/* Typography */}
        <div className="relative z-10 flex flex-col items-end text-right mt-32 md:mt-0 pt-48 md:pt-0 w-full px-4">
          <h1 className="text-[14vw] md:text-[8vw] lg:text-[110px] font-black uppercase tracking-tighter leading-[0.85] text-white drop-shadow-lg break-words">
            {loading ? "..." : departmentName || "DEPARTMENT"}
          </h1>
          <h2 className="text-[16vw] md:text-[9vw] lg:text-[130px] font-black uppercase tracking-tighter leading-[0.85] text-[#9b1a1a] drop-shadow-[0_0_30px_rgba(155,26,26,0.3)]">
            TASKS
          </h2>
        </div>
      </div>

      {/* Tasks List Section */}
      <div
        ref={tasksSectionRef}
        className="relative z-10 w-full max-w-[1920px] mx-auto px-6 lg:px-12 pb-32 mt-16 md:mt-32 scroll-mt-24 flex flex-col"
      >
        {loading ? (
          <div className="text-center text-white/40 uppercase tracking-widest text-sm py-12">
            Fetching classified tasks...
          </div>
        ) : !application || application.status !== "ACTIVE" ? (
          <div className="w-full max-w-2xl mx-auto mt-12 bg-black/40 border border-[#ff3333]/20 rounded-2xl p-10 text-center backdrop-blur-md">
            <h3 className="text-xl md:text-2xl font-cinzel font-bold text-white uppercase tracking-widest mb-4">
              Access Restricted
            </h3>
            <p className="text-white/60 mb-8 font-inter">
              You must have an active recruitment application to view tasks.
              Please ensure you have completed the recruitment form and any
              pending payments.
            </p>
            <div className="flex justify-center">
              <SpecularButton onClick={() => router.push("/recruitment/apply")}>
                Complete Application
              </SpecularButton>
            </div>
          </div>
        ) : !isRevealed && revealDate ? (
          <div className="flex flex-col items-center justify-center p-12 bg-[#0a0a0a]/90 backdrop-blur-md border border-white/10 rounded-[2rem] shadow-2xl max-w-4xl mx-auto w-full mt-12">
            <h2 className="text-white/60 font-cinzel text-xl md:text-2xl uppercase tracking-widest mb-10 text-center">
              Tasks Revealing In
            </h2>
            <TaskCountdown targetDate={revealDate} />
          </div>
        ) : (
          <TaskAccordion
            tasks={tasks}
            initialTaskId={initialTaskId}
            submittedTasks={submittedTasks}
          />
        )}
      </div>
    </div>
  );
}
