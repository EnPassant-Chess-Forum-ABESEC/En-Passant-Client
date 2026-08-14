"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useApi } from "@/lib/api";
import {
  Loader2,
  ArrowRight,
  FileText,
  Upload,
  Link as LinkIcon,
} from "lucide-react";
import SpecularButton from "@/components/SpecularButton";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import TaskCountdown from "@/components/TaskCountdown";

export default function RecruitmentDashboard() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const fetchApi = useApi();

  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isRevealed, setIsRevealed] = useState(true);
  const [revealDate, setRevealDate] = useState(null);

  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], ["0%", "15%"]);

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/");
      return;
    }

    if (userId) {
      loadDashboardData();
    }
  }, [userId, isLoaded, router]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [appRes, tasksRes] = await Promise.all([
        fetchApi("/recruitment/my-application"),
        fetchApi("/tasks?year=2026").catch(() => ({ tasks: [] })),
      ]);

      setApplication(appRes?.myApplication || null);
      setTasks(tasksRes.tasks || []);

      if (tasksRes.isRevealed !== undefined) {
        setIsRevealed(tasksRes.isRevealed);
      }
      if (tasksRes.revealDate) {
        setRevealDate(tasksRes.revealDate);
      }
    } catch (err) {
      console.error(err);
      router.push("/recruitment");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <Loader2 className="w-8 h-8 text-[#ff3333] animate-spin" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">No Application Found</h2>
          <SpecularButton onClick={() => router.push("/recruitment")}>
            Go Back
          </SpecularButton>
        </div>
      </div>
    );
  }

  const isActiveOrFurther = [
    "ACTIVE",
    "TASK_SUBMITTED",
    "SHORTLISTED",
    "UNDER_REVIEW",
    "INTERVIEW",
    "SELECTED",
    "REJECTED",
  ].includes(application.status);

  const primaryDept = application.preferredDepartmentId;
  const secondaryDepts = application.secondaryDepartmentId || [];

  const getTasksForDept = (deptId) => {
    return tasks
      .filter((t) => (t.departmentId?._id || t.departmentId) === deptId)
      .sort((a, b) => a.order - b.order);
  };

  const renderTaskCard = (task, index = 0) => {
    const hidden = !isRevealed;

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.1 * index,
          ease: [0.16, 1, 0.3, 1],
        }}
        key={task._id}
        className={`relative group bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 hover:border-[#ff3333]/30 transition-all duration-300 flex flex-col h-full ${hidden ? "opacity-80" : ""}`}
      >
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff3333]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              {hidden ? "Task Details Hidden" : task.title}
            </h3>
            <p className="text-sm text-white/60 line-clamp-2">
              {hidden
                ? "This task will be revealed once the designated countdown is over. Prepare yourself."
                : task.summary}
            </p>
          </div>
          {task.isRequired && (
            <span className="px-3 py-1 text-[10px] font-bold tracking-widest uppercase bg-[#ff3333]/10 text-[#ff3333] border border-[#ff3333]/20 rounded-full shrink-0">
              Required
            </span>
          )}
        </div>

        <div className="mt-auto pt-6 w-full">
          {hidden ? (
            <div className="w-full bg-[#111] text-white/40 text-xs font-semibold tracking-wider uppercase px-4 py-3 rounded-lg flex items-center justify-center border border-white/5 opacity-80 cursor-not-allowed">
              Locked
            </div>
          ) : application?.submittedTaskIds?.includes(task._id) ? (
            <div className="w-full bg-green-500/10 text-green-500 text-xs font-semibold tracking-wider uppercase px-4 py-3 rounded-lg flex items-center justify-center border border-green-500/20 opacity-80 cursor-not-allowed">
              Task Submitted
            </div>
          ) : (
            <Link
              href={`/recruitment/department/${task.departmentId?.code?.toLowerCase() || ""}?taskId=${task._id}`}
              className="block w-full"
            >
              <div className="w-full bg-white/5 text-white text-xs font-semibold tracking-wider uppercase px-4 py-3 rounded-lg flex items-center justify-center hover:bg-[#ff3333]/20 transition-colors border border-white/10 hover:border-[#ff3333]/50">
                View Task <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </Link>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] pb-24">
      <section className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-x-0 -top-[20%] -bottom-[20%] z-0 bg-[#050505]"
        >
          <Image
            src="/recruitment_dashboard_hero.png"
            alt="Dashboard Hero"
            fill
            style={{
              objectFit: "cover",
              objectPosition: "center 15%",
            }}
            className="opacity-60 mix-blend-lighten"
            priority
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505] z-0 pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-0 pointer-events-none"></div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="relative z-10 text-center px-4 mt-16"
        >
          <h1 className="font-pezula text-4xl md:text-6xl font-bold text-white tracking-widest uppercase mb-4 drop-shadow-2xl">
            Recruitment <span className="text-[#ff3333]">Dashboard</span>
          </h1>
          <p className="font-pezula text-white/70 max-w-2xl mx-auto text-sm md:text-base tracking-wide">
            Your application is currently{" "}
            <span className="font-bold text-[#ff3333] uppercase">
              {application.status?.replace(/_/g, " ")}
            </span>
            {isActiveOrFurther
              ? ". Complete the designated tasks for your selected departments below."
              : ". Complete your application process to unlock access to the designated tasks."}
          </p>
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto px-4 md:px-8 mt-[-40px] relative z-20 space-y-16">
        {isActiveOrFurther ? (
          <>
            {!isRevealed && revealDate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="flex flex-col items-center justify-center p-10 bg-[#0a0a0a]/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl"
              >
                <h2 className="text-white/60 font-pezula text-lg md:text-xl uppercase tracking-widest mb-8">
                  Tasks Revealing In
                </h2>
                <TaskCountdown targetDate={revealDate} />
              </motion.div>
            )}

            {isRevealed && primaryDept && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4">
                  <h2 className="font-pezula text-2xl md:text-3xl font-bold text-white uppercase tracking-widest">
                    {primaryDept.name}
                  </h2>
                  <span className="px-3 py-1 bg-white/5 text-white/50 text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/10 shrink-0">
                    Primary Choice
                  </span>
                </div>
                {primaryDept.description && (
                  <p className="text-white/60 text-sm">
                    {primaryDept.description}
                  </p>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  {getTasksForDept(primaryDept._id).length > 0 ? (
                    getTasksForDept(primaryDept._id).map(renderTaskCard)
                  ) : (
                    <div className="col-span-full p-8 text-center bg-white/[0.02] border border-white/5 rounded-2xl text-white/40 text-sm tracking-widest uppercase">
                      No tasks assigned for this department yet.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {isRevealed &&
              secondaryDepts.map((dept, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + idx * 0.1 }}
                  key={dept._id}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4">
                    <h2 className="font-pezula text-2xl md:text-3xl font-bold text-white uppercase tracking-widest">
                      {dept.name}
                    </h2>
                    <span className="px-3 py-1 bg-white/5 text-white/50 text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/10 shrink-0">
                      Secondary Choice
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    {getTasksForDept(dept._id).length > 0 ? (
                      getTasksForDept(dept._id).map(renderTaskCard)
                    ) : (
                      <div className="col-span-full p-8 text-center bg-white/[0.02] border border-white/5 rounded-2xl text-white/40 text-sm tracking-widest uppercase">
                        No tasks assigned for this department yet.
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="w-full max-w-2xl mx-auto bg-white/[0.02] border border-white/10 rounded-[2rem] p-12 text-center backdrop-blur-xl shadow-2xl mt-12 relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
            {application.status === "PAYMENT_PENDING" ? (
              <>
                <h3 className="text-xl md:text-2xl font-pezula font-bold text-white uppercase tracking-widest mb-4">
                  Payment Under Review
                </h3>
                <p className="text-white/60 max-w-md mx-auto leading-relaxed">
                  Your payment details have been received and are currently
                  being verified by our administrators. You will gain access to
                  the dashboard once your payment is approved.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-xl md:text-2xl font-pezula font-bold text-white uppercase tracking-widest mb-4">
                  Access Restricted
                </h3>
                <p className="text-white/60 mb-8 max-w-md mx-auto leading-relaxed">
                  You must have an active recruitment application to view and
                  participate in tasks. Please ensure you have filled the
                  recruitment form.
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
          </motion.div>
        )}
      </section>
    </div>
  );
}
