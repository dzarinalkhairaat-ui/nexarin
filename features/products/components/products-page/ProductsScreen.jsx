"use client";

import ProductGrid from "@/features/products/components/products-page/ProductGrid";
import Header from "@/components/shared/Header";
import ProductsPageFooter from "@/features/products/components/products-page/ProductsPageFooter";

export default function ProductsScreen() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <Header />
      <ProductGrid />
      <ProductsPageFooter />
    </main>
  );
}
