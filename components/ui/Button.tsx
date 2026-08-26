"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "mint";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed select-none rounded-xl";

    const variantStyles = {
      primary:
        "bg-[#2DD4F5] text-slate-950 hover:bg-[#38BDF8] active:bg-[#20b8d8] font-bold border border-[#2DD4F5]/30",
      mint:
        "bg-[#7CF2C3] text-slate-950 hover:bg-[#60e0ad] active:bg-[#48c998] font-extrabold border border-[#7CF2C3]/30",
      secondary:
        "bg-[#0F172A]/80 backdrop-blur-md text-slate-100 hover:bg-[#1E293B] hover:text-white border border-[#1E293B]",
      outline:
        "bg-transparent border border-[#1E293B] text-slate-300 hover:text-white hover:bg-[#0F172A]/60 hover:border-[#2DD4F5]/40",
      ghost:
        "text-slate-300 hover:text-white hover:bg-white/[0.05]",
      danger:
        "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 font-semibold border border-rose-500/30",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-xs sm:text-sm px-4 py-2.5 gap-2",
      lg: "text-sm sm:text-base px-6 py-3 gap-2.5",
      icon: "h-9 w-9 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
