"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import { useNotification } from "@/context/NotificationContext";
import { CustomerPageHeader } from "@/components/customer/CustomerPageHeader";
import { CustomerCard } from "@/components/customer/CustomerCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { formatDate } from "@/lib/utils";
import {
  DownloadCloud,
  Copy,
  FileCode,
  Sparkles,
  ExternalLink,
  ChevronRight
} from "lucide-react";

export default function CustomerProductsPage() {
  const { customer } = useAuth();
  const { getUserLicenses, products, downloadProduct } = useShop();
  const { showToast } = useNotification();

  const userLicenses = getUserLicenses(customer?.id || "usr-cust-001");

  const copyKey = (key: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(key);
      showToast({
        type: "success",
        title: "License Key Disalin!",
        message: key
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <CustomerPageHeader
        title="Produk Digital Saya (My Products)"
        description="Koleksi source code, aplikasi siap pakai, dan lisensi resmi yang terdaftar pada akun Anda."
        badge={`${userLicenses.length} Produk`}
        actions={
          <Link href="/shop">
            <Button variant="mint" size="sm" className="font-bold text-slate-950">
              + Eksplor Katalog
            </Button>
          </Link>
        }
      />

      {userLicenses.length > 0 ? (
        <div className="space-y-4">
          {userLicenses.map((lic) => {
            const product = products.find((p) => p.id === lic.productId);
            const hasUpdate = product ? lic.ownedVersion !== product.currentVersion : false;

            return (
              <CustomerCard key={lic.id} className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={lic.licenseType === "lifetime" ? "mint" : "warning"} size="sm">
                        {lic.licenseType === "lifetime" ? "Lifetime License" : "Trial 3 Hari"}
                      </Badge>
                      {hasUpdate && (
                        <Badge variant="cyan" size="sm">
                          Pembaruan Tersedia: {product?.currentVersion}
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {lic.productName}
                    </h3>
                  </div>

                  <div className="text-right text-xs text-slate-400 font-mono">
                    <span>Terdaftar: {formatDate(lic.issuedAt)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-2xl bg-[#0B1120] border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                      License Key
                    </span>
                    <div className="flex items-center justify-between">
                      <code className="text-xs font-mono font-bold text-[#2DD4F5]">
                        {lic.licenseKey}
                      </code>
                      <button
                        onClick={() => copyKey(lic.licenseKey)}
                        className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        title="Salin License Key"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#0B1120] border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                      Versi Build
                    </span>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span>Dimiliki: <strong className="text-slate-200">{lic.ownedVersion}</strong></span>
                      <span>Terbaru: <strong className="text-cyan-400">{product?.currentVersion}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="font-bold text-xs"
                    onClick={() => downloadProduct(lic.productId, lic.ownedVersion)}
                  >
                    <DownloadCloud className="w-3.5 h-3.5 mr-1.5" />
                    Unduh Build ({lic.ownedVersion})
                  </Button>

                  <Link href={`/customer/products/${lic.productId}`}>
                    <Button variant="outline" size="sm" className="text-xs border-slate-700 text-slate-300 hover:text-white">
                      Detail &amp; Changelog <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>

                  {hasUpdate && (
                    <Link href="/customer/updates">
                      <Button variant="mint" size="sm" className="font-bold text-xs text-slate-950">
                        <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                        Unduh Update ({product?.currentVersion})
                      </Button>
                    </Link>
                  )}

                  <Link href="/customer/docs">
                    <Button variant="outline" size="sm" className="text-xs border-slate-700 text-slate-300 hover:text-white">
                      <FileCode className="w-3.5 h-3.5 mr-1.5" />
                      Dokumentasi Setup
                    </Button>
                  </Link>
                </div>
              </CustomerCard>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="Belum Ada Produk"
          description="Anda belum memiliki produk digital atau trial yang aktif."
          actionText="Jelajahi Toko Nexarin"
          onAction={() => (window.location.href = "/shop")}
        />
      )}
    </div>
  );
}
