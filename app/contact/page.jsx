import ContactPage from "@/features/contact/ContactPage";

export const metadata = {
  title: "Contact",
  description:
    "Hubungi Nexarin by-rins untuk diskusi custom project, produk digital, support, kolaborasi, dan pengembangan sistem digital.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact - Nexarin by-rins",
    description:
      "Jalur komunikasi Nexarin by-rins untuk custom project, produk digital, support, dan kolaborasi.",
    url: "https://nexarin.my.id/contact",
  },
};

export default function ContactRoute() {
  return <ContactPage />;
}