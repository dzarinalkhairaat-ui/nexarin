import { featuredProjectData } from "@/features/portfolio/portfolio.data";

const fallbackTags = ["Next.js", "Tailwind", "Mobile-first"];

function InfoBox({ title, text, icon }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-slate-950/55 p-4 shadow-lg shadow-black/10">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-lg"
        >
          {icon}
        </span>

        <div className="min-w-0">
          <p className="text-sm font-black text-white">{title}</p>
          <p className="mt-1 text-sm font-medium leading-6 text-slate-400">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

function FeaturedPreviewCard({ project, tags }) {
  return (
    <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-slate-950/55 p-4 shadow-2xl shadow-black/25">
      <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-emerald-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-14 bottom-0 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-emerald-400/25 bg-slate-950 p-2 shadow-xl shadow-emerald-400/10">
            <img
              src="/images/logo/nexarin-logo.png"
              alt="Nexarin logo"
              className="h-full w-full object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="min-w-0">
            <p className="truncate text-base font-black tracking-[-0.03em] text-white">
              {project.title || "Featured Project"}
            </p>

            <div className="mt-1 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/40" />
              <p className="truncate text-xs font-semibold text-slate-400">
                Reference project
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-[22px] border border-white/10 bg-white/[0.045] p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
              Type
            </p>
            <p className="mt-1 text-sm font-black text-emerald-300">
              News Portal
            </p>
          </div>

          <div className="rounded-[22px] border border-white/10 bg-white/[0.045] p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
              Status
            </p>
            <p className="mt-1 text-sm font-black text-emerald-300">
              Reference
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.13em] text-emerald-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProject() {
  const project = featuredProjectData || {};
  const tags = Array.isArray(project.tags) && project.tags.length > 0
    ? project.tags
    : fallbackTags;

  return (
    <section className="px-5 py-5 text-white sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <article className="relative overflow-hidden rounded-[34px] border border-emerald-400/15 bg-white/[0.045] p-4 shadow-2xl shadow-black/25 sm:p-5 lg:p-6">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/18 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

          <div className="relative z-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.64fr)] lg:items-center">
            <div>
              <p className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-300">
                {project.category || "Featured Project"}
              </p>

              <h2 className="mt-4 text-3xl font-black leading-[1] tracking-[-0.06em] text-white sm:text-5xl">
                {project.title || "RinsNews Portal"}
              </h2>

              <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-300 sm:text-base sm:leading-8">
                {project.description ||
                  "Project unggulan Nexarin akan ditampilkan di sini."}
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <InfoBox
                  icon="⚠️"
                  title="Masalah"
                  text={
                    project.problem ||
                    "Masalah project akan dijelaskan secara singkat."
                  }
                />

                <InfoBox
                  icon="✅"
                  title="Solusi"
                  text={
                    project.solution ||
                    "Solusi project akan dijelaskan secara singkat."
                  }
                />
              </div>
            </div>

            <FeaturedPreviewCard project={project} tags={tags} />
          </div>
        </article>
      </div>
    </section>
  );
}