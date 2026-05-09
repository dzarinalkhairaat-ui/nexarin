"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/features/admin/admin.helpers";

const NEWS_IMAGE_BUCKET = "news-images";

const articleStatusMap = {
  published: "PUBLISHED",
  draft: "DRAFT",
};

const sourceTypeMap = {
  "artikel-website": "ARTICLE_WEBSITE",
  youtube: "YOUTUBE",
  "media-sosial": "SOCIAL_MEDIA",
  "dokumen-rilis": "DOCUMENT_RELEASE",
  lainnya: "OTHER",
};

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeOptionalText(value) {
  const text = normalizeText(value);
  return text ? text : null;
}

function createSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isValidCoverImageUrl(value) {
  const imageUrl = normalizeText(value);

  if (!imageUrl) {
    return true;
  }

  if (imageUrl.startsWith("/")) {
    return true;
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    try {
      new URL(imageUrl);
      return true;
    } catch {
      return false;
    }
  }

  return false;
}

function getStoragePathFromPublicUrl(publicUrl) {
  const imageUrl = normalizeText(publicUrl);

  if (!imageUrl) {
    return "";
  }

  try {
    const parsedUrl = new URL(imageUrl);
    const marker = `/storage/v1/object/public/${NEWS_IMAGE_BUCKET}/`;
    const decodedPath = decodeURIComponent(parsedUrl.pathname);
    const markerIndex = decodedPath.indexOf(marker);

    if (markerIndex === -1) {
      return "";
    }

    return decodedPath.slice(markerIndex + marker.length);
  } catch {
    return "";
  }
}

function getCoverImageProvider(coverImageUrl) {
  const imageUrl = normalizeText(coverImageUrl);

  if (!imageUrl) {
    return null;
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return getStoragePathFromPublicUrl(imageUrl) ? "SUPABASE" : "EXTERNAL";
  }

  if (imageUrl.startsWith("/")) {
    return null;
  }

  return null;
}

function getCoverImagePath(coverImageUrl, explicitPath = "") {
  const safeExplicitPath = normalizeOptionalText(explicitPath);

  if (safeExplicitPath) {
    return safeExplicitPath;
  }

  const imageUrl = normalizeText(coverImageUrl);

  if (!imageUrl) {
    return null;
  }

  const storagePath = getStoragePathFromPublicUrl(imageUrl);

  return storagePath || null;
}

function mapArticlePayload(payload) {
  const title = normalizeText(payload?.title);
  const slug = createSlug(title);
  const summary = normalizeText(payload?.summary);
  const content = normalizeText(payload?.content);
  const categorySlug = normalizeText(payload?.categorySlug);

  const status = articleStatusMap?.[payload?.status] || "DRAFT";
  const sourceType = sourceTypeMap?.[payload?.sourceType] || "ARTICLE_WEBSITE";

  const youtubeUrl = normalizeOptionalText(payload?.youtubeUrl);
  const sourceName = normalizeOptionalText(payload?.sourceName);
  const sourceUrl = normalizeOptionalText(payload?.sourceUrl);
  const sourceNote = normalizeOptionalText(payload?.sourceNote);
  const videoSourceName = normalizeOptionalText(payload?.videoSourceName);
  const videoSourceUrl = normalizeOptionalText(payload?.videoSourceUrl);
  const coverImageUrl = normalizeOptionalText(payload?.coverImageUrl);
  const coverImagePath = normalizeOptionalText(payload?.coverImagePath);

  return {
    title,
    slug,
    summary,
    content,
    categorySlug,
    status,
    sourceType,
    youtubeUrl,
    sourceName,
    sourceUrl,
    sourceNote,
    videoSourceName,
    videoSourceUrl,
    coverImageUrl,
    coverImagePath,
    isHeadline: Boolean(payload?.isHeadline),
    isFeatured: Boolean(payload?.isFeatured),
  };
}

