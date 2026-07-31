"use client";

import { useState } from "react";
import { Download, CheckCircle2, Send } from "lucide-react";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function TaskAccordion({ tasks }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center text-white/40 uppercase tracking-widest text-sm py-12 border border-white/5 rounded-3xl bg-white/[0.02]">
        No tasks found for this department.
      </div>
    );
  }

  return (
    <div className="flex justify-end w-full h-[75vh] min-h-[600px] max-h-[850px] gap-2 md:gap-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8 px-2">
      {tasks.map((task, index) => {
        const isActive = activeIndex === index;

        return (
          <div
            key={task._id}
            onClick={() => setActiveIndex(index)}
            className={`
              relative h-full flex-shrink-0 rounded-[2rem] overflow-hidden cursor-pointer snap-center
              bg-[#0a0a0a] border border-white/10 group
              transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
              ${
                isActive
                  ? "flex-[20_1_0%] min-w-[60px] max-w-[2000px]"
                  : "flex-[1_1_0%] min-w-[60px] max-w-[80px] md:max-w-[100px] hover:border-white/30 hover:bg-[#111]"
              }
            `}
          >
            {/* INACTIVE STATE CONTENT (Slice Preview) */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 ease-in-out ${
                isActive ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <div className="flex flex-col items-center gap-6">
                <span className="text-white/20 font-black text-2xl rotate-[-90deg]">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <div className="h-24 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                <span className="text-[#9b1a1a] font-bold text-sm tracking-[0.3em] uppercase rotate-[-90deg] whitespace-nowrap">
                  Task
                </span>
              </div>
            </div>

            {/* ACTIVE STATE CONTENT */}
            <div
              className={`absolute top-0 left-0 h-full w-[3000px] overflow-y-auto overflow-x-hidden hide-scrollbar transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isActive ? "opacity-100 delay-150" : "opacity-0 pointer-events-none"
              }`}
            >
              <div className="relative min-h-full flex flex-col">
                {/* Background Number Watermark */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#9b1a1a]/50 to-transparent" />

                <CardHeader className="relative z-10 border-b border-white/5 bg-black/40 p-8 md:p-12 lg:p-16 shrink-0">
                  <div className="w-[calc(100vw-6rem)] md:w-[calc(100vw-12rem)] lg:w-[calc(100vw-18rem)] max-w-[1300px] relative">
                    <div className="absolute -top-12 right-0 text-[12rem] font-black text-white/[0.02] pointer-events-none select-none z-0">
                      {(index + 1).toString().padStart(2, "0")}
                    </div>
                    <div className="flex items-center gap-4 mb-4 relative z-10">
                      <div className="h-px bg-[#9b1a1a] flex-grow opacity-50"></div>
                      <span className="text-[#9b1a1a] text-xs font-bold uppercase tracking-[0.3em]">
                        Task {(index + 1).toString().padStart(2, "0")}
                      </span>
                      <div className="h-px bg-[#9b1a1a] flex-grow opacity-50"></div>
                    </div>
                    <CardTitle className="text-3xl md:text-5xl font-black tracking-tight text-white text-center relative z-10">
                      {task.title}
                    </CardTitle>
                    {task.isRequired && (
                      <div className="flex justify-center mt-6 relative z-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9b1a1a]/10 border border-[#9b1a1a]/30 text-[#9b1a1a] text-[10px] uppercase tracking-widest font-bold">
                          <CheckCircle2 className="w-3 h-3" /> Mandatory
                        </span>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 p-8 md:p-12 lg:p-16 space-y-12 flex-grow">
                  <div className="w-[calc(100vw-6rem)] md:w-[calc(100vw-12rem)] lg:w-[calc(100vw-18rem)] max-w-[1300px] space-y-12">
                    {/* Goal Summary */}
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 border-l-2 border-[#9b1a1a] pl-3">
                        Goal
                      </h3>
                      <p className="text-white/80 leading-relaxed text-lg md:text-xl font-light">
                        {task.summary}
                      </p>
                    </div>

                    {/* Instructions */}
                    {task.instructions && task.instructions.length > 0 && (
                      <div className="space-y-6 pt-8 border-t border-white/5">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 border-l-2 border-[#9b1a1a] pl-3">
                          Instructions
                        </h3>
                        <ul className="space-y-6">
                          {task.instructions.map((inst, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-4 text-white/70"
                            >
                              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold mt-0.5">
                                {i + 1}
                              </span>
                              <span className="leading-relaxed text-base">{inst}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Attachments */}
                    {task.assets && task.assets.length > 0 && (
                      <div className="space-y-6 pt-8 border-t border-white/5">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 border-l-2 border-[#9b1a1a] pl-3">
                          Attachments
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {task.assets.map((asset, i) => (
                            <a
                              key={i}
                              href={asset.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#9b1a1a]/50 hover:bg-[#9b1a1a]/5 transition-all group"
                            >
                              <div className="w-12 h-12 rounded-lg bg-black/50 flex items-center justify-center border border-white/5 group-hover:border-[#9b1a1a]/30 transition-colors">
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
                </CardContent>

                {/* Bottom Submit Action */}
                <div className="p-8 md:p-12 lg:p-16 border-t border-white/5 bg-black/20 shrink-0 flex mt-auto">
                  <div className="w-[calc(100vw-6rem)] md:w-[calc(100vw-12rem)] lg:w-[calc(100vw-18rem)] max-w-[1300px] flex justify-end">
                    <button className="flex items-center gap-3 bg-[#9b1a1a] hover:bg-[#cc0000] text-white px-8 py-4 uppercase font-bold tracking-widest text-xs transition-colors rounded-xl group">
                      <span>Submit Task</span>
                      <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
