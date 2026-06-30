import Link from "next/link";
import { homeData } from "@/features/home/home.data";
import { DagangIcon, NewsIcon, PortfolioIcon } from "@/components/shared/MenuIcons";

const CheckIcon = ({ className = "h-3.5 w-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.88 15.36L5.28 12.5l1.41-1.41 3.43 3.43 7.82-7.83 1.41 1.42-9.23 9.25z"/>
  </svg>
);

const HERO_DESCRIPTION =
  "Website All-in-One by-rins untuk portal informasi, showcase, dan portfolio.";

export default function HomeHero() {
  const data = homeData || {};

  return (
    <section className="relative px-5 pb-16 pt-10 text-center sm:px-6 sm:pt-16 lg:px-8">
      {/* Background Image with Low Opacity */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000" 
          alt="" 
          className="h-full w-full object-cover opacity-[0.06]"
        />
        {/* Gradient fade to blend into the background smoothly */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/60 to-slate-950" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 to-transparent" />
      </div>

      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-emerald-400/[0.08] blur-[120px]" />

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

        <div className="mt-10 flex flex-row flex-wrap items-center justify-center gap-3 sm:gap-5">
          <Link href="/dagang" className="group inline-flex h-11 sm:h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 sm:px-8 text-sm sm:text-base font-bold text-white transition-all active:scale-95 hover:scale-105 hover:bg-emerald-400 hover:text-slate-950 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(52,211,153,0.25)]">
            <span className="flex items-center gap-1.5 sm:gap-2">
              <DagangIcon className="h-4 w-4 sm:h-5 sm:w-5 opacity-70 transition-colors group-hover:opacity-100" />
              Belanja
            </span>
          </Link>
          
          <Link href="/news" className="group inline-flex h-11 sm:h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 sm:px-8 text-sm sm:text-base font-bold text-white transition-all active:scale-95 hover:scale-105 hover:bg-emerald-400 hover:text-slate-950 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(52,211,153,0.25)]">
            <span className="flex items-center gap-1.5 sm:gap-2">
              <NewsIcon className="h-4 w-4 sm:h-5 sm:w-5 opacity-70 transition-colors group-hover:opacity-100" />
              News
            </span>
          </Link>

          <Link href="/portfolio" className="group inline-flex h-11 sm:h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 sm:px-8 text-sm sm:text-base font-bold text-white transition-all active:scale-95 hover:scale-105 hover:bg-emerald-400 hover:text-slate-950 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(52,211,153,0.25)]">
            <span className="flex items-center gap-1.5 sm:gap-2">
              <PortfolioIcon className="h-4 w-4 sm:h-5 sm:w-5 opacity-70 transition-colors group-hover:opacity-100" />
              Portofolio
            </span>
          </Link>
        </div>

        {/* Feature Tags */}
        <div className="mt-6 flex items-center justify-center gap-4 sm:gap-6 text-[10.5px] sm:text-[11.5px] font-black uppercase tracking-wider text-slate-300 overflow-hidden">
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <CheckIcon className="text-blue-500 h-4 w-4 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" /> Terpercaya
          </span>
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <CheckIcon className="text-blue-500 h-4 w-4 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" /> Akurat
          </span>
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <CheckIcon className="text-blue-500 h-4 w-4 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" /> SatSet
          </span>
        </div>
      </div>
    </section>
  );
}