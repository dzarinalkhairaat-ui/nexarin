"use client";

export default function AllProductsSearchBar({
  query,
  onQueryChange,
  totalProducts,
}) {
  return (
    <section className="border-b border-white/10 bg-slate-950 px-5 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex min-h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.055] px-4 shadow-lg shadow-black/15">
          <span className="text-lg text-slate-400">⌕</span>

          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Cari produk..."
            className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-500"
          />

          <span className="shrink-0 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
            {totalProducts} item
          </span>
        </div>
      </div>
    </section>
  );
}