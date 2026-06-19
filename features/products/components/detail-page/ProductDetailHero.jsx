"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart/CartContext";

const CART_ICON_URL =
  "https://api.iconify.design/solar:bag-4-bold.svg?color=%23a7f3d0";

function ProductImage({ product }) {
  const safeProduct = product || {};
  const imageUrl =
    typeof safeProduct.image === "string" && safeProduct.image.startsWith("/")
      ? safeProduct.image
      : "";

  const [isError, setIsError] = useState(false);
  const canShowImage = Boolean(imageUrl && !isError);

  return (
    <div className="relative aspect-square overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/80 shadow-2xl shadow-black/40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(52,211,153,0.22),transparent_32%),radial-gradient(circle_at_78%_70%,rgba(6,182,212,0.15),transparent_36%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:24px_24px]" />

      {canShowImage ? (
        <img
          src={imageUrl}
          alt={safeProduct.title || "Produk Nexarin"}
          className="relative z-10 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          onError={() => setIsError(true)}
        />
      ) : (
        <div className="relative z-10 flex h-full w-full flex-col justify-between p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-300 backdrop-blur-md">
              {safeProduct.type || "Digital"}
            </span>

            <span className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5 text-[10px] font-black text-slate-300 backdrop-blur-md">
              ★ {safeProduct.rating || "4.8"}
            </span>
          </div>

          <div className="flex items-end justify-between gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-[24px] border border-white/10 bg-white/[0.065] text-3xl shadow-xl shadow-black/20 backdrop-blur-md">
              {safeProduct.icon || "✦"}
            </div>

            <img
              src="/images/logo/nexarin-logo.png"
              alt=""
              aria-hidden="true"
              className="h-16 w-16 object-contain opacity-90 drop-shadow-[0_0_24px_rgba(52,211,153,0.3)]"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
    </div>
  );
}

function ProductNotFoundHero() {
  return (
    <section className="relative overflow-hidden px-5 py-8 text-white sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        <Link
          href="/products"
          className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] text-xl font-black text-white shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-emerald-400/25 hover:bg-emerald-400/10"
        >
          ←
        </Link>
        <div className="rounded-[34px] border border-white/10 bg-white/[0.045] p-10 shadow-2xl shadow-black/25">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-300">
            Error 404
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-[-0.06em] text-white">
            Produk tidak ditemukan.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm font-medium leading-7 text-slate-400">
            Produk yang Anda cari tidak ada di data kami atau mungkin sudah dihapus.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-2xl bg-emerald-400 px-6 py-3 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:bg-emerald-300"
          >
            Kembali ke Katalog
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function ProductDetailHero({ product }) {
  const { addToCart } = useCart();

  if (!product) {
    return <ProductNotFoundHero />;
  }

  function handleAddToCart(event) {
    event.preventDefault();
    addToCart(product);
  }

  return (
    <section className="relative overflow-hidden px-5 pb-10 pt-8 text-white sm:px-6 lg:px-8">
      {/* Background aesthetics */}
      <div className="pointer-events-none absolute -left-20 top-0 h-[400px] w-[400px] rounded-full bg-emerald-400/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-20 top-20 h-[400px] w-[400px] rounded-full bg-cyan-400/10 blur-[100px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="relative z-10 mx-auto w-full max-w-4xl">
        {/* Header Navigation */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/products"
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] text-lg font-black text-white shadow-xl shadow-black/20 backdrop-blur-md transition hover:-translate-y-0.5 hover:border-emerald-400/25 hover:bg-emerald-400/10"
            aria-label="Kembali ke Katalog"
          >
            ←
          </Link>

          <div className="flex flex-col items-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
              Detail Produk
            </p>
            <p className="text-sm font-bold text-slate-300">
              Nexarin Catalog
            </p>
          </div>

          <div className="h-12 w-12" aria-hidden="true" />
        </div>

        {/* Main Product Card */}
        <article className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-6 lg:p-8">
          <div className="relative z-10 grid gap-8 md:grid-cols-[300px_1fr] lg:grid-cols-[340px_1fr] lg:gap-12">
            {/* Visual Column */}
            <div className="min-w-0">
              <ProductImage product={product} />
            </div>

            {/* Info Column */}
            <div className="flex min-w-0 flex-col justify-center">
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {product?.category || "Products"}
              </p>

              <h1 className="mt-5 text-3xl font-black leading-[1.05] tracking-[-0.05em] text-white sm:text-4xl lg:text-5xl">
                {product?.title || "Produk Nexarin"}
              </h1>

              <p className="mt-4 text-sm font-medium leading-relaxed text-slate-400 sm:text-base sm:leading-8">
                {product?.description ||
                  "Deskripsi detail tentang produk premium dari ekosistem digital Nexarin. Cocok untuk meningkatkan produktivitas dan kualitas project digital Anda."}
              </p>

              <div className="mt-8 border-t border-white/10 pt-8">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
                  <div>
                    {product?.oldPrice && (
                      <p className="text-sm font-bold text-slate-500 line-through">
                        {product.oldPrice}
                      </p>
                    )}
                    <p className="mt-0.5 text-3xl font-black tracking-[-0.05em] text-emerald-300">
                      {product?.price || "Rp 0"}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      aria-label="Tambah ke Cart"
                      title="Tambah ke troli"
                      className="group flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 transition hover:-translate-y-0.5 hover:bg-emerald-400/20"
                    >
                      <img
                        src={CART_ICON_URL}
                        alt=""
                        className="h-6 w-6 object-contain opacity-90 transition group-hover:scale-110 group-hover:opacity-100"
                      />
                    </button>

                    <Link
                      href={`/products/checkout/${product?.slug || "preview"}`}
                      className="inline-flex h-14 items-center justify-center rounded-2xl bg-emerald-400 px-6 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:-translate-y-0.5 hover:bg-emerald-300"
                    >
                      Beli Sekarang
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}