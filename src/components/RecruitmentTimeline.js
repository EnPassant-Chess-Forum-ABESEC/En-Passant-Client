"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Fill the Form",
    description:
      "Begin by submitting your application through our portal. Tell us who you are and which department you're targeting.",
  },
  {
    number: "02",
    title: "Task Given",
    description:
      "Shortlisted candidates receive a custom task tailored to their chosen department. This is your first real test.",
  },
  {
    number: "03",
    title: "Submit the Task",
    description:
      "Complete and submit your task within the deadline. Quality, creativity and precision are what we look for.",
  },
  {
    number: "04",
    title: "Interview",
    description:
      "Successful candidates are invited for a one-on-one session with our core leads to discuss your work and mindset.",
  },
  {
    number: "05",
    title: "Selection",
    description:
      "Final results are announced. Those selected are onboarded into the elite En Passant community.",

    isAccent: true,
  },
];

export default function RecruitmentTimeline() {
  return (
    <section className="relative w-full bg-[#050505] overflow-hidden py-32 md:py-56 font-sans">
      {/* Dark Marble Texture Background */}
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'url("/dark_marble_bg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 z-0 bg-[#050505]/70 pointer-events-none" />

      {/* Top/Bottom Fade for smooth blending */}
      <div className="absolute top-0 left-0 w-full h-[20vw] bg-gradient-to-b from-[#050505] to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-[20vw] bg-gradient-to-t from-[#050505] to-transparent z-10 pointer-events-none" />

      <div className="relative max-w-[1400px] mx-auto px-6 z-20">
        {/* Header */}
        <div className="text-center mb-48">
          <p className="text-[#555] text-xs md:text-base tracking-[0.5em] uppercase font-bold mb-8">
            How it works
          </p>
          <h2
            className="font-black uppercase tracking-tighter leading-[0.85] text-white"
            style={{ fontSize: "clamp(60px, 12vw, 150px)" }}
          >
            THE <span className="text-[#9b1a1a]">PROCEDURE</span>
          </h2>
          <p className="text-[#666] text-base md:text-xl mt-10 leading-relaxed max-w-[700px] mx-auto font-light">
            A merit-based process designed to identify the most driven and
            talented individuals.
          </p>
        </div>

        {/* Minimal Timeline */}
        <div className="relative mt-12 md:mt-20">
          {/* Center line (left on mobile, center on desktop) */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-[#9b1a1a]/40 to-transparent" />

          <div className="flex flex-col gap-24 md:gap-56 relative z-10">
            {steps.map((step, i) => {
              const isLeft = i % 2 === 0;

              return (
                <motion.div
                  key={step.number}
                  className={`flex w-full relative ${isLeft ? "md:flex-row-reverse" : ""}`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                >
                  {/* Empty space for the other side (desktop only) */}
                  <div className="hidden md:block md:w-1/2" />

                  {/* Dot (Left on mobile, Center on desktop) */}
                  <div className="absolute left-8 md:left-1/2 top-0 md:top-8 -translate-x-1/2 flex items-center justify-center">
                    {/* Outer soft ring */}
                    <div className="w-8 h-8 md:w-16 md:h-16 rounded-full bg-[#050505] border-[2px] md:border-[4px] border-[#9b1a1a]/30 flex items-center justify-center shadow-[0_0_30px_rgba(155,26,26,0.25)]">
                      {/* Inner solid dot */}
                      <div className="w-2 h-2 md:w-4 md:h-4 rounded-full bg-[#9b1a1a]" />
                    </div>
                  </div>

                  {/* Content Column */}
                  <div className={`w-full pl-20 pr-6 md:w-1/2 ${isLeft ? "md:pr-24 md:pl-0 text-left md:text-right" : "md:pl-24 md:pr-0 text-left"}`}>
                    <div className={`flex flex-col ${isLeft ? "items-start md:items-end" : "items-start"}`}>
                      <div className="flex items-center gap-6 mb-4 md:mb-6">
                        <span className="text-5xl sm:text-6xl md:text-[120px] font-light tracking-wide text-[#9b1a1a] leading-[0.8]">
                          {step.number}
                        </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-black tracking-[0.2em] text-white uppercase mb-4 md:mb-6">
                        {step.title}
                      </h3>
                      <p className="text-sm md:text-lg text-[#999] leading-relaxed max-w-[450px] font-light">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
