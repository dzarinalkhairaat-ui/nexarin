import ProductDetailPage from "@/features/products/ProductDetailPage";
import { productMarketplaceData } from "@/features/products/products.data";

export const dynamic = "force-static";
export const dynamicParams = false;

function getProducts() {
  return Array.isArray(productMarketplaceData?.products)
    ? productMarketplaceData.products
    : [];
}

function getProductBySlug(slug) {
  const products = getProducts();
  return products.find((item) => item?.slug === slug) || null;
}

export function generateStaticParams() {
  const products = getProducts();

  return products
    .filter((product) => product?.slug)
    .map((product) => ({
      slug: product.slug,
    }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || "";
  const product = getProductBySlug(slug);

  const title = product?.title || "Detail Produk Nexarin";
  const description =
    product?.description ||
    "Detail produk digital Nexarin by-rins dengan data fallback awal.";
  const url = `https://nexarin.my.id/products/${slug || "preview"}`;

  return {
    title,
    description,
    alternates: {
      canonical: `/products/${slug || "preview"}`,
    },
    openGraph: {
      type: "website",
      title: `${title} - Nexarin Products`,
      description,
      url,
      siteName: "Nexarin by-rins",
      locale: "id_ID",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - Nexarin Products`,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ProductDetailRoute({ params }) {
  const resolvedParams = await params;

  return <ProductDetailPage slug={resolvedParams?.slug || ""} />;
}