import Link from "next/link";
import NewsCard from "@/features/news/components/NewsCard";
import NewsCompactCard from "@/features/news/components/NewsCompactCard";

function getValidArticles(articles) {
  const safeArticles = Array.isArray(articles) ? articles : [];

  return safeArticles.filter((article) => article?.slug && article?.title);
}

function LatestEmptyState() {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] p-6 text-center shadow-xl shadow-black/10">
      <div className="pointer-events-none absolute -left-16 -top-16 h-44 w-44 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-44 w-44 rounded-full bg-lime-400/10 blur-3xl" />

      <div className="relative z-10">
        <p className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">
          Database
        </p>

        <h3 className="mx-auto mt-4 max-w-xl text-2xl font-black leading-tight tracking-[-0.045em] text-white">
          Berita terbaru belum tersedia.
        </h3>

        <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-7 text-slate-500">
          Setelah artikel pertama dipublikasikan dari dashboard admin, berita
          terbaru akan tampil otomatis di bagian ini.
        </p>

        <Link
          href="/news/search"
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 text-sm font-black text-emerald-200 transition hover:bg-emerald-400 hover:text-slate-950"
        >
          Cari Artikel
        </Link>
      </div>
    </div>
  );
}

function CompactLatestEmptyState() {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 text-center text-sm font-medium text-slate-400">
      Update ringkas belum tersedia.
    </div>
  );
}

export default function LatestNews({ articles: articlesProp = [] }) {
  const articles = getValidArticles(articlesProp);
  const latestArticles = articles.slice(0, 6);
  const mainLatest = latestArticles.slice(0, 2);
  const compactLatest = latestArticles.slice(2, 6);

  return (
    <section className="relative overflow-hidden px-5 py-8 text-white sm:px-6 sm:py-10 lg:px-8">
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-lime-400/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="h-8 w-1 shrink-0 rounded-full bg-emerald-400" />

            <div className="min-w-0">
              <h2 className="text-2xl font-black tracking-[-0.045em] text-white">
                Berita Terbaru
              </h2>

              <p className="mt-1 text-xs font-semibold text-slate-500">
                Update terbaru dari Nexarin
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

        {latestArticles.length > 0 ? (
          <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.035] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-lime-400/10 blur-3xl" />

            <div className="relative z-10 grid gap-4 lg:grid-cols-[1fr_0.86fr]">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                {mainLatest.map((article, index) => (
                  <NewsCard
                    key={article?.slug || `latest-main-${index}`}
                    article={article}
                  />
                ))}
              </div>

              <div className="rounded-[30px] border border-white/10 bg-slate-950/45 p-3 shadow-xl shadow-black/10">
                <div className="mb-3 flex items-center justify-between gap-3 px-1">
                  <div>
                    <p className="text-sm font-black text-white">
                      Update Ringkas
                    </p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      Berita terbaru lainnya
                    </p>
                  </div>

                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-300">
                    Latest
                  </span>
                </div>

                <div className="grid gap-3">
                  {compactLatest.length > 0 ? (
                    compactLatest.map((article, index) => (
                      <NewsCompactCard
                        key={article?.slug || `latest-compact-${index}`}
                        article={article}
                        index={index}
                      />
                    ))
                  ) : (
                    <CompactLatestEmptyState />
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <LatestEmptyState />
        )}
      </div>
    </section>
  );
}