function validateArticlePayload(articlePayload) {
  if (
    !articlePayload.title ||
    !articlePayload.summary ||
    !articlePayload.content
  ) {
    return {
      ok: false,
      message: "Judul, ringkasan, dan isi artikel wajib diisi dulu.",
    };
  }

  if (!articlePayload.slug) {
    return {
      ok: false,
      message: "Slug artikel gagal dibuat. Gunakan judul artikel yang valid.",
    };
  }

  if (!articlePayload.categorySlug) {
    return {
      ok: false,
      message: "Kategori artikel wajib dipilih dulu.",
    };
  }

  if (!isValidCoverImageUrl(articlePayload.coverImageUrl)) {
    return {
      ok: false,
      message:
        "Cover Image URL tidak valid. Gunakan URL http/https atau path lokal yang diawali /.",
    };
  }

  return {
    ok: true,
    message: "",
  };
}

async function getActiveCategoryBySlug(categorySlug) {
  const category = await prisma.newsCategory.findUnique({
    where: {
      slug: categorySlug,
    },
    select: {
      id: true,
      isActive: true,
    },
  });

  if (!category || !category.isActive) {
    return null;
  }

  return category;
}

function revalidateNewsPublicPaths(articleSlug, categorySlug) {
  revalidatePath("/news");
  revalidatePath("/news/search");
  revalidatePath("/sitemap.xml");

  if (articleSlug) {
    revalidatePath(`/news/artikel/${articleSlug}`);
  }

  if (categorySlug) {
    revalidatePath(`/news/kategori/${categorySlug}`);
  }
}

export async function createNewsArticleAction(payload) {
  const adminSession = await requireAdminSession();

  if (!adminSession.ok) {
    return adminSession;
  }

  const articlePayload = mapArticlePayload(payload);
  const validation = validateArticlePayload(articlePayload);

  if (!validation.ok) {
    return validation;
  }

  try {
    const category = await getActiveCategoryBySlug(articlePayload.categorySlug);

    if (!category) {
      return {
        ok: false,
        message:
          "Kategori yang dipilih tidak ditemukan atau sedang nonaktif. Pilih kategori lain.",
      };
    }

    const existingArticle = await prisma.newsArticle.findUnique({
      where: {
        slug: articlePayload.slug,
      },
      select: {
        id: true,
      },
    });

    if (existingArticle) {
      return {
        ok: false,
        message: `Artikel dengan slug “${articlePayload.slug}” sudah ada. Gunakan judul lain.`,
      };
    }

    const article = await prisma.newsArticle.create({
      data: {
        title: articlePayload.title,
        slug: articlePayload.slug,
        summary: articlePayload.summary,
        content: articlePayload.content,
        youtubeUrl: articlePayload.youtubeUrl,
        status: articlePayload.status,
        isHeadline: articlePayload.isHeadline,
        isFeatured: articlePayload.isFeatured,
        views: 0,
        coverImageUrl: articlePayload.coverImageUrl,
        coverImagePath: getCoverImagePath(
          articlePayload.coverImageUrl,
          articlePayload.coverImagePath
        ),
        coverImageProvider: getCoverImageProvider(articlePayload.coverImageUrl),
        coverImageAlt: articlePayload.title,
        sourceType: articlePayload.sourceType,
        sourceName: articlePayload.sourceName,
        sourceUrl: articlePayload.sourceUrl,
        sourceNote: articlePayload.sourceNote,
        videoSourceName: articlePayload.videoSourceName,
        videoSourceUrl: articlePayload.videoSourceUrl,
        categoryId: category.id,
        publishedAt: articlePayload.status === "PUBLISHED" ? new Date() : null,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
      },
    });

    revalidatePath("/admin/news/artikel");
    revalidatePath("/admin/news/tulis-artikel");
    revalidateNewsPublicPaths(article.slug, articlePayload.categorySlug);

    return {
      ok: true,
      message: `Artikel “${article.title}” berhasil disimpan ke database.`,
      article,
    };
  } catch (error) {
    console.error("Gagal menyimpan artikel News:", error);

    if (error?.code === "P2002") {
      return {
        ok: false,
        message: `Artikel dengan slug “${articlePayload.slug}” sudah ada. Gunakan judul lain.`,
      };
    }

    return {
      ok: false,
      message: "Artikel gagal disimpan. Cek koneksi database dan coba lagi.",
    };
  }
}

