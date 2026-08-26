"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  elevated?: boolean;
}

export function Card({ className, hoverable = false, elevated = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#1E293B] backdrop-blur-md text-slate-100 overflow-hidden transition-all duration-200",
        elevated ? "bg-[#131E32]/90 border-cyan-500/20" : "bg-[#131E32]/70",
        hoverable && "hover:bg-[#131E32] hover:border-cyan-500/40 hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
