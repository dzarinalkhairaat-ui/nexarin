import PremiumCheckoutPage from "@/features/premium/PremiumCheckoutPage";
import { prisma } from "@/lib/prisma"; // Assuming standard Prisma setup, let's verify if lib/prisma.js exists. Or use global prisma.

export const metadata = {
  title: "Checkout Premium - Nexarin",
  description: "Selesaikan pembayaran untuk akses Premium Nexarin.",
  robots: {
    index: false,
    follow: false,
  }
};

export default async function PremiumCheckoutRoute() {
  const paymentMethods = await prisma.paymentSetting.findMany({
    where: { isActive: true },
    select: {
      id: true,
      methodId: true,
      accountName: true,
      accountNumber: true,
    }
  });
  
  return <PremiumCheckoutPage paymentMethods={paymentMethods} />;
}
