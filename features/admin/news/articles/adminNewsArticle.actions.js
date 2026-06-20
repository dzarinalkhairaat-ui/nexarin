"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/features/admin/admin.helpers";
import { deleteNewsCoverImageAction } from "@/features/admin/news/write/adminNewsImage.actions";

function normalizeText(value) {
  return String(value || "").trim();
}

function revalidateDeletedArticlePaths(article) {
  revalidatePath("/admin/news/artikel");
  revalidatePath("/admin/news/tulis-artikel");
  revalidatePath("/news");
  revalidatePath("/news/search");
  revalidatePath("/sitemap.xml");

  if (article?.slug) {
    revalidatePath(`/admin/news/edit-artikel/${article.slug}`);
    revalidatePath(`/news/artikel/${article.slug}`);
  }

  if (article?.category?.slug) {
    revalidatePath(`/news/kategori/${article.category.slug}`);
  }
}

export async function deleteNewsArticleAction(formData) {
  const adminSession = await requireAdminSession();

  if (!adminSession.ok) {
    console.warn("Delete artikel News ditolak:", adminSession.message);
    redirect("/admin/login?redirectedFrom=%2Fadmin%2Fnews%2Fartikel");
  }

  const articleId = normalizeText(formData?.get("articleId"));

  if (!articleId) {
    redirect("/admin/news/artikel");
  }

  try {
    const article = await prisma.newsArticle.findUnique({
      where: {
        id: articleId,
      },
      select: {
        id: true,
        slug: true,
        coverImageUrl: true,
        category: {
          select: {
            slug: true,
          },
        },
      },
    });

    if (!article) {
      redirect("/admin/news/artikel");
    }

    if (article.coverImageUrl) {
      const deleteImageResult = await deleteNewsCoverImageAction(article.coverImageUrl);
      if (!deleteImageResult.ok) {
        console.warn("Gagal menghapus gambar saat menghapus artikel:", deleteImageResult.message);
      }
    }

    await prisma.newsArticle.delete({
      where: {
        id: articleId,
      },
    });

    revalidateDeletedArticlePaths(article);
  } catch (error) {
    console.error("Gagal menghapus artikel News:", error);
  }

  redirect("/admin/news/artikel");
}

export async function updateArticleQuickAction(articleId, updateData) {
  const adminSession = await requireAdminSession();
  if (!adminSession.ok) {
    return { ok: false, message: "Akses ditolak. Sesi admin mungkin sudah habis." };
  }

  if (!articleId) return { ok: false, message: "ID Artikel kosong" };

  try {
    const article = await prisma.newsArticle.findUnique({
      where: { id: articleId },
      include: { category: true }
    });

    if (!article) return { ok: false, message: "Artikel tidak ditemukan" };

    const updatePayload = {};
    if (updateData.status !== undefined) updatePayload.status = updateData.status;
    if (updateData.categoryId !== undefined) updatePayload.categoryId = updateData.categoryId || null;
    if (updateData.isHeadline !== undefined) updatePayload.isHeadline = updateData.isHeadline;
    if (updateData.isFeatured !== undefined) updatePayload.isFeatured = updateData.isFeatured;

    // Jika dipublish, set publishedAt jika belum ada
    if (updatePayload.status === "PUBLISHED" && article.status !== "PUBLISHED") {
      updatePayload.publishedAt = new Date();
    }

    await prisma.newsArticle.update({
      where: { id: articleId },
      data: updatePayload
    });

    revalidateDeletedArticlePaths(article);
    return { ok: true, message: "Berhasil menyimpan perubahan" };
  } catch (error) {
    console.error("Gagal melakukan quick edit:", error);
    return { ok: false, message: "Gagal menyimpan ke database" };
  }
}

