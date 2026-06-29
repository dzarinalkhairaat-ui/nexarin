import ContactPage from "@/features/contact/ContactPage";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Contact",
  description:
    "Hubungi Nexarin by-rins untuk diskusi custom project, produk digital, support, kolaborasi, dan pengembangan sistem digital.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact - Nexarin by-rins",
    description:
      "Jalur komunikasi Nexarin by-rins untuk custom project, produk digital, support, dan kolaborasi.",
    url: "https://nexarin.my.id/contact",
  },
};

export const revalidate = 0; // Disable cache so it reflects DB changes immediately

export default async function ContactRoute() {
  let contacts = [];
  let maps = [];
  try {
    contacts = await prisma.contactSetting.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    maps = await prisma.mapSetting.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Failed to fetch settings:", error);
  }

  return <ContactPage contacts={contacts} maps={maps} />;
}