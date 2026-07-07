import Link from "next/link";
import { homeData } from "@/features/home/home.data";
import { DagangIcon, NewsIcon } from "@/components/shared/MenuIcons";
import { FileText } from "lucide-react";

const CheckIcon = ({ className = "h-3.5 w-3.5", style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.88 15.36L5.28 12.5l1.41-1.41 3.43 3.43 7.82-7.83 1.41 1.42-9.23 9.25z"/>
  </svg>
);

const HERO_DESCRIPTION =
  "Website All-in-One by-rins untuk portal informasi, showcase, dan portfolio.";

export default function HomeHero() {
  const data = homeData || {};

  return (
    <section className="relative px-5 pb-8 pt-10 text-center sm:px-6 sm:pt-16 sm:pb-10 lg:px-8" style={{ backgroundColor: '#030711' }}>
      <style>{`
        .nx-hero-btn {
          background-color: #0A1121;
          border: 1px solid #1A2B47;
          transition: all 0.3s ease;
        }
        .nx-hero-btn:hover {
          border-color: #0DF2A3;
          background-color: rgba(13,242,163,0.08);
          box-shadow: 0 0 20px rgba(13,242,163,0.15), 0 0 40px rgba(13,242,163,0.05);
        }
      `}</style>

      {/* Grid Pattern Background */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-100"
        style={{
          backgroundImage: `linear-gradient(rgba(26,43,71,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(26,43,71,0.4) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Radial glow center behind text */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: 'radial-gradient(ellipse 600px 500px at 50% 40%, #0A1121 0%, transparent 70%)',
        }}
      />


      {/* Top neon glow accent */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 z-[2] h-[500px] w-[700px] -translate-x-1/2 rounded-full blur-[140px]"
        style={{ backgroundColor: 'rgba(13,242,163,0.07)' }}
      />

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Badge — Glassmorphism pill */}
        <p
          className="inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-xs font-black uppercase tracking-[0.24em] shadow-lg backdrop-blur-md"
          style={{
            backgroundColor: 'rgba(13,242,163,0.08)',
            border: '1px solid rgba(13,242,163,0.2)',
            color: '#0DF2A3',
            boxShadow: '0 0 30px rgba(13,242,163,0.08), 0 4px 15px rgba(0,0,0,0.3)',
          }}
        >
          <span className="relative flex h-2 w-2">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
              style={{ backgroundColor: '#0DF2A3' }}
            />
            <span
              className="relative inline-flex h-2 w-2 rounded-full"
              style={{ backgroundColor: '#0DF2A3' }}
            />
          </span>
          {data.eyebrow || "Nexarin by-rins"}
        </p>

        {/* Headline */}
        <h1 className="mx-auto mt-8 text-5xl font-black leading-[1.05] tracking-[-0.04em] text-white sm:text-6xl lg:text-[5rem]">
          Digital ecosystem <br className="hidden sm:block" />
          <span
            style={{
              color: '#0DF2A3',
              textShadow: '0 0 30px rgba(13,242,163,0.4), 0 0 60px rgba(13,242,163,0.15)',
            }}
          >
            by-rins.
          </span>
        </h1>

        {/* Description */}
        <p
          className="mx-auto mt-8 max-w-2xl text-lg font-medium leading-relaxed sm:text-xl"
          style={{ color: '#708090' }}
        >
          {HERO_DESCRIPTION}
        </p>

        {/* Action Buttons — Ghost Button Premium (CSS-only hover) */}
        <div className="mt-10 flex flex-row flex-wrap items-center justify-center gap-3 sm:gap-5">
          <Link
            href="/dagang"
            className="nx-hero-btn group inline-flex h-11 sm:h-12 items-center justify-center rounded-xl px-4 sm:px-8 text-sm sm:text-base font-bold text-white active:scale-95 hover:scale-105"
          >
            <span className="flex items-center gap-1.5 sm:gap-2 transition-transform duration-300 group-hover:-translate-y-[2px]">
              <DagangIcon className="h-4 w-4 sm:h-5 sm:w-5 opacity-70 transition-colors group-hover:opacity-100" />
              Belanja
            </span>
          </Link>

          <Link
            href="/news"
            className="nx-hero-btn group inline-flex h-11 sm:h-12 items-center justify-center rounded-xl px-4 sm:px-8 text-sm sm:text-base font-bold text-white active:scale-95 hover:scale-105"
          >
            <span className="flex items-center gap-1.5 sm:gap-2 transition-transform duration-300 group-hover:-translate-y-[2px]">
              <NewsIcon className="h-4 w-4 sm:h-5 sm:w-5 opacity-70 transition-colors group-hover:opacity-100" />
              News
            </span>
          </Link>

          <Link
            href="/pdf-tools"
            className="nx-hero-btn group inline-flex h-11 sm:h-12 items-center justify-center rounded-xl px-4 sm:px-8 text-sm sm:text-base font-bold text-white active:scale-95 hover:scale-105"
          >
            <span className="flex items-center gap-1.5 sm:gap-2 transition-transform duration-300 group-hover:-translate-y-[2px]">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 opacity-70 transition-colors group-hover:opacity-100" />
              PDF Tools
            </span>
          </Link>
        </div>

        {/* Feature Tags */}
        <div className="mt-6 flex items-center justify-center gap-4 sm:gap-6 text-[10.5px] sm:text-[11.5px] font-black uppercase tracking-wider overflow-hidden" style={{ color: '#708090' }}>
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <CheckIcon className="h-4 w-4" style={{ color: '#0DF2A3', filter: 'drop-shadow(0 0 8px rgba(13,242,163,0.5))' }} /> Terpercaya
          </span>
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <CheckIcon className="h-4 w-4" style={{ color: '#3B82F6', filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.5))' }} /> Akurat
          </span>
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <CheckIcon className="h-4 w-4" style={{ color: '#0DF2A3', filter: 'drop-shadow(0 0 8px rgba(13,242,163,0.5))' }} /> SatSet
          </span>
        </div>
      </div>
    </section>
  );
}