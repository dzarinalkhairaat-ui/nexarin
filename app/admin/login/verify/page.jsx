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
            <div className="grid gap-4">
              <label className="grid gap-2">
                <span className="text-[11px] font-black uppercase tracking-[0.18em] text-cyan-300">
                  Kode OTP 8 Digit
                </span>

                <input
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={(event) => setOtp(normalizeOtp(event.target.value))}
                  placeholder="••••••••"
                  autoComplete="one-time-code"
                  className="min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-center text-lg font-black tracking-[0.2em] text-white outline-none transition placeholder:text-sm placeholder:tracking-[0.12em] placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50"
                />
              </label>

              {message ? (
                <div
                  className={[
                    "rounded-2xl border p-4",
                    message.type === "success"
                      ? "border-emerald-400/20 bg-emerald-400/[0.08]"
                      : "border-amber-400/20 bg-amber-400/[0.08]",
                  ].join(" ")}
                >
                  <p
                    className={[
                      "text-sm font-bold leading-6",
                      message.type === "success"
                        ? "text-emerald-200"
                        : "text-amber-200",
                    ].join(" ")}
                  >
                    {message.text}
                  </p>
                </div>
              ) : null}

              <div className="mt-1 grid gap-3">
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-cyan-400/20 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isVerifying ? "Memverifikasi..." : "Masuk ke Dashboard"}
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResending || isVerifying}
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-3 text-sm font-black text-white transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isResending ? "Mengirim ulang..." : "Kirim Ulang OTP"}
                </button>
                
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  disabled={isVerifying || isResending}
                  className="text-xs font-bold text-slate-500 hover:text-slate-300 transition py-2"
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