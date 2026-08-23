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
  const [activeDeptId, setActiveDeptId] = useState(null);

  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], ["0%", "5%"]);

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/");
      return;
    }

    if (userId) {
      loadDashboardData();
    }
  }, [userId, isLoaded, router]);

  useEffect(() => {
    if (application && !activeDeptId) {
      setActiveDeptId(application.preferredDepartmentId?._id);
    }
  }, [application, activeDeptId]);

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
            <h3 className="text-xl font-bold font-pezula tracking-wide opacity-90 text-white mb-2">
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

  const statusDescriptions = {
    ACTIVE:
      ". Complete the designated tasks for your selected departments below.",
    TASK_SUBMITTED:
      ". Your tasks have been successfully received and are awaiting evaluation.",
    UNDER_REVIEW: ". Our core team is currently reviewing your submissions.",
    SHORTLISTED:
      ". Congratulations! You have been shortlisted. Await further instructions regarding the interview.",
    INTERVIEW: ". You are currently in the interview phase. Best of luck!",
    SELECTED: ". Congratulations! Welcome to the En Passant family.",
    REJECTED:
      ". Unfortunately, we will not be moving forward with your application at this time.",
    PAYMENT_PENDING:
      ". Complete your application process to unlock access to the designated tasks.",
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-20 pb-24">
      <section className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-x-0 -top-[5%] -bottom-[10%] z-0 bg-[#050505]"
        >
          <Image
            src="/recruitment/recruitment_dashboard_hero.png"
            alt="Dashboard Hero"
            fill
            style={{
              objectFit: "cover",
              objectPosition: "center top",
            }}
            className="opacity-50 mix-blend-lighten"
            priority
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/60 to-[#050505] z-0 pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="relative z-10 text-center px-4 mt-16"
        >
          <h1
            className="font-black uppercase tracking-wide leading-[0.85] text-white font-pezula drop-shadow-[0_0_15px_rgba(155,26,26,0.25)] mb-4"
            style={{ fontSize: "clamp(40px, 8vw, 90px)" }}
          >
            RECRUITMENT <span className="text-[#9b1a1a]">DASHBOARD</span>
          </h1>
          <p className="font-sans font-light text-[#999] max-w-2xl mx-auto text-sm md:text-lg tracking-wide mt-6">
            Your application status is{" "}
            <span className="font-bold text-[#9b1a1a] uppercase">
              {application.status === "PAYMENT_PENDING"
                ? "PAYMENT RECEIVED"
                : application.status?.replace(/_/g, " ")}
            </span>
            {/* {statusDescriptions[application.status] ||
              ". Complete your application process to unlock access to the designated tasks."} */}
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
                className="flex flex-col items-center justify-center p-6 sm:p-10 bg-[#0a0a0a]/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
              >
                <h2
                  className="font-black uppercase tracking-wide leading-[0.85] text-white font-pezula drop-shadow-[0_0_15px_rgba(155,26,26,0.25)] mb-6 sm:mb-8 text-center"
                  style={{ fontSize: "clamp(24px, 5vw, 60px)" }}
                >
                  TASKS REVEALING IN
                </h2>
                <TaskCountdown targetDate={revealDate} />
              </motion.div>
            )}

            {isRevealed &&
              (() => {
                const allDepts = [primaryDept, ...secondaryDepts].filter(
                  Boolean,
                );
                if (allDepts.length === 0) return null;

                const activeDept =
                  allDepts.find((d) => d._id === activeDeptId) || allDepts[0];

                return (
                  <div className="flex flex-col gap-10">
                    {allDepts.length > 1 && (
                      <div className="flex flex-wrap items-center gap-4">
                        {allDepts.map((dept) => {
                          const isActive = dept._id === activeDept._id;
                          return (
                            <button
                              key={dept._id}
                              onClick={() => setActiveDeptId(dept._id)}
                              className={`px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-[0.15em] transition-all duration-300 border ${
                                isActive
                                  ? "bg-[#9b1a1a]/10 text-white border-[#9b1a1a]/30 shadow-[0_0_10px_rgba(155,26,26,0.2)]"
                                  : "bg-white/[0.02] text-white/40 border-white/5 hover:bg-white/[0.05] hover:text-white/80"
                              }`}
                            >
                              {dept.name}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <motion.div
                      key={activeDept._id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-4">
                        <h2
                          className="font-bold uppercase tracking-wide leading-[0.85] text-white font-pezula drop-shadow-[0_0_15px_rgba(155,26,26,0.25)]"
                          style={{ fontSize: "clamp(30px, 6vw, 70px)" }}
                        >
                          {activeDept.name}
                        </h2>
                        <span className="px-3 py-1 bg-white/5 text-white/50 text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/10 shrink-0">
                          {activeDept._id === primaryDept?._id
                            ? "Primary Choice"
                            : "Secondary Choice"}
                        </span>
                      </div>
                      {activeDept.description && (
                        <p className="text-white/60 text-sm">
                          {activeDept.description}
                        </p>
                      )}

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                        {getTasksForDept(activeDept._id).length > 0 ? (
                          getTasksForDept(activeDept._id).map((task, i) =>
                            renderTaskCard(task, i),
                          )
                        ) : (
                          <div className="col-span-full p-8 text-center bg-white/[0.02] border border-white/5 rounded-2xl text-white/40 text-sm tracking-widest uppercase">
                            No tasks assigned for this department yet.
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                );
              })()}
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
              <div className="text-left space-y-10">
                <div>
                  <h3 className="flex items-center gap-2 text-white font-pezula font-bold uppercase tracking-wide text-xl md:text-2xl mb-4">
                    <span className="text-[#9b1a1a]">›</span>
                    Thank You for Registering
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    Your application has been successfully submitted. Thank you
                    for showing your interest in being a part of our community.
                    We&apos;re excited to have you with us.
                  </p>
                </div>
                <div>
                  <h3 className="flex items-center gap-2 text-white font-pezula font-bold uppercase tracking-wide text-xl md:text-2xl mb-4">
                    <span className="text-[#9b1a1a]">›</span>
                    One Last Step
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    We&apos;ve received your payment details, and our team will
                    verify them shortly. There&apos;s nothing you need to do
                    from your end — just sit back and relax. Once the
                    verification is complete, your dashboard will be activated.
                  </p>
                </div>
              </div>
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
