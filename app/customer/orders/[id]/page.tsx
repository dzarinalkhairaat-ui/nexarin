"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import { CustomerPageHeader } from "@/components/customer/CustomerPageHeader";
import { CustomerCard } from "@/components/customer/CustomerCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  ArrowLeft,
  Receipt,
  CheckCircle2,
  DownloadCloud,
  FileCode,
  ShieldCheck
} from "lucide-react";

export default function CustomerOrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { customer } = useAuth();
  const { orders, downloadProduct } = useShop();

  const order = orders.find((o) => o.id === orderId || o.orderNumber === orderId);

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center space-y-4">
        <CustomerCard className="p-8 space-y-4">
          <h2 className="text-xl font-bold text-white">Pesanan Tidak Ditemukan</h2>
          <p className="text-xs text-slate-400">
            Faktur transaksi pesanan yang Anda tuju tidak tersedia atau tidak terdaftar pada akun Anda.
          </p>
          <Link href="/customer/orders">
            <Button variant="primary" size="sm">
              Kembali ke Riwayat Pesanan
            </Button>
          </Link>
        </CustomerCard>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/customer/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Riwayat Pesanan</span>
        </Link>
      </div>

      {/* Page Header */}
      <CustomerPageHeader
        title={`Faktur Pesanan #${order.orderNumber}`}
        description={`Diterbitkan pada ${formatDateTime(order.createdAt)} melalui ${order.paymentProvider}`}
        badge={order.status === "paid" ? "Lunas / Paid" : order.status.toUpperCase()}
      />

      {/* Order Summary Breakdown Card */}
      <CustomerCard className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono text-slate-400">ID Referensi Pembayaran:</span>
            <p className="text-sm font-mono font-bold text-cyan-400 mt-0.5">{order.paymentReference}</p>
          </div>
          <div className="sm:text-right">
            <span className="text-xs font-mono text-slate-400">Status Pembayaran:</span>
            <div className="mt-0.5">
              <Badge variant={order.status === "paid" ? "mint" : "warning"} size="sm">
                {order.status === "paid" ? "Pembayaran Terverifikasi" : order.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Item List */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
            Item Produk yang Dibeli
          </h4>
          <div className="divide-y divide-slate-800">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h5 className="text-sm font-bold text-white">{item.productName}</h5>
                  <span className="text-xs text-slate-400 font-mono">
                    Versi: {item.version} • Lisensi: {item.licenseType.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold font-mono text-white">
                    {formatCurrency(item.price, order.currency)}
                  </span>
                  <Button
                    variant="primary"
                    size="sm"
                    className="text-xs font-bold"
                    onClick={() => downloadProduct(item.productId, item.version)}
                  >
                    <DownloadCloud className="w-3.5 h-3.5 mr-1" />
                    Unduh
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="pt-4 border-t border-slate-800 space-y-2 text-xs font-mono">
          <div className="flex justify-between text-slate-400">
            <span>Subtotal:</span>
            <span>{formatCurrency(order.subtotal, order.currency)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-400">
              <span>Diskon:</span>
              <span>- {formatCurrency(order.discount, order.currency)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
            <span>Total Pembayaran:</span>
            <span className="text-[#2DD4F5]">{formatCurrency(order.total, order.currency)}</span>
          </div>
        </div>
      </CustomerCard>
    </div>
  );
}
