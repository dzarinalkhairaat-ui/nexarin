export default function AdminNewsEmptyState() {
  return (
    <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] p-6 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 shadow-lg shadow-emerald-400/10">
        <span className="text-xl font-black text-emerald-300">N</span>
      </div>

      <div className="relative z-10 mt-5">
        <p className="text-xl font-black tracking-[-0.04em] text-white">
          Artikel belum tersedia
        </p>

        <p className="mx-auto mt-3 max-w-md text-sm font-medium leading-7 text-slate-400">
          Belum ada artikel di Admin News. Nanti artikel baru bisa dibuat dari
          dashboard setelah form tambah artikel dan database disambungkan.
        </p>

        <button
          type="button"
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-emerald-400/10 transition hover:bg-emerald-300"
        >
          Tambah Artikel
        </button>
      </div>
    </div>
  );
}