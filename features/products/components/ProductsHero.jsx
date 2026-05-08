import Link from "next/link";
import { productsHeroData } from "@/features/products/products.data";

export default function ProductsHero() {
  const data = productsHeroData || {};
  const primary = data.primaryCta || {};
  const secondary = data.secondaryCta || {};

  return (
    <section className="relative overflow-hidden px-5 pb-8 pt-12 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-1/2 top-10 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-12 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-52 h-80 w-80 rounded-full bg-lime-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="max-w-3xl">
          <h1 className="text-[2.55rem] font-black leading-[0.96] tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
            {data.title || "Produk digital Nexarin."}
          </h1>

          <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-slate-300 sm:text-lg">
            {data.description ||
              "Etalase produk digital Nexarin sedang disiapkan."}
          </p>

          <div className="mt-8 grid gap-3 sm:flex">
            <Link
              href={primary.href || "#products-market"}
              className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:bg-emerald-300"
            >
              {primary.label || "Lihat Produk"}
            </Link>

            <Link
              href={secondary.href || "/contact"}
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-black text-white transition hover:bg-white/10"
            >
              {secondary.label || "Hubungi Nexarin"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}