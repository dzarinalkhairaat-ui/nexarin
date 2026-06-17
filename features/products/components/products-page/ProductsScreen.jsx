"use client";

import ProductGrid from "@/features/products/components/products-page/ProductGrid";
import ProductsHeader from "@/features/products/components/products-page/ProductsHeader";
import ProductsPageFooter from "@/features/products/components/products-page/ProductsPageFooter";

export default function ProductsScreen() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <ProductsHeader />
      <ProductGrid />
      <ProductsPageFooter />
    </main>
  );
}
