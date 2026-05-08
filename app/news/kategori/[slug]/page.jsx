import NewsCategoryPage from "@/features/news/NewsCategoryPage";
import { newsArticles, newsCategories } from "@/features/news/news.data";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = "https://nexarin.my.id";

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
  return Array.isArray(newsCategories) ? newsCategories : [];
}

function getFallbackArticles() {
  return Array.isArray(newsArticles) ? newsArticles : [];
}

function normalizeCategory(category, fallbackSlug = "update") {
  const slug = normalizeSlug(category?.slug || fallbackSlug);

  return {
    id: category?.id || slug,
    label:
      category?.label ||
      category?.name ||
      createLabelFromSlug(slug) ||
      "News",
    name:
      category?.name ||
      category?.label ||
      createLabelFromSlug(slug) ||
      "News",
    slug: slug || "update",
  };
}

function getFallbackCategoryBySlug(slug) {
  const cleanSlug = normalizeSlug(slug);
  const categories = getFallbackCategories();

  const matchedCategory =
    categories.find(
      (category) => normalizeSlug(category?.slug) === cleanSlug
    ) ||
    categories.find(
      (category) => normalizeSlug(category?.slug) === "update"
    );

  if (matchedCategory) {
    return normalizeCategory(matchedCategory);
  }

  return normalizeCategory(
    {
      label: createLabelFromSlug(cleanSlug || "update"),
      slug: cleanSlug || "update",
    },
    cleanSlug || "update"
  );
}

function getFallbackCategoryArticleTotal(slug) {
  const cleanSlug = normalizeSlug(slug);
  const articles = getFallbackArticles();

  if (cleanSlug === "semua") {
    return articles.length;
  }

  return articles.filter(
    (article) => normalizeSlug(article?.categorySlug) === cleanSlug
  ).length;
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

async function getDatabaseCategoryMetadata(slug) {
  const cleanSlug = normalizeSlug(slug);

  if (!cleanSlug) {
    return null;
  }

  try {
    if (cleanSlug === "semua") {
      const total = await prisma.newsArticle.count({
        where: {
          status: "PUBLISHED",
          OR: getPublicDateFilter(),
        },
      });

      return {
        category: {
          id: "semua",
          label: "Semua News",
          name: "Semua News",
          slug: "semua",
        },
        total,
      };
    }

    const category = await prisma.newsCategory.findFirst({
      where: {
        slug: cleanSlug,
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    if (!category) {
      return null;
    }

    const total = await prisma.newsArticle.count({
      where: {
        status: "PUBLISHED",
        categoryId: category.id,
        OR: getPublicDateFilter(),
      },
    });

    return {
      category: normalizeCategory(category, cleanSlug),
      total,
    };
  } catch (error) {
    console.error("Gagal mengambil metadata kategori News:", error);

    return null;
  }
}

async function getCategoryMetadata(slug) {
  const cleanSlug = normalizeSlug(slug);
  const databaseMetadata = await getDatabaseCategoryMetadata(cleanSlug);

  if (databaseMetadata?.category) {
    return databaseMetadata;
  }

  const fallbackCategory = getFallbackCategoryBySlug(cleanSlug);
  const fallbackTotal = getFallbackCategoryArticleTotal(fallbackCategory?.slug);

  return {
    category: fallbackCategory,
    total: fallbackTotal,
  };
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = normalizeSlug(resolvedParams?.slug || "update");
  const { category, total } = await getCategoryMetadata(slug);

  const categoryLabel = category?.label || "News";
  const categorySlug = category?.slug || slug || "update";

  const title = `${categoryLabel} Nexarin`;
  const description = `Kumpulan ${total || 0} artikel kategori ${categoryLabel} dari News Nexarin by-rins.`;
  const canonicalPath = `/news/kategori/${categorySlug}`;
  const url = `${SITE_URL}${canonicalPath}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${title} - Nexarin by-rins`,
      description,
      url,
      siteName: "Nexarin by-rins",
      locale: "id_ID",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - Nexarin by-rins`,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function NewsCategoryRoute({ params }) {
  const resolvedParams = await params;

  return <NewsCategoryPage slug={normalizeSlug(resolvedParams?.slug || "update")} />;
}