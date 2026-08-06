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

export default function RecruitmentDashboard() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const fetchApi = useApi();

  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);
  const [tasks, setTasks] = useState([]);

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

      if (appRes?.myApplication?.status !== "ACTIVE") {
        setApplication(appRes?.myApplication || {});
      } else {
        setApplication(appRes.myApplication);
      }
      setTasks(tasksRes.tasks || []);
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

  const primaryDept = application.preferredDepartmentId;
  const secondaryDepts = application.secondaryDepartmentId || [];

  const getTasksForDept = (deptId) => {
    return tasks
      .filter((t) => (t.departmentId?._id || t.departmentId) === deptId)
      .sort((a, b) => a.order - b.order);
  };

  const renderTaskCard = (task) => (
    <div
      key={task._id}
      className="relative group bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 hover:border-[#ff3333]/30 transition-all duration-300"
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff3333]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            {task.title}
            {application?.submittedTaskIds?.includes(task._id) && (
              <span className="px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase bg-green-500/10 text-green-500 border border-green-500/20 rounded-full shrink-0">
                Submitted
              </span>
            )}
          </h3>
          <p className="text-sm text-white/60 line-clamp-2">{task.summary}</p>
        </div>
        {task.isRequired && (
          <span className="px-3 py-1 text-[10px] font-bold tracking-widest uppercase bg-[#ff3333]/10 text-[#ff3333] border border-[#ff3333]/20 rounded-full shrink-0">
            Required
          </span>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 text-xs text-white/50">
          {task.submission?.acceptsText && (
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3" /> Text
            </span>
          )}
          {task.submission?.acceptsLinks && (
            <span className="flex items-center gap-1">
              <LinkIcon className="w-3 h-3" /> Link
            </span>
          )}
          {task.submission?.acceptsFiles && (
            <span className="flex items-center gap-1">
              <Upload className="w-3 h-3" /> File
            </span>
          )}
        </div>

        <div className="ml-auto">
          {application?.submittedTaskIds?.includes(task._id) ? (
            <div className="bg-green-500/10 text-green-500 text-xs font-semibold tracking-wider uppercase px-4 py-2 rounded-lg flex items-center justify-center border border-green-500/20 opacity-80 cursor-not-allowed">
              Task Submitted
            </div>
          ) : (
            <Link
              href={`/recruitment/department/${task.departmentId?.code?.toLowerCase() || ""}?taskId=${task._id}`}
            >
              <div className="bg-[#444444] text-white text-xs font-semibold tracking-wider uppercase px-4 py-2 rounded-lg flex items-center justify-center hover:bg-[#ff3333] transition-colors border border-white/10 hover:border-[#ff3333]/50">
                View Task <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] pb-24">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[#050505]">
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
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505]"></div>
          <div className="absolute inset-x-0 bottom-0 h-3/2 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
        </div>
        <div className="relative z-10 text-center px-4 mt-16">
          <h1 className="font-cinzel text-4xl md:text-6xl font-bold text-white tracking-widest uppercase mb-4 drop-shadow-2xl">
            Recruitment <span className="text-[#ff3333]">Dashboard</span>
          </h1>
          <p className="font-inter text-white/70 max-w-2xl mx-auto text-sm md:text-base tracking-wide">
            Your application is currently{" "}
            <span className="font-bold text-[#ff3333] uppercase">
              {application.status}
            </span>
            . Complete the designated tasks for your selected departments below.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 mt-[-40px] relative z-20 space-y-16">
        {/* Primary Department */}
        {primaryDept && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-white uppercase tracking-widest">
                {primaryDept.name}
              </h2>
              <span className="px-3 py-1 bg-white/5 text-white/50 text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/10 shrink-0">
                Primary Choice
              </span>
            </div>
            {primaryDept.description && (
              <p className="text-white/60 text-sm">{primaryDept.description}</p>
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
          </div>
        )}

        {/* Secondary Departments */}
        {secondaryDepts.map((dept) => (
          <div key={dept._id} className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-white uppercase tracking-widest">
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
          </div>
        ))}
      </section>
    </div>
  );
}
