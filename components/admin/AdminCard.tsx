"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AdminCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AdminCard({ children, className, ...props }: AdminCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-[#0B1120] border border-[#1E293B] p-5 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
