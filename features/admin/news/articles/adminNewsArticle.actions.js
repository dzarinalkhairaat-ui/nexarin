"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { prisma } from "@/lib/prisma";

const ADMIN_SESSION_COOKIE = "nexarin_admin_session";
const ADMIN_SESSION_VALUE = "nexarin-admin-v2";

function normalizeText(value) {
  return String(value || "").trim();
}

function getSupabaseAnonKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    ""
  );
}

function getAllowedAdminEmails() {
  return String(
    process.env.NEXARIN_ADMIN_EMAILS ||
      process.env.NEXARIN_ADMIN_EMAIL ||
      process.env.ADMIN_EMAIL ||
      ""
  )
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function isAllowedAdminUser(user) {
  const allowedEmails = getAllowedAdminEmails();

  if (!allowedEmails.length) {
    return true;
  }

  const userEmail = String(user?.email || "").trim().toLowerCase();

  return allowedEmails.includes(userEmail);
}

async function requireAdminSession() {
  try {
    const cookieStore = await cookies();
    const adminSessionValue =
      cookieStore.get(ADMIN_SESSION_COOKIE)?.value || "";

    if (adminSessionValue !== ADMIN_SESSION_VALUE) {
      return {
        ok: false,
        message: "Sesi admin tidak valid atau sudah habis. Login ulang dulu.",
      };
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = getSupabaseAnonKey();

    if (!supabaseUrl || !supabaseAnonKey) {
      return {
        ok: false,
        message:
          "Konfigurasi Supabase server belum lengkap. Cek environment variable Supabase.",
      };
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Aman diabaikan kalau cookie tidak bisa diset dari context tertentu.
          }
        },
      },
    });

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return {
        ok: false,
        message: "Sesi Supabase admin tidak ditemukan. Login ulang dulu.",
      };
    }

    if (!isAllowedAdminUser(user)) {
      return {
        ok: false,
        message: "Akun ini tidak punya akses admin Nexarin.",
      };
    }

    return {
      ok: true,
      user,
    };
  } catch (error) {
    console.error("Gagal memverifikasi session admin delete artikel:", error);

    return {
      ok: false,
      message: "Sesi admin gagal diverifikasi. Login ulang lalu coba lagi.",
    };
  }
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