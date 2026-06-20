import Link from "next/link";

export default function PortfolioBiodata() {
  return (
    <section className="relative px-5 py-12 text-white sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-10 lg:p-12">
          {/* Subtle glow effects */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl transition duration-700 group-hover:bg-cyan-400/20" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl transition duration-700 group-hover:bg-emerald-400/20" />

          <div className="relative z-10 flex flex-col items-center gap-10 md:flex-row md:items-center md:gap-16">
            {/* Profile Image - 1:1 ratio */}
            <div className="w-48 shrink-0 sm:w-56 md:w-64 lg:w-[280px]">
              <div className="relative aspect-square overflow-hidden rounded-full border border-white/10 shadow-2xl shadow-cyan-400/20 sm:rounded-[32px]">
                <img
                  src="/images/Fotoku-LatarBiru.jpg"
                  alt="Profile picture"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/10 sm:rounded-[32px]" />
              </div>
            </div>

            {/* Biodata Content */}
            <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
              <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300 shadow-lg shadow-emerald-400/5">
                Profile Biodata
              </span>

              <h2 className="mt-6 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                Halo, Saya <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Rins</span>
              </h2>
              
              <p className="mt-2 text-lg font-bold text-emerald-400/90 sm:text-xl">
                Creative Developer & Designer
              </p>

              <div className="mt-6 space-y-4 text-sm font-medium leading-relaxed text-slate-400 sm:text-base">
                <p>
                  Selamat datang di halaman portofolio saya! Saya bersemangat dalam menggabungkan desain estetis dengan teknologi modern untuk menciptakan pengalaman digital yang luar biasa.
                </p>
                <p>
                  Dengan fokus pada UI/UX dan keahlian teknis pengembangan aplikasi berbasis web, saya siap membantu merealisasikan ide-ide kreatif menjadi produk yang fungsional dan berdampak.
                </p>
              </div>

              <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row md:justify-start">
                <Link
                  href="/contact"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-emerald-400 px-8 py-2.5 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:-translate-y-1 hover:bg-emerald-300 sm:w-auto"
                >
                  Hubungi Saya
                </Link>
                <Link
                  href="/products/semua"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] px-8 py-2.5 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-white/[0.1] sm:w-auto"
                >
                  Lihat Produk
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
