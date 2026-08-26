"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import { CustomerPageHeader } from "@/components/customer/CustomerPageHeader";
import { CustomerStatCard } from "@/components/customer/CustomerStatCard";
import { CustomerCard } from "@/components/customer/CustomerCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import {
  PackageCheck,
  Sparkles,
  DownloadCloud,
  Clock,
  KeyRound,
  FileCode,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  ExternalLink
} from "lucide-react";

export default function CustomerOverviewPage() {
  const { customer } = useAuth();
  const { getUserLicenses, getAvailableUpdatesForUser, downloadProduct, products, orders } = useShop();

  const userLicenses = getUserLicenses(customer?.id || "usr-cust-001");
  const updatesInfo = getAvailableUpdatesForUser(customer?.id || "usr-cust-001");
  const pendingUpdates = updatesInfo.filter((u) => u.hasUpdate);
  const activeTrials = userLicenses.filter((l) => l.status === "trial_active");
  const userOrders = orders.filter((o) => o.userId === (customer?.id || "usr-cust-001") || o.customerEmail === customer?.email);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0B1120] via-[#131E32] to-[#0B1120] text-white border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7CF2C3]/15 text-[#7CF2C3] text-xs font-mono font-bold border border-[#7CF2C3]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Customer Portal &amp; License Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Selamat Datang, {customer?.name || "Customer"}!
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] max-w-xl leading-relaxed">
            Kelola lisensi produk digital Anda, unduh source code versi terbaru, dan dapatkan pembaruan berkelanjutan.
          </p>
        </div>

        <Link href="/shop">
          <Button variant="mint" size="md" className="font-bold text-slate-950 whitespace-nowrap">
            + Eksplor Produk Baru
          </Button>
        </Link>
      </div>

      {/* Metrics Row (KPI Stat Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CustomerStatCard
          label="Produk Dimiliki"
          value={userLicenses.length}
          subtext="Lisensi resmi aktif"
          icon={<PackageCheck className="w-5 h-5" />}
          badge="Lifetime / Trial"
        />

        <CustomerStatCard
          label="Update Tersedia"
          value={pendingUpdates.length}
          subtext="Versi baru siap unduh"
          icon={<Sparkles className="w-5 h-5 text-[#7CF2C3]" />}
          badge={pendingUpdates.length > 0 ? "Baru" : "Up-to-date"}
          badgeColor={pendingUpdates.length > 0 ? "bg-emerald-500/20 text-[#7CF2C3]" : "bg-slate-800 text-[#64748B]"}
        />

        <CustomerStatCard
          label="Trial Aktif"
          value={activeTrials.length}
          subtext="Demo 3 hari"
          icon={<Clock className="w-5 h-5 text-amber-400" />}
        />

        <CustomerStatCard
          label="Total Pesanan"
          value={userOrders.length > 0 ? userOrders.length : userLicenses.length}
          subtext="Faktur transaksi terverifikasi"
          icon={<ShieldCheck className="w-5 h-5 text-cyan-400" />}
        />
      </div>

      {/* Pending Updates Alert Box */}
      {pendingUpdates.length > 0 && (
        <CustomerCard className="bg-emerald-500/10 border-emerald-500/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-[#7CF2C3] flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Terdapat {pendingUpdates.length} Pembaruan Versi Baru untuk Produk Anda!
                </h3>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Unduh versi terbaru secara gratis untuk mendapatkan peningkatan performa, perbaikan keamanan, dan fitur baru.
                </p>
              </div>
            </div>

            <Link href="/customer/updates">
              <Button variant="mint" size="sm" className="font-bold text-slate-950 whitespace-nowrap">
                Lihat Changelog &amp; Unduh ?
              </Button>
            </Link>
          </div>
        </CustomerCard>
      )}

      {/* Active Products List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">
            Produk Digital Aktif Anda
          </h3>
          <Link href="/customer/products" className="text-xs font-bold text-[#2DD4F5] hover:underline flex items-center gap-1">
            Lihat Semua Produk <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {userLicenses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userLicenses.map((lic) => {
              const product = products.find((p) => p.id === lic.productId);
              const hasUpdate = product ? lic.ownedVersion !== product.currentVersion : false;

              return (
                <CustomerCard key={lic.id} className="flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-xs font-semibold text-cyan-400">
                        Versi Dimiliki: {lic.ownedVersion}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Badge variant={lic.licenseType === "lifetime" ? "mint" : "warning"} size="sm">
                          {lic.licenseType === "lifetime" ? "Lifetime Active" : "Trial 3 Hari"}
                        </Badge>
                        {hasUpdate && (
                          <Badge variant="cyan" size="sm">
                            Update: {product?.currentVersion}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-white line-clamp-1">
                      {lic.productName}
                    </h4>

                    <div className="mt-3 p-3 rounded-xl bg-[#0B1120] border border-white/[0.08] text-[11px] font-mono flex items-center justify-between">
                      <span className="text-[#64748B]">License Key:</span>
                      <span className="font-bold text-cyan-300">{lic.licenseKey}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-white/[0.08]">
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1 font-bold text-xs"
                      onClick={() => downloadProduct(lic.productId, lic.ownedVersion)}
                    >
                      <DownloadCloud className="w-3.5 h-3.5 mr-1.5" />
                      Unduh Build ({lic.ownedVersion})
                    </Button>
                    <Link href={`/customer/products/${lic.productId}`}>
                      <Button variant="outline" size="sm" className="text-xs border-white/[0.10] text-[#94A3B8] hover:text-white">
                        Detail &amp; Notes
                      </Button>
                    </Link>
                  </div>
                </CustomerCard>
              );
            })}
          </div>
        ) : (
          <CustomerCard className="p-8 text-center text-xs text-[#64748B]">
            <p className="mb-3">Anda belum memiliki lisensi produk digital aktif.</p>
            <Link href="/shop">
              <Button variant="mint" size="sm" className="font-bold text-slate-950">
                Jelajahi Katalog Toko Nexarin
              </Button>
            </Link>
          </CustomerCard>
        )}
      </section>
    </div>
  );
}
