import Link from "next/link";
import { homeProductsPreview } from "@/features/home/home.data";

const productIcons = ["🤖", "👕", "💌"];

function ProductPreviewCard({ product, index }) {
  const safeProduct = product || {};
  const number = String(index + 1).padStart(2, "0");
  const icon = productIcons[index] || "✦";

  return (
    <Link href="/products" className="block group">
      <article className="relative h-full overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md transition hover:-translate-y-2 hover:bg-slate-800/60">
        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-2xl shadow-lg shadow-emerald-400/10 transition group-hover:scale-110">
                {icon}
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300">
                  {number}
                </p>
                <p className="mt-1 text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
                  {safeProduct.category || "Product"}
                </p>
              </div>
            </div>

            <span className="rounded-full border border-white/10 bg-slate-950/45 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-slate-300 backdrop-blur-md">
              {safeProduct.status || "Soon"}
            </span>
          </div>

          <h3 className="mt-8 text-2xl font-black leading-tight tracking-[-0.04em] text-white group-hover:text-emerald-300 transition-colors">
            {safeProduct.title || "Produk belum tersedia"}
          </h3>

          <p className="mt-4 flex-1 text-sm font-medium leading-relaxed text-slate-400 line-clamp-4">
            {safeProduct.description ||
              "Deskripsi produk akan ditambahkan saat data sudah siap."}
          </p>

          <div className="mt-8 border-t border-white/10 pt-5">
            <span className="inline-flex w-full items-center justify-between text-sm font-black text-emerald-400 transition group-hover:text-emerald-300">
              <span>Lihat Produk</span>
              <span aria-hidden="true" className="text-xl transition-transform group-hover:translate-x-1">→</span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function HomeProductsPreview() {
  const data = homeProductsPreview || {};
  const products = Array.isArray(data.items) ? data.items : [];
  const cta = data.cta || {};

  return (
    <section className="relative overflow-hidden border-t border-white/10 px-5 py-16 sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="relative max-w-3xl">
            <div className="relative z-10">
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-emerald-300 shadow-lg shadow-emerald-400/10">
                <span className="text-sm">🛒</span>
                <span>{data.eyebrow || "Products"}</span>
              </p>

              <h2 className="mt-5 text-[2.1rem] font-black leading-[1.02] tracking-[-0.06em] text-white sm:text-5xl">
                {data.title || "Produk digital Nexarin sedang disiapkan."}
              </h2>

              <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-slate-300">
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

        <div className="mt-12 grid gap-6 md:grid-cols-3">
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