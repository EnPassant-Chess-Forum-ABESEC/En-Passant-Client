"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./EventCTA.module.css";

export default function EventCTA({ event = null }) {
  const sectionRef = useRef(null);
  const handsRef = useRef(null);
  const wreathRef = useRef(null);
  const ctaRef = useRef(null);
  const headingRef = useRef(null);

  const registerHref =
    event?.registrationUrl ||
    event?.registrationLink ||
    event?.link ||
    "/sign-up";

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const isFinePointer =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animId = null;
    let active = true;

    const handlePointerMove = (e) => {
      const rect = section.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      targetX = Math.max(-1, Math.min(1, x));
      targetY = Math.max(-1, Math.min(1, y));
    };

    const handlePointerLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const updateParallax = () => {
      if (!active) return;

      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      if (handsRef.current) {
        handsRef.current.style.transform = `translate3d(${currentX * 14}px, ${currentY * 10}px, 0)`;
      }

      if (wreathRef.current) {
        wreathRef.current.style.transform = `translate(-50%, -50%) translate3d(${currentX * -20}px, ${currentY * -16}px, 0)`;
      }

      if (ctaRef.current) {
        ctaRef.current.style.transform = `translate(-50%, -50%) translate3d(${currentX * 24}px, ${currentY * 18}px, 0)`;
      }

      if (headingRef.current) {
        headingRef.current.style.transform = `translate3d(${currentX * -10}px, ${currentY * -8}px, 0)`;
      }

      animId = requestAnimationFrame(updateParallax);
    };

    animId = requestAnimationFrame(updateParallax);

    section.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    section.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      active = false;
      cancelAnimationFrame(animId);
      section.removeEventListener("pointermove", handlePointerMove);
      section.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.ctaSection}
      aria-label="Event Registration Call to Action"
    >
      <div className={styles.vignetteTop} aria-hidden="true" />
      <div className={styles.vignetteBottom} aria-hidden="true" />
      <div className={styles.radialVignette} aria-hidden="true" />

      <div ref={handsRef} className={styles.handsLayer} aria-hidden="true">
        <Image
          src="/event/cta/hands.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.handsImg}
        />
      </div>

      <div
        ref={wreathRef}
        className={styles.wreathContainer}
        aria-hidden="true"
      >
        <Image
          src="/event/cta/circle_btm.webp"
          alt=""
          fill
          className={styles.wreathBtm}
        />
        <Image
          src="/event/cta/circle_top.webp"
          alt=""
          fill
          className={styles.wreathTop}
        />
      </div>

      <div ref={ctaRef} className={styles.ctaWrapper}>
        <div className={styles.bracketBox}>
          <span className={styles.cornerTL} aria-hidden="true" />
          <span className={styles.cornerTR} aria-hidden="true" />
          <span className={styles.cornerBL} aria-hidden="true" />
          <span className={styles.cornerBR} aria-hidden="true" />

          <Link href={registerHref} className={styles.registerBtn}>
            REGISTER
          </Link>
        </div>
      </div>

      <div ref={headingRef} className={styles.headingContainer}>
        <h2 className={styles.title}>
          <span className={styles.whiteLine}>THE TIME</span>
          <span className={styles.redLine}>HAS COME</span>
        </h2>
      </div>
    </section>
  );
}
