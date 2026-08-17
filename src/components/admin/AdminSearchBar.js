"use client";

import { Search, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminSearchBar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  statusOptions = [],
  sortFilter,
  setSortFilter,
  sortOptions = [],
  totalCount,
  countLabel = "Total",
  onRefresh,
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          placeholder="Search by ID, Name, or Email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-500/50 transition-colors"
        />
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto">
        {statusOptions.length > 0 && (
          <div className="w-full md:w-36 shrink-0">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full bg-slate-50 dark:bg-[#020617] border-slate-200 dark:border-slate-800 rounded-xl h-[46px] text-sm font-semibold text-slate-700 dark:text-slate-200 focus:ring-blue-500 dark:focus:ring-blue-500/50">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                <SelectItem
                  value="ALL"
                  className="font-semibold text-sm focus:bg-slate-100 dark:focus:bg-slate-800/50 focus:text-slate-900 dark:focus:text-slate-50"
                >
                  All Status
                </SelectItem>
                {statusOptions.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="font-semibold text-sm focus:bg-slate-100 dark:focus:bg-slate-800/50 focus:text-slate-900 dark:focus:text-slate-50"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {sortOptions.length > 0 && (
          <div className="w-full md:w-36 shrink-0">
            <Select value={sortFilter} onValueChange={setSortFilter}>
              <SelectTrigger className="w-full bg-slate-50 dark:bg-[#020617] border-slate-200 dark:border-slate-800 rounded-xl h-[46px] text-sm font-semibold text-slate-700 dark:text-slate-200 focus:ring-blue-500 dark:focus:ring-blue-500/50">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                {sortOptions.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="font-semibold text-sm focus:bg-slate-100 dark:focus:bg-slate-800/50 focus:text-slate-900 dark:focus:text-slate-50"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {totalCount !== undefined && (
          <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl px-4 flex items-center justify-center shadow-sm h-[46px] shrink-0 min-w-[70px]">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
              {totalCount}
            </span>
          </div>
        )}

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl px-3 flex items-center justify-center shadow-sm h-[46px] shrink-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 group-active:animate-spin" />
          </button>
        )}
      </div>
    </div>
  );
}
