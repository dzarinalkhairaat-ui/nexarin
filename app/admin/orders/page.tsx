"use client";

import React from "react";
import { useShop } from "@/context/ShopContext";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminCard } from "@/components/admin/AdminCard";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { FolderGit2, Receipt, ShoppingBag, ShieldCheck, CreditCard } from "lucide-react";

export default function AdminOrdersPage() {
  const { orders, licenses } = useShop();

  const totalRevenue = orders.reduce((acc, o) => acc + (o.status === "paid" ? o.total : 0), 0);
  const paidOrdersCount = orders.filter((o) => o.status === "paid").length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <AdminPageHeader
        title="Data Transaksi & Pesanan (Orders Hub)"
        description="Monitoring riwayat pembayaran Mayar, verifikasi faktur, dan penerbitan lisensi digital otomatis."
        badge={`${orders.length} Transaksi`}
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AdminStatCard
          label="Total Volume Transaksi"
          value={formatCurrency(totalRevenue, "IDR")}
          subtext="Semua pesanan lunas"
          icon={<ShoppingBag className="w-4 h-4 text-[#49D7A5]" />}
        />

        <AdminStatCard
          label="Pesanan Terverifikasi"
          value={`${paidOrdersCount} / ${orders.length}`}
          subtext="100% gateway success"
          icon={<ShieldCheck className="w-4 h-4 text-[#18D6D0]" />}
        />

        <AdminStatCard
          label="Lisensi Diterbitkan"
          value={`${licenses.length} Key`}
          subtext="Terkoneksi ke user"
          icon={<Receipt className="w-4 h-4 text-purple-400" />}
        />
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <AdminCard key={order.id} className="space-y-3 font-mono text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <span className="font-bold text-white text-sm">#{order.orderNumber}</span>
                <span className="text-[#A8BCBA] font-sans text-xs">
                  {order.customerName} (<span className="text-[#6F8583]">{order.customerEmail}</span>)
                </span>
              </div>
              <Badge variant={order.status === "paid" ? "mint" : "warning"} size="sm">
                {order.status === "paid" ? "LUNAS (PAID)" : order.status.toUpperCase()}
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[#F2FAF9] font-sans text-xs">
              <span className="font-medium">
                Item: {order.items.map((i) => `${i.productName} (${i.version})`).join(", ")}
              </span>
              <strong className="font-mono text-[#18D6D0] text-sm">
                {formatCurrency(order.total, order.currency)}
              </strong>
            </div>

            <div className="pt-2 text-[11px] text-[#6F8583] flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.08]">
              <span>
                Gateway: <strong className="text-[#F2FAF9]">{order.paymentProvider}</strong> • Ref: <span className="text-cyan-400">{order.paymentReference}</span>
              </span>
              <span>{formatDateTime(order.createdAt)}</span>
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
