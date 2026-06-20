export default function NewsCategoryPreviewCard({ category, total }) {
  const categoryLabel = category?.label || "News";
  const safeTotal = Number.isFinite(Number(total)) ? Number(total) : 0;

  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-white/5 bg-slate-900/40 p-5 shadow-2xl backdrop-blur-xl lg:mx-0">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-950 p-2 border border-white/5">
          <img
            src="/images/logo/nexarin-logo.png"
            alt="Nexarin logo"
            className="h-full w-full object-contain"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-black text-white">
            {categoryLabel}
          </p>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <p className="truncate text-xs font-semibold text-slate-400">
              Kategori News
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-950/50 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Artikel
          </p>
          <p className="mt-1 text-sm font-black text-emerald-300">
            {safeTotal}
          </p>
        </div>

        <div className="rounded-xl bg-slate-950/50 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Status
          </p>
          <p className="mt-1 text-sm font-black text-emerald-300">Aktif</p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-emerald-400/15 bg-emerald-400/5 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">
          Ringkasan
        </p>
        <p className="mt-2 text-sm font-medium leading-relaxed text-slate-300">
          Jelajahi artikel pilihan dari kategori ini dalam tampilan yang ringan,
          rapi, dan mudah dibaca di perangkat mobile.
        </p>
      </div>
    </div>
  );
}