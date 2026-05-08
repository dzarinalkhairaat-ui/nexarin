import ProductCategoryPage from "@/features/products/ProductCategoryPage";
import { productMarketplaceData } from "@/features/products/products.data";

export const dynamic = "force-static";
export const dynamicParams = false;

function normalizeSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function getCategories() {
  return Array.isArray(productMarketplaceData?.categories)
    ? productMarketplaceData.categories
    : [];
}

function getProducts() {
  return Array.isArray(productMarketplaceData?.products)
    ? productMarketplaceData.products
    : [];
}

function getCategoryBySlug(slug) {
  const cleanSlug = normalizeSlug(slug);
  const categories = getCategories();

  return (
    categories.find((category) => normalizeSlug(category?.slug) === cleanSlug) ||
    categories.find((category) => category?.slug === "ai-tools") || {
      label: "AI Tools",
      name: "AI Tools",
      slug: "ai-tools",
    }
  );
}

function getCategoryLabel(category) {
  return category?.label || category?.name || category?.title || "Produk";
}

function getCategoryProductTotal(category) {
  const products = getProducts();
  const categorySlug = normalizeSlug(category?.slug);
  const categoryLabel = normalizeSlug(getCategoryLabel(category));

  return products.filter((product) => {
    const productCategorySlug = normalizeSlug(product?.categorySlug);
    const productCategory = normalizeSlug(product?.category);

    return (
      productCategorySlug === categorySlug ||
      productCategory === categorySlug ||
      productCategory === categoryLabel
    );
  }).length;
}

export function generateStaticParams() {
  const categories = getCategories();

  return categories
    .filter((category) => category?.slug && category.slug !== "semua")
    .map((category) => ({
      slug: category.slug,
    }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || "ai-tools";
  const category = getCategoryBySlug(slug);
  const categoryLabel = getCategoryLabel(category);
  const total = getCategoryProductTotal(category);

  const title = `${categoryLabel} Products`;
  const description = `Kumpulan ${total} produk kategori ${categoryLabel} di Nexarin Products by-rins.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/products/kategori/${category?.slug || slug}`,
    },
    openGraph: {
      type: "website",
      title: `${title} - Nexarin by-rins`,
      description,
      url: `https://nexarin.my.id/products/kategori/${category?.slug || slug}`,
      siteName: "Nexarin by-rins",
      locale: "id_ID",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - Nexarin by-rins`,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ProductCategoryRoute({ params }) {
  const resolvedParams = await params;

  return <ProductCategoryPage slug={resolvedParams?.slug || "ai-tools"} />;
}