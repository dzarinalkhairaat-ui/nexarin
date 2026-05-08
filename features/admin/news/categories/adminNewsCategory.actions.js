"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { prisma } from "@/lib/prisma";

const ADMIN_SESSION_COOKIE = "nexarin_admin_session";
const ADMIN_SESSION_VALUE = "nexarin-admin-v2";

function normalizeText(value) {
  return String(value || "").trim();
}

function createSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
    console.error("Gagal memverifikasi session admin kategori News:", error);

    return {
      ok: false,
      message: "Sesi admin gagal diverifikasi. Login ulang lalu coba lagi.",
    };
  }
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

export async function deleteNewsCategoryAction(categoryId) {
  const adminSession = await requireAdminSession();

  if (!adminSession.ok) {
    return adminSession;
  }

  const id = normalizeText(categoryId);

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

    if (usedArticleCount > 0) {
      return {
        ok: false,
        message: `Kategori “${category.name}” masih dipakai oleh ${usedArticleCount} artikel. Hapus atau pindahkan artikelnya dulu.`,
      };
    }

    await prisma.newsCategory.delete({
      where: {
        id,
      },
    });

    revalidateNewsCategoryPaths(category.slug);

    return {
      ok: true,
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
          "Kategori masih dipakai oleh artikel. Hapus atau pindahkan artikelnya dulu.",
      };
    }

    return {
      ok: false,
      message: "Kategori gagal dihapus. Cek koneksi database dan coba lagi.",
    };
  }
}