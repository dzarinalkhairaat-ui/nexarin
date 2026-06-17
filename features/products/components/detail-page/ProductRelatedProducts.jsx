"use client";

import Link from "next/link";
import ProductRelatedCard from "@/features/products/components/detail-page/ProductRelatedCard";
import { getSafeProducts } from "@/features/products/products.helpers";

export default function ProductRelatedProducts({ products }) {
  const safeProducts = getSafeProducts(products);

  return (
    <section className="px-5 py-7 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="h-8 w-1 shrink-0 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/25" />

            <div className="min-w-0">
              <h2 className="truncate text-xl font-black tracking-[-0.045em] text-white">
                Produk Terkait
              </h2>

              <p className="text-xs font-semibold text-slate-500">
                Rekomendasi produk lain
              </p>
            </div>
          </div>

          <Link
            href="/products/semua"
            className="shrink-0 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-black text-emerald-300 transition hover:bg-emerald-400 hover:text-slate-950"
          >
            Lihat Semua
          </Link>
        </div>

        {safeProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {safeProducts.map((product, index) => (
              <ProductRelatedCard
                key={product?.slug || product?.title || index}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 text-center text-sm font-medium text-slate-400">
            Produk terkait belum tersedia.
          </div>
        )}
      </div>
    </section>
  );
}