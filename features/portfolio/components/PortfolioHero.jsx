import Link from "next/link";
import { portfolioHeroData } from "@/features/portfolio/portfolio.data";
import AnimatedCounter from "./AnimatedCounter";
import { SparkleIcon, LockIcon } from "@/components/shared/MenuIcons";


export default function PortfolioHero() {
  const data = portfolioHeroData || {};
  const primaryCta = data.primaryCta || {};
  const secondaryCta = data.secondaryCta || {};

  // Extract "by-rins." if it exists in the title for the gradient effect
  const rawTitle = data.title || "Showcase project digital by-rins.";
  let titleMain = rawTitle;
  let titleGradient = "";
  if (rawTitle.toLowerCase().includes("by-rins")) {
    const idx = rawTitle.toLowerCase().lastIndexOf("by-rins");
    titleMain = rawTitle.substring(0, idx).trim();
    titleGradient = rawTitle.substring(idx);
  }

  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-10 text-center sm:px-6 sm:pt-16 lg:px-8 text-white">
      {/* Background Glow Effects (Synced with HomeHero) */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-[120px]" />
      
      {/* Subtle Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.02] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-both">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-emerald-300 shadow-lg shadow-emerald-400/10 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            {data.eyebrow || "Portfolio"}
          </p>
        </div>

        <h1 className="mx-auto mt-8 text-5xl font-black leading-[1.05] tracking-[-0.04em] text-white sm:text-6xl lg:text-[5rem]">
          <span className="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-150 ease-out fill-mode-both inline-block">
            {titleMain} <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">{titleGradient}</span>
          </span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg font-medium leading-relaxed text-slate-300 sm:text-xl animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 ease-out fill-mode-both">
          {data.description ||
            "Halaman ini akan menjadi tempat menampilkan project, studi kasus, teknologi yang dipakai, dan hasil pengembangan dalam ekosistem Nexarin."}
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500 ease-out fill-mode-both">
          <Link
            href={primaryCta.href || "#portfolio-projects"}
            className="group relative inline-flex min-h-14 items-center justify-center overflow-hidden rounded-2xl bg-emerald-400 px-8 py-4 text-sm font-black text-slate-950 shadow-2xl shadow-emerald-400/25 transition hover:-translate-y-1 hover:bg-emerald-300"
          >
            <span className="relative z-10">{primaryCta.label || "Lihat Project"}</span>
          </Link>

          <Link
            href={secondaryCta.href || "/contact"}
            className="group relative inline-flex min-h-14 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] px-8 py-4 text-sm font-black text-white shadow-2xl backdrop-blur-xl transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
          >
            <span className="relative z-10">{secondaryCta.label || "Hubungi Nexarin"}</span>
          </Link>

          <div
            title="Akses Premium belum tersedia saat ini"
            className="group relative inline-flex min-h-14 cursor-not-allowed select-none items-center justify-center gap-2 overflow-hidden rounded-2xl border border-white/5 bg-slate-950/30 px-8 py-4 text-sm font-black text-slate-500 shadow-lg shadow-black/10"
          >
            <LockIcon className="h-4 w-4" />
            <span className="relative z-10">Akses Premium</span>
          </div>
        </div>

        {/* Highlight Stats (Glassmorphism Bento Style with Animation) */}
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
                <p className="bg-gradient-to-br from-white to-slate-500 bg-clip-text text-4xl font-black tracking-tighter text-transparent">
                  <AnimatedCounter value={stat.value} />
                </p>
                <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}