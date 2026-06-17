"use client";

import Link from "next/link";
import { productMarketplaceData } from "@/features/products/products.data";
import ProductCategoryScroller from "@/features/products/components/products-page/ProductCategoryScroller";
import ProductsHero from "@/features/products/components/products-page/ProductsHero";
import ProductsHomeCard from "@/features/products/components/products-page/ProductsHomeCard";

function getSafeArray(value) {
  return Array.isArray(value) ? value : [];
}

function ProductSection({ id, title, products, showAllLink = true }) {
  const safeProducts = getSafeArray(products);

  return (
    <section id={id} className="px-5 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="h-9 w-1 shrink-0 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/25" />

            <div className="min-w-0">
              <p className="text-2xl font-black tracking-[-0.06em] text-white sm:text-3xl">
                {title}
              </p>
            </div>
          </div>

          {showAllLink ? (
            <Link
              href="/products/semua"
              className="hidden shrink-0 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2.5 text-xs font-black text-emerald-300 transition hover:bg-emerald-400 hover:text-slate-950 sm:inline-flex"
            >
              Lihat Semua
            </Link>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {safeProducts.length > 0 ? (
            safeProducts.map((product, index) => (
              <ProductsHomeCard
                key={`${title}-${product?.slug || product?.title || index}`}
                product={product}
              />
            ))
          ) : (
            <div className="col-span-2 rounded-[28px] border border-white/10 bg-white/[0.035] p-6 text-center text-sm font-medium text-slate-400 sm:col-span-3 lg:col-span-4">
              Produk belum tersedia.
            </div>
          )}
        </div>

        {showAllLink ? (
          <Link
            href="/products/semua"
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 text-sm font-black text-emerald-200 transition hover:bg-emerald-400 hover:text-slate-950 sm:hidden"
          >
            Lihat Semua Produk
          </Link>
        ) : null}
      </div>
    </section>
  );
}

export default function ProductGrid() {
  const data = productMarketplaceData || {};
  const products = getSafeArray(data.products);
  const categories = getSafeArray(data.categories);
  const latestProducts = products.slice(0, 4);

  return (
    <div className="relative overflow-hidden pb-12 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(16,185,129,0.1),transparent_32%),radial-gradient(circle_at_88%_70%,rgba(6,182,212,0.08),transparent_34%)]" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="relative z-10">
        <ProductsHero />

        <ProductCategoryScroller categories={categories} />

        <ProductSection
          id="products-market"
          title="Produk Terbaru"
          products={latestProducts}
        />

        <ProductSection
          title="Semua Produk"
          products={products}
          showAllLink={false}
        />
      </div>
    </div>
  );
}
