import React from "react";
import { Card } from "@/components/ui/Card";
import { Sparkles, ShieldCheck, Heart, Cpu, Code2, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div suppressHydrationWarning className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2DD4F5]/10 text-[#0891b2] dark:text-[#2DD4F5] text-xs font-bold font-mono uppercase">
          <span>Tentang Platform</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Nexarin Tech Hub — by Rins
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-[#64748B] max-w-xl mx-auto leading-relaxed">
          Menghubungkan wawasan teknologi mutakhir, edukasi AI, dan produk rekayasa digital siap pakai dalam satu ekosistem terpadu.
        </p>
      </div>

      <div className="space-y-6 text-sm sm:text-base text-slate-700 dark:text-[#94A3B8] leading-relaxed">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white pt-4">
          Filosofi & Visi Kami
        </h2>
        <p>
          Nexarin Tech Hub bukan sekadar portal berita dan bukan sekadar marketplace digital. Kami percaya pada siklus nilai berkesinambungan:
        </p>
        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-center font-mono font-bold text-cyan-600 dark:text-cyan-400 text-xs sm:text-sm">
          Informasi → Edukasi → Kepercayaan → Rekomendasi → Trial → Pembelian → Retensi
        </div>
        <p>
          Setiap baris konten kurasi editorial kami diolah dengan bantuan asisten AI Gemini Spark dan disempurnakan melalui review manual mendalam, guna memastikan standar kualitas tertinggi tanpa sampah informasi (*Anti-AI-Slop*).
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
        <Card className="p-6 text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center mx-auto mb-2">
            <Cpu className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">Human-Centered</h4>
          <p className="text-xs text-slate-500 leading-relaxed">Didesain khusus untuk mempermudah pemahaman manusia atas teknologi canggih.</p>
        </Card>

        <Card className="p-6 text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto mb-2">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">Standar Profesional</h4>
          <p className="text-xs text-slate-500 leading-relaxed">Aplikasi digital teruji dengan kode bersih dan lisensi seumur hidup.</p>
        </Card>

        <Card className="p-6 text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center mx-auto mb-2">
            <Code2 className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">Zero Dead Code</h4>
          <p className="text-xs text-slate-500 leading-relaxed">Arsitektur modular, terawat, dan mudah dikembangkan secara berkelanjutan.</p>
        </Card>
      </div>
    </div>
  );
}
