import ScrollReveal from "@/components/shared/ScrollReveal";
import Header from "@/components/shared/Header";
import PortfolioHero from "@/features/portfolio/components/PortfolioHero";
import PortfolioBiodata from "@/features/portfolio/components/PortfolioBiodata";
import ProjectGrid from "@/features/portfolio/components/ProjectGrid";
import PortfolioFooter from "@/features/portfolio/components/PortfolioFooter";
import { getPortfolioProjects, seedPortfolioProjects } from "@/features/portfolio/portfolio.actions";

export default async function PortfolioPage() {
  let projects = await getPortfolioProjects();

  // Temporary auto-seed if DB is empty
  if (projects.length > 0 && !projects[0].id) {
    await seedPortfolioProjects();
    projects = await getPortfolioProjects();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white selection:bg-emerald-400/30">
      <Header />

      <ScrollReveal>
        <PortfolioHero />
      </ScrollReveal>

      <ScrollReveal delay={40}>
        <PortfolioBiodata />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <ProjectGrid projects={projects} />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <PortfolioFooter />
      </ScrollReveal>
    </main>
  );
}