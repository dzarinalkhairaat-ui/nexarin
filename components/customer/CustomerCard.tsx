"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CustomerCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CustomerCard({ children, className, ...props }: CustomerCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-[#131E32] border border-[#1E293B] p-5 sm:p-6 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
