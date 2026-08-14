"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner";
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"
import { usePathname } from "next/navigation";

const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = useTheme()
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <Sonner
      theme={isAdmin ? theme : "dark"}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4 text-green-500" />
        ),
        info: (
          <InfoIcon className="size-4 text-blue-500" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4 text-yellow-500" />
        ),
        error: (
          <OctagonXIcon className="size-4 text-[#ff3333]" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)"
        }
      }
      toastOptions={{
        classNames: {
          toast: isAdmin 
            ? "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg"
            : "group toast group-[.toaster]:bg-white/[0.03] group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-white group-[.toaster]:border-white/10 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-xl font-pezula",
          description: isAdmin
            ? "group-[.toast]:text-muted-foreground"
            : "group-[.toast]:text-white/60",
          actionButton: isAdmin
            ? "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground"
            : "group-[.toast]:bg-[#9b1a1a] group-[.toast]:text-white group-[.toast]:hover:bg-[#cc0000]",
          cancelButton: isAdmin
            ? "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
            : "group-[.toast]:bg-white/10 group-[.toast]:text-white group-[.toast]:hover:bg-white/20",
        },
      }}
      {...props} />
  );
}

export { Toaster }
