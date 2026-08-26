import React from "react";

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8 text-slate-700 dark:text-[#94A3B8] leading-relaxed text-sm">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        Kebijakan Pengembalian Dana (Refund Policy)
      </h1>
      <p className="text-xs text-slate-500 font-mono">Terakhir diperbarui: 25 Agustus 2026</p>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Ketentuan Refund Produk Digital</h2>
        <p>Mengingat produk berupa source code digital dan kami telah menyediakan fitur <strong>Trial Gratis 3 Hari</strong> untuk pengujian awal, permohonan refund akan dievaluasi secara manual oleh tim admin sesuai kendala teknis yang valid.</p>
      </div>
    </div>
  );
}
