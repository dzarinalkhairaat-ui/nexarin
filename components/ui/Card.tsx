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
        "rounded-2xl border border-white/[0.08] backdrop-blur-md text-[#F2FAF9] overflow-hidden transition-all duration-200",
        elevated ? "bg-white/[0.055] border-white/[0.12]" : "bg-white/[0.035]",
        hoverable && "hover:bg-white/[0.055] hover:border-[#18D6D0]/25 hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
