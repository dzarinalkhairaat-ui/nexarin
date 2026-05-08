import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminNewsWriteClient from "@/features/admin/news/write/AdminNewsWriteClient";

export const dynamic = "force-dynamic";

const statusValueMap = {
  PUBLISHED: "published",
  DRAFT: "draft",
  ARCHIVED: "draft",
};

const sourceTypeValueMap = {
  ARTICLE_WEBSITE: "artikel-website",
  YOUTUBE: "youtube",
  SOCIAL_MEDIA: "media-sosial",
  DOCUMENT_RELEASE: "dokumen-rilis",
  OTHER: "lainnya",
};

function mapNewsCategoryToWriteOption(category) {
  return {
    id: category?.id,
    name: category?.name || "Kategori",
    slug: category?.slug || "",
  };
}

function mapNewsArticleToInitialForm(article) {
  return {
    id: article?.id || "",
    title: article?.title || "",
    slug: article?.slug || "",
    summary: article?.summary || "",
    youtubeUrl: article?.youtubeUrl || "",
    sourceType: sourceTypeValueMap?.[article?.sourceType] || "artikel-website",
    sourceName: article?.sourceName || "",
    sourceUrl: article?.sourceUrl || "",
    sourceNote:
      article?.sourceNote ||
      "Artikel ini dirangkum dan dikurasi dari sumber tersebut.",
    videoSourceName: article?.videoSourceName || "",
    videoSourceUrl: article?.videoSourceUrl || "",
    content: article?.content || "",
    status: statusValueMap?.[article?.status] || "draft",
    categorySlug: article?.category?.slug || "",
    isHeadline: Boolean(article?.isHeadline),
    isFeatured: Boolean(article?.isFeatured),
    coverImageUrl: article?.coverImageUrl || "",
  };
}

async function getEditArticlePageData(slug) {
  try {
    const [categories, article] = await Promise.all([
      prisma.newsCategory.findMany({
        where: {
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          slug: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),

      prisma.newsArticle.findUnique({
        where: {
          slug,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),
    ]);

    return {
      categories: categories.map(mapNewsCategoryToWriteOption),
      article: article ? mapNewsArticleToInitialForm(article) : null,
      errorMessage: "",
    };
  } catch (error) {
    console.error("Gagal mengambil data edit artikel:", error);

    return {
      categories: [],
      article: null,
      errorMessage:
        "Data artikel belum bisa dibaca dari database. Cek koneksi Prisma, DATABASE_URL, dan tabel news_articles.",
    };
  }
}

export default async function AdminNewsEditArticlePage({ params }) {
  const resolvedParams = await params;
  const slug = String(resolvedParams?.slug || "").trim();

  if (!slug) {
    notFound();
  }

  const { categories, article, errorMessage } =
    await getEditArticlePageData(slug);

  if (!article && !errorMessage) {
    notFound();
  }

  return (
    <AdminNewsWriteClient
      categories={categories}
      errorMessage={errorMessage}
      initialArticle={article}
    />
  );
}