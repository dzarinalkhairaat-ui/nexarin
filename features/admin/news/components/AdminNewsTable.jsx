import AdminNewsCard from "./AdminNewsCard";
import AdminNewsEmptyState from "./AdminNewsEmptyState";

export default function AdminNewsTable({ articles }) {
  const safeArticles = Array.isArray(articles) ? articles : [];

  return (
    <section className="relative overflow-hidden px-5 pb-10 pt-3 text-white sm:px-6 sm:pb-12 sm:pt-5 lg:px-8">
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-8 w-1 shrink-0 rounded-full bg-emerald-400" />

          <div className="min-w-0">
            <h2 className="text-2xl font-black tracking-[-0.045em] text-white">
              Artikel News
            </h2>

            <p className="mt-1 text-xs font-semibold text-slate-500">
              Daftar artikel yang akan dikelola dari dashboard.
            </p>
          </div>
        </div>

        {safeArticles.length > 0 ? (
          <div className="grid gap-3 lg:grid-cols-2">
            {safeArticles.map((article) => (
              <AdminNewsCard
                key={article?.id || article?.slug || article?.title}
                article={article}
              />
            ))}
          </div>
        ) : (
          <AdminNewsEmptyState />
        )}

        <div className="mt-5 rounded-[30px] border border-emerald-400/15 bg-emerald-400/[0.07] p-5 shadow-2xl shadow-black/20">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
            Next Step
          </p>

          <p className="mt-3 text-sm font-medium leading-7 text-slate-300">
            Setelah UI Admin News ini aman, kita lanjut buat struktur form
            tambah/edit artikel, lalu sambungkan ke backend dan database News
            secara bertahap.
          </p>
        </div>
      </div>
    </section>
  );
}