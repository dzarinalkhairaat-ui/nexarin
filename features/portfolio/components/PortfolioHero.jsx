import Link from "next/link";
import { portfolioHeroData } from "@/features/portfolio/portfolio.data";

export default function PortfolioHero() {
  const data = portfolioHeroData || {};
  const primaryCta = data.primaryCta || {};
  const secondaryCta = data.secondaryCta || {};

  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-24 text-center text-white sm:px-6 sm:pb-24 sm:pt-32 lg:px-8 lg:pb-32 lg:pt-36">
      {/* Background Glow Effects */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-emerald-500/15 blur-[120px] mix-blend-screen" />
      <div className="pointer-events-none absolute left-1/4 top-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px] mix-blend-screen" />
      
      {/* Subtle Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.02] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-both">
          <p className="inline-flex rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-black uppercase tracking-[0.25em] text-emerald-400 backdrop-blur-md shadow-2xl shadow-emerald-500/10">
            <span className="relative flex h-2 w-2 mr-3 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            {data.eyebrow || "Portfolio"}
          </p>
        </div>

        <h1 className="mx-auto mt-8 text-5xl font-black leading-[1.1] tracking-tight sm:text-7xl md:text-8xl lg:text-[6rem]">
          <span className="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-150 ease-out fill-mode-both inline-block text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-slate-500">
            {data.title || "Showcase project digital by-rins."}
          </span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg font-medium leading-relaxed text-slate-400 sm:text-xl sm:leading-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 ease-out fill-mode-both">
          {data.description ||
            "Portfolio Nexarin akan menampilkan project, studi kasus, dan karya digital by-rins."}
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-5 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500 ease-out fill-mode-both">
          <Link
            href={primaryCta.href || "#portfolio-projects"}
            className="group relative inline-flex min-h-[60px] items-center justify-center overflow-hidden rounded-2xl bg-emerald-400 px-8 py-4 text-sm font-black text-slate-950 transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(52,211,153,0.5)] active:scale-95"
          >
            <span className="relative z-10">{primaryCta.label || "Lihat Project"}</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
          </Link>

          <Link
            href={secondaryCta.href || "/contact"}
            className="group inline-flex min-h-[60px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-4 text-sm font-black text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-white/[0.08] active:scale-95"
          >
            {secondaryCta.label || "Hubungi Nexarin"}
          </Link>
        </div>

        {/* Highlight Stats (Glassmorphism Bento Style) */}
        <div className="mx-auto mt-24 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-700 ease-out fill-mode-both">
          {[
            { label: "Projects Completed", value: "10+" },
            { label: "Happy Clients", value: "25+" },
            { label: "Years Experience", value: "5+" },
            { label: "Awards Won", value: "3" },
          ].map((stat, i) => (
            <div key={i} className="group relative overflow-hidden rounded-[24px] border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl transition hover:bg-white/[0.04]">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
              <div className="relative z-10 text-center">
                <p className="bg-gradient-to-br from-white to-slate-500 bg-clip-text text-4xl font-black tracking-tighter text-transparent">{stat.value}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}