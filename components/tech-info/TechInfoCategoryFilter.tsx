"use client";

import React from "react";
import Link from "next/link";
import { TECH_INFO_NAV_LINKS } from "@/lib/constants";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TechInfoCategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function TechInfoCategoryFilter({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange
}: TechInfoCategoryFilterProps) {
  return (
    <div className="border-b border-white/[0.08] bg-[#0B1120]/95 backdrop-blur-xl sticky top-16 sm:top-20 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            {TECH_INFO_NAV_LINKS.map((item) => {
              const isSelected = selectedCategory === item.category;
              return (
                <button
                  key={item.category}
                  type="button"
                  onClick={() => onSelectCategory(item.category)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all select-none",
                    isSelected
                      ? "bg-[#2DD4F5]/15 text-[#2DD4F5] font-bold border border-[#2DD4F5]/40 shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent"
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Quick Search Bar */}
          <div className="relative w-full sm:w-72">
            <div className="flex items-center rounded-full bg-[#0F172A] border border-white/[0.10] px-3 py-1.5 text-xs text-slate-300 focus-within:border-[#2DD4F5]/50 focus-within:ring-1 focus-within:ring-[#2DD4F5]/20">
              <Search className="w-3.5 h-3.5 text-slate-500 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari berita & topik..."
                className="w-full bg-transparent focus:outline-none placeholder:text-slate-600 text-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="text-slate-500 hover:text-white p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
