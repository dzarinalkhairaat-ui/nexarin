"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/features/admin/admin.helpers";

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