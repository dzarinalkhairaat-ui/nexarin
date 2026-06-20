import NewsCompactCard from "@/features/news/components/NewsCompactCard";

export default function RelatedArticles({ articles }) {
  const related = Array.isArray(articles) ? articles : [];

  return (
    <section className="relative overflow-hidden px-5 py-8 text-white sm:px-6 sm:py-10 lg:px-8">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-lime-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-8 w-1 rounded-full bg-lime-400" />

          <div>
            <h2 className="text-2xl font-black tracking-[-0.045em] text-white">
              Artikel Terkait
            </h2>

            <p className="mt-1 text-xs font-semibold text-slate-500">
              Rekomendasi artikel lain
            </p>
          </div>
        </div>

        {related.length > 0 ? (
          <div className="relative z-10 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {related.map((article, index) => (
              <NewsCompactCard
                key={article?.slug || `related-${index}`}
                article={article}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-white/5 bg-slate-900/40 p-6 text-center text-sm font-medium text-slate-400">
            Artikel terkait belum tersedia.
          </div>
        )}
      </div>
    </section>
  );
}