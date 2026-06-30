"use client";

import Link from "next/link";
import { SettingsIcon } from "@/components/shared/MenuIcons";

export default function ComingSoon({ title = "Halaman" }) {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-20 text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/[0.05] blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="relative z-10 w-full max-w-lg text-center">
        {/* Animated Gears & Logo */}
        <div className="relative flex justify-center mb-10">
          <div className="relative flex h-32 w-32 items-center justify-center">
            {/* Outer spinning gear */}
            <div className="absolute inset-0 animate-[spin_10s_linear_infinite] text-emerald-400/20">
              <SettingsIcon className="h-full w-full" />
            </div>
            
            {/* Inner counter-spinning gear */}
            <div className="absolute inset-4 animate-[spin_7s_linear_infinite_reverse] text-emerald-400/30">
              <SettingsIcon className="h-full w-full" />
            </div>

            {/* Center Logo */}
            <div className="relative z-10 flex h-20 w-20 items-center justify-center overflow-hidden rounded-[24px] border border-emerald-400/30 bg-slate-950 p-3 shadow-2xl shadow-emerald-400/20 backdrop-blur-xl">
              <img
                src="/images/logo/nexarin-logo.png"
                alt="Nexarin logo"
                className="h-full w-full object-contain drop-shadow-[0_0_12px_rgba(52,211,153,0.3)]"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
          Coming <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Soon</span>
        </h1>
        
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto">
          {title} sedang dalam tahap pengembangan dan penyempurnaan. Kami bekerja keras untuk menyelesaikannya dalam waktu dekat!
        </p>

        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/[0.05] border border-white/10 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/[0.1] hover:border-emerald-400/30 hover:text-emerald-300 shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
