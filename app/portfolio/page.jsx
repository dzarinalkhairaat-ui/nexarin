import PortfolioPage from "@/features/portfolio/PortfolioPage";

export const metadata = {
  title: "Portfolio",
  description:
    "Portfolio Nexarin by-rins berisi showcase project digital, studi kasus, karya, dan fondasi pengembangan ekosistem by-rins.",
  alternates: {
    canonical: "/portfolio",
  },
  openGraph: {
    title: "Portfolio - Nexarin by-rins",
    description:
      "Showcase project digital, studi kasus, karya, dan fondasi pengembangan ekosistem Nexarin by-rins.",
    url: "https://nexarin.my.id/portfolio",
  },
};

export default function PortfolioRoute() {
  return <PortfolioPage />;
}