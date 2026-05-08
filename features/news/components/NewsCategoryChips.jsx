import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { newsCategories as fallbackNewsCategories } from "@/features/news/news.data";

const ALL_CATEGORY = {
  id: "semua",
  label: "Semua",
  name: "Semua",
  slug: "semua",
};

function normalizeSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function createLabelFromSlug(slug) {
  const cleanSlug = normalizeSlug(slug);

  if (!cleanSlug) {
    return "Kategori";
  }

  return cleanSlug
    .split("-")
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function normalizeCategory(category, index = 0) {
  const slug = normalizeSlug(category?.slug || `kategori-${index + 1}`);

  return {
    id: category?.id || slug,
    label:
      category?.label ||
      category?.name ||
      createLabelFromSlug(slug) ||
      "Kategori",
    name:
      category?.name ||
      category?.label ||
      createLabelFromSlug(slug) ||
      "Kategori",
    slug,
  };
}

function ensureAllCategory(categories) {
  const safeCategories = Array.isArray(categories) ? categories : [];
  const normalizedCategories = safeCategories
    .map((category, index) => normalizeCategory(category, index))
    .filter((category) => category.slug);

  const withoutDuplicateAll = normalizedCategories.filter(
    (category) => normalizeSlug(category?.slug) !== "semua"
  );

  return [ALL_CATEGORY, ...withoutDuplicateAll];
}

function getFallbackCategories() {
  const categories = Array.isArray(fallbackNewsCategories)
    ? fallbackNewsCategories
    : [];

  return ensureAllCategory(categories);
}

async function getDatabaseCategories() {
  try {
    const categories = await prisma.newsCategory.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return ensureAllCategory(categories);
  } catch (error) {
    console.error("Gagal mengambil kategori News chips dari database:", error);

    return [];
  }
}

async function getNewsCategories() {
  const databaseCategories = await getDatabaseCategories();

  if (databaseCategories.length > 1) {
    return databaseCategories;
  }

  return getFallbackCategories();
}

function getCategoryHref(category) {
  const slug = normalizeSlug(category?.slug || "semua");

  if (slug === "semua") {
    return "/news";
  }

  return `/news/kategori/${slug}`;
}

export default async function NewsCategoryChips() {
  const categories = await getNewsCategories();

  return (
    <section className="relative z-30 overflow-hidden border-b border-white/10 bg-slate-950/95 text-white backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.12),transparent_30%),radial-gradient(circle_at_88%_10%,rgba(6,182,212,0.08),transparent_28%)]" />

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <nav
          aria-label="Kategori News"
          className="flex snap-x gap-2 overflow-x-auto py-2 pl-10 pr-5 [scrollbar-width:none] sm:pl-12 sm:pr-6 lg:pl-14 lg:pr-8 [&::-webkit-scrollbar]:hidden"
        >
          {categories.length > 0 ? (
            categories.map((category, index) => {
              const slug = normalizeSlug(category?.slug);
              const isMain = index === 0 || slug === "semua";

              return (
                <Link
                  key={category?.id || slug || category?.label}
                  href={getCategoryHref(category)}
                  className={`snap-start whitespace-nowrap rounded-[18px] border px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 ${
                    isMain
                      ? "border-emerald-400/25 bg-emerald-400/15 text-emerald-200"
                      : "border-white/10 bg-white/[0.045] text-slate-300 hover:border-cyan-400/25 hover:bg-cyan-400/10 hover:text-cyan-100"
                  }`}
                >
                  {category?.label || category?.name || "Kategori"}
                </Link>
              );
            })
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-medium text-slate-400">
              Kategori belum tersedia.
            </div>
          )}
        </nav>
      </div>
    </section>
  );
}