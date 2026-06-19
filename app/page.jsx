import HomePage from "@/features/home/HomePage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Nexarin by-rins - Ekosistem Digital & Layanan Custom",
  description:
    "Selamat datang di Nexarin by-rins. Kami adalah ekosistem digital untuk produk digital, portfolio, news, dan layanan custom by-rins. Temukan solusi digital terbaik bersama Nexarin.",
  keywords: [
    "Nexarin",
    "Nexarin by-rins",
    "Nexarin beranda",
    "Nexarin home",
    "ekosistem digital nexarin",
    "layanan custom nexarin"
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Nexarin by-rins - Ekosistem Digital",
    description:
      "Selamat datang di Nexarin by-rins. Ekosistem digital utama untuk produk digital, portfolio, news, dan layanan custom.",
    url: "https://nexarin.my.id",
    siteName: "Nexarin",
    locale: "id_ID",
    type: "website",
  },
};

export default function HomeRoute() {
  return <HomePage />;
}