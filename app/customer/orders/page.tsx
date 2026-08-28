"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import { CustomerPageHeader } from "@/components/customer/CustomerPageHeader";
import { CustomerCard } from "@/components/customer/CustomerCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Receipt, CheckCircle2, Printer, ChevronRight } from "lucide-react";
import { Order } from "@/types/product";

export default function CustomerOrdersPage() {
  const { customer } = useAuth();
  const { orders } = useShop();
  const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);

  const userOrders = orders.filter((o) => o.userId === (customer?.id || "usr-cust-001") || o.customerEmail === customer?.email);

  return (
    <div suppressHydrationWarning className="space-y-8">
      {/* Page Header */}
      <CustomerPageHeader
        title="Riwayat Pesanan &amp; Faktur (Order History)"
        description="Daftar seluruh transaksi pembelian lisensi produk digital Anda beserta rincian faktur."
        badge={`${userOrders.length} Pesanan`}
      />

      {userOrders.length > 0 ? (
        <div className="space-y-4">
          {userOrders.map((order) => (
            <CustomerCard key={order.id} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08] text-xs font-mono">
                <div>
                  <span className="font-bold text-white block sm:inline mr-3">
                    #{order.orderNumber}
                  </span>
                  <span className="text-[#64748B]">{formatDateTime(order.createdAt)}</span>
                </div>
                <Badge variant={order.status === "paid" ? "mint" : "warning"} size="sm">
                  {order.status === "paid" ? "Lunas (Paid)" : order.status}
                </Badge>
              </div>

              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-white">
                        {item.productName}
                      </h4>
                      <span className="text-[11px] text-[#64748B] font-mono">Versi {item.version} • Lisensi Lifetime</span>
                    </div>
                    <span className="font-mono font-bold text-white">
                      {formatCurrency(item.price, order.currency)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs font-mono text-[#64748B]">
                  Payment: <strong className="text-[#F8FAFC]">{order.paymentProvider}</strong> ({order.paymentReference})
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/customer/orders/${order.id}`}>
                    <Button variant="outline" size="sm" className="text-xs border-white/[0.10] text-[#94A3B8] hover:text-white">
                      Rincian Faktur <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setSelectedInvoice(order)}
                    className="text-xs font-semibold"
                  >
                    <Receipt className="w-3.5 h-3.5 mr-1.5" />
                    Preview Invoice
                  </Button>
                </div>
              </div>
            </CustomerCard>
          ))}
        </div>
      ) : (
        <CustomerCard className="p-12 text-center text-xs text-[#64748B]">
          Belum ada riwayat pesanan yang terdaftar pada akun Anda.
        </CustomerCard>
      )}

      {/* Invoice Modal */}
      {selectedInvoice && (
        <Modal
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          title={`Faktur Pembelian #${selectedInvoice.orderNumber}`}
          description="Bukti pembayaran resmi Nexarin by Rins"
          maxWidth="lg"
        >
          <div className="space-y-6 text-xs text-[#94A3B8]">
            <div className="p-4 rounded-2xl bg-[#0B1120] border border-white/[0.08] space-y-2">
              <div className="flex justify-between">
                <span>Nama Pelanggan:</span>
                <strong className="text-white">{selectedInvoice.customerName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Email:</span>
                <strong className="text-white">{selectedInvoice.customerEmail}</strong>
              </div>
              <div className="flex justify-between">
                <span>Tanggal Bayar:</span>
                <span className="font-mono">{formatDateTime(selectedInvoice.paidAt || selectedInvoice.createdAt)}</span>
              </div>
            </div>

            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] text-slate-500 font-mono text-left">
                  <th className="py-2">Item Produk</th>
                  <th className="py-2 text-right">Harga</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {selectedInvoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 font-semibold text-white">
                      {item.productName} ({item.version})
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-[#F8FAFC]">
                      {formatCurrency(item.price, selectedInvoice.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-white/[0.08] font-bold text-sm">
                  <td className="py-3 text-white">Total Bayar:</td>
                  <td className="py-3 text-right font-mono text-[#2DD4F5]">
                    {formatCurrency(selectedInvoice.total, selectedInvoice.currency)}
                  </td>
                </tr>
              </tfoot>
            </table>

            <Button
              variant="secondary"
              size="sm"
              className="w-full font-bold"
              onClick={() => window.print()}
            >
              <Printer className="w-4 h-4 mr-2" />
              Cetak Faktur (PDF / Print)
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
