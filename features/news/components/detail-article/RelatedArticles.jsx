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
          <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.035] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-lime-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="relative z-10 grid gap-3">
              {related.map((article, index) => (
                <NewsCompactCard
                  key={article?.slug || `related-${index}`}
                  article={article}
                  index={index}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 text-center text-sm font-medium text-slate-400">
            Artikel terkait belum tersedia.
          </div>
        )}
      </div>
    </section>
  );
}