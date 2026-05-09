"use client";

import Link from "next/link";
import { useState } from "react";

const sortOptions = [
  {
    label: "Terbaru",
    value: "terbaru",
  },
  {
    label: "Termahal",
    value: "termahal",
  },
  {
    label: "Termurah",
    value: "termurah",
  },
];

export default function AllProductsHeader({ sortBy, onSortChange }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(16,185,129,0.12),transparent_28%)]" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-[40px_1fr_40px] items-center gap-3 px-5 py-3 sm:px-6 lg:px-8">
        <Link
          href="/products"
          aria-label="Kembali ke Products"
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] text-xl font-black text-white shadow-lg shadow-black/20 transition hover:border-emerald-400/25 hover:bg-emerald-400/10"
        >
          ←
        </Link>

        <div className="min-w-0 text-center">
          <h1 className="truncate text-xl font-black tracking-[-0.04em] text-white">
            Semua Produk
          </h1>

          <p className="mt-0.5 truncate text-xs font-bold text-slate-500">
            Nexarin by-rins
          </p>
        </div>

        <div className="relative">
          <button
            type="button"
            aria-label="Urutkan produk"
            aria-expanded={isFilterOpen}
            onClick={() => setIsFilterOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] text-lg font-black text-emerald-300 shadow-lg shadow-black/20 transition hover:border-emerald-400/25 hover:bg-emerald-400/10"
          >
            ⇅
          </button>

          {isFilterOpen ? (
            <div className="absolute right-0 top-12 z-50 w-44 overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl shadow-black/40">
              <div className="border-b border-white/10 px-4 py-3">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                  Urutkan
                </p>
              </div>

              {sortOptions.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    onSortChange(item.value);
                    setIsFilterOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-3 text-left text-xs font-black transition ${
                    item.value === sortBy
                      ? "bg-emerald-400/15 text-emerald-300"
                      : "text-slate-300 hover:bg-white/[0.06]"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.value === sortBy ? <span>✓</span> : null}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}