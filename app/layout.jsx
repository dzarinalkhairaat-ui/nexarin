import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://nexarin.my.id"),
  applicationName: "Nexarin by-rins",
  title: {
    default: "Nexarin by-rins",
    template: "%s | Nexarin by-rins",
  },
  description:
    "Nexarin by-rins adalah ekosistem digital untuk produk digital, portfolio, news, layanan custom, dan pengembangan sistem by-rins.",
  keywords: [
    "Nexarin",
    "Nexarin by-rins",
    "produk digital",
    "portfolio digital",
    "news digital",
    "custom project",
    "by-rins",
  ],
  authors: [
    {
      name: "Nexarin by-rins",
    },
  ],
  creator: "Nexarin by-rins",
  publisher: "Nexarin by-rins",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://nexarin.my.id",
    siteName: "Nexarin by-rins",
    title: "Nexarin by-rins",
    description:
      "Ekosistem digital by-rins untuk produk digital, portfolio, news, layanan custom, dan pengembangan sistem.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexarin by-rins",
    description:
      "Ekosistem digital by-rins untuk produk digital, portfolio, news, layanan custom, dan pengembangan sistem.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}