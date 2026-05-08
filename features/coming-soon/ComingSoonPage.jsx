import Logo from "@/components/shared/Logo";

function SpinningGearIcon() {
  return (
    <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-400/10 shadow-lg shadow-emerald-400/10">
      <svg
        className="h-7 w-7 animate-[spin_6s_linear_infinite] text-emerald-300"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 15.25A3.25 3.25 0 1 0 12 8.75a3.25 3.25 0 0 0 0 6.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M19.4 13.5c.08-.49.1-.99.06-1.5.04-.51.02-1.01-.06-1.5l2.02-1.56-2-3.46-2.4.96a8.04 8.04 0 0 0-2.6-1.5L14.06 2h-4.12l-.36 2.94a8.04 8.04 0 0 0-2.6 1.5l-2.4-.96-2 3.46L4.6 10.5c-.08.49-.1.99-.06 1.5-.04.51-.02 1.01.06 1.5l-2.02 1.56 2 3.46 2.4-.96a8.04 8.04 0 0 0 2.6 1.5l.36 2.94h4.12l.36-2.94a8.04 8.04 0 0 0 2.6-1.5l2.4.96 2-3.46L19.4 13.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 px-4 py-4 text-white">
      <section className="relative mx-auto flex min-h-[calc(100vh-32px)] w-full max-w-6xl flex-col overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-5 shadow-2xl shadow-black/40 sm:px-8 sm:py-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="pointer-events-none absolute left-1/3 top-1/4 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-lime-400/10 blur-3xl" />

        <div className="relative z-10">
          <Logo />
        </div>

        <div className="relative z-10 flex flex-1 items-center py-10">
          <div className="w-full max-w-3xl">
            <div className="mb-7 flex items-center gap-3">
              <SpinningGearIcon />

              <p className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-emerald-300 shadow-lg shadow-emerald-400/5">
                Coming Soon
              </p>
            </div>

            <h1 className="max-w-[620px] text-[2.35rem] font-black leading-[0.98] tracking-[-0.05em] text-white sm:text-6xl">
              Nexarin by-rins sedang disiapkan.
            </h1>

            <p className="mt-5 max-w-[560px] text-[15px] font-medium leading-7 text-slate-300 sm:text-lg">
              All-in-One Digital Ecosystem untuk produk digital, portfolio,
              news, dan karya by-rins.
            </p>
          </div>
        </div>

        <div className="relative z-10 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-[13px] font-medium leading-6 text-slate-400">
          Fokus dibangun stabil, premium, ringan, dan mobile-first.
        </div>
      </section>
    </main>
  );
}