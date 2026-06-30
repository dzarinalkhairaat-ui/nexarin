"use client";

import Link from "next/link";
import Header from "@/components/shared/Header";
import HomeFooter from "@/features/home/components/HomeFooter";
import { SparkleIcon, SuccessIcon } from "@/components/shared/MenuIcons";

export default function PremiumPaymentPage() {
  return (
    <>
      <Header />
      <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white selection:bg-emerald-400/30">
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-24 sm:px-6 lg:px-8">
          {/* Background Effects */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

          <div className="relative z-10 mx-auto w-full max-w-6xl">
            <div className="text-center mb-16">
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-300 shadow-lg shadow-emerald-400/5">
                <SparkleIcon className="h-4 w-4" /> Nexarin Premium
              </p>
              <h1 className="mt-6 text-4xl font-black leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl text-white">
                Buka Semua <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Potensi Anda.</span>
              </h1>
              <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base font-medium leading-relaxed text-slate-400">
                Berlangganan Premium sekarang untuk mendapatkan akses tak terbatas ke seluruh resource, source code eksklusif, dan tutorial mendalam.
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-start">
              
              {/* Daily Package */}
              <div className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl transition hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-white/[0.04]">
                <h2 className="text-xl font-black text-white">Paket Harian</h2>
                <p className="mt-2 text-sm text-slate-400 font-medium">Akses cepat untuk kebutuhan mendesak.</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-xl font-bold text-emerald-400">Rp</span>
                  <span className="text-4xl font-black tracking-tight text-emerald-400">15k</span>
                  <span className="text-xs font-bold text-slate-500">/hari</span>
                </div>
                
                <div className="my-6 h-px w-full bg-white/10" />
                
                <ul className="space-y-4 mb-8">
                  {[
                    "Akses 24 Jam Penuh",
                    "Download 3 Source Code",
                    "Akses Tutorial Eksklusif",
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-400">
                        <SuccessIcon className="h-2.5 w-2.5" />
                      </div>
                      <span className="text-sm font-semibold text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/premium/checkout?plan=harian"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-sm font-black text-white transition hover:bg-emerald-400/10 hover:border-emerald-400/30 hover:text-emerald-300"
                >
                  Pilih Harian
                </Link>
              </div>

              {/* Monthly Package (Popular) */}
              <div className="relative overflow-hidden rounded-[32px] border-2 border-emerald-400 bg-slate-900/80 p-8 shadow-2xl shadow-emerald-500/20 backdrop-blur-xl transform md:-translate-y-4">
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />
                
                <div className="absolute top-0 inset-x-0 flex justify-center">
                  <span className="rounded-b-xl bg-emerald-400 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-slate-950">
                    Paling Populer
                  </span>
                </div>

                <h2 className="text-2xl font-black text-white mt-4">Paket Bulanan</h2>
                <p className="mt-2 text-sm text-slate-400 font-medium">Investasi terbaik untuk freelancer aktif.</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-emerald-400">Rp</span>
                  <span className="text-5xl font-black tracking-tight text-emerald-400">99k</span>
                  <span className="text-sm font-bold text-slate-500">/bulan</span>
                </div>
                
                <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                
                <ul className="space-y-4 mb-8">
                  {[
                    "Akses Penuh 30 Hari",
                    "Download Source Code (Unlimited)",
                    "Tutorial & Case Study Eksklusif",
                    "Dukungan Prioritas (Chat)",
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-400">
                        <SuccessIcon className="h-3 w-3" />
                      </div>
                      <span className="text-sm font-bold text-slate-200">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/premium/checkout?plan=bulanan"
                  className="group relative inline-flex min-h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-emerald-400 px-8 text-sm font-black text-slate-950 shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] hover:bg-emerald-300"
                >
                  <SparkleIcon className="h-4 w-4" />
                  Langganan Bulanan
                </Link>
              </div>

              {/* Lifetime Package */}
              <div className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.04]">
                <h2 className="text-xl font-black text-white">Paket Lifetime</h2>
                <p className="mt-2 text-sm text-slate-400 font-medium">Bayar sekali, nikmati selamanya.</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-xl font-bold text-cyan-400">Rp</span>
                  <span className="text-4xl font-black tracking-tight text-cyan-400">299k</span>
                  <span className="text-xs font-bold text-slate-500">/selamanya</span>
                </div>
                
                <div className="my-6 h-px w-full bg-white/10" />
                
                <ul className="space-y-4 mb-8">
                  {[
                    "Akses Aktif Selamanya",
                    "Semua Fitur Bulanan Termasuk",
                    "Akses Awal ke Update Baru",
                    "Lisensi Penggunaan Komersial",
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cyan-400/20 text-cyan-400">
                        <SuccessIcon className="h-2.5 w-2.5" />
                      </div>
                      <span className="text-sm font-semibold text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/premium/checkout?plan=lifetime"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-sm font-black text-white transition hover:bg-cyan-400/10 hover:border-cyan-400/30 hover:text-cyan-300"
                >
                  Pilih Lifetime
                </Link>
              </div>

            </div>
          </div>
        </section>
      </main>
      <HomeFooter />
    </>
  );
}
