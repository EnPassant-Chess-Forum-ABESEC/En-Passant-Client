import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Inter, Roboto_Mono } from "next/font/google";

const adminSans = Inter({
  subsets: ["latin"],
  variable: "--font-admin-sans",
  display: "swap",
});

const adminMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-admin-mono",
  display: "swap",
});

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
  try {
    const authObj = await auth();
    const token = await authObj.getToken();

    if (!token) {
      notFound();
    }

    const API_BASE =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

    const res = await fetch(`${API_BASE}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res
        .text()
        .catch(() => "Could not read error body");
      console.error(
        `Backend returned ${res.status} ${res.statusText} for /users/me`,
      );
      console.error(`Error details:`, errorText);
      notFound();
    }

    const data = await res.json();

    if (data?.user?.role !== "admin") {
      notFound();
    }

    return (
      <div
        className={`flex min-h-screen w-full bg-slate-50 dark:bg-[#020617] font-adminSans ${adminSans.variable} ${adminMono.variable} text-slate-800 dark:text-slate-200 transition-colors duration-500`}
      >
        <AdminSidebar />
        <main className="flex-1 relative bg-slate-50 dark:bg-[#020617] min-w-0 overflow-x-hidden transition-colors duration-500 mt-16 lg:mt-0">
          <div className="relative z-10 px-4 py-8 md:px-8 md:py-12 lg:px-12 lg:py-16 max-w-[1800px] mx-auto w-full min-h-screen">
            {children}
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Admin Layout Auth Error:", error);
    notFound();
  }
}
