"use client";

import Link from "next/link";
import { useState } from "react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import ProductsHeader from "@/features/products/components/ProductsHeader";
import ProductsFooter from "@/features/products/components/ProductsFooter";
import { productMarketplaceData } from "@/features/products/products.data";

function getProduct(slug) {
    const products = Array.isArray(productMarketplaceData?.products)
        ? productMarketplaceData.products
        : [];

    return (
        products.find((product) => product?.slug === slug) ||
        products[0] || {
            slug: "preview",
            title: "Produk Nexarin",
            category: "Products",
            categorySlug: "semua",
            oldPrice: "Rp 0",
            price: "Rp 0",
            image: "",
            description:
                "Produk fallback Nexarin disiapkan agar halaman tetap aman dan tidak blank putih.",
        }
    );
}

function getRelatedProducts(currentProduct) {
    const products = Array.isArray(productMarketplaceData?.products)
        ? productMarketplaceData.products
        : [];

    const sameCategory = products.filter(
        (product) =>
            product?.slug !== currentProduct?.slug &&
            product?.categorySlug === currentProduct?.categorySlug
    );

    const otherProducts = products.filter(
        (product) =>
            product?.slug !== currentProduct?.slug &&
            product?.categorySlug !== currentProduct?.categorySlug
    );

    return [...sameCategory, ...otherProducts].slice(0, 4);
}

function ProductImage({ product }) {
    const safeProduct = product || {};
    const imageUrl = safeProduct.image || safeProduct.imageUrl || "";
    const [isError, setIsError] = useState(false);
    const canShowImage = imageUrl && !isError;

    return (
        <div className="relative aspect-square overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/80 shadow-2xl shadow-black/25">
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
                <div className="relative z-10 flex h-full w-full items-end p-5">
                    <img
                        src="/images/logo/nexarin-logo.png"
                        alt=""
                        aria-hidden="true"
                        className="h-14 w-14 object-contain opacity-90 drop-shadow-[0_0_18px_rgba(52,211,153,0.25)]"
                        loading="lazy"
                        decoding="async"
                    />
                </div>
            )}

            <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
        </div>
    );
}

function DetailHero({ product }) {
    return (
        <section className="relative overflow-hidden px-5 pb-8 pt-7 text-white sm:px-6 lg:px-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(16,185,129,0.14),transparent_32%),radial-gradient(circle_at_88%_70%,rgba(6,182,212,0.1),transparent_34%)]" />

            <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

            <img
                src="/images/logo/nexarin-logo.png"
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 top-20 h-80 w-80 rotate-12 object-contain opacity-[0.035]"
                loading="lazy"
                decoding="async"
            />

            <div className="relative z-10 mx-auto w-full max-w-7xl">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <Link
                        href="/products"
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] text-xl font-black text-white shadow-lg shadow-black/20 transition hover:border-emerald-400/25 hover:bg-emerald-400/10"
                        aria-label="Kembali ke Products"
                    >
                        ←
                    </Link>

                    <p className="min-w-0 text-center text-lg font-black tracking-[-0.04em] text-white">
                        Detail Produk
                    </p>

                    <Link
                        href="/products/semua"
                        className="rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 text-xs font-black text-emerald-300 shadow-lg shadow-black/20 transition hover:border-emerald-400/25 hover:bg-emerald-400/10"
                    >
                        All
                    </Link>
                </div>

                <article className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.045] p-4 shadow-2xl shadow-black/25">
                    <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-400/18 blur-3xl" />
                    <div className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />

                    <div className="relative z-10 grid grid-cols-[112px_1fr] gap-4 sm:grid-cols-[180px_1fr] lg:grid-cols-[280px_1fr] lg:items-center">
                        <div className="min-w-0">
                            <ProductImage product={product} />
                        </div>

                        <div className="min-w-0 py-1">
                            <p className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">
                                {product?.category || "Products"}
                            </p>

                            <h1 className="mt-3 line-clamp-3 text-[1.35rem] font-black leading-[0.98] tracking-[-0.055em] text-white sm:text-4xl lg:text-5xl">
                                {product?.title || "Produk Nexarin"}
                            </h1>

                            <p className="mt-3 line-clamp-3 text-xs font-medium leading-6 text-slate-400 sm:text-sm sm:leading-7">
                                {product?.description ||
                                    "Deskripsi produk Nexarin akan tampil di bagian ini."}
                            </p>

                            <div className="mt-4">
                                <p className="text-xs font-bold text-slate-500 line-through">
                                    {product?.oldPrice || "Rp 0"}
                                </p>

                                <p className="mt-0.5 text-2xl font-black tracking-[-0.05em] text-emerald-300">
                                    {product?.price || "Rp 0"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
                        <Link
                            href={`/products/checkout/${product?.slug || "preview"}`}
                            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:bg-emerald-300"
                        >
                            Beli
                        </Link>

                        <Link
                            href="/contact"
                            className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 text-sm font-black text-emerald-200 transition hover:bg-emerald-400 hover:text-slate-950"
                        >
                            Tanya
                        </Link>
                    </div>
                </article>
            </div>
        </section>
    );
}

function ProductInfo({ product }) {
    const points = [
        "Fondasi produk masih memakai data statis sementara.",
        "Nanti bisa dihubungkan ke database dan admin dashboard.",
        "Checkout masih manual/fondasi awal sebelum payment gateway.",
        "Gambar produk bisa diganti dari backend saat sistem sudah siap.",
    ];

    return (
        <section className="px-5 py-7 text-white sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">
                <div className="rounded-[32px] border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-black/20">
                    <h2 className="text-2xl font-black tracking-[-0.05em] text-white">
                        Informasi Produk
                    </h2>

                    <p className="mt-3 text-sm font-medium leading-7 text-slate-400">
                        {product?.title || "Produk"} adalah bagian dari katalog digital
                        Nexarin yang disiapkan bertahap untuk ekosistem by-rins.
                    </p>

                    <div className="mt-5 grid gap-3">
                        {points.map((point, index) => (
                            <div
                                key={point}
                                className="flex gap-3 rounded-2xl border border-white/10 bg-slate-950/45 p-4"
                            >
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-xs font-black text-emerald-300">
                                    {index + 1}
                                </span>

                                <p className="text-sm font-medium leading-6 text-slate-300">
                                    {point}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function RelatedProducts({ products }) {
    const safeProducts = Array.isArray(products) ? products : [];

    function RelatedProductCard({ product }) {
        const safeProduct = product || {};
        const slug = safeProduct.slug || "preview";

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
                    <div className="grid grid-cols-2 gap-3">
                        {safeProducts.map((product, index) => (
                            <RelatedProductCard
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

export default function ProductDetailPage({ slug }) {
    const product = getProduct(slug);
    const relatedProducts = getRelatedProducts(product);

    return (
        <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
            <ProductsHeader />

            <ScrollReveal>
                <DetailHero product={product} />
            </ScrollReveal>

            <ScrollReveal delay={80}>
                <ProductInfo product={product} />
            </ScrollReveal>

            <ScrollReveal delay={100}>
                <RelatedProducts products={relatedProducts} />
            </ScrollReveal>

            <ScrollReveal delay={100}>
                <ProductsFooter />
            </ScrollReveal>
        </main>
    );
}