"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TECH_INFO_NAV_LINKS } from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import {
  Menu,
  X,
  Search,
  User,
  ShoppingBag,
  LogOut,
  Sparkles,
  ArrowLeft,
  LogIn,
  Layers,
  ChevronDown,
  LayoutDashboard,
  Home,
  Cpu,
  Globe,
  Smartphone,
  Car,
  Newspaper,
  Terminal
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS_MAP: Record<string, React.ElementType> = {
  Newspaper,
  Sparkles,
  Cpu,
  Globe,
  Smartphone,
  Car,
};

export function TechInfoHeader() {
  const pathname = usePathname();
  const { customer, isCustomerAuthenticated, logoutCustomer, admin, isAdminAuthenticated, logoutAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navContainerRef = useRef<HTMLDivElement | null>(null);
  const linkRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    setIsProfileDropdownOpen(false);
    setMobileMenuOpen(false);

    const updateIndicator = () => {
      const activeLink = TECH_INFO_NAV_LINKS.find(
        (link) => pathname === link.href || (link.href !== "/tech-info" && pathname.startsWith(link.href))
      );

      if (activeLink && linkRefs.current[activeLink.href] && navContainerRef.current) {
        const el = linkRefs.current[activeLink.href];
        const container = navContainerRef.current;
        if (el) {
          const elRect = el.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          setIndicatorStyle({
            left: elRect.left - containerRect.left,
            width: elRect.width,
            opacity: 1
          });
        }
      } else if (pathname === "/tech-info" && linkRefs.current["/tech-info"] && navContainerRef.current) {
        const el = linkRefs.current["/tech-info"];
        const container = navContainerRef.current;
        if (el) {
          const elRect = el.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          setIndicatorStyle({
            left: elRect.left - containerRect.left,
            width: elRect.width,
            opacity: 1
          });
        }
      } else {
        setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    };

    const timer = setTimeout(updateIndicator, 20);
    window.addEventListener("resize", updateIndicator);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [pathname]);

  const isAuthenticated = (isCustomerAuthenticated && !!customer) || (isAdminAuthenticated && !!admin);

  return (
    <>
      <header suppressHydrationWarning className="sticky top-3 sm:top-4 z-40 w-full px-3 sm:px-6 pointer-events-none transition-all">
        <div
          className="max-w-6xl mx-auto rounded-full px-3.5 sm:px-5 py-2 sm:py-2.5 pointer-events-auto transition-all duration-300 flex items-center justify-between relative"
          style={{
            background:
              "linear-gradient(180deg, rgba(14,16,26,0.85), rgba(14,16,26,0.55)) padding-box, linear-gradient(120deg, rgba(255,255,255,0.25), rgba(45,212,245,0.25), rgba(124,242,195,0.15)) border-box",
            border: "1px solid transparent",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.45)"
          }}
        >
          {/* Brand Logo & Tech Info Title */}
          <div className="flex items-center gap-3">
            <Link
              href="/tech-info"
              className="flex items-center gap-2.5 group focus:outline-none"
            >
              <div className="relative w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/assets/nexarin-logo.png"
                  alt="Tech Info"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold tracking-tight text-sm text-white group-hover:text-[#2DD4F5] transition-colors">
                    Tech Info
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#2DD4F5]/15 text-[#2DD4F5] border border-[#2DD4F5]/30">
                    NEWS
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            ref={navContainerRef}
            aria-label="Tech Info Channels"
            className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2 py-1"
          >
            {/* Smooth Sliding Active Pill Indicator */}
            <div
              className="absolute top-1 bottom-1 rounded-full pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
                opacity: indicatorStyle.opacity,
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(45, 212, 245, 0.35)",
                boxShadow: "0 0 16px rgba(45, 212, 245, 0.15)"
              }}
            />

            {TECH_INFO_NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/tech-info"
                  ? pathname === "/tech-info"
                  : pathname === link.href || pathname.startsWith(link.href);
              const IconComp = ICONS_MAP[link.icon] || Newspaper;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  ref={(el) => {
                    linkRefs.current[link.href] = el;
                  }}
                  className={cn(
                    "relative z-10 px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 select-none flex items-center gap-1.5",
                    isActive
                      ? "text-white font-bold"
                      : "text-[#94A3B8] hover:text-[#F8FAFC]"
                  )}
                >
                  <IconComp className={cn("w-3.5 h-3.5 shrink-0 transition-colors", isActive ? "text-[#2DD4F5]" : "text-[#64748B]")} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            
            {/* Quick Back to Nexarin Hub Button */}
            <Link
              href="/"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all duration-200"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#2DD4F5]" />
              <span>Nexarin Hub</span>
            </Link>

            {/* User Profile / Auth State */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-[#2DD4F5]/30 transition-all text-left"
                >
                  <img
                    src={customer?.avatar || admin?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop"}
                    alt="Profile"
                    className="w-6 h-6 rounded-full object-cover border border-white/20"
                  />
                  <span className="text-xs font-bold text-white max-w-[90px] truncate hidden sm:inline">
                    {admin ? "Admin" : customer?.name?.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#0F172A] border border-white/[0.10] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1">
                    {admin ? (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-white hover:bg-white/[0.06] transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#2DD4F5]" />
                        <span>Admin Console</span>
                      </Link>
                    ) : (
                      <Link
                        href="/customer"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-white hover:bg-white/[0.06] transition-colors"
                      >
                        <User className="w-4 h-4 text-[#7CF2C3]" />
                        <span>Customer Portal</span>
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (admin) logoutAdmin();
                        else logoutCustomer();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar (Sign Out)</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button variant="primary" size="sm" className="h-8 px-3.5 text-xs font-extrabold rounded-full flex items-center gap-1.5 shadow-md shadow-cyan-500/20">
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Masuk</span>
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full text-slate-300 hover:text-white bg-white/[0.04] border border-white/[0.08]"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden max-w-6xl mx-auto mt-2 pointer-events-auto rounded-3xl bg-[#0F172A]/95 border border-white/[0.12] p-4 backdrop-blur-2xl shadow-2xl space-y-3 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 gap-2">
              {TECH_INFO_NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/tech-info" && pathname.startsWith(link.href));
                const IconComp = ICONS_MAP[link.icon] || Newspaper;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-2xl text-xs font-bold transition-all",
                      isActive
                        ? "bg-[#2DD4F5]/15 text-[#2DD4F5] border border-[#2DD4F5]/30"
                        : "text-slate-300 hover:text-white hover:bg-white/[0.04]"
                    )}
                  >
                    <IconComp className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 border-t border-white/[0.08]">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full p-2.5 rounded-2xl text-xs font-bold text-slate-300 bg-white/[0.04] border border-white/[0.08]"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#2DD4F5]" />
                <span>Kembali ke Nexarin Hub Utama</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
