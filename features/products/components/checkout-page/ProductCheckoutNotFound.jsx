"use client";

import Link from "next/link";
import ProductCheckoutHeader from "@/features/products/components/checkout-page/ProductCheckoutHeader";
import ProductCheckoutFooter from "@/features/products/components/checkout-page/ProductCheckoutFooter";

export default function ProductCheckoutNotFound() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <ProductCheckoutHeader />

      <section className="relative px-5 py-10 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-xl rounded-[32px] border border-white/10 bg-white/[0.045] p-6 text-center shadow-2xl shadow-black/20">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] border border-emerald-400/20 bg-emerald-400/10 text-2xl">
            ðŸ›’
          </div>

          <h2 className="mt-5 text-2xl font-black tracking-[-0.04em] text-white">
            Produk tidak ditemukan
          </h2>

          <p className="mt-3 text-sm font-medium leading-7 text-slate-400">
            Produk checkout ini belum tersedia atau slug produk tidak cocok.
            Tenang, halaman tetap aman dan tidak blank putih.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link
              href="/products"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
            >
              Kembali
            </Link>

            <Link
              href="/products/semua"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 text-sm font-black text-emerald-200 transition hover:bg-emerald-400 hover:text-slate-950"
            >
              Lihat Produk
            </Link>
          </div>
        </div>
      </section>

      <ProductCheckoutFooter />
    </main>
  );
}
