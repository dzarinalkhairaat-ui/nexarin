"use client";

import Link from "next/link";
import { useState } from "react";

const sortOptions = [
  {
    value: "terbaru",
    label: "Terbaru",
  },
  {
    value: "termurah",
    label: "Termurah",
  },
  {
    value: "termahal",
    label: "Termahal",
  },
];

function SortIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
    >
      <path
        d="M7 5v14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        d="m4.75 16.75 2.25 2.25 2.25-2.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M17 19V5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        d="m14.75 7.25 2.25-2.25 2.25 2.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function getSortLabel(sortBy) {
  return sortOptions.find((option) => option.value === sortBy)?.label || "Terbaru";
}

export default function ProductCategoryHeader({
  title,
  sortBy = "terbaru",
  onSortChange,
}) {
  const [isSortOpen, setIsSortOpen] = useState(false);

  function handleSortChange(value) {
    if (typeof onSortChange === "function") {
      onSortChange(value);
    }

    setIsSortOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(16,185,129,0.16),transparent_34%),radial-gradient(circle_at_85%_10%,rgba(6,182,212,0.1),transparent_30%)]" />

      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/35 to-transparent" />
      <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-5 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/products"
            aria-label="Kembali ke Products"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.065] text-xl font-black text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-emerald-400/25 hover:bg-emerald-400/10"
          >
            ←
          </Link>

          <div className="min-w-0">
            <h1 className="truncate text-base font-black leading-tight tracking-[-0.04em] text-white sm:text-lg">
              {title || "Kategori Produk"}
            </h1>

            <p className="mt-0.5 truncate text-xs font-semibold text-slate-400">
              Nexarin Products
            </p>
          </div>
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            aria-label="Filter produk kategori"
            aria-expanded={isSortOpen}
            onClick={() => setIsSortOpen((value) => !value)}
            className="flex h-10 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.065] px-3 text-xs font-black text-emerald-300 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-emerald-400/25 hover:bg-emerald-400/10"
          >
            <SortIcon />
            <span className="hidden sm:inline">{getSortLabel(sortBy)}</span>
          </button>

          {isSortOpen ? (
            <div className="absolute right-0 top-12 z-50 w-40 overflow-hidden rounded-[22px] border border-white/10 bg-slate-950/95 p-2 shadow-2xl shadow-black/35 backdrop-blur-xl">
              {sortOptions.map((option) => {
                const isActive = option.value === sortBy;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSortChange(option.value)}
                    className={`flex min-h-10 w-full items-center justify-between rounded-2xl px-3 text-left text-xs font-black transition ${
                      isActive
                        ? "bg-emerald-400 text-slate-950"
                        : "text-slate-300 hover:bg-emerald-400/10 hover:text-white"
                    }`}
                  >
                    <span>{option.label}</span>
                    <span>{isActive ? "✓" : ""}</span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}