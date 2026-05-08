import ScrollReveal from "@/components/shared/ScrollReveal";
import NewsFooter from "@/features/news/components/NewsFooter";
import ArticleHeader from "@/features/news/components/detail-article/ArticleHeader";
import ArticleHero from "@/features/news/components/detail-article/ArticleHero";
import ArticleContent from "@/features/news/components/detail-article/ArticleContent";
import RelatedArticles from "@/features/news/components/detail-article/RelatedArticles";
import { newsArticles as fallbackNewsArticles } from "@/features/news/news.data";
import { prisma } from "@/lib/prisma";

const RELATED_ARTICLE_LIMIT = 4;
const DEFAULT_CATEGORY_NAME = "News";
const DEFAULT_CATEGORY_SLUG = "news";
const DEFAULT_AUTHOR_NAME = "Nexarin by-rins";
const DEFAULT_READ_TIME = "3 min read";

function getSafeText(value) {
  return String(value || "").trim();
}

function getSafeSlug(value) {
  return getSafeText(value);
}

function getFallbackArticles() {
  return Array.isArray(fallbackNewsArticles) ? fallbackNewsArticles : [];
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

function getReadTime(content) {
  const text = getPlainText(content);

  if (!text) {
    return DEFAULT_READ_TIME;
  }

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));

  return `${minutes} min read`;
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
    slug: slug || "preview",
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
    readTime: article?.readTime || getReadTime(article?.content || article?.body),
    image: article?.coverImageUrl || article?.image || "",
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
    videoSourceUrl:
      article?.videoSourceUrl || article?.youtubeUrl || "",
    categoryId: article?.categoryId || "",
    source: article?.source || "fallback",
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
      source: "database",
    },
    index
  );
}

function getPreviewArticle(slug = "preview") {
  return normalizePublicArticle({
    slug: slug || "preview",
    title: "Artikel Nexarin News",
    category: DEFAULT_CATEGORY_NAME,
    categorySlug: DEFAULT_CATEGORY_SLUG,
    excerpt:
      "Artikel fallback Nexarin News disiapkan agar halaman tetap aman.",
    author: DEFAULT_AUTHOR_NAME,
    date: "2026-05-04",
    readTime: DEFAULT_READ_TIME,
    source: "preview",
  });
}

function getFallbackArticle(slug) {
  const safeSlug = getSafeSlug(slug);
  const fallbackArticles = getFallbackArticles();

  const article =
    fallbackArticles.find((item) => item?.slug === safeSlug) ||
    fallbackArticles[0] ||
    null;

  return article
    ? normalizePublicArticle(article)
    : getPreviewArticle(safeSlug || "preview");
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

function getFallbackRelatedArticles(currentArticle) {
  const currentSlug = currentArticle?.slug || "";
  const currentCategorySlug = currentArticle?.categorySlug || "";

  const articles = getFallbackArticles()
    .map((article, index) => normalizePublicArticle(article, index))
    .filter((article) => article?.slug && article.slug !== currentSlug);

  const sameCategory = articles.filter(
    (article) => article?.categorySlug === currentCategorySlug
  );

  const otherArticles = articles.filter(
    (article) => article?.categorySlug !== currentCategorySlug
  );

  return [...sameCategory, ...otherArticles].slice(0, RELATED_ARTICLE_LIMIT);
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
  const databaseRelatedArticles = await getDatabaseRelatedArticles(
    currentArticle
  );

  if (databaseRelatedArticles.length > 0) {
    return databaseRelatedArticles;
  }

  return getFallbackRelatedArticles(currentArticle);
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

export default async function NewsArticlePage({ slug }) {
  const safeSlug = getSafeSlug(slug);
  const databaseArticle = await getDatabaseArticle(safeSlug);
  const article = databaseArticle || getFallbackArticle(safeSlug);
  const relatedArticles = await getRelatedArticles(article);

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <ArticleHeader />

      <ArticleDetailBackground
        article={article}
        relatedArticles={relatedArticles}
      />

      <ScrollReveal delay={100}>
        <RelatedArticles articles={relatedArticles} />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <NewsFooter />
      </ScrollReveal>
    </main>
  );
}