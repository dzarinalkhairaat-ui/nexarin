import Link from "next/link";
import { homeAboutPreview } from "@/features/home/home.data";

const ShieldIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const PhoneIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
  </svg>
);

const SparklesIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09l2.846.813-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
);

const TargetIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const PinIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

const MailIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const valueIcons = [<ShieldIcon key="1" />, <PhoneIcon key="2" />, <SparklesIcon key="3" />];

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
                <TargetIcon className="h-4 w-4" />
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
                    <PinIcon className="h-4 w-4" />
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
                  <MailIcon className="h-4 w-4" />
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