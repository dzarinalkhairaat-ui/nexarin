import ScrollReveal from "@/components/shared/ScrollReveal";
import NewsCategoryHeader from "@/features/news/components/news-category/NewsCategoryHeader";
import NewsFooter from "@/features/news/components/NewsFooter";
import NewsCategoryHero from "@/features/news/components/news-category/NewsCategoryHero";
import NewsCategoryArticleList from "@/features/news/components/news-category/NewsCategoryArticleList";
import {
  newsArticles as fallbackNewsArticles,
  newsCategories as fallbackNewsCategories,
} from "@/features/news/news.data";
import { prisma } from "@/lib/prisma";

const CATEGORY_ARTICLE_LIMIT = 48;
const DEFAULT_CATEGORY_SLUG = "update";
const DEFAULT_CATEGORY_LABEL = "Update";
const DEFAULT_AUTHOR_NAME = "Nexarin by-rins";
const DEFAULT_READ_TIME = "3 min read";

function normalizeSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function createLabelFromSlug(slug) {
  const cleanSlug = normalizeSlug(slug);

  if (!cleanSlug) {
    return "News";
  }

  return cleanSlug
    .split("-")
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function getFallbackCategories() {
  return Array.isArray(fallbackNewsCategories) ? fallbackNewsCategories : [];
}

function getFallbackArticles() {
  return Array.isArray(fallbackNewsArticles) ? fallbackNewsArticles : [];
}

function normalizeCategory(category, fallbackSlug = DEFAULT_CATEGORY_SLUG) {
  const slug = normalizeSlug(category?.slug || fallbackSlug);

  return {
    id: category?.id || slug,
    label:
      category?.label ||
      category?.name ||
      createLabelFromSlug(slug) ||
      DEFAULT_CATEGORY_LABEL,
    name:
      category?.name ||
      category?.label ||
      createLabelFromSlug(slug) ||
      DEFAULT_CATEGORY_LABEL,
    slug: slug || DEFAULT_CATEGORY_SLUG,
  };
}

function ensureCategoryListHasAll(categories) {
  const safeCategories = Array.isArray(categories) ? categories : [];
  const normalizedCategories = safeCategories
    .map((category) => normalizeCategory(category))
    .filter((category) => category.slug);

  const withoutAll = normalizedCategories.filter(
    (category) => normalizeSlug(category?.slug) !== "semua"
  );

  return [
    {
      id: "semua",
      label: "Semua",
      name: "Semua",
      slug: "semua",
    },
    ...withoutAll,
  ];
}

function getFallbackCategory(slug) {
  const cleanSlug = normalizeSlug(slug);
  const categories = getFallbackCategories();

  const matchedCategory =
    categories.find(
      (category) => normalizeSlug(category?.slug) === cleanSlug
    ) ||
    categories.find(
      (category) => normalizeSlug(category?.slug) === DEFAULT_CATEGORY_SLUG
    );

  if (matchedCategory) {
    return normalizeCategory(matchedCategory);
  }

  return normalizeCategory(
    {
      label: createLabelFromSlug(cleanSlug || DEFAULT_CATEGORY_SLUG),
      slug: cleanSlug || DEFAULT_CATEGORY_SLUG,
    },
    cleanSlug || DEFAULT_CATEGORY_SLUG
  );
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

  const slug = String(article?.slug || "").trim();

  return {
    id: article?.id || slug || `category-news-${index + 1}`,
    slug,
    title: String(article?.title || "Artikel Nexarin").trim(),
    category:
      article?.category?.name ||
      article?.category ||
      article?.categoryName ||
      "News",
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
    readTime: article?.readTime || getReadTime(article?.content || article?.body),
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

async function getDatabaseCategories() {
  const categories = await prisma.newsCategory.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return categories.map((category) => normalizeCategory(category));
}

async function getDatabaseArticlesByCategory(category) {
  const cleanSlug = normalizeSlug(category?.slug);

  if (!cleanSlug) {
    return [];
  }

  const where = {
    status: "PUBLISHED",
    OR: getPublicDateFilter(),
  };

  if (cleanSlug !== "semua") {
    where.categoryId = category.id;
  }

  const articles = await prisma.newsArticle.findMany({
    where,
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
    take: CATEGORY_ARTICLE_LIMIT,
  });

  return articles
    .map(mapDatabaseArticleToPublicArticle)
    .filter((article) => article.slug && article.title);
}

async function getDatabaseCategoryPageData(slug) {
  const cleanSlug = normalizeSlug(slug || DEFAULT_CATEGORY_SLUG);

  try {
    const databaseCategories = await getDatabaseCategories();

    if (databaseCategories.length === 0) {
      return null;
    }

    const categories = ensureCategoryListHasAll(databaseCategories);

    if (cleanSlug === "semua") {
      const allCategory = {
        id: "semua",
        label: "Semua News",
        name: "Semua News",
        slug: "semua",
      };

      const articles = await getDatabaseArticlesByCategory(allCategory);

      return {
        category: allCategory,
        categories,
        articles,
      };
    }

    const currentCategory = databaseCategories.find(
      (category) => normalizeSlug(category?.slug) === cleanSlug
    );

    if (!currentCategory) {
      return null;
    }

    const articles = await getDatabaseArticlesByCategory(currentCategory);

    return {
      category: currentCategory,
      categories,
      articles,
    };
  } catch (error) {
    console.error("Gagal mengambil kategori News dari database:", error);

    return null;
  }
}

function getFallbackCategoryArticles(slug) {
  const cleanSlug = normalizeSlug(slug);
  const articles = getFallbackArticles();

  if (cleanSlug === "semua") {
    return articles
      .map(normalizePublicArticle)
      .filter((article) => article.slug && article.title);
  }

  return articles
    .filter((article) => normalizeSlug(article?.categorySlug) === cleanSlug)
    .map(normalizePublicArticle)
    .filter((article) => article.slug && article.title);
}

function getFallbackCategoryPageData(slug) {
  const category = getFallbackCategory(slug);
  const categories = ensureCategoryListHasAll(getFallbackCategories());
  const articles = getFallbackCategoryArticles(category?.slug);

  return {
    category,
    categories,
    articles,
  };
}

async function getNewsCategoryPageData(slug) {
  const databaseData = await getDatabaseCategoryPageData(slug);

  if (databaseData?.category) {
    return databaseData;
  }

  return getFallbackCategoryPageData(slug);
}

export default async function NewsCategoryPage({ slug }) {
  const { category, categories, articles } = await getNewsCategoryPageData(slug);

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <NewsCategoryHeader category={category} categories={categories} />

      <section className="relative overflow-hidden bg-slate-950">
        <div className="pointer-events-none absolute -left-24 top-16 h-80 w-80 rounded-full bg-lime-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-36 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-24 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-lime-400/10 blur-3xl" />

        <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

        <img
          src="/images/logo/nexarin-logo.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 top-20 h-72 w-72 rotate-12 object-contain opacity-[0.035] sm:h-96 sm:w-96"
          loading="lazy"
          decoding="async"
        />

        <div className="relative z-10">
          <ScrollReveal>
            <NewsCategoryHero category={category} total={articles.length} />
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <NewsCategoryArticleList category={category} articles={articles} />
          </ScrollReveal>
        </div>
      </section>

      <ScrollReveal delay={100}>
        <NewsFooter />
      </ScrollReveal>
    </main>
  );
}