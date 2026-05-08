import NewsSearchPage from "@/features/news/NewsSearchPage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Search News",
  description:
    "Cari artikel dan informasi di News Nexarin by-rins berdasarkan judul, kategori, ringkasan, atau topik berita.",
  alternates: {
    canonical: "/news/search",
  },
  openGraph: {
    title: "Search News - Nexarin by-rins",
    description:
      "Halaman pencarian artikel News Nexarin by-rins untuk menemukan berita berdasarkan judul, kategori, ringkasan, atau topik.",
    url: "https://nexarin.my.id/news/search",
  },
  robots: {
    index: true,
    follow: true,
  },
};

function getSafeKeyword(value) {
  return String(value || "").trim();
}

export default async function NewsSearchRoute({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const keyword = getSafeKeyword(resolvedSearchParams?.q);

  return <NewsSearchPage keyword={keyword} />;
}