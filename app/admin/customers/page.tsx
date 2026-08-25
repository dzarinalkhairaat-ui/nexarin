"use client";

import React from "react";
import { useShop } from "@/context/ShopContext";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminCard } from "@/components/admin/AdminCard";
import { Badge } from "@/components/ui/Badge";
import { Users, Mail, Package, ShieldCheck, Building } from "lucide-react";

export default function AdminCustomersPage() {
  const { licenses, orders } = useShop();

  const customers = [
    {
      id: "usr-cust-001",
      name: "Ahmad Fadillah",
      email: "ahmad.fadillah@example.com",
      company: "SMA Nusantara Digital",
      ownedProductsCount: licenses.filter((l) => l.userId === "usr-cust-001").length,
      totalSpent: orders.filter((o) => o.userId === "usr-cust-001").reduce((acc, o) => acc + o.total, 0)
    }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <AdminPageHeader
        title="Direktori Pengguna & Lisensi (Customer CRM)"
        description="Data pelanggan terdaftar, riwayat kepemilikan lisensi software digital, dan total transaksi pembelian."
        badge={`${customers.length} Customer Aktif`}
      />

      <div className="space-y-4">
        {customers.map((c) => (
          <AdminCard key={c.id} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold font-mono text-base">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">{c.name}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span>{c.email}</span>
                    <span>•</span>
                    <span className="text-slate-300 flex items-center gap-1">
                      <Building className="w-3 h-3 text-cyan-400" />
                      {c.company}
                    </span>
                  </div>
                </div>
              </div>

              <Badge variant="mint" size="sm">
                Active Customer
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#080D1A] border border-[#1E293B]">
                <span className="text-slate-400 block text-[11px]">Produk Dimiliki:</span>
                <strong className="text-white text-sm font-bold mt-0.5 block">
                  {c.ownedProductsCount} Lisensi Aktif
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-[#080D1A] border border-[#1E293B] text-right">
                <span className="text-slate-400 block text-[11px]">Total Transaksi:</span>
                <strong className="text-[#2DD4F5] text-sm font-bold mt-0.5 block">
                  Rp {c.totalSpent.toLocaleString("id-ID")}
                </strong>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
