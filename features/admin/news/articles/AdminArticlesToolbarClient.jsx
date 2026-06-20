"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCallback, useState, useEffect } from "react";

export default function AdminArticlesToolbarClient({ categories = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("q") || "";
  const currentStatus = searchParams.get("status") || "semua";
  const currentCategory = searchParams.get("category") || "semua";

  const [search, setSearch] = useState(currentSearch);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (search !== currentSearch) {
        updateQueryParams({ q: search });
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [search, currentSearch]);

  const updateQueryParams = useCallback(
    (newParams) => {
      const params = new URLSearchParams(searchParams);

      Object.entries(newParams).forEach(([key, value]) => {
        if (!value || value === "semua") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      router.push(`/admin/news/artikel?${params.toString()}`);
    },
    [searchParams, router]
  );

  return (
    <section className="relative px-5 pb-5 text-white sm:px-6 sm:pb-7 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative z-10 grid gap-3 lg:grid-cols-[minmax(0,1fr)_170px_170px_auto] lg:items-end">
            <label className="grid gap-2">
              <span className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-300">
                Cari Artikel
              </span>

              <input
                type="search"
                placeholder="Cari judul artikel..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="min-h-11 rounded-2xl border border-white/10 bg-slate-950/65 px-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-300">
                Status
              </span>

              <select
                value={currentStatus}
                onChange={(e) => updateQueryParams({ status: e.target.value })}
                className="min-h-11 rounded-2xl border border-white/10 bg-slate-950/65 px-4 text-sm font-bold text-white outline-none transition focus:border-emerald-400/50"
              >
                <option value="semua">Semua Status</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-300">
                Kategori
              </span>

              <select
                value={currentCategory}
                onChange={(e) => updateQueryParams({ category: e.target.value })}
                className="min-h-11 rounded-2xl border border-white/10 bg-slate-950/65 px-4 text-sm font-bold text-white outline-none transition focus:border-emerald-400/50"
              >
                <option value="semua">Semua Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </label>

            <Link
              href="/admin/news/tulis-artikel"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:bg-emerald-300"
            >
              Tulis Artikel
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
