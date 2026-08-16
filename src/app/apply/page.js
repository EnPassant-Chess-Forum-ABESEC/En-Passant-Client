import { auth } from "@clerk/nextjs/server";
import ApplyForm from "@/components/ApplyForm";
import { redirect } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

async function fetchWithAuth(endpoint, token) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },

      cache: "no-store",
    });
    return await res.json();
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    return null;
  }
}

export default async function ApplyPage() {
  const { getToken, userId } = auth();

  if (!userId) {
    redirect("/auth/sign-in");
  }

  const token = await getToken();

  const [appData, tasksData] = await Promise.all([
    fetchWithAuth("/recruitment/my-application", token),
    fetchWithAuth("/tasks?year=2026", token),
  ]);

  let application = null;
  let departments = [];

  if (appData?.success && appData.myApplication) {
    application = appData.myApplication;
  }

  if (tasksData?.tasks) {
    const uniqueDepts = [];
    tasksData.tasks.forEach((t) => {
      if (!uniqueDepts.find((d) => d._id === t.departmentId._id)) {
        uniqueDepts.push(t.departmentId);
      }
    });
    departments = uniqueDepts;
  }

  return (
    <ApplyForm
      initialApplication={application}
      initialDepartments={departments}
    />
  );
}
