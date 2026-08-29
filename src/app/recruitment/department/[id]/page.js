"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useApi } from "@/lib/api";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
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
  const [departmentDesc, setDepartmentDesc] = useState("");
  const [submittedTasks, setSubmittedTasks] = useState([]);

  const [application, setApplication] = useState(null);
  const [isRevealed, setIsRevealed] = useState(true);
  const [revealDate, setRevealDate] = useState(null);
  const [submissionEndDate, setSubmissionEndDate] = useState(null);

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
        if (data.submissionEndDate) {
          setSubmissionEndDate(data.submissionEndDate);
        }

        if (appData?.myApplication) {
          setApplication(appData.myApplication);
          if (appData.myApplication.submittedTaskIds) {
            setSubmittedTasks(appData.myApplication.submittedTaskIds);
          }
        }

        if (deptTasks.length > 0) {
          setDepartmentName(deptTasks[0].departmentId.name);
          if (deptTasks[0].departmentId.description) {
            setDepartmentDesc(deptTasks[0].departmentId.description);
          }
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

  const isActiveOrFurther =
    application &&
    [
      "ACTIVE",
      "TASK_SUBMITTED",
      "UNDER_REVIEW",
      "INTERVIEW",
      "SELECTED",
      "REJECTED",
    ].includes(application.status);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="h-screen bg-[#050505] relative overflow-hidden text-white font-sans selection:bg-[#9b1a1a]/40 flex flex-col">
      <div className="absolute top-0 left-0 w-full md:w-[60%] h-full z-0 pointer-events-none">
        <Image
          src="/recruitment/lonely_pawn.png"
          alt="Lonely Pawn Background"
          fill
          className="object-cover object-[80%_center] opacity-40"
          priority
        />
        <div className="absolute inset-x-0 top-0 h-[35vh] bg-gradient-to-b from-[#050505] via-[#050505]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#050505]" />
        <div className="absolute inset-x-0 bottom-0 h-[20vh] bg-gradient-to-t from-[#050505] to-transparent" />
      </div>

      <motion.div 
        className="relative z-10 flex flex-col flex-1 min-h-0 pt-20 lg:pt-24 pb-6 px-6 md:px-10 lg:px-16 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="shrink-0 px-2">
          <h1 className="text-[10vw] md:text-[5vw] lg:text-[60px] font-pezula uppercase tracking-wide leading-none text-white drop-shadow-lg break-words">
            {loading ? "..." : departmentName || "DEPARTMENT"}
          </h1>
        </motion.div>
        <motion.div variants={itemVariants} ref={tasksSectionRef} className="flex-1 min-h-0 w-full">
          {loading ? (
            <div className="text-center text-white/40 uppercase tracking-widest text-sm py-12">
              Fetching classified tasks...
            </div>
          ) : !isActiveOrFurther ? (
            <div className="w-full max-w-2xl mx-auto mt-8 bg-white/[0.02] border border-white/10 rounded-[2rem] p-12 text-center backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              {application?.status === "PAYMENT_PENDING" ? (
                <>
                  <h3 className="text-xl md:text-2xl font-pezula font-bold text-white uppercase tracking-widest mb-4">
                    Payment Under Review
                  </h3>
                  <p className="text-white/60 max-w-md mx-auto leading-relaxed">
                    Your payment details have been received and are currently
                    being verified by our administrators. You will gain access
                    to the tasks once your payment is approved.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-xl md:text-2xl font-pezula font-bold text-white uppercase tracking-widest mb-4">
                    Access Restricted
                  </h3>
                  <p className="text-white/60 mb-8 max-w-md mx-auto leading-relaxed">
                    You must have an active recruitment application to view
                    tasks. Please ensure you have completed the recruitment form
                    and any pending payments.
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
            <div className="flex flex-col items-center justify-center p-12 bg-[#0a0a0a]/90 backdrop-blur-md border border-white/10 rounded-[2rem] shadow-2xl max-w-4xl mx-auto w-full mt-8">
              <h2 className="text-white/60 font-pezula text-xl md:text-2xl uppercase tracking-widest mb-10 text-center">
                Tasks Revealing In
              </h2>
              <TaskCountdown targetDate={revealDate} />
            </div>
          ) : (
            <TaskAccordion
              tasks={tasks}
              initialTaskId={initialTaskId}
              submittedTasks={submittedTasks}
              departmentId={id}
              submissionEndDate={submissionEndDate}
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
