"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import {
  User as UserIcon,
  Mail,
  Lock,
  Building,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { registerCustomer, loginWithGoogle, isCustomerAuthenticated } = useAuth();
  const { showToast } = useNotification();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectUrl = searchParams.get("redirect") || "/customer";

  useEffect(() => {
    if (isCustomerAuthenticated) {
      router.push(redirectUrl);
    }
  }, [isCustomerAuthenticated, redirectUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!agreeTerms) {
      setErrorMsg("Anda harus menyetujui Ketentuan Layanan & Kebijakan Privasi.");
      return;
    }

    setLoading(true);

    try {
      const res = await registerCustomer(name, email, password, company);
      if (res.success) {
        showToast({
          type: "success",
          title: "Registrasi Berhasil",
          message: "Selamat datang di Nexarin Tech Hub! Akun Anda siap digunakan."
        });
        router.push(redirectUrl);
      } else {
        setErrorMsg(res.error || "Gagal membuat akun.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kendala saat menghubungkan ke server.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setErrorMsg("");
    setGoogleLoading(true);

    try {
      const res = await loginWithGoogle(redirectUrl);
      if (res.success) {
        showToast({
          type: "success",
          title: "Pendaftaran Google Berhasil",
          message: "Akun Google Anda berhasil terhubung!"
        });
        if (!window.location.href.includes("supabase.co")) {
          router.push(redirectUrl);
        }
      } else {
        setErrorMsg(res.error || "Gagal mendaftar dengan Google.");
      }
    } catch (err) {
      setErrorMsg("Gagal menginisialisasi sesi Google OAuth.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B1120] text-[#F8FAFC] flex flex-col justify-between relative overflow-hidden selection:bg-[#2DD4F5]/30">
      {/* 1. Background Atmosphere */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.14] pointer-events-none mix-blend-luminosity scale-105 transition-transform duration-1000"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#080D1A]/80 via-[#080D1A]/95 to-[#080D1A] pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#2DD4F5]/10 via-[#0891B2]/5 to-transparent blur-3xl pointer-events-none" />

      {/* 2. Top Header Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
          <span>Kembali ke Beranda</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#7CF2C3]" />
          <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider">
            Nexarin Registration
          </span>
        </div>
      </header>

      {/* 3. Main Form Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-[460px] rounded-3xl bg-[#0F172A]/90 border border-white/[0.12] p-7 sm:p-9 space-y-6 shadow-2xl backdrop-blur-2xl">
          {/* Headline */}
          <div className="text-center space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 justify-center mb-1 group">
              <div className="w-10 h-10 rounded-xl bg-[#2DD4F5]/15 border border-[#2DD4F5]/30 flex items-center justify-center text-[#2DD4F5] group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                NEXARIN <span className="text-[#2DD4F5] font-light">TECH</span>
              </span>
            </Link>

            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Daftar Akun Customer
            </h1>
            <p className="text-xs text-[#94A3B8] leading-relaxed max-w-xs mx-auto">
              Simpan riwayat lisensi software, akses materi pembelajaran, dan kelola unduhan produk Anda.
            </p>
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMsg}</span>
            </div>
          )}

          {/* 1-CLICK GOOGLE REGISTER BUTTON */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleRegister}
              disabled={googleLoading || loading}
              className="w-full h-11 sm:h-12 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm transition-all duration-150 flex items-center justify-center gap-3 border border-slate-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm active:scale-[0.99]"
            >
              {googleLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  <span>Menghubungkan ke Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Daftar Cepat dengan Google</span>
                </>
              )}
            </button>

            {/* Visual Divider */}
            <div className="relative flex items-center justify-center py-1">
              <div className="w-full border-t border-white/[0.10]" />
              <span className="absolute bg-[#0F172A] px-3 text-[10px] font-mono uppercase tracking-wider text-[#64748B]">
                atau dengan email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Nama Lengkap */}
            <div className="space-y-1 text-left">
              <label htmlFor="reg-name" className="block text-xs font-semibold text-[#94A3B8]">
                Nama Lengkap
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none text-slate-500">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  id="reg-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Lengkap Anda"
                  className="w-full h-10 sm:h-11 rounded-xl border border-white/[0.08] bg-[#0B1120] text-[#F8FAFC] pl-10 pr-4 text-xs font-medium placeholder:text-slate-500 transition-colors focus:outline-none focus:border-[#2DD4F5] focus:ring-1 focus:ring-[#2DD4F5]"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1 text-left">
              <label htmlFor="reg-email" className="block text-xs font-semibold text-[#94A3B8]">
                Alamat Email
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full h-10 sm:h-11 rounded-xl border border-white/[0.08] bg-[#0B1120] text-[#F8FAFC] pl-10 pr-4 text-xs font-medium placeholder:text-slate-500 transition-colors focus:outline-none focus:border-[#2DD4F5] focus:ring-1 focus:ring-[#2DD4F5]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1 text-left">
              <label htmlFor="reg-password" className="block text-xs font-semibold text-[#94A3B8]">
                Password (min. 6 karakter)
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 sm:h-11 rounded-xl border border-white/[0.08] bg-[#0B1120] text-[#F8FAFC] pl-10 pr-11 text-xs font-medium placeholder:text-slate-500 transition-colors focus:outline-none focus:border-[#2DD4F5] focus:ring-1 focus:ring-[#2DD4F5]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-1.5 text-[#64748B] hover:text-[#F8FAFC] transition-colors"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Organisasi / Sekolah (Opsional) */}
            <div className="space-y-1 text-left">
              <label htmlFor="reg-company" className="block text-xs font-semibold text-[#94A3B8]">
                Institusi / Organisasi (Opsional)
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none text-slate-500">
                  <Building className="w-4 h-4" />
                </div>
                <input
                  id="reg-company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="PT Inovasi Digital / Universitas..."
                  className="w-full h-10 sm:h-11 rounded-xl border border-white/[0.08] bg-[#0B1120] text-[#F8FAFC] pl-10 pr-4 text-xs font-medium placeholder:text-slate-500 transition-colors focus:outline-none focus:border-[#2DD4F5] focus:ring-1 focus:ring-[#2DD4F5]"
                />
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2 text-xs pt-1">
              <input
                id="reg-terms"
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded border-white/[0.10] bg-slate-900 text-[#2DD4F5] focus:ring-[#2DD4F5] focus:ring-offset-0"
              />
              <label htmlFor="reg-terms" className="text-[#64748B] text-[11px] leading-relaxed">
                Saya menyetujui{" "}
                <Link href="/legal/terms" className="text-[#2DD4F5] hover:underline">
                  Ketentuan Layanan
                </Link>{" "}
                dan{" "}
                <Link href="/legal/privacy" className="text-[#2DD4F5] hover:underline">
                  Kebijakan Privasi
                </Link>{" "}
                Nexarin Tech Hub.
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full h-11 sm:h-12 rounded-xl bg-[#2DD4F5] hover:bg-[#20b8d8] active:scale-[0.99] text-slate-950 font-bold text-xs sm:text-sm tracking-wide transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Membuat Akun...</span>
                </>
              ) : (
                <span>Daftar dengan Email</span>
              )}
            </button>
          </form>

          {/* Login CTA */}
          <div className="pt-4 border-t border-white/[0.08] text-center text-xs text-[#64748B]">
            Sudah memiliki akun customer?{" "}
            <Link
              href={`/login${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
              className="text-[#2DD4F5] hover:text-cyan-300 font-bold transition-colors hover:underline"
            >
              Masuk di sini
            </Link>
          </div>
        </div>
      </main>

      {/* 4. Bottom Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-[#64748B]">
        <p>© 2026 Nexarin Tech Hub. Seluruh hak cipta dilindungi.</p>
      </footer>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#0B1120] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#2DD4F5] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
