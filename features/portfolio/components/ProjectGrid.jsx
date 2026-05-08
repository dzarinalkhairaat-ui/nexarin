import ProjectCard from "@/features/portfolio/components/ProjectCard";
import { portfolioProjects } from "@/features/portfolio/portfolio.data";

export default function ProjectGrid() {
  const projects = Array.isArray(portfolioProjects) ? portfolioProjects : [];

  return (
    <section id="portfolio-projects" className="px-5 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-7 w-1 rounded-full bg-emerald-400" />

          <div>
            <h2 className="text-2xl font-black tracking-[-0.045em] text-white">
              Project Showcase
            </h2>

            <p className="mt-1 text-xs font-semibold text-slate-500">
              Fondasi awal portfolio Nexarin
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <ProjectCard
                key={`${project?.title || "project"}-${index}`}
                project={project}
              />
            ))
          ) : (
            <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 text-center text-sm font-medium text-slate-400 md:col-span-2 lg:col-span-3">
              Project belum tersedia.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}