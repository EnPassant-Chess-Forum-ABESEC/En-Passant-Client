"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { useClerk } from "@clerk/nextjs";

export default function AdminNotFound() {
  const { signOut } = useClerk();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] font-sans">
      <div className="text-center p-12 border border-red-900/30 bg-[#1a0505] rounded-xl shadow-2xl max-w-md w-full">
        <h1 className="text-4xl font-black  text-[#9b1a1a] tracking-widest mb-4">Access Denied</h1>
        <p className="text-red-500/70 tracking-wider text-sm  mb-8 leading-relaxed">
          You either do not have administrative privileges, or your session has expired.
        </p>
        
        <div className="flex flex-col gap-4">
          <Link href="/" className="btn-bracket w-full block">
            <div className="btn-inner text-center">
              Return to Home
            </div>
          </Link>
          
          <button 
            onClick={() => signOut({ redirectUrl: "/" })}
            className="flex items-center justify-center gap-2 text-white/40 hover:text-white transition-colors mt-4 text-xs font-bold  tracking-widest"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
