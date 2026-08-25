import React from "react";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        Kebijakan Privasi (Privacy Policy)
      </h1>
      <p className="text-xs text-slate-500 font-mono">Terakhir diperbarui: 25 Agustus 2026</p>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Informasi yang Kami Kumpulkan</h2>
        <p>Nexarin Tech Hub hanya mengumpulkan data yang diperlukan untuk pengoperasian layanan, registrasi akun customer, dan pengiriman lisensi produk digital.</p>
        
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Keamanan Data Pelanggan</h2>
        <p>Kami menerapkan enkripsi standar industri dan Row Level Security (RLS) pada database Supabase. Informasi rahasia dan kredensial pembayaran tidak pernah disimpan dalam format teks terbuka.</p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Tautan Eksternal & Affiliate</h2>
        <p>Portal kami menyertakan tautan affiliate ke marketplace pihak ketiga (Shopee, Tokopedia, TikTok Shop). Transaksi di platform eksternal tunduk pada kebijakan privasi masing-masing penyedia.</p>
      </div>
    </div>
  );
}
