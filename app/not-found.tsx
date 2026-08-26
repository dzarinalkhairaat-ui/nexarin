import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8 animate-spin duration-1000" />
        </div>
        <div className="space-y-2">
          <span className="font-mono text-sm font-bold text-cyan-500">Error 404</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#64748B] leading-relaxed">
            Halaman yang Anda tuju mungkin telah dipindahkan, diubah tautannya, atau tidak tersedia lagi.
          </p>
        </div>
        <Link href="/">
          <Button variant="primary" size="md" className="font-bold">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    </div>
  );
}
