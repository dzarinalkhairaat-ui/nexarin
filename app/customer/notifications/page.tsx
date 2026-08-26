"use client";

import React from "react";
import Link from "next/link";
import { useNotification } from "@/context/NotificationContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/lib/utils";
import { Bell, CheckCheck, Trash2, Sparkles, CheckCircle2, Info } from "lucide-react";

export default function CustomerNotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, clearNotifications } = useNotification();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Pusat Notifikasi
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#64748B]">
            Pemberitahuan pembaruan versi produk, lisensi, dan status transaksi
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead} className="text-xs">
            <CheckCheck className="w-3.5 h-3.5 mr-1" />
            Tandai Dibaca
          </Button>
          <Button variant="ghost" size="sm" onClick={clearNotifications} className="text-xs text-rose-500 hover:text-rose-600">
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Hapus Semua
          </Button>
        </div>
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <Card
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              className={`p-5 flex items-start gap-4 cursor-pointer transition-colors ${
                !notif.read ? "border-cyan-500/40 bg-cyan-500/5 dark:bg-cyan-500/10" : ""
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {notif.title}
                  </h4>
                  <span className="text-[11px] font-mono text-[#64748B]">
                    {formatDateTime(notif.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-[#64748B] mt-1 leading-relaxed">
                  {notif.message}
                </p>
                {notif.link && (
                  <Link href={notif.link} className="inline-block mt-2 text-xs font-bold text-[#0891b2] dark:text-[#2DD4F5] hover:underline">
                    Buka Detail →
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center text-xs text-slate-500">
          Tidak ada notifikasi baru saat ini.
        </Card>
      )}
    </div>
  );
}
