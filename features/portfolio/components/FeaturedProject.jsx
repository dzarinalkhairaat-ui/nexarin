import Link from "next/link";
import { featuredProjectData } from "@/features/portfolio/portfolio.data";

const fallbackTags = ["Next.js", "Tailwind", "Mobile-first"];

export default function FeaturedProject() {
  const project = featuredProjectData || {};
  const tags = Array.isArray(project.tags) && project.tags.length > 0
    ? project.tags
    : fallbackTags;

  const detailHref = project.slug ? `/portfolio/${project.slug}` : "/portfolio";

  return (
    <section className="px-5 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8">
          <h2 className="text-3xl font-black tracking-tight text-white">Featured Project</h2>
          <p className="mt-2 text-sm text-slate-400">Our most recent and proudest work.</p>
        </div>

        <article className="group relative overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.03] p-2 transition hover:border-emerald-400/20 shadow-2xl shadow-black/40">
          <div className="grid lg:grid-cols-2 lg:gap-8">
            {/* Image Section */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[32px] bg-slate-900 lg:aspect-auto lg:h-full border border-white/5">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent z-10 lg:hidden" />
              <img
                src="/images/placeholders/image-placeholder.svg"
                alt={project.title || "Featured Project"}
                className="h-full w-full object-cover opacity-60 transition duration-700 group-hover:scale-105 group-hover:opacity-80"
              />
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center opacity-40 mix-blend-overlay">
                <p className="text-3xl font-black tracking-widest text-slate-500 uppercase">{project.title}</p>
                <p className="text-sm font-bold tracking-widest text-slate-600 uppercase mt-2">MOCKUP IMAGE</p>
              </div>
            </div>

            {/* Content Section */}
            <div className="relative z-20 flex flex-col justify-center p-6 sm:p-10 lg:pl-4">
              <p className="inline-flex w-fit rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300">
                {project.category || "Featured Project"}
              </p>

              <h3 className="mt-6 text-4xl font-black leading-tight tracking-[-0.04em] text-white lg:text-5xl">
                {project.title || "RinsNews Portal"}
              </h3>

              <p className="mt-5 text-base font-medium leading-relaxed text-slate-300">
                {project.description ||
                  "Project unggulan Nexarin akan ditampilkan di sini."}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] border border-white/10 bg-slate-950/50 p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-400">The Problem</p>
                  <p className="mt-3 text-sm font-medium leading-6 text-slate-300 line-clamp-3">
                    {project.problem || "Masalah project akan dijelaskan secara singkat."}
                  </p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-slate-950/50 p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-cyan-400">The Solution</p>
                  <p className="mt-3 text-sm font-medium leading-6 text-slate-300 line-clamp-3">
                    {project.solution || "Solusi project akan dijelaskan secara singkat."}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <Link
                  href={detailHref}
                  className="inline-flex items-center gap-2 text-sm font-black text-emerald-400 transition hover:text-emerald-300"
                >
                  <span>View Case Study</span>
                  <span aria-hidden="true" className="text-lg transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}