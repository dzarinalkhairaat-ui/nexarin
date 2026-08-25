import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({ className, hoverable = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#1E293B] bg-[#131E32] text-slate-100 shadow-lg overflow-hidden",
        hoverable && "nexarin-card",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
