"use client";

import { useState } from "react";
import { Download, CheckCircle2, Send } from "lucide-react";
import TaskSubmissionModal from "./TaskSubmissionModal";

export default function TaskAccordion({ tasks, initialTaskId, submittedTasks = [] }) {
  const initialIndex = initialTaskId 
    ? tasks.findIndex(t => t._id === initialTaskId) 
    : 0;
    
  const [activeIndex, setActiveIndex] = useState(initialIndex !== -1 ? initialIndex : 0);
  const [selectedTaskForSubmit, setSelectedTaskForSubmit] = useState(null);

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center text-white/40 uppercase tracking-widest text-sm py-12 border border-white/5 rounded-3xl bg-white/[0.02]">
        No tasks found for this department.
      </div>
    );
  }

  const activeTask = tasks[activeIndex];
  const isSubmitted = submittedTasks.includes(activeTask._id);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Tab Navigation (Snack bar style) */}
      <div className="w-full max-w-[1300px] flex gap-3 overflow-x-auto pb-6 mb-4 hide-scrollbar snap-x">
        {tasks.map((task, index) => {
          const isActive = activeIndex === index;
          return (
            <button
              key={task._id}
              onClick={() => setActiveIndex(index)}
              className={`snap-start shrink-0 px-8 py-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                isActive
                  ? "bg-[#9b1a1a] text-white shadow-[0_0_20px_rgba(155,26,26,0.4)] border border-[#9b1a1a]"
                  : "bg-[#111] text-white/50 border border-white/10 hover:bg-[#1a1a1a] hover:text-white hover:border-white/20"
              }`}
            >
              Task {(index + 1).toString().padStart(2, "0")}
            </button>
          );
        })}
      </div>

      {/* Active Task Content */}
      <div className="w-full max-w-[1300px] bg-[#0a0a0a] border border-white/10 rounded-[2rem] overflow-hidden relative fade-in">
        {/* Background Watermark */}
        <div className="absolute top-0 right-0 text-[10rem] sm:text-[15rem] md:text-[20rem] font-black text-white/[0.02] pointer-events-none select-none leading-none -mt-8 sm:-mt-16 -mr-4 sm:-mr-12 z-0">
          {(activeIndex + 1).toString().padStart(2, "0")}
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="border-b border-white/5 bg-black/40 p-6 sm:p-10 md:p-16">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[#9b1a1a] text-xs font-bold uppercase tracking-[0.3em]">
                Task {(activeIndex + 1).toString().padStart(2, "0")}
              </span>
              <div className="h-px bg-[#9b1a1a] flex-grow opacity-30"></div>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white mb-6 flex items-center gap-4 flex-wrap">
              {activeTask.title}
              {isSubmitted && (
                <span className="px-3 py-1 text-sm font-bold tracking-widest uppercase bg-green-500/10 text-green-500 border border-green-500/20 rounded-full shrink-0">
                  Submitted
                </span>
              )}
            </h2>
            
            {activeTask.isRequired && (
              <div className="flex">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#9b1a1a]/10 border border-[#9b1a1a]/30 text-[#9b1a1a] text-[10px] uppercase tracking-widest font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Mandatory
                </span>
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="p-6 sm:p-10 md:p-16 space-y-12">
            {/* Goal Summary */}
            <div className="space-y-4">
              <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white/40 border-l-2 border-[#9b1a1a] pl-4">
                Goal
              </h3>
              <p className="text-white/80 leading-relaxed text-base sm:text-lg md:text-xl font-light">
                {activeTask.summary}
              </p>
            </div>

            {/* Instructions */}
            {activeTask.instructions && activeTask.instructions.length > 0 && (
              <div className="space-y-6 pt-10 border-t border-white/5">
                <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white/40 border-l-2 border-[#9b1a1a] pl-4">
                  Instructions
                </h3>
                <ul className="space-y-6">
                  {activeTask.instructions.map((inst, i) => (
                    <li key={i} className="flex items-start gap-4 text-white/70">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold mt-0.5">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed text-sm sm:text-base">{inst}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Attachments */}
            {activeTask.assets && activeTask.assets.length > 0 && (
              <div className="space-y-6 pt-10 border-t border-white/5">
                <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white/40 border-l-2 border-[#9b1a1a] pl-4">
                  Attachments
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeTask.assets.map((asset, i) => (
                    <a
                      key={i}
                      href={asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#9b1a1a]/50 hover:bg-[#9b1a1a]/5 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-black/50 flex items-center justify-center border border-white/5 group-hover:border-[#9b1a1a]/30 transition-colors shrink-0">
                        <Download className="w-5 h-5 text-white/50 group-hover:text-[#9b1a1a]" />
                      </div>
                      <div className="flex-grow overflow-hidden">
                        <p className="text-sm font-medium text-white/90 truncate group-hover:text-white transition-colors">
                          {asset.name}
                        </p>
                        <p className="text-[10px] uppercase tracking-wider text-white/40 mt-1">
                          Download Resource
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Submit Action */}
          <div className="p-6 sm:p-10 md:p-16 border-t border-white/5 bg-black/40 flex justify-end">
            {isSubmitted ? (
              <button 
                disabled
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-green-500/10 text-green-500 rounded-full font-bold uppercase tracking-widest text-sm transition-colors border border-green-500/20 cursor-not-allowed opacity-80"
              >
                Task Submitted
              </button>
            ) : (
              <button 
                onClick={() => setSelectedTaskForSubmit(activeTask)}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-[#9b1a1a] hover:bg-[#b01e1e] text-white rounded-full font-bold uppercase tracking-widest text-sm transition-colors shadow-[0_0_20px_rgba(155,26,26,0.3)] hover:shadow-[0_0_30px_rgba(155,26,26,0.5)] border border-[#ff3333]/20"
              >
                Submit Task <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <TaskSubmissionModal 
        isOpen={!!selectedTaskForSubmit} 
        onClose={() => setSelectedTaskForSubmit(null)}
        task={selectedTaskForSubmit}
      />
    </div>
  );
}
