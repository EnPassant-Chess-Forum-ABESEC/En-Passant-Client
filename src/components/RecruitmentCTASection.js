"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const premiumEase = [0.16, 1, 0.3, 1];

export default function RecruitmentCTASection() {
  return (
    <section
      id="recruitment-cta"
      className="relative w-full bg-[#050505] overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      <div className="absolute top-0 left-0 w-full h-[15vw] bg-gradient-to-b from-[#050505] to-transparent z-20 pointer-events-none" />

      <div className="relative w-full" style={{ minHeight: "100vh" }}>
        <div className="absolute inset-0 flex items-center justify-center z-0 mt-[10vh] md:mt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: premiumEase }}
            className="relative w-[90vw] md:w-[55vw] h-[50vh] md:h-[80vh]"
          >
            <Image
              src="/cta_image.png"
              alt="En Passant – Apply Now"
              fill
              className="object-contain object-center"
              priority
            />

            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 40%, #050505 80%)",
              }}
            />
          </motion.div>
        </div>

        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 25%, rgba(5,5,5,0.6) 65%, #050505 100%)",
          }}
        />

        <div className="absolute top-[8%] md:top-[12%] left-[6%] z-30 select-none">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: premiumEase }}
            className="font-bold uppercase tracking-wide leading-[0.82] font-pezula drop-shadow-[0_0_15px_rgba(155,26,26,0.25)]"
            style={{ fontSize: "clamp(46px, 6.5vw, 90px)" }}
          >
            <span className="text-white block">MAKE YOUR</span>
            <span className="text-[#9b1a1a] block mt-[0.4rem]">NEXT MOVE</span>
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: premiumEase, delay: 0.2 }}
          className="absolute top-[22%] md:top-[14%] left-[6%] md:left-auto md:right-[6%] z-30 text-left md:text-right max-w-[280px] md:max-w-[340px]"
        >
          <p className="text-[#888] text-md md:text-lg leading-relaxed font-light">
            <strong className="text-white font-bold">
              Applications are now open !!
              <br />
            </strong>{" "}
            Prove your worth and earn your seat.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            type: "spring",
            stiffness: 60,
            damping: 20,
            delay: 0.4,
          }}
          className="absolute bottom-[8%] md:bottom-[12%] w-full md:w-auto left-0 md:left-auto md:right-[6%] z-30 flex flex-col items-center md:items-end text-center md:text-right px-6 md:px-0"
        >
          <p className="text-[#444] text-[15px] tracking-[0.2em] normalcase font-semibold mb-5">
            Recruitment Open
          </p>
          <Link
            href="/recruitment/apply"
            className="btn-bracket group cursor-good"
            style={{ display: "inline-flex" }}
          >
            <div
              className="btn-inner bg-[#9b1a1a] hover:bg-[#c0392b] text-white px-10 md:px-8 py-5 md:py-4 uppercase font-bold tracking-widest text-sm md:text-xs transition-colors shadow-[0_0_30px_rgba(155,26,26,0.3)] w-full md:w-auto text-center cursor-good"
            >
              Apply Now
            </div>
          </Link>
        </motion.div>

        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050505] to-transparent z-20 pointer-events-none" />
      </div>
    </section>
  );
}
