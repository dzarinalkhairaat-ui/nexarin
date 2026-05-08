import ScrollReveal from "@/components/shared/ScrollReveal";
import NewsHeader from "@/features/news/components/NewsHeader";
import NewsHero from "@/features/news/components/NewsHero";
import NewsCategoryChips from "@/features/news/components/NewsCategoryChips";
import HeadlineNews from "@/features/news/components/HeadlineNews";
import LatestNews from "@/features/news/components/LatestNews";
import PopularNews from "@/features/news/components/PopularNews";
import NewsFooter from "@/features/news/components/NewsFooter";
import { prisma } from "@/lib/prisma";
import { newsArticles as fallbackNewsArticles } from "@/features/news/news.data";

const PUBLIC_NEWS_LIMIT = 12;
const DATABASE_NEWS_TAKE_LIMIT = 24;
const DEFAULT_CATEGORY_NAME = "News";
const DEFAULT_AUTHOR_NAME = "Nexarin by-rins";
const DEFAULT_READ_TIME = "3 min read";

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

  const contentPreview = getPlainText(article?.content);

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

  const title = String(article?.title || "Artikel Nexarin").trim();
  const slug = String(article?.slug || "").trim();

  return {
    id: article?.id || slug || `news-${index + 1}`,
    slug,
    title,
    category:
      article?.category?.name ||
      article?.category ||
      article?.categoryName ||
      DEFAULT_CATEGORY_NAME,
    categorySlug:
      article?.category?.slug || article?.categorySlug || "news",
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
    readTime: article?.readTime || getReadTime(article?.content),
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
    source: article?.source || "fallback",
  };
}

function preparePublicNewsFeed(articles) {
  const safeArticles = Array.isArray(articles) ? articles : [];

  const normalizedArticles = safeArticles
    .map((article, index) => normalizePublicArticle(article, index))
    .filter((article) => article.slug && article.title)
    .slice(0, PUBLIC_NEWS_LIMIT);

  if (normalizedArticles.length === 0) {
    return [];
  }

  const hasHeadline = normalizedArticles.some((article) => article.isHeadline);
  const hasPopular = normalizedArticles.some((article) => article.isPopular);

  return normalizedArticles.map((article, index) => ({
    ...article,
    isHeadline: hasHeadline ? article.isHeadline : index === 0,
    isPopular: hasPopular ? article.isPopular : index > 0 && index <= 4,
  }));
}

function getFallbackNewsFeed() {
  const fallbackFeed = preparePublicNewsFeed(fallbackNewsArticles);

  return fallbackFeed.length > 0 ? fallbackFeed : [];
}

function mapDatabaseArticleToPublicArticle(article) {
  return {
    id: article?.id,
    slug: article?.slug || "",
    title: article?.title || "Artikel Nexarin",
    category: article?.category?.name || DEFAULT_CATEGORY_NAME,
    categorySlug: article?.category?.slug || "news",
    summary: article?.summary || "",
    content: article?.content || "",
    author: article?.sourceName || DEFAULT_AUTHOR_NAME,
    publishedAt: article?.publishedAt,
    createdAt: article?.createdAt,
    coverImageUrl: article?.coverImageUrl || "",
    isHeadline: Boolean(article?.isHeadline),
    isFeatured: Boolean(article?.isFeatured),
    youtubeUrl: article?.youtubeUrl || "",
    sourceName: article?.sourceName || "",
    sourceUrl: article?.sourceUrl || "",
    sourceNote: article?.sourceNote || "",
    videoSourceName: article?.videoSourceName || "",
    videoSourceUrl: article?.videoSourceUrl || "",
    source: "database",
  };
}

async function getPublishedNewsArticles() {
  try {
    const now = new Date();

    const articles = await prisma.newsArticle.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          {
            publishedAt: null,
          },
          {
            publishedAt: {
              lte: now,
            },
          },
        ],
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
      take: DATABASE_NEWS_TAKE_LIMIT,
    });

    const databaseFeed = preparePublicNewsFeed(
      articles.map(mapDatabaseArticleToPublicArticle)
    );

    return databaseFeed.length > 0 ? databaseFeed : getFallbackNewsFeed();
  } catch (error) {
    console.error("Gagal mengambil artikel public News:", error);

    return getFallbackNewsFeed();
  }
}

export default async function NewsPage() {
  const articles = await getPublishedNewsArticles();

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <NewsHeader />

      <NewsCategoryChips />

      <ScrollReveal>
        <NewsHero articles={articles} />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <HeadlineNews articles={articles} />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <LatestNews articles={articles} />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <PopularNews articles={articles} />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <NewsFooter />
      </ScrollReveal>
    </main>
  );
}