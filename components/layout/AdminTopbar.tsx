"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import {
  ShieldCheck,
  ExternalLink,
  LogOut,
  Menu,
  Sparkles,
  Terminal,
  Activity
} from "lucide-react";

interface AdminTopbarProps {
  onToggleMobileSidebar?: () => void;
}

export function AdminTopbar({ onToggleMobileSidebar }: AdminTopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, logoutAdmin } = useAuth();
  const { showToast } = useNotification();

  const getModuleInfo = () => {
    if (pathname === "/admin") return { title: "Dashboard Overview", section: "OVERVIEW" };
    if (pathname === "/admin/analytics") return { title: "Traffic & Sales Analytics", section: "OVERVIEW" };
    if (pathname.startsWith("/admin/content")) return { title: "Manajemen Editorial & Artikel", section: "EDITORIAL" };
    if (pathname.startsWith("/admin/gemini-sync")) return { title: "Sinkronisasi AI Gemini Spark", section: "EDITORIAL" };
    if (pathname.startsWith("/admin/shop")) return { title: "Manajemen Toko & Produk Digital", section: "DIGITAL SHOP" };
    if (pathname.startsWith("/admin/orders")) return { title: "Data Transaksi & Pesanan", section: "DIGITAL SHOP" };
    if (pathname.startsWith("/admin/customers")) return { title: "Manajemen Pengguna & Lisensi", section: "DIGITAL SHOP" };
    if (pathname.startsWith("/admin/affiliate")) return { title: "Manajemen Link Afiliasi", section: "AFILIASI" };
    if (pathname.startsWith("/admin/audit-logs")) return { title: "Sistem Log Jejak Audit", section: "SISTEM" };
    if (pathname.startsWith("/admin/settings")) return { title: "Konfigurasi Sistem", section: "SISTEM" };
    return { title: "Admin Console", section: "CONSOLE" };
  };

  const moduleInfo = getModuleInfo();

  const handleLogout = () => {
    logoutAdmin();
    showToast({
      type: "info",
      title: "Sesi Admin Berakhir",
      message: "Anda telah berhasil keluar dari Admin Console."
    });
    router.push("/admin/login");
  };

  return (
    <header className="h-16 border-b border-white/[0.08] bg-[#0B1120]/90 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shrink-0">
      <div className="flex items-center gap-3">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-[#64748B] hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-cyan-400/80 uppercase px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 hidden sm:inline">
            {moduleInfo.section}
          </span>
          <span className="text-slate-600 hidden sm:inline">/</span>
          <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
            {moduleInfo.title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* System Health Status Indicator */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>System Healthy • v2.4</span>
        </div>

        {/* View Public Website Link (Utility action with external indicator) */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/[0.08] text-xs font-medium text-[#94A3B8] hover:text-white hover:border-white/[0.10] transition-colors"
          title="Buka Website Publik di tab baru"
        >
          <span>Lihat Website</span>
          <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
        </a>

        {/* Admin Identity Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.035] border border-white/[0.08]">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono text-[10px] font-bold">
            AD
          </div>
          <div className="hidden lg:block text-left">
            <span className="text-xs font-bold text-white block leading-none">
              {admin?.name || "Admin Rins"}
            </span>
            <span className="text-[10px] font-mono text-cyan-400 block mt-0.5 leading-none">
              Superadmin
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-colors"
          title="Keluar dari Admin Console"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Keluar</span>
        </button>
      </div>
    </header>
  );
}
