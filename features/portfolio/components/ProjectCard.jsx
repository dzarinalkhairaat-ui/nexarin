import Link from "next/link";

export default function ProjectCard({ project }) {
  const safeProject = project || {};
  const tags = Array.isArray(safeProject.tags) ? safeProject.tags : [];
  const detailHref = safeProject.slug
    ? `/portfolio/${safeProject.slug}`
    : "/portfolio";

  return (
    <article className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-emerald-400/20 hover:bg-white/[0.06]">
      <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-emerald-400/10 blur-3xl opacity-0 transition group-hover:opacity-100" />

      <div className="relative z-10">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
          {safeProject.category || "Project"}
        </p>

        <h3 className="mt-4 line-clamp-2 text-2xl font-black leading-tight tracking-[-0.045em] text-white">
          {safeProject.title || "Project Nexarin"}
        </h3>

        <p className="mt-3 inline-flex rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-300">
          {safeProject.status || "Preview"}
        </p>

        <p className="mt-4 line-clamp-4 text-sm font-medium leading-7 text-slate-400">
          {safeProject.description ||
            "Deskripsi project akan ditambahkan saat data portfolio sudah siap."}
        </p>

        {tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-cyan-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <Link
          href={detailHref}
          className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-xs font-black text-emerald-200 transition hover:bg-emerald-400 hover:text-slate-950"
        >
          <span>Detail Project</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}