import Image from "next/image";
import Link from "next/link";

export default function RecruitmentCTASection() {
  return (
    <section
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#000",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
      }}
    >
      {/* ──── LEFT: CTA Image ──── */}
      <div
        style={{
          position: "relative",
          width: "55%",
          flexShrink: 0,
          minHeight: "100vh",
        }}
      >
        <Image
          src="/cta_image.png"
          alt="En Passant – Apply Now"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Right-edge fade blending into dark right panel */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,0.7))",
          }}
        />
        {/* Bottom fade */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent 60%)",
          }}
        />
      </div>

      {/* ──── RIGHT: Headline + CTA ──── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 60px",
          background: "#000",
          gap: "32px",
        }}
      >
        {/* Top label */}
        <p style={{ color: "#333", fontSize: "11px", letterSpacing: "0.4em", textTransform: "uppercase", fontWeight: 600 }}>
          En Passant / 2026
        </p>

        {/* Big headline */}
        <h2
          style={{
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-0.03em",
            lineHeight: 0.85,
            fontSize: "clamp(40px, 5vw, 72px)",
            margin: 0,
          }}
        >
          <span style={{ color: "#fff", display: "block" }}>MAKE YOUR</span>
          <span style={{ color: "#9b1a1a", display: "block" }}>NEXT MOVE</span>
        </h2>

        {/* Descriptor */}
        <p style={{ color: "#888", fontSize: "14px", lineHeight: 1.75, maxWidth: "300px" }}>
          The board is set.{" "}
          <strong style={{ color: "#fff" }}>Applications are now open.</strong>{" "}
          Prove your worth and earn your seat at the table.
        </p>

        {/* CTA button */}
        <div>
          <Link href="/sign-up" className="btn-bracket group" style={{ display: "inline-flex" }}>
            <div className="btn-inner" style={{ cursor: "pointer" }}>
              Apply Now
            </div>
          </Link>
        </div>

        {/* Watermark bottom */}
        <p
          style={{
            color: "#1a1a1a",
            fontWeight: 900,
            textTransform: "uppercase",
            fontSize: "11px",
            letterSpacing: "0.4em",
            marginTop: "auto",
          }}
        >
          TEST RECRUITMENT 2026
        </p>
      </div>
    </section>
  );
}
