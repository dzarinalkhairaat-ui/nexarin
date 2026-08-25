"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from "lucide-react";

function LoginForm() {
  const [email, setEmail] = useState("ahmad.fadillah@example.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginCustomer, isCustomerAuthenticated } = useAuth();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await loginCustomer(email, password);
      if (res.success) {
        showToast({
          type: "success",
          title: "Berhasil Masuk",
          message: "Selamat datang kembali di portal pelanggan Nexarin!"
        });

        if (actionIntent) {
          router.push(`${redirectUrl}?action=${actionIntent}`);
        } else {
          router.push(redirectUrl);
        }
      } else {
        setErrorMsg(res.error || "Email atau password yang Anda masukkan tidak valid.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kendala saat menghubungkan ke sistem autentikasi. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#080D1A] text-slate-100 flex flex-col justify-between relative overflow-hidden selection:bg-[#2DD4F5]/30">
      {/* 1. Layered Background Atmosphere */}
      {/* External Architectural Texture */}
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
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
          <span>Kembali ke Beranda</span>
        </Link>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2DD4F5]" />
          <span>Customer Portal • SSL Secured</span>
        </div>
      </header>

      {/* 3. Center Section: Premium Login Card */}
      <main className="relative z-10 w-full flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[420px] bg-[#0E1626] border border-[#1E293B] rounded-2xl p-7 sm:p-9 shadow-[0_24px_64px_rgba(0,0,0,0.65)] space-y-6 animate-in fade-in zoom-in-95 duration-200">
          {/* Brand Header */}
          <div className="text-center space-y-3">
            <Link href="/" className="inline-flex items-center justify-center group mb-1">
              <img
                src="/assets/nexarin-logo.png"
                alt="Nexarin Logo"
                className="w-16 h-16 object-contain drop-shadow-md group-hover:scale-105 transition-transform mx-auto"
              />
            </Link>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#2DD4F5]/10 border border-[#2DD4F5]/20 text-[10px] font-mono font-bold uppercase tracking-wider text-[#2DD4F5]">
                <span>Customer Access</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Selamat Datang Kembali
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                Masuk ke akun untuk mengunduh produk, lisensi, dan pembaruan aplikasi.
              </p>
            </div>

            {/* Context Intent Banner (e.g. from shop / direct checkout) */}
            {redirectUrl && redirectUrl !== "/customer" && (
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-left text-xs text-cyan-300 flex items-start gap-2.5 animate-in fade-in">
                <Sparkles className="w-4 h-4 text-[#2DD4F5] shrink-0 mt-0.5" />
                <span className="leading-snug">
                  Masuk ke akun Anda untuk menyelesaikan pembelian atau aktivasi lisensi produk.
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

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="customer-email" className="block text-xs font-semibold text-slate-300">
                Email Customer
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
                  className="w-full h-11 rounded-xl border border-[#1E293B] bg-[#080D1A] text-slate-100 pl-10 pr-4 text-xs font-medium placeholder:text-slate-500 transition-colors focus:outline-none focus:border-[#2DD4F5] focus:ring-1 focus:ring-[#2DD4F5]"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <label htmlFor="customer-password" className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#2DD4F5] hover:text-cyan-300 font-medium transition-colors hover:underline"
                >
                  Lupa password?
                </Link>
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="customer-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 rounded-xl border border-[#1E293B] bg-[#080D1A] text-slate-100 pl-10 pr-11 text-xs font-medium placeholder:text-slate-500 transition-colors focus:outline-none focus:border-[#2DD4F5] focus:ring-1 focus:ring-[#2DD4F5]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-1.5 text-slate-400 hover:text-slate-200 transition-colors"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 text-slate-400 hover:text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-[#2DD4F5] focus:ring-[#2DD4F5] focus:ring-offset-0"
                />
                <span>Ingat saya</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 sm:h-12 rounded-xl bg-[#2DD4F5] hover:bg-[#20b8d8] active:scale-[0.99] text-slate-950 font-bold text-xs sm:text-sm tracking-wide shadow-md shadow-[#2DD4F5]/10 transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-3"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Memproses Masuk...</span>
                </>
              ) : (
                <span>Masuk ke Akun</span>
              )}
            </button>
          </form>

          {/* Register CTA */}
          <div className="pt-4 border-t border-[#1E293B] text-center text-xs text-slate-400">
            Belum memiliki akun customer?{" "}
            <Link
              href={`/register${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}${actionIntent ? `&action=${actionIntent}` : ""}`}
              className="text-[#2DD4F5] hover:text-cyan-300 font-bold transition-colors hover:underline"
            >
              Daftar Sekarang →
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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#080D1A] flex items-center justify-center text-xs text-slate-400 font-mono">
          Memuat halaman masuk...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
