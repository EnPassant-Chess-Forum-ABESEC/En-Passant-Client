"use client";

import React, { useEffect, useState } from "react";
import SpotlightCard from "./SpotlightCard";
import { useApi } from "@/lib/api";

const getGridSlot = (deptName, fallbackIndex) => {
  const name = deptName.toLowerCase();
  
  // 1. Content: Rank 1-2, Col 1-2
  if (name.includes("content")) return { top: "0vw", left: "2vw", size: "24vw" };
  
  // 2. Media: Rank 2-3, Col 5-6 (shifted one column right)
  if (name.includes("media")) return { top: "12vw", left: "50vw", size: "24vw" };
  
  // 3. Graphics/Design: Rank 4-5, Col 2-3
  if (name.includes("graphic") || name.includes("design")) return { top: "36vw", left: "14vw", size: "24vw" };
  
  // 4. Website/Web: Rank 5-6, Col 7-8
  if (name.includes("web") || name.includes("site")) return { top: "48vw", right: "2vw", size: "24vw" };
  
  // 5. Event: Rank 7-8, Col 1-2
  if (name.includes("event")) return { top: "72vw", left: "2vw", size: "24vw" };
  
  // 6. Community: Rank 7-8, Col 5-6
  if (name.includes("community")) return { top: "72vw", left: "50vw", size: "24vw" };

  // Fallback slots for any other unexpected departments
  const fallbacks = [
    { top: "24vw", right: "2vw", size: "24vw" },
    { top: "60vw", left: "26vw", size: "24vw" },
    { top: "24vw", left: "26vw", size: "24vw" },
  ];
  return fallbacks[fallbackIndex % fallbacks.length];
};

export default function DepartmentsSection() {
  const fetchApi = useApi();
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    async function loadDepts() {
      try {
        const tasksData = await fetchApi("/tasks?year=2026").catch(() => null);
        if (tasksData?.tasks) {
          const uniqueDepts = [];
          tasksData.tasks.forEach((t) => {
            if (
              t.departmentId &&
              !uniqueDepts.find((d) => d._id === t.departmentId._id)
            ) {
              uniqueDepts.push(t.departmentId);
            }
          });
          
          // Sort departments to roughly match the visual order (01, 02, etc.)
          const order = ["content", "media", "graphic", "design", "web", "event", "community"];
          uniqueDepts.sort((a, b) => {
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();
            const aIndex = order.findIndex(o => aName.includes(o));
            const bIndex = order.findIndex(o => bName.includes(o));
            return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
          });
          
          setDepartments(uniqueDepts);
        }
      } catch (err) {
        console.error("Failed to load departments:", err);
      }
    }
    loadDepts();
  }, [fetchApi]);

  return (
    <section className="relative w-full bg-[#050505] font-sans border-none overflow-hidden py-[12vw]">
      {/* Dark Marble Texture Background */}
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'url("/dark_marble_bg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 z-0 bg-black/50 pointer-events-none" />

      {/* Top Fade */}
      <div className="absolute top-0 left-0 w-full h-[30vw] bg-gradient-to-b from-[#050505] via-[#050505]/60 to-transparent z-10 pointer-events-none" />

      {/* 8×8 grid container — exactly 8 rows × 12vw = 96vw tall */}
      <div className="relative w-full h-[96vw]">
        {/* ─── Faint Chess Board Grid ─── */}
        <div
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #ffffff 1px, transparent 1px),
              linear-gradient(to bottom, #ffffff 1px, transparent 1px)
            `,
            backgroundSize: "12vw 12vw",
            backgroundPosition: "2vw 0",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
            maskImage:
              "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
          }}
        />

        {/* Column Labels A–H */}
        <div className="absolute top-0 w-full px-[2vw] flex text-white/30 text-[10px] font-mono pt-2 z-0">
          {["A", "B", "C", "D", "E", "F", "G", "H"].map((col) => (
            <div key={col} className="w-[12vw] text-center">
              {col}
            </div>
          ))}
        </div>

        {/* Row Labels — Left Gutter */}
        <div className="absolute top-0 left-0 h-full flex flex-col text-[#555555] text-[9px] font-mono pr-2 z-0">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
            <div
              key={row}
              className="h-[12vw] w-[2vw] flex justify-end items-center"
            >
              {row}
            </div>
          ))}
        </div>

        {/* Row Labels — Right Gutter */}
        <div className="absolute top-0 right-0 h-full flex flex-col text-[#555555] text-[9px] font-mono pl-2 z-0">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
            <div
              key={row}
              className="h-[12vw] w-[2vw] flex justify-start items-center"
            >
              {row}
            </div>
          ))}
        </div>

        {/* Inner container for header + dept boxes */}
        <div className="relative w-full h-full">
          {/* Section Header — top-right */}
          <div className="absolute -top-[6vw] right-[5vw] z-30 text-right leading-[0.85]">
            <h2 className="flex flex-col uppercase font-black leading-[0.8] tracking-tighter">
              <span className="text-white text-[5vw] md:text-[64px]">
                FEATURED
              </span>
              <span className="text-[#9b1a1a] text-[7vw] md:text-[100px]">
                DEPARTMENTS
              </span>
            </h2>
          </div>

          {/* ─── Department Boxes using SpotlightCard ─── */}
          {departments.map((dept, i) => {
            const slot = getGridSlot(dept.name, i);
            if (!slot) return null;

            return (
              <div
                key={dept._id || i}
                className="absolute z-20"
                style={{
                  top: slot.top,
                  left: slot.left,
                  right: slot.right,
                  width: slot.size,
                  height: slot.size,
                }}
              >
                <SpotlightCard
                  spotlightColor="rgba(155, 26, 26, 0.15)"
                  className="w-full h-full border border-white/10 group cursor-pointer bg-[#000000]"
                >
                  <div className="relative w-full h-full">
                    {/* Default State */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ease-out group-hover:opacity-0 group-hover:-translate-y-4">
                      {/* Serif background number */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-[#9b1a1a] opacity-40 text-[12vw] font-serif leading-none tracking-tighter -mt-[4vw]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <span className="text-white font-black text-[3.2vw] tracking-tight uppercase leading-[0.9] relative z-10 text-center mt-[4vw]">
                        {dept.name}
                      </span>
                    </div>

                    {/* Hover State */}
                    <div className="absolute inset-0 p-[2.5vw] flex flex-col justify-start opacity-0 translate-y-4 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-y-0">
                      <span className="text-[#9b1a1a] font-black text-[1.8vw] tracking-tight uppercase mb-4 leading-none break-words">
                        {dept.name}
                      </span>
                      <p className="text-white/80 text-[1.2vw] leading-snug lowercase font-light break-words">
                        {dept.description || "view recruitment tasks for this department"}
                      </p>
                    </div>
                  </div>
                </SpotlightCard>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-[30vw] bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent z-10 pointer-events-none" />
    </section>
  );
}
