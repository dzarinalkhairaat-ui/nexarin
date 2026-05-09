import Link from "next/link";
import ScrollReveal from "@/components/shared/ScrollReveal";
import NewsFooter from "@/features/news/components/NewsFooter";
import ArticleHeader from "@/features/news/components/detail-article/ArticleHeader";
import ArticleHero from "@/features/news/components/detail-article/ArticleHero";
import ArticleContent from "@/features/news/components/detail-article/ArticleContent";
import RelatedArticles from "@/features/news/components/detail-article/RelatedArticles";
import { prisma } from "@/lib/prisma";

const RELATED_ARTICLE_LIMIT = 4;
const DEFAULT_CATEGORY_NAME = "News";
const DEFAULT_CATEGORY_SLUG = "news";
const DEFAULT_AUTHOR_NAME = "Nexarin by-rins";
const DEFAULT_READ_TIME = "3 menit baca";

function getSafeText(value) {
  return String(value || "").trim();
}

function getSafeSlug(value) {
  return getSafeText(value);
}

function getPlainText(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/[#*_`>[\\\](){}~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatPublicArticleDate(date) {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function getIsoDateOnly(date) {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toISOString().slice(0, 10);
}

function splitContentToParagraphs(content) {
  const text = String(content || "")
    .replace(/\r\n/g, "\n")
    .trim();

  if (!text) {
    return [];
  }

  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\n/g, " ").trim())
    .filter(Boolean);
}

function normalizeReadTime(value) {
  const text = String(value || "").trim();

  if (!text) {
    return "";
  }

  return text
    .replace(/(\d+)\s*min\s*read/gi, "$1 menit baca")
    .replace(/(\d+)\s*minutes?\s*read/gi, "$1 menit baca")
    .replace(/(\d+)\s*mins?\s*read/gi, "$1 menit baca");
}

function getReadTime(content) {
  const text = getPlainText(content);

  if (!text) {
    return DEFAULT_READ_TIME;
  }

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));

  return `${minutes} menit baca`;
}

function getSafeExcerpt(article) {
  const summary = getPlainText(article?.summary || article?.excerpt);

  if (summary) {
    return summary;
  }

  const contentPreview = getPlainText(article?.content || article?.body);

  if (!contentPreview) {
    return "";
  }

  return contentPreview.length > 160
    ? `${contentPreview.slice(0, 157)}...`
    : contentPreview;
}

function normalizePublicArticle(article, index = 0) {
  const publishedDate =
    article?.publishedAt || article?.createdAt || article?.date || "";

  const contentParagraphs = Array.isArray(article?.content)
    ? article.content.filter(Boolean)
    : splitContentToParagraphs(article?.content || article?.body);

  const slug = getSafeSlug(article?.slug);

  return {
    id: article?.id || slug || `news-article-${index + 1}`,
    slug,
    title: getSafeText(article?.title) || "Artikel Nexarin News",
    category:
      article?.category?.name ||
      article?.category ||
      article?.categoryName ||
      DEFAULT_CATEGORY_NAME,
    categorySlug:
      article?.category?.slug ||
      article?.categorySlug ||
      article?.category_slug ||
      DEFAULT_CATEGORY_SLUG,
    excerpt: getSafeExcerpt(article),
    author:
      article?.author ||
      article?.sourceName ||
      article?.articleSourceName ||
      DEFAULT_AUTHOR_NAME,
    date:
      typeof article?.date === "string" && article.date.trim()
        ? article.date
        : formatPublicArticleDate(publishedDate),
    publishedDate: getIsoDateOnly(publishedDate),
    readTime:
      normalizeReadTime(article?.readTime) ||
      getReadTime(article?.content || article?.body),
    image: article?.coverImageUrl || article?.image || "",
    coverImageUrl: article?.coverImageUrl || article?.image || "",
    coverImageAlt:
      article?.coverImageAlt || article?.title || "Artikel Nexarin News",
    content: contentParagraphs,
    body:
      typeof article?.body === "string"
        ? article.body
        : typeof article?.content === "string"
          ? article.content
          : "",
    isHeadline: Boolean(article?.isHeadline),
    isPopular: Boolean(article?.isPopular || article?.isFeatured),
    youtubeUrl: article?.youtubeUrl || "",
    articleSourceName:
      article?.articleSourceName || article?.sourceName || DEFAULT_AUTHOR_NAME,
    articleSourceUrl: article?.articleSourceUrl || article?.sourceUrl || "",
    sourceNote: article?.sourceNote || "",
    videoSourceName: article?.videoSourceName || "",
    videoSourceUrl: article?.videoSourceUrl || article?.youtubeUrl || "",
    categoryId: article?.categoryId || "",
    source: "database",
  };
}

