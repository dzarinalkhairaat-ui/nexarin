"use client";

import { useState, useEffect } from "react";
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
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("nexarin_admin_saved_email");
      const savedPassword = localStorage.getItem("nexarin_admin_saved_password");
      if (savedEmail && savedPassword) {
        setEmail(savedEmail);
        setPassword(savedPassword);
        setRemember(true);
      }
    }
  }, []);

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

    if (remember) {
      localStorage.setItem("nexarin_admin_saved_email", cleanEmail);
      localStorage.setItem("nexarin_admin_saved_password", cleanPassword);
    } else {
      localStorage.removeItem("nexarin_admin_saved_email");
      localStorage.removeItem("nexarin_admin_saved_password");
    }

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
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 sm:px-6 lg:px-8">
        {/* Background effects */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-400/[0.07] blur-[120px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

        <div className="relative z-10 w-full max-w-[400px]">
          {/* Card */}
          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-7 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8"
          >
            {/* Logo & Title */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-[22px] border border-emerald-400/25 bg-slate-950 p-2.5 shadow-lg shadow-emerald-400/10">
                <img
                  src="/images/logo/nexarin-logo.png"
                  alt="Nexarin logo"
                  className="h-full w-full object-contain"
                  loading="eager"
                  decoding="async"
                />
              </div>

              <h1 className="mt-5 text-2xl font-black tracking-[-0.04em] text-white">
                Admin Login
              </h1>

              <p className="mt-2 text-xs font-medium text-slate-500">
                Masuk ke dashboard Nexarin by-rins
              </p>
            </div>

            {/* Divider */}
            <div className="my-6 h-px bg-white/[0.08]" />

            {/* Fields */}
            <div className="grid gap-4">
              <label className="grid gap-2">
                <span className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-300">
                  Email Admin
                </span>

                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@nexarin.my.id"
                  autoComplete="username email"
                  className="min-h-12 rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-sm font-bold text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/50"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-300">
                  Password
                </span>

                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="min-h-12 rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-sm font-bold text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/50"
                />
              </label>

              <div className="flex items-center gap-3 py-1">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-slate-950 text-emerald-400 focus:ring-emerald-400/50"
                />
                <label htmlFor="remember" className="text-xs font-medium text-slate-400 cursor-pointer select-none">
                  Simpan login saya
                </label>
              </div>

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
                className="mt-1 inline-flex min-h-12 items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {message?.type === "success"
                  ? "OTP Dikirim ✓"
                  : isLoading
                    ? "Memproses..."
                    : "Lanjutkan"}
              </button>
            </div>

            {/* Footer note */}
            <div className="mt-5 flex items-center justify-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/60" />
              <p className="text-center text-[11px] font-medium text-slate-600">
                Kode OTP 8 digit dikirim setelah password benar
              </p>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}