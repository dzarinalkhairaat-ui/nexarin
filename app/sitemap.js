import { getPortfolioProjects } from "@/features/portfolio/portfolio.data";
import { productMarketplaceData } from "@/features/products/products.data";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE_URL = "https://nexarin.my.id";
const LAST_MODIFIED = new Date("2026-05-05");

function createUrl(
  path,
  priority = 0.7,
  changeFrequency = "weekly",
  lastModified = LAST_MODIFIED
) {
  return {
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  };
}

function getProducts() {
  return Array.isArray(productMarketplaceData?.products)
    ? productMarketplaceData.products
    : [];
}

function getProductCategories() {
  return Array.isArray(productMarketplaceData?.categories)
    ? productMarketplaceData.categories
    : [];
}

function getValidDate(...dates) {
  for (const date of dates) {
    if (!date) {
      continue;
    }

    const parsedDate = new Date(date);

    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }

  return LAST_MODIFIED;
}

function normalizeSlug(value) {
  return String(value || "").trim().toLowerCase();
}

function uniqueRoutes(routes) {
  const routeMap = new Map();

  routes.forEach((route) => {
    if (!route?.url) {
      return;
    }

    routeMap.set(route.url, route);
  });

  return Array.from(routeMap.values());
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

async function getDatabaseNewsArticleRoutes() {
  try {
    const articles = await prisma.newsArticle.findMany({
      where: {
        status: "PUBLISHED",
        OR: getPublicDateFilter(),
        category: {
          is: {
            isActive: true,
          },
        },
      },
      select: {
        slug: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [
        {
          publishedAt: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    return articles
      .filter((article) => normalizeSlug(article?.slug))
      .map((article) =>
        createUrl(
          `/news/artikel/${normalizeSlug(article.slug)}`,
          0.8,
          "weekly",
          getValidDate(article?.updatedAt, article?.publishedAt, article?.createdAt)
        )
      );
  } catch (error) {
    console.error("Gagal mengambil artikel News untuk sitemap:", error);

    return [];
  }
}

async function getDatabaseNewsCategoryRoutes() {
  try {
    const categories = await prisma.newsCategory.findMany({
      where: {
        isActive: true,
      },
      select: {
        slug: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return categories
      .filter((category) => {
        const slug = normalizeSlug(category?.slug);

        return slug && slug !== "semua";
      })
      .map((category) =>
        createUrl(
          `/news/kategori/${normalizeSlug(category.slug)}`,
          0.75,
          "weekly",
          getValidDate(category?.updatedAt, category?.createdAt)
        )
      );
  } catch (error) {
    console.error("Gagal mengambil kategori News untuk sitemap:", error);

    return [];
  }
}

export default async function sitemap() {
  const staticRoutes = [
    createUrl("/", 1, "weekly"),
    createUrl("/products", 0.9, "weekly"),
    createUrl("/products/semua", 0.85, "weekly"),
    createUrl("/portfolio", 0.85, "weekly"),
    createUrl("/news", 0.9, "weekly"),
    createUrl("/news/search", 0.65, "weekly"),
    createUrl("/about", 0.75, "monthly"),
    createUrl("/contact", 0.75, "monthly"),
    createUrl("/support", 0.75, "monthly"),
  ];

  const productRoutes = getProducts()
    .filter((product) => product?.slug)
    .flatMap((product) => [
      createUrl(`/products/${product.slug}`, 0.8, "weekly"),
      createUrl(`/products/checkout/${product.slug}`, 0.6, "monthly"),
    ]);

  const productCategoryRoutes = getProductCategories()
    .filter((category) => category?.slug && category.slug !== "semua")
    .map((category) =>
      createUrl(`/products/kategori/${category.slug}`, 0.75, "weekly")
    );

  const portfolioRoutes = getPortfolioProjects()
    .filter((project) => project?.slug)
    .map((project) => createUrl(`/portfolio/${project.slug}`, 0.75, "monthly"));

  const newsArticleRoutes = await getDatabaseNewsArticleRoutes();
  const newsCategoryRoutes = await getDatabaseNewsCategoryRoutes();

  return uniqueRoutes([
    ...staticRoutes,
    ...productRoutes,
    ...productCategoryRoutes,
    ...portfolioRoutes,
    ...newsArticleRoutes,
    ...newsCategoryRoutes,
  ]);
}