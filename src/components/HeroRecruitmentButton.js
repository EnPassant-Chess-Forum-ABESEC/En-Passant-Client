"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useApi } from "@/lib/api";

export default function HeroRecruitmentButton() {
  const { userId } = useAuth();
  const fetchApi = useApi();
  const [myApplication, setMyApplication] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchApi("/recruitment/my-application")
        .then((res) => setMyApplication(res?.myApplication))
        .catch(() => {});
    } else {
      setMyApplication(null);
    }
  }, [userId, fetchApi]);

  const recruitmentPath =
    myApplication?.status &&
    !["DRAFT", "PAYMENT_FAILED"].includes(myApplication.status)
      ? "/recruitment/dashboard"
      : "/recruitment";

  return (
    <Link
      href={userId ? recruitmentPath : "/sign-up"}
      className="btn-bracket group cursor-good"
    >
      <div className="btn-inner bg-[#990000] hover:bg-[#cc0000] text-white px-6 md:px-8 py-4 uppercase font-pezula font-normal text-[14px] tracking-[0.12em] transition-colors duration-200 ease-in-out whitespace-nowrap">
        {userId ? "Go to Recruitment" : "Sign Up Here"}
      </div>
    </Link>
  );
}
