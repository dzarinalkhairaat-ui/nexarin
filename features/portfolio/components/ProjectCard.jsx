import Link from "next/link";

export default function ProjectCard({ project }) {
  const safeProject = project || {};
  const tags = Array.isArray(safeProject.tags) ? safeProject.tags : [];
  const detailHref = safeProject.slug
    ? `/portfolio/${safeProject.slug}`
    : "/portfolio";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[32px] border border-white/5 bg-slate-900/50 backdrop-blur-sm shadow-xl transition-all duration-500 hover:-translate-y-2 hover:border-emerald-400/30 hover:bg-white/[0.04] hover:shadow-2xl hover:shadow-emerald-500/10">
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-white/5 bg-slate-950">
        <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-10" />
        <img 
          src={safeProject.image && safeProject.image !== "/images/logo/nexarin-logo.png" ? safeProject.image : "/images/placeholders/image-placeholder.svg"} 
          alt={safeProject.title || "Project"}
          className="h-full w-full object-cover opacity-60 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10" />
        
        <div className="absolute bottom-5 left-5 z-20">
           <p className="inline-flex rounded-full border border-white/20 bg-black/50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-white backdrop-blur-md">
            {safeProject.category || "Project"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <h3 className="line-clamp-2 text-2xl font-black leading-tight tracking-[-0.02em] text-white transition-colors duration-300 group-hover:text-emerald-400">
          {safeProject.title || "Project Nexarin"}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm font-medium leading-relaxed text-slate-400 flex-1">
          {safeProject.description ||
            "Deskripsi project akan ditambahkan saat data portfolio sudah siap."}
        </p>

        {tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-bold tracking-wider text-slate-300 border border-white/5 transition-colors group-hover:border-emerald-400/20 group-hover:text-emerald-300"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-bold tracking-wider text-slate-500 border border-white/5">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="mt-8 border-t border-white/5 pt-5">
          <Link
            href={detailHref}
            className="inline-flex w-full items-center justify-between text-sm font-black text-slate-300 transition-colors duration-300 group-hover:text-emerald-400"
          >
            <span>View Case Study</span>
            <span aria-hidden="true" className="text-xl transition-transform duration-300 group-hover:translate-x-2">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}