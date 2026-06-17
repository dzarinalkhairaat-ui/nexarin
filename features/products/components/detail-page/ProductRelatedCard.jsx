"use client";

import Link from "next/link";
import { useState } from "react";

function parsePrice(value) {
  if (!value || typeof value !== "string") {
    return 0;
  }

  const numberOnly = value.replace(/[^\d]/g, "");

  return Number(numberOnly || 0);
}

function getDiscountLabel(oldPrice, price) {
  const oldPriceNumber = parsePrice(oldPrice);
  const priceNumber = parsePrice(price);

  if (!oldPriceNumber || !priceNumber || priceNumber >= oldPriceNumber) {
    return "";
  }

  const discount = Math.round(
    ((oldPriceNumber - priceNumber) / oldPriceNumber) * 100
  );

  return `Hemat ${discount}%`;
}

function getProductSlug(product) {
  return product?.slug || "preview";
}

function ProductVisual({ product }) {
  const safeProduct = product || {};
  const discountLabel = getDiscountLabel(safeProduct.oldPrice, safeProduct.price);
  const imageUrl =
    typeof safeProduct.image === "string" && safeProduct.image.startsWith("/")
      ? safeProduct.image
      : "";

  const [isError, setIsError] = useState(false);
  const canShowImage = Boolean(imageUrl && !isError);

  return (
    <div className="relative aspect-square overflow-hidden rounded-t-[22px] bg-slate-950">
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-400/14 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.075] [background-image:linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:20px_20px]" />

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
        <div className="relative z-10 h-full w-full bg-[radial-gradient(circle_at_35%_28%,rgba(52,211,153,0.14),transparent_34%),radial-gradient(circle_at_82%_72%,rgba(6,182,212,0.1),transparent_38%)]" />
      )}

      {discountLabel ? (
        <div className="absolute right-2 top-2 z-30 rounded-bl-2xl rounded-tr-[18px] bg-red-500 px-2.5 py-1 text-[10px] font-black text-white shadow-lg shadow-black/25">
          {discountLabel}
        </div>
      ) : null}

      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-slate-950/28 via-transparent to-transparent" />
    </div>
  );
}

export default function ProductRelatedCard({ product }) {
  const safeProduct = product || {};
  const slug = getProductSlug(safeProduct);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.045] shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-emerald-400/25 hover:bg-white/[0.06]">
      <ProductVisual product={safeProduct} />

      <div className="flex flex-1 flex-col p-3">
        <p className="text-[11px] font-bold text-slate-500 line-through">
          {safeProduct.oldPrice || "Rp 0"}
        </p>

        <p className="mt-1 text-[18px] font-black leading-tight tracking-[-0.045em] text-emerald-300 sm:text-xl">
          {safeProduct.price || "Rp 0"}
        </p>

        <h3 className="mt-3 line-clamp-2 min-h-[2.35rem] text-[15px] font-black leading-[1.15] tracking-[-0.045em] text-white sm:text-base">
          {safeProduct.title || "Produk belum tersedia"}
        </h3>

        <Link
          href={`/products/${slug}`}
          className="mt-auto inline-flex min-h-10 w-full items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-3 py-2 text-[11px] font-black uppercase tracking-[0.08em] text-emerald-200 transition hover:bg-emerald-400 hover:text-slate-950"
        >
          Lihat Detail
        </Link>
      </div>
    </article>
  );
}