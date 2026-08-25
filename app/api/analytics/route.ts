import { NextResponse } from "next/server";
import { db } from "@/lib/db/store";

export async function GET() {
  try {
    const totalViews = db.articles.reduce((acc, a) => acc + (a.views || 0), 0);
    const totalSalesRevenue = db.orders
      .filter((o) => o.status === "paid")
      .reduce((acc, o) => acc + o.total, 0);
    const totalAffiliateClicks = db.affiliates.reduce((acc, a) => acc + (a.clicksCount || 0), 0);

    const stats = {
      overview: {
        totalArticles: db.articles.length,
        totalViews,
        totalProducts: db.products.length,
        totalOrders: db.orders.length,
        totalRevenue: totalSalesRevenue,
        totalLicenses: db.licenses.length,
        activeTrials: db.trials.filter((t) => t.status === "active").length,
        affiliateClicks: totalAffiliateClicks,
        geminiDraftsReady: db.drafts.filter((d) => d.status === "draft").length
      },
      recentOrders: db.orders.slice(0, 5),
      recentDrafts: db.drafts.slice(0, 5)
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memuat data analitik." }, { status: 500 });
  }
}
