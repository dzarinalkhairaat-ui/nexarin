import Link from "next/link";
import NewsCompactCard from "@/features/news/components/NewsCompactCard";

export default function PopularNews({ articles: articlesProp = [] }) {
  const articles = Array.isArray(articlesProp) ? articlesProp : [];
  const popularArticles = articles
    .filter((article) => article?.isPopular)
    .slice(0, 5);

  return (
    <section className="relative overflow-hidden px-5 py-8 text-white sm:px-6 sm:py-10 lg:px-8">
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-lime-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="h-8 w-1 shrink-0 rounded-full bg-lime-400" />

            <div className="min-w-0">
              <h2 className="text-2xl font-black tracking-[-0.045em] text-white">
                Berita Populer
              </h2>

              <p className="mt-1 text-xs font-semibold text-slate-500">
                Artikel pilihan Nexarin
              </p>
            </div>
          </div>

          <Link
            href="/news/search"
            className="shrink-0 rounded-full border border-lime-400/20 bg-lime-400/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-lime-300 transition hover:bg-lime-400 hover:text-slate-950"
          >
            Lihat Semua
          </Link>
        </div>

        {popularArticles.length > 0 ? (
          <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.035] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-lime-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between gap-3 px-1">
                <div>
                  <p className="text-sm font-black text-white">
                    Paling Banyak Dibaca
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    Ringkasan artikel populer
                  </p>
                </div>

                <span className="rounded-full border border-lime-400/20 bg-lime-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-lime-300">
                  Popular
                </span>
              </div>

              <div className="grid gap-3">
                {popularArticles.map((article, index) => (
                  <NewsCompactCard
                    key={article?.slug || `popular-${index}`}
                    article={article}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 text-center text-sm font-medium text-slate-400">
            Berita populer belum tersedia.
          </div>
        )}
      </div>
    </section>
  );
}