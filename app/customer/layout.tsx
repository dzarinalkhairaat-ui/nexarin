"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { CustomerSidebar } from "@/components/layout/CustomerSidebar";
import { CustomerTopbar } from "@/components/layout/CustomerTopbar";
import { UserCheck, Lock } from "lucide-react";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isCustomerAuthenticated, isLoading } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isCustomerAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isCustomerAuthenticated, isLoading, pathname, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#061214] flex items-center justify-center text-xs text-[#6F8583] font-mono">
        <UserCheck className="w-4 h-4 animate-pulse mr-2 text-cyan-400" />
        <span>Memvalidasi Sesi Customer...</span>
      </div>
    );
  }

  // Unauthorized fallback state
  if (!isCustomerAuthenticated) {
    return (
      <div className="min-h-screen bg-[#061214] flex items-center justify-center px-4">
        <div className="max-w-md p-8 rounded-3xl bg-white/[0.035] border border-cyan-500/30 text-center space-y-4">
          <Lock className="w-10 h-10 text-cyan-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Login Diperlukan</h2>
          <p className="text-xs text-[#6F8583]">
            Silakan masuk ke akun Customer Anda untuk mengakses dashboard lisensi dan pembaruan produk.
          </p>
        </div>
      </div>
    );
  }

  // Authenticated Customer Workspace Layout
  return (
    <div className="min-h-screen bg-[#061214] text-[#F2FAF9] flex flex-col">
      <CustomerTopbar onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
      <div className="flex-1 flex">
        <CustomerSidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
