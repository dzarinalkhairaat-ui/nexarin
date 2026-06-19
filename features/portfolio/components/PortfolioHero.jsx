import Link from "next/link";
import { portfolioHeroData } from "@/features/portfolio/portfolio.data";

export default function PortfolioHero() {
  const data = portfolioHeroData || {};
  const primaryCta = data.primaryCta || {};
  const secondaryCta = data.secondaryCta || {};

  return (
    <section className="relative overflow-hidden px-5 py-16 text-center text-white sm:px-6 sm:py-24 lg:px-8 lg:py-32">
      {/* Background decorations */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-emerald-400/10 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <p className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-300 shadow-lg shadow-emerald-400/5">
          {data.eyebrow || "Portfolio"}
        </p>

        <h1 className="mx-auto mt-6 text-4xl font-black leading-tight tracking-[-0.04em] text-white sm:text-6xl md:text-7xl">
          {data.title || "Showcase project digital by-rins."}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base font-medium leading-relaxed text-slate-300 sm:text-lg sm:leading-8">
          {data.description ||
            "Portfolio Nexarin akan menampilkan project, studi kasus, dan karya digital by-rins."}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={primaryCta.href || "#portfolio-projects"}
            className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-emerald-400 px-8 py-4 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:-translate-y-1 hover:bg-emerald-300"
          >
            {primaryCta.label || "Lihat Project"}
          </Link>

          <Link
            href={secondaryCta.href || "/contact"}
            className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-8 py-4 text-sm font-black text-white shadow-xl shadow-black/10 transition hover:-translate-y-1 hover:border-emerald-400/25 hover:bg-emerald-400/10"
          >
            {secondaryCta.label || "Hubungi Nexarin"}
          </Link>
        </div>

        {/* Highlight Stats */}
        <div className="mx-auto mt-20 grid max-w-3xl grid-cols-2 gap-4 border-t border-white/10 pt-10 sm:grid-cols-4">
          {[
            { label: "Projects Completed", value: "10+" },
            { label: "Happy Clients", value: "25+" },
            { label: "Years Experience", value: "5+" },
            { label: "Awards Won", value: "3" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-black tracking-tighter text-white">{stat.value}</p>
              <p className="mt-1 text-xs font-semibold text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}