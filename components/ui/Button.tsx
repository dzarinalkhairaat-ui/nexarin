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
      "inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-xl";

    const variantStyles = {
      primary:
        "bg-[#2DD4F5] text-slate-950 hover:bg-[#20b8d8] active:bg-[#18a2be] focus:ring-[#2DD4F5] font-semibold shadow-sm",
      mint:
        "bg-[#7CF2C3] text-slate-950 hover:bg-[#60e0ad] active:bg-[#48c998] focus:ring-[#7CF2C3] font-semibold shadow-sm",
      secondary:
        "bg-slate-800 text-slate-100 hover:bg-slate-700 active:bg-slate-600 focus:ring-slate-400",
      outline:
        "border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-800/90 hover:text-[#2DD4F5] hover:border-slate-600 focus:ring-[#2DD4F5]",
      ghost:
        "text-slate-300 hover:bg-slate-800/80 hover:text-white focus:ring-slate-400",
      danger:
        "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 focus:ring-rose-500 shadow-sm",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2.5 gap-2",
      lg: "text-base px-6 py-3 gap-2.5",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
