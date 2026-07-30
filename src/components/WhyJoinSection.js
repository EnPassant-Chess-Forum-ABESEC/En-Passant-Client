import { Users, Crosshair, Zap, Award } from "lucide-react";

const benefits = [
  { tag: "01", title: "Elite Networking", description: "Connect with like-minded, ambitious individuals curated to push you to be your best.", icon: Users },
  { tag: "02", title: "Strategic Mentorship", description: "Access exclusive systems and insights typically reserved for grandmasters. Learn to outmaneuver any competition.", icon: Crosshair },
  { tag: "03", title: "Performance Growth", description: "Track progress with data-driven analytics and structured training regimens designed to compound results over time.", icon: Zap },
  { tag: "04", title: "Exclusive Events", description: "Test your skills in high-stakes closed-door tournaments with substantial prize pools and unparalleled prestige.", icon: Award },
];

export default function WhyJoinSection() {
  return (
    <section
      style={{ width: "100%", background: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "96px 40px",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "80px" }}>
          <p style={{ color: "#555", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 600, marginBottom: "16px" }}>
            Membership perks
          </p>
          <h2 style={{ fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.03em", lineHeight: 0.85, fontSize: "clamp(48px, 8vw, 80px)", margin: 0 }}>
            <span style={{ color: "#fff" }}>WHY JOIN</span>{" "}
            <span style={{ color: "#9b1a1a" }}>THE CLUB</span>
          </h2>
        </div>

        {/* Zig-zag rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: "80px" }}>
          {benefits.map((b, i) => {
            const isEven = i % 2 === 0;
            const Icon = b.icon;
            return (
              <div
                key={b.tag}
                style={{
                  display: "flex",
                  flexDirection: isEven ? "row" : "row-reverse",
                  alignItems: "center",
                  gap: "48px",
                }}
              >
                {/* Text */}
                <div style={{
                  flex: 1,
                  textAlign: isEven ? "left" : "right",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isEven ? "flex-start" : "flex-end",
                }}>
                  <span style={{ color: "#1a1a1a", fontWeight: 900, fontSize: "100px", lineHeight: 1, marginBottom: "-16px", userSelect: "none" }}>
                    {b.tag}
                  </span>
                  <h3 style={{ color: "#fff", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "22px", marginBottom: "12px", position: "relative", zIndex: 1 }}>
                    {b.title}
                  </h3>
                  <p style={{ color: "#555", fontSize: "14px", lineHeight: 1.75, maxWidth: "320px", position: "relative", zIndex: 1 }}>
                    {b.description}
                  </p>
                </div>

                {/* Icon card */}
                <div style={{
                  width: "280px",
                  height: "280px",
                  flexShrink: 0,
                  borderRadius: "16px",
                  background: "#0c0c0c",
                  border: "1px solid #1e1e1e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <Icon size={80} color="#9b1a1a" strokeWidth={1} style={{ opacity: 0.7 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
