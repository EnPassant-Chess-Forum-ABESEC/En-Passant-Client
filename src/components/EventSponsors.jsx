"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./EventSponsors.module.css";

function SponsorMark({ sponsor }) {
  const content = (
    <>
      {sponsor.logo ? (
        <Image
          className={styles.logo}
          src={sponsor.logo}
          alt={sponsor.name}
          width={360}
          height={240}
          unoptimized
        />
      ) : (
        <span className={styles.name}>{sponsor.name}</span>
      )}
      {sponsor.role && <span className={styles.role}>{sponsor.role}</span>}
    </>
  );

  return sponsor.href ? (
    <a className={styles.sponsor} href={sponsor.href} aria-label={sponsor.name}>
      {content}
    </a>
  ) : (
    <div className={styles.sponsor}>{content}</div>
  );
}

/** sponsors: [{ name, logo?, href?, role? }]. Empty squares retain the marble artwork. */
export default function EventSponsors({ sponsors = [], className = "" }) {
  const entries = sponsors.filter((sponsor) => sponsor?.name);
  const additionalRows = Math.ceil(Math.max(0, entries.length - 6) / 3);
  let sponsorIndex = 0;

  return (
    <section
      className={`${styles.section} ${className}`}
      aria-label="Event sponsors"
    >
      <div className={styles.headingContainer}>
        <h2 className={styles.heading}>
          <span className={styles.whiteLine}>OUR</span>
          <span className={styles.redLine}>SPONSORS</span>
        </h2>
      </div>

      <div className={styles.board}>
        {Array.from({ length: 24 }, (_, index) => {
          const row = Math.floor(index / 6);
          const column = index % 6;
          const empty = column < 5 - row;
          const marble = !empty && (row + column) % 2 === 1;
          const sponsor = marble ? entries[sponsorIndex++] : null;

          return (
            <div
              key={`${row}-${column}`}
              className={`${styles.square} ${empty ? styles.space : marble ? styles.marble : styles.dark}`}
              aria-hidden={sponsor ? undefined : true}
            >
              {sponsor && <SponsorMark sponsor={sponsor} />}
            </div>
          );
        })}
      </div>

      {additionalRows > 0 && (
        <div className={`${styles.board} ${styles.continuation}`}>
          {Array.from({ length: additionalRows * 6 }, (_, index) => {
            const marble = (Math.floor(index / 6) + (index % 6)) % 2 === 1;
            const sponsor = marble ? entries[sponsorIndex++] : null;

            return (
              <div
                key={index}
                className={`${styles.square} ${marble ? styles.marble : styles.dark}`}
                aria-hidden={sponsor ? undefined : true}
              >
                {sponsor && <SponsorMark sponsor={sponsor} />}
              </div>
            );
          })}
        </div>
      )}

      {/* Smooth atmospheric bottom blend into EventCTA section */}
      <div className={styles.bottomBlend} aria-hidden="true" />
    </section>
  );
}
