"use client";

import Link from "next/link";

export default function PpobHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(16,185,129,0.12),transparent_30%)]" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-[40px_1fr_40px] items-center gap-3 px-5 py-3 sm:px-6 lg:px-8">
        <Link
          href="/products"
          aria-label="Kembali ke Products"
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] text-xl font-black text-white shadow-lg shadow-black/20 transition hover:border-emerald-400/25 hover:bg-emerald-400/10"
        >
          ←
        </Link>

        <div className="min-w-0 text-center">
          <h1 className="truncate text-xl font-black tracking-[-0.04em] text-emerald-300">
            PPOB
          </h1>

          <p className="mt-0.5 truncate text-xs font-bold text-slate-500">
            Nexarin Products
          </p>
        </div>

        <Link
          href="/products"
          aria-label="Marketplace"
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] text-sm font-black text-emerald-300 shadow-lg shadow-black/20 transition hover:border-emerald-400/25 hover:bg-emerald-400/10"
        >
          N
        </Link>
      </div>
    </header>
  );
}