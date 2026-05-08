import Logo from "@/components/shared/Logo";

export default function UnderConstruction({
  title = "Halaman sedang disiapkan",
  description = "Bagian ini sedang dibangun pelan-pelan agar tetap rapi, stabil, dan mobile-first.",
}) {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 px-5 py-6 text-white">
      <section className="relative mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-5xl flex-col justify-between overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/30">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative z-10">
          <Logo />
        </div>

        <div className="relative z-10 my-16 max-w-2xl">
          <p className="mb-3 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Nexarin by-rins
          </p>

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
            {title}
          </h1>

          <p className="mt-5 text-base leading-7 text-slate-300 sm:text-lg">
            {description}
          </p>
        </div>

        <div className="relative z-10 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-slate-400">
          Stabil dulu. Baru cantik. Target akhir: stabil + cantik + premium + cepat.
        </div>
      </section>
    </main>
  );
}
