import PortfolioPage from "@/features/portfolio/PortfolioPage";

export const metadata = {
  title: "Nexarin Porto - Showcase & Studi Kasus",
  description:
    "Lihat Nexarin Porto, portofolio resmi Nexarin by-rins. Temukan showcase project digital, studi kasus, karya, dan fondasi pengembangan ekosistem Nexarin.",
  keywords: [
    "Nexarin Porto",
    "Nexarin portfolio",
    "karya Nexarin",
    "project Nexarin",
    "portofolio Nexarin by-rins"
  ],
  alternates: {
    canonical: "/portfolio",
  },
  openGraph: {
    title: "Nexarin Porto - Showcase & Studi Kasus",
    description:
      "Showcase project digital, studi kasus, karya, dan fondasi pengembangan ekosistem Nexarin di halaman Nexarin Porto.",
    url: "https://nexarin.my.id/portfolio",
    siteName: "Nexarin",
    locale: "id_ID",
    type: "website",
  },
};

export default function PortfolioRoute() {
  return <PortfolioPage />;
}