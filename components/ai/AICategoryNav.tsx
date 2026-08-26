"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface AICategoryFilter {
  id: string;
  name: string;
  count?: number;
}

interface AICategoryNavProps {
  categories: AICategoryFilter[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

export function AICategoryNav({
  categories,
  activeCategory,
  onSelectCategory
}: AICategoryNavProps) {
  return (
    <nav aria-label="AI Subcategories" className="border-b border-[#1E293B] bg-[#0B1120]/95 backdrop-blur-md sticky top-16 sm:top-20 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-3 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 select-none",
                  isActive
                    ? "bg-[#2DD4F5]/15 text-[#2DD4F5] font-bold border border-[#2DD4F5]/30"
                    : "text-[#94A3B8] hover:text-white hover:bg-white/[0.04] border border-transparent"
                )}
              >
                <span>{cat.name}</span>
                {cat.count !== undefined && (
                  <span
                    className={cn(
                      "text-[10px] font-mono rounded px-1.5 py-0.2",
                      isActive
                        ? "bg-[#2DD4F5]/20 text-[#2DD4F5]"
                        : "bg-white/[0.06] text-[#64748B]"
                    )}
                  >
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
