import SupportPage from "@/features/support/SupportPage";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Support Kami",
  description:
    "Dukung Nexarin by-rins agar ekosistem digital, produk, portfolio, news, dan layanan by-rins bisa terus berkembang.",
  alternates: {
    canonical: "/support",
  },
  openGraph: {
    type: "website",
    title: "Support Kami - Nexarin by-rins",
    description:
      "Halaman dukungan untuk Nexarin by-rins agar ekosistem digital by-rins bisa terus dikembangkan.",
    url: "https://nexarin.my.id/support",
    siteName: "Nexarin by-rins",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Support Kami - Nexarin by-rins",
    description:
      "Dukung Nexarin by-rins agar ekosistem digital by-rins bisa terus berkembang.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const dynamic = 'force-dynamic';

export default async function SupportRoute() {
  let paymentMethods = [];
  try {
    paymentMethods = await prisma.paymentSetting.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Gagal mengambil metode pembayaran:", error);
  }

  return <SupportPage paymentMethods={paymentMethods} />;
}