"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import { CustomerPageHeader } from "@/components/customer/CustomerPageHeader";
import { CustomerCard } from "@/components/customer/CustomerCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { formatDate } from "@/lib/utils";
import { Sparkles, DownloadCloud, CheckCircle2, History, ArrowRight } from "lucide-react";

export default function CustomerUpdatesPage() {
  const { customer } = useAuth();
  const { getAvailableUpdatesForUser, downloadProduct } = useShop();

  const updatesInfo = getAvailableUpdatesForUser(customer?.id || "usr-cust-001");
  const pendingUpdates = updatesInfo.filter((u) => u.hasUpdate);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <CustomerPageHeader
        title="Pusat Pembaruan Versi (Product Updates)"
        description="Daftar rilis versi baru untuk produk yang Anda miliki. Dapatkan pembaruan gratis langsung ke build aplikasi Anda."
        badge={pendingUpdates.length > 0 ? `${pendingUpdates.length} Siap Unduh` : "Up to date"}
      />

      {pendingUpdates.length > 0 ? (
        <div className="space-y-4">
          {pendingUpdates.map(({ product, license, latestVersion }) => (
            <CustomerCard key={product.id} className="space-y-4 border-emerald-500/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="mint" size="sm">
                      Versi Baru: {latestVersion.version}
                    </Badge>
                    <span className="text-xs font-mono text-[#6F8583]">
                      (Versi Anda: {license.ownedVersion})
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {product.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="mint"
                    size="sm"
                    className="font-bold text-slate-950 whitespace-nowrap"
                    onClick={() => downloadProduct(product.id, latestVersion.version)}
                  >
                    <DownloadCloud className="w-3.5 h-3.5 mr-1.5" />
                    Unduh Versi {latestVersion.version}
                  </Button>
                  <Link href={`/customer/products/${product.id}`}>
                    <Button variant="outline" size="sm" className="text-xs border-white/[0.10] text-[#A8BCBA] hover:text-white">
                      Detail
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Changelog Notes */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#A8BCBA] font-mono">
                  What's New in Version {latestVersion.version}:
                </h4>
                <ul className="space-y-1.5 text-xs text-[#A8BCBA]">
                  {latestVersion.releaseNotes.map((note, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#49D7A5] shrink-0 mt-0.5" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 text-[11px] text-[#6F8583] font-mono flex items-center justify-between border-t border-white/[0.08]">
                <span>Ukuran File: {latestVersion.fileSize}</span>
                <span>Tanggal Rilis: {formatDate(latestVersion.releaseDate)}</span>
              </div>
            </CustomerCard>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<CheckCircle2 className="w-8 h-8 text-emerald-400" />}
          title="Semua Produk Anda Berada pada Versi Terbaru"
          description="Tidak ada pembaruan tertunda saat ini. Anda akan menerima notifikasi otomatis ketika admin merilis versi baru."
        />
      )}
    </div>
  );
}
