import Link from "next/link";

export default function ProjectCard({ project }) {
  const safeProject = project || {};
  const tags = Array.isArray(safeProject.tags) ? safeProject.tags : [];
  const detailHref = safeProject.slug
    ? `/portfolio/${safeProject.slug}`
    : "/portfolio";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.02] shadow-xl shadow-black/20 transition hover:-translate-y-2 hover:border-emerald-400/20 hover:bg-white/[0.04]">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden border-b border-white/10 bg-slate-900">
        <img 
          src={safeProject.image && safeProject.image !== "/images/logo/nexarin-logo.png" ? safeProject.image : "/images/placeholders/image-placeholder.svg"} 
          alt={safeProject.title || "Project"}
          className="h-full w-full object-cover opacity-50 transition duration-500 group-hover:scale-105 group-hover:opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
        <div className="absolute bottom-4 left-4">
           <p className="inline-flex rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-md">
            {safeProject.category || "Project"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="line-clamp-2 text-2xl font-black leading-tight tracking-[-0.04em] text-white group-hover:text-emerald-300 transition-colors">
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
                className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-bold tracking-wider text-slate-300 border border-white/10"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-bold tracking-wider text-slate-400 border border-white/10">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="mt-8 border-t border-white/10 pt-4">
          <Link
            href={detailHref}
            className="inline-flex w-full items-center justify-between text-sm font-black text-emerald-400 transition hover:text-emerald-300"
          >
            <span>View Details</span>
            <span aria-hidden="true" className="text-xl transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}