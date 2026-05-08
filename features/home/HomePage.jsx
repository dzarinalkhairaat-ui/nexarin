import ScrollReveal from "@/components/shared/ScrollReveal";
import HomeHeader from "@/features/home/components/HomeHeader";
import HomeHero from "@/features/home/components/HomeHero";
import HomeProductsPreview from "@/features/home/components/HomeProductsPreview";
import HomePortfolioPreview from "@/features/home/components/HomePortfolioPreview";
import HomeNewsPreview from "@/features/home/components/HomeNewsPreview";
import HomeAboutPreview from "@/features/home/components/HomeAboutPreview";
import HomeFooter from "@/features/home/components/HomeFooter";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <HomeHeader />

      <ScrollReveal delay={0}>
        <HomeHero />
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <HomeProductsPreview />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <HomePortfolioPreview />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <HomeNewsPreview />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <HomeAboutPreview />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <HomeFooter />
      </ScrollReveal>
    </main>
  );
}