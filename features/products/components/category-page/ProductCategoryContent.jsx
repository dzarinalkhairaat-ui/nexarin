"use client";

import { useMemo } from "react";
import ProductCategoryCard from "@/features/products/components/category-page/ProductCategoryCard";
import { getFilteredCategoryProducts } from "@/features/products/components/category-page/productCategory.helpers";

export default function ProductCategoryContent({
  products,
  activeSubcategory,
  sortBy,
}) {
  const filteredProducts = useMemo(
    () =>
      getFilteredCategoryProducts({
        products,
        activeSubcategory,
        sortBy,
      }),
    [products, activeSubcategory, sortBy]
  );

  return (
    <section className="relative overflow-hidden px-5 py-5 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-20 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <ProductCategoryCard
                key={`category-${product?.slug || product?.title || index}`}
                product={product}
              />
            ))
          ) : (
            <div className="col-span-2 rounded-[28px] border border-white/10 bg-white/[0.035] p-6 text-center text-sm font-medium text-slate-400 sm:col-span-3 lg:col-span-4">
              Produk subkategori ini belum tersedia.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}