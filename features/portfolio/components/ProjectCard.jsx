import Link from "next/link";

export default function ProjectCard({ project }) {
  const safeProject = project || {};
  const tags = Array.isArray(safeProject.tags) ? safeProject.tags : [];
  const detailHref = safeProject.slug
    ? `/portfolio/${safeProject.slug}`
    : "/portfolio";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[2.5rem] bg-slate-900/40 border border-white/[0.08] p-2 transition-all duration-500 hover:bg-slate-800/60 hover:shadow-[0_0_80px_-20px_rgba(52,211,153,0.15)] hover:-translate-y-2">
      {/* Premium Glow effect behind card on hover */}
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-br from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 opacity-0 blur-2xl transition-all duration-500 group-hover:from-emerald-500/10 group-hover:via-emerald-500/5 group-hover:opacity-100" />
      
      {/* Thumbnail Container */}
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-[2rem] bg-slate-950">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-40" />
        <div className="absolute inset-0 z-10 bg-emerald-500/10 opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-100" />
        
        <img
          src={safeProject.image && safeProject.image !== "/images/logo/nexarin-logo.png" ? safeProject.image : "/images/placeholders/image-placeholder.svg"}
          alt={safeProject.title || "Project"}
          className="h-full w-full object-cover opacity-80 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-100"
        />

        {/* Category Pill Over Image */}
        <div className="absolute left-4 top-4 z-20">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white backdrop-blur-md transition-colors duration-300 group-hover:border-emerald-400/50 group-hover:bg-emerald-500/20 group-hover:text-emerald-100">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {safeProject.category || "Project"}
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex flex-1 flex-col p-5 sm:p-7">
        <div className="flex-1">
          <h3 className="line-clamp-2 text-2xl font-black leading-tight tracking-tight text-white transition-colors duration-300 group-hover:text-emerald-400">
            {safeProject.title || "Project Nexarin"}
          </h3>

          <p className="mt-4 line-clamp-3 text-sm font-medium leading-relaxed text-slate-400">
            {safeProject.description || "Deskripsi project belum ditambahkan."}
          </p>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-xl border border-white/5 bg-white/5 px-2.5 py-1 text-[11px] font-bold tracking-wide text-slate-300 transition-colors group-hover:border-emerald-400/20 group-hover:bg-emerald-500/10 group-hover:text-emerald-300"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="rounded-xl border border-white/5 bg-white/5 px-2.5 py-1 text-[11px] font-bold tracking-wide text-slate-500">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="mt-8">
          <Link
            href={detailHref}
            className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white/[0.03] px-6 py-3.5 text-sm font-black tracking-wide text-white transition-all duration-300 hover:bg-emerald-400 hover:text-slate-950 hover:shadow-lg hover:shadow-emerald-400/20"
          >
            <span>View Case Study</span>
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}