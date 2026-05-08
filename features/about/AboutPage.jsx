import ScrollReveal from "@/components/shared/ScrollReveal";
import AboutHeader from "@/features/about/components/AboutHeader";
import AboutHero from "@/features/about/components/AboutHero";
import AboutStory from "@/features/about/components/AboutStory";
import AboutValues from "@/features/about/components/AboutValues";
import AboutFooter from "@/features/about/components/AboutFooter";

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <AboutHeader />

      <ScrollReveal>
        <AboutHero />
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <AboutStory />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <AboutValues />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <AboutFooter />
      </ScrollReveal>
    </main>
  );
}