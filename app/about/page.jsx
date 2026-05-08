import AboutPage from "@/features/about/AboutPage";

export const metadata = {
  title: "About",
  description:
    "Tentang Nexarin by-rins, ekosistem digital yang dibangun untuk produk digital, portfolio, news, layanan custom, dan pengembangan sistem by-rins.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About - Nexarin by-rins",
    description:
      "Mengenal Nexarin by-rins sebagai rumah digital untuk produk, portfolio, news, dan sistem digital by-rins.",
    url: "https://nexarin.my.id/about",
  },
};

export default function AboutRoute() {
  return <AboutPage />;
}