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
        "bg-[#18D6D0] text-[#061214] hover:bg-[#43E0D8] active:bg-[#15b8b3] font-bold border border-[#18D6D0]/30",
      mint:
        "bg-[#49D7A5] text-[#061214] hover:bg-[#3ec495] active:bg-[#36b085] font-extrabold border border-[#49D7A5]/30",
      secondary:
        "bg-white/[0.055] text-[#F2FAF9] hover:bg-white/[0.08] hover:text-white border border-white/[0.10] active:bg-white/[0.10]",
      outline:
        "bg-transparent border border-white/[0.10] text-[#A8BCBA] hover:text-[#F2FAF9] hover:bg-white/[0.04] hover:border-[#18D6D0]/30",
      ghost:
        "text-[#A8BCBA] hover:text-[#F2FAF9] hover:bg-white/[0.04] active:bg-white/[0.06]",
      danger:
        "bg-[#E06C75] text-white hover:bg-[#d45862] active:bg-[#c24b55] font-semibold border border-[#E06C75]/30",
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
