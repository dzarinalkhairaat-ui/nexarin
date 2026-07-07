import "./globals.css";
import JsonLd from "@/components/shared/JsonLd";
import GlobalLoader from "@/components/shared/GlobalLoader";
import { Suspense } from "react";

export const metadata = {
  metadataBase: new URL("https://nexarin.my.id"),
  applicationName: "Nexarin",
  category: "technology",
  title: {
    default: "Nexarin | Ekosistem Digital & Layanan Custom by-rins",
    template: "%s | Nexarin by-rins",
  },
  description:
    "Nexarin by-rins adalah ekosistem digital terpadu. Kami menyediakan berbagai produk digital, portfolio, news, layanan custom project, dan pengembangan sistem profesional berbasis teknologi terbaru.",
  keywords: [
    "Nexarin",
    "Nexarin by-rins",
    "produk digital Nexarin",
    "portfolio digital Nexarin",
    "Nexarin News",
    "Nexarin Produk",
    "Nexarin Porto",
    "layanan custom",
    "jasa pembuatan website",
    "pengembangan aplikasi",
    "startup digital indonesia",
    "teknologi masa depan",
    "by-rins",
    "Nexarin Tools",
    "Nexarin Tool",
    "Nexarin Studio",
    "Nexarin PDF Studio",
    "Nexarin Voice Studio",
  ],
  authors: [
    { name: "Muhammad Abi Dzarin", url: "https://nexarin.my.id" },
    { name: "Nexarin by-rins" }
  ],
  creator: "Nexarin by-rins",
  publisher: "Nexarin by-rins",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // verification dihapus karena sudah menggunakan file HTML di folder public
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://nexarin.my.id",
    siteName: "Nexarin",
    title: "Nexarin by-rins | Ekosistem Digital",
    description:
      "Nexarin by-rins adalah ekosistem digital untuk produk digital, portfolio, news, layanan custom, dan pengembangan sistem modern.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexarin by-rins | Ekosistem Digital",
    description:
      "Nexarin by-rins adalah ekosistem digital untuk produk digital, portfolio, news, layanan custom, dan pengembangan sistem modern.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Nexarin by-rins",
    url: "https://nexarin.my.id",
    logo: "https://nexarin.my.id/images/logo/nexarin-logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+6285173057576",
      contactType: "customer service",
      email: "nexarinbyrins@gmail.com",
      areaServed: "ID",
      availableLanguage: "Indonesian",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Nexarin by-rins",
    url: "https://nexarin.my.id",
    description: "Ekosistem digital by-rins untuk produk digital, portfolio, news, layanan custom.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://nexarin.my.id/news/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="id" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        {children}
        <Suspense fallback={null}>
          <GlobalLoader />
        </Suspense>
      </body>
    </html>
  );
}