import React from "react";
import { Card } from "@/components/ui/Card";
import { FileCode2, Terminal, Database, Sparkles, BookOpen } from "lucide-react";

export default function CustomerDocsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Dokumentasi & Panduan Setup
        </h1>
        <p className="text-xs text-slate-500 dark:text-[#6F8583]">
          Panduan langkah demi langkah implementasi produk digital Nexarin
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-[#18D6D0]">
            <Terminal className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              1. Instalasi Dependensi Lokal
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-[#6F8583] leading-relaxed">
            Ekstrak file ZIP hasil unduhan, lalu jalankan perintah berikut di terminal:
          </p>
          <pre className="p-3 rounded-xl bg-slate-900 text-cyan-300 font-mono text-xs overflow-x-auto">
            <code>npm install{'\n'}npm run dev</code>
          </pre>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-500">
            <Database className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              2. Konfigurasi Database Supabase
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-[#6F8583] leading-relaxed">
            Salin berkas <code className="text-cyan-500">.env.example</code> menjadi <code className="text-cyan-500">.env.local</code> dan masukkan kredensial Supabase URL serta Anon Key.
          </p>
          <pre className="p-3 rounded-xl bg-slate-900 text-cyan-300 font-mono text-xs overflow-x-auto">
            <code>NEXT_PUBLIC_SUPABASE_URL=...{'\n'}NEXT_PUBLIC_SUPABASE_ANON_KEY=...</code>
          </pre>
        </Card>
      </div>
    </div>
  );
}
