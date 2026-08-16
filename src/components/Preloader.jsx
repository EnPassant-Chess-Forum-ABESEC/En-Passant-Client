"use client";

import { useEffect, useRef, useState } from "react";
import { SiChessdotcom } from "react-icons/si";
import FoldText from "./FoldText";

const SQUARE_SIZE = 140;
const GRID_COLS = 9;
const GRID_ROWS = 9;
const BOARD_WIDTH = SQUARE_SIZE * GRID_COLS;
const BOARD_HEIGHT = SQUARE_SIZE * GRID_ROWS;
const CENTER_OFFSET = 3;
const PIECE_SIZE_PCT = 0.6;

const COLORS = {
  light: "#5a5a5a",
  dark: "#0d0d0d",
  text: "#f2efe8",
  whiteFill: "#ffffff",
  blackFill: "#000000",
};

const TIMING = {
  boardShow: 300,
  whiteMoveStart: 1500,
  blackMoveStart: 2750,
  captureFade: 3150,
  boardHide: 3850,
  welcomeShow: 4500,
  finish: 6000,
};

const cellPos = (col, row) =>
  `translate(${(col + CENTER_OFFSET) * SQUARE_SIZE}px, ${(row + CENTER_OFFSET) * SQUARE_SIZE}px)`;

const SQUARE_COLORS = [
  [COLORS.light, COLORS.dark, COLORS.light],
  [COLORS.dark, COLORS.light, COLORS.dark],
  [COLORS.light, COLORS.dark, COLORS.light],
];

function Pawn({ color, transform, captured }) {
  const fill = color === "white" ? COLORS.whiteFill : COLORS.blackFill;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: SQUARE_SIZE,
        height: SQUARE_SIZE,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform,
        opacity: captured ? 0 : 1,
        transition:
          "transform .65s cubic-bezier(.45,0,.2,1), opacity .35s ease",
      }}
    >
      <SiChessdotcom size={SQUARE_SIZE * PIECE_SIZE_PCT} color={fill} />
    </div>
  );
}

