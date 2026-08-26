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
    <div className={cn("flex space-x-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-white/[0.10]/60 overflow-x-auto", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap",
              isActive
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white  border border-slate-200/50 dark:border-white/[0.10]/50"
                : "text-slate-600 dark:text-[#6F8583] hover:text-slate-900 dark:hover:text-[#F2FAF9] hover:bg-slate-800 hover:text-[#F2FAF9]"
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  "px-2 py-0.5 text-[10px] rounded-full",
                  isActive
                    ? "bg-[#18D6D0]/20 text-[#0891b2] dark:text-[#18D6D0]"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-[#A8BCBA]"
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
