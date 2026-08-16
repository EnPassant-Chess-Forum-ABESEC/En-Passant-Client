"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function ChessGridBackground({ showPieces = true }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filledSquares = [
    { x: 2, y: 0 },
    { x: 4, y: 0 },
    { x: 6, y: 0 },
    { x: 8, y: 0 },
    { x: 1, y: 1 },
    { x: 3, y: 1 },
    { x: 2, y: 2 },
    { x: 4, y: 2 },
    { x: 1, y: 3 },
    { x: 3, y: 3 },
    { x: 2, y: 4 },
    { x: 1, y: 5 },
    { x: 3, y: 5 },
    { x: 2, y: 6 },
    { x: 1, y: 7 },
    { x: 5, y: 1 },
    { x: 7, y: 1 },
  ];

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#050505]"
      style={{
        "--cell-size": "clamp(45px, 8vw, 80px)",
        "--gutter-size": "calc(var(--cell-size) * 0)",
      }}
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to left, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to top, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "var(--cell-size) var(--cell-size)",
          backgroundPosition: "center center",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(0,0,0,1) 20%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%)",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(0,0,0,1) 20%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%)",
        }}
      />

      {showPieces && (
        <div
          className="hidden md:block absolute bottom-0 left-0 z-[1] pointer-events-none"
          style={{
            width: "clamp(250px, 35vw, 420px)",
            height: "clamp(450px, 80vh, 1050px)",
          }}
        >
          <div className="relative w-full h-full">
            <Image
              src="/profile_page_asset.png"
              alt=""
              fill
              className="object-contain object-bottom"
              unoptimized
              priority
              style={{ opacity: 0.18 }}
            />

            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, #050505 0%, transparent 55%), linear-gradient(to top, #050505 0%, transparent 30%)",
              }}
            />
          </div>
        </div>
      )}

      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 45%, #050505 0%, rgba(5,5,5,0.85) 30%, rgba(5,5,5,0) 70%)",
        }}
      />

      <div
        className="absolute inset-0 z-10"
        style={{
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(0,0,0,1) 20%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%)",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(0,0,0,1) 20%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%)",
        }}
      >
        {filledSquares.map((sq, i) => (
          <div
            key={i}
            className="absolute bg-white"
            style={{
              width: "var(--cell-size)",
              height: "var(--cell-size)",
              right: `calc(var(--cell-size) * ${sq.x - 1} + var(--gutter-size))`,
              bottom: `calc(var(--cell-size) * ${sq.y})`,
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
