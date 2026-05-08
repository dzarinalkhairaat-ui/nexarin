"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ProductsFooter from "@/features/products/components/ProductsFooter";
import { productMarketplaceData } from "@/features/products/products.data";

const sortOptions = [
  {
    label: "Terbaru",
    value: "terbaru",
  },
  {
    label: "Termahal",
    value: "termahal",
  },
  {
    label: "Termurah",
    value: "termurah",
  },
];

function parsePrice(value) {
  if (!value || typeof value !== "string") {
    return 0;
  }

  const numberOnly = value.replace(/[^\d]/g, "");
  return Number(numberOnly || 0);
}

function getProductSlug(product) {
  return product?.slug || "preview";
}

function AllProductsHeader({ sortBy, onSortChange }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(16,185,129,0.12),transparent_28%)]" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-[44px_1fr_44px] items-center gap-3 px-5 py-4 sm:px-6 lg:px-8">
        <Link
          href="/products"
          aria-label="Kembali ke Products"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] text-2xl font-black text-white shadow-lg shadow-black/20 transition hover:border-emerald-400/25 hover:bg-emerald-400/10"
        >
          ←
        </Link>

        <h1 className="min-w-0 truncate text-center text-xl font-black tracking-[-0.04em] text-white">
          Semua Produk
        </h1>

        <div className="relative">
          <button
            type="button"
            aria-label="Filter produk"
            onClick={() => setIsFilterOpen((value) => !value)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] text-lg font-black text-white shadow-lg shadow-black/20 transition hover:border-emerald-400/25 hover:bg-emerald-400/10"
          >
            ⇅
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 top-14 z-50 w-40 overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl shadow-black/40">
              {sortOptions.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    onSortChange(item.value);
                    setIsFilterOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-3 text-left text-xs font-black transition ${
                    item.value === sortBy
                      ? "bg-emerald-400/15 text-emerald-300"
                      : "text-slate-300 hover:bg-white/[0.06]"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.value === sortBy && <span>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function SearchBar({ query, onQueryChange, sortBy }) {
  const activeSort = sortOptions.find((item) => item.value === sortBy);

  return (
    <section className="border-b border-white/10 bg-slate-950 px-5 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-12 w-full max-w-7xl items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.055] px-4 shadow-lg shadow-black/15">
        <span className="text-lg text-slate-400">⌕</span>

        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Cari di semua produk..."
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-500"
        />

        <span className="shrink-0 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-300">
          {activeSort?.label || "Terbaru"}
        </span>
      </div>
    </section>
  );
}

function ProductImage({ product }) {
  const safeProduct = product || {};
  const imageUrl = safeProduct.image || safeProduct.imageUrl || "";
  const [isError, setIsError] = useState(false);
  const canShowImage = imageUrl && !isError;

  return (
    <div className="relative aspect-square overflow-hidden bg-slate-950/80">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(52,211,153,0.22),transparent_32%),radial-gradient(circle_at_78%_70%,rgba(6,182,212,0.15),transparent_36%)]" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:24px_24px]" />

      {canShowImage ? (
        <img
          src={imageUrl}
          alt={safeProduct.title || "Produk Nexarin"}
          className="relative z-10 h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          onError={() => setIsError(true)}
        />
      ) : (
        <div className="relative z-10 flex h-full w-full items-end p-3">
          <img
            src="/images/logo/nexarin-logo.png"
            alt=""
            aria-hidden="true"
            className="h-10 w-10 object-contain opacity-80 drop-shadow-[0_0_14px_rgba(52,211,153,0.2)]"
            loading="lazy"
            decoding="async"
          />
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />
    </div>
  );
}

function AllProductCard({ product }) {
  const safeProduct = product || {};
  const slug = getProductSlug(safeProduct);

  return (
    <article className="group overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.045] shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-emerald-400/25 hover:bg-white/[0.06]">
      <ProductImage product={safeProduct} />

      <div className="p-3">
        <p className="text-[11px] font-bold text-slate-500 line-through">
          {safeProduct.oldPrice || "Rp 0"}
        </p>

        <p className="mt-0.5 text-[17px] font-black leading-tight text-emerald-300">
          {safeProduct.price || "Rp 0"}
        </p>

        <h2 className="mt-2 line-clamp-2 min-h-[2.15rem] text-[14px] font-black leading-tight tracking-[-0.04em] text-white">
          {safeProduct.title || "Produk belum tersedia"}
        </h2>

        <p className="mt-1.5 line-clamp-2 text-[11px] font-medium leading-5 text-slate-400">
          {safeProduct.description ||
            "Deskripsi produk akan ditambahkan saat data sudah siap."}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Link
            href={`/products/checkout/${slug}`}
            className="inline-flex min-h-9 items-center justify-center rounded-xl bg-emerald-400 px-3 py-2 text-[11px] font-black text-slate-950 transition hover:bg-emerald-300"
          >
            Beli
          </Link>

          <Link
            href={`/products/${slug}`}
            className="inline-flex min-h-9 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-[11px] font-black text-emerald-200 transition hover:bg-emerald-400 hover:text-slate-950"
          >
            Detail
          </Link>
        </div>
      </div>
    </article>
  );
}

function AllProductsContent({ sortBy, query }) {
  const data = productMarketplaceData || {};
  const products = Array.isArray(data.products) ? data.products : [];

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const searchedProducts = normalizedQuery
      ? products.filter((product) => {
          const title = product?.title || "";
          const description = product?.description || "";
          const category = product?.category || "";

          return `${title} ${description} ${category}`
            .toLowerCase()
            .includes(normalizedQuery);
        })
      : products;

    const clonedProducts = [...searchedProducts];

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
  }, [products, query, sortBy]);

  return (
    <section className="relative overflow-hidden px-5 py-6 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-20 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-8 w-1 shrink-0 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/25" />

          <div>
            <p className="text-xl font-black tracking-[-0.045em] text-white">
              Daftar Produk
            </p>

            <p className="mt-1 text-xs font-semibold text-slate-500">
              {filteredProducts.length} item tersedia
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <AllProductCard
                key={`${product?.slug || product?.title || "product"}-${index}`}
                product={product}
              />
            ))
          ) : (
            <div className="col-span-2 rounded-[28px] border border-white/10 bg-white/[0.035] p-6 text-center text-sm font-medium text-slate-400">
              Produk tidak ditemukan.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function AllProductsPage() {
  const [sortBy, setSortBy] = useState("terbaru");
  const [query, setQuery] = useState("");

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <AllProductsHeader sortBy={sortBy} onSortChange={setSortBy} />

      <SearchBar query={query} onQueryChange={setQuery} sortBy={sortBy} />

      <AllProductsContent sortBy={sortBy} query={query} />

      <ProductsFooter />
    </main>
  );
}