"use client";

import { useAntiInspect } from "@/hooks/useAntiInspect";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, Lock, AlertCircle, Eye, EyeOff, Terminal, KeyRound } from "lucide-react";

function AdminLoginForm() {
  useAntiInspect("Admin Login Console");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginAdmin, isAdminAuthenticated } = useAuth();
  const { showToast } = useNotification();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  // If already authenticated as admin, redirect to website or redirectUrl
  useEffect(() => {
    if (isAdminAuthenticated) {
      router.push(redirectUrl);
    }
  }, [isAdminAuthenticated, redirectUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await loginAdmin(email, password);
      if (res.success) {
        showToast({
          type: "success",
          title: "Otorisasi Berhasil",
          message: "Selamat datang kembali di Admin Console."
        });
        router.push(redirectUrl);
      } else {
        setErrorMsg(res.error || "Kredensial Administrator Tidak Valid.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kegagalan komunikasi dengan sistem otentikasi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div suppressHydrationWarning className="min-h-screen w-full bg-[#0B1120] select-none flex flex-col items-center justify-center p-4 sm:p-6 text-[#F8FAFC]">
      {/* Central Admin Login Card */}
      <div className="w-full max-w-md bg-[#0B1120] rounded-3xl border border-white/[0.08] p-8 sm:p-10 space-y-6">
        {/* Brand & Identity Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-white/[0.08] text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
            <Terminal className="w-3 h-3" />
            <span>Admin Management Console</span>
          </div>

          <h1 className="text-2xl font-black text-white tracking-tight">
            Administrator Sign In
          </h1>

          <p className="text-xs text-[#64748B] max-w-xs mx-auto">
            Masukkan kredensial internal untuk mengakses sistem operasional &amp; manajemen.
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nexarin.tech"
                className="w-full rounded-xl border border-white/[0.08] bg-[#0B1120] text-[#F8FAFC] px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#2DD4F5] focus:border-transparent placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/[0.08] bg-[#0B1120] text-[#F8FAFC] px-4 py-2.5 pr-10 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#2DD4F5] focus:border-transparent placeholder:text-slate-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#F8FAFC] transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full font-bold text-sm h-11 bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Memverifikasi Akses...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <KeyRound className="w-4 h-4" />
                <span>Otorisasi Masuk Console</span>
              </span>
            )}
          </Button>
        </form>


      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen w-full bg-[#0B1120]" />}>
      <AdminLoginForm />
    </Suspense>
  );
}
