"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { publicNavigation } from "@/config/navigation.config";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

import {
  HomeIcon,
  DagangIcon,
  PortfolioIcon,
  NewsIcon,
  AboutIcon,
  ContactIcon,
  QuestionIcon,
  FileIcon,
  SparkleIcon
} from "@/components/shared/MenuIcons";

function getMenuIcon(label) {
  switch (label) {
    case "Home": return <HomeIcon className="h-4 w-4" />;
    case "Nexarin Dagang": return <DagangIcon className="h-4 w-4" />;
    case "Portfolio": return <PortfolioIcon className="h-4 w-4" />;
    case "News": return <NewsIcon className="h-4 w-4" />;
    case "About": return <AboutIcon className="h-4 w-4" />;
    case "Contact": return <ContactIcon className="h-4 w-4" />;
    case "Nexarin Tools": return <SparkleIcon className="h-4 w-4" />;
    default: return <span className="text-xs font-bold">&rarr;</span>;
  }
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

function HeaderLogo() {
  return (
    <Link
      href="/"
      aria-label="Nexarin Home"
      className="group flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-emerald-400/20 bg-white/[0.045] p-1.5 shadow-lg shadow-emerald-400/10 outline-none transition hover:-translate-y-0.5 hover:border-emerald-400/35 hover:bg-emerald-400/10 focus-visible:ring-2 focus-visible:ring-emerald-400/60"
    >
      <img
        src="/images/logo/nexarin-logo.png"
        alt="Nexarin logo"
        className="h-full w-full object-contain drop-shadow-[0_0_14px_rgba(52,211,153,0.18)] transition group-hover:scale-105"
        loading="eager"
        decoding="async"
      />
    </Link>
  );
}

function DesktopNavigation({ navigation }) {
  const safeNavigation = Array.isArray(navigation) ? navigation : [];

  return (
    <nav className="hidden lg:flex items-center gap-2">
      {safeNavigation.map((item) => (
        <Link
          key={item?.href || item?.label}
          href={item?.href || "/"}
          className="group relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-slate-300 transition hover:text-white"
        >
          <span className="relative z-10">{item?.label || "Menu"}</span>
          <span className="absolute inset-0 z-0 scale-95 rounded-xl bg-white/[0.05] opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 border border-white/5 group-hover:border-emerald-400/20" />
        </Link>
      ))}
      <Link 
        href="/admin/login"
        className="ml-2 inline-flex items-center justify-center rounded-xl bg-emerald-400/10 border border-emerald-400/20 px-4 py-2 text-sm font-bold text-emerald-300 transition hover:-translate-y-0.5 hover:bg-emerald-400/20 shadow-lg shadow-emerald-400/5"
      >
        Admin Login
      </Link>
    </nav>
  );
}

function MenuButton({ isOpen, onClick }) {
  return (
    <button
      type="button"
      aria-label={isOpen ? "Tutup menu Nexarin" : "Buka menu Nexarin"}
      aria-expanded={isOpen}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.065] shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-emerald-400/25 hover:bg-emerald-400/10 lg:hidden"
    >
      <span className="relative h-4 w-5">
        <span
          className={`absolute left-0 top-0 block h-[1.5px] w-5 rounded-full bg-white transition duration-300 ${
            isOpen ? "translate-y-1.5 rotate-45" : ""
          }`}
        />
        <span
          className={`absolute left-0 top-1.5 block h-[1.5px] w-5 rounded-full bg-white transition duration-300 ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`absolute left-0 top-3 block h-[1.5px] w-5 rounded-full bg-white transition duration-300 ${
            isOpen ? "-translate-y-1.5 -rotate-45" : ""
          }`}
        />
      </span>
    </button>
  );
}

function MenuPanel({ navigation, onClose }) {
  const safeNavigation = Array.isArray(navigation) ? navigation : [];

  return (
    <div className="relative z-10 overflow-hidden border-t border-white/10 lg:hidden">
      <div className="mx-auto w-full max-w-7xl px-5 pb-5 pt-3 sm:px-6">
        <nav className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] p-3 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(16,185,129,0.16),transparent_34%),radial-gradient(circle_at_85%_70%,rgba(6,182,212,0.1),transparent_34%)]" />

          <div className="relative z-10 grid gap-2">
            {safeNavigation.length > 0 ? (
              safeNavigation.map((item) => {
                const isLocked = false; // ["About"].includes(item?.label);

                return isLocked ? (
                  <div
                    key={item?.href || item?.label}
                    className="group flex min-h-12 items-center justify-between rounded-2xl border border-white/5 bg-slate-950/30 px-4 py-3 text-sm font-black text-slate-500 shadow-lg shadow-black/10 cursor-not-allowed select-none"
                    title="Menu ini sedang dikunci"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-700/30 bg-slate-800/50 text-xs text-slate-500">
                        {getMenuIcon(item?.label)}
                      </span>
                      <span className="truncate">{item?.label || "Menu"}</span>
                    </span>
                    <span className="text-slate-600">
                      <LockIcon className="h-4 w-4" />
                    </span>
                  </div>
                ) : (
                  <Link
                    key={item?.href || item?.label}
                    href={item?.href || "/"}
                    onClick={onClose}
                    className="group flex min-h-12 items-center justify-between rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm font-black text-slate-200 shadow-lg shadow-black/10 transition hover:border-emerald-400/25 hover:bg-emerald-400/10 hover:text-white"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-xs text-emerald-300">
                        {getMenuIcon(item?.label)}
                      </span>
                      <span className="truncate">{item?.label || "Menu"}</span>
                    </span>
                    <span className="text-emerald-300 transition group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                );
              })
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-sm font-semibold text-slate-400">
                Menu belum tersedia.
              </div>
            )}
            
            <div className="mt-2 grid grid-cols-3 gap-2">
              <Link
                href="/support"
                onClick={onClose}
                className="flex min-h-10 items-center justify-center rounded-xl border border-white/10 bg-slate-950/55 px-2 text-[11px] font-black uppercase tracking-wider text-slate-400 shadow-lg shadow-black/10 transition hover:border-emerald-400/25 hover:bg-emerald-400/10 hover:text-emerald-300"
              >
                Support
              </Link>
              <Link
                href="/faq"
                onClick={onClose}
                className="flex min-h-10 items-center justify-center rounded-xl border border-white/10 bg-slate-950/55 px-2 text-[11px] font-black uppercase tracking-wider text-slate-400 shadow-lg shadow-black/10 transition hover:border-emerald-400/25 hover:bg-emerald-400/10 hover:text-emerald-300"
              >
                FAQ
              </Link>
              <Link
                href="/terms"
                onClick={onClose}
                className="flex min-h-10 items-center justify-center rounded-xl border border-white/10 bg-slate-950/55 px-2 text-[11px] font-black uppercase tracking-wider text-slate-400 shadow-lg shadow-black/10 transition hover:border-emerald-400/25 hover:bg-emerald-400/10 hover:text-emerald-300"
              >
                S&K
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default function Header({ showSearch = false }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const navigation = Array.isArray(publicNavigation) ? publicNavigation : [];

  function closeMenu() {
    setIsOpen(false);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      startTransition(() => {
        router.push(`/news/search?q=${encodeURIComponent(searchQuery.trim())}`);
      });
    }
  }

  return (
    <header className="relative z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(16,185,129,0.16),transparent_34%),radial-gradient(circle_at_85%_10%,rgba(6,182,212,0.1),transparent_30%)]" />

      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/35 to-transparent" />
      <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-3 sm:px-6 lg:px-8">
        {isSearching ? (
          <form onSubmit={handleSearchSubmit} className="flex w-full items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
            <input 
              type="search" 
              autoFocus 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari artikel berita..." 
              className="flex-1 rounded-xl bg-slate-900/50 border border-white/10 px-4 py-2.5 text-sm font-medium text-white placeholder-slate-400 outline-none focus:border-emerald-400/50 shadow-inner [&::-webkit-search-cancel-button]:hidden" 
            />
            <button type="submit" disabled={isPending} className="hidden sm:inline-flex items-center justify-center rounded-xl bg-emerald-400 px-5 py-2.5 text-sm font-black text-slate-950 transition hover:bg-emerald-300 shadow-lg shadow-emerald-400/20 disabled:opacity-50 disabled:cursor-not-allowed">
              {isPending ? <><LoadingSpinner className="h-4 w-4 mr-2" /> ...</> : "Cari"}
            </button>
            <button type="button" onClick={() => setIsSearching(false)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.065] transition hover:-translate-y-0.5 hover:border-red-400/25 hover:bg-red-400/10 text-white">
              <span className="text-xl leading-none">&times;</span>
            </button>
          </form>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <HeaderLogo />

              <Link
                href="/"
                aria-label="Nexarin Home"
                onClick={closeMenu}
                className="min-w-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
              >
                <p className="truncate text-[1rem] font-black leading-tight tracking-[-0.04em] text-white">
                  Nexarin
                </p>
                <p className="mt-0.5 truncate text-[11px] font-semibold text-slate-400">
                  by-rins
                </p>
              </Link>
            </div>

            <DesktopNavigation navigation={navigation} />

            <div className="flex items-center gap-2">
              {showSearch && (
                <button
                  type="button"
                  onClick={() => setIsSearching(true)}
                  aria-label="Cari artikel"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.065] shadow-lg shadow-black/20 text-slate-300 transition hover:-translate-y-0.5 hover:border-emerald-400/25 hover:bg-emerald-400/10 hover:text-emerald-300"
                >
                  <SearchIcon />
                </button>
              )}
              <MenuButton isOpen={isOpen} onClick={() => setIsOpen((value) => !value)} />
            </div>
          </>
        )}
      </div>

      <div
        className={`grid transition-all duration-300 ease-out lg:hidden ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
        }`}
      >
        <div className="overflow-hidden">
          <MenuPanel navigation={navigation} onClose={closeMenu} />
        </div>
      </div>
    </header>
  );
}
