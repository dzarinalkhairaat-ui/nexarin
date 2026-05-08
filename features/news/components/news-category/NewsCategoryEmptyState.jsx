import Link from "next/link";

export default function NewsCategoryEmptyState({ category }) {
  const categoryLabel = category?.label || "News";

  return (
    <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] p-6 text-center shadow-xl shadow-black/20">
      <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-lime-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-lime-400/20 bg-lime-400/10 shadow-lg shadow-lime-400/10">
        <span className="text-xl font-black text-lime-300">N</span>
      </div>

      <div className="relative z-10 mt-5">
        <p className="text-xl font-black tracking-[-0.04em] text-white">
          Artikel belum tersedia
        </p>

        <p className="mx-auto mt-3 max-w-md text-sm font-medium leading-7 text-slate-400">
          Belum ada artikel yang dipublikasikan untuk kategori {categoryLabel}.
          Coba lihat kategori lain atau kembali ke halaman utama News.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/news"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-emerald-400/10 transition hover:bg-emerald-300"
          >
            Kembali ke News
          </Link>

          <Link
            href="/news/search"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] px-5 py-3 text-sm font-black text-white transition hover:border-lime-400/25 hover:bg-lime-400/10 hover:text-lime-300"
          >
            Cari Artikel
          </Link>
        </div>
      </div>
    </div>
  );
}