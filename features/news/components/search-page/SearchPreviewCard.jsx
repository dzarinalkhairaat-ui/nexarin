export default function SearchPreviewCard({ total, keyword }) {
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
            Search News
          </p>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <p className="truncate text-xs font-semibold text-slate-400">
              Nexarin search page
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-950/50 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Hasil
          </p>
          <p className="mt-1 text-sm font-black text-cyan-300">
            {total || 0}
          </p>
        </div>

        <div className="rounded-xl bg-slate-950/50 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Keyword
          </p>
          <p className="mt-1 truncate text-sm font-black text-cyan-300">
            {keyword || "Semua"}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-cyan-400/15 bg-cyan-400/5 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">
          Search Mode
        </p>
        <p className="mt-2 text-sm font-medium leading-relaxed text-slate-300">
          Pencarian masih memakai data fallback. Nanti bisa dihubungkan ke
          database artikel dan sistem index pencarian.
        </p>
      </div>
    </div>
  );
}