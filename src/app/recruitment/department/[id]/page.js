"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, ChevronLeft, CheckCircle2 } from "lucide-react";
import TaskAccordion from "@/components/TaskAccordion";

export default function DepartmentTasksPage() {
  const { id } = useParams();
  const router = useRouter();
  const fetchApi = useApi();

  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [departmentName, setDepartmentName] = useState("");

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchApi("/tasks?year=2026");
        const allTasks = data.tasks || [];

        // Filter tasks by the department code from the URL
        const deptTasks = allTasks.filter(
          (t) => t.departmentId?.code?.toLowerCase() === id?.toLowerCase(),
        );

        setTasks(deptTasks);

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

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden text-white font-sans selection:bg-[#9b1a1a]/40">
      {/* Heavy Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
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
            WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
          }}
        >
          <img
            src="/hand.png"
            alt="Hand holding chess piece"
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
      <div className="relative z-10 w-full max-w-[1920px] mx-auto px-6 lg:px-12 pb-32 mt-16 md:mt-32">
        {loading ? (
          <div className="text-center text-white/40 uppercase tracking-widest text-sm py-12">
            Fetching classified tasks...
          </div>
        ) : (
          <TaskAccordion tasks={tasks} />
        )}
      </div>
    </div>
  );
}
