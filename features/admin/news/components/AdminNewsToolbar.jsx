export default function AdminNewsToolbar({ categories, statuses }) {
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeStatuses = Array.isArray(statuses) ? statuses : [];

  return (
    <section className="relative px-5 pb-5 text-white sm:px-6 sm:pb-7 lg:px-8">
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative z-10 grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px_auto] lg:items-end">
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                Cari Artikel
              </span>

              <input
                type="search"
                placeholder="Cari judul artikel..."
                className="min-h-12 rounded-2xl border border-white/10 bg-slate-950/65 px-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                Kategori
              </span>

              <select
                defaultValue="semua"
                className="min-h-12 rounded-2xl border border-white/10 bg-slate-950/65 px-4 text-sm font-bold text-white outline-none transition focus:border-emerald-400/50"
              >
                {safeCategories.length > 0 ? (
                  safeCategories.map((category) => (
                    <option
                      key={category?.slug || category?.label}
                      value={category?.slug || ""}
                    >
                      {category?.label || "Kategori"}
                    </option>
                  ))
                ) : (
                  <option value="semua">Semua</option>
                )}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                Status
              </span>

              <select
                defaultValue="semua"
                className="min-h-12 rounded-2xl border border-white/10 bg-slate-950/65 px-4 text-sm font-bold text-white outline-none transition focus:border-emerald-400/50"
              >
                {safeStatuses.length > 0 ? (
                  safeStatuses.map((status) => (
                    <option
                      key={status?.value || status?.label}
                      value={status?.value || ""}
                    >
                      {status?.label || "Status"}
                    </option>
                  ))
                ) : (
                  <option value="semua">Semua Status</option>
                )}
              </select>
            </label>

            <button
              type="button"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:bg-emerald-300"
            >
              Tambah Artikel
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}