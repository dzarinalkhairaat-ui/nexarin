import Link from "next/link";
import { homeData } from "@/features/home/home.data";

const CheckIcon = ({ className = "h-3 w-3" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const HERO_DESCRIPTION =
  "Website All-in-One by-rins untuk portal informasi, showcase, dan portfolio.";

export default function HomeHero() {
  const data = homeData || {};

  return (
    <section className="relative overflow-hidden px-5 py-20 text-center sm:px-6 lg:px-8 lg:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-emerald-300 shadow-lg shadow-emerald-400/10 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          {data.eyebrow || "Nexarin by-rins"}
        </p>

        <h1 className="mx-auto mt-8 text-5xl font-black leading-[1.05] tracking-[-0.04em] text-white sm:text-6xl lg:text-[5rem]">
          Digital ecosystem <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">by-rins.</span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg font-medium leading-relaxed text-slate-300 sm:text-xl">
          {HERO_DESCRIPTION}
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/coming-soon"
            className="group relative inline-flex min-h-14 items-center justify-center overflow-hidden rounded-2xl bg-emerald-400 px-8 py-4 text-sm font-black text-slate-950 shadow-2xl shadow-emerald-400/25 transition hover:-translate-y-1 hover:bg-emerald-300"
          >
            <span className="relative z-10">Coming Soon</span>
          </Link>

          <Link
            href="/news"
            className="group relative inline-flex min-h-14 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] px-8 py-4 text-sm font-black text-white shadow-2xl backdrop-blur-xl transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
          >
            <span className="relative z-10">Baca Berita</span>
          </Link>
        </div>

        {/* Feature Tags */}
        <div className="mt-6 flex items-center justify-center gap-3 sm:gap-6 text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-400 overflow-hidden">
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <CheckIcon className="text-emerald-400" /> Coming Soon
          </span>
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <CheckIcon className="text-emerald-400" /> Portal Info
          </span>
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <CheckIcon className="text-emerald-400" /> Portfolio
          </span>
        </div>
      </div>
    </section>
  );
}