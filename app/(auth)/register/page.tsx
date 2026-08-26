"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import {
  User,
  Mail,
  Lock,
  Building,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  Sparkles
} from "lucide-react";

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [company, setCompany] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const { registerCustomer, isCustomerAuthenticated } = useAuth();
  const { showToast } = useNotification();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectUrl = searchParams.get("redirect") || "/customer";
  const actionIntent = searchParams.get("action");

  // If customer is already authenticated, redirect immediately
  useEffect(() => {
    if (isCustomerAuthenticated) {
      if (actionIntent) {
        router.push(`${redirectUrl}?action=${actionIntent}`);
      } else {
        router.push(redirectUrl);
      }
    }
  }, [isCustomerAuthenticated, redirectUrl, actionIntent, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password.length < 6) {
      setErrorMsg("Password minimal 6 karakter.");
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      setErrorMsg("Konfirmasi password tidak cocok dengan password yang dimasukkan.");
      return;
    }

    setLoading(true);

    try {
      const res = await registerCustomer(name, email, password, company);
      if (res.success) {
        showToast({
          type: "success",
          title: "Pendaftaran Berhasil!",
          message: "Akun customer Anda telah aktif dan siap digunakan."
        });

        if (actionIntent) {
          router.push(`${redirectUrl}?action=${actionIntent}`);
        } else {
          router.push(redirectUrl);
        }
      } else {
        setErrorMsg(res.error || "Gagal mendaftarkan akun customer.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan sistem saat mendaftar. Silakan coba kembali.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#061214] text-[#F2FAF9] flex flex-col justify-between relative overflow-hidden selection:bg-[#18D6D0]/30">
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
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#18D6D0]/10 via-[#0891B2]/5 to-transparent blur-3xl pointer-events-none" />

      {/* 2. Top Header Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#6F8583] hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
          <span>Kembali ke Beranda</span>
        </Link>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-white/[0.08] text-[11px] font-mono text-[#6F8583]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#18D6D0]" />
          <span>Customer Registration • SSL Secured</span>
        </div>
      </header>

      {/* 3. Center Section: Premium Registration Card */}
      <main className="relative z-10 w-full flex items-center justify-center px-4 py-6 sm:py-10">
        <div className="w-full max-w-[460px] bg-[#0E1626] border border-white/[0.08] rounded-2xl p-7 sm:p-9 space-y-6 animate-in fade-in zoom-in-95 duration-200">
          {/* Brand Header */}
          <div className="text-center space-y-3">
            <Link href="/" className="inline-flex items-center justify-center group mb-1">
              <img
                src="/assets/nexarin-logo.png"
                alt="Nexarin Logo"
                className="w-16 h-16 object-contain drop- group-hover:scale-105 transition-transform mx-auto"
              />
            </Link>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#18D6D0]/10 border border-[#18D6D0]/20 text-[10px] font-mono font-bold uppercase tracking-wider text-[#18D6D0]">
                <span>Customer Registration</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Buat Akun Customer
              </h1>
              <p className="text-xs text-[#6F8583] leading-relaxed max-w-xs mx-auto">
                Daftar untuk akses produk digital, source code &amp; lisensi lifetime
              </p>
            </div>

            {/* Context Intent Banner */}
            {redirectUrl && redirectUrl !== "/customer" && (
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-left text-xs text-cyan-300 flex items-start gap-2.5 animate-in fade-in">
                <Sparkles className="w-4 h-4 text-[#18D6D0] shrink-0 mt-0.5" />
                <span className="leading-snug">
                  Daftar akun untuk menyelesaikan pembelian produk pilihan Anda.
                </span>
              </div>
            )}
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMsg}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-3.5">
            {/* Nama Lengkap */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="customer-name" className="block text-xs font-semibold text-[#A8BCBA]">
                Nama Lengkap
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="customer-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Ahmad Fadillah"
                  className="w-full h-11 rounded-xl border border-white/[0.08] bg-[#061214] text-[#F2FAF9] pl-10 pr-4 text-xs font-medium placeholder:text-slate-500 transition-colors focus:outline-none focus:border-[#18D6D0] focus:ring-1 focus:ring-[#18D6D0]"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="customer-email" className="block text-xs font-semibold text-[#A8BCBA]">
                Alamat Email
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="customer-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full h-11 rounded-xl border border-white/[0.08] bg-[#061214] text-[#F2FAF9] pl-10 pr-4 text-xs font-medium placeholder:text-slate-500 transition-colors focus:outline-none focus:border-[#18D6D0] focus:ring-1 focus:ring-[#18D6D0]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="customer-password" className="block text-xs font-semibold text-[#A8BCBA]">
                Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="customer-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full h-11 rounded-xl border border-white/[0.08] bg-[#061214] text-[#F2FAF9] pl-10 pr-11 text-xs font-medium placeholder:text-slate-500 transition-colors focus:outline-none focus:border-[#18D6D0] focus:ring-1 focus:ring-[#18D6D0]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-1.5 text-[#6F8583] hover:text-[#F2FAF9] transition-colors"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Konfirmasi Password */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="customer-confirm-password" className="block text-xs font-semibold text-[#A8BCBA]">
                Konfirmasi Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="customer-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password di atas"
                  className="w-full h-11 rounded-xl border border-white/[0.08] bg-[#061214] text-[#F2FAF9] pl-10 pr-11 text-xs font-medium placeholder:text-slate-500 transition-colors focus:outline-none focus:border-[#18D6D0] focus:ring-1 focus:ring-[#18D6D0]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 p-1.5 text-[#6F8583] hover:text-[#F2FAF9] transition-colors"
                  aria-label={showConfirmPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Institusi / Sekolah (Opsional) */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="customer-company" className="block text-xs font-semibold text-[#A8BCBA]">
                Institusi / Sekolah / Perusahaan (Opsional)
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none text-slate-500">
                  <Building className="w-4 h-4" />
                </div>
                <input
                  id="customer-company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Contoh: SMA Nusantara Digital"
                  className="w-full h-11 rounded-xl border border-white/[0.08] bg-[#061214] text-[#F2FAF9] pl-10 pr-4 text-xs font-medium placeholder:text-slate-500 transition-colors focus:outline-none focus:border-[#18D6D0] focus:ring-1 focus:ring-[#18D6D0]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 sm:h-12 rounded-xl bg-[#18D6D0] hover:bg-[#20b8d8] active:scale-[0.99] text-slate-950 font-bold text-xs sm:text-sm tracking-wide /10 transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Mendaftarkan Akun...</span>
                </>
              ) : (
                <span>Daftar Sekarang</span>
              )}
            </button>
          </form>

          {/* Login CTA */}
          <div className="pt-4 border-t border-white/[0.08] text-center text-xs text-[#6F8583]">
            Sudah memiliki akun customer?{" "}
            <Link
              href={`/login${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}${actionIntent ? `&action=${actionIntent}` : ""}`}
              className="text-[#18D6D0] hover:text-cyan-300 font-bold transition-colors hover:underline"
            >
              Masuk di sini →
            </Link>
          </div>
        </div>
      </main>

      {/* 4. Bottom Footer */}
      <footer className="relative z-10 w-full py-6 text-center text-xs text-slate-500 font-mono">
        <p>© 2026 Nexarin Tech Hub • Official Customer Application</p>
      </footer>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#061214] flex items-center justify-center text-xs text-[#6F8583] font-mono">
          Memuat halaman pendaftaran...
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
