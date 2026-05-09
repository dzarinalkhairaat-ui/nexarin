"use client";

import ScrollReveal from "@/components/shared/ScrollReveal";
import ProductDetailFooter from "@/features/products/components/detail-page/ProductDetailFooter";
import ProductDetailHero from "@/features/products/components/detail-page/ProductDetailHero";
import ProductDetailInfo from "@/features/products/components/detail-page/ProductDetailInfo";
import ProductRelatedProducts from "@/features/products/components/detail-page/ProductRelatedProducts";
import ProductsHeader from "@/features/products/components/products-page/ProductsHeader";
import { productMarketplaceData } from "@/features/products/products.data";
import { getSafeProducts } from "@/features/products/products.helpers";

function getProduct(slug) {
  const products = getSafeProducts(productMarketplaceData?.products);

  return products.find((product) => product?.slug === slug) || null;
}

function getRelatedProducts(currentProduct) {
  if (!currentProduct) {
    return [];
  }

  const products = getSafeProducts(productMarketplaceData?.products);

  const sameCategory = products.filter(
    (product) =>
      product?.slug !== currentProduct?.slug &&
      product?.categorySlug === currentProduct?.categorySlug
  );

  const otherProducts = products.filter(
    (product) =>
      product?.slug !== currentProduct?.slug &&
      product?.categorySlug !== currentProduct?.categorySlug
  );

  return [...sameCategory, ...otherProducts].slice(0, 4);
}

export default function ProductDetailScreen({ slug }) {
  const product = getProduct(slug);
  const relatedProducts = getRelatedProducts(product);

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <ProductsHeader />

      <ScrollReveal>
        <ProductDetailHero product={product} />
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <ProductDetailInfo product={product} />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <ProductRelatedProducts products={relatedProducts} />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <ProductDetailFooter />
      </ScrollReveal>
    </main>
  );
}
