"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export function AppLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const isCustomerAuthRoute =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password";
  const isCustomerAppRoute = pathname?.startsWith("/customer");

  // 1. Admin Application Domain (/admin/*)
  if (isAdminRoute) {
    return <div suppressHydrationWarning className="min-h-screen bg-[#0B1120] text-[#F8FAFC] flex flex-col">{children}</div>;
  }

  // 2. Customer Auth Domain (/login, /register, /forgot-password)
  if (isCustomerAuthRoute) {
    return <div suppressHydrationWarning className="min-h-screen bg-[#0B1120] text-[#F8FAFC] flex flex-col">{children}</div>;
  }

  // 3. Customer Dashboard Application Domain (/customer/*)
  if (isCustomerAppRoute) {
    return <div suppressHydrationWarning className="min-h-screen bg-[#0B1120] text-[#F8FAFC] flex flex-col">{children}</div>;
  }

  // 4. Public Website Domain (/, /shop, /article, /about, etc.)
  return (
    <>
      <Navbar />
      <main suppressHydrationWarning className="flex-1 pb-16">{children}</main>
      <Footer />
    </>
  );
}
