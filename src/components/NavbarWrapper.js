"use client";
import { usePathname } from "next/navigation";

export default function NavbarWrapper({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return null;
  }

  return children;
}
