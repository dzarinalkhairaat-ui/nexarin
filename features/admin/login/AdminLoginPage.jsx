"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { requestAdminLoginOtpAction } from "@/features/admin/login/adminLoginOtp.actions";

const ADMIN_SESSION_COOKIE = "nexarin_admin_session";

function getLoginErrorMessage(error) {
  const message = String(error?.message || "").toLowerCase();

  if (message.includes("invalid login credentials")) {
    return "Email atau password admin salah.";
  }

  if (message.includes("email not confirmed")) {
    return "Email admin belum dikonfirmasi di Supabase.";
  }

  if (message.includes("rate limit")) {
    return "Terlalu banyak percobaan login. Coba lagi beberapa saat.";
  }

  return "Login gagal. Periksa email dan password admin.";
}

function getSecureCookieSuffix() {
  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    return "; Secure";
  }

  return "";
}

function clearLegacyAdminSessionCookie() {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${ADMIN_SESSION_COOKIE}=; path=/; Max-Age=0; SameSite=Lax${getSecureCookieSuffix()}`;
}

function createVerifyUrl({ email, redirectedFrom }) {
  const params = new URLSearchParams();

  if (email) {
    params.set("email", email);
  }

  if (redirectedFrom) {
    params.set("redirectedFrom", redirectedFrom);
  }

  const query = params.toString();

  return query ? `/admin/login/verify?${query}` : "/admin/login/verify";
}

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createSupabaseBrowserClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setMessage({
        type: "error",
        text: "Email dan password admin wajib diisi.",
      });
      return;
    }

    setIsLoading(true);
    clearLegacyAdminSessionCookie();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPassword,
    });

    if (error) {
      console.error("Supabase login error:", error);

      clearLegacyAdminSessionCookie();
      setIsLoading(false);
      setMessage({
        type: "error",
        text: getLoginErrorMessage(error),
      });
      return;
    }

    if (!data?.user) {
      clearLegacyAdminSessionCookie();
      setIsLoading(false);
      setMessage({
        type: "error",
        text: "Login gagal. User Supabase tidak ditemukan.",
      });
      return;
    }

    const redirectedFrom = searchParams.get("redirectedFrom") || "";
    const otpResult = await requestAdminLoginOtpAction({
      email: cleanEmail,
      userId: data.user.id,
    });

    if (!otpResult.ok) {
      console.error("Admin OTP request error:", otpResult);

      await supabase.auth.signOut();
      clearLegacyAdminSessionCookie();
      setIsLoading(false);
      setMessage({
        type: "error",
        text: otpResult.message || "OTP admin gagal dikirim. Coba lagi.",
      });
      return;
    }

    setMessage({
      type: "success",
      text:
        otpResult.message ||
        "Kode OTP sudah dikirim. Mengalihkan ke verifikasi...",
    });

    setTimeout(() => {
      router.replace(
        createVerifyUrl({
          email: otpResult.email || cleanEmail,
          redirectedFrom,
        })
      );
      router.refresh();
    }, 700);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <section className="relative min-h-screen overflow-hidden px-5 py-10 sm:px-6 lg:px-8">
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

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-md flex-col justify-center">
          <div className="text-center">
            <h1 className="text-[2.35rem] font-black leading-[0.96] tracking-[-0.065em] text-white sm:text-6xl">
              Masuk ke pusat kontrol Nexarin.
            </h1>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-7 overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-emerald-400/25 bg-slate-950 p-2 shadow-lg shadow-emerald-400/10">
                <img
                  src="/images/logo/nexarin-logo.png"
                  alt="Nexarin logo"
                  className="h-full w-full object-contain"
                  loading="eager"
                  decoding="async"
                />
              </div>

              <div className="min-w-0">
                <p className="truncate text-xl font-black tracking-[-0.045em] text-white">
                  Admin Login
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/40" />
                  <p className="truncate text-xs font-bold text-slate-500">
                    Password + OTP Security
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <label className="grid gap-2">
                <span className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-300">
                  Email Admin
                </span>

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Masukkan email admin"
                  autoComplete="email"
                  className="min-h-14 rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-sm font-bold text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-300">
                  Password
                </span>

                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Masukkan password admin"
                  autoComplete="current-password"
                  className="min-h-14 rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-sm font-bold text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50"
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
                disabled={isLoading}
                className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {message?.type === "success"
                  ? "OTP Dikirim"
                  : isLoading
                    ? "Memproses OTP..."
                    : "Lanjutkan dengan OTP"}
              </button>

              <p className="text-center text-xs font-semibold leading-5 text-slate-600">
                Setelah password benar, kode OTP 8 digit akan dikirim ke email
                admin yang terdaftar.
              </p>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}