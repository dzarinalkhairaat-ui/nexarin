"use client";

import { useState } from "react";

const initialLoginForm = {
  email: "",
  password: "",
};

export default function AdminLogin() {
  const [form, setForm] = useState(initialLoginForm);
  const [status, setStatus] = useState("idle");

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (status !== "idle") {
      setStatus("idle");
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const email = form.email.trim();
    const password = form.password.trim();

    if (!email || !password) {
      setStatus("empty");
      return;
    }

    setStatus("preview");
  }

  return (
    <section
      id="admin-login"
      className="relative overflow-hidden px-5 py-8 text-white sm:px-6 sm:py-10 lg:px-8"
    >
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-5 lg:grid-cols-[minmax(0,0.75fr)_minmax(360px,1fr)] lg:items-start">
        <div className="rounded-[34px] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/25">
          <p className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-300">
            Admin Login
          </p>

          <h2 className="mt-4 text-3xl font-black leading-[1] tracking-[-0.06em] text-white sm:text-5xl">
            Login admin disiapkan sebagai gerbang dashboard.
          </h2>

          <p className="mt-4 text-sm font-medium leading-7 text-slate-300 sm:text-base sm:leading-8">
            Untuk tahap ini login masih preview frontend. Nanti setelah backend
            siap, form ini bisa disambungkan ke auth, session, role admin, dan
            proteksi route.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-[22px] border border-white/10 bg-slate-950/55 p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                Status
              </p>
              <p className="mt-1 text-sm font-black text-emerald-300">
                Preview
              </p>
            </div>

            <div className="rounded-[22px] border border-white/10 bg-slate-950/55 p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                Auth
              </p>
              <p className="mt-1 text-sm font-black text-emerald-300">
                Nanti
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-[24px] border border-amber-400/15 bg-amber-400/[0.07] p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">
              Catatan keamanan
            </p>

            <p className="mt-2 text-sm font-medium leading-6 text-slate-300">
              Jangan pakai login dummy ini untuk production. Admin asli wajib
              pakai auth backend dan route protection.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/25"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-emerald-400/12 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 bottom-0 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-emerald-400/25 bg-slate-950 p-2 shadow-xl shadow-emerald-400/10">
                <img
                  src="/images/logo/nexarin-logo.png"
                  alt="Nexarin logo"
                  className="h-full w-full object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="min-w-0">
                <p className="truncate text-lg font-black tracking-[-0.04em] text-white">
                  Masuk Admin
                </p>

                <p className="mt-1 truncate text-xs font-semibold text-slate-500">
                  Nexarin dashboard access
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                  Email Admin
                </span>

                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="admin@nexarin.my.id"
                  className="min-h-14 rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                  Password
                </span>

                <input
                  type="password"
                  value={form.password}
                  onChange={(event) =>
                    updateField("password", event.target.value)
                  }
                  placeholder="Masukkan password admin"
                  className="min-h-14 rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50"
                />
              </label>
            </div>

            {status === "empty" && (
              <div className="mt-5 rounded-[24px] border border-red-400/20 bg-red-400/[0.08] p-4">
                <p className="text-sm font-bold leading-6 text-red-200">
                  Email dan password wajib diisi dulu, bro.
                </p>
              </div>
            )}

            {status === "preview" && (
              <div className="mt-5 rounded-[24px] border border-emerald-400/20 bg-emerald-400/[0.08] p-4">
                <p className="text-sm font-bold leading-6 text-emerald-200">
                  Preview login aman. Auth asli belum aktif karena backend belum
                  disambungkan.
                </p>
              </div>
            )}

            <button
              type="submit"
              className="mt-5 inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:bg-emerald-300"
            >
              Masuk Dashboard
            </button>

            <p className="mt-4 text-center text-xs font-medium leading-6 text-slate-500">
              Login ini masih UI preview. Nanti akan disambungkan ke auth
              backend sebelum dashboard production.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}