import { ppobHeroData } from "@/features/products/components/ppob-page/ppob.data";

export default function PpobHeroBanner() {
  const hero = ppobHeroData || {};

  return (
    <section className="px-5 pt-5 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="relative overflow-hidden rounded-[26px] border border-emerald-400/20 bg-slate-900 shadow-2xl shadow-black/30">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_30%,rgba(52,211,153,0.34),transparent_34%),radial-gradient(circle_at_88%_20%,rgba(34,211,238,0.18),transparent_30%),linear-gradient(135deg,rgba(15,23,42,0.98),rgba(6,78,59,0.78),rgba(15,23,42,0.98))]" />

          <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:22px_22px]" />

          <div className="pointer-events-none absolute -right-10 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full border border-emerald-400/15 bg-emerald-400/10 blur-sm" />
          <div className="pointer-events-none absolute right-8 top-1/2 h-20 w-20 -translate-y-1/2 rounded-full border border-cyan-400/20 bg-cyan-400/10" />

          <img
            src="/images/logo/nexarin-logo.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 top-1/2 h-36 w-36 -translate-y-1/2 object-contain opacity-[0.07]"
            loading="lazy"
            decoding="async"
          />

          <div className="relative z-10 flex min-h-[148px] flex-col justify-between p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-emerald-300">
                  {hero.eyebrow || "Digital Payment"}
                </p>

                <h2 className="mt-2 max-w-[260px] text-3xl font-black uppercase leading-[0.9] tracking-[-0.08em] text-white">
                  {hero.title || "Nexarin PPOB"}
                </h2>
              </div>

              <div className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-slate-200">
                {hero.badge || "by-rins"}
              </div>
            </div>

            <p className="mt-5 max-w-md text-xs font-bold leading-5 text-slate-300">
              {hero.description ||
                "Pulsa, paket data, PLN, e-wallet, voucher, dan top up game dalam satu etalase mobile yang clean."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}