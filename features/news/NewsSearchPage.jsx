import ScrollReveal from "@/components/shared/ScrollReveal";
import NewsFooter from "@/features/news/components/NewsFooter";
import SearchHeader from "@/features/news/components/search-page/SearchHeader";
import SearchHero from "@/features/news/components/search-page/SearchHero";
import SearchResults from "@/features/news/components/search-page/SearchResults";
import { newsArticles as fallbackNewsArticles } from "@/features/news/news.data";
import { prisma } from "@/lib/prisma";

const SEARCH_ARTICLE_LIMIT = 100;
const SEARCH_RESULT_LIMIT = 48;
const DEFAULT_CATEGORY_SLUG = "news";
const DEFAULT_CATEGORY_NAME = "Nexarin News";
const DEFAULT_AUTHOR_NAME = "Nexarin News";
const DEFAULT_READ_TIME = "3 menit baca";

function getSafeKeyword(value) {
  return String(value || "").trim();
}

function normalizeSearchText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function getFallbackArticles() {
  const articles = Array.isArray(fallbackNewsArticles)
    ? fallbackNewsArticles
    : [];

  return articles.filter((article) => !isInternalPreviewArticle(article));
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

function getPlainText(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/[#*_`>[\\\](){}~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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

function isInternalPreviewArticle(article) {
  const marker = [
    article?.slug,
    article?.title,
    article?.source,
    article?.category?.name,
    article?.category,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    marker.includes("fallback") ||
    marker.includes("rinsnews") ||
    marker.includes("konten-awal") ||
    marker.includes("mengadaptasi-pondasi")
  );
}

function normalizePublicArticle(article, index = 0) {
  const publishedDate =
    article?.publishedAt || article?.createdAt || article?.date || "";

  const slug = String(article?.slug || "").trim();
  const title = String(article?.title || "Artikel Nexarin").trim();

  return {
    id: article?.id || slug || `search-news-${index + 1}`,
    slug,
    title,
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
    readTime:
      normalizeReadTime(article?.readTime) ||
      getReadTime(article?.content || article?.body),
    image: article?.coverImageUrl || article?.image || "",
    isHeadline: Boolean(article?.isHeadline),
    isPopular: Boolean(article?.isPopular || article?.isFeatured),
    youtubeUrl: article?.youtubeUrl || "",
    articleSourceName:
      article?.articleSourceName || article?.sourceName || "",
    articleSourceUrl:
      article?.articleSourceUrl || article?.sourceUrl || "",
    sourceNote: article?.sourceNote || "",
    videoSourceName: article?.videoSourceName || "",
    videoSourceUrl: article?.videoSourceUrl || "",
    source: article?.source === "database" ? "database" : "preview",
    searchContent: getPlainText(
      [
        article?.title,
        article?.summary,
        article?.excerpt,
        article?.content,
        article?.body,
        article?.category?.name,
        article?.category,
        article?.categoryName,
        article?.sourceName,
        article?.author,
      ].join(" ")
    ),
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
      sourceName: article?.sourceName,
      sourceUrl: article?.sourceUrl,
      sourceNote: article?.sourceNote,
      videoSourceName: article?.videoSourceName,
      videoSourceUrl: article?.videoSourceUrl,
      youtubeUrl: article?.youtubeUrl,
      coverImageUrl: article?.coverImageUrl,
      isHeadline: article?.isHeadline,
      isFeatured: article?.isFeatured,
      publishedAt: article?.publishedAt,
      createdAt: article?.createdAt,
      source: "database",
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

function filterArticlesByKeyword(articles, keyword) {
  const safeArticles = Array.isArray(articles) ? articles : [];
  const query = normalizeSearchText(keyword);

  const normalizedArticles = safeArticles
    .filter((article) => !isInternalPreviewArticle(article))
    .map((article, index) => normalizePublicArticle(article, index))
    .filter((article) => article.slug && article.title);

  if (!query) {
    return normalizedArticles.slice(0, SEARCH_RESULT_LIMIT);
  }

  return normalizedArticles
    .filter((article) => {
      const searchableText = normalizeSearchText(article.searchContent);

      return searchableText.includes(query);
    })
    .slice(0, SEARCH_RESULT_LIMIT);
}

async function getDatabaseSearchResults(keyword) {
  try {
    const articles = await prisma.newsArticle.findMany({
      where: {
        status: "PUBLISHED",
        OR: getPublicDateFilter(),
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true,
            isActive: true,
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
      take: SEARCH_ARTICLE_LIMIT,
    });

    return filterArticlesByKeyword(
      articles
        .filter((article) => article?.category?.isActive !== false)
        .map(mapDatabaseArticleToPublicArticle),
      keyword
    );
  } catch (error) {
    console.error("Gagal mencari artikel News dari database:", error);

    return null;
  }
}

function getFallbackSearchResults(keyword) {
  return filterArticlesByKeyword(getFallbackArticles(), keyword);
}

async function getSearchResults(keyword) {
  const databaseResults = await getDatabaseSearchResults(keyword);

  if (Array.isArray(databaseResults)) {
    return databaseResults;
  }

  return getFallbackSearchResults(keyword);
}

function SearchPageBackground({ keyword, results }) {
  const safeResults = Array.isArray(results) ? results : [];

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-[30rem] h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/[0.055] blur-3xl" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

      <img
        src="/images/logo/nexarin-logo.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 top-16 h-72 w-72 rotate-12 object-contain opacity-[0.035] sm:h-96 sm:w-96"
        loading="lazy"
        decoding="async"
      />

      <div className="pointer-events-none absolute inset-x-0 top-[18rem] h-64 bg-gradient-to-b from-transparent via-cyan-400/[0.045] to-transparent" />

      <div className="relative z-10">
        <ScrollReveal>
          <SearchHero keyword={keyword} total={safeResults.length} />
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <SearchResults keyword={keyword} results={safeResults} />
        </ScrollReveal>
      </div>
    </section>
  );
}

export default async function NewsSearchPage({ keyword = "" }) {
  const safeKeyword = getSafeKeyword(keyword);
  const results = await getSearchResults(safeKeyword);

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <SearchHeader />

      <SearchPageBackground keyword={safeKeyword} results={results} />

      <ScrollReveal delay={100}>
        <NewsFooter />
      </ScrollReveal>
    </main>
  );
}