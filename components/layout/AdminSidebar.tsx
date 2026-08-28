"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useContent } from "@/context/ContentContext";
import {
  LayoutDashboard,
  GraduationCap,
  DownloadCloud,
  FileEdit,
  Sparkles,
  Share2,
  ShoppingBag,
  History,
  Users,
  BarChart3,
  Settings,
  ShieldCheck,
  ChevronRight,
  LogOut,
  FolderGit2,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function AdminSidebar({ mobileOpen = false, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, logoutAdmin } = useAuth();
  const { drafts } = useContent();

  const pendingDraftsCount = drafts.filter((d) => d.status === "draft").length;

  const menuGroups = [
    {
      label: "OVERVIEW",
      items: [
        { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
        { href: "/admin/analytics", label: "Analytics & Traffic", icon: <BarChart3 className="w-4 h-4" /> },
      ]
    },
    {
      label: "EDITORIAL & KONTEN",
      items: [
        {
          href: "/admin/content",
          label: "Artikel & Review",
          icon: <FileEdit className="w-4 h-4" />,
          badge: pendingDraftsCount > 0 ? `${pendingDraftsCount}` : undefined,
          badgeColor: "bg-amber-500/20 text-amber-400 border border-amber-500/30"
        },
        {
          href: "/admin/tutorials",
          label: "Kelas & Tutorial",
          icon: <GraduationCap className="w-4 h-4 text-[#7CF2C3]" />
        },
        {
          href: "/admin/gemini-sync",
          label: "Sync Gemini Spark",
          icon: <Sparkles className="w-4 h-4 text-cyan-400" />
        },
      ]
    },
    {
      label: "DIGITAL SHOP",
      items: [
        { href: "/admin/shop", label: "Katalog & Versi", icon: <ShoppingBag className="w-4 h-4" /> },
        { href: "/admin/free-resources", label: "Free Resources", icon: <DownloadCloud className="w-4 h-4 text-[#7CF2C3]" /> },
        { href: "/admin/orders", label: "Transaksi & Orders", icon: <FolderGit2 className="w-4 h-4" /> },
        { href: "/admin/customers", label: "Data Pelanggan", icon: <Users className="w-4 h-4" /> },
      ]
    },
    {
      label: "MARKETING & AFILIASI",
      items: [
        { href: "/admin/affiliate", label: "Link Afiliasi", icon: <Share2 className="w-4 h-4" /> },
      ]
    },
    {
      label: "SISTEM & KEAMANAN",
      items: [
        { href: "/admin/audit-logs", label: "Audit Trail", icon: <History className="w-4 h-4" /> },
        { href: "/admin/settings", label: "Pengaturan Sistem", icon: <Settings className="w-4 h-4" /> },
      ]
    }
  ];

  const handleLogout = () => {
    logoutAdmin();
    router.push("/admin/login");
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0B1120] border-r border-white/[0.08]">
      {/* Admin Branding Header */}
      <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/assets/nexarin-logo.png"
            alt="Nexarin Admin"
            className="w-8 h-8 rounded-lg object-contain bg-slate-900 p-0.5 border border-cyan-500/30"
          />
          <div>
            <span className="font-extrabold text-sm text-white tracking-tight block leading-tight">
              Nexarin <span className="text-[#2DD4F5] font-mono">Console</span>
            </span>
            <span className="text-[10px] font-mono text-[#64748B] block leading-tight">
              Internal Admin v2.4
            </span>
          </div>
        </div>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-[#64748B] hover:text-white hover:bg-slate-800"
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
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group",
                    isActive
                      ? "bg-[#2DD4F5]/15 text-[#2DD4F5] font-bold border border-[#2DD4F5]/30 sm"
                      : "text-[#64748B] hover:text-white hover:bg-slate-800/60"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={cn(isActive ? "text-[#2DD4F5]" : "text-[#64748B] group-hover:text-[#F8FAFC]")}>
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

      {/* Admin User Footer in Sidebar */}
      <div className="p-3 border-t border-white/[0.08] bg-[#090F1C]">
        <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.035] border border-white/[0.08]">
          <div className="min-w-0 flex-1 mr-2">
            <span className="text-xs font-bold text-white block truncate">
              {admin?.name || "Admin Rins"}
            </span>
            <span className="text-[10px] font-mono text-[#64748B] block truncate">
              {admin?.email || "admin@nexarin.tech"}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
            title="Keluar Admin"
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
      <aside suppressHydrationWarning className="hidden lg:block w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16">
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
