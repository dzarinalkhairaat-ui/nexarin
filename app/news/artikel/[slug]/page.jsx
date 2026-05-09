import NewsArticlePage from "@/features/news/NewsArticlePage";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_TITLE = "Artikel Nexarin News";
const NOT_FOUND_TITLE = "Artikel tidak ditemukan";
const DEFAULT_DESCRIPTION =
  "Artikel News Nexarin by-rins dengan data aman dan mobile-first.";
const NOT_FOUND_DESCRIPTION =
  "Artikel yang dicari tidak ditemukan atau belum tersedia di News Nexarin.";
const DEFAULT_AUTHOR = "Nexarin by-rins";
const SITE_URL = "https://nexarin.my.id";

function getSafeSlug(value) {
  return String(value || "").trim();
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

async function getDatabaseArticleBySlug(slug) {
  const safeSlug = getSafeSlug(slug);

  if (!safeSlug) {
    return null;
  }

  try {
    return await prisma.newsArticle.findFirst({
      where: {
        slug: safeSlug,
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
    });
  } catch (error) {
    console.error("Gagal mengambil metadata artikel News:", error);

    return null;
  }
}

function getIsoDate(value) {
  if (!value) {
    return undefined;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return undefined;
  }

  return parsedDate.toISOString();
}

function getAbsoluteImageUrl(value) {
  const imageUrl = String(value || "").trim();

  if (!imageUrl) {
    return "";
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/")) {
    return `${SITE_URL}${imageUrl}`;
  }

  return "";
}

function mapDatabaseArticleForMetadata(article) {
  if (!article) {
    return null;
  }

  const publishedDate = article?.publishedAt || article?.createdAt;
  const imageUrl = getAbsoluteImageUrl(article?.coverImageUrl);

  return {
    slug: article?.slug || "",
    title: article?.title || DEFAULT_TITLE,
    description: article?.summary || DEFAULT_DESCRIPTION,
    author: article?.sourceName || DEFAULT_AUTHOR,
    publishedTime: getIsoDate(publishedDate),
    modifiedTime: getIsoDate(article?.updatedAt),
    section: article?.category?.name || "News",
    imageUrl,
  };
}

async function getArticleMetadata(slug) {
  const databaseArticle = await getDatabaseArticleBySlug(slug);

  return mapDatabaseArticleForMetadata(databaseArticle);
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = getSafeSlug(resolvedParams?.slug);
  const article = await getArticleMetadata(slug);

  const isRealArticle = Boolean(article?.slug && article.slug === slug);
  const title = article?.title || NOT_FOUND_TITLE;
  const description = article?.description || NOT_FOUND_DESCRIPTION;
  const canonicalPath = slug ? `/news/artikel/${slug}` : "/news";
  const url = `${SITE_URL}${canonicalPath}`;

  const openGraph = {
    type: "article",
    title: `${title} - Nexarin News`,
    description,
    url,
    siteName: "Nexarin by-rins",
    locale: "id_ID",
    authors: [article?.author || DEFAULT_AUTHOR],
    section: article?.section || "News",
  };

  if (article?.publishedTime) {
    openGraph.publishedTime = article.publishedTime;
  }

  if (article?.modifiedTime) {
    openGraph.modifiedTime = article.modifiedTime;
  }

  if (article?.imageUrl) {
    openGraph.images = [
      {
        url: article.imageUrl,
        width: 1200,
        height: 630,
        alt: title,
      },
    ];
  }

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: `${title} - Nexarin News`,
      description,
      images: article?.imageUrl ? [article.imageUrl] : undefined,
    },
    robots: {
      index: isRealArticle,
      follow: true,
    },
  };
}

export default async function NewsArticleRoute({ params }) {
  const resolvedParams = await params;

  return <NewsArticlePage slug={getSafeSlug(resolvedParams?.slug)} />;
}