"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  FileText,
  CheckSquare,
  Building2,
  Users,
  CreditCard,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Briefcase,
  Settings,
} from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import ThemeToggle from "./ThemeToggle";

export default function AdminSidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { user } = useUser();

  // Keep Recruitment dropdown open if we are currently inside it
  const isRecruitmentActive = pathname.startsWith("/admin/recruitment");
  const [isRecruitmentOpen, setIsRecruitmentOpen] =
    useState(isRecruitmentActive);

  const isPaymentsActive = pathname.startsWith("/admin/payments");
  const [isPaymentsOpen, setIsPaymentsOpen] = useState(isPaymentsActive);

  return (
    <aside className="w-[280px] h-screen fixed top-0 left-0 flex-shrink-0 flex flex-col py-10 px-6 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] z-20 transition-colors duration-500">
      <div className="mb-14 px-4">
        <Link href="/admin" className="flex items-center gap-3 group">
          <Image
            src="/logo.png"
            alt="logo"
            width={32}
            height={32}
            className="object-contain"
          />
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-50 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
            EN PASSANT
          </h2>
        </Link>
      </div>

      <nav className="flex-1 flex flex-col gap-2 overflow-y-auto">
        {/* Dashboard Home */}
        <Link
          href="/admin"
          className={`group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 w-full text-left
            ${
              pathname === "/admin"
                ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50"
            }`}
        >
          <LayoutDashboard
            className={`w-5 h-5 transition-transform duration-300 ${pathname === "/admin" ? "scale-110" : "group-hover:scale-110"}`}
          />
          <span className="text-sm font-semibold">Dashboard</span>
          {pathname === "/admin" && (
            <div className="ml-auto w-2 h-2 rounded-full bg-blue-600" />
          )}
        </Link>

        {/* Recruitment Dropdown */}
        <div className="mt-2">
          <button
            onClick={() => setIsRecruitmentOpen(!isRecruitmentOpen)}
            className={`group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 w-full text-left
              ${
                isRecruitmentActive && !isRecruitmentOpen
                  ? "bg-blue-50/50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50"
              }`}
          >
            <Briefcase className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-sm font-semibold">Recruitment</span>
            <ChevronDown
              className={`w-4 h-4 ml-auto transition-transform duration-300 ${isRecruitmentOpen ? "rotate-180" : ""}`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${isRecruitmentOpen ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0"}`}
          >
            <div className="flex flex-col gap-1 pl-4 pr-4 border-l border-slate-100 dark:border-slate-800 ml-6">
              <Link
                href="/admin/recruitment/applications"
                className={`flex items-center gap-3 py-2.5 px-3 rounded-lg transition-colors
                  ${
                    pathname === "/admin/recruitment/applications"
                      ? "text-blue-600 bg-blue-50/50 dark:text-blue-400 dark:bg-blue-500/10"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50"
                  }`}
              >
                <FileText className="w-4 h-4" />
                <span className="text-xs font-medium">Applications</span>
              </Link>

              <Link
                href="/admin/recruitment/tasks"
                className={`flex items-center gap-3 py-2.5 px-3 rounded-lg transition-colors
                  ${
                    pathname === "/admin/recruitment/tasks"
                      ? "text-blue-600 bg-blue-50/50 dark:text-blue-400 dark:bg-blue-500/10"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50"
                  }`}
              >
                <CheckSquare className="w-4 h-4" />
                <span className="text-xs font-medium">Tasks</span>
              </Link>

              <Link
                href="/admin/recruitment/departments"
                className={`flex items-center gap-3 py-2.5 px-3 rounded-lg transition-colors
                  ${
                    pathname === "/admin/recruitment/departments"
                      ? "text-blue-600 bg-blue-50/50 dark:text-blue-400 dark:bg-blue-500/10"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50"
                  }`}
              >
                <Building2 className="w-4 h-4" />
                <span className="text-xs font-medium">Departments</span>
              </Link>
              <Link
                href="/admin/recruitment/settings"
                className={`flex items-center gap-3 py-2.5 px-3 rounded-lg transition-colors
                  ${
                    pathname === "/admin/recruitment/settings"
                      ? "text-blue-600 bg-blue-50/50 dark:text-blue-400 dark:bg-blue-500/10"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50"
                  }`}
              >
                <Settings className="w-4 h-4" />
                <span className="text-xs font-medium">Settings</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Users */}
        <Link
          href="/admin/users"
          className={`group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 w-full text-left mt-2
            ${
              pathname === "/admin/users"
                ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50"
            }`}
        >
          <Users
            className={`w-5 h-5 transition-transform duration-300 ${pathname === "/admin/users" ? "scale-110" : "group-hover:scale-110"}`}
          />
          <span className="text-sm font-semibold">Users</span>
          {pathname === "/admin/users" && (
            <div className="ml-auto w-2 h-2 rounded-full bg-blue-600" />
          )}
        </Link>

        {/* Payments Dropdown */}
        <div className="mt-2">
          <button
            onClick={() => setIsPaymentsOpen(!isPaymentsOpen)}
            className={`group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 w-full text-left
              ${
                isPaymentsActive && !isPaymentsOpen
                  ? "bg-blue-50/50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50"
              }`}
          >
            <CreditCard className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-sm font-semibold">Payments</span>
            <ChevronDown
              className={`w-4 h-4 ml-auto transition-transform duration-300 ${isPaymentsOpen ? "rotate-180" : ""}`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${isPaymentsOpen ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0"}`}
          >
            <div className="flex flex-col gap-1 pl-4 pr-4 border-l border-slate-100 dark:border-slate-800 ml-6">
              <Link
                href="/admin/payments/recruitment"
                className={`flex items-center gap-3 py-2.5 px-3 rounded-lg transition-colors
                  ${
                    pathname === "/admin/payments/recruitment"
                      ? "text-blue-600 bg-blue-50/50 dark:text-blue-400 dark:bg-blue-500/10"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50"
                  }`}
              >
                <Briefcase className="w-4 h-4" />
                <span className="text-xs font-medium">Recruitment</span>
              </Link>
            </div>
          </div>
        </div>

      </nav>

      <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
        {user && (
          <div className="flex items-center gap-3 px-4 mb-4">
            <Image
              src={user.imageUrl}
              alt="Profile"
              width={36}
              height={36}
              className="rounded-full border border-slate-200 dark:border-slate-700"
            />
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-50 truncate">
                {user.fullName || "Admin"}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {user.primaryEmailAddress?.emailAddress}
              </span>
            </div>
          </div>
        )}
        <ThemeToggle />
        
        <button
          onClick={() => signOut({ redirectUrl: "/" })}
          className="flex items-center gap-4 px-4 py-3 mt-4 w-full text-left text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 cursor-bad"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-semibold">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
