"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import { useNotification } from "@/context/NotificationContext";
import { CustomerPageHeader } from "@/components/customer/CustomerPageHeader";
import { CustomerCard } from "@/components/customer/CustomerCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { KeyRound, Copy, ShieldCheck } from "lucide-react";

export default function CustomerLicensesPage() {
  const { customer } = useAuth();
  const { getUserLicenses } = useShop();
  const { showToast } = useNotification();

  const userLicenses = getUserLicenses(customer?.id || "usr-cust-001");

  const copyKey = (key: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(key);
      showToast({
        type: "success",
        title: "License Key Disalin ke Clipboard",
        message: key
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <CustomerPageHeader
        title="Manajemen Lisensi Resmi (License Keys)"
        description="Kunci aktivasi resmi untuk aplikasi, template, dan sistem digital yang Anda miliki."
        badge={`${userLicenses.length} Lisensi Aktif`}
      />

      <div className="space-y-4">
        {userLicenses.map((lic) => (
          <CustomerCard key={lic.id} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
              <div>
                <h3 className="text-base font-bold text-white">
                  {lic.productName}
                </h3>
                <span className="text-xs text-[#6F8583] font-mono">Diterbitkan: {formatDate(lic.issuedAt)}</span>
              </div>
              <Badge variant={lic.licenseType === "lifetime" ? "mint" : "warning"} size="sm">
                {lic.licenseType === "lifetime" ? "Lifetime License" : "Trial 3 Hari"}
              </Badge>
            </div>

            <div className="p-4 rounded-2xl bg-[#061214] text-white border border-cyan-500/30 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#18D6D0] font-bold block mb-1">
                  Kunci Aktivasi Lisensi
                </span>
                <code className="text-sm sm:text-base font-mono font-bold text-cyan-300">
                  {lic.licenseKey}
                </code>
              </div>
              <Button
                variant="primary"
                size="sm"
                className="font-bold text-xs shrink-0"
                onClick={() => copyKey(lic.licenseKey)}
              >
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                Salin Kunci
              </Button>
            </div>

            <div className="text-xs text-[#6F8583] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Status: <strong className="text-white">{lic.status.toUpperCase()}</strong> • Berlaku untuk unlimited deployment deployment institusi/pribadi.</span>
            </div>
          </CustomerCard>
        ))}
      </div>
    </div>
  );
}
