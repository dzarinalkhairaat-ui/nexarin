"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function normalizeText(value) {
  return String(value || "").trim();
}

export async function deleteNewsArticleAction(formData) {
  const articleId = normalizeText(formData?.get("articleId"));

  if (!articleId) {
    redirect("/admin/news/artikel");
  }

  try {
    await prisma.newsArticle.delete({
      where: {
        id: articleId,
      },
    });

    revalidatePath("/admin/news/artikel");
    revalidatePath("/admin/news/tulis-artikel");
    revalidatePath("/news");
  } catch (error) {
    console.error("Gagal menghapus artikel News:", error);
  }

  redirect("/admin/news/artikel");
}