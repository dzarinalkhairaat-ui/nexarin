"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { productMarketplaceData } from "@/features/products/products.data";

const categoryIcons = {
  semua: "✦",
  "ai-tools": "🤖",
  ppob: "⚡",
  fashion: "👕",
  ebook: "📚",
};

function getCategoryIcon(slug, index) {
  return categoryIcons[slug] || (index === 0 ? "✦" : "▣");
}

function getProductSlug(product) {
  return product?.slug || "preview";
}

function HeroBanner() {
  return (
    <section className="px-5 pt-7 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="relative min-h-[158px] overflow-hidden rounded-[30px] border border-emerald-400/15 bg-white/[0.045] p-5 shadow-2xl shadow-black/25">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/24 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-400/14 blur-3xl" />

          <div className="pointer-events-none absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:28px_28px]" />

          <div className="relative z-10 flex min-h-[118px] flex-col justify-end">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-300">
              <span>🛒</span>
              <span>Nexarin Products</span>
            </p>

            <h1 className="mt-4 max-w-sm text-[2rem] font-black leading-[0.95] tracking-[-0.06em] text-white">
              Digital store for premium web assets.
            </h1>

            <p className="mt-3 max-w-xs text-sm font-semibold leading-6 text-slate-400">
              Template, tools AI, PPOB, fashion, ebook, dan layanan digital
              by-rins.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryScroller({ categories }) {
  const scrollerRef = useRef(null);
  const safeCategories = Array.isArray(categories) ? categories : [];

  useEffect(() => {
    const element = scrollerRef.current;

    if (!element || safeCategories.length === 0) {
      return;
    }

    let frame = 0;
    let paused = false;

    const animate = () => {
      if (!paused) {
        element.scrollLeft += 0.28;

        const maxScroll = element.scrollWidth - element.clientWidth;

        if (element.scrollLeft >= maxScroll - 2) {
          element.scrollTo({ left: 0, behavior: "smooth" });
        }
      }

      frame = window.requestAnimationFrame(animate);
    };

    frame = window.requestAnimationFrame(animate);

    const pause = () => {
      paused = true;
    };

    const resume = () => {
      paused = false;
    };

    element.addEventListener("touchstart", pause, { passive: true });
    element.addEventListener("touchend", resume, { passive: true });
    element.addEventListener("mouseenter", pause);
    element.addEventListener("mouseleave", resume);

    return () => {
      window.cancelAnimationFrame(frame);
      element.removeEventListener("touchstart", pause);
      element.removeEventListener("touchend", resume);
      element.removeEventListener("mouseenter", pause);
      element.removeEventListener("mouseleave", resume);
    };
  }, [safeCategories.length]);

  return (
    <section className="px-5 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div
          ref={scrollerRef}
          className="flex gap-3 overflow-x-auto pb-3 pt-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {safeCategories.map((category, index) => {
            const label =
              typeof category === "string"
                ? category
                : category?.label || "Kategori";

            const slug =
              typeof category === "string"
                ? category.toLowerCase().replace(/\s+/g, "-")
                : category?.slug || "semua";

            const href =
              slug === "semua" ? "/products/semua" : `/products/kategori/${slug}`;

            return (
              <Link
                key={slug}
                href={href}
                className={`group relative flex min-h-24 min-w-[108px] shrink-0 flex-col items-center justify-center overflow-hidden rounded-[24px] border px-3 text-center shadow-xl shadow-black/15 transition hover:-translate-y-1 ${
                  index === 0
                    ? "border-emerald-400/30 bg-emerald-400/15 text-emerald-200"
                    : "border-white/10 bg-white/[0.045] text-slate-300 hover:border-emerald-400/25 hover:bg-emerald-400/10"
                }`}
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-emerald-400/10 blur-2xl" />

                <span className="relative z-10 mb-2 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/60 text-lg shadow-lg shadow-black/10">
                  {getCategoryIcon(slug, index)}
                </span>

                <span className="relative z-10 text-[11px] font-black uppercase leading-4 tracking-[0.12em]">
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
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

function ProductCard({ product }) {
  const safeProduct = product || {};
  const slug = getProductSlug(safeProduct);

  return (
    <article className="group overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.045] shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-emerald-400/25 hover:bg-white/[0.06]">
      <ProductImage product={safeProduct} />

      <div className="p-3">
        <div>
          <p className="text-[11px] font-bold text-slate-500 line-through">
            {safeProduct.oldPrice || "Rp 0"}
          </p>

          <p className="mt-0.5 text-[17px] font-black leading-tight text-emerald-300">
            {safeProduct.price || "Rp 0"}
          </p>
        </div>

        <h3 className="mt-2 line-clamp-2 min-h-[2.15rem] text-[14px] font-black leading-tight tracking-[-0.04em] text-white">
          {safeProduct.title || "Produk belum tersedia"}
        </h3>

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

function ProductSection({ title, subtitle, products }) {
  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <section className="px-5 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="h-8 w-1 shrink-0 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/25" />

            <div className="min-w-0">
              <p className="truncate text-xl font-black tracking-[-0.045em] text-white">
                {title}
              </p>
              <p className="text-xs font-semibold text-slate-500">
                {subtitle}
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

        <div className="grid grid-cols-2 gap-3">
          {safeProducts.length > 0 ? (
            safeProducts.map((product, index) => (
              <ProductCard
                key={`${title}-${product?.title || index}`}
                product={product}
              />
            ))
          ) : (
            <div className="col-span-2 rounded-[28px] border border-white/10 bg-white/[0.035] p-6 text-center text-sm font-medium text-slate-400">
              Produk belum tersedia.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function ProductGrid() {
  const data = productMarketplaceData || {};
  const products = Array.isArray(data.products) ? data.products : [];
  const categories = Array.isArray(data.categories) ? data.categories : [];
  const latestProducts = products.slice(0, 4);

  return (
    <div className="relative overflow-hidden pb-12 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(16,185,129,0.13),transparent_32%),radial-gradient(circle_at_88%_70%,rgba(6,182,212,0.1),transparent_34%)]" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

      <img
        src="/images/logo/nexarin-logo.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-24 h-80 w-80 rotate-12 object-contain opacity-[0.035]"
        loading="lazy"
        decoding="async"
      />

      <div className="relative z-10">
        <HeroBanner />

        <CategoryScroller categories={categories} />

        <ProductSection
          title="Terbaru"
          subtitle="Produk digital pilihan"
          products={latestProducts}
        />

        <ProductSection
          title="Semua Produk"
          subtitle="Katalog produk Nexarin"
          products={products}
        />
      </div>
    </div>
  );
}