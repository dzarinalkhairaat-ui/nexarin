"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AdminStatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    positive?: boolean;
  };
  className?: string;
}

export function AdminStatCard({
  label,
  value,
  subtext,
  icon,
  trend,
  className
}: AdminStatCardProps) {
  return (
    <div className={cn("p-4 rounded-2xl bg-[#0B1120] border border-white/[0.08] flex flex-col justify-between space-y-3", className)}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] font-semibold">
          {label}
        </span>
        {icon && (
          <div className="w-8 h-8 rounded-xl bg-slate-900 border border-white/[0.08] text-cyan-400 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>

      <div>
        <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight block">
          {value}
        </span>
        <div className="flex items-center gap-2 mt-1">
          {trend && (
            <span
              className={cn(
                "text-[10px] font-mono font-bold px-1.5 py-0.2 rounded",
                trend.positive
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-rose-500/10 text-rose-400"
              )}
            >
              {trend.positive ? "↑" : "↓"} {trend.value}
            </span>
          )}
          {subtext && (
            <span className="text-[11px] text-[#64748B] truncate">
              {subtext}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
