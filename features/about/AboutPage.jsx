import ScrollReveal from "@/components/shared/ScrollReveal";
import Header from "@/components/shared/Header";
import AboutHero from "@/features/about/components/AboutHero";
import AboutStory from "@/features/about/components/AboutStory";
import AboutValues from "@/features/about/components/AboutValues";

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white selection:bg-emerald-400/30">
      <Header />

      {/* Hero Section */}
      <ScrollReveal>
        <AboutHero />
      </ScrollReveal>

      {/* Story / Mission Section */}
      <ScrollReveal delay={100}>
        <AboutStory />
      </ScrollReveal>

      {/* Principles Section */}
      <ScrollReveal delay={200}>
        <AboutValues />
      </ScrollReveal>
    </main>
  );
}