"use client";

import { useState, useEffect } from "react";
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
  Mail,
  Menu,
  X,
} from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ThemeToggle from "./ThemeToggle";

export default function AdminSidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { user } = useUser();

  const isRecruitmentActive = pathname.startsWith("/admin/recruitment");
  const [isRecruitmentOpen, setIsRecruitmentOpen] =
    useState(isRecruitmentActive);

  const isPaymentsActive = pathname.startsWith("/admin/payments");
  const [isPaymentsOpen, setIsPaymentsOpen] = useState(isPaymentsActive);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800 z-40 flex items-center justify-between px-4">
        <Link href="/admin" className="flex items-center gap-3">
          <Image
            src="/common/logo.png"
            alt="logo"
            width={28}
            height={28}
            className="object-contain"
          />
          <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-slate-50">
            EN PASSANT
          </h2>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div
        className={`hidden lg:block flex-shrink-0 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out ${isCollapsed ? "w-[88px]" : "w-[280px]"}`}
      />

      <aside
        className={`h-screen fixed top-0 left-0 flex-shrink-0 flex flex-col py-10 px-4 lg:px-6 bg-white dark:bg-[#0F172A] z-50 transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "translate-x-0 w-full"
            : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "lg:w-[88px] lg:px-4" : "lg:w-[280px]"}`}
      >
        <div className="mb-14 flex items-center justify-between">
          <Link href="/admin" className="flex items-center group">
            <div
              className={`transition-all duration-300 shrink-0 ${
                isCollapsed ? "translate-x-2" : "translate-x-0"
              }`}
            >
              <Image
                src="/common/logo.png"
                alt="logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <h2
              className={`text-xl font-black tracking-tight text-slate-900 dark:text-slate-50 group-hover:text-slate-700 dark:group-hover:text-slate-200 whitespace-nowrap transition-all duration-300 overflow-hidden ${
                isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[200px] opacity-100 ml-4"
              }`}
            >
              EN PASSANT
            </h2>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav
          data-lenis-prevent="true"
          className="flex-1 min-h-0 flex flex-col gap-2 overflow-y-auto pr-2 pb-8 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700"
        >
          <Link
            href="/admin"
            title="Dashboard"
            className={`group flex items-center gap-4 py-3 rounded-xl transition-all duration-300 w-full text-left
            ${isCollapsed ? "justify-center px-0" : "px-4"}
            ${
              pathname === "/admin"
                ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50"
            }`}
          >
            <LayoutDashboard
              className={`w-5 h-5 shrink-0 transition-transform duration-300 ${pathname === "/admin" ? "scale-110" : "group-hover:scale-110"}`}
            />
            {!isCollapsed && (
              <span className="text-sm font-semibold truncate">Dashboard</span>
            )}
            {!isCollapsed && pathname === "/admin" && (
              <div className="ml-auto w-2 h-2 rounded-full bg-blue-600" />
            )}
          </Link>

          <div className="mt-2">
            <button
              onClick={() => {
                if (isCollapsed) setIsCollapsed(false);
                setIsRecruitmentOpen(!isRecruitmentOpen);
              }}
              title="Recruitment"
              className={`group flex items-center gap-4 py-3 rounded-xl transition-all duration-300 w-full text-left
              ${isCollapsed ? "justify-center px-0" : "px-4"}
              ${
                isRecruitmentActive && (!isRecruitmentOpen || isCollapsed)
                  ? "bg-blue-50/50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50"
              }`}
            >
              <Briefcase className="w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110" />
              {!isCollapsed && (
                <span className="text-sm font-semibold truncate">
                  Recruitment
                </span>
              )}
              {!isCollapsed && (
                <ChevronDown
                  className={`w-4 h-4 ml-auto transition-transform duration-300 ${isRecruitmentOpen ? "rotate-180" : ""}`}
                />
              )}
            </button>

            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${isRecruitmentOpen && !isCollapsed ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0"}`}
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

          <Link
            href="/admin/users"
            title="Users"
            className={`group flex items-center gap-4 py-3 rounded-xl transition-all duration-300 w-full text-left mt-2
            ${isCollapsed ? "justify-center px-0" : "px-4"}
            ${
              pathname === "/admin/users"
                ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50"
            }`}
          >
            <Users
              className={`w-5 h-5 shrink-0 transition-transform duration-300 ${pathname === "/admin/users" ? "scale-110" : "group-hover:scale-110"}`}
            />
            {!isCollapsed && (
              <span className="text-sm font-semibold truncate">Users</span>
            )}
            {!isCollapsed && pathname === "/admin/users" && (
              <div className="ml-auto w-2 h-2 rounded-full bg-blue-600" />
            )}
          </Link>

          <Link
            href="/admin/queries"
            title="User Queries"
            className={`group flex items-center gap-4 py-3 rounded-xl transition-all duration-300 w-full text-left mt-2
            ${isCollapsed ? "justify-center px-0" : "px-4"}
            ${
              pathname === "/admin/queries"
                ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50"
            }`}
          >
            <Mail
              className={`w-5 h-5 shrink-0 transition-transform duration-300 ${pathname === "/admin/queries" ? "scale-110" : "group-hover:scale-110"}`}
            />
            {!isCollapsed && (
              <span className="text-sm font-semibold truncate">
                User Queries
              </span>
            )}
            {!isCollapsed && pathname === "/admin/queries" && (
              <div className="ml-auto w-2 h-2 rounded-full bg-blue-600" />
            )}
          </Link>

          <div className="mt-2">
            <button
              onClick={() => {
                if (isCollapsed) setIsCollapsed(false);
                setIsPaymentsOpen(!isPaymentsOpen);
              }}
              title="Payments"
              className={`group flex items-center gap-4 py-3 rounded-xl transition-all duration-300 w-full text-left
              ${isCollapsed ? "justify-center px-0" : "px-4"}
              ${
                isPaymentsActive && (!isPaymentsOpen || isCollapsed)
                  ? "bg-blue-50/50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50"
              }`}
            >
              <CreditCard className="w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110" />
              {!isCollapsed && (
                <span className="text-sm font-semibold truncate">Payments</span>
              )}
              {!isCollapsed && (
                <ChevronDown
                  className={`w-4 h-4 ml-auto transition-transform duration-300 ${isPaymentsOpen ? "rotate-180" : ""}`}
                />
              )}
            </button>

            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${isPaymentsOpen && !isCollapsed ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0"}`}
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

        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center gap-4 px-4 py-2 w-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <Menu className="w-5 h-5 shrink-0" />
            {!isCollapsed && (
              <span className="text-sm font-semibold truncate flex-1 text-left">
                Collapse
              </span>
            )}
          </button>

          {user ? (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className={`flex items-center gap-4 py-2 w-full hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors text-left outline-none ${isCollapsed ? "justify-center px-0" : "px-4"}`}
                >
                  <Image
                    src={user.imageUrl}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  {!isCollapsed && (
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-50 truncate">
                        {user.fullName || "Admin"}
                      </span>
                    </div>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                align="start"
                className="w-60 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3"
              >
                <div className="flex flex-col gap-2">
                  <div className="px-2 py-1 border-b border-slate-100 dark:border-slate-800 pb-3 mb-1">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-50 block truncate">
                      {user.fullName || "Admin"}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block truncate">
                      {user.primaryEmailAddress?.emailAddress}
                    </span>
                  </div>

                  <div className="-mt-1">
                    <ThemeToggle />
                  </div>

                  <button
                    onClick={() => signOut({ redirectUrl: "/" })}
                    className="flex items-center gap-3 px-3 py-2.5 mt-1 w-full text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors rounded-lg group"
                  >
                    <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-semibold">Sign Out</span>
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <button
              onClick={() => signOut({ redirectUrl: "/" })}
              title="Sign Out"
              className={`flex items-center gap-4 py-3 w-full text-left text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 ${isCollapsed ? "justify-center px-0" : "px-4"}`}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-semibold truncate">Sign Out</span>
              )}
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
