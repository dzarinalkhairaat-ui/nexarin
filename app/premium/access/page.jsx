import PremiumAccessPage from "@/features/premium/PremiumAccessPage";

export const metadata = {
  title: "Premium Member Area - Nexarin",
  description: "Area eksklusif untuk member premium Nexarin. Akses source code, tutorial, dan resource VIP lainnya.",
  robots: {
    index: false,
    follow: false,
  }
};

export default function PremiumAccessRoute() {
  return <PremiumAccessPage />;
}
