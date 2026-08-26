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
        "rounded-2xl bg-white/[0.035] border border-white/[0.08] p-5 sm:p-6 ",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
