import Link from "next/link";
import { homePortfolioPreview } from "@/features/home/home.data";

const projectIcons = ["📰", "🚀", "▣"];

function StackBadges({ stacks }) {
  const safeStacks = Array.isArray(stacks) ? stacks : [];

  if (safeStacks.length === 0) {
    return null;
  }

  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {safeStacks.map((stack) => (
        <span
          key={stack}
          className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-cyan-200 shadow-lg shadow-cyan-400/5"
        >
          {stack}
        </span>
      ))}
    </div>
  );
}

function MiniProjectCard({ project, index }) {
  const safeProject = project || {};
  const icon = projectIcons[index + 1] || "◈";

  return (
    <article className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-cyan-400/25 hover:bg-cyan-400/10">
      <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl transition group-hover:bg-cyan-400/20" />
      <div className="pointer-events-none absolute -left-14 bottom-0 h-36 w-36 rounded-full bg-emerald-400/10 blur-3xl" />

      <img
        src="/images/logo/nexarin-logo.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 bottom-6 h-28 w-28 rotate-12 object-contain opacity-[0.035]"
        loading="lazy"
        decoding="async"
      />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-xl shadow-lg shadow-cyan-400/10">
            {icon}
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">
              {safeProject.type || "Project"}
            </p>

            <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
              Showcase
            </p>
          </div>
        </div>

        <h3 className="mt-6 text-2xl font-black leading-tight tracking-[-0.05em] text-white">
          {safeProject.title || "Project belum tersedia"}
        </h3>

        <p className="mt-4 text-sm font-medium leading-7 text-slate-400">
          {safeProject.description ||
            "Deskripsi project akan ditambahkan saat data sudah siap."}
        </p>

        <StackBadges stacks={safeProject.stacks} />
      </div>
    </article>
  );
}

export default function HomePortfolioPreview() {
  const data = homePortfolioPreview || {};
  const featured = data.featured || {};
  const projects = Array.isArray(data.items) ? data.items : [];
  const cta = data.cta || {};

  return (
    <section className="relative overflow-hidden border-t border-white/10 px-5 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_18%,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_12%_75%,rgba(16,185,129,0.12),transparent_36%)]" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

      <img
        src="/images/logo/nexarin-logo.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-20 h-80 w-80 rotate-12 object-contain opacity-[0.06]"
        loading="lazy"
        decoding="async"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="relative max-w-3xl">
            <div className="pointer-events-none absolute -right-20 -top-8 h-72 w-72 rounded-full bg-gradient-to-l from-cyan-400/20 via-emerald-400/10 to-transparent blur-3xl" />

            <div className="relative z-10">
              <p className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-300 shadow-lg shadow-cyan-400/10">
                <span className="text-sm">💼</span>
                <span>{data.eyebrow || "Portfolio"}</span>
              </p>

              <h2 className="mt-5 text-[2.1rem] font-black leading-[1.02] tracking-[-0.06em] text-white sm:text-5xl">
                {data.title || "Portfolio Nexarin sedang disiapkan."}
              </h2>

              <p className="mt-5 max-w-2xl text-base font-semibold leading-8 text-slate-300">
                {data.description ||
                  "Section portfolio ini disiapkan sebagai preview awal."}
              </p>
            </div>
          </div>

          <Link
            href={cta.href || "/portfolio"}
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-3 text-sm font-black text-white shadow-xl shadow-black/10 transition hover:-translate-y-0.5 hover:border-cyan-400/25 hover:bg-cyan-400/10 md:shrink-0"
          >
            {cta.label || "Buka Portfolio"} →
          </Link>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="relative overflow-hidden rounded-[34px] border border-cyan-400/15 bg-white/[0.045] p-5 shadow-2xl shadow-black/30">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/18 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-400/12 blur-3xl" />

            <img
              src="/images/logo/nexarin-logo.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 bottom-8 h-44 w-44 rotate-12 object-contain opacity-[0.04]"
              loading="lazy"
              decoding="async"
            />

            <div className="relative z-10">
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-2xl shadow-lg shadow-cyan-400/10">
                📰
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                    {featured.type || "Featured Project"}
                  </p>

                  <h3 className="mt-3 text-3xl font-black leading-tight tracking-[-0.055em] text-white sm:text-4xl">
                    {featured.title || "Featured project belum tersedia"}
                  </h3>
                </div>

                <span className="inline-flex w-fit rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-emerald-300">
                  {featured.status || "Preview"}
                </span>
              </div>

              <p className="mt-5 text-sm font-medium leading-7 text-slate-300 sm:text-base">
                {featured.description ||
                  "Project utama akan ditampilkan di bagian ini."}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[26px] border border-white/10 bg-slate-950/45 p-4">
                  <p className="flex items-center gap-2 text-sm font-black text-white">
                    <span>⚠</span>
                    <span>Masalah</span>
                  </p>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {featured.problem ||
                      "Konteks masalah project akan ditambahkan nanti."}
                  </p>
                </div>

                <div className="rounded-[26px] border border-white/10 bg-slate-950/45 p-4">
                  <p className="flex items-center gap-2 text-sm font-black text-white">
                    <span>✅</span>
                    <span>Solusi</span>
                  </p>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {featured.solution ||
                      "Solusi project akan ditambahkan nanti."}
                  </p>
                </div>
              </div>

              <StackBadges stacks={featured.stacks} />
            </div>
          </article>

          <div className="grid gap-4">
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <MiniProjectCard
                  key={project?.title || index}
                  project={project}
                  index={index}
                />
              ))
            ) : (
              <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 text-center text-sm font-medium text-slate-400">
                Project belum tersedia.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}