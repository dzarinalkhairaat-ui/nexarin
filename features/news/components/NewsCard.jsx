import Link from "next/link";

const ARTICLE_IMAGES = {
  "news-nexarin-akan-mengadaptasi-pondasi-rinsnews":
    "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=900&q=80",
  "struktur-artikel-kategori-dan-search-disiapkan":
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
  "konten-awal-masih-memakai-fallback-data":
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
  "nexarin-products-menjadi-bagian-ekosistem-digital":
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80",
  "portfolio-nexarin-disiapkan-sebagai-showcase-project":
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
  "contact-menjadi-jalur-komunikasi-awal-nexarin":
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=900&q=80",
};

function getArticleImage(article) {
  const safeArticle = article || {};

  return safeArticle.image || ARTICLE_IMAGES[safeArticle.slug] || "";
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
          alt={safeArticle.title || "Nexarin News"}
          className="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <NewsImagePlaceholder article={safeArticle} />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(16,185,129,0.18),transparent_34%),radial-gradient(circle_at_78%_70%,rgba(6,182,212,0.15),transparent_36%)]" />

      <div className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-cyan-300/25 bg-slate-950/75 p-1.5 shadow-lg shadow-cyan-400/10 backdrop-blur-md">
        <img
          src="/images/logo/nexarin-logo.png"
          alt=""
          className="h-full w-full object-contain"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}

export default function NewsCard({ article }) {
  const safeArticle = article || {};
  const articleHref = `/news/artikel/${safeArticle.slug || "preview"}`;

  return (
    <article className="group overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:border-cyan-400/25 hover:bg-cyan-400/[0.055]">
      <Link
        href={articleHref}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
      >
        <NewsImage article={safeArticle} />

        <div className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-300">
              {safeArticle.category || "News"}
            </span>

            <span className="text-[11px] font-bold text-slate-500">
              {safeArticle.readTime || "3 min read"}
            </span>
          </div>

          <h3 className="mt-3 line-clamp-2 text-xl font-black leading-tight tracking-[-0.05em] text-white sm:text-2xl">
            {safeArticle.title || "Artikel Nexarin"}
          </h3>

          <p className="mt-3 line-clamp-2 text-sm font-medium leading-7 text-slate-400">
            {safeArticle.excerpt ||
              "Ringkasan artikel akan ditampilkan di sini sebagai fallback agar halaman tetap aman."}
          </p>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
            <div className="min-w-0">
              <p className="truncate text-xs font-black text-white">
                {safeArticle.author || "Nexarin by-rins"}
              </p>
              <p className="mt-1 text-[11px] font-semibold text-slate-500">
                {safeArticle.date || "2026-05-04"}
              </p>
            </div>

            <span className="shrink-0 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-black text-emerald-300 transition group-hover:border-cyan-300/25 group-hover:bg-cyan-400/10 group-hover:text-cyan-200">
              Baca →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}