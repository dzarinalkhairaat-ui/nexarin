import ScrollReveal from "@/components/shared/ScrollReveal";
import ContactHeader from "@/features/contact/components/ContactHeader";
import ContactHero from "@/features/contact/components/ContactHero";
import ContactInfo from "@/features/contact/components/ContactInfo";
import ContactForm from "@/features/contact/components/ContactForm";
import ContactFooter from "@/features/contact/components/ContactFooter";

export default function ContactPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <ContactHeader />

      <ScrollReveal>
        <ContactHero />
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <ContactInfo />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <ContactForm />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <ContactFooter />
      </ScrollReveal>
    </main>
  );
}