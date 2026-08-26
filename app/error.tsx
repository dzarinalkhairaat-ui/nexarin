"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/15 text-rose-500 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="font-mono text-sm font-bold text-rose-500">Sistem Error</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Terjadi Kesalahan Sistem
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#6F8583] leading-relaxed">
            Terjadi kendala saat memproses permintaan Anda. Silakan coba muat ulang halaman.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => reset()} className="font-bold">
          <RefreshCw className="w-4 h-4 mr-2" />
          Muat Ulang Halaman
        </Button>
      </div>
    </div>
  );
}
