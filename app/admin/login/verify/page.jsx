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
      <section className="relative min-h-screen overflow-hidden px-5 pb-28 pt-7 sm:px-6 sm:pb-12 sm:pt-10 lg:px-8">
        <div className="pointer-events-none absolute -left-24 top-16 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-36 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

        <img
          src="/images/logo/nexarin-logo.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 top-20 h-72 w-72 rotate-12 object-contain opacity-[0.035] sm:h-96 sm:w-96"
          loading="lazy"
          decoding="async"
        />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-md flex-col justify-center">
          <div className="text-center">
            <p className="mx-auto inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300 sm:text-[11px]">
              Admin Security
            </p>

            <h1 className="mx-auto mt-4 max-w-sm text-[2rem] font-black leading-[0.98] tracking-[-0.06em] text-white sm:mt-5 sm:text-5xl">
              Verifikasi OTP admin.
            </h1>

            <p className="mx-auto mt-4 max-w-xs text-sm font-medium leading-7 text-slate-400 sm:max-w-sm">
              Masukkan kode OTP 8 digit yang dikirim ke email admin terdaftar.
            </p>
          </div>

          <form
            onSubmit={handleVerify}
            className="mt-6 overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:mt-7 sm:rounded-[34px] sm:p-5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-emerald-400/25 bg-slate-950 p-2 shadow-lg shadow-emerald-400/10 sm:h-14 sm:w-14">
                <img
                  src="/images/logo/nexarin-logo.png"
                  alt="Nexarin logo"
                  className="h-full w-full object-contain"
                  loading="eager"
                  decoding="async"
                />
              </div>

              <div className="min-w-0">
                <p className="truncate text-lg font-black tracking-[-0.045em] text-white sm:text-xl">
                  OTP Verification
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/40" />
                  <p className="truncate text-xs font-bold text-slate-500">
                    {email || "Nexarin admin"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3.5 sm:mt-6 sm:gap-4">
              <label className="grid gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300 sm:text-[11px]">
                  Kode OTP 8 Digit
                </span>

                <input
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={(event) => setOtp(normalizeOtp(event.target.value))}
                  placeholder="12345678"
                  autoComplete="one-time-code"
                  className="min-h-14 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-3 text-center text-[1.35rem] font-black tracking-[0.2em] text-white outline-none transition placeholder:text-base placeholder:tracking-[0.12em] placeholder:text-slate-600 focus:border-emerald-400/50 sm:min-h-16 sm:px-4 sm:text-2xl sm:tracking-[0.26em]"
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

              <button
                type="submit"
                disabled={isVerifying}
                className="inline-flex min-h-13 items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-14"
              >
                {isVerifying ? "Memverifikasi..." : "Verifikasi & Masuk"}
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResending || isVerifying}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-400/10 px-5 py-3 text-sm font-black text-cyan-100 transition hover:border-cyan-300/30 hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isResending ? "Mengirim ulang..." : "Kirim Ulang OTP"}
              </button>

              <button
                type="button"
                onClick={handleBackToLogin}
                disabled={isVerifying || isResending}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-3 text-sm font-black text-slate-300 transition hover:bg-white/[0.075] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                Kembali ke Login
              </button>

              <p className="text-center text-[11px] font-semibold leading-5 text-slate-600 sm:text-xs">
                OTP berlaku beberapa menit, hanya bisa digunakan satu kali, dan
                akan terkunci jika terlalu banyak percobaan salah.
              </p>
            </div>
          </form>

          <Link
            href="/"
            className="mx-auto mt-4 text-xs font-bold text-slate-600 transition hover:text-slate-300"
          >
            Kembali ke Website
          </Link>
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