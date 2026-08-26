import React from "react";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8 text-slate-700 dark:text-[#A8BCBA] leading-relaxed text-sm">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        Syarat & Ketentuan Layanan
      </h1>
      <p className="text-xs text-slate-500 font-mono">Terakhir diperbarui: 25 Agustus 2026</p>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Penerimaan Ketentuan</h2>
        <p>Dengan mengakses atau menggunakan platform Nexarin Tech Hub, Anda menyetujui untuk terikat oleh ketentuan penggunaan yang berlaku.</p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Hak Kekayaan Intelektual</h2>
        <p>Seluruh materi publikasi, merek Nexarin by Rins, dan source code produk digital dilindungi oleh undang-undang hak cipta.</p>
      </div>
    </div>
  );
}
