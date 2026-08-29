"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface DigitalCategoryFilter {
  id: string;
  name: string;
  count?: number;
}

interface DigitalCategoryNavProps {
  categories: DigitalCategoryFilter[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

export function DigitalCategoryNav({
  categories,
  activeCategory,
  onSelectCategory
}: DigitalCategoryNavProps) {
  return (
    <nav aria-label="Digital Subcategories" className="border-b border-white/[0.08] bg-[#0B1120]/95 backdrop-blur-xl sticky top-16 sm:top-20 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto py-3 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 select-none",
                  isActive
                    ? "bg-[#2DD4F5]/15 text-[#2DD4F5] font-bold border border-[#2DD4F5]/40"
                    : "text-[#94A3B8] hover:text-white hover:bg-white/[0.04] border border-transparent"
                )}
              >
                <span>{cat.name}</span>
                {cat.count !== undefined && (
                  <span
                    className={cn(
                      "text-[10px] font-mono rounded-full px-2 py-0.2",
                      isActive
                        ? "bg-[#2DD4F5]/25 text-[#2DD4F5] font-bold"
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
