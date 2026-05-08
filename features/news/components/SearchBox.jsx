"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBox({
  placeholder = "Cari berita Nexarin...",
  compact = false,
}) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const cleanKeyword = keyword.trim();

    if (!cleanKeyword) {
      router.push("/news/search");
      return;
    }

    router.push(`/news/search?q=${encodeURIComponent(cleanKeyword)}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] shadow-xl shadow-black/20 backdrop-blur-xl ${
        compact ? "p-3" : "p-4"
      }`}
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-lime-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative z-10 grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="flex min-w-0 items-center gap-3 rounded-[24px] border border-white/10 bg-slate-950/65 px-3 shadow-inner shadow-black/20">
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-lime-400/20 bg-lime-400/10 text-lg"
          >
            🔎
          </span>

          <input
            type="search"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder={placeholder}
            className="min-h-14 min-w-0 flex-1 bg-transparent text-sm font-bold text-white outline-none placeholder:text-slate-600"
          />
        </div>

        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[22px] bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-emerald-400/20 transition hover:bg-emerald-300 sm:min-h-14"
        >
          <span>Cari</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </form>
  );
}