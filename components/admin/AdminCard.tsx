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
        "rounded-2xl bg-[#061214] border border-white/[0.08] p-5 ",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
