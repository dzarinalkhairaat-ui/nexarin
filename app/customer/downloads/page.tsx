"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import { CustomerPageHeader } from "@/components/customer/CustomerPageHeader";
import { CustomerCard } from "@/components/customer/CustomerCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDateTime } from "@/lib/utils";
import { DownloadCloud, ShieldCheck, Key, FileCheck, Terminal } from "lucide-react";

export default function CustomerDownloadsPage() {
  const { customer } = useAuth();
  const { downloads, downloadProduct, getUserLicenses } = useShop();

  const userLicenses = getUserLicenses(customer?.id || "usr-cust-001");

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <CustomerPageHeader
        title="Pusat Unduhan Aman (Download Center)"
        description="Akses token unduhan terenkripsi privat dengan validasi lisensi resmi secara otomatis."
        badge="Protected Storage"
      />

      {/* Available Downloads Based on Ownership */}
      <section className="space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
          File Siap Diunduh Berdasarkan Lisensi Aktif ({userLicenses.length}):
        </h3>

        {userLicenses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userLicenses.map((lic) => (
              <CustomerCard key={lic.id} className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-white line-clamp-1">
                    {lic.productName}
                  </h4>
                  <span className="text-xs font-mono text-[#6F8583] mt-0.5 block">
                    Versi Dimiliki: <strong className="text-cyan-300">{lic.ownedVersion}</strong> • ZIP Build Package
                  </span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="font-bold text-xs shrink-0"
                  onClick={() => downloadProduct(lic.productId, lic.ownedVersion)}
                >
                  <DownloadCloud className="w-3.5 h-3.5 mr-1.5" />
                  Unduh Build
                </Button>
              </CustomerCard>
            ))}
          </div>
        ) : (
          <CustomerCard className="p-8 text-center text-xs text-[#6F8583]">
            Anda belum memiliki lisensi produk digital untuk diunduh.
          </CustomerCard>
        )}
      </section>

      {/* Download Activity Records */}
      <section className="space-y-4 pt-4 border-t border-white/[0.08]">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#49D7A5]" />
          <h3 className="text-base font-bold text-white tracking-tight">
            Log Jejak Token Unduhan Terverifikasi
          </h3>
        </div>

        {downloads.length > 0 ? (
          <div className="space-y-2.5">
            {downloads.map((dl) => (
              <CustomerCard key={dl.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                <div className="space-y-1">
                  <span className="font-bold text-white block">
                    {dl.productName} ({dl.version})
                  </span>
                  <span className="text-[11px] text-[#6F8583]">
                    Checksum SHA-256: {dl.checksum.slice(0, 28)}...
                  </span>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <span className="text-[#6F8583] text-[11px]">{formatDateTime(dl.downloadedAt)}</span>
                  <Badge variant="mint" size="sm">
                    Verified
                  </Badge>
                </div>
              </CustomerCard>
            ))}
          </div>
        ) : (
          <CustomerCard className="p-6 text-xs text-[#6F8583] text-center font-mono">
            Belum ada catatan aktivitas unduhan terbaru.
          </CustomerCard>
        )}
      </section>
    </div>
  );
}
