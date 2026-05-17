import Link from "next/link";

export const metadata = {
  title: "Products Sedang Dalam Tahap Pengerjaan",
  description:
    "Halaman Products Nexarin by-rins sedang disiapkan ulang. Untuk sementara, Nexarin berfokus pada pengembangan News dan ekosistem informasi.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    type: "website",
    title: "Products Sedang Dalam Tahap Pengerjaan - Nexarin by-rins",
    description:
      "Katalog Products Nexarin sedang disiapkan ulang dan akan kembali setelah modul Products selesai dibangun.",
    url: "https://nexarin.my.id/products",
    siteName: "Nexarin by-rins",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Products Sedang Dalam Tahap Pengerjaan - Nexarin by-rins",
    description:
      "Halaman Products Nexarin sedang disiapkan ulang dan akan kembali setelah pengembangan selesai.",
  },
};

function RotatingGear() {
  return (
    <div className="relative mx-auto flex h-40 w-40 items-center justify-center sm:h-48 sm:w-48">
      <div className="absolute inset-0 rounded-full border border-emerald-400/15 bg-emerald-400/5 shadow-2xl shadow-emerald-400/10" />
      <div className="absolute inset-5 rounded-full border border-cyan-300/10 bg-cyan-300/5" />
      <div className="absolute h-32 w-32 animate-[spin_18s_linear_infinite] rounded-full border border-dashed border-emerald-300/30 sm:h-40 sm:w-40" />
      <div className="absolute h-24 w-24 animate-[spin_10s_linear_infinite_reverse] rounded-full border border-dashed border-cyan-200/25 sm:h-32 sm:w-32" />

      <svg
        viewBox="0 0 120 120"
        aria-hidden="true"
        className="relative z-10 h-24 w-24 animate-[spin_12s_linear_infinite] text-emerald-300 drop-shadow-[0_0_28px_rgba(52,211,153,0.3)] sm:h-28 sm:w-28"
      >
        <path
          fill="currentColor"
          d="M67.5 10 72 22.7c2.7.9 5.3 2 7.7 3.5L92 20.5 99.5 28 93.8 40.3c1.5 2.4 2.7 5 3.5 7.7L110 52.5v15l-12.7 4.5c-.9 2.7-2 5.3-3.5 7.7L99.5 92 92 99.5l-12.3-5.7c-2.4 1.5-5 2.7-7.7 3.5L67.5 110h-15L48 97.3c-2.7-.9-5.3-2-7.7-3.5L28 99.5 20.5 92l5.7-12.3c-1.5-2.4-2.7-5-3.5-7.7L10 67.5v-15L22.7 48c.9-2.7 2-5.3 3.5-7.7L20.5 28 28 20.5l12.3 5.7c2.4-1.5 5-2.7 7.7-3.5L52.5 10h15ZM60 40a20 20 0 1 0 0 40 20 20 0 0 0 0-40Z"
        />
        <circle cx="60" cy="60" r="10" fill="#020617" />
      </svg>

      <div className="absolute bottom-5 right-6 h-3 w-3 rounded-full bg-emerald-300 shadow-[0_0_22px_rgba(52,211,153,0.75)]" />
      <div className="absolute left-7 top-8 h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(103,232,249,0.55)]" />
    </div>
  );
}

export default function ProductsUnderConstructionRoute() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] px-4 py-5 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(16,185,129,0.14),transparent_30%),radial-gradient(circle_at_86%_72%,rgba(6,182,212,0.1),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-4xl items-center justify-center">
        <div className="relative w-full overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.045] px-5 py-7 text-center shadow-2xl shadow-black/30 backdrop-blur sm:px-8 sm:py-10 lg:px-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/12 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.035] via-transparent to-transparent" />

          <div className="relative z-10 mx-auto max-w-2xl">
            <RotatingGear />

            <p className="mx-auto mt-3 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300 sm:text-[11px]">
              <span>Products</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              <span>Coming Soon</span>
            </p>

            <h1 className="mx-auto mt-5 max-w-2xl text-[2.25rem] font-black leading-[0.95] tracking-[-0.075em] text-white sm:text-5xl lg:text-6xl">
              Products sedang dirapikan ulang.
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-sm font-semibold leading-7 text-slate-400 sm:text-base sm:leading-8">
              Modul Products Nexarin sedang dibangun terpisah agar lebih matang,
              ringan, dan siap kembali sebagai katalog digital yang profesional.
            </p>

            <div className="mx-auto mt-7 grid max-w-md gap-3 sm:flex sm:max-w-none sm:flex-wrap sm:justify-center">
              <Link
                href="/news"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:bg-emerald-300"
              >
                Baca News
              </Link>

              <Link
                href="/"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] px-5 py-3 text-sm font-black text-white transition hover:border-emerald-400/25 hover:bg-emerald-400/10 hover:text-emerald-200"
              >
                Kembali ke Home
              </Link>

              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 text-sm font-black text-emerald-200 transition hover:bg-emerald-400 hover:text-slate-950"
              >
                Hubungi Nexarin
              </Link>
            </div>

            <div className="mx-auto mt-7 max-w-xl border-t border-white/10 pt-5">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                Status
              </p>
              <p className="mt-2 text-base font-black tracking-[-0.035em] text-white sm:text-lg">
                Rebuild terpisah, Products tidak dihapus.
              </p>
              <p className="mx-auto mt-2 max-w-md text-xs font-semibold leading-6 text-slate-500">
                Modulnya diparkir di folder khusus dan bisa dimasukkan kembali
                setelah versi final siap.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
