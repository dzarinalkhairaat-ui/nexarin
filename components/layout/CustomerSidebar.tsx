"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import { useNotification } from "@/context/NotificationContext";
import {
  LayoutDashboard,
  PackageCheck,
  DownloadCloud,
  Sparkles,
  Receipt,
  KeyRound,
  FileCode2,
  Bell,
  UserCircle,
  HelpCircle,
  LogOut,
  ChevronRight,
  ShoppingBag,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomerSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function CustomerSidebar({ mobileOpen = false, onCloseMobile }: CustomerSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { customer, logoutCustomer } = useAuth();
  const { getAvailableUpdatesForUser } = useShop();
  const { unreadCount } = useNotification();

  const updatesCount = getAvailableUpdatesForUser(customer?.id || "usr-cust-001").filter(
    (u) => u.hasUpdate
  ).length;

  const menuGroups = [
    {
      label: "OVERVIEW",
      items: [
        { href: "/customer", label: "Dashboard Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
      ]
    },
    {
      label: "PRODUK & LISENSI",
      items: [
        { href: "/customer/products", label: "Produk Saya", icon: <PackageCheck className="w-4 h-4" /> },
        { href: "/customer/downloads", label: "Download Center", icon: <DownloadCloud className="w-4 h-4" /> },
        {
          href: "/customer/updates",
          label: "Pembaruan Versi",
          icon: <Sparkles className="w-4 h-4 text-[#7CF2C3]" />,
          badge: updatesCount > 0 ? `${updatesCount} Baru` : undefined,
          badgeColor: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
        },
        { href: "/customer/licenses", label: "Kunci Lisensi", icon: <KeyRound className="w-4 h-4" /> },
        { href: "/customer/orders", label: "Riwayat Pesanan", icon: <Receipt className="w-4 h-4" /> },
      ]
    },
    {
      label: "PANDUAN & BANTUAN",
      items: [
        { href: "/customer/docs", label: "Dokumentasi Setup", icon: <FileCode2 className="w-4 h-4" /> },
        { href: "/customer/support", label: "Bantuan & Tiket", icon: <HelpCircle className="w-4 h-4" /> },
        {
          href: "/customer/notifications",
          label: "Notifikasi",
          icon: <Bell className="w-4 h-4" />,
          badge: unreadCount > 0 ? `${unreadCount}` : undefined,
          badgeColor: "bg-rose-500 text-white"
        },
      ]
    },
    {
      label: "PENGATURAN",
      items: [
        { href: "/customer/profile", label: "Profil & Akun", icon: <UserCircle className="w-4 h-4" /> },
      ]
    }
  ];

  const handleLogout = () => {
    logoutCustomer();
    router.push("/login");
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0B1120] border-r border-[#1E293B]">
      {/* Customer Portal Brand Header */}
      <div className="p-4 border-b border-[#1E293B] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/assets/nexarin-logo.png"
            alt="Nexarin Customer Portal"
            className="w-8 h-8 rounded-lg object-contain"
          />
          <div>
            <span className="font-extrabold text-sm text-white tracking-tight block leading-tight">
              Customer <span className="text-[#2DD4F5]">Portal</span>
            </span>
            <span className="text-[10px] text-slate-400 block leading-tight font-medium">
              Nexarin Digital Services
            </span>
          </div>
        </Link>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Groups (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5">
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
              {group.label}
            </div>
            {group.items.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/customer" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group",
                    isActive
                      ? "bg-[#2DD4F5]/15 text-[#2DD4F5] font-bold border border-[#2DD4F5]/30 shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={cn(isActive ? "text-[#2DD4F5]" : "text-slate-400 group-hover:text-slate-200")}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className={cn("px-1.5 py-0.2 text-[10px] font-bold font-mono rounded-full", item.badgeColor)}>
                      {item.badge}
                    </span>
                  ) : (
                    <ChevronRight className={cn("w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity", isActive && "opacity-100")} />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer in Sidebar */}
      <div className="p-3 border-t border-[#1E293B] bg-[#090F1C] space-y-2">
        <Link
          href="/shop"
          className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-300 hover:text-white transition-colors"
        >
          <span className="flex items-center gap-2">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Katalog Produk Baru</span>
          </span>
          <span className="text-[10px] font-mono text-cyan-400">?</span>
        </Link>

        <div className="flex items-center justify-between p-2 rounded-xl bg-[#131E32] border border-[#1E293B]">
          <div className="min-w-0 flex-1 mr-2">
            <span className="text-xs font-bold text-white block truncate">
              {customer?.name || "Customer"}
            </span>
            <span className="text-[10px] font-mono text-slate-400 block truncate">
              {customer?.email || "customer@email.com"}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
            title="Keluar Akun"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden lg:block w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
          />
          <div className="relative w-72 max-w-[80vw] h-full z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
