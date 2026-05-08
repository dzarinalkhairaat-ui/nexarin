import ScrollReveal from "@/components/shared/ScrollReveal";
import PortfolioHeader from "@/features/portfolio/components/PortfolioHeader";
import PortfolioHero from "@/features/portfolio/components/PortfolioHero";
import FeaturedProject from "@/features/portfolio/components/FeaturedProject";
import ProjectGrid from "@/features/portfolio/components/ProjectGrid";
import PortfolioFooter from "@/features/portfolio/components/PortfolioFooter";

export default function PortfolioPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <PortfolioHeader />

      <ScrollReveal>
        <PortfolioHero />
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <FeaturedProject />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <ProjectGrid />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <PortfolioFooter />
      </ScrollReveal>
    </main>
  );
}