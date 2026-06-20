import NewsCard from "@/features/news/components/NewsCard";
import NewsCompactCard from "@/features/news/components/NewsCompactCard";

function HeadlineEmptyState() {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] p-6 text-center shadow-xl shadow-black/10">
      <div className="pointer-events-none absolute -left-16 -top-16 h-44 w-44 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10">
        <p className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">
          Database
        </p>

        <h3 className="mx-auto mt-4 max-w-xl text-2xl font-black leading-tight tracking-[-0.045em] text-white">
          Headline belum tersedia.
        </h3>

        <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-7 text-slate-500">
          Artikel headline akan tampil otomatis setelah ada artikel published
          dari database yang ditandai sebagai headline.
        </p>
      </div>
    </div>
  );
}

function SideHeadlineEmptyState() {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 text-center text-sm font-medium text-slate-400">
      Headline tambahan belum tersedia.
    </div>
  );
}

export default function HeadlineNews({ articles: articlesProp = [] }) {
  const articles = Array.isArray(articlesProp) ? articlesProp : [];
  const headlineArticles = articles.filter((article) => article?.isHeadline);
  const mainHeadline = headlineArticles[0] || null;
  const sideHeadlines = headlineArticles.slice(1, 4);

  return (
    <section
      id="headline-news"
      className="relative overflow-hidden px-5 py-8 text-white sm:px-6 sm:py-10 lg:px-8"
    >
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="h-8 w-1 shrink-0 rounded-full bg-gradient-to-b from-emerald-300 to-cyan-300 shadow-lg shadow-emerald-400/20" />

            <div className="min-w-0">
              <h2 className="text-2xl font-black tracking-[-0.045em] text-white">
                Headline
              </h2>

              <p className="mt-1 text-xs font-semibold text-slate-500">
                Sorotan utama News Nexarin
              </p>
            </div>
          </div>

          <span className="hidden shrink-0 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-cyan-300 sm:inline-flex">
            Main News
          </span>
        </div>

        {mainHeadline ? (
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-start">
            <div className="w-full">
              <NewsCard article={mainHeadline} />
            </div>

            <div className="w-full flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3 px-1">
                <div>
                  <p className="text-lg font-black text-white">
                    Headline Lainnya
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                {sideHeadlines.length > 0 ? (
                  sideHeadlines.map((article, index) => (
                    <NewsCompactCard
                      key={article?.slug || `headline-${index}`}
                      article={article}
                      index={index}
                    />
                  ))
                ) : (
                  <SideHeadlineEmptyState />
                )}
              </div>
            </div>
          </div>
        ) : (
          <HeadlineEmptyState />
        )}
      </div>
    </section>
  );
}