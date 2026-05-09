import { productsHeroData } from "@/features/products/products.data";

export default function ProductsHero() {
  const hero = productsHeroData || {};

  return (
    <section className="px-5 pt-4 sm:px-6 sm:pt-5 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="relative aspect-video overflow-hidden rounded-[24px] border border-emerald-400/16 bg-slate-950 shadow-2xl shadow-emerald-950/25 sm:rounded-[30px]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_28%,rgba(52,211,153,0.34),transparent_31%),radial-gradient(circle_at_80%_24%,rgba(6,182,212,0.17),transparent_30%),linear-gradient(135deg,rgba(2,6,23,0.98),rgba(4,47,46,0.78),rgba(2,6,23,0.98))]" />

          <div className="pointer-events-none absolute inset-0 opacity-[0.13] [background-image:linear-gradient(rgba(52,211,153,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,0.22)_1px,transparent_1px)] [background-size:22px_22px]" />

          <div className="pointer-events-none absolute -left-16 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full bg-emerald-400/22 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-cyan-400/14 blur-3xl" />

          <img
            src="/images/logo/nexarin-logo.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 top-1/2 h-40 w-40 -translate-y-1/2 object-contain opacity-[0.075] sm:h-56 sm:w-56"
            loading="lazy"
            decoding="async"
          />

          <div className="absolute inset-x-4 top-4 z-10 flex items-center justify-between gap-3 sm:inset-x-6 sm:top-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-emerald-300 backdrop-blur sm:text-[10px]">
              <span aria-hidden="true">🛒</span>
              <span>{hero.eyebrow || "Products"}</span>
            </p>

            <p className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.14em] text-slate-300 backdrop-blur sm:text-[10px]">
              by-rins
            </p>
          </div>

          <div className="relative z-10 flex h-full items-end p-4 sm:p-6 lg:p-8">
            <div className="max-w-[84%] sm:max-w-2xl">
              <p className="mb-2 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-300 sm:text-xs">
                Digital Store
              </p>

              <h1 className="text-[1.85rem] font-black uppercase leading-[0.86] tracking-[-0.08em] text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.55)] sm:text-5xl lg:text-7xl">
                Nexarin
                <br />
                Products
              </h1>

              <p className="mt-3 line-clamp-2 max-w-xl text-[10.5px] font-bold leading-5 text-slate-300 sm:text-sm sm:leading-6">
                Template, AI workflow, source UI, dan aset digital premium
                untuk kebutuhan kreator, brand, dan developer.
              </p>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/82 via-slate-950/20 to-transparent" />
        </div>
      </div>
    </section>
  );
}