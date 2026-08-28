"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  KeyRound
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 400);
  };

  return (
    <div suppressHydrationWarning className="min-h-screen w-full bg-[#0B1120] text-[#F8FAFC] flex flex-col justify-between relative overflow-hidden selection:bg-[#2DD4F5]/30">
      {/* 1. Layered Background Atmosphere */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.14] pointer-events-none mix-blend-luminosity scale-105 transition-transform duration-1000"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')"
        }}
      />

      {/* Dark Vignette & Deep Cyan Atmospheric Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080D1A]/80 via-[#080D1A]/95 to-[#080D1A] pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#2DD4F5]/10 via-[#0891B2]/5 to-transparent blur-3xl pointer-events-none" />

      {/* 2. Top Header Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
          <span>Kembali ke Login</span>
        </Link>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-white/[0.08] text-[11px] font-mono text-[#64748B]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2DD4F5]" />
          <span>Account Recovery • SSL Secured</span>
        </div>
      </header>

      {/* 3. Center Section: Recovery Card */}
      <main className="relative z-10 w-full flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[420px] bg-[#0E1626] border border-white/[0.08] rounded-2xl p-7 sm:p-9 space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="text-center space-y-3">
            <Link href="/" className="inline-flex items-center justify-center group mb-1">
              <div className="p-2.5 rounded-2xl bg-[#0B1120] border border-white/[0.08] group-hover:border-cyan-500/40 transition-colors">
                <KeyRound className="w-8 h-8 text-[#2DD4F5]" />
              </div>
            </Link>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#2DD4F5]/10 border border-[#2DD4F5]/20 text-[10px] font-mono font-bold uppercase tracking-wider text-[#2DD4F5]">
                <span>Password Recovery</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Reset Kata Sandi
              </h1>
              <p className="text-xs text-[#64748B] leading-relaxed max-w-xs mx-auto">
                Masukkan alamat email terdaftar Anda untuk menerima tautan pemulihan akun.
              </p>
            </div>
          </div>

          {sent ? (
            <div className="space-y-5 text-center py-2 animate-in fade-in">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 leading-relaxed flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-left">
                  <strong className="block text-white mb-0.5">Tautan Telah Dikirim!</strong>
                  Instruksi pemulihan telah dikirimkan ke <strong>{email}</strong>. Silakan periksa kotak masuk email Anda.
                </div>
              </div>

              <Link
                href="/login"
                className="w-full h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-[#F8FAFC] font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Halaman Masuk</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label htmlFor="recovery-email" className="block text-xs font-semibold text-[#94A3B8]">
                  Email Terdaftar
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="recovery-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full h-11 rounded-xl border border-white/[0.08] bg-[#0B1120] text-[#F8FAFC] pl-10 pr-4 text-xs font-medium placeholder:text-slate-500 transition-colors focus:outline-none focus:border-[#2DD4F5] focus:ring-1 focus:ring-[#2DD4F5]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 sm:h-12 rounded-xl bg-[#2DD4F5] hover:bg-[#20b8d8] active:scale-[0.99] text-slate-950 font-bold text-xs sm:text-sm tracking-wide /10 transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Mengirim Tautan...</span>
                  </>
                ) : (
                  <span>Kirim Tautan Pemulihan</span>
                )}
              </button>

              <div className="pt-2 text-center">
                <Link
                  href="/login"
                  className="text-xs text-[#64748B] hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Batal dan kembali ke Login</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* 4. Bottom Footer */}
      <footer className="relative z-10 w-full py-6 text-center text-xs text-slate-500 font-mono">
        <p>© 2026 Nexarin Tech Hub • Official Customer Application</p>
      </footer>
    </div>
  );
}
