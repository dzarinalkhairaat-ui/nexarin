import Link from "next/link";
import ScrollReveal from "@/components/shared/ScrollReveal";
import NewsCategoryHeader from "@/features/news/components/news-category/NewsCategoryHeader";
import NewsFooter from "@/features/news/components/NewsFooter";
import NewsCategoryHero from "@/features/news/components/news-category/NewsCategoryHero";
import NewsCategoryArticleList from "@/features/news/components/news-category/NewsCategoryArticleList";
import { prisma } from "@/lib/prisma";

const CATEGORY_ARTICLE_LIMIT = 48;
const DEFAULT_AUTHOR_NAME = "Nexarin by-rins";
const DEFAULT_READ_TIME = "3 menit baca";

function normalizeSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function createLabelFromSlug(slug) {
  const cleanSlug = normalizeSlug(slug);

  if (!cleanSlug) {
    return "News";
  }

  return cleanSlug
    .split("-")
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function createAllCategory() {
  return {
    id: "semua",
    label: "Semua News",
    name: "Semua News",
    slug: "semua",
  };
}

function createNotFoundCategory(slug) {
  const safeSlug = normalizeSlug(slug);

  return {
    id: "kategori-tidak-ditemukan",
    label: safeSlug ? createLabelFromSlug(safeSlug) : "Kategori",
    name: safeSlug ? createLabelFromSlug(safeSlug) : "Kategori",
    slug: safeSlug || "kategori",
  };
}

function normalizeCategory(category) {
  const slug = normalizeSlug(category?.slug);

  return {
    id: category?.id || slug,
    label: category?.label || category?.name || createLabelFromSlug(slug),
    name: category?.name || category?.label || createLabelFromSlug(slug),
    slug,
  };
}

function ensureCategoryListHasAll(categories) {
  const safeCategories = Array.isArray(categories) ? categories : [];

  const normalizedCategories = safeCategories
    .map((category) => normalizeCategory(category))
    .filter((category) => category.slug)
    .filter((category) => normalizeSlug(category.slug) !== "semua");

  return [createAllCategory(), ...normalizedCategories];
}

function formatPublicArticleDate(date) {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function getPlainText(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/[#*_`>[\\\](){}~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeReadTime(value) {
  const text = String(value || "").trim();

  if (!text) {
    return "";
  }

  return text
    .replace(/(\d+)\s*min\s*read/gi, "$1 menit baca")
    .replace(/(\d+)\s*minutes?\s*read/gi, "$1 menit baca")
    .replace(/(\d+)\s*mins?\s*read/gi, "$1 menit baca");
}

function getReadTime(content) {
  const text = getPlainText(content);

  if (!text) {
    return DEFAULT_READ_TIME;
  }

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));

  return `${minutes} menit baca`;
}

function getSafeExcerpt(article) {
  const summary = getPlainText(article?.summary || article?.excerpt);

  if (summary) {
    return summary;
  }

  const contentPreview = getPlainText(article?.content || article?.body);

  if (!contentPreview) {
    return "";
  }

  return contentPreview.length > 160
    ? `${contentPreview.slice(0, 157)}...`
    : contentPreview;
}

function normalizePublicArticle(article, index = 0) {
  const publishedDate = article?.publishedAt || article?.createdAt || "";
  const slug = String(article?.slug || "").trim();
  const title = String(article?.title || "").trim();

  return {
    id: article?.id || slug || `category-news-${index + 1}`,
    slug,
    title,
    category: article?.category?.name || "News",
    categorySlug: article?.category?.slug || "",
    excerpt: getSafeExcerpt(article),
    author: article?.sourceName || article?.articleSourceName || DEFAULT_AUTHOR_NAME,
    date: formatPublicArticleDate(publishedDate),
    readTime: normalizeReadTime(article?.readTime) || getReadTime(article?.content || article?.body),
    image: article?.coverImageUrl || "",
    coverImageUrl: article?.coverImageUrl || "",
    coverImageAlt: article?.coverImageAlt || title || "Artikel Nexarin News",
    isHeadline: Boolean(article?.isHeadline),
    isPopular: Boolean(article?.isPopular || article?.isFeatured),
    youtubeUrl: article?.youtubeUrl || "",
    articleSourceName: article?.articleSourceName || article?.sourceName || "",
    articleSourceUrl: article?.articleSourceUrl || article?.sourceUrl || "",
    sourceNote: article?.sourceNote || "",
    videoSourceName: article?.videoSourceName || "",
    videoSourceUrl: article?.videoSourceUrl || "",
    source: "database",
  };
}

function mapDatabaseArticleToPublicArticle(article, index = 0) {
  return normalizePublicArticle(
    {
      id: article?.id,
      slug: article?.slug,
      title: article?.title,
      summary: article?.summary,
      content: article?.content,
      category: article?.category,
      sourceName: article?.sourceName,
      sourceUrl: article?.sourceUrl,
      sourceNote: article?.sourceNote,
      videoSourceName: article?.videoSourceName,
      videoSourceUrl: article?.videoSourceUrl,
      youtubeUrl: article?.youtubeUrl,
      coverImageUrl: article?.coverImageUrl,
      coverImageAlt: article?.coverImageAlt,
      isHeadline: article?.isHeadline,
      isFeatured: article?.isFeatured,
      publishedAt: article?.publishedAt,
      createdAt: article?.createdAt,
    },
    index
  );
}

function getPublicDateFilter() {
  const now = new Date();

  return [
    {
      publishedAt: null,
    },
    {
      publishedAt: {
        lte: now,
      },
    },
  ];
}

async function getDatabaseCategories() {
  const categories = await prisma.newsCategory.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return categories
    .map((category) => normalizeCategory(category))
    .filter((category) => category.slug);
}

async function getDatabaseArticlesByCategory(category) {
  const cleanSlug = normalizeSlug(category?.slug);

  if (!cleanSlug) {
    return [];
  }

  const where = {
    status: "PUBLISHED",
    OR: getPublicDateFilter(),
    category: {
      is: {
        isActive: true,
      },
    },
  };

  if (cleanSlug !== "semua") {
    where.categoryId = category.id;
  }

  const articles = await prisma.newsArticle.findMany({
    where,
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
    orderBy: [
      {
        publishedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
    take: CATEGORY_ARTICLE_LIMIT,
  });

  return articles
    .map(mapDatabaseArticleToPublicArticle)
    .filter((article) => article.slug && article.title);
}

async function getNewsCategoryPageData(slug) {
  const cleanSlug = normalizeSlug(slug || "semua");

  try {
    const databaseCategories = await getDatabaseCategories();
    const categories = ensureCategoryListHasAll(databaseCategories);

    if (cleanSlug === "semua") {
      const allCategory = createAllCategory();
      const articles = await getDatabaseArticlesByCategory(allCategory);

      return {
        category: allCategory,
        categories,
        articles,
        notFound: false,
      };
    }

    const currentCategory = databaseCategories.find(
      (category) => normalizeSlug(category?.slug) === cleanSlug
    );

    if (!currentCategory) {
      return {
        category: createNotFoundCategory(cleanSlug),
        categories,
        articles: [],
        notFound: true,
      };
    }

    const articles = await getDatabaseArticlesByCategory(currentCategory);

    return {
      category: currentCategory,
      categories,
      articles,
      notFound: false,
    };
  } catch (error) {
    console.error("Gagal mengambil kategori News dari database:", error);

    return {
      category: createNotFoundCategory(cleanSlug),
      categories: [createAllCategory()],
      articles: [],
      notFound: true,
    };
  }
}

function CategoryNotFoundSection({ category }) {
  return (
    <section className="relative px-5 pb-10 pt-4 text-white sm:px-6 sm:pb-12 lg:px-8">
      <div className="relative z-10 mx-auto w-full max-w-3xl">
        <div className="overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.045] p-6 text-center shadow-2xl shadow-black/25 backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-3 shadow-xl shadow-cyan-400/10">
            <img
              src="/images/logo/nexarin-logo.png"
              alt=""
              aria-hidden="true"
              className="h-full w-full object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>

          <p className="mx-auto mt-6 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-cyan-300">
            Kategori
          </p>

          <h2 className="mx-auto mt-5 max-w-2xl text-[2.1rem] font-black leading-[0.95] tracking-[-0.065em] text-white sm:text-5xl">
            Kategori tidak ditemukan.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm font-medium leading-7 text-slate-300 sm:text-base sm:leading-8">
            Kategori “{category?.name || "ini"}” tidak ada di database, sudah
            dihapus, atau sedang nonaktif.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/news"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/10 transition hover:-translate-y-0.5 hover:bg-emerald-300 sm:w-auto"
            >
              Kembali ke News
            </Link>

            <Link
              href="/news/search"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:border-cyan-400/25 hover:bg-cyan-400/10 sm:w-auto"
            >
              Cari Artikel
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function NewsCategoryPage({ slug }) {
  const { category, categories, articles, notFound } =
    await getNewsCategoryPageData(slug);

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <NewsCategoryHeader category={category} categories={categories} />

      <section className="relative overflow-hidden bg-slate-950">
        <div className="pointer-events-none absolute -left-24 top-16 h-80 w-80 rounded-full bg-lime-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-36 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-24 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-lime-400/10 blur-3xl" />

        <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

        <img
          src="/images/logo/nexarin-logo.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 top-20 h-72 w-72 rotate-12 object-contain opacity-[0.035] sm:h-96 sm:w-96"
          loading="lazy"
          decoding="async"
        />

        <div className="relative z-10">
          {notFound ? (
            <ScrollReveal>
              <CategoryNotFoundSection category={category} />
            </ScrollReveal>
          ) : (
            <>
              <ScrollReveal>
                <NewsCategoryHero category={category} total={articles.length} />
              </ScrollReveal>

              <ScrollReveal delay={80}>
                <NewsCategoryArticleList
                  category={category}
                  articles={articles}
                />
              </ScrollReveal>
            </>
          )}
        </div>
      </section>

      <ScrollReveal delay={100}>
        <NewsFooter />
      </ScrollReveal>
    </main>
  );
}