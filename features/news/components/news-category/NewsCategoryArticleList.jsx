import NewsCard from "../NewsCard";
import NewsCompactCard from "../NewsCompactCard";
import NewsCategoryEmptyState from "./NewsCategoryEmptyState";

export default function NewsCategoryArticleList({ category, articles }) {
  const safeArticles = Array.isArray(articles) ? articles : [];
  const mainArticle = safeArticles[0] || null;
  const restArticles = safeArticles.slice(1);
  const categoryLabel = category?.label || "News";

  return (
    <section className="relative overflow-hidden px-5 py-8 text-white sm:px-6 sm:py-10 lg:px-8">
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-lime-400/10 blur-3xl" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-8 w-1 shrink-0 rounded-full bg-lime-400" />

          <div className="min-w-0">
            <h2 className="text-2xl font-black tracking-[-0.045em] text-white">
              Artikel {categoryLabel}
            </h2>

            <p className="mt-1 text-xs font-semibold text-slate-500">
              Artikel terbaru dari kategori ini
            </p>
          </div>
        </div>

        {mainArticle ? (
          <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.035] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-lime-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="relative z-10 grid gap-4 lg:grid-cols-[1fr_0.86fr]">
              <NewsCard article={mainArticle} />

              <div className="rounded-[30px] border border-white/10 bg-slate-950/45 p-3 shadow-xl shadow-black/10">
                <div className="mb-3 flex items-center justify-between gap-3 px-1">
                  <div className="min-w-0">
                    <p className="text-sm font-black text-white">
                      Artikel Lain
                    </p>

                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      Masih dalam kategori {categoryLabel}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full border border-lime-400/20 bg-lime-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-lime-300">
                    Feed
                  </span>
                </div>

                <div className="grid gap-3">
                  {restArticles.length > 0 ? (
                    restArticles.map((article, index) => (
                      <NewsCompactCard
                        key={article?.slug || `category-${index}`}
                        article={article}
                        index={index}
                      />
                    ))
                  ) : (
                    <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 text-center text-sm font-medium leading-7 text-slate-400">
                      Belum ada artikel tambahan di kategori ini.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <NewsCategoryEmptyState category={category} />
        )}
      </div>
    </section>
  );
}