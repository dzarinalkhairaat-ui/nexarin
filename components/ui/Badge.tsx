"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "cyan" | "mint" | "secondary" | "outline" | "danger" | "warning" | "slate";
  size?: "sm" | "md";
}

export function Badge({ className, variant = "cyan", size = "md", children, ...props }: BadgeProps) {
  const variantStyles = {
    cyan: "bg-[#2DD4F5]/10 text-[#2DD4F5] border-[#2DD4F5]/25",
    mint: "bg-[#7CF2C3]/10 text-[#7CF2C3] border-[#7CF2C3]/25",
    secondary: "bg-[#0F172A]/80 text-slate-300 border-[#1E293B]",
    outline: "bg-transparent text-slate-300 border-[#1E293B]",
    danger: "bg-rose-500/10 text-rose-400 border-rose-500/25",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/25",
    slate: "bg-slate-800/80 text-slate-400 border-slate-700",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-mono font-bold rounded-lg border uppercase tracking-wider select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
