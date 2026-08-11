"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function StrategySection() {
  const premiumEase = [0.16, 1, 0.3, 1];

  const headerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease: premiumEase, delay: custom * 0.15 },
    }),
  };

  const textRightVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 1.2, ease: premiumEase, delay: 0.3 },
    },
  };

  const textLeftVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 1.2, ease: premiumEase, delay: 0.5 },
    },
  };

  return (
    <section className="relative w-full bg-[#050505] overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-[#050505] to-transparent z-20 pointer-events-none"></div>

      <div className="relative w-full h-[180vw] md:h-auto overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: premiumEase }}
          className="w-full h-full md:h-auto"
        >
          <Image
            src="/comm_desc.png"
            alt="Think Before You Move"
            width={1920}
            height={1080}
            className="w-full h-full md:h-auto object-cover md:object-contain object-top block opacity-80"
            style={{ transform: "scale(1.25)", transformOrigin: "center top" }}
            priority
          />
        </motion.div>

        <div className="absolute bottom-0 left-0 w-full h-[35%] bg-gradient-to-t from-[#050505] to-transparent z-10"></div>
      </div>

      <div className="absolute inset-0 z-30 flex justify-center w-full pt-[6vw] md:pt-[2vw] px-6 md:px-12 pointer-events-none">
        <div className="relative w-full max-w-7xl flex flex-col h-full">
          <div className="flex flex-col uppercase font-cinzel font-bold leading-[0.85] tracking-[0.04em] md:tracking-[0.08em] z-20 w-max pointer-events-auto">
            <motion.span
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={headerVariants}
              className="text-white text-[12vw] md:text-[8vw] xl:text-[110px]"
            >
              Forging
            </motion.span>
            <div className="flex gap-[2vw] md:gap-4">
              <motion.span
                custom={1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={headerVariants}
                className="text-white text-[12vw] md:text-[8vw] xl:text-[110px]"
              >
                the
              </motion.span>
              {/* <motion.span
                custom={2}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={headerVariants}
                className="text-[#9b1a1a] text-[12vw] md:text-[8vw] xl:text-[110px]"
              ></motion.span> */}
            </div>
            <motion.span
              custom={3}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={headerVariants}
              className="text-[#9b1a1a] text-[12vw] md:text-[8vw] xl:text-[110px]"
            >
              crown
            </motion.span>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={textLeftVariants}
            className="absolute top-[45%] md:top-[55%] lg:top-[40%] left-6 md:left-12 max-w-[65vw] md:max-w-[400px] font-inter font-normal text-[18px] leading-[1.75] text-white/90 text-left pointer-events-auto bg-black/40 md:bg-transparent p-4 md:p-0 rounded-xl backdrop-blur-sm md:backdrop-blur-none"
          >
            <p>For players driven by the need to outplay</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={textRightVariants}
            className="absolute top-[45%] md:top-[55%] lg:top-[60%] right-6 md:right-12 max-w-[65vw] md:max-w-[400px] font-inter font-normal text-[18px] leading-[1.75] text-white/90 text-right pointer-events-auto bg-black/40 md:bg-transparent p-4 md:p-0 rounded-xl backdrop-blur-sm md:backdrop-blur-none"
          >
            <p>
              We wear this badge of honour where every member with their
              brilliance, makes this community truly exceptional!
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={textLeftVariants}
            className="absolute top-[65%] md:top-[75%] lg:top-[80%] left-6 md:left-12 max-w-[65vw] md:max-w-[400px] font-inter font-normal text-[18 px] leading-[1.7] text-white/75 text-left pointer-events-auto bg-black/40 md:bg-transparent p-4 md:p-0 rounded-xl backdrop-blur-sm md:backdrop-blur-none"
          >
            <p>
              What began as a shared passion became a bond written into our
              legacy
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
