"use client";

import React from "react";
import { useShop } from "@/context/ShopContext";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminCard } from "@/components/admin/AdminCard";
import { Badge } from "@/components/ui/Badge";
import { formatDateTime } from "@/lib/utils";
import { History, ShieldCheck, Terminal, UserCheck } from "lucide-react";

export default function AdminAuditLogsPage() {
  const { auditLogs } = useShop();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <AdminPageHeader
        title="Sistem Log Jejak Audit (Security Audit Trail)"
        description="Catatan immutable atas seluruh aksi administratif, publikasi artikel editorial, rilis versi baru, dan transaksi pesanan."
        badge={`${auditLogs.length} Log Tercatat`}
      />

      <div className="space-y-3">
        {auditLogs.map((log) => (
          <AdminCard key={log.id} className="space-y-2 font-mono text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {log.action}
                </span>
                <span className="font-bold text-white font-sans text-sm">{log.entityName}</span>
              </div>

              <div className="text-right text-[11px] text-slate-400 flex items-center gap-2">
                <span className="text-slate-200 font-semibold flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                  {log.adminName}
                </span>
                <span>•</span>
                <span>{formatDateTime(log.timestamp)}</span>
              </div>
            </div>

            <p className="text-slate-300 font-sans text-xs pt-1">
              {log.details}
            </p>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
