"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  elevated?: boolean;
}

export function Card({ className, hoverable = false, elevated = false, children, style, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-transparent backdrop-blur-xl text-slate-100 overflow-hidden transition-all duration-300",
        hoverable && "hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/10 hover:border-cyan-400/30",
        className
      )}
      style={{
        background: elevated
          ? "linear-gradient(180deg, rgba(15, 23, 42, 0.85), rgba(11, 17, 32, 0.70)) padding-box, linear-gradient(120deg, rgba(255, 255, 255, 0.22), rgba(45, 212, 245, 0.20), rgba(255, 255, 255, 0.05)) border-box"
          : "linear-gradient(180deg, rgba(15, 23, 42, 0.70), rgba(11, 17, 32, 0.50)) padding-box, linear-gradient(120deg, rgba(255, 255, 255, 0.16), rgba(45, 212, 245, 0.14), rgba(255, 255, 255, 0.04)) border-box",
        border: "1px solid transparent",
        backdropFilter: "blur(20px) saturate(130%)",
        WebkitBackdropFilter: "blur(20px) saturate(130%)",
        boxShadow: "0 12px 35px -5px rgba(0, 0, 0, 0.40), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
}
