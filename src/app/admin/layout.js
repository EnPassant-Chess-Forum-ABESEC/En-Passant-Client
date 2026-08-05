import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

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
      notFound();
    }

    const data = await res.json();

    if (data?.user?.role !== "admin") {
      notFound();
    }

    return <>{children}</>;
  } catch (error) {
    console.error("Admin Layout Auth Error:", error);
    notFound();
  }
}
