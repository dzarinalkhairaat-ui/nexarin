import Link from "next/link";
import { homeProductsPreview } from "@/features/home/home.data";

const CartIcon = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
  </svg>
);

const AiIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
  </svg>
);

const ShirtIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
  </svg>
);

const MailIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
  </svg>
);

const LockIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
  </svg>
);

const productIcons = [<AiIcon key="1" />, <ShirtIcon key="2" />, <MailIcon key="3" />];

function ProductPreviewCard({ product, index }) {
  const safeProduct = product || {};
  const number = String(index + 1).padStart(2, "0");
  const icon = productIcons[index] || "✦";
  const isLocked = safeProduct.status === "Coming Soon";

  const CardWrapper = isLocked ? "div" : Link;
  const wrapperProps = isLocked 
    ? { className: "block group cursor-not-allowed opacity-90" } 
    : { href: "/products", className: "block group" };

  return (
    <CardWrapper {...wrapperProps}>
      <article className={`relative h-full overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md transition ${isLocked ? '' : 'hover:-translate-y-2 hover:bg-slate-800/60'}`}>
        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-2xl shadow-lg shadow-emerald-400/10 transition ${isLocked ? '' : 'group-hover:scale-110'}`}>
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

            <span className="rounded-full border border-white/10 bg-slate-950/45 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-slate-300 backdrop-blur-md flex items-center gap-1.5">
              {isLocked && <LockIcon className="h-3 w-3" />}
              {safeProduct.status || "Soon"}
            </span>
          </div>

          <h3 className={`mt-8 text-2xl font-black leading-tight tracking-[-0.04em] transition-colors ${isLocked ? 'text-white/80' : 'text-white group-hover:text-emerald-300'}`}>
            {safeProduct.title || "Produk belum tersedia"}
          </h3>

          <p className="mt-4 flex-1 text-sm font-medium leading-relaxed text-slate-400 line-clamp-4">
            {safeProduct.description ||
              "Deskripsi produk akan ditambahkan saat data sudah siap."}
          </p>

          <div className="mt-8 border-t border-white/10 pt-5">
            <span className={`inline-flex w-full items-center justify-between text-sm font-black transition ${isLocked ? 'text-slate-500' : 'text-emerald-400 group-hover:text-emerald-300'}`}>
              <span className="flex items-center gap-2">
                {isLocked && <LockIcon className="h-4 w-4" />}
                {isLocked ? "Locked" : "Lihat Produk"}
              </span>
              <span aria-hidden="true" className={`flex items-center text-xl ${isLocked ? '' : 'transition-transform group-hover:translate-x-1'}`}>
                {isLocked ? <LockIcon className="h-5 w-5 opacity-70" /> : "→"}
              </span>
            </span>
          </div>
        </div>
      </article>
    </CardWrapper>
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
                <CartIcon className="h-4 w-4" />
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