import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { ContentProvider } from "@/context/ContentContext";
import { ShopProvider } from "@/context/ShopContext";
import { TutorialProvider } from "@/context/TutorialContext";
import { ToastContainer } from "@/components/ui/Toast";
import { AppLayoutShell } from "@/components/layout/AppLayoutShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nexarin.tech"),
  title: "Nexarin Tech Hub — Portal Informasi AI, Teknologi & Toko Produk Digital",
  description: "Ekosistem Informasi Teknologi, AI, Edukasi, Gadget, Otomotif, Rekomendasi Affiliate & Toko Produk Digital Siap Pakai oleh Nexarin by Rins.",
  keywords: ["AI", "Teknologi", "Tutorial Coding", "Gadget Review", "Otomotif EV", "Produk Digital", "Sistem Absensi Sekolah", "Admin Dashboard"],
  authors: [{ name: "Rins" }],
  icons: {
    icon: [
      { url: "/assets/nexarin-logo.png", type: "image/png" },
      { url: "/favicon.ico" }
    ],
    shortcut: "/assets/nexarin-logo.png",
    apple: "/assets/nexarin-logo.png",
  },
  openGraph: {
    title: "Nexarin Tech Hub — Portal Informasi & Digital Shop",
    description: "Platform teknologi modern yang menggabungkan konten edukasi terkurasi dan aplikasi digital siap pakai.",
    url: "https://nexarin.tech",
    siteName: "Nexarin Tech Hub",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/assets/nexarin-logo.png",
        width: 512,
        height: 512,
        alt: "Nexarin Tech Hub Logo",
      }
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/assets/nexarin-logo.png" type="image/png" />
        <link rel="shortcut icon" href="/assets/nexarin-logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/assets/nexarin-logo.png" />
      </head>
      <body className="min-h-full flex flex-col bg-[#0B1120] text-[#F8FAFC] selection:bg-[#2DD4F5]/30" suppressHydrationWarning>
        <script
          id="suppress-extension-attributes"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var origError = console.error;
                  console.error = function() {
                    for (var i = 0; i < arguments.length; i++) {
                      var arg = arguments[i];
                      if (!arg) continue;
                      var str = typeof arg === 'string' ? arg : (arg.message || arg.stack || String(arg));
                      if (
                        str.indexOf('bis_skin_checked') !== -1 ||
                        str.indexOf('hydrated but some attributes') !== -1 ||
                        str.indexOf('react-hydration-error') !== -1 ||
                        str.indexOf('Text content does not match') !== -1 ||
                        str.indexOf('did not match the client properties') !== -1
                      ) {
                        return;
                      }
                    }
                    origError.apply(console, arguments);
                  };

                  var origWarn = console.warn;
                  console.warn = function() {
                    for (var i = 0; i < arguments.length; i++) {
                      var arg = arguments[i];
                      if (!arg) continue;
                      var str = typeof arg === 'string' ? arg : (arg.message || arg.stack || String(arg));
                      if (
                        str.indexOf('bis_skin_checked') !== -1 ||
                        str.indexOf('hydration') !== -1 ||
                        str.indexOf('hydrated') !== -1
                      ) {
                        return;
                      }
                    }
                    origWarn.apply(console, arguments);
                  };
                } catch(e) {}
              })();
            `
          }}
        />
        <NotificationProvider>
          <AuthProvider>
            <ContentProvider>
              <ShopProvider>
                <TutorialProvider>
                  <AppLayoutShell>{children}</AppLayoutShell>
                </TutorialProvider>
                <ToastContainer />
              </ShopProvider>
            </ContentProvider>
          </AuthProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
