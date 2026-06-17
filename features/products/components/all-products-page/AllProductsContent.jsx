"use client";

import { useMemo } from "react";
import AllProductsCard from "@/features/products/components/all-products-page/AllProductsCard";
import { productMarketplaceData } from "@/features/products/products.data";

function getSafeArray(value) {
  return Array.isArray(value) ? value : [];
}

function parsePrice(value) {
  if (!value || typeof value !== "string") {
    return 0;
  }

  const numberOnly = value.replace(/[^\d]/g, "");

  return Number(numberOnly || 0);
}

export default function AllProductsContent({ sortBy }) {
  const data = productMarketplaceData || {};
  const products = getSafeArray(data.products);

  const filteredProducts = useMemo(() => {
    const clonedProducts = [...products];

    if (sortBy === "termahal") {
      return clonedProducts.sort(
        (a, b) => parsePrice(b?.price) - parsePrice(a?.price)
      );
    }

    if (sortBy === "termurah") {
      return clonedProducts.sort(
        (a, b) => parsePrice(a?.price) - parsePrice(b?.price)
      );
    }

    return clonedProducts;
  }, [products, sortBy]);

  return (
    <section className="relative overflow-hidden px-5 py-5 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-20 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <AllProductsCard
                key={`${product?.slug || product?.title || "product"}-${index}`}
                product={product}
              />
            ))
          ) : (
            <div className="col-span-2 rounded-[28px] border border-white/10 bg-white/[0.035] p-6 text-center text-sm font-medium text-slate-400 sm:col-span-3 lg:col-span-4">
              Produk belum tersedia.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}