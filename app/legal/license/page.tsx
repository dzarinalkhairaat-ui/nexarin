import React from "react";

export default function LicenseAgreementPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8 text-slate-700 dark:text-[#A8BCBA] leading-relaxed text-sm">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        Ketentuan Lisensi Produk Digital
      </h1>
      <p className="text-xs text-slate-500 font-mono">Terakhir diperbarui: 25 Agustus 2026</p>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Lisensi Lifetime</h2>
        <p>Lisensi Lifetime memberikan hak non-eksklusif kepada pembeli untuk mengunduh, mengkustomisasi, dan menggunakan source code pada proyek komersial maupun pribadi tanpa batas waktu.</p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Lisensi Uji Coba (3-Day Trial)</h2>
        <p>Lisensi trial berlaku selama 72 jam sejak aktivasi untuk tujuan evaluasi kelayakan sistem.</p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Larangan Redistribusi Publik</h2>
        <p>Dilarang menjual ulang (*resell*), membagikan ulang, atau mengunggah source code mentah ke repositori publik tanpa izin tertulis dari Nexarin.</p>
      </div>
    </div>
  );
}
