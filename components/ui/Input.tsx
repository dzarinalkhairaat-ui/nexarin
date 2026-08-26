"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-[#A8BCBA] mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[#6F8583]">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "w-full rounded-xl border border-white/[0.10] bg-white/[0.035] text-[#F2FAF9] px-4 py-2.5 text-xs sm:text-sm transition-all focus:outline-none focus:border-[#18D6D0]/40 focus:bg-white/[0.055] placeholder:text-[#6F8583] disabled:opacity-40",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-[#E06C75]/60 focus:border-[#E06C75]",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 flex items-center text-[#6F8583]">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="mt-1.5 text-xs text-[#E06C75]">{error}</p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-[#6F8583]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
