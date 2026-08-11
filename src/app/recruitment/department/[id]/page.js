"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useApi } from "@/lib/api";
import { ArrowRight } from "lucide-react";
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
      setTimeout(() => {
        tasksSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
    }
  }, [loading]);

  const isActiveOrFurther = application && [
    "ACTIVE",
    "TASK_SUBMITTED",
    "SHORTLISTED",
    "UNDER_REVIEW",
    "INTERVIEW",
    "SELECTED",
    "REJECTED",
  ].includes(application.status);

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden text-white font-sans selection:bg-[#9b1a1a]/40">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
          transform: "translateZ(0)",
          willChange: "transform",
        }}
      ></div>

      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-[#9b1a1a]/10 rounded-full blur-[150px] pointer-events-none translate-x-[-20%] translate-y-[-20%]"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#9b1a1a]/5 rounded-full blur-[120px] pointer-events-none translate-x-[20%] translate-y-[20%]"></div>

      <div className="relative min-h-[60vh] md:min-h-[90vh] pt-20 flex items-center justify-end px-6 md:px-12 lg:px-24 max-w-[1920px] mx-auto z-10">
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

        <div className="relative z-10 flex flex-col items-end text-right mt-32 md:mt-0 pt-48 md:pt-0 w-full px-4">
          <h1 className="text-[14vw] md:text-[8vw] lg:text-[110px] font-black uppercase tracking-tighter leading-[0.85] text-white drop-shadow-lg break-words">
            {loading ? "..." : departmentName || "DEPARTMENT"}
          </h1>
          <h2 className="text-[16vw] md:text-[9vw] lg:text-[130px] font-black uppercase tracking-tighter leading-[0.85] text-[#9b1a1a] drop-shadow-[0_0_30px_rgba(155,26,26,0.3)]">
            TASKS
          </h2>
        </div>
      </div>

      <div
        ref={tasksSectionRef}
        className="relative z-10 w-full max-w-[1920px] mx-auto px-6 lg:px-12 pb-32 mt-16 md:mt-32 scroll-mt-24 flex flex-col"
      >
        {loading ? (
          <div className="text-center text-white/40 uppercase tracking-widest text-sm py-12">
            Fetching classified tasks...
          </div>
        ) : !isActiveOrFurther ? (
          <div className="w-full max-w-2xl mx-auto mt-12 bg-white/[0.02] border border-white/10 rounded-[2rem] p-12 text-center backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
            {application?.status === "PAYMENT_PENDING" ? (
              <>
                <h3 className="text-xl md:text-2xl font-cinzel font-bold text-white uppercase tracking-widest mb-4">
                  Payment Under Review
                </h3>
                <p className="text-white/60 max-w-md mx-auto leading-relaxed">
                  Your payment details have been received and are currently
                  being verified by our administrators. You will gain access to
                  the tasks once your payment is approved.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-xl md:text-2xl font-cinzel font-bold text-white uppercase tracking-widest mb-4">
                  Access Restricted
                </h3>
                <p className="text-white/60 mb-8 max-w-md mx-auto leading-relaxed">
                  You must have an active recruitment application to view tasks.
                  Please ensure you have completed the recruitment form and any
                  pending payments.
                </p>
                <div className="max-w-[280px] mx-auto">
                  <SpecularButton
                    onClick={() => router.push("/recruitment/apply")}
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
                      <span>Complete Application</span>
                      <span className="text-[11px] group-hover:translate-x-1 transition-transform">
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    </div>
                  </SpecularButton>
                </div>
              </>
            )}
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
