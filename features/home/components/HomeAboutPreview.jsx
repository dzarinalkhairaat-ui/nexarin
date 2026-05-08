import Link from "next/link";
import { homeAboutPreview } from "@/features/home/home.data";

const valueIcons = ["🛡️", "📱", "✨"];

function ValueCard({ value, index }) {
  const safeValue = value || {};
  const number = String(index + 1).padStart(2, "0");
  const icon = valueIcons[index] || "✦";

  return (
    <article className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-emerald-400/25 hover:bg-emerald-400/10">
      <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl transition group-hover:bg-emerald-400/20" />
      <div className="pointer-events-none absolute -left-14 bottom-0 h-36 w-36 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-xl shadow-lg shadow-emerald-400/10">
            {icon}
          </div>

          <span className="rounded-full border border-white/10 bg-slate-950/45 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-300">
            {number}
          </span>
        </div>

        <h3 className="mt-5 text-xl font-black leading-tight tracking-[-0.045em] text-white">
          {safeValue.title || "Value"}
        </h3>

        <p className="mt-3 text-sm font-medium leading-7 text-slate-400">
          {safeValue.description || "Deskripsi value akan ditambahkan nanti."}
        </p>
      </div>
    </article>
  );
}

export default function HomeAboutPreview() {
  const data = homeAboutPreview || {};
  const values = Array.isArray(data.values) ? data.values : [];
  const cta = data.cta || {};
  const primary = cta.primary || {};
  const secondary = cta.secondary || {};

  return (
    <section className="relative overflow-hidden border-t border-white/10 px-5 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_84%_18%,rgba(16,185,129,0.16),transparent_34%),radial-gradient(circle_at_12%_78%,rgba(6,182,212,0.12),transparent_36%)]" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

      <img
        src="/images/logo/nexarin-logo.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-20 h-80 w-80 rotate-12 object-contain opacity-[0.055]"
        loading="lazy"
        decoding="async"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="relative">
            <div className="pointer-events-none absolute -right-16 -top-10 h-72 w-72 rounded-full bg-gradient-to-l from-emerald-400/20 via-cyan-400/10 to-transparent blur-3xl" />

            <div className="relative z-10">
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-emerald-300 shadow-lg shadow-emerald-400/10">
                <span className="text-sm">◎</span>
                <span>{data.eyebrow || "About"}</span>
              </p>

              <h2 className="mt-5 text-[2.1rem] font-black leading-[1.02] tracking-[-0.06em] text-white sm:text-5xl">
                {data.title || "Tentang Nexarin by-rins."}
              </h2>

              <p className="mt-5 text-base font-semibold leading-8 text-slate-300">
                {data.description ||
                  "Nexarin adalah ekosistem digital yang sedang dikembangkan."}
              </p>

              <div className="mt-6 relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-black/20">
                <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

                <div className="relative z-10">
                  <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-cyan-300">
                    <span>📌</span>
                    <span>Cerita singkat</span>
                  </p>

                  <p className="mt-4 text-sm font-medium leading-7 text-slate-400">
                    {data.story ||
                      "Cerita tentang Nexarin akan dikembangkan bertahap."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {values.length > 0 ? (
              values.map((value, index) => (
                <ValueCard
                  key={value?.title || index}
                  value={value}
                  index={index}
                />
              ))
            ) : (
              <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 text-center text-sm font-medium text-slate-400">
                Value belum tersedia.
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-[34px] border border-emerald-400/15 bg-white/[0.045] p-4 shadow-2xl shadow-black/30">
          <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-slate-950/75 p-5 sm:p-7">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-400/18 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-400/12 blur-3xl" />

            <img
              src="/images/logo/nexarin-logo.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -right-8 bottom-4 h-44 w-44 rotate-12 object-contain opacity-[0.04]"
              loading="lazy"
              decoding="async"
            />

            <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-cyan-200">
                  <span>🤝</span>
                  <span>{cta.eyebrow || "Contact"}</span>
                </p>

                <h2 className="mt-5 max-w-3xl text-[2rem] font-black leading-[1.02] tracking-[-0.06em] text-white sm:text-5xl">
                  {cta.title || "Hubungi Nexarin."}
                </h2>

                <p className="mt-5 max-w-2xl text-sm font-medium leading-7 text-slate-300 sm:text-base">
                  {cta.description ||
                    "Jalur contact akan disiapkan untuk kebutuhan kerja sama dan custom project."}
                </p>
              </div>

              <div className="grid gap-3 sm:flex lg:justify-end">
                <Link
                  href={primary.href || "/contact"}
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:-translate-y-0.5 hover:bg-emerald-300"
                >
                  {primary.label || "Hubungi Nexarin"}
                </Link>

                <Link
                  href={secondary.href || "/about"}
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:border-emerald-400/25 hover:bg-emerald-400/10"
                >
                  {secondary.label || "Lihat About"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}