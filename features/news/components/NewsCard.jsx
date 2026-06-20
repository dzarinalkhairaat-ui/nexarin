import Link from "next/link";

function getArticleImage(article) {
  const safeArticle = article || {};

  return (
    safeArticle.coverImageUrl ||
    safeArticle.cover_image_url ||
    safeArticle.image ||
    ""
  );
}

function NewsImagePlaceholder({ article }) {
  const safeArticle = article || {};

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_20%,rgba(16,185,129,0.24),transparent_34%),radial-gradient(circle_at_78%_68%,rgba(6,182,212,0.2),transparent_38%),linear-gradient(135deg,rgba(15,23,42,0.92),rgba(2,6,23,1))]" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:26px_26px]" />

      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[26px] border border-cyan-300/25 bg-slate-950/70 p-3 shadow-2xl shadow-cyan-400/10 backdrop-blur-xl">
          <img
            src="/images/logo/nexarin-logo.png"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-contain"
            loading="lazy"
            decoding="async"
          />
        </div>

        <p className="mt-4 max-w-[13rem] text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
          {safeArticle.category || "Nexarin News"}
        </p>

        <p className="mt-2 max-w-[13rem] text-[11px] font-semibold leading-5 text-slate-500">
          Gambar artikel belum tersedia
        </p>
      </div>
    </div>
  );
}

function NewsImage({ article }) {
  const safeArticle = article || {};
  const imageUrl = getArticleImage(safeArticle);

  return (
    <div className="relative aspect-[16/9] overflow-hidden bg-slate-950">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={safeArticle.coverImageAlt || safeArticle.title || "Nexarin News"}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <NewsImagePlaceholder article={safeArticle} />
      )}
      
      {/* Subtle overlay for better text contrast if ever needed, but otherwise keep it clean */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
    </div>
  );
}

export default function NewsCard({ article }) {
  const safeArticle = article || {};
  const articleSlug = String(safeArticle.slug || "").trim();
  const articleHref = articleSlug ? `/news/artikel/${articleSlug}` : "/news";

  return (
    <article className="group overflow-hidden rounded-2xl border border-white/5 bg-slate-900/40 transition hover:-translate-y-1 hover:border-white/10 hover:bg-slate-900/70">
      <Link
        href={articleHref}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
      >
        <NewsImage article={safeArticle} />

        <div className="p-4 sm:p-5 flex flex-col justify-between h-[180px]">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                {safeArticle.category || "News"}
              </span>

              {safeArticle.readTime ? (
                <>
                  <span className="text-[10px] text-slate-600">•</span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {safeArticle.readTime}
                  </span>
                </>
              ) : null}
            </div>

            <h3 className="line-clamp-2 text-lg font-bold leading-snug tracking-tight text-white group-hover:text-emerald-300 transition-colors">
              {safeArticle.title || "Artikel Nexarin"}
            </h3>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/5 pt-3">
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-slate-300">
                {safeArticle.author || "Nexarin by-rins"}
              </p>

              {safeArticle.date ? (
                <p className="mt-0.5 text-[10px] text-slate-500">
                  {safeArticle.date}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}