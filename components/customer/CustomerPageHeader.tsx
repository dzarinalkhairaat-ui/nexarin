"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CustomerPageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function CustomerPageHeader({
  title,
  description,
  badge,
  actions,
  className
}: CustomerPageHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]", className)}>
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {title}
          </h1>
          {badge && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#7CF2C3]/15 text-[#7CF2C3] text-[11px] font-mono font-bold border border-[#7CF2C3]/30">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-[#64748B] leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2.5 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
