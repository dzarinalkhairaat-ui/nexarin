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
    success: <CheckCircle2 className="w-4 h-4 text-[#7CF2C3] shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-4 h-4 text-[#E06C75] shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-4 h-4 text-[#E4C46A] shrink-0 mt-0.5" />,
    info: <Info className="w-4 h-4 text-[#2DD4F5] shrink-0 mt-0.5" />,
  };

  const borders = {
    success: "border-[#7CF2C3]/30 bg-[#0F172A]/95 text-[#F8FAFC]",
    error: "border-[#E06C75]/30 bg-[#0F172A]/95 text-[#F8FAFC]",
    warning: "border-[#E4C46A]/30 bg-[#0F172A]/95 text-[#F8FAFC]",
    info: "border-[#2DD4F5]/30 bg-[#0F172A]/95 text-[#F8FAFC]",
  };

  return (
    <div
      className={cn(
        "pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl transition-all animate-in slide-in-from-bottom-4 duration-200",
        borders[toast.type]
      )}
    >
      {icons[toast.type]}
      <div className="flex-1 min-w-0">
        <h4 className="text-xs sm:text-sm font-semibold text-[#F8FAFC]">
          {toast.title}
        </h4>
        {toast.message && (
          <p className="text-xs text-[#94A3B8] mt-0.5 leading-relaxed">
            {toast.message}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup Notifikasi"
        className="p-1 text-[#64748B] hover:text-[#F8FAFC] rounded-lg hover:bg-white/[0.05] transition-colors shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
