"use client";

import Link from "next/link";

export default function ProductCheckoutHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(16,185,129,0.14),transparent_30%)]" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-[44px_1fr_44px] items-center gap-3 px-5 py-4 sm:px-6 lg:px-8">
        <Link
          href="/products"
          aria-label="Kembali ke Products"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] text-2xl font-black text-white shadow-lg shadow-black/20 transition hover:border-emerald-400/25 hover:bg-emerald-400/10"
        >
          ←
        </Link>

        <Link
          href="/products"
          className="min-w-0 text-center"
          aria-label="Nexarin Products"
        >
          <p className="truncate text-[11px] font-black uppercase tracking-[0.22em] text-emerald-300">
            Nexarin by-rins
          </p>
          <h1 className="mt-0.5 truncate text-lg font-black tracking-[-0.045em] text-white sm:text-xl">
            Checkout Produk
          </h1>
        </Link>

        <Link
          href="/products/semua"
          aria-label="Semua Produk"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] text-sm font-black text-emerald-300 shadow-lg shadow-black/20 transition hover:border-emerald-400/25 hover:bg-emerald-400/10"
        >
          All
        </Link>
      </div>
    </header>
  );
}