function mapDatabaseArticleToPublicArticle(article, index = 0) {
  return normalizePublicArticle(
    {
      id: article?.id,
      slug: article?.slug,
      title: article?.title,
      summary: article?.summary,
      content: article?.content,
      category: article?.category,
      categoryId: article?.categoryId,
      sourceName: article?.sourceName,
      sourceUrl: article?.sourceUrl,
      sourceNote: article?.sourceNote,
      videoSourceName: article?.videoSourceName,
      videoSourceUrl: article?.videoSourceUrl,
      youtubeUrl: article?.youtubeUrl,
      coverImageUrl: article?.coverImageUrl,
      coverImageAlt: article?.coverImageAlt,
      isHeadline: article?.isHeadline,
      isFeatured: article?.isFeatured,
      publishedAt: article?.publishedAt,
      createdAt: article?.createdAt,
    },
    index
  );
}

function getPublicDateFilter() {
  const now = new Date();

  return [
    {
      publishedAt: null,
    },
    {
      publishedAt: {
        lte: now,
      },
    },
  ];
}

async function getDatabaseArticle(slug) {
  const safeSlug = getSafeSlug(slug);

  if (!safeSlug) {
    return null;
  }

  try {
    const article = await prisma.newsArticle.findFirst({
      where: {
        slug: safeSlug,
        status: "PUBLISHED",
        OR: getPublicDateFilter(),
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    return article ? mapDatabaseArticleToPublicArticle(article) : null;
  } catch (error) {
    console.error("Gagal mengambil detail artikel News:", error);

    return null;
  }
}

function mergeUniqueArticles(articles) {
  const safeArticles = Array.isArray(articles) ? articles : [];
  const seenSlugs = new Set();

  return safeArticles.filter((article) => {
    const slug = article?.slug;

    if (!slug || seenSlugs.has(slug)) {
      return false;
    }

    seenSlugs.add(slug);
    return true;
  });
}

async function getDatabaseRelatedArticles(currentArticle) {
  if (!currentArticle?.slug || !currentArticle?.categoryId) {
    return [];
  }

  const baseWhere = {
    status: "PUBLISHED",
    slug: {
      not: currentArticle.slug,
    },
    OR: getPublicDateFilter(),
  };

  try {
    const sameCategoryArticles = await prisma.newsArticle.findMany({
      where: {
        ...baseWhere,
        categoryId: currentArticle.categoryId,
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [
        {
          publishedAt: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      take: RELATED_ARTICLE_LIMIT,
    });

    const remainingLimit =
      RELATED_ARTICLE_LIMIT - sameCategoryArticles.length;

    const otherArticles =
      remainingLimit > 0
        ? await prisma.newsArticle.findMany({
            where: {
              ...baseWhere,
              categoryId: {
                not: currentArticle.categoryId,
              },
            },
            include: {
              category: {
                select: {
                  name: true,
                  slug: true,
                },
              },
            },
            orderBy: [
              {
                publishedAt: "desc",
              },
              {
                createdAt: "desc",
              },
            ],
            take: remainingLimit,
          })
        : [];

    return mergeUniqueArticles(
      [...sameCategoryArticles, ...otherArticles].map(
        mapDatabaseArticleToPublicArticle
      )
    ).slice(0, RELATED_ARTICLE_LIMIT);
  } catch (error) {
    console.error("Gagal mengambil artikel terkait News:", error);

    return [];
  }
}

async function getRelatedArticles(currentArticle) {
  return getDatabaseRelatedArticles(currentArticle);
}

function ArticleDetailBackground({ article, relatedArticles }) {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-44 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-[34rem] h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-400/[0.055] blur-3xl" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

      <img
        src="/images/logo/nexarin-logo.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 top-8 h-72 w-72 rotate-12 object-contain opacity-[0.035] sm:-right-10 sm:top-10 sm:h-96 sm:w-96"
        loading="lazy"
        decoding="async"
      />

      <div className="pointer-events-none absolute inset-x-0 top-[22rem] h-64 bg-gradient-to-b from-transparent via-cyan-400/[0.045] to-transparent" />

      <div className="relative z-10">
        <ScrollReveal>
          <ArticleHero article={article} />
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <ArticleContent article={article} relatedArticles={relatedArticles} />
        </ScrollReveal>
      </div>
    </section>
  );
}

function RelatedArticlesEmptyState() {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-5 pb-8 pt-2 text-white sm:px-6 sm:pb-10 lg:px-8">
      <div className="relative z-10 mx-auto w-full max-w-3xl">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-9 w-1 rounded-full bg-lime-400" />

          <div>
            <h2 className="text-2xl font-black tracking-[-0.045em] text-white">
              Artikel Terkait
            </h2>

            <p className="mt-1 text-sm font-semibold text-slate-500">
              Rekomendasi artikel lain
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] p-6 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative z-10">
            <p className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300">
              Belum Ada Rekomendasi
            </p>

            <h3 className="mx-auto mt-4 max-w-xl text-2xl font-black leading-tight tracking-[-0.045em] text-white">
              Artikel terkait masih kosong.
            </h3>

            <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-7 text-slate-400">
              Setelah ada artikel lain yang sudah dipublikasikan di database,
              rekomendasi artikel akan tampil otomatis di bagian ini.
            </p>

            <Link
              href="/news"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 text-sm font-black text-emerald-200 transition hover:bg-emerald-400 hover:text-slate-950"
            >
              Kembali ke News
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArticleNotFoundBackground({ slug }) {
  const safeSlug = getSafeSlug(slug);

  return (
    <section className="relative overflow-hidden bg-slate-950 px-5 py-16 text-white sm:px-6 sm:py-20 lg:px-8">
      <div className="pointer-events-none absolute -left-24 top-16 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-32 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

      <img
        src="/images/logo/nexarin-logo.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 top-10 h-80 w-80 rotate-12 object-contain opacity-[0.035] sm:h-96 sm:w-96"
        loading="lazy"
        decoding="async"
      />

      <div className="relative z-10 mx-auto flex min-h-[58vh] w-full max-w-3xl items-center justify-center">
        <div className="w-full rounded-[34px] border border-white/10 bg-white/[0.045] p-6 text-center shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-3 shadow-xl shadow-cyan-400/10">
            <img
              src="/images/logo/nexarin-logo.png"
              alt=""
              aria-hidden="true"
              className="h-full w-full object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>

          <p className="mx-auto mt-6 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-cyan-300">
            News
          </p>

          <h1 className="mx-auto mt-5 max-w-2xl text-[2.35rem] font-black leading-[0.95] tracking-[-0.065em] text-white sm:text-5xl">
            Artikel tidak ditemukan.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm font-medium leading-7 text-slate-300 sm:text-base sm:leading-8">
            Artikel yang bro buka tidak tersedia, sudah dihapus, belum
            dipublikasikan, atau URL artikelnya tidak valid.
          </p>

          {safeSlug ? (
            <p className="mx-auto mt-4 max-w-xl rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-xs font-semibold text-slate-500">
              Slug: {safeSlug}
            </p>
          ) : null}

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/news"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/10 transition hover:-translate-y-0.5 hover:bg-emerald-300 sm:w-auto"
            >
              Kembali ke News
            </Link>

            <Link
              href="/news/search"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:border-cyan-400/25 hover:bg-cyan-400/10 sm:w-auto"
            >
              Cari Artikel
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function NewsArticlePage({ slug }) {
  const safeSlug = getSafeSlug(slug);
  const article = await getDatabaseArticle(safeSlug);

  if (!article) {
    return (
      <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
        <ArticleHeader />

        <ScrollReveal>
          <ArticleNotFoundBackground slug={safeSlug} />
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <NewsFooter />
        </ScrollReveal>
      </main>
    );
  }

  const relatedArticles = await getRelatedArticles(article);

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <ArticleHeader />

      <ArticleDetailBackground
        article={article}
        relatedArticles={relatedArticles}
      />

      <ScrollReveal delay={100}>
        {relatedArticles.length > 0 ? (
          <RelatedArticles articles={relatedArticles} />
        ) : (
          <RelatedArticlesEmptyState />
        )}
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <NewsFooter />
      </ScrollReveal>
    </main>
  );
}