import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "cyan" | "mint" | "navy" | "slate" | "danger" | "warning" | "outline";
  size?: "sm" | "md";
}

export function Badge({ className, variant = "cyan", size = "sm", children, ...props }: BadgeProps) {
  const variantStyles = {
    cyan: "bg-[#2DD4F5]/15 text-[#0891b2] dark:text-[#2DD4F5] border border-[#2DD4F5]/30",
    mint: "bg-[#7CF2C3]/15 text-[#059669] dark:text-[#7CF2C3] border border-[#7CF2C3]/30",
    navy: "bg-[#0F172A] text-white dark:bg-slate-800 border border-slate-700",
    slate: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
    danger: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    outline: "bg-transparent border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400",
  };

  const sizeStyles = {
    sm: "text-[11px] px-2.5 py-0.5 font-medium rounded-full",
    md: "text-xs px-3 py-1 font-semibold rounded-full",
  };

  return (
    <span className={cn("inline-flex items-center gap-1.5 transition-colors", variantStyles[variant], sizeStyles[size], className)} {...props}>
      {children}
    </span>
  );
}
