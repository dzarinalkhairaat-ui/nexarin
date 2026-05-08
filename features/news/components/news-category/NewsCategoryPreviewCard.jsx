export default function NewsCategoryPreviewCard({ category, total }) {
  const categoryLabel = category?.label || "News";
  const safeTotal = Number.isFinite(Number(total)) ? Number(total) : 0;

  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.055] p-4 shadow-2xl shadow-black/25 backdrop-blur-xl lg:mx-0">
      <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-lime-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-14 -left-14 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative z-10 rounded-[28px] border border-white/10 bg-slate-950/70 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-lime-400/25 bg-slate-950 p-2 shadow-xl shadow-lime-400/10">
            <img
              src="/images/logo/nexarin-logo.png"
              alt="Nexarin logo"
              className="h-full w-full object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="min-w-0">
            <p className="truncate text-base font-black tracking-[-0.035em] text-white">
              {categoryLabel}
            </p>

            <div className="mt-1 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-lime-400 shadow-lg shadow-lime-400/40" />

              <p className="truncate text-xs font-semibold text-slate-400">
                Kategori Nexarin News
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-[22px] border border-white/10 bg-white/[0.045] p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
              Artikel
            </p>

            <p className="mt-1 text-sm font-black text-lime-300">
              {safeTotal}
            </p>
          </div>

          <div className="rounded-[22px] border border-white/10 bg-white/[0.045] p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
              Feed
            </p>

            <p className="mt-1 text-sm font-black text-lime-300">Aktif</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-4 rounded-[28px] border border-lime-400/15 bg-lime-400/[0.07] p-4">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-lime-300">
          Ringkasan Kategori
        </p>

        <p className="mt-3 text-sm font-semibold leading-6 text-slate-300">
          Jelajahi artikel pilihan dari kategori ini dalam tampilan yang ringan,
          rapi, dan mudah dibaca di perangkat mobile.
        </p>
      </div>
    </div>
  );
}