import ProductCheckoutPage from "@/features/products/ProductCheckoutPage";
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
  return products.find((product) => product?.slug === slug) || null;
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

  const productTitle = product?.title || "Produk Nexarin";
  const description =
    product?.description ||
    "Halaman checkout manual produk digital Nexarin by-rins.";

  return {
    title: `Checkout ${productTitle}`,
    description: `Checkout manual untuk ${productTitle}. ${description}`,
    alternates: {
      canonical: `/products/checkout/${slug || "preview"}`,
    },
    openGraph: {
      type: "website",
      title: `Checkout ${productTitle} - Nexarin by-rins`,
      description: `Checkout manual untuk produk digital ${productTitle} di Nexarin by-rins.`,
      url: `https://nexarin.my.id/products/checkout/${slug || "preview"}`,
      siteName: "Nexarin by-rins",
      locale: "id_ID",
    },
    twitter: {
      card: "summary_large_image",
      title: `Checkout ${productTitle} - Nexarin by-rins`,
      description: `Checkout manual untuk produk digital ${productTitle} di Nexarin by-rins.`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ProductCheckoutRoute({ params }) {
  const resolvedParams = await params;

  return <ProductCheckoutPage slug={resolvedParams?.slug || ""} />;
}