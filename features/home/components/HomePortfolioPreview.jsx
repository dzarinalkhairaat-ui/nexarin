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
    <Link href="/portfolio" className="block group">
      <article className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md transition hover:-translate-y-1 hover:bg-slate-800/60 h-full flex flex-col">
        <div className="relative z-10 flex-1 flex flex-col">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-xl shadow-lg shadow-cyan-400/10 transition group-hover:scale-110">
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

          <h3 className="mt-6 text-2xl font-black leading-tight tracking-[-0.05em] text-white group-hover:text-cyan-300 transition-colors">
            {safeProject.title || "Project belum tersedia"}
          </h3>

          <p className="mt-4 text-sm font-medium leading-7 text-slate-400 flex-1">
            {safeProject.description ||
              "Deskripsi project akan ditambahkan saat data sudah siap."}
          </p>

          <div className="mt-6">
            <StackBadges stacks={safeProject.stacks} />
          </div>

          <div className="mt-6 border-t border-white/10 pt-4">
            <span className="inline-flex w-full items-center justify-between text-sm font-black text-cyan-400 transition group-hover:text-cyan-300">
              <span>Lihat Portfolio</span>
              <span aria-hidden="true" className="text-xl transition-transform group-hover:translate-x-1">→</span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function HomePortfolioPreview() {
  const data = homePortfolioPreview || {};
  const featured = data.featured || {};
  const projects = Array.isArray(data.items) ? data.items : [];
  const cta = data.cta || {};

  return (
    <section className="relative overflow-hidden border-t border-white/10 px-5 py-16 sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="relative max-w-3xl">
            <div className="relative z-10">
              <p className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-300 shadow-lg shadow-cyan-400/10">
                <span className="text-sm">💼</span>
                <span>{data.eyebrow || "Portfolio"}</span>
              </p>

              <h2 className="mt-5 text-[2.1rem] font-black leading-[1.02] tracking-[-0.06em] text-white sm:text-5xl">
                {data.title || "Portfolio Nexarin sedang disiapkan."}
              </h2>

              <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-slate-300">
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

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Link href="/portfolio" className="block group">
            <article className="relative h-full overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md transition hover:bg-slate-800/60">
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-2xl shadow-lg shadow-cyan-400/10 transition group-hover:scale-110">
                  📰
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                      {featured.type || "Featured Project"}
                    </p>

                    <h3 className="mt-3 text-3xl font-black leading-tight tracking-[-0.055em] text-white sm:text-4xl group-hover:text-cyan-300 transition-colors">
                      {featured.title || "Featured project belum tersedia"}
                    </h3>
                  </div>

                  <span className="inline-flex w-fit rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-emerald-300">
                    {featured.status || "Preview"}
                  </span>
                </div>

                <p className="mt-5 flex-1 text-sm font-medium leading-7 text-slate-300 sm:text-base">
                  {featured.description ||
                    "Project utama akan ditampilkan di bagian ini."}
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[26px] border border-white/10 bg-slate-950/45 p-5">
                    <p className="flex items-center gap-2 text-sm font-black text-white">
                      <span className="text-emerald-400">⚠</span>
                      <span>Masalah</span>
                    </p>

                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      {featured.problem ||
                        "Konteks masalah project akan ditambahkan nanti."}
                    </p>
                  </div>

                  <div className="rounded-[26px] border border-white/10 bg-slate-950/45 p-5">
                    <p className="flex items-center gap-2 text-sm font-black text-white">
                      <span className="text-cyan-400">✅</span>
                      <span>Solusi</span>
                    </p>

                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      {featured.solution ||
                        "Solusi project akan ditambahkan nanti."}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <StackBadges stacks={featured.stacks} />
                </div>

                <div className="mt-8 border-t border-white/10 pt-5">
                  <span className="inline-flex w-full items-center justify-between text-sm font-black text-cyan-400 transition group-hover:text-cyan-300">
                    <span>Lihat Portfolio</span>
                    <span aria-hidden="true" className="text-xl transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </div>
            </article>
          </Link>

          <div className="grid gap-6">
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