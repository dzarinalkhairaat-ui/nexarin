import DagangPage from "@/features/dagang/DagangPage";

export const metadata = {
  title: "Nexarin Dagang - Katalog Produk Digital by-rins",
  description:
    "Eksplorasi katalog produk digital unggulan dari ekosistem Nexarin by-rins, mulai dari source code, template UI, hingga jasa pembuatan website premium.",
  keywords: [
    "Nexarin Dagang",
    "katalog nexarin",
    "produk digital nexarin",
    "jasa pembuatan website",
    "source code website",
    "template UI nexarin"
  ],
  alternates: {
    canonical: "/dagang",
  },
  openGraph: {
    title: "Nexarin Dagang - Katalog Produk Digital by-rins",
    description:
      "Jelajahi produk digital unggulan dari ekosistem Nexarin by-rins. Mulai dari source code, template UI/UX, hingga jasa pembuatan website premium.",
    url: "https://nexarin.my.id/dagang",
    siteName: "Nexarin",
    locale: "id_ID",
    type: "website",
  },
};

export default function DagangRoute() {
  return <DagangPage />;
}
