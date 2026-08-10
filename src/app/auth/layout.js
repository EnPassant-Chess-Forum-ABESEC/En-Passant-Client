"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Layout({ children }) {
  const pathname = usePathname();
  return (
    <AuthLayout>
      {/*
        Clerk's cardBox is transparent inside the dark right panel.
        AnimatePresence slides only the content, not the shell.
      */}
      <motion.div
        key={pathname}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          position: "relative",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </motion.div>
    </AuthLayout>
  );
}
