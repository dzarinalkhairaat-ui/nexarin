"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/features/admin/admin.helpers";

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeBoolean(value) {
  return value === true || value === "true" || value === 1 || value === "1";
}

function createSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getDeleteCategoryPayload(payload) {
  if (typeof payload === "string") {
    return {
      id: normalizeText(payload),
      forceDeleteArticles: false,
    };
  }

  return {
    id: normalizeText(payload?.categoryId || payload?.id),
    forceDeleteArticles: normalizeBoolean(payload?.forceDeleteArticles),
  };
}

function revalidateNewsCategoryPaths(categorySlug) {
  revalidatePath("/admin/news/kategori");
  revalidatePath("/admin/news/tulis-artikel");
  revalidatePath("/admin/news/artikel");
  revalidatePath("/news");
  revalidatePath("/news/search");
  revalidatePath("/sitemap.xml");

  if (categorySlug) {
    revalidatePath(`/news/kategori/${categorySlug}`);
  }
}

export async function createNewsCategoryAction(payload) {
  const adminSession = await requireAdminSession();

  if (!adminSession.ok) {
    return adminSession;
  }

  const name = normalizeText(payload?.name);
  const description = normalizeText(payload?.description);
  const slug = createSlug(name);

  if (!name || !description) {
    return {
      ok: false,
      message: "Nama kategori dan deskripsi wajib diisi dulu.",
    };
  }

  if (!slug) {
    return {
      ok: false,
      message: "Slug kategori gagal dibuat. Gunakan nama kategori yang valid.",
    };
  }

  try {
    const existingCategory = await prisma.newsCategory.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    });

    if (existingCategory) {
      return {
        ok: false,
        message: `Kategori dengan slug “${slug}” sudah ada. Gunakan nama kategori lain.`,
      };
    }

    const category = await prisma.newsCategory.create({
      data: {
        name,
        slug,
        description,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    revalidateNewsCategoryPaths(category.slug);

    return {
      ok: true,
      message: `Kategori “${category.name}” berhasil disimpan ke database.`,
      category,
    };
  } catch (error) {
    console.error("Gagal menyimpan kategori News:", error);

    if (error?.code === "P2002") {
      return {
        ok: false,
        message: `Kategori dengan slug “${slug}” sudah ada. Gunakan nama kategori lain.`,
      };
    }

    return {
      ok: false,
      message: "Kategori gagal disimpan. Cek koneksi database dan coba lagi.",
    };
  }
}

export async function updateNewsCategoryAction(payload) {
  const adminSession = await requireAdminSession();

  if (!adminSession.ok) {
    return adminSession;
  }

  const id = normalizeText(payload?.id);
  const name = normalizeText(payload?.name);
  const description = normalizeText(payload?.description);
  const slug = createSlug(name);

  if (!id) {
    return {
      ok: false,
      message: "ID kategori tidak valid.",
    };
  }

  if (!name || !description) {
    return {
      ok: false,
      message: "Nama kategori dan deskripsi wajib diisi dulu.",
    };
  }

  if (!slug) {
    return {
      ok: false,
      message: "Slug kategori gagal dibuat. Gunakan nama kategori yang valid.",
    };
  }

  try {
    const currentCategory = await prisma.newsCategory.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    if (!currentCategory) {
      return {
        ok: false,
        message: "Kategori tidak ditemukan atau sudah dihapus.",
      };
    }

    const categoryWithSameSlug = await prisma.newsCategory.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    });

    if (categoryWithSameSlug && categoryWithSameSlug.id !== id) {
      return {
        ok: false,
        message: `Kategori dengan slug “${slug}” sudah ada. Gunakan nama kategori lain.`,
      };
    }

    const category = await prisma.newsCategory.update({
      where: {
        id,
      },
      data: {
        name,
        slug,
        description,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    revalidateNewsCategoryPaths(currentCategory.slug);
    revalidateNewsCategoryPaths(category.slug);

    return {
      ok: true,
      message: `Kategori “${category.name}” berhasil diperbarui.`,
      category,
    };
  } catch (error) {
    console.error("Gagal memperbarui kategori News:", error);

    if (error?.code === "P2025") {
      return {
        ok: false,
        message: "Kategori tidak ditemukan atau sudah dihapus.",
      };
    }

    if (error?.code === "P2002") {
      return {
        ok: false,
        message: `Kategori dengan slug “${slug}” sudah ada. Gunakan nama kategori lain.`,
      };
    }

    return {
      ok: false,
      message: "Kategori gagal diperbarui. Cek koneksi database dan coba lagi.",
    };
  }
}

export async function deleteNewsCategoryAction(payload) {
  const adminSession = await requireAdminSession();

  if (!adminSession.ok) {
    return adminSession;
  }

  const { id, forceDeleteArticles } = getDeleteCategoryPayload(payload);

  if (!id) {
    return {
      ok: false,
      message: "ID kategori tidak valid.",
    };
  }

  try {
    const category = await prisma.newsCategory.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    if (!category) {
      return {
        ok: false,
        message: "Kategori tidak ditemukan atau sudah dihapus.",
      };
    }

    const usedArticleCount = await prisma.newsArticle.count({
      where: {
        categoryId: id,
      },
    });

    if (usedArticleCount > 0 && !forceDeleteArticles) {
      return {
        ok: false,
        needsConfirmation: true,
        categoryId: category.id,
        categoryName: category.name,
        articleCount: usedArticleCount,
        message: `Kategori “${category.name}” masih dipakai oleh ${usedArticleCount} artikel. Jika dilanjutkan, kategori dan semua artikel di dalamnya akan dihapus permanen.`,
      };
    }

    const deleteResult = await prisma.$transaction(async (tx) => {
      const deletedArticles = await tx.newsArticle.deleteMany({
        where: {
          categoryId: id,
        },
      });

      await tx.newsCategory.delete({
        where: {
          id,
        },
      });

      return {
        deletedArticleCount: deletedArticles.count,
      };
    });

    revalidateNewsCategoryPaths(category.slug);

    if (deleteResult.deletedArticleCount > 0) {
      return {
        ok: true,
        deletedArticleCount: deleteResult.deletedArticleCount,
        message: `Kategori “${category.name}” dan ${deleteResult.deletedArticleCount} artikel di dalamnya berhasil dihapus permanen dari database.`,
      };
    }

    return {
      ok: true,
      deletedArticleCount: 0,
      message: `Kategori “${category.name}” berhasil dihapus dari database.`,
    };
  } catch (error) {
    console.error("Gagal menghapus kategori News:", error);

    if (error?.code === "P2025") {
      return {
        ok: false,
        message: "Kategori tidak ditemukan atau sudah dihapus.",
      };
    }

    if (error?.code === "P2003") {
      return {
        ok: false,
        message:
          "Kategori masih dipakai oleh data lain. Cek artikel terkait lalu coba lagi.",
      };
    }

    return {
      ok: false,
      message: "Kategori gagal dihapus. Cek koneksi database dan coba lagi.",
    };
  }
}