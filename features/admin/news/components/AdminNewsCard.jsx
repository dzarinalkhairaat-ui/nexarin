export default function AdminNewsCard({ article }) {
  const title = article?.title || "Judul artikel belum tersedia";
  const category = article?.category || "Kategori";
  const status = article?.status || "Draft";
  const updatedAt = article?.updatedAt || "Belum diperbarui";
  const readTime = article?.readTime || "0 min read";
  const slug = article?.slug || "artikel";

  return (
    <article className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] p-4 shadow-xl shadow-black/15 backdrop-blur-xl">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-300">
            {category}
          </span>

          <span className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
            {status}
          </span>
        </div>

        <h3 className="mt-4 text-lg font-black leading-tight tracking-[-0.04em] text-white">
          {title}
        </h3>

        <div className="mt-3 grid gap-2 rounded-[22px] border border-white/10 bg-slate-950/45 p-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
              Slug
            </p>

            <p className="min-w-0 truncate text-xs font-bold text-slate-400">
              {slug}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
              Update
            </p>

            <p className="text-xs font-bold text-slate-400">{updatedAt}</p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
              Read
            </p>

            <p className="text-xs font-bold text-slate-400">{readTime}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-2 text-xs font-black text-white transition hover:border-emerald-400/25 hover:bg-emerald-400/10 hover:text-emerald-200"
          >
            Edit Preview
          </button>

          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-2 text-xs font-black text-slate-300 transition hover:border-cyan-400/25 hover:bg-cyan-400/10 hover:text-cyan-200"
          >
            Preview Artikel
          </button>
        </div>
      </div>
    </article>
  );
}