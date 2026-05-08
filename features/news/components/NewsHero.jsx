import Link from "next/link";
import {
  newsArticles as fallbackNewsArticles,
  newsHeroData,
} from "@/features/news/news.data";

const INDONESIA_MAP_IMAGE = "/images/backround/indonesia-map.png";
const NEXARIN_LOGO = "/images/logo/nexarin-logo.png";

const FALLBACK_PREVIEW_ARTICLES = [
  {
    category: "Update",
    title: "News Nexarin disiapkan sebagai portal informasi by-rins.",
    slug: "news-nexarin-akan-mengadaptasi-pondasi-rinsnews",
    href: "/news/artikel/news-nexarin-akan-mengadaptasi-pondasi-rinsnews",
    image:
      "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=500&q=80",
  },
  {
    category: "Digital",
    title: "Artikel, kategori, search, dan headline dibuat bertahap.",
    slug: "struktur-artikel-kategori-dan-search-disiapkan",
    href: "/news/artikel/struktur-artikel-kategori-dan-search-disiapkan",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=80",
  },
  {
    category: "Teknologi",
    title: "Fallback data membantu halaman tetap stabil dan aman.",
    slug: "konten-awal-masih-memakai-fallback-data",
    href: "/news/artikel/konten-awal-masih-memakai-fallback-data",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80",
  },
  {
    category: "Produk",
    title: "Nexarin Products menjadi bagian ekosistem digital.",
    slug: "nexarin-products-menjadi-bagian-ekosistem-digital",
    href: "/news/artikel/nexarin-products-menjadi-bagian-ekosistem-digital",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=500&q=80",
  },
  {
    category: "Insight",
    title: "Portfolio Nexarin disiapkan sebagai showcase project.",
    slug: "portfolio-nexarin-disiapkan-sebagai-showcase-project",
    href: "/news/artikel/portfolio-nexarin-disiapkan-sebagai-showcase-project",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=500&q=80",
  },
  {
    category: "Update",
    title: "Contact menjadi jalur komunikasi awal Nexarin.",
    slug: "contact-menjadi-jalur-komunikasi-awal-nexarin",
    href: "/news/artikel/contact-menjadi-jalur-komunikasi-awal-nexarin",
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=500&q=80",
  },
];

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
    id: article?.id || slug || `news-preview-${index + 1}`,
    category:
      article?.category ||
      article?.categoryName ||
      article?.category?.name ||
      "News",
    title: getSafeText(article?.title) || "Artikel Nexarin News",
    href: article?.href || getArticleHref(article),
    image:
      article?.image ||
      article?.coverImageUrl ||
      article?.cover_image_url ||
      "",
    slug,
  };
}

function getFallbackPreviewArticles() {
  const staticArticles = Array.isArray(fallbackNewsArticles)
    ? fallbackNewsArticles
    : [];

  const normalizedStaticArticles = staticArticles
    .map((article, index) => normalizePreviewArticle(article, index))
    .filter((article) => article.title && article.href)
    .slice(0, 6);

  if (normalizedStaticArticles.length > 0) {
    return normalizedStaticArticles;
  }

  return FALLBACK_PREVIEW_ARTICLES.map((article, index) =>
    normalizePreviewArticle(article, index)
  ).slice(0, 6);
}

function getPreviewArticles(articles) {
  const safeArticles = Array.isArray(articles) ? articles : [];

  const normalizedArticles = safeArticles
    .map((article, index) => normalizePreviewArticle(article, index))
    .filter((article) => article.title && article.href)
    .slice(0, 6);

  if (normalizedArticles.length > 0) {
    return normalizedArticles;
  }

  return getFallbackPreviewArticles();
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
      className="group snap-start overflow-hidden rounded-[22px] border border-white/10 bg-slate-950/72 shadow-xl shadow-black/20 transition hover:border-cyan-300/25 hover:bg-cyan-400/10"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
        <PreviewArticleImage article={safeArticle} />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_24%,rgba(16,185,129,0.18),transparent_34%),radial-gradient(circle_at_75%_65%,rgba(6,182,212,0.16),transparent_36%)]" />

        <div className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-cyan-300/25 bg-slate-950/75 p-1.5 shadow-lg shadow-cyan-400/10 backdrop-blur-md">
          <img
            src={NEXARIN_LOGO}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-contain"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      <div className="p-3 pb-4">
        <span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.1em] text-cyan-200">
          {safeArticle.category || "News"}
        </span>

        <h3 className="mt-2 line-clamp-2 text-[13px] font-black leading-[1.22] tracking-[-0.035em] text-white">
          {safeArticle.title || "Artikel Nexarin News"}
        </h3>
      </div>
    </Link>
  );
}

function NewsPreviewCard({ articles }) {
  const previewArticles = getPreviewArticles(articles);

  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-[34px] border border-white/10 bg-slate-950/82 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl lg:mx-0">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(16,185,129,0.16),transparent_34%),radial-gradient(circle_at_90%_38%,rgba(6,182,212,0.13),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.08),transparent_36%)]" />

      <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.045] p-4 shadow-xl shadow-black/20 backdrop-blur-xl">
        <div
          className="pointer-events-none absolute inset-0 bg-center bg-no-repeat opacity-[0.08]"
          style={{
            backgroundImage: `url(${INDONESIA_MAP_IMAGE})`,
            backgroundSize: "115%",
          }}
        />

        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-44 w-44 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative z-10">
          <h2 className="text-3xl font-black leading-none tracking-[-0.06em] text-white">
            Nexarin<span className="text-cyan-300">News</span>
          </h2>

          <p className="mt-2 max-w-[13rem] text-sm font-black leading-5 text-slate-300">
            Informasi, Digital, dan Referensi by-rins
          </p>

          <Link
            href="/news/search"
            className="group relative mt-4 inline-flex min-h-11 items-center justify-center overflow-hidden rounded-2xl border border-emerald-300/25 bg-white/[0.12] px-5 py-2.5 text-sm font-black text-white shadow-xl shadow-emerald-400/10 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-emerald-300/40 hover:bg-emerald-400/15"
          >
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-400/28 via-cyan-300/16 to-white/[0.03]" />
            <span className="relative z-10 drop-shadow-sm">Lihat Semua</span>
          </Link>
        </div>
      </div>

      <div className="relative z-10 mt-4">
        <div className="-mx-1 grid auto-cols-[minmax(132px,0.72fr)] grid-flow-col gap-3 overflow-x-auto px-1 pb-2 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {previewArticles.map((article) => (
            <PreviewArticleCard key={article.id || article.title} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function NewsHero({ articles = [] }) {
  const data = newsHeroData || {};

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
            {data.eyebrow || "News"}
          </p>

          <h1 className="mx-auto mt-5 max-w-3xl text-[2.4rem] font-black leading-[0.95] tracking-[-0.065em] text-white sm:text-6xl lg:mx-0">
            {data.title || "Ruang informasi digital Nexarin."}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm font-medium leading-7 text-slate-300 sm:text-base sm:leading-8 lg:mx-0">
            {data.description ||
              "News Nexarin disiapkan sebagai portal informasi by-rins yang aman, ringan, dan mobile-first."}
          </p>
        </div>

        <NewsPreviewCard articles={articles} />
      </div>
    </section>
  );
}