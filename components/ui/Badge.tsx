"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "cyan" | "mint" | "secondary" | "outline" | "danger" | "warning" | "slate";
  size?: "sm" | "md";
}

export function Badge({ className, variant = "cyan", size = "md", children, ...props }: BadgeProps) {
  const variantStyles = {
    cyan: "bg-[#18D6D0]/10 text-[#18D6D0] border-[#18D6D0]/25",
    mint: "bg-[#49D7A5]/10 text-[#49D7A5] border-[#49D7A5]/25",
    secondary: "bg-white/[0.05] text-[#A8BCBA] border-white/[0.10]",
    outline: "bg-transparent text-[#A8BCBA] border-white/[0.12]",
    danger: "bg-[#E06C75]/10 text-[#E06C75] border-[#E06C75]/25",
    warning: "bg-[#E4C46A]/10 text-[#E4C46A] border-[#E4C46A]/25",
    slate: "bg-white/[0.04] text-[#6F8583] border-white/[0.08]",
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
