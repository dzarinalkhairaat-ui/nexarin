"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  resendAdminLoginOtpAction,
  verifyAdminLoginOtpAction,
} from "@/features/admin/login/adminLoginOtp.actions";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function normalizeOtp(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 8);
}

function createLoginUrl(redirectedFrom) {
  if (!redirectedFrom) {
    return "/admin/login";
  }

  return `/admin/login?redirectedFrom=${encodeURIComponent(redirectedFrom)}`;
}

function AdminLoginVerifyLoading() {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-white">
      <div className="mx-auto max-w-md rounded-[30px] border border-white/10 bg-white/[0.045] p-6 text-center">
        <p className="text-sm font-black text-emerald-300">
          Loading OTP Verification...
        </p>
      </div>
    </main>
  );
}

function AdminLoginVerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createSupabaseBrowserClient();

  const redirectedFrom = searchParams.get("redirectedFrom") || "";
  const email = searchParams.get("email") || "";

  const loginUrl = useMemo(
    () => createLoginUrl(redirectedFrom),
    [redirectedFrom]
  );

  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState(null);

  async function handleVerify(event) {
    event.preventDefault();
    setMessage(null);

    const cleanOtp = normalizeOtp(otp);

    if (cleanOtp.length !== 8) {
      setMessage({
        type: "error",
        text: "Masukkan kode OTP 8 digit.",
      });
      return;
    }

    setIsVerifying(true);

    const result = await verifyAdminLoginOtpAction({
      otp: cleanOtp,
    });

    if (!result.ok) {
      setIsVerifying(false);
      setMessage({
        type: "error",
        text: result.message || "OTP salah atau sudah expired.",
      });
      return;
    }

    setMessage({
      type: "success",
      text: result.message || "OTP benar. Mengalihkan ke dashboard...",
    });

    setTimeout(() => {
      router.replace(redirectedFrom || "/admin");
      router.refresh();
    }, 700);
  }

  async function handleResendOtp() {
    setMessage(null);
    setIsResending(true);

    const result = await resendAdminLoginOtpAction();

    setIsResending(false);

    setMessage({
      type: result.ok ? "success" : "error",
      text:
        result.message ||
        (result.ok
          ? "Kode OTP baru sudah dikirim."
          : "Kode OTP baru gagal dikirim."),
    });
  }

  async function handleBackToLogin() {
    await supabase.auth.signOut();
    router.replace(loginUrl);
    router.refresh();
  }

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 sm:px-6 lg:px-8">
        {/* Background effects */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-400/[0.07] blur-[120px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

        <div className="relative z-10 w-full max-w-[400px]">
          {/* Card */}
          <form
            onSubmit={handleVerify}
            className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-7 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8"
          >
            {/* Logo & Title */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-[22px] border border-cyan-400/25 bg-slate-950 p-2.5 shadow-lg shadow-cyan-400/10">
                <img
                  src="/images/logo/nexarin-logo.png"
                  alt="Nexarin logo"
                  className="h-full w-full object-contain"
                  loading="eager"
                  decoding="async"
                />
              </div>

              <h1 className="mt-5 text-2xl font-black tracking-[-0.04em] text-white">
                Verifikasi OTP
              </h1>

              <p className="mt-2 text-xs font-medium text-slate-500">
                Masukkan kode dari email <span className="font-bold text-slate-400">{email || "admin"}</span>
              </p>
            </div>

            {/* Divider */}
            <div className="my-6 h-px bg-white/[0.08]" />

            {/* Fields */}
            <div className="grid gap-6">
              <label className="grid gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-[0.18em] text-cyan-300">
                    Kode Keamanan OTP
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 tracking-wider bg-slate-900 px-2 py-0.5 rounded-full border border-white/5">
                    8 DIGIT
                  </span>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 opacity-0 blur transition duration-500 group-focus-within:opacity-25" />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={otp}
                    onChange={(event) => setOtp(normalizeOtp(event.target.value))}
                    placeholder="••••••••"
                    autoComplete="one-time-code"
                    className="relative min-h-16 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 text-center text-3xl font-black tracking-[0.3em] text-white shadow-inner outline-none transition-all placeholder:text-2xl placeholder:tracking-[0.2em] placeholder:text-slate-700 focus:border-cyan-400/50 focus:bg-slate-900/90 focus:ring-2 focus:ring-cyan-400/20"
                  />
                </div>
              </label>

              {message ? (
                <div
                  className={[
                    "rounded-2xl border p-4 backdrop-blur-sm",
                    message.type === "success"
                      ? "border-emerald-400/20 bg-emerald-400/[0.08]"
                      : "border-amber-400/20 bg-amber-400/[0.08]",
                  ].join(" ")}
                >
                  <p
                    className={[
                      "text-sm font-bold leading-6 flex items-start gap-2",
                      message.type === "success"
                        ? "text-emerald-200"
                        : "text-amber-200",
                    ].join(" ")}
                  >
                    {message.type === "success" ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5 text-emerald-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5 text-amber-400"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    )}
                    {message.text}
                  </p>
                </div>
              ) : null}

              <div className="grid gap-3">
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="group relative flex min-h-14 w-full items-center justify-center overflow-hidden rounded-2xl border border-cyan-400/30 bg-gradient-to-r from-cyan-500 to-cyan-400 px-6 py-4 text-sm font-black text-slate-950 shadow-xl shadow-cyan-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/30 active:scale-95 disabled:pointer-events-none disabled:opacity-60"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isVerifying ? (
                      <>
                        <svg className="h-5 w-5 animate-spin text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <circle cx="12" cy="12" r="10" strokeWidth="4" strokeDasharray="32" strokeDashoffset="16" className="opacity-25"/>
                          <path d="M4 12a8 8 0 018-8v8H4z" fill="currentColor"/>
                        </svg>
                        Memverifikasi...
                      </>
                    ) : (
                      <>
                        Masuk ke Dashboard
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 z-0 bg-white/20 translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
                </button>

                <div className="grid grid-cols-2 gap-3">
                  {email.toLowerCase().endsWith("@gmail.com") && (
                    <a
                      href={`https://mail.google.com/mail/u/?authuser=${encodeURIComponent(email)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex min-h-12 items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-[13px] font-black text-rose-400 transition hover:bg-rose-500/20 hover:text-rose-300 shadow-inner"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="transition-transform group-hover:scale-110">
                        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                      </svg>
                      Inbox Gmail
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isResending || isVerifying}
                    className={`group flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2 text-[13px] font-black text-slate-300 transition hover:bg-white/[0.08] hover:text-white shadow-inner disabled:pointer-events-none disabled:opacity-60 ${!email.toLowerCase().endsWith("@gmail.com") ? "col-span-2" : ""}`}
                  >
                    {isResending ? (
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" strokeWidth="4" strokeDasharray="32" strokeDashoffset="16" className="opacity-25"/>
                        <path d="M4 12a8 8 0 018-8v8H4z" fill="currentColor"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:rotate-180"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                    )}
                    {isResending ? "Mengirim..." : "Kirim Ulang"}
                  </button>
                </div>
                
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  disabled={isVerifying || isResending}
                  className="mt-2 text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300 transition py-2 disabled:pointer-events-none disabled:opacity-50"
                >
                  Batal & Kembali ke Login
                </button>
              </div>
            </div>

            {/* Footer note */}
            <div className="mt-5 flex items-center justify-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/60" />
              <p className="text-center text-[11px] font-medium text-slate-600">
                OTP berlaku sementara dan hanya bisa sekali pakai
              </p>
            </div>
          </form>

          <div className="mt-6 flex justify-center">
            <Link
              href="/"
              className="text-xs font-bold text-slate-600 transition hover:text-slate-300"
            >
              Kembali ke Website
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function AdminLoginVerifyRoute() {
  return (
    <Suspense fallback={<AdminLoginVerifyLoading />}>
      <AdminLoginVerifyContent />
    </Suspense>
  );
}