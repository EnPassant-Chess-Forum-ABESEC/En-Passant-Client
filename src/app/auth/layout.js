"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Layout({ children }) {
  const pathname = usePathname();
  return (
    <AuthLayout>
      {/*
        This div IS the modal — fixed size, glass effect.
        Clerk's cardBox is transparent inside it.
        AnimatePresence slides only the content, not the shell.
      */}
      <div
        className="w-full max-w-[420px]"
        style={{
          height: "auto",
          borderRadius: "2.5rem",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(24px) saturate(150%)",
          WebkitBackdropFilter: "blur(24px) saturate(150%)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.12)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <motion.div
          key={pathname}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            position: "relative",
            width: "100%",
          }}
        >
          {children}
        </motion.div>
      </div>
    </AuthLayout>
  );
}
