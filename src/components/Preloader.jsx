"use client";

import { useEffect, useRef, useState } from "react";
import { SiChessdotcom } from "react-icons/si";

/* ============================================================================
   SIZE CONFIG — edit this one value to resize the whole board.
   The grid is 2 columns x 3 rows (that's every square actually involved in
   an en passant capture: files d-e, ranks 2-4 — nothing extra, nothing cut).
   ============================================================================ */
const SQUARE_SIZE = 140; // <-- size of one square in px (try 80–180)
const GRID_COLS = 3;
const GRID_ROWS = 3;
const BOARD_WIDTH = SQUARE_SIZE * GRID_COLS;
const BOARD_HEIGHT = SQUARE_SIZE * GRID_ROWS;
const PIECE_SIZE_PCT = 0.6; // piece icon size as a % of a square

/* Colors — grey & black board, edit to re-theme */
const COLORS = {
  light: "#5a5a5a",
  dark: "#0d0d0d",
  text: "#f2efe8",
  whiteFill: "#ffffff",
  blackFill: "#000000",
};

/* Timeline (ms) — edit to speed up / slow down the sequence */
const TIMING = {
  boardShow: 300,
  whiteMoveStart: 1500,
  blackMoveStart: 2750,
  captureFade: 3150,
  boardHide: 3850,
  welcomeShow: 4500,
  finish: 6000,
};

/* col 0 = c-file (decorative), col 1 = d-file, col 2 = e-file
   row 0 = rank 4 (top), row 1 = rank 3 (middle), row 2 = rank 2 (bottom, white's side) */
const cellPos = (col, row) =>
  `translate(${col * SQUARE_SIZE}px, ${row * SQUARE_SIZE}px)`;

/* real chess colors for these 9 squares (c/d/e files, ranks 2-4), row-major top to bottom */
const SQUARE_COLORS = [
  [COLORS.light, COLORS.dark, COLORS.light], // row 0: c4, d4, e4
  [COLORS.dark, COLORS.light, COLORS.dark], // row 1: c3, d3, e3
  [COLORS.light, COLORS.dark, COLORS.light], // row 2: c2, d2, e2
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
        // no filter / drop-shadow / glow — flat, clean piece
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

  // white pawn: d2 -> d4 (legal two-square advance from its own starting rank)
  const [whiteTransform, setWhiteTransform] = useState(cellPos(1, 2));
  const [whiteCaptured, setWhiteCaptured] = useState(false);

  // black pawn: e4 -> d3 (en passant capture)
  const [blackTransform, setBlackTransform] = useState(cellPos(2, 0));

  const timers = useRef([]);

  useEffect(() => {
    const at = (t, fn) => timers.current.push(setTimeout(fn, t));

    at(TIMING.boardShow, () => setBoardShown(true));
    at(TIMING.whiteMoveStart, () => setWhiteTransform(cellPos(1, 0))); // d2 -> d4
    at(TIMING.blackMoveStart, () => setBlackTransform(cellPos(1, 1))); // e4 -> d3
    at(TIMING.captureFade, () => setWhiteCaptured(true));
    at(TIMING.boardHide, () => setBoardHidden(true));
    at(TIMING.welcomeShow, () => setWelcomeShown(true));
    at(TIMING.finish, () => {
      if (onFinish) onFinish();
    });

    return () => timers.current.forEach(clearTimeout);
  }, [onFinish]);

  const squares = [];
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      squares.push(
        <div
          key={`${r}-${c}`}
          style={{
            background: SQUARE_COLORS[r][c],
            border: "1px solid rgba(128,128,128,0.15)", // hairline so black squares stay readable on black bg
          }}
        />,
      );
    }
  }

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
      {/* Preload Heavy Assets silently while animation plays */}
      {/* Preload snapshot image only on mobile */}
      <link rel="preload" href="/3d_model_snapshot.png" as="image" media="(max-width: 767px)" />
      {/* Preload the actual 3D model only on desktop */}
      <link rel="preload" href="/king.glb" as="fetch" crossOrigin="anonymous" media="(min-width: 768px)" />
      <link rel="preload" href="/dark_marble_bg.png" as="image" />

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
        {/* ---------- Board ---------- */}
        <div
          style={{
            position: "absolute",
            opacity: boardHidden ? 0 : boardShown ? 1 : 0,
            transform: boardHidden
              ? "scale(1.04)"
              : boardShown
                ? "scale(1)"
                : "scale(0.88)",
            transition: boardHidden
              ? "opacity .8s ease, transform .8s ease"
              : "opacity 1s cubic-bezier(.16,.8,.24,1), transform 1s cubic-bezier(.16,.8,.24,1)",
          }}
        >
          {/* Responsive scale wrapper */}
          <div className="scale-[0.65] min-[400px]:scale-75 md:scale-100 origin-center">
            <div
              style={{
              padding: 1,
              background: "rgba(255,255,255,.15)",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,.08), 0 30px 80px rgba(0,0,0,.85)",
              borderRadius: 2,
            }}
          >
            <div
              style={{
                position: "relative",
                width: BOARD_WIDTH,
                height: BOARD_HEIGHT,
                display: "grid",
                gridTemplateColumns: `repeat(${GRID_COLS}, ${SQUARE_SIZE}px)`,
                gridTemplateRows: `repeat(${GRID_ROWS}, ${SQUARE_SIZE}px)`,
              }}
            >
              {squares}
            </div>

            {/* piece layer sits on top of the square grid */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: BOARD_WIDTH,
                height: BOARD_HEIGHT,
                pointerEvents: "none",
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

        {/* ---------- Welcome text ---------- */}
        <div
          style={{
            position: "absolute",
            textAlign: "center",
            opacity: welcomeShown ? 1 : 0,
            transform: welcomeShown ? "translateY(0)" : "translateY(6px)",
            transition: "opacity 1s ease, transform 1s ease",
          }}
        >
          <h1
            style={{
              fontWeight: 300,
              fontSize: "clamp(16px, 2.3vw, 26px)",
              letterSpacing: welcomeShown ? "7px" : "2px",
              color: COLORS.text,
              textTransform: "uppercase",
              transition: "letter-spacing 1.4s cubic-bezier(.16,.8,.24,1)",
              margin: 0,
            }}
          >
            Welcome to EnPassant
          </h1>
          <div
            style={{
              width: welcomeShown ? 56 : 0,
              height: 1,
              background: "rgba(255,255,255,.35)",
              margin: "18px auto 0",
              transition: "width 1s ease .4s",
            }}
          />
        </div>
      </div>
    </div>
  );
}
