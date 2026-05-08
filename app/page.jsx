import HomePage from "@/features/home/HomePage";

export const metadata = {
  title: "Home",
  description:
    "Nexarin by-rins adalah rumah digital utama untuk produk digital, portfolio, news, dan layanan custom by-rins.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Nexarin by-rins",
    description:
      "Rumah digital utama untuk produk digital, portfolio, news, dan layanan custom by-rins.",
    url: "https://nexarin.my.id",
  },
};

export default function HomeRoute() {
  return <HomePage />;
}