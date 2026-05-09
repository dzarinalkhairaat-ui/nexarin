import ScrollReveal from "@/components/shared/ScrollReveal";
import NewsHeader from "@/features/news/components/NewsHeader";
import NewsHero from "@/features/news/components/NewsHero";
import NewsCategoryChips from "@/features/news/components/NewsCategoryChips";
import HeadlineNews from "@/features/news/components/HeadlineNews";
import LatestNews from "@/features/news/components/LatestNews";
import PopularNews from "@/features/news/components/PopularNews";
import NewsFooter from "@/features/news/components/NewsFooter";
import { prisma } from "@/lib/prisma";

const PUBLIC_NEWS_LIMIT = 12;
const DATABASE_NEWS_TAKE_LIMIT = 24;
const DEFAULT_CATEGORY_NAME = "Nexarin News";
const DEFAULT_CATEGORY_SLUG = "news";
const DEFAULT_AUTHOR_NAME = "Nexarin News";
const DEFAULT_READ_TIME = "3 menit baca";

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

  const contentPreview = getPlainText(article?.content);

  if (!contentPreview) {
    return "";
  }

  return contentPreview.length > 160
    ? `${contentPreview.slice(0, 157)}...`
    : contentPreview;
}

function normalizePublicArticle(article, index = 0) {
  const publishedDate = article?.publishedAt || article?.createdAt || "";
  const title = String(article?.title || "").trim();
  const slug = String(article?.slug || "").trim();

  return {
    id: article?.id || slug || `news-${index + 1}`,
    slug,
    title,
    category: article?.category?.name || DEFAULT_CATEGORY_NAME,
    categorySlug: article?.category?.slug || DEFAULT_CATEGORY_SLUG,
    excerpt: getSafeExcerpt(article),
    author:
      article?.sourceName ||
      article?.articleSourceName ||
      DEFAULT_AUTHOR_NAME,
    date: formatPublicArticleDate(publishedDate),
    readTime:
      normalizeReadTime(article?.readTime) || getReadTime(article?.content),
    image: article?.coverImageUrl || "",
    coverImageUrl: article?.coverImageUrl || "",
    coverImageAlt:
      article?.coverImageAlt || article?.title || "Artikel Nexarin News",
    isHeadline: Boolean(article?.isHeadline),
    isPopular: Boolean(article?.isFeatured),
    youtubeUrl: article?.youtubeUrl || "",
    articleSourceName: article?.articleSourceName || article?.sourceName || "",
    articleSourceUrl: article?.articleSourceUrl || article?.sourceUrl || "",
    sourceNote: article?.sourceNote || "",
    videoSourceName: article?.videoSourceName || "",
    videoSourceUrl: article?.videoSourceUrl || "",
    source: "database",
  };
}

function preparePublicNewsFeed(articles) {
  const safeArticles = Array.isArray(articles) ? articles : [];

  return safeArticles
    .map((article, index) => normalizePublicArticle(article, index))
    .filter((article) => article.slug && article.title)
    .slice(0, PUBLIC_NEWS_LIMIT);
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

async function getPublishedNewsArticles() {
  try {
    const articles = await prisma.newsArticle.findMany({
      where: {
        status: "PUBLISHED",
        OR: getPublicDateFilter(),
        category: {
          is: {
            isActive: true,
          },
        },
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
      take: DATABASE_NEWS_TAKE_LIMIT,
    });

    return preparePublicNewsFeed(articles);
  } catch (error) {
    console.error("Gagal mengambil artikel public News dari database:", error);

    return [];
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