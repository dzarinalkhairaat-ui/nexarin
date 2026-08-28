"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import { useNotification } from "@/context/NotificationContext";
import {
  Menu,
  ExternalLink,
  LogOut,
  Sparkles,
  ShoppingBag,
  Bell,
  UserCheck
} from "lucide-react";

interface CustomerTopbarProps {
  onToggleMobileSidebar?: () => void;
}

export function CustomerTopbar({ onToggleMobileSidebar }: CustomerTopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { customer, logoutCustomer } = useAuth();
  const { getAvailableUpdatesForUser } = useShop();
  const { unreadCount, showToast } = useNotification();

  const updates = getAvailableUpdatesForUser(customer?.id || "usr-cust-001").filter(
    (u) => u.hasUpdate
  );

  const getModuleTitle = () => {
    if (pathname === "/customer") return "Dashboard Overview";
    if (pathname.startsWith("/customer/products")) return "Produk Digital Saya";
    if (pathname.startsWith("/customer/updates")) return "Pembaruan Versi Tersedia";
    if (pathname.startsWith("/customer/downloads")) return "Download Center";
    if (pathname.startsWith("/customer/orders")) return "Riwayat Pesanan & Tagihan";
    if (pathname.startsWith("/customer/licenses")) return "Kunci Lisensi Resmi";
    if (pathname.startsWith("/customer/docs")) return "Dokumentasi & Panduan";
    if (pathname.startsWith("/customer/notifications")) return "Pusat Notifikasi";
    if (pathname.startsWith("/customer/profile")) return "Pengaturan Profil & Akun";
    if (pathname.startsWith("/customer/support")) return "Bantuan & Tiket Dukungan";
    return "Customer Portal";
  };

  const handleLogout = () => {
    logoutCustomer();
    showToast({
      type: "info",
      title: "Sesi Berakhir",
      message: "Anda telah berhasil keluar dari akun Customer."
    });
    router.push("/login");
  };

  return (
    <header suppressHydrationWarning className="h-16 border-b border-white/[0.08] bg-[#0B1120]/90 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shrink-0">
      {/* Left: Mobile menu toggle + Breadcrumb */}
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
          <span className="text-[11px] font-mono font-bold text-[#2DD4F5] uppercase px-2 py-0.5 rounded-full bg-[#2DD4F5]/10 border border-[#2DD4F5]/20 hidden sm:inline">
            PORTAL
          </span>
          <span className="text-slate-600 hidden sm:inline">/</span>
          <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
            {getModuleTitle()}
          </h1>
        </div>
      </div>

      {/* Right: Actions, Updates, Profile & Logout */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Updates Indicator */}
        {updates.length > 0 && (
          <Link
            href="/customer/updates"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold hover:bg-emerald-500/25 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">{updates.length} Update Baru</span>
            <span className="sm:hidden">{updates.length}</span>
          </Link>
        )}

        {/* Public Shop Shortcut */}
        <Link
          href="/shop"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/[0.08] text-xs font-medium text-[#94A3B8] hover:text-white hover:border-white/[0.10] transition-colors"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-[#2DD4F5]" />
          <span>Toko Digital</span>
        </Link>

        {/* Customer Profile Pill */}
        <Link
          href="/customer/profile"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.035] border border-white/[0.08] hover:border-white/[0.10] transition-colors"
        >
          <img
            src={customer?.avatar || "/assets/avatar-default.svg"}
            alt="Customer Avatar"
            onError={(e) => {
              e.currentTarget.src = "/assets/avatar-default.svg";
            }}
            className="w-6 h-6 rounded-lg object-cover border border-[#2DD4F5]/40"
          />
          <div className="hidden lg:block text-left">
            <span className="text-xs font-bold text-white block leading-none truncate max-w-[120px]">
              {customer?.name || "Customer"}
            </span>
            <span className="text-[10px] text-[#64748B] block mt-0.5 leading-none font-mono truncate max-w-[120px]">
              {customer?.email || "customer@email.com"}
            </span>
          </div>
        </Link>

        {/* Logout Action */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-colors"
          title="Keluar dari akun Customer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Keluar</span>
        </button>
      </div>
    </header>
  );
}