export async function deleteMultipleNewsArticlesAction(articleIds) {
  const adminSession = await requireAdminSession();
  if (!adminSession.ok) {
    return { ok: false, message: "Akses ditolak. Sesi admin mungkin sudah habis." };
  }

  if (!Array.isArray(articleIds) || articleIds.length === 0) {
    return { ok: false, message: "Tidak ada artikel yang dipilih." };
  }

  try {
    const articles = await prisma.newsArticle.findMany({
      where: { id: { in: articleIds } },
      select: { id: true, slug: true, coverImageUrl: true, category: { select: { slug: true } } }
    });

    for (const article of articles) {
      if (article.coverImageUrl) {
        await deleteNewsCoverImageAction(article.coverImageUrl);
      }
    }

    await prisma.newsArticle.deleteMany({
      where: { id: { in: articleIds } }
    });

    // Revalidate paths for all deleted
    for (const article of articles) {
      revalidateDeletedArticlePaths(article);
    }

    return { ok: true, message: `${articles.length} artikel berhasil dihapus.` };
  } catch (error) {
    console.error("Gagal hapus massal artikel:", error);
    return { ok: false, message: "Gagal menghapus beberapa artikel." };
  }
}

export async function updateMultipleArticlesQuickAction(articleIds, updateData) {
  const adminSession = await requireAdminSession();
  if (!adminSession.ok) {
    return { ok: false, message: "Akses ditolak. Sesi admin mungkin sudah habis." };
  }

  if (!Array.isArray(articleIds) || articleIds.length === 0) {
    return { ok: false, message: "Tidak ada artikel yang dipilih." };
  }

  try {
    const updatePayload = {};
    if (updateData.status !== undefined && updateData.status !== "") updatePayload.status = updateData.status;
    if (updateData.categoryId !== undefined && updateData.categoryId !== "") updatePayload.categoryId = updateData.categoryId === "null" ? null : updateData.categoryId;
    if (updateData.isHeadline !== undefined && updateData.isHeadline !== "") updatePayload.isHeadline = updateData.isHeadline === "true" || updateData.isHeadline === true;
    if (updateData.isFeatured !== undefined && updateData.isFeatured !== "") updatePayload.isFeatured = updateData.isFeatured === "true" || updateData.isFeatured === true;

    // Jika tidak ada data yang diupdate
    if (Object.keys(updatePayload).length === 0) {
      return { ok: true, message: "Tidak ada perubahan yang perlu disimpan." };
    }

    if (updatePayload.status === "PUBLISHED") {
      // Kita harus update publishedAt untuk yang sebelumnya bukan PUBLISHED
      // Karena updateMany tidak bisa memanipulasi logic per row, kita pisahkan manual
      const draftArticles = await prisma.newsArticle.findMany({
        where: { id: { in: articleIds }, status: { not: "PUBLISHED" } },
        select: { id: true }
      });
      
      const draftIds = draftArticles.map(a => a.id);
      
      if (draftIds.length > 0) {
        await prisma.newsArticle.updateMany({
          where: { id: { in: draftIds } },
          data: { ...updatePayload, publishedAt: new Date() }
        });
      }

      const otherIds = articleIds.filter(id => !draftIds.includes(id));
      if (otherIds.length > 0) {
        await prisma.newsArticle.updateMany({
          where: { id: { in: otherIds } },
          data: updatePayload
        });
      }
    } else {
      await prisma.newsArticle.updateMany({
        where: { id: { in: articleIds } },
        data: updatePayload
      });
    }

    // Ambil data untuk revalidate
    const articles = await prisma.newsArticle.findMany({
      where: { id: { in: articleIds } },
      select: { slug: true, category: { select: { slug: true } } }
    });

    for (const article of articles) {
      revalidateDeletedArticlePaths(article);
    }

    return { ok: true, message: `${articleIds.length} artikel berhasil diubah.` };
  } catch (error) {
    console.error("Gagal update massal artikel:", error);
    return { ok: false, message: "Gagal menyimpan perubahan." };
  }
}