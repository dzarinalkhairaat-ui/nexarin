"use client";

import { useState } from "react";

export default function SearchInputBox({ initialKeyword }) {
  const [keyword, setKeyword] = useState(initialKeyword || "");

  function handleSubmit(event) {
    event.preventDefault();

    const cleanKeyword = keyword.trim();

    if (!cleanKeyword) {
      window.location.href = "/news/search";
      return;
    }

    window.location.href = `/news/search?q=${encodeURIComponent(cleanKeyword)}`;
  }

  return (
    <section className="relative overflow-hidden px-5 py-5 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <form
          onSubmit={handleSubmit}
          className="relative z-10 grid gap-3 sm:grid-cols-[1fr_auto]"
        >
          <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/50 px-3 shadow-inner shadow-black/20 focus-within:border-emerald-400/50 transition-colors">
              <span
                aria-hidden="true"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-lg"
              >
                🔎
              </span>

              <input
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Cari berita Nexarin..."
                className="min-h-14 min-w-0 flex-1 bg-transparent text-sm font-bold text-white outline-none placeholder:text-slate-600"
              />
            </div>

            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-emerald-400/20 transition hover:bg-emerald-300 sm:min-h-14"
            >
              <span>Cari</span>
              <span aria-hidden="true">→</span>
            </button>
        </form>
      </div>
    </section>
  );
}