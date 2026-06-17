"use client";

import ProductCheckoutContent from "@/features/products/components/checkout-page/ProductCheckoutContent";
import ProductCheckoutFooter from "@/features/products/components/checkout-page/ProductCheckoutFooter";
import ProductCheckoutHeader from "@/features/products/components/checkout-page/ProductCheckoutHeader";
import ProductCheckoutNotFound from "@/features/products/components/checkout-page/ProductCheckoutNotFound";
import { productMarketplaceData } from "@/features/products/products.data";
import { getSafeProducts } from "@/features/products/products.helpers";

function getProducts() {
  return getSafeProducts(productMarketplaceData?.products);
}

function getProduct(slug) {
  const products = getProducts();

  return products.find((product) => product?.slug === slug) || null;
}

export default function ProductCheckoutScreen({ slug }) {
  const product = getProduct(slug);

  if (!product) {
    return <ProductCheckoutNotFound />;
  }

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <ProductCheckoutHeader />
      <ProductCheckoutContent product={product} />
      <ProductCheckoutFooter />
    </main>
  );
}
