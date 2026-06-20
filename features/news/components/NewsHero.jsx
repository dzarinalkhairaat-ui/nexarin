import Link from "next/link";

const INDONESIA_MAP_IMAGE = "/images/backround/indonesia-map.png";
const NEXARIN_LOGO = "/images/logo/nexarin-logo.png";

const NEWS_HERO_DATA = {
  eyebrow: "News",
  title: "Ruang informasi digital Nexarin.",
  description:
    "Ruang informasi digital by-rins untuk update, insight, teknologi, dan referensi pilihan dalam ekosistem Nexarin.",
};

function getSafeText(value) {
  return String(value || "").trim();
}

function getArticleHref(article) {
  const slug = getSafeText(article?.slug);

  if (!slug) {
    return "/news";
  }

  return `/news/artikel/${slug}`;
}

function normalizePreviewArticle(article, index = 0) {
  const slug = getSafeText(article?.slug);

  return {
    id: article?.id || slug || `news-db-preview-${index + 1}`,
    category:
      article?.category ||
      article?.categoryName ||
      article?.category?.name ||
      "News",
    title: getSafeText(article?.title),
    href: getArticleHref(article),
    image:
      article?.image ||
      article?.coverImageUrl ||
      article?.cover_image_url ||
      "",
    slug,
  };
}

function getPreviewArticles(articles) {
  const safeArticles = Array.isArray(articles) ? articles : [];

  return safeArticles
    .map((article, index) => normalizePreviewArticle(article, index))
    .filter((article) => article.slug && article.title)
    .slice(0, 6);
}

function PreviewArticleImage({ article }) {
  const imageUrl = getSafeText(article?.image);
  const category = article?.category || "News";

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt=""
        className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105"
        loading="lazy"
        decoding="async"
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_24%,rgba(16,185,129,0.26),transparent_34%),radial-gradient(circle_at_78%_72%,rgba(6,182,212,0.2),transparent_38%),linear-gradient(135deg,rgba(15,23,42,0.2),rgba(2,6,23,0.92))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:24px_24px]" />

      <img
        src={NEXARIN_LOGO}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rotate-12 object-contain opacity-[0.08]"
        loading="lazy"
        decoding="async"
      />

      <div className="relative z-10 flex flex-col items-center justify-center px-3 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/25 bg-slate-950/70 p-2.5 shadow-lg shadow-cyan-950/30 backdrop-blur-xl">
          <img
            src={NEXARIN_LOGO}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-contain"
            loading="lazy"
            decoding="async"
          />
        </div>

        <p className="mt-3 max-w-full truncate text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">
          {category}
        </p>
      </div>
    </div>
  );
}

function PreviewArticleCard({ article }) {
  const safeArticle = article || {};

  return (
    <Link
      href={safeArticle.href || "/news"}
      className="group flex gap-3 items-center rounded-xl p-2 transition hover:bg-white/5"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-900">
        <PreviewArticleImage article={safeArticle} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
          {safeArticle.category || "News"}
        </p>
        <h3 className="truncate text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
          {safeArticle.title || "Artikel Nexarin News"}
        </h3>
      </div>
    </Link>
  );
}

function NewsPreviewEmptyState() {
  return (
    <div className="relative z-10 mt-4 rounded-[26px] border border-white/10 bg-slate-950/55 p-5 text-center shadow-xl shadow-black/20">
      <p className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-300">
        Database
      </p>

      <h3 className="mt-4 text-xl font-black leading-tight tracking-[-0.045em] text-white">
        Artikel News masih kosong.
      </h3>

      <p className="mt-3 text-xs font-semibold leading-6 text-slate-500">
        Setelah artikel dipublish dari admin dashboard, preview artikel akan
        tampil otomatis di sini.
      </p>

      <Link
        href="/news/search"
        className="mt-4 inline-flex min-h-10 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-black text-cyan-200 transition hover:bg-cyan-400 hover:text-slate-950"
      >
        Cari Artikel
      </Link>
    </div>
  );
}

function NewsPreviewCard({ articles }) {
  // Hanya ambil 3 artikel untuk daftar yang lebih bersih
  const previewArticles = getPreviewArticles(articles).slice(0, 3);

  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-white/5 bg-slate-900/40 p-5 shadow-2xl backdrop-blur-xl lg:mx-0">
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-black text-white">
            Top<span className="text-emerald-400">News</span>
          </h2>
          <p className="text-xs font-medium text-slate-400 mt-1">
            Sorotan terbaru by-rins
          </p>
        </div>
        <Link
          href="/news/search"
          className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300"
        >
          Lihat Semua &rarr;
        </Link>
      </div>

      {previewArticles.length > 0 ? (
        <div className="flex flex-col gap-1">
          {previewArticles.map((article) => (
            <PreviewArticleCard
              key={article.id || article.slug || article.title}
              article={article}
            />
          ))}
        </div>
      ) : (
        <NewsPreviewEmptyState />
      )}
    </div>
  );
}

export default function NewsHero({ articles = [] }) {
  const data = NEWS_HERO_DATA;

  return (
    <section className="relative overflow-hidden px-5 pb-8 pt-7 text-white sm:px-6 sm:pb-10 sm:pt-10 lg:px-8 lg:pb-14 lg:pt-14">
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

      <img
        src={NEXARIN_LOGO}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-10 h-72 w-72 rotate-12 object-contain opacity-[0.035] sm:top-14 sm:h-96 sm:w-96"
        loading="lazy"
        decoding="async"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-7 lg:grid-cols-[minmax(0,1.04fr)_minmax(320px,0.72fr)] lg:items-center">
        <div className="text-center lg:text-left">
          <p className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-cyan-300 shadow-lg shadow-cyan-400/5">
            {data.eyebrow}
          </p>

          <h1 className="mx-auto mt-5 max-w-3xl text-[2.4rem] font-black leading-[0.95] tracking-[-0.065em] text-white sm:text-6xl lg:mx-0">
            {data.title}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm font-medium leading-7 text-slate-300 sm:text-base sm:leading-8 lg:mx-0">
            {data.description}
          </p>
        </div>

        <NewsPreviewCard articles={articles} />
      </div>
    </section>
  );
}