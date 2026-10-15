"use client";

import Image from "next/image";

export default function EventHero() {
  return (
    <section className="relative w-full h-screen bg-[#050505] overflow-hidden select-none">
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 pointer-events-none"
          style={{
            width: "max(100vw, 177.68vh)",
            height: "max(100vh, 56.28vw)",
            transform: "translate(-51.97%, -50%)",
          }}
        >
          <Image
            src="/event/hero/event_hero_fg.webp"
            alt="ACC ABES Chess Championship '26"
            fill
            priority
            quality={100}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10"
        style={{ transform: "translateY(-2%)" }}
      >
        <div className="relative flex items-center justify-center">
          <div className="relative z-10 flex items-center justify-center gap-6 sm:gap-11 md:gap-16">
            <span
              className="font-pezula font-medium text-white leading-none select-none tracking-normal"
              style={{
                fontSize: "clamp(4.2rem, 10.5vw, 8.2rem)",
                textShadow: "0 0 35px rgba(255,255,255,0.3)",
              }}
            >
              A
            </span>
            <span
              className="font-pezula font-medium text-white leading-none select-none tracking-normal"
              style={{
                fontSize: "clamp(4.2rem, 10.5vw, 8.2rem)",
                textShadow: "0 0 35px rgba(255,255,255,0.3)",
              }}
            >
              C
            </span>
            <span
              className="font-pezula font-medium text-white leading-none select-none tracking-normal"
              style={{
                fontSize: "clamp(4.2rem, 10.5vw, 8.2rem)",
                textShadow: "0 0 35px rgba(255,255,255,0.3)",
              }}
            >
              C
            </span>
          </div>
        </div>

        <p
          className="font-sans font-medium uppercase text-center"
          style={{
            fontSize: "clamp(0.6rem, 1.6vw, 0.95rem)",
            letterSpacing: "0.38em",
            color: "#e2e8f0",
            marginTop: "clamp(14px, 2.2vw, 26px)",
            textShadow: "0 2px 14px rgba(0,0,0,0.95)",
          }}
        >
          ABES CHESS CHAMPIONSHIP
        </p>
      </div>
    </section>
  );
}
