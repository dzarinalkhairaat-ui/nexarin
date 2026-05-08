import Link from "next/link";
import { homeProductsPreview } from "@/features/home/home.data";

const productIcons = ["🤖", "👕", "💌"];

function ProductPreviewCard({ product, index }) {
  const safeProduct = product || {};
  const number = String(index + 1).padStart(2, "0");
  const icon = productIcons[index] || "✦";

  return (
    <article className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-emerald-400/25 hover:bg-emerald-400/10">
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl transition group-hover:bg-emerald-400/20" />
      <div className="pointer-events-none absolute -left-12 bottom-0 h-36 w-36 rounded-full bg-cyan-400/10 blur-3xl" />

      <img
        src="/images/logo/nexarin-logo.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 bottom-6 h-28 w-28 rotate-12 object-contain opacity-[0.035]"
        loading="lazy"
        decoding="async"
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-xl shadow-lg shadow-emerald-400/10">
              {icon}
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">
                {number}
              </p>
              <p className="mt-1 text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
                {safeProduct.category || "Product"}
              </p>
            </div>
          </div>

          <span className="rounded-full border border-white/10 bg-slate-950/45 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-slate-300">
            {safeProduct.status || "Soon"}
          </span>
        </div>

        <h3 className="mt-6 text-2xl font-black leading-tight tracking-[-0.05em] text-white">
          {safeProduct.title || "Produk belum tersedia"}
        </h3>

        <p className="mt-4 line-clamp-4 text-sm font-medium leading-7 text-slate-400">
          {safeProduct.description ||
            "Deskripsi produk akan ditambahkan saat data sudah siap."}
        </p>

        <div className="mt-5 h-px w-full bg-gradient-to-r from-emerald-400/25 via-white/10 to-transparent" />

        <Link
          href="/products"
          className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2.5 text-xs font-black text-emerald-200 transition hover:bg-emerald-400 hover:text-slate-950"
        >
          Lihat Detail
        </Link>
      </div>
    </article>
  );
}

export default function HomeProductsPreview() {
  const data = homeProductsPreview || {};
  const products = Array.isArray(data.items) ? data.items : [];
  const cta = data.cta || {};

  return (
    <section className="relative overflow-hidden border-t border-white/10 px-5 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(16,185,129,0.14),transparent_32%),radial-gradient(circle_at_90%_70%,rgba(6,182,212,0.1),transparent_34%)]" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

      <img
        src="/images/logo/nexarin-logo.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -left-14 top-16 h-80 w-80 -rotate-12 object-contain opacity-[0.075]"
        loading="lazy"
        decoding="async"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="relative max-w-3xl">
            <div className="pointer-events-none absolute -right-28 -top-10 h-80 w-80 rounded-full bg-gradient-to-l from-emerald-400/24 via-cyan-400/12 to-transparent blur-3xl" />

            <div className="pointer-events-none absolute -right-16 top-3 h-48 w-80 rounded-full bg-[radial-gradient(circle_at_right,rgba(16,185,129,0.24),rgba(6,182,212,0.1),transparent_70%)] blur-2xl" />

            <div className="pointer-events-none absolute -right-4 top-0 h-36 w-56 rounded-full bg-emerald-300/10 blur-xl" />

            <div className="relative z-10">
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-emerald-300 shadow-lg shadow-emerald-400/10">
                <span className="text-sm">🛒</span>
                <span>{data.eyebrow || "Products"}</span>
              </p>

              <h2 className="mt-5 text-[2.1rem] font-black leading-[1.02] tracking-[-0.06em] text-white sm:text-5xl">
                {data.title || "Produk digital Nexarin sedang disiapkan."}
              </h2>

              <p className="mt-5 max-w-2xl text-base font-semibold leading-8 text-slate-300">
                {data.description ||
                  "Section produk ini disiapkan sebagai preview awal."}
              </p>
            </div>
          </div>

          <Link
            href={cta.href || "/products"}
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-3 text-sm font-black text-white shadow-xl shadow-black/10 transition hover:-translate-y-0.5 hover:border-emerald-400/25 hover:bg-emerald-400/10 md:shrink-0"
          >
            {cta.label || "Buka Products"} →
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {products.length > 0 ? (
            products.map((product, index) => (
              <ProductPreviewCard
                key={product?.title || index}
                product={product}
                index={index}
              />
            ))
          ) : (
            <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 text-center text-sm font-medium text-slate-400 md:col-span-3">
              Produk belum tersedia.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}