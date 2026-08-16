"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, CheckCircle2, Send, Loader2 } from "lucide-react";
import TaskSubmissionModal from "./TaskSubmissionModal";

export default function TaskAccordion({
  tasks,
  initialTaskId,
  submittedTasks = [],
  departmentId,
}) {
  const initialIndex = initialTaskId
    ? tasks.findIndex((t) => t._id === initialTaskId)
    : 0;

  const [activeIndex, setActiveIndex] = useState(
    initialIndex !== -1 ? initialIndex : 0,
  );
  const [direction, setDirection] = useState(1);
  const [selectedTaskForSubmit, setSelectedTaskForSubmit] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleSelect = (index) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const handleDownloadAllAssets = async () => {
    setIsDownloading(true);
    try {
      const { saveAs } = await import("file-saver");
      const response = await fetch(
        `/api/download-assets?dept=${departmentId}&task=${activeIndex + 1}`,
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to download assets");
      }
      const blob = await response.blob();
      saveAs(blob, `Task_${activeIndex + 1}_Assets.zip`);
    } catch (error) {
      console.error("Error downloading static assets:", error);
      alert(
        error.message ||
          "Failed to download assets. Please make sure the assets exist.",
      );
    } finally {
      setIsDownloading(false);
    }
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center text-white/40 uppercase tracking-widest text-sm py-12 border border-white/5 rounded-3xl bg-white/[0.02]">
        No tasks found for this department.
      </div>
    );
  }

  const activeTask = tasks[activeIndex];
  const isSubmitted = submittedTasks.includes(activeTask._id);

  const contentVariants = {
    enter: (dir) => ({
      opacity: 0,
      y: dir > 0 ? 18 : -18,
      filter: "blur(4px)",
    }),
    center: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
    },
    exit: (dir) => ({
      opacity: 0,
      y: dir > 0 ? -18 : 18,
      filter: "blur(4px)",
      transition: { duration: 0.25, ease: [0.4, 0, 1, 1] },
    }),
  };

  return (
    <div className="h-full min-h-0 w-full flex flex-col lg:flex-row gap-3 lg:gap-6">
      <div className="flex lg:hidden flex-row gap-2 overflow-x-auto hide-scrollbar pb-1 snap-x shrink-0">
        {tasks.map((task, index) => {
          const isActive = activeIndex === index;
          const submitted = submittedTasks.includes(task._id);
          return (
            <button
              key={task._id}
              onClick={() => handleSelect(index)}
              className={`snap-start shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] border transition-all duration-300 ${
                isActive
                  ? "bg-[#9b1a1a]/20 border-[#9b1a1a]/60 text-white shadow-[0_0_12px_rgba(155,26,26,0.3)]"
                  : "bg-white/[0.04] border-white/10 text-white/50"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-300 ${
                  submitted
                    ? "bg-green-500"
                    : isActive
                      ? "bg-[#ff4444]"
                      : "bg-white/20"
                }`}
              />
              Task {index + 1}
              {submitted && (
                <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      <div className="hidden lg:flex shrink-0 lg:w-[380px] flex-col gap-4 overflow-y-auto overflow-x-hidden hide-scrollbar">
        {tasks.map((task, index) => {
          const isActive = activeIndex === index;
          const submitted = submittedTasks.includes(task._id);
          return (
            <motion.button
              key={task._id}
              onClick={() => handleSelect(index)}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full relative px-6 py-8 rounded-2xl transition-all duration-300 border flex flex-col items-center justify-center gap-3 backdrop-blur-sm ${
                isActive
                  ? "bg-[#9b1a1a]/15 border-[#9b1a1a]/50 shadow-[0_0_24px_rgba(155,26,26,0.25)]"
                  : "bg-white/[0.03] border-white/10 hover:bg-white/[0.08] hover:border-white/20"
              }`}
            >
              <span
                className={`relative z-10 absolute top-4 left-5 text-[11px] uppercase tracking-[0.25em] font-black transition-colors duration-300 ${isActive ? "text-[#ff4444]" : "text-white/50"}`}
              >
                Task {index + 1}
              </span>

              <div className="relative z-10 flex w-full flex-col items-center justify-center mt-3">
                <p
                  className={`text-lg text-center font-black leading-snug transition-colors duration-300 ${
                    isActive ? "text-white drop-shadow-md" : "text-white/70"
                  }`}
                >
                  {task.title.replace(/^Task\s*\d+:\s*/i, "")}
                </p>

                <div className="flex items-center justify-center gap-3 mt-3">
                  {task.isRequired && (
                    <span
                      className={`text-[11px] uppercase tracking-widest font-bold transition-colors duration-300 ${isActive ? "text-[#ff4444]/80" : "text-white/40"}`}
                    >
                      Required
                    </span>
                  )}
                  {submitted && (
                    <span className="text-[11px] uppercase tracking-widest font-bold text-green-500/80">
                      ✓ Submitted
                    </span>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* ── Task Detail Panel ── */}
      <div
        className="flex-1 min-h-0 min-w-0 flex flex-col bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl relative font-sans"
        style={{ overflow: "hidden" }}
      >
        {/* Header */}
        <div className="border-b border-white/20 bg-[#0a0a0a] px-5 sm:px-10 lg:px-12 py-4 sm:py-8 shrink-0 z-20">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`header-${activeIndex}`}
              custom={direction}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <div className="flex items-center gap-3 mb-2 sm:mb-4">
                <span className="text-[#9b1a1a] text-xs font-bold uppercase tracking-[0.3em]">
                  Task {(activeIndex + 1).toString().padStart(2, "0")}
                </span>
                <div className="h-px bg-[#9b1a1a]/30 flex-grow" />
                {activeTask.isRequired && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#9b1a1a]/10 border border-[#9b1a1a]/30 text-[#9b1a1a] text-[10px] uppercase tracking-widest font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mandatory
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold font-sans text-white leading-tight">
                {activeTask.title.replace(/^Task\s*\d+:\s*/i, "")}
              </h2>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Scrollable body */}
        <div
          className="flex-1 min-h-0 overflow-y-auto relative z-10 hide-scrollbar"
          style={{ overflowY: "auto", overscrollBehavior: "contain" }}
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
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`body-${activeIndex}`}
              custom={direction}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="px-5 sm:px-10 lg:px-12 py-5 sm:py-10 space-y-8 sm:space-y-10"
            >
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-sm md:text-lg font-pezula uppercase tracking-[0.1em] font-normal text-white/70 border-l-2 border-[#9b1a1a] pl-4">
                  Goal
                </h3>
                <p className="text-white/85 leading-relaxed text-sm sm:text-lg font-light">
                  {activeTask.summary}
                </p>
              </div>

              {activeTask.instructions &&
                activeTask.instructions.length > 0 && (
                  <div className="space-y-4 sm:space-y-5 pt-2 sm:pt-4">
                    <h3 className="text-sm md:text-lg font-pezula uppercase tracking-[0.1em] font-normal text-white/70 border-l-2 border-[#9b1a1a] pl-4">
                      Instructions
                    </h3>
                    <ul className="space-y-3 sm:space-y-4">
                      {(() => {
                        let stepNumber = 1;
                        return activeTask.instructions.map((inst, i) => {
                          const isHeading =
                            inst.trim().startsWith("---") &&
                            inst.trim().endsWith("---");

                          if (isHeading) {
                            const headingText = inst.replace(/-/g, "").trim();
                            return (
                              <li key={i} className="pt-4 pb-1 first:pt-2">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#9b1a1a]/10 border border-[#9b1a1a]/20">
                                  <span className="text-[#9b1a1a] text-xs font-bold uppercase tracking-widest">
                                    {headingText}
                                  </span>
                                </div>
                              </li>
                            );
                          }

                          const currentStep = stepNumber++;
                          return (
                            <li
                              key={i}
                              className="flex items-start gap-3 sm:gap-4 text-white/80"
                            >
                              <span className="flex-shrink-0 text-white/50 font-bold mt-0.5 text-sm sm:text-base w-5 sm:w-6">
                                {currentStep}.
                              </span>
                              <span className="leading-relaxed text-sm sm:text-base">
                                {inst}
                              </span>
                            </li>
                          );
                        });
                      })()}
                    </ul>
                  </div>
                )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`footer-${activeIndex}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`shrink-0 px-5 sm:px-10 lg:px-12 py-4 sm:py-5 border-t border-white/5 bg-black/40 flex flex-col sm:flex-row gap-3 sm:gap-4 ${activeTask.containsAssets ? "sm:justify-between" : "sm:justify-end"} items-center relative z-10`}
          >
            {activeTask.containsAssets && (
              <button
                onClick={handleDownloadAllAssets}
                disabled={isDownloading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-full font-bold uppercase tracking-widest text-[10px] sm:text-xs transition-colors border border-white/10"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Zipping...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" /> Download Assets
                  </>
                )}
              </button>
            )}

            {isSubmitted ? (
              <button
                disabled
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-8 py-2.5 sm:py-3.5 bg-green-500/10 text-green-500 rounded-full font-bold uppercase tracking-widest text-[10px] sm:text-xs border border-green-500/20 cursor-not-allowed opacity-80"
              >
                <CheckCircle2 className="w-4 h-4" /> Task Submitted
              </button>
            ) : (
              <button
                onClick={() => setSelectedTaskForSubmit(activeTask)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-8 py-2.5 sm:py-3.5 bg-[#9b1a1a] hover:bg-[#b01e1e] text-white rounded-full font-bold uppercase tracking-widest text-[10px] sm:text-xs transition-colors shadow-[0_0_16px_rgba(155,26,26,0.3)] hover:shadow-[0_0_28px_rgba(155,26,26,0.5)] border border-[#ff3333]/20"
              >
                Submit Task <Send className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <TaskSubmissionModal
        isOpen={!!selectedTaskForSubmit}
        onClose={() => setSelectedTaskForSubmit(null)}
        task={selectedTaskForSubmit}
      />
    </div>
  );
}
