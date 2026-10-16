"use client";

import { useEffect, useRef } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function LenisController() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    if (!lenis) return;
    window.__lenis = lenis;
    window.scrollTo(0, 0);
    lenis.scrollTo(0, { immediate: true });
    lenis.resize();
  }, [pathname, lenis]);

  useEffect(() => {
    if (!lenis) return;

    // Sync Lenis scroll with GSAP ScrollTrigger
    const onScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on("scroll", onScroll);

    // Keep Lenis scroll limit in sync with ScrollTrigger's pin spacers
    const onRefresh = () => {
      lenis.resize();
    };
    ScrollTrigger.addEventListener("refresh", onRefresh);

    return () => {
      lenis.off("scroll", onScroll);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
    };
  }, [lenis]);

  useEffect(() => {
    if (!lenis) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "style") {
          const overflow = document.body.style.overflow;
          if (overflow === "hidden") {
            lenis.stop();
          } else {
            lenis.start();
          }
        }
      });
    });

    observer.observe(document.body, { attributes: true });

    if (document.body.style.overflow === "hidden") {
      lenis.stop();
    }

    return () => {
      observer.disconnect();
    };
  }, [lenis]);

  return null;
}

export default function SmoothScroll({ children }) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
      }}
    >
      <LenisController />
      {children}
    </ReactLenis>
  );
}
