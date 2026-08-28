"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminTopbar } from "@/components/layout/AdminTopbar";
import { Terminal, ShieldAlert } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdminAuthenticated, isLoading } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isLoading && !isAdminAuthenticated && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [isAdminAuthenticated, isLoading, isLoginPage, router]);

  // If on Admin Login page, render clean isolated full-screen container
  if (isLoginPage) {
    return <div suppressHydrationWarning className="min-h-screen bg-[#0B1120] text-[#F8FAFC]">{children}</div>;
  }

  // Loading state
  if (isLoading) {
    return (
      <div suppressHydrationWarning className="min-h-screen bg-[#0B1120] flex items-center justify-center text-xs text-[#64748B] font-mono">
        <Terminal className="w-4 h-4 animate-spin mr-2 text-cyan-400" />
        <span>Memverifikasi Sesi Otoritas Administrator...</span>
      </div>
    );
  }

  // Unauthorized guard fallback
  if (!isAdminAuthenticated) {
    return (
      <div suppressHydrationWarning className="min-h-screen bg-[#0B1120] flex items-center justify-center px-4">
        <div className="max-w-md p-8 rounded-3xl bg-[#0B1120] border border-rose-500/30 text-center space-y-4">
          <ShieldAlert className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-white">Akses Terbatas</h2>
          <p className="text-xs text-[#64748B]">
            Halaman ini berada dalam zona otorisasi Administrator Nexarin Tech.
          </p>
        </div>
      </div>
    );
  }

  // Authenticated Admin Workspace Layout
  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#0B1120] text-[#F8FAFC] flex flex-col">
      <AdminTopbar onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
      <div className="flex-1 flex">
        <AdminSidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />
        <main suppressHydrationWarning className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
