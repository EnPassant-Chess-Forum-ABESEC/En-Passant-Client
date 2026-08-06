"use client";

import { Search } from "lucide-react";
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
  statusOptions = []
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
      
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by ID, Name, or Email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        />
      </div>

      {/* Filters Group */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        
        {/* Status Dropdown */}
        <div className="w-full md:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full bg-slate-50 border-slate-200 rounded-xl h-[46px] text-sm font-semibold text-slate-700 focus:ring-blue-500">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 text-slate-800">
              <SelectItem value="ALL" className="font-semibold text-sm focus:bg-slate-100 focus:text-slate-900">All Status</SelectItem>
              {statusOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value} className="font-semibold text-sm focus:bg-slate-100 focus:text-slate-900">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

      </div>
    </div>
  );
}
