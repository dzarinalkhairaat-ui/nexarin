"use client";

import React from "react";
import Link from "next/link";
import { useContent } from "@/context/ContentContext";
import { useShop } from "@/context/ShopContext";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminCard } from "@/components/admin/AdminCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  FileEdit,
  Sparkles,
  ShoppingBag,
  Share2,
  TrendingUp,
  History,
  RefreshCw
} from "lucide-react";

export default function AdminOverviewPage() {
  const { articles, drafts, syncGeminiSpark } = useContent();
  const { products, orders, affiliates, auditLogs } = useShop();

  const pendingDrafts = drafts.filter((d) => d.status === "draft");
  const totalRevenue = orders.reduce((acc, o) => acc + (o.status === "paid" ? o.total : 0), 0);
  const totalAffiliateClicks = affiliates.reduce((acc, a) => acc + a.clicksCount, 0);

  return (
    <div className="space-y-8">
      {/* Operational Page Header */}
      <AdminPageHeader
        title="Operational Overview"
        description="Ringkasan metrik editorial, status pipeline AI Gemini Spark, volume transaksi katalog, dan log keamanan sistem."
        badge="Live Metrics"
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={syncGeminiSpark}
              className="text-xs border-white/[0.10] text-[#A8BCBA] hover:text-white"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
              Sync Gemini Spark
            </Button>
            <Link href="/admin/content">
              <Button variant="primary" size="sm" className="font-bold text-xs">
                <FileEdit className="w-3.5 h-3.5 mr-1.5" />
                Review Draft ({pendingDrafts.length})
              </Button>
            </Link>
          </>
        }
      />

      {/* Primary KPI Grid (Data-focused) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard
          label="Draft Siap Review"
          value={pendingDrafts.length}
          subtext="Dari Google Sheets staging"
          icon={<FileEdit className="w-4 h-4 text-amber-400" />}
          trend={{ value: "+3 hari ini", positive: true }}
        />

        <AdminStatCard
          label="Artikel Live"
          value={articles.length}
          subtext="Terkurasi di portal publik"
          icon={<TrendingUp className="w-4 h-4 text-[#18D6D0]" />}
          trend={{ value: "100% active", positive: true }}
        />

        <AdminStatCard
          label="Total Pendapatan"
          value={formatCurrency(totalRevenue, "IDR")}
          subtext={`${orders.length} transaksi Mayar`}
          icon={<ShoppingBag className="w-4 h-4 text-[#49D7A5]" />}
          trend={{ value: "Lifetime", positive: true }}
        />

        <AdminStatCard
          label="Klik Afiliasi"
          value={totalAffiliateClicks}
          subtext="Shopee &amp; Tokopedia"
          icon={<Share2 className="w-4 h-4 text-purple-400" />}
          trend={{ value: "CR ~7.2%", positive: true }}
        />
      </div>

      {/* Pipeline Status Banner */}
      <AdminCard className="bg-gradient-to-r from-[#0B1120] via-[#0F172A] to-[#0B1120] border-cyan-500/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Pipeline Gemini Spark Editorial AI: Online &amp; Terhubung
              </h3>
              <p className="text-xs text-[#6F8583]">
                Otomatisasi pengolahan 3 RSS Feed harian → Google Sheets → Siap direview editor manusia.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/admin/gemini-sync">
              <Button variant="mint" size="sm" className="font-bold text-xs text-slate-950">
                Lihat Data Staging ?
              </Button>
            </Link>
          </div>
        </div>
      </AdminCard>

      {/* Dual Column: Pending Drafts & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Review Drafts */}
        <AdminCard className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <FileEdit className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Draft Menunggu Review ({pendingDrafts.length})
              </h3>
            </div>
            <Link href="/admin/content" className="text-xs font-mono font-bold text-cyan-400 hover:underline">
              Kelola Semua ?
            </Link>
          </div>

          <div className="space-y-2.5">
            {pendingDrafts.slice(0, 3).map((draft) => (
              <div
                key={draft.id}
                className="p-3 rounded-xl bg-[#061214] border border-white/[0.08] flex items-center justify-between gap-3 hover:border-white/[0.10] transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.2 rounded-full text-[10px] font-mono font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {draft.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Sumber: {draft.sourceName}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">
                    {draft.title}
                  </h4>
                </div>

                <Link href={`/admin/content/${draft.id}/review`}>
                  <Button variant="primary" size="sm" className="font-bold text-[11px] h-7 px-2.5 whitespace-nowrap">
                    Review
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </AdminCard>

        {/* Recent Transactions */}
        <AdminCard className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#49D7A5]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Transaksi Pesanan Terbaru ({orders.length})
              </h3>
            </div>
            <Link href="/admin/orders" className="text-xs font-mono font-bold text-[#49D7A5] hover:underline">
              Semua Pesanan ?
            </Link>
          </div>

          <div className="space-y-2.5">
            {orders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="p-3 rounded-xl bg-[#061214] border border-white/[0.08] flex items-center justify-between gap-3 hover:border-white/[0.10] transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-white">
                      {order.id}
                    </span>
                    <Badge variant={order.status === "paid" ? "mint" : "warning"} size="sm">
                      {order.status.toUpperCase()}
                    </Badge>
                  </div>
                  <span className="text-xs text-[#6F8583] truncate block">
                    {order.customerName} • {order.items[0]?.productName}
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-extrabold text-white font-mono block">
                    {formatCurrency(order.total, order.currency)}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {order.paymentProvider}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>

      {/* Security Audit Trail Snippet */}
      <AdminCard className="space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Audit Trail Keamanan Terbaru
            </h3>
          </div>
          <Link href="/admin/audit-logs" className="text-xs font-mono font-bold text-cyan-400 hover:underline">
            Buka Audit Logs ?
          </Link>
        </div>

        <div className="divide-y divide-slate-800 text-xs font-mono">
          {auditLogs.slice(0, 4).map((log) => (
            <div key={log.id} className="py-2.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-cyan-400 font-bold uppercase text-[11px] shrink-0">
                  [{log.action}]
                </span>
                <span className="text-[#A8BCBA] truncate">
                  {log.details}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 shrink-0">
                {formatDateTime(log.timestamp)}
              </span>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}
