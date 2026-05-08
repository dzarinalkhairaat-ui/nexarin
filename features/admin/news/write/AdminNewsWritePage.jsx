import { prisma } from "@/lib/prisma";
import AdminNewsWriteClient from "@/features/admin/news/write/AdminNewsWriteClient";

export const dynamic = "force-dynamic";

function mapNewsCategoryToWriteOption(category) {
  return {
    id: category?.id,
    name: category?.name || "Kategori",
    slug: category?.slug || "",
  };
}

async function getWritePageCategories() {
  try {
    const categories = await prisma.newsCategory.findMany({
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
    });

    return {
      categories: categories.map(mapNewsCategoryToWriteOption),
      errorMessage: "",
    };
  } catch (error) {
    console.error("Gagal mengambil kategori untuk form artikel:", error);

    return {
      categories: [],
      errorMessage:
        "Kategori belum bisa dibaca dari database. Cek koneksi Prisma, DATABASE_URL, dan tabel news_categories.",
    };
  }
}

export default async function AdminNewsWritePage() {
  const { categories, errorMessage } = await getWritePageCategories();

  return (
    <AdminNewsWriteClient
      categories={categories}
      errorMessage={errorMessage}
    />
  );
}