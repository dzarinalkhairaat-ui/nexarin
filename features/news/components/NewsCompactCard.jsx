import Link from "next/link";

function getCompactImage(article) {
  const safeArticle = article || {};

  return (
    safeArticle.coverImageUrl ||
    safeArticle.cover_image_url ||
    safeArticle.image ||
    ""
  );
}

function CompactImagePlaceholder({ article }) {
  const safeArticle = article || {};

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_24%,rgba(16,185,129,0.24),transparent_36%),radial-gradient(circle_at_74%_70%,rgba(6,182,212,0.2),transparent_38%),linear-gradient(135deg,rgba(15,23,42,0.92),rgba(2,6,23,1))]" />

      <div className="relative z-10 flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-cyan-300/25 bg-slate-950/70 p-2 shadow-lg shadow-cyan-400/10 backdrop-blur-md">
        <img
          src="/images/logo/nexarin-logo.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-contain"
          loading="lazy"
          decoding="async"
        />
      </div>

      <span className="sr-only">{safeArticle.title || "Nexarin News"}</span>
    </div>
  );
}

function CompactImage({ article }) {
  const safeArticle = article || {};
  const imageUrl = getCompactImage(safeArticle);

  return (
    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-900">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={safeArticle.coverImageAlt || safeArticle.title || "Nexarin News"}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <CompactImagePlaceholder article={safeArticle} />
      )}
    </div>
  );
}

export default function NewsCompactCard({ article, index }) {
  const safeArticle = article || {};
  const articleSlug = String(safeArticle.slug || "").trim();
  const articleHref = articleSlug ? `/news/artikel/${articleSlug}` : "/news";

  return (
    <Link
      href={articleHref}
      className="group flex gap-3 rounded-2xl border border-white/5 bg-slate-900/40 p-3 transition hover:-translate-y-0.5 hover:border-white/10 hover:bg-slate-900/70 focus-visible:ring-2 focus-visible:ring-emerald-400/60"
    >
      <CompactImage article={safeArticle} />

      <div className="min-w-0 flex-1 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-[10px] font-bold text-emerald-400">
            {String((index || 0) + 1)}
          </span>

          <span className="truncate text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {safeArticle.category || "News"}
          </span>
        </div>

        <h3 className="line-clamp-2 text-sm font-bold leading-tight tracking-tight text-white group-hover:text-emerald-300 transition-colors">
          {safeArticle.title || "Artikel Nexarin"}
        </h3>
      </div>
    </Link>
  );
}