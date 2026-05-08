import Link from "next/link";

const COMPACT_ARTICLE_IMAGES = {
  "news-nexarin-akan-mengadaptasi-pondasi-rinsnews":
    "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=500&q=80",
  "struktur-artikel-kategori-dan-search-disiapkan":
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=80",
  "konten-awal-masih-memakai-fallback-data":
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80",
  "nexarin-products-menjadi-bagian-ekosistem-digital":
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=500&q=80",
  "portfolio-nexarin-disiapkan-sebagai-showcase-project":
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=500&q=80",
  "contact-menjadi-jalur-komunikasi-awal-nexarin":
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=500&q=80",
};

function getCompactImage(article) {
  const safeArticle = article || {};

  return safeArticle.image || COMPACT_ARTICLE_IMAGES[safeArticle.slug] || "";
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
    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[22px] border border-cyan-300/15 bg-slate-950 shadow-lg shadow-black/20">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={safeArticle.title || "Nexarin News"}
          className="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <CompactImagePlaceholder article={safeArticle} />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(16,185,129,0.18),transparent_34%),radial-gradient(circle_at_78%_70%,rgba(6,182,212,0.14),transparent_36%)]" />

      <div className="absolute bottom-2 left-2 flex h-7 w-7 items-center justify-center overflow-hidden rounded-xl border border-cyan-300/25 bg-slate-950/75 p-1 shadow-lg shadow-cyan-400/10 backdrop-blur-md">
        <img
          src="/images/logo/nexarin-logo.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-contain"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}

export default function NewsCompactCard({ article, index }) {
  const safeArticle = article || {};
  const articleHref = `/news/artikel/${safeArticle.slug || "preview"}`;

  return (
    <Link
      href={articleHref}
      className="group flex gap-3 rounded-[26px] border border-white/10 bg-white/[0.045] p-3 shadow-lg shadow-black/15 outline-none transition hover:-translate-y-0.5 hover:border-cyan-400/25 hover:bg-cyan-400/[0.06] focus-visible:ring-2 focus-visible:ring-cyan-400/60"
    >
      <CompactImage article={safeArticle} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-[10px] font-black text-emerald-300">
            {String((index || 0) + 1).padStart(2, "0")}
          </span>

          <span className="truncate rounded-full border border-cyan-400/15 bg-cyan-400/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-cyan-300">
            {safeArticle.category || "News"}
          </span>
        </div>

        <h3 className="mt-2 line-clamp-2 text-sm font-black leading-tight tracking-[-0.035em] text-white">
          {safeArticle.title || "Artikel Nexarin"}
        </h3>

        <p className="mt-2 line-clamp-2 text-xs font-medium leading-5 text-slate-500">
          {safeArticle.excerpt ||
            "Ringkasan artikel Nexarin akan tampil di sini."}
        </p>
      </div>
    </Link>
  );
}