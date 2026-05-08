import Link from "next/link";

export default function AdminNewsHeader() {
  return (
    <section className="relative overflow-hidden px-5 pb-5 pt-7 text-white sm:px-6 sm:pb-7 sm:pt-10 lg:px-8">
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

      <img
        src="/images/logo/nexarin-logo.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-20 h-72 w-72 rotate-12 object-contain opacity-[0.035] sm:h-96 sm:w-96"
        loading="lazy"
        decoding="async"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="text-center lg:text-left">
          <p className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-emerald-300 shadow-lg shadow-emerald-400/5">
            News Manager
          </p>

          <h1 className="mx-auto mt-5 max-w-3xl text-[2.35rem] font-black leading-[0.96] tracking-[-0.065em] text-white sm:text-6xl lg:mx-0">
            Kelola konten News.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm font-medium leading-7 text-slate-300 sm:text-base sm:leading-8 lg:mx-0">
            Area admin untuk mengatur artikel, kategori, draft, dan publish
            Nexarin News.
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:max-w-xl">
          <button
            type="button"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:bg-emerald-300"
          >
            Tambah Artikel
          </button>

          <Link
            href="/admin"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-black text-white shadow-xl shadow-black/10 transition hover:border-emerald-400/25 hover:bg-emerald-400/10"
          >
            Dashboard Utama
          </Link>
        </div>
      </div>
    </section>
  );
}