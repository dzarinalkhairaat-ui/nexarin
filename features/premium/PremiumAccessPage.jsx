"use client";

import Link from "next/link";
import Header from "@/components/shared/Header";
import HomeFooter from "@/features/home/components/HomeFooter";
import { SettingsIcon, SparkleIcon, LeftArrowIcon } from "@/components/shared/MenuIcons";

export default function PremiumAccessPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30">
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-24 sm:px-6 lg:px-8">
          {/* Ambient Glow */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />
          
          <div className="relative z-10 mx-auto w-full max-w-2xl text-center">
            
            {/* Main Glassmorphism Card */}
            <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.03] p-10 sm:p-16 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
              <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

              <div className="relative z-10 flex flex-col items-center">
                {/* Spinning Gear Icon */}
                <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/10 to-emerald-400/5 shadow-inner">
                  <div className="animate-[spin_4s_linear_infinite] text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">
                    <SettingsIcon className="h-12 w-12" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border border-emerald-400/30 bg-slate-900 text-emerald-300">
                    <SparkleIcon className="h-4 w-4" />
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300 mb-6">
                  Area Eksklusif
                </div>

                <h1 className="text-4xl sm:text-5xl font-black tracking-[-0.04em] text-white">
                  Coming Soon
                </h1>
                
                <p className="mt-6 text-sm sm:text-base font-medium leading-relaxed text-slate-400 max-w-md">
                  Halaman <span className="text-emerald-300">Member Premium</span> saat ini sedang dalam tahap pengembangan dan penyempurnaan sistem. Kami sedang menyiapkan kejutan luar biasa untuk Anda!
                </p>

                <div className="mt-10 h-px w-full max-w-xs bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <Link
                  href="/premium"
                  className="group mt-10 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-6 text-sm font-black text-white transition-all hover:bg-emerald-400/10 hover:border-emerald-400/30 hover:text-emerald-300"
                >
                  <LeftArrowIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Kembali ke Penawaran
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