export async function updateNewsArticleAction(payload) {
  const adminSession = await requireAdminSession();

  if (!adminSession.ok) {
    return adminSession;
  }

  const articleId = normalizeText(payload?.id);
  const articlePayload = mapArticlePayload(payload);
  const validation = validateArticlePayload(articlePayload);

  if (!articleId) {
    return {
      ok: false,
      message: "ID artikel tidak valid.",
    };
  }

  if (!validation.ok) {
    return validation;
  }

  try {
    const currentArticle = await prisma.newsArticle.findUnique({
      where: {
        id: articleId,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        publishedAt: true,
        category: {
          select: {
            slug: true,
          },
        },
      },
    });

    if (!currentArticle) {
      return {
        ok: false,
        message: "Artikel tidak ditemukan atau sudah dihapus.",
      };
    }

    const category = await getActiveCategoryBySlug(articlePayload.categorySlug);

    if (!category) {
      return {
        ok: false,
        message:
          "Kategori yang dipilih tidak ditemukan atau sedang nonaktif. Pilih kategori lain.",
      };
    }

    const articleWithSameSlug = await prisma.newsArticle.findUnique({
      where: {
        slug: articlePayload.slug,
      },
      select: {
        id: true,
      },
    });

    if (articleWithSameSlug && articleWithSameSlug.id !== articleId) {
      return {
        ok: false,
        message: `Artikel dengan slug “${articlePayload.slug}” sudah ada. Gunakan judul lain.`,
      };
    }

    const publishedAt =
      articlePayload.status === "PUBLISHED"
        ? currentArticle.publishedAt || new Date()
        : null;

    const article = await prisma.newsArticle.update({
      where: {
        id: articleId,
      },
      data: {
        title: articlePayload.title,
        slug: articlePayload.slug,
        summary: articlePayload.summary,
        content: articlePayload.content,
        youtubeUrl: articlePayload.youtubeUrl,
        status: articlePayload.status,
        isHeadline: articlePayload.isHeadline,
        isFeatured: articlePayload.isFeatured,
        coverImageUrl: articlePayload.coverImageUrl,
        coverImagePath: getCoverImagePath(
          articlePayload.coverImageUrl,
          articlePayload.coverImagePath
        ),
        coverImageProvider: getCoverImageProvider(articlePayload.coverImageUrl),
        coverImageAlt: articlePayload.title,
        sourceType: articlePayload.sourceType,
        sourceName: articlePayload.sourceName,
        sourceUrl: articlePayload.sourceUrl,
        sourceNote: articlePayload.sourceNote,
        videoSourceName: articlePayload.videoSourceName,
        videoSourceUrl: articlePayload.videoSourceUrl,
        categoryId: category.id,
        publishedAt,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
      },
    });

    revalidatePath("/admin/news/artikel");
    revalidatePath("/admin/news/tulis-artikel");
    revalidatePath(`/admin/news/edit-artikel/${currentArticle.slug}`);
    revalidatePath(`/admin/news/edit-artikel/${article.slug}`);

    revalidateNewsPublicPaths(currentArticle.slug, currentArticle.category?.slug);
    revalidateNewsPublicPaths(article.slug, articlePayload.categorySlug);

    return {
      ok: true,
      message: `Artikel “${article.title}” berhasil diperbarui.`,
      article,
    };
  } catch (error) {
    console.error("Gagal memperbarui artikel News:", error);

    if (error?.code === "P2025") {
      return {
        ok: false,
        message: "Artikel tidak ditemukan atau sudah dihapus.",
      };
    }

    if (error?.code === "P2002") {
      return {
        ok: false,
        message: `Artikel dengan slug “${articlePayload.slug}” sudah ada. Gunakan judul lain.`,
      };
    }

    return {
      ok: false,
      message: "Artikel gagal diperbarui. Cek koneksi database dan coba lagi.",
    };
  }
}