"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, Info, CheckCircle2 } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary" | "warning";
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  variant = "primary",
  isLoading = false
}: ConfirmModalProps) {
  const iconMap = {
    danger: (
      <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4">
        <AlertTriangle className="w-6 h-6" />
      </div>
    ),
    warning: (
      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
        <AlertTriangle className="w-6 h-6" />
      </div>
    ),
    primary: (
      <div className="w-12 h-12 rounded-2xl bg-[#18D6D0]/10 text-[#0891b2] dark:text-[#18D6D0] flex items-center justify-center mb-4">
        <Info className="w-6 h-6" />
      </div>
    )
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="flex flex-col items-center text-center">
        {iconMap[variant]}
        <h4 className="text-lg font-bold text-slate-900 dark:text-[#F2FAF9] mb-2">
          {title}
        </h4>
        <p className="text-sm text-slate-600 dark:text-[#6F8583] mb-6 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center gap-3 w-full">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={variant === "danger" ? "danger" : "primary"}
            className="flex-1"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
