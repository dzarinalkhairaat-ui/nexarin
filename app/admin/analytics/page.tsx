"use client";

import React from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { useContent } from "@/context/ContentContext";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminCard } from "@/components/admin/AdminCard";
import { Button } from "@/components/ui/Button";
import { BarChart3, TrendingUp, Users, ShoppingBag, Share2, Eye, ArrowUpRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function AdminAnalyticsPage() {
  const { articles } = useContent();
  const { products, orders, affiliates } = useShop();

  const totalArticleViews = articles.reduce((acc, a) => acc + a.views, 0);
  const totalRevenue = orders.reduce((acc, o) => acc + (o.status === "paid" ? o.total : 0), 0);
  const totalClicks = affiliates.reduce((acc, a) => acc + a.clicksCount, 0);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <AdminPageHeader
        title="Analitik Performa Platform & Konversi"
        description="Monitoring metrik keterbacaan portal editorial, konversi transaksi toko digital, dan performa link afiliasi."
        badge="Real-time Analytics"
      />

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AdminStatCard
          label="Total Pembaca Portal"
          value={totalArticleViews.toLocaleString("id-ID")}
          subtext="Akumulasi seluruh artikel live"
          icon={<Eye className="w-4 h-4 text-cyan-400" />}
          trend={{ value: "+24% pekan ini", positive: true }}
        />

        <AdminStatCard
          label="Pendapatan Toko Digital"
          value={formatCurrency(totalRevenue, "IDR")}
          subtext={`${orders.length} transaksi Mayar terverifikasi`}
          icon={<ShoppingBag className="w-4 h-4 text-[#7CF2C3]" />}
          trend={{ value: "Lifetime", positive: true }}
        />

        <AdminStatCard
          label="Klik Rekomendasi Afiliasi"
          value={`${totalClicks} Klik`}
          subtext="Shopee & Tokopedia CTR"
          icon={<Share2 className="w-4 h-4 text-purple-400" />}
          trend={{ value: "CTR ~7.2%", positive: true }}
        />
      </div>

      {/* Popular Articles Breakdown */}
      <AdminCard className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Artikel Paling Populer (Traffic &amp; Reader Acquisition)
          </h3>
          <Link href="/admin/content" className="text-xs font-mono font-bold text-cyan-400 hover:underline">
            Semua Artikel →
          </Link>
        </div>

        <div className="divide-y divide-[#1E293B] text-xs">
          {articles.map((art, idx) => (
            <div key={art.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-6 h-6 rounded-lg bg-slate-900 border border-white/[0.08] text-[#64748B] font-mono text-xs flex items-center justify-center font-bold shrink-0">
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <span className="font-bold text-white block truncate">{art.title}</span>
                  <span className="text-[11px] text-[#64748B] font-mono">Kategori: {art.category.name}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-cyan-400 font-bold text-sm">
                  {art.views.toLocaleString("id-ID")} views
                </span>
                <Link href={`/article/${art.slug}`} target="_blank">
                  <Button variant="outline" size="sm" className="text-xs h-7 px-2 border-white/[0.10] text-[#94A3B8] hover:text-white">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}
