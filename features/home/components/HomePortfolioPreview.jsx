import Link from "next/link";
import { homePortfolioPreview } from "@/features/home/home.data";

const BriefcaseIcon = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.896 1.982-2.007 1.996H5.757c-1.11.014-2.007-.874-2.007-1.996v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
  </svg>
);

const CodeIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
  </svg>
);

const LayoutIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6Zm0 9.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25v-2.25Zm9.75-9.75A2.25 2.25 0 0 1 15.75 3.75h2.25A2.25 2.25 0 0 1 20.25 6v2.25a2.25 2.25 0 0 1-2.25 2.25h-2.25a2.25 2.25 0 0 1-2.25-2.25V6Zm0 9.75A2.25 2.25 0 0 1 15.75 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25v2.25a2.25 2.25 0 0 1-2.25 2.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
  </svg>
);

const projectIcons = [<CodeIcon key="1" />, <LayoutIcon key="2" />];

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
  const icon = projectIcons[index] || <LayoutIcon className="h-6 w-6" />;

  return (
    <Link href="/portfolio" className="block group">
      <article className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.02] p-6 shadow-xl backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/[0.04] h-full flex flex-col">
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
  const projects = Array.isArray(data.items) ? data.items : [];
  const cta = data.cta || {};

  return (
    <section className="relative px-5 py-16 sm:px-6 lg:px-8">
      {/* Background Glows */}
      <div className="pointer-events-none absolute left-0 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/5 blur-[120px]" />
      
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="relative max-w-3xl">
            <div className="relative z-10">
              <p className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-300 shadow-lg shadow-cyan-400/10">
                <BriefcaseIcon className="h-4 w-4" />
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

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <MiniProjectCard
                key={project?.title || index}
                project={project}
                index={index}
              />
            ))
          ) : (
            <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 text-center text-sm font-medium text-slate-400 sm:col-span-2">
              Project belum tersedia.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}