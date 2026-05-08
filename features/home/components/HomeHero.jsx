import Link from "next/link";
import { homeData } from "@/features/home/home.data";

const HERO_DESCRIPTION =
  "Website All-in-One by-rins untuk portal informasi, marketplace digital, dan portfolio.";

export default function HomeHero() {
  const data = homeData || {};

  return (
    <section className="relative overflow-hidden px-5 pb-10 pt-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(16,185,129,0.18),transparent_34%),radial-gradient(circle_at_85%_28%,rgba(6,182,212,0.12),transparent_32%),radial-gradient(circle_at_50%_90%,rgba(132,204,22,0.1),transparent_36%)]" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

      <img
        src="/images/logo/nexarin-logo.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-24 h-72 w-72 rotate-12 object-contain opacity-[0.035] sm:h-96 sm:w-96"
        loading="lazy"
        decoding="async"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="max-w-3xl">
          <p className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-emerald-300 shadow-lg shadow-emerald-400/10">
            {data.eyebrow || "Nexarin by-rins"}
          </p>

          <h1 className="mt-6 text-[2.55rem] font-black leading-[0.95] tracking-[-0.065em] text-white sm:text-6xl lg:text-7xl">
            {data.title || "Digital ecosystem by-rins."}
          </h1>

          <p className="mt-6 max-w-2xl text-base font-semibold leading-8 text-slate-300 sm:text-lg">
            {HERO_DESCRIPTION}
          </p>

          <div className="mt-8 grid gap-3 sm:flex">
            <Link
              href="/products"
              className="group relative inline-flex min-h-14 items-center justify-center overflow-hidden rounded-[22px] border border-emerald-300/30 bg-gradient-to-br from-emerald-300 via-emerald-400 to-cyan-300 px-5 py-3 text-sm font-black text-slate-950 shadow-2xl shadow-emerald-400/25 transition hover:-translate-y-0.5 hover:shadow-emerald-400/35"
            >
              <span className="pointer-events-none absolute inset-x-4 top-0 h-px bg-white/70" />
              <span className="pointer-events-none absolute -left-10 top-0 h-full w-10 rotate-12 bg-white/30 blur-md transition duration-500 group-hover:left-[115%]" />
              <span className="relative z-10">Lihat Produk Disini</span>
            </Link>

            <Link
              href="/news"
              className="group relative inline-flex min-h-14 items-center justify-center overflow-hidden rounded-[22px] border border-cyan-300/20 bg-gradient-to-br from-white/[0.085] via-cyan-400/[0.075] to-emerald-400/[0.075] px-5 py-3 text-sm font-black text-white shadow-2xl shadow-cyan-400/10 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-cyan-300/35 hover:bg-cyan-400/10"
            >
              <span className="pointer-events-none absolute inset-x-4 top-0 h-px bg-cyan-200/40" />
              <span className="pointer-events-none absolute -left-10 top-0 h-full w-10 rotate-12 bg-cyan-200/20 blur-md transition duration-500 group-hover:left-[115%]" />
              <span className="relative z-10">Baca Berita Disini</span>
            </Link>
          </div>

          <div className="mt-5 inline-flex w-full flex-col items-center justify-center rounded-[24px] border border-cyan-400/15 bg-gradient-to-br from-emerald-400/10 via-cyan-400/10 to-slate-950/45 px-4 py-4 text-center shadow-xl shadow-cyan-400/5 backdrop-blur-xl sm:w-auto sm:items-start sm:text-left">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-cyan-300">
              All-in-One Platform
            </p>

            <p className="mt-2 text-sm font-bold leading-6 text-slate-300">
              Marketplace • Portal Informasi • Portfolio
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}