"use client";

import React, { useEffect, useState } from "react";
import SpotlightCard from "./SpotlightCard";
import { useApi } from "@/lib/api";
import { motion } from "framer-motion";

const premiumEase = [0.16, 1, 0.3, 1];
const CHESS_SQUARES = [
  "E5",
  "D4",
  "C5",
  "F4",
  "G7",
  "A8",
  "H1",
  "B3",
  "E5",
  "C4",
  "F3",
  "G5",
];

const getGridSlot = (deptName, fallbackIndex) => {
  const name = deptName.toLowerCase();

  if (name.includes("content"))
    return { top: "0vw", left: "2vw", size: "24vw" };

  if (name.includes("media"))
    return { top: "12vw", left: "50vw", size: "24vw" };

  if (name.includes("graphic") || name.includes("design"))
    return { top: "36vw", left: "14vw", size: "24vw" };

  if (
    name.includes("web") ||
    name.includes("site") ||
    name.includes("technical")
  )
    return { top: "48vw", right: "2vw", size: "24vw" };

  if (name.includes("event")) return { top: "72vw", left: "2vw", size: "24vw" };

  if (name.includes("community"))
    return { top: "72vw", left: "50vw", size: "24vw" };

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
  const containerRef = React.useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mouseInSection, setMouseInSection] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  useEffect(() => {
    async function loadDepts() {
      try {
        const data = await fetchApi("/tasks/all-departments").catch(() => null);
        if (data?.departments) {
          setDepartments(data.departments);
        }
      } catch (err) {
        console.error("Failed to load departments:", err);
      }
    }
    loadDepts();
  }, [fetchApi]);

  return (
    <section className="relative w-full bg-[#050505] font-sans border-none overflow-hidden py-[12vw]">
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'url("/common/dark_marble_bg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 z-0 bg-black/50 pointer-events-none" />

      <div className="absolute top-0 left-0 w-full h-[30vw] bg-gradient-to-b from-[#050505] via-[#050505]/60 to-transparent z-10 pointer-events-none" />

      <div className="md:hidden relative w-full pt-[5vw] pb-[20vw]">
        <div className="w-full px-[6vw] mb-[12vw] text-right leading-[0.85] z-30">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.2, ease: premiumEase }}
            className="flex flex-col uppercase font-black leading-[0.95] tracking-tighter"
          >
            <span className="text-white text-[9vw] font-pezula drop-shadow-[0_0_15px_rgba(155,26,26,0.25)]">
              FEATURED
            </span>
            <span className="text-[#9b1a1a] text-[12vw] font-pezula drop-shadow-[0_0_15px_rgba(155,26,26,0.25)]">
              DEPARTMENTS
            </span>
          </motion.h2>
        </div>

        <div className="w-full grid grid-cols-2 relative z-20">
          {departments.map((dept, i) => {
            const isRight = i % 2 !== 0;
            const displayName = dept.name.toLowerCase() === "community" ? "Community & PR" : dept.name;

            return (
              <React.Fragment key={dept._id || i}>
                {isRight && <div className="border border-white/5" />}

                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    type: "spring",
                    stiffness: 60,
                    damping: 20,
                    delay: (i % 2) * 0.15,
                  }}
                  className="w-[50vw] h-[50vw]"
                >
                  <SpotlightCard
                    spotlightColor="rgba(155, 26, 26, 0.15)"
                    className="w-full h-full border border-white/10 group cursor-pointer bg-[#000000]"
                  >
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ease-out group-hover:opacity-0 group-hover:-translate-y-4">
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="text-[#9b1a1a] opacity-40 text-[20vw] font-pezula leading-none tracking-tighter -mt-[6vw]">
                            {CHESS_SQUARES[i % CHESS_SQUARES.length]}
                          </span>
                        </div>
                        <span className="text-white font-black text-[4.5vw] tracking-tight uppercase leading-[0.9] relative z-10 text-center mt-[6vw]">
                          {displayName}
                        </span>
                      </div>

                      <div className="absolute inset-0 p-[5vw] flex flex-col justify-start opacity-0 translate-y-4 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-y-0">
                        <span className="text-[#9b1a1a] font-black text-[3.5vw] tracking-tight uppercase mb-2 leading-none break-words">
                          {displayName}
                        </span>
                        <p className="text-white/80 text-[2.5vw] leading-snug first-letter:uppercase font-light break-words">
                          {dept.description ||
                            "view recruitment tasks for this department"}
                        </p>
                      </div>
                    </div>
                  </SpotlightCard>
                </motion.div>

                {!isRight && <div className="border border-white/5" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setMouseInSection(true)}
        onMouseLeave={() => setMouseInSection(false)}
        className="hidden md:block relative w-full h-[96vw]"
      >
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

        {mouseInSection && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-200 z-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(155, 26, 26, 0.5) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(155, 26, 26, 0.5) 1px, transparent 1px)
              `,
              backgroundSize: "12vw 12vw",
              backgroundPosition: "2vw 0",
              WebkitMaskImage: `radial-gradient(circle 250px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%), linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)`,
              maskImage: `radial-gradient(circle 250px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%), linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)`,
              WebkitMaskComposite: "source-in",
              maskComposite: "intersect",
            }}
          />
        )}

        <div className="absolute top-0 w-full px-[2vw] flex text-white/30 text-[10px] font-mono pt-2 z-0">
          {["A", "B", "C", "D", "E", "F", "G", "H"].map((col) => (
            <div key={col} className="w-[12vw] text-center">
              {col}
            </div>
          ))}
        </div>

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

        <div className="relative w-full h-full">
          <div className="absolute -top-[6vw] right-[5vw] z-30 text-right leading-[0.85]">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: premiumEase }}
              className="flex flex-col uppercase font-black leading-[0.95] tracking-tighter"
            >
              <span className="text-white text-[5vw] md:text-[64px] font-pezula drop-shadow-[0_0_15px_rgba(155,26,26,0.25)]">
                FEATURED
              </span>
              <span className="text-[#9b1a1a] text-[7vw] md:text-[100px] font-pezula drop-shadow-[0_0_15px_rgba(155,26,26,0.25)]">
                DEPARTMENTS
              </span>
            </motion.h2>
          </div>

          {departments.map((dept, i) => {
            const slot = getGridSlot(dept.name, i);
            if (!slot) return null;
            const displayName = dept.name.toLowerCase() === "community" ? "Community & PR" : dept.name;

            return (
              <motion.div
                key={dept._id || i}
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  type: "spring",
                  stiffness: 50,
                  damping: 20,
                  delay: i * 0.1,
                }}
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
                    <div className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ease-out group-hover:opacity-0 group-hover:-translate-y-4">
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-[#9b1a1a] opacity-40 text-[12vw] font-pezula leading-none tracking-tighter -mt-[4vw]">
                          {CHESS_SQUARES[i % CHESS_SQUARES.length]}
                        </span>
                      </div>
                      <span className="text-white font-black text-[3.2vw] tracking-tight uppercase leading-[0.9] relative z-10 text-center mt-[4vw]">
                        {displayName}
                      </span>
                    </div>

                    <div className="absolute inset-0 p-[2.5vw] flex flex-col justify-start opacity-0 translate-y-4 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-y-0">
                      <span className="text-[#9b1a1a] font-black text-[1.8vw] tracking-tight uppercase mb-4 leading-none break-words">
                        {displayName}
                      </span>
                      <p className="text-white/80 text-[1.2vw] leading-snug first-letter:uppercase font-light break-words">
                        {dept.description ||
                          "view recruitment tasks for this department"}
                      </p>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[30vw] bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent z-10 pointer-events-none" />
    </section>
  );
}
