"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CustomerStatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  className?: string;
}

export function CustomerStatCard({
  label,
  value,
  subtext,
  icon,
  badge,
  badgeColor = "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
  className
}: CustomerStatCardProps) {
  return (
    <div className={cn("p-5 rounded-2xl bg-[#131E32] border border-[#1E293B] flex flex-col justify-between space-y-3 shadow-sm", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">
          {label}
        </span>
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-[#0B1120] border border-slate-800 flex items-center justify-center text-[#2DD4F5]">
            {icon}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            {value}
          </span>
          {badge && (
            <span className={cn("text-[10px] font-mono font-bold px-2 py-0.5 rounded-full", badgeColor)}>
              {badge}
            </span>
          )}
        </div>
        {subtext && (
          <p className="text-[11px] text-slate-400 mt-1 truncate">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}
