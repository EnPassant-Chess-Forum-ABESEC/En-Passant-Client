"use client";

import { useState, useEffect } from "react";
import EnPassantPreloader from "./Preloader";

const ENABLE_PRELOADER = true;
const FORCE_PRELOADER_ON_EVERY_LOAD = false;

export default function PreloaderWrapper({ children }) {
  const [showPreloader, setShowPreloader] = useState(ENABLE_PRELOADER);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!ENABLE_PRELOADER) return;

    const hasLoaded = sessionStorage.getItem("enpassant_preloader_shown");

    if (hasLoaded && !FORCE_PRELOADER_ON_EVERY_LOAD) {
      setShowPreloader(false);
    } else {
      sessionStorage.setItem("enpassant_preloader_shown", "true");
      document.body.style.overflow = "hidden";
    }
  }, []);

  const handlePreloaderFinish = () => {
    setShowPreloader(false);
    document.body.style.overflow = "unset";
  };

  if (!ENABLE_PRELOADER) {
    return <>{children}</>;
  }

  if (!isMounted) {
    return <div className="invisible">{children}</div>;
  }

  return (
    <>
      {showPreloader ? (
        <EnPassantPreloader onFinish={handlePreloaderFinish} />
      ) : (
        children
      )}
    </>
  );
}
