import Link from "next/link";

function BackIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none">
      <path
        d="M15 6 9 12l6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

export default function ArticleHeader() {
  return (
    <header className="relative z-40 border-b border-white/10 bg-slate-950/92 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(16,185,129,0.14),transparent_34%),radial-gradient(circle_at_88%_12%,rgba(6,182,212,0.11),transparent_30%)]" />

      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/35 to-transparent" />
      <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-[40px_1fr_40px] items-center gap-3 px-5 py-3 sm:px-6 lg:px-8">
        <Link
          href="/news"
          aria-label="Kembali ke News"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[17px] border border-emerald-300/15 bg-white/[0.055] text-emerald-200 shadow-lg shadow-black/20 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-emerald-300/35 hover:bg-emerald-400/10"
        >
          <BackIcon />
        </Link>

        <Link
          href="/news"
          aria-label="Detail Artikel News"
          className="min-w-0 text-center outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
        >
          <p className="truncate text-[1rem] font-black leading-tight tracking-[-0.04em]">
            <span className="bg-gradient-to-r from-white via-emerald-100 to-cyan-200 bg-clip-text text-transparent">
              Detail
            </span>
            <span className="text-cyan-300"> Artikel</span>
          </p>

          <div className="mt-1 flex items-center justify-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/40" />
            <p className="truncate text-[11px] font-bold leading-none text-slate-500">
              Nexarin-news
            </p>
          </div>
        </Link>

        <div aria-hidden="true" className="h-10 w-10" />
      </div>
    </header>
  );
}