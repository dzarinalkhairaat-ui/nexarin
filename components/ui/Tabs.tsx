"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
  tabs: { id: string; label: string; count?: number; icon?: React.ReactNode }[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex space-x-1.5 p-1.5 bg-[#0F172A]/80 backdrop-blur-md rounded-2xl border border-[#1E293B] overflow-x-auto scrollbar-none", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap",
              isActive
                ? "bg-[#131E32] text-white border border-[#2DD4F5]/30 font-bold"
                : "text-[#94A3B8] hover:text-white hover:bg-white/[0.04]"
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  "px-2 py-0.5 text-[10px] font-mono rounded-full font-bold",
                  isActive
                    ? "bg-[#2DD4F5]/15 text-[#2DD4F5]"
                    : "bg-white/[0.06] text-[#64748B]"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