export default function EnPassantPreloader({ onFinish }) {
  const [boardShown, setBoardShown] = useState(false);
  const [boardHidden, setBoardHidden] = useState(false);
  const [welcomeShown, setWelcomeShown] = useState(false);

  const [whiteTransform, setWhiteTransform] = useState(cellPos(1, 2));
  const [whiteCaptured, setWhiteCaptured] = useState(false);

  const [blackTransform, setBlackTransform] = useState(cellPos(2, 0));

  const timers = useRef([]);

  useEffect(() => {
    const at = (t, fn) => timers.current.push(setTimeout(fn, t));

    at(TIMING.boardShow, () => setBoardShown(true));
    at(TIMING.whiteMoveStart, () => setWhiteTransform(cellPos(1, 0)));
    at(TIMING.blackMoveStart, () => setBlackTransform(cellPos(1, 1)));
    at(TIMING.captureFade, () => setWhiteCaptured(true));
    at(TIMING.boardHide, () => setBoardHidden(true));
    at(TIMING.welcomeShow, () => setWelcomeShown(true));
    at(TIMING.finish, () => {
      onFinish();
    });

    return () => timers.current.forEach(clearTimeout);
  }, [onFinish]);

  const squares = [];
  const gridLines = [];

  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const dist = Math.sqrt(Math.pow(r - 4, 2) + Math.pow(c - 4, 2));

      const lineOpacity = Math.max(0, 1 - dist * 0.15);

      gridLines.push(
        <div
          key={`line-${r}-${c}`}
          style={{
            position: "absolute",
            top: r * SQUARE_SIZE,
            left: c * SQUARE_SIZE,
            width: SQUARE_SIZE,
            height: SQUARE_SIZE,
            border: "1px solid rgba(255,255,255,0.12)",
            pointerEvents: "none",
            opacity: boardHidden ? 0 : lineOpacity,
            transform: boardHidden
              ? "translateY(150vh) scale(0.85) rotate(15deg)"
              : "scale(1)",
            transition: boardHidden
              ? `opacity 1.2s cubic-bezier(0.55, 0, 1, 0.45) ${dist * 40}ms, transform 1.2s cubic-bezier(0.55, 0, 1, 0.45) ${dist * 40}ms`
              : "none",
          }}
        />,
      );
    }
  }

  const shape = [
    // Top
    [1, 4],
    [2, 4],
    [2, 5],
    // Center 3x3
    [3, 3],
    [3, 4],
    [3, 5],
    [4, 3],
    [4, 4],
    [4, 5],
    [5, 3],
    [5, 4],
    [5, 5],
    // Right
    [3, 6],
    [3, 7],
    [4, 6],
    [4, 7],
    [5, 6],
    [5, 7],
    // Bottom
    [6, 4],
    [6, 5],
    [7, 4],
    [7, 5],
    // Left
    [3, 2],
    [4, 2],
    [5, 2],
    [4, 1],
    [5, 0],
  ];

  shape.forEach(([r, c]) => {
    const isLight = (r + c) % 2 === 0;
    const bg = isLight ? COLORS.light : COLORS.dark;
    const dist = Math.sqrt(Math.pow(r - 4, 2) + Math.pow(c - 4, 2));

    const fadeMultiplier = isLight ? 0.26 : 0.2;
    const baseOpacity = Math.max(0, 1 - dist * fadeMultiplier);

    squares.push(
      <div
        key={`sq-${r}-${c}`}
        style={{
          position: "absolute",
          top: r * SQUARE_SIZE,
          left: c * SQUARE_SIZE,
          width: SQUARE_SIZE,
          height: SQUARE_SIZE,
          background: bg,
          opacity: boardHidden ? 0 : baseOpacity,
          transform: boardHidden
            ? "translateY(150vh) scale(0.65) rotate(-15deg)"
            : "scale(1)",
          transition: boardHidden
            ? `opacity 1.2s cubic-bezier(0.55, 0, 1, 0.45) ${dist * 60}ms, transform 1.2s cubic-bezier(0.55, 0, 1, 0.45) ${dist * 60}ms`
            : "none",
        }}
      />,
    );
  });

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif",
        overflow: "hidden",
        zIndex: 99999,
      }}
    >
      <link
        rel="preload"
        href="/home/3d_model_snapshot.png"
        as="image"
        media="(max-width: 767px)"
      />

      <link
        rel="preload"
        href="/models/king.glb"
        as="fetch"
        crossOrigin="anonymous"
        media="(min-width: 768px)"
      />
      <link rel="preload" href="/common/dark_marble_bg.png" as="image" />

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(ellipse at center, #0a0a0a 0%, #000 75%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            opacity: boardShown ? 1 : 0,
            transform: boardShown ? "scale(1)" : "scale(0.88)",
            transition:
              "opacity 1.5s cubic-bezier(.16,.8,.24,1), transform 1.5s cubic-bezier(.16,.8,.24,1)",
          }}
        >
          <div className="scale-[0.45] min-[400px]:scale-[0.55] md:scale-[0.75] origin-center">
            <div
              style={{
                position: "relative",
                width: BOARD_WIDTH,
                height: BOARD_HEIGHT,
                WebkitMaskImage:
                  "radial-gradient(circle at center, black 15%, transparent 100%)",
                maskImage:
                  "radial-gradient(circle at center, black 15%, transparent 100%)",
              }}
            >
              {gridLines}

              {squares}

              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: BOARD_WIDTH,
                  height: BOARD_HEIGHT,
                  pointerEvents: "none",
                  opacity: boardHidden ? 0 : 1,
                  transform: boardHidden
                    ? "translateY(150vh) scale(0.65)"
                    : "scale(1)",
                  transition: boardHidden
                    ? "opacity 1.2s cubic-bezier(0.55, 0, 1, 0.45), transform 1.2s cubic-bezier(0.55, 0, 1, 0.45)"
                    : "none",
                }}
              >
                <Pawn
                  color="white"
                  transform={whiteTransform}
                  captured={whiteCaptured}
                />
                <Pawn color="black" transform={blackTransform} />
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          {welcomeShown && (
            <div className="flex flex-col items-center justify-center w-full max-w-[100vw] px-4">
              <div style={{ marginBottom: "clamp(0.5rem, 2vw, 1rem)" }}>
                <FoldText
                  text="Welcome to"
                  fontSize="clamp(2rem, 6vw, 4.5rem)"
                  fontWeight={500}
                  color="#fff"
                  stagger={0.03}
                  className="whitespace-nowrap"
                />
              </div>
              <div style={{ display: "flex", gap: "clamp(0.5rem, 3vw, 1.5rem)" }}>
                <FoldText
                  text="EN"
                  fontSize="clamp(3.5rem, 14vw, 8rem)"
                  fontWeight={900}
                  color="#9b1a1a"
                  stagger={0.04}
                  className="inline-block whitespace-nowrap font-prfaExtrabold font-black hero-letter drop-shadow-[0_0_15px_rgba(155,26,26,0.25)]"
                />
                <FoldText
                  text="PASSANT"
                  fontSize="clamp(3.5rem, 14vw, 8rem)"
                  fontWeight={900}
                  color="#fff"
                  stagger={0.04}
                  className="whitespace-nowrap font-prfaExtrabold font-black hero-letter drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] tracking-[0.05em] md:tracking-[0.2em]"
                  innerClassName="bg-gradient-to-b from-[#ffffff] via-[#cccccc] to-[#555555] bg-clip-text text-transparent"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
