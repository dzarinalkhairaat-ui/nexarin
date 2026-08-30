import React from "react";
import { FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  icon?: React.ReactNode | React.ElementType;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionText,
  onAction
}: EmptyStateProps) {
  const renderIcon = () => {
    if (!icon) return <FolderOpen className="w-7 h-7" />;
    if (React.isValidElement(icon)) return icon;
    if (typeof icon === "function" || (typeof icon === "object" && icon !== null && "$$typeof" in icon)) {
      const IconComponent = icon as React.ElementType;
      return <IconComponent className="w-7 h-7" />;
    }
    return <FolderOpen className="w-7 h-7" />;
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl border border-dashed border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-slate-900/30">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-[#64748B] flex items-center justify-center mb-4">
        {renderIcon()}
      </div>
      <h4 className="text-base font-bold text-slate-800 dark:text-[#F8FAFC] mb-1">
        {title}
      </h4>
      <p className="text-xs text-slate-500 dark:text-[#64748B] max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
