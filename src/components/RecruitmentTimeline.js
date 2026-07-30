"use client";

import { FileText, Target, CheckCircle2, MessageSquare, Trophy } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Fill the Form",
    description: "Begin by submitting your application through our portal. Tell us who you are and which department you're targeting.",
    icon: FileText,
  },
  {
    number: "02",
    title: "Task Given",
    description: "Shortlisted candidates receive a custom task tailored to their chosen department. This is your first real test.",
    icon: Target,
  },
  {
    number: "03",
    title: "Submit the Task",
    description: "Complete and submit your task within the deadline. Quality, creativity and precision are what we look for.",
    icon: CheckCircle2,
  },
  {
    number: "04",
    title: "Interview",
    description: "Successful candidates are invited for a one-on-one session with our core leads to discuss your work and mindset.",
    icon: MessageSquare,
  },
  {
    number: "05",
    title: "Selection",
    description: "Final results are announced. Those selected are onboarded into the elite En Passant community.",
    icon: Trophy,
    isAccent: true,
  },
];

export default function RecruitmentTimeline() {
  return (
    <section
      style={{ width: "100%", background: "#050505", borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "96px 40px",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <p style={{ color: "#555", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 600, marginBottom: "16px" }}>
            How it works
          </p>
          <h2 style={{ fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.03em", lineHeight: 0.85, fontSize: "clamp(48px, 8vw, 80px)", margin: 0 }}>
            <span style={{ color: "#fff" }}>THE </span>
            <span style={{ color: "#9b1a1a" }}>PROCEDURE</span>
          </h2>
          <p style={{ color: "#555", fontSize: "14px", marginTop: "20px", lineHeight: 1.7, maxWidth: "480px", margin: "20px auto 0" }}>
            A merit-based process designed to identify the most driven and talented individuals.
          </p>
        </div>

        {/* Steps — vertical with center line */}
        <div style={{ position: "relative" }}>
          {/* Center line */}
          <div style={{
            position: "absolute",
            left: "50%",
            top: 0,
            bottom: 0,
            width: "1px",
            transform: "translateX(-50%)",
            background: "linear-gradient(to bottom, transparent, #2a2a2a 20%, #2a2a2a 80%, transparent)",
          }} />

          <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
            {steps.map((step, i) => {
              const isLeft = i % 2 === 0;
              const Icon = step.icon;
              return (
                <div key={step.number} style={{ display: "flex", alignItems: "center", gap: 0 }}>
                  {/* Left text box */}
                  <div style={{
                    width: "calc(50% - 32px)",
                    textAlign: "right",
                    padding: "24px 28px",
                    background: isLeft ? "#0c0c0c" : "transparent",
                    border: isLeft ? "1px solid #1e1e1e" : "none",
                    borderRadius: "12px",
                  }}>
                    {isLeft && (
                      <>
                        <p style={{ color: "#333", fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.25em", marginBottom: "8px" }}>{step.number}</p>
                        <h3 style={{ color: step.isAccent ? "#9b1a1a" : "#fff", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "15px", marginBottom: "8px" }}>{step.title}</h3>
                        <p style={{ color: "#555", fontSize: "13px", lineHeight: 1.7 }}>{step.description}</p>
                      </>
                    )}
                  </div>

                  {/* Center icon node */}
                  <div style={{
                    width: "64px",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                  }}>
                    <div style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      background: "#0c0c0c",
                      border: `1px solid ${step.isAccent ? "#9b1a1a" : "#2a2a2a"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <Icon size={18} color={step.isAccent ? "#9b1a1a" : "#666"} strokeWidth={1.8} />
                    </div>
                  </div>

                  {/* Right text box */}
                  <div style={{
                    width: "calc(50% - 32px)",
                    textAlign: "left",
                    padding: "24px 28px",
                    background: !isLeft ? "#0c0c0c" : "transparent",
                    border: !isLeft ? "1px solid #1e1e1e" : "none",
                    borderRadius: "12px",
                  }}>
                    {!isLeft && (
                      <>
                        <p style={{ color: "#333", fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.25em", marginBottom: "8px" }}>{step.number}</p>
                        <h3 style={{ color: step.isAccent ? "#9b1a1a" : "#fff", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "15px", marginBottom: "8px" }}>{step.title}</h3>
                        <p style={{ color: "#555", fontSize: "13px", lineHeight: 1.7 }}>{step.description}</p>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
