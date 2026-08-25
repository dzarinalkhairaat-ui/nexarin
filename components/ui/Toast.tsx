"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { useNotification, ToastMessage } from "@/context/NotificationContext";
import { cn } from "@/lib/utils";

export function ToastContainer() {
  const { toasts, removeToast } = useNotification();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: ToastMessage; onClose: () => void }) {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-[#2DD4F5] shrink-0" />,
  };

  const borders = {
    success: "border-emerald-500/30 dark:border-emerald-500/20 bg-emerald-500/5",
    error: "border-rose-500/30 dark:border-rose-500/20 bg-rose-500/5",
    warning: "border-amber-500/30 dark:border-amber-500/20 bg-amber-500/5",
    info: "border-[#2DD4F5]/30 dark:border-[#2DD4F5]/20 bg-[#2DD4F5]/5",
  };

  return (
    <div
      className={cn(
        "pointer-events-auto flex items-start gap-3.5 p-4 rounded-2xl bg-white dark:bg-slate-900 border shadow-xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 duration-200",
        borders[toast.type]
      )}
    >
      {icons[toast.type]}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {toast.title}
        </h4>
        {toast.message && (
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
            {toast.message}
          </p>
        )}
      </div>
      <button
        onClick={onClose}
        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
