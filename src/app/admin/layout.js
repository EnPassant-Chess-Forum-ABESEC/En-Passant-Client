import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const dynamic = 'force-dynamic';

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
      const errorText = await res.text().catch(() => "Could not read error body");
      console.error(`Backend returned ${res.status} ${res.statusText} for /users/me`);
      console.error(`Error details:`, errorText);
      notFound();
    }

    const data = await res.json();

    if (data?.user?.role !== "admin") {
      notFound();
    }

    return (
      <div className="flex min-h-screen bg-slate-50 font-inter text-slate-800">
        <AdminSidebar />
        <main className="flex-1 relative bg-slate-50 min-h-screen ml-[280px]">
          <div className="relative z-10 px-10 py-16 md:px-16 md:py-20 lg:px-24 max-w-[1800px] mx-auto w-full min-h-full">
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
