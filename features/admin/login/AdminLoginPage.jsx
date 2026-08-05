"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/client";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { setFirebaseAdminSessionAction } from "@/features/admin/login/firebaseAuth.actions";

function getLoginErrorMessage(error) {
  const message = String(error?.message || "").toLowerCase();

  if (message.includes("invalid-credential") || message.includes("wrong-password") || message.includes("user-not-found")) {
    return "Email atau password admin salah.";
  }

  if (message.includes("too-many-requests")) {
    return "Terlalu banyak percobaan login. Coba lagi beberapa saat.";
  }

  return "Login gagal. Periksa email dan password admin.";
}

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function handleSessionVerification(userCredential) {
    try {
      const idToken = await userCredential.user.getIdToken();
      const result = await setFirebaseAdminSessionAction(idToken);
      
      if (!result.ok) {
        // Sign out dari firebase client jika sesi admin ditolak
        await auth.signOut();
        setIsLoading(false);
        setMessage({
          type: "error",
          text: result.message || "Akses ditolak.",
        });
        return;
      }

      setMessage({
        type: "success",
        text: "Login berhasil. Mengalihkan ke dashboard...",
      });

      setTimeout(() => {
        window.location.href = "/admin";
      }, 700);
    } catch (err) {
      console.error("Gagal memverifikasi token sesi:", err);
      await auth.signOut();
      setIsLoading(false);
      setMessage({
        type: "error",
        text: "Kesalahan internal. Silakan coba lagi.",
      });
    }
  }

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

    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      await handleSessionVerification(userCredential);
    } catch (error) {
      console.error("Firebase login error:", error);
      setIsLoading(false);
      setMessage({
        type: "error",
        text: getLoginErrorMessage(error),
      });
    }
  }

  async function handleGoogleLogin() {
    setMessage(null);
    setIsLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      await handleSessionVerification(userCredential);
    } catch (error) {
      console.error("Firebase Google login error:", error);
      setIsLoading(false);
      // Abaikan error jika user menutup popup
      if (error.code !== "auth/popup-closed-by-user") {
        setMessage({
          type: "error",
          text: getLoginErrorMessage(error),
        });
      }
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 font-sans text-white selection:bg-emerald-500/30 selection:text-emerald-200">
      <style>{`
        @keyframes futuristicPan {
          0% { transform: scale(1.05) translate(0px, 0px); }
          50% { transform: scale(1.12) translate(-10px, -10px); }
          100% { transform: scale(1.05) translate(0px, 0px); }
        }
        .animate-circuit-bg {
          animation: futuristicPan 25s ease-in-out infinite;
        }
      `}</style>

      {/* Animated Circuit Background Image - Distinct & Visible */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/images/Futuristic_circuit_board_with_code_202607111917.jpeg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center opacity-40 animate-circuit-bg"
          loading="eager"
        />
        
        {/* Subtle Gradient & Vignette Overlays for Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/50 to-slate-950/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,6,23,0.75)_100%)]" />
        
        {/* Glowing Ornaments */}
        <div className="absolute left-1/2 top-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-500/15 blur-[130px]" />
        <div className="absolute -left-20 bottom-10 h-[400px] w-[400px] rounded-full bg-teal-500/15 blur-[120px]" />
        <div className="absolute -right-20 top-1/3 h-[400px] w-[400px] rounded-full bg-cyan-500/15 blur-[120px]" />
        
        {/* Tech Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <div className="relative w-full max-w-[400px]">
          {/* Ultra-Premium Glassmorphic Form Card - Frosted Glass Edition */}
          <div
            className="group relative overflow-hidden rounded-[32px] border border-white/20 bg-slate-950/15 p-8 sm:p-9 shadow-[0_30px_90px_rgba(0,0,0,0.85),inset_0_1.5px_2px_rgba(255,255,255,0.25)] backdrop-blur-3xl transition-all duration-500 hover:border-emerald-400/40"
          >
            {/* Glossy Reflection Flares */}
            <div className="pointer-events-none absolute -left-24 -top-24 h-60 w-60 rounded-full bg-gradient-to-br from-white/20 via-white/5 to-transparent blur-2xl" />
            <div className="pointer-events-none absolute -right-24 -bottom-24 h-60 w-60 rounded-full bg-gradient-to-tl from-emerald-500/20 via-transparent to-transparent blur-2xl" />

            {/* Top Glowing Edge Line */}
            <div className="absolute top-0 left-1/2 h-[2px] w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_rgba(52,211,153,0.8)]" />

            {/* Logo & Title */}
            <div className="flex flex-col items-center text-center">
              <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-[20px] border border-white/25 bg-slate-950/40 p-3 shadow-[0_6px_24px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.25)] backdrop-blur-2xl transition-all duration-500 group-hover:scale-105 group-hover:border-emerald-400/40">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-emerald-500/10" />
                <img
                  src="/images/logo/nexarin-logo.png"
                  alt="Nexarin logo"
                  className="relative z-10 h-full w-full object-contain drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]"
                  loading="eager"
                  decoding="async"
                />
              </div>

              <h1 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
                Admin <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent drop-shadow">Login</span>
              </h1>

              <p className="mt-1.5 text-xs font-semibold tracking-wide text-slate-300">
                Masuk ke dashboard Nexarin by-rins
              </p>
            </div>

            {/* Glass Divider */}
            <div className="my-5 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Input Fields */}
            <form onSubmit={handleSubmit} className="grid gap-4">
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="EMAIL ADMIN"
                autoComplete="username email"
                className="min-h-12 rounded-2xl border border-white/20 bg-slate-950/30 px-4 text-xs font-bold tracking-wider text-white outline-none backdrop-blur-2xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] transition-all placeholder:text-slate-500 placeholder:font-bold focus:border-emerald-400 focus:bg-slate-950/50 focus:ring-2 focus:ring-emerald-400/30"
              />

              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="PASSWORD"
                autoComplete="current-password"
                className="min-h-12 rounded-2xl border border-white/20 bg-slate-950/30 px-4 text-xs font-bold tracking-wider text-white outline-none backdrop-blur-2xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] transition-all placeholder:text-slate-500 placeholder:font-bold focus:border-emerald-400 focus:bg-slate-950/50 focus:ring-2 focus:ring-emerald-400/30"
              />

              {message ? (
                <div
                  className={[
                    "rounded-2xl border p-3.5 backdrop-blur-2xl animate-in fade-in duration-300 shadow-inner mt-0.5",
                    message.type === "success"
                      ? "border-emerald-400/40 bg-emerald-500/15"
                      : "border-amber-400/40 bg-amber-500/15",
                  ].join(" ")}
                >
                  <p
                    className={[
                      "text-xs font-bold leading-5 text-center",
                      message.type === "success"
                        ? "text-emerald-200"
                        : "text-amber-200",
                    ].join(" ")}
                  >
                    {message.text}
                  </p>
                </div>
              ) : null}

              {/* Solid Glass Premium Login Button (No Gradient) */}
              <button
                type="submit"
                disabled={isLoading}
                className="group/btn relative mt-1.5 inline-flex min-h-12 items-center justify-center overflow-hidden rounded-2xl border border-emerald-400/50 bg-emerald-500/20 px-5 py-3 text-xs font-black tracking-widest uppercase text-emerald-300 shadow-[0_6px_25px_rgba(52,211,153,0.25),inset_0_1px_1px_rgba(255,255,255,0.3)] backdrop-blur-xl transition-all duration-300 hover:border-emerald-400 hover:bg-emerald-500/30 hover:text-white hover:shadow-[0_10px_35px_rgba(52,211,153,0.45)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="relative z-10">
                  {isLoading ? "Memproses..." : "LOGIN"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] transition-transform duration-700 group-hover/btn:translate-x-[100%]" />
              </button>
            </form>

            {/* Clean Flex Separator Line (Left & Right Only) */}
            <div className="my-5 flex items-center justify-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-white/20" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">ATAU LOGIN DENGAN</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/20 to-white/20" />
            </div>

            {/* Google Glass Button with Icon + Text (Compact & Centered) */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="group/google flex min-h-11 w-full max-w-[260px] items-center justify-center gap-2.5 rounded-2xl border border-white/20 bg-slate-950/40 px-5 py-2.5 text-xs font-bold text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),0_4px_15px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-300 hover:border-white/40 hover:bg-slate-900/70 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover/google:scale-110" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span>Login with Google</span>
              </button>
            </div>

          </div>

          {/* Additional Link */}
          <div className="mt-5 text-center">
            <a
              href="/"
              className="text-xs font-bold text-slate-400 transition hover:text-emerald-300"
            >
              ← Kembali ke Website Nexarin
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}