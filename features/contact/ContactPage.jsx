import Header from "@/components/shared/Header";
import ContactForm from "@/features/contact/components/ContactForm";
import ContactFooter from "@/features/contact/components/ContactFooter";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-emerald-400/30">
      <Header />
      <ContactForm />
      <ContactFooter />
    </main>
  );
}