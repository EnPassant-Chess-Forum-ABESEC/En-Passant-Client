"use client";

import { useState, useEffect } from "react";
import EnPassantPreloader from "./Preloader";

const FORCE_PRELOADER_ON_EVERY_LOAD = true;

export default function PreloaderWrapper({ children }) {
  const [showPreloader, setShowPreloader] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
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
