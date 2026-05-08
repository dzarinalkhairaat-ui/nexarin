import { prisma } from "@/lib/prisma";
import AdminNewsCategoriesClient from "@/features/admin/news/categories/AdminNewsCategoriesClient";

export const dynamic = "force-dynamic";

function mapNewsCategoryToAdmin(category) {
  return {
    id: category?.id,
    name: category?.name || "Kategori",
    slug: category?.slug || "",
    description: category?.description || "",
    isActive: Boolean(category?.isActive),
  };
}

async function getAdminNewsCategories() {
  try {
    const categories = await prisma.newsCategory.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return {
      categories: categories.map(mapNewsCategoryToAdmin),
      errorMessage: "",
    };
  } catch (error) {
    console.error("Gagal mengambil kategori News:", error);

    return {
      categories: [],
      errorMessage:
        "Database kategori belum bisa dibaca. Cek koneksi Prisma, DATABASE_URL, dan tabel news_categories.",
    };
  }
}

export default async function AdminNewsCategoriesPage() {
  const { categories, errorMessage } = await getAdminNewsCategories();

  return (
    <AdminNewsCategoriesClient
      categories={categories}
      errorMessage={errorMessage}
    />
  );
}