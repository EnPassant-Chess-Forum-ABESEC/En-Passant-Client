"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./EventTimeFormat.module.css";

function timeControlText(value) {
  if (typeof value === "string") return value.trim();
  if (!value || typeof value !== "object") return "";

  const minutes = value.minutes ?? value.initialMinutes ?? value.baseMinutes;
  const increment = value.incrementSeconds ?? value.increment;
  if (
    minutes != null &&
    increment != null &&
    String(minutes).trim() !== "" &&
    String(increment).trim() !== "" &&
    Number.isFinite(Number(minutes)) &&
    Number(minutes) >= 0 &&
    Number.isFinite(Number(increment)) &&
    Number(increment) >= 0
  ) {
    return `${Number(minutes)} + ${Number(increment)}`;
  }
  return typeof value.label === "string" ? value.label.trim() : "";
}

export default function EventTimeFormat({
  event: providedEvent = null,
  className = "",
}) {
  const sectionRef = useRef(null);
  const [request, setRequest] = useState({ loading: true, event: null });
  const [running, setRunning] = useState(false);
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const event = providedEvent ?? request.event;
  const loading = !providedEvent && request.loading;
  const control = timeControlText(event?.timeControl ?? event?.timeFormat);
  const rawFormat = event?.format ?? event?.tournamentFormat;
  const format = typeof rawFormat === "string" ? rawFormat.trim() : "";

  useEffect(() => {
    if (providedEvent) return;
    let mounted = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    async function loadEvent() {
      try {
        const apiUrl = (
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
        ).replace(/\/$/, "");
        const response = await fetch(`${apiUrl}/events`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Failed to load event time format");
        const data = await response.json();
        const events = Array.isArray(data?.events)
          ? data.events.filter(Boolean)
          : [];
        const current =
          events.find((item) =>
            ["active", "in_progress", "upcoming"].includes(item.status),
          ) || events[0];
        if (mounted) setRequest({ loading: false, event: current ?? null });
      } catch {
        if (mounted) setRequest({ loading: false, event: null });
      } finally {
        clearTimeout(timeout);
      }
    }

    loadEvent();
    return () => {
      mounted = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [providedEvent]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setRunning(entry.isIntersecting),
      {
        rootMargin: "80px",
      },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.timeSection} ${running ? styles.clockRunning : ""} ${className}`}
      aria-labelledby={`event-time-title-${id}`}
    >
      <div className={styles.clockArtwork} aria-hidden="true">
        <svg viewBox="0 0 1254 1254" focusable="false">
          <defs>
            <clipPath id={`minute-${id}`}>
              <polygon points="553,800 0,248 0,0 850,0" />
              <polygon points="553,800 900,1200 400,1200" />
            </clipPath>
            <clipPath id={`hour-${id}`}>
              <polygon points="553,800 1000,0 1254,560 1254,700" />
              <polygon points="553,800 0,1000 0,1254 250,1254" />
            </clipPath>
            <clipPath id={`second-${id}`}>
              <polygon points="553,800 1254,620 1254,1150" />
              <polygon points="553,800 0,650 0,930" />
            </clipPath>
            <clipPath id={`hub-${id}`}>
              <circle cx="553" cy="800" r="43" />
            </clipPath>
          </defs>
          <g transform="translate(412.8 295) scale(.4)">
            <g className={`${styles.clockHand} ${styles.hourHand}`}>
              <image
                href="/event/clock_hands.webp"
                width="1254"
                height="1254"
                clipPath={`url(#hour-${id})`}
                decoding="async"
              />
            </g>
            <g className={`${styles.clockHand} ${styles.minuteHand}`}>
              <image
                href="/event/clock_hands.webp"
                width="1254"
                height="1254"
                clipPath={`url(#minute-${id})`}
                decoding="async"
              />
            </g>
            <g className={`${styles.clockHand} ${styles.secondHand}`}>
              <image
                href="/event/clock_hands.webp"
                width="1254"
                height="1254"
                clipPath={`url(#second-${id})`}
                decoding="async"
              />
            </g>
            <image
              href="/event/clock_hands.webp"
              width="1254"
              height="1254"
              clipPath={`url(#hub-${id})`}
              decoding="async"
            />
          </g>
          <image
            href="/event/clock_frame.webp"
            width="1254"
            height="1254"
            decoding="async"
          />
        </svg>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.formatContent}>
          <h2 id={`event-time-title-${id}`}>
            <span className={styles.whiteLine}>TIME</span>
            <span className={styles.redLine}>FORMAT</span>
          </h2>
          <div
            className={styles.formatDetails}
            aria-live="polite"
            aria-busy={loading}
          >
            {loading ? (
              <p className={styles.pending}>Loading time format…</p>
            ) : control || format ? (
              <dl>
                {control && (
                  <div className={styles.detail}>
                    <dt>Time control</dt>
                    <dd className={styles.control}>{control}</dd>
                  </div>
                )}
                {format && (
                  <div className={styles.detail}>
                    <dt>Format</dt>
                    <dd className={styles.format}>{format}</dd>
                  </div>
                )}
              </dl>
            ) : (
              <p className={styles.pending}>Time format to be announced.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
