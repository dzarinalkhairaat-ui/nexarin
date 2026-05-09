import NewsCategoryPage from "@/features/news/NewsCategoryPage";
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

function normalizeCategory(category, fallbackSlug = "news") {
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
    slug: slug || "news",
  };
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
          category: {
            is: {
              isActive: true,
            },
          },
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
        isRealCategory: true,
      };
    }

    const category = await prisma.newsCategory.findFirst({
      where: {
        slug: cleanSlug,
        isActive: true,
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
      isRealCategory: true,
    };
  } catch (error) {
    console.error("Gagal mengambil metadata kategori News:", error);

    return null;
  }
}

async function getCategoryMetadata(slug) {
  const cleanSlug = normalizeSlug(slug || "semua");
  const databaseMetadata = await getDatabaseCategoryMetadata(cleanSlug);

  if (databaseMetadata?.category) {
    return databaseMetadata;
  }

  return {
    category: {
      id: "kategori-tidak-ditemukan",
      label: cleanSlug ? createLabelFromSlug(cleanSlug) : "Kategori",
      name: cleanSlug ? createLabelFromSlug(cleanSlug) : "Kategori",
      slug: cleanSlug || "kategori",
    },
    total: 0,
    isRealCategory: false,
  };
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = normalizeSlug(resolvedParams?.slug || "semua");
  const { category, total, isRealCategory } = await getCategoryMetadata(slug);

  const categoryLabel = category?.label || "News";
  const categorySlug = category?.slug || slug || "semua";

  const title = isRealCategory
    ? `${categoryLabel} Nexarin`
    : "Kategori tidak ditemukan";

  const description = isRealCategory
    ? `Kumpulan ${total || 0} artikel kategori ${categoryLabel} dari News Nexarin by-rins.`
    : `Kategori ${categoryLabel} tidak ditemukan, sudah dihapus, atau sedang nonaktif.`;

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
      index: Boolean(isRealCategory),
      follow: true,
    },
  };
}

export default async function NewsCategoryRoute({ params }) {
  const resolvedParams = await params;

  return (
    <NewsCategoryPage slug={normalizeSlug(resolvedParams?.slug || "semua")} />
  );
}