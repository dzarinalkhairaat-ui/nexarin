import Header from "@/components/shared/Header";
import ContactForm from "@/features/contact/components/ContactForm";
import ContactFooter from "@/features/contact/components/ContactFooter";

export default function ContactPage({ contacts = [], maps = [] }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white selection:bg-emerald-400/30">
      <Header />
      <ContactForm contacts={contacts} maps={maps} />
      <ContactFooter />
    </main>
  );
}