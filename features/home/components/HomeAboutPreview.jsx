import Link from "next/link";
import { homeAboutPreview } from "@/features/home/home.data";

const valueIcons = ["🛡️", "📱", "✨"];

function ValueCard({ value, index }) {
  const safeValue = value || {};
  const number = String(index + 1).padStart(2, "0");
  const icon = valueIcons[index] || "✦";

  return (
    <article className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md transition hover:-translate-y-1 hover:bg-slate-800/60">
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-2xl shadow-lg shadow-emerald-400/10 transition group-hover:scale-110">
            {icon}
          </div>

          <span className="rounded-full border border-white/10 bg-slate-950/45 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-300">
            {number}
          </span>
        </div>

        <h3 className="mt-6 text-xl font-black leading-tight tracking-[-0.045em] text-white group-hover:text-emerald-300 transition-colors">
          {safeValue.title || "Value"}
        </h3>

        <p className="mt-3 text-sm font-medium leading-relaxed text-slate-400">
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
    <section className="relative overflow-hidden px-5 py-16 sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="relative">
            <div className="relative z-10">
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-emerald-300 shadow-lg shadow-emerald-400/10">
                <span className="text-sm">◎</span>
                <span>{data.eyebrow || "About"}</span>
              </p>

              <h2 className="mt-5 text-[2.1rem] font-black leading-[1.02] tracking-[-0.06em] text-white sm:text-5xl">
                {data.title || "Tentang Nexarin by-rins."}
              </h2>

              <p className="mt-5 text-base font-medium leading-8 text-slate-300">
                {data.description ||
                  "Nexarin adalah ekosistem digital yang sedang dikembangkan."}
              </p>

              <div className="mt-8 relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md">
                <div className="relative z-10">
                  <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-cyan-300">
                    <span>📌</span>
                    <span>Cerita singkat</span>
                  </p>

                  <p className="mt-4 text-sm font-medium leading-relaxed text-slate-400">
                    {data.story ||
                      "Cerita tentang Nexarin akan dikembangkan bertahap."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            {values.length > 0 ? (
              values.map((value, index) => (
                <ValueCard
                  key={value?.title || index}
                  value={value}
                  index={index}
                />
              ))
            ) : (
              <div className="rounded-[28px] border border-white/10 bg-slate-900/40 p-6 text-center text-sm font-medium text-slate-400">
                Value belum tersedia.
              </div>
            )}
          </div>
        </div>

        <div className="mt-16">
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/40 p-6 sm:p-10 shadow-xl backdrop-blur-md">
            <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-cyan-200">
                  <span>🤝</span>
                  <span>{cta.eyebrow || "Contact"}</span>
                </p>

                <h2 className="mt-5 max-w-3xl text-[2rem] font-black leading-[1.02] tracking-[-0.06em] text-white sm:text-5xl">
                  {cta.title || "Hubungi Nexarin."}
                </h2>

                <p className="mt-5 max-w-2xl text-sm font-medium leading-relaxed text-slate-300 sm:text-base">
                  {cta.description ||
                    "Jalur contact akan disiapkan untuk kebutuhan kerja sama dan custom project."}
                </p>
              </div>

              <div className="grid gap-3 sm:flex lg:justify-end">
                <Link
                  href={primary.href || "/contact"}
                  className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-emerald-400 px-8 py-4 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:-translate-y-1 hover:bg-emerald-300"
                >
                  {primary.label || "Hubungi Nexarin"}
                </Link>

                <Link
                  href={secondary.href || "/about"}
                  className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-8 py-4 text-sm font-black text-white transition hover:-translate-y-1 hover:border-emerald-400/25 hover:bg-emerald-400/10"
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