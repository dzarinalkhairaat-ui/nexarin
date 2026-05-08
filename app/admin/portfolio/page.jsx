import AdminPortfolioPage from "@/features/admin/modules/AdminPortfolioPage";

export const metadata = {
  title: "Admin Portfolio",
  description:
    "Admin Portfolio Nexarin by-rins untuk pengelolaan project, studi kasus, teknologi, dan detail portfolio.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPortfolioRoute() {
  return <AdminPortfolioPage />;
}