"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { newsNavigation } from "@/features/news/news.data";

const FALLBACK_NEWS_NAVIGATION = [
  {
    label: "News Home",
    href: "/news",
  },
  {
    label: "Search News",
    href: "/news/search",
  },
  {
    label: "Products",
    href: "/products",
  },
  {
    label: "Portfolio",
    href: "/portfolio",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
    >
      <path
        d="M10.75 18.5a7.75 7.75 0 1 1 0-15.5 7.75 7.75 0 0 1 0 15.5Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M16.5 16.5 21 21"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
    >
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function getSafeNavigationItems() {
  const rawNavigation = Array.isArray(newsNavigation) ? newsNavigation : [];

  const normalizedNavigation = rawNavigation
    .map((item, index) => ({
      label: String(item?.label || `Menu ${index + 1}`).trim(),
      href: String(item?.href || "/news").trim(),
    }))
    .filter((item) => item.label && item.href);

  return normalizedNavigation.length > 0
    ? normalizedNavigation
    : FALLBACK_NEWS_NAVIGATION;
}

function SearchButton({ onClick }) {
  return (
    <button
      type="button"
      aria-label="Buka pencarian News"
      onClick={onClick}
      className="group flex h-10 w-10 items-center justify-center rounded-[17px] border border-cyan-300/15 bg-white/[0.055] text-slate-100 shadow-lg shadow-black/20 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-cyan-300/35 hover:bg-cyan-400/10 hover:text-cyan-200"
    >
      <SearchIcon />
    </button>
  );
}

function MenuButton({ isOpen, onClick }) {
  return (
    <button
      type="button"
      aria-label={isOpen ? "Tutup menu News" : "Buka menu News"}
      aria-expanded={isOpen}
      onClick={onClick}
      className="group flex h-10 w-10 items-center justify-center rounded-[17px] border border-white/10 bg-white/[0.06] shadow-lg shadow-black/20 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-emerald-400/30 hover:bg-emerald-400/10"
    >
      <span className="relative h-4 w-5">
        <span
          className={`absolute left-0 top-0 block h-0.5 w-5 rounded-full bg-white transition ${
            isOpen ? "translate-y-[7px] rotate-45" : ""
          }`}
        />
        <span
          className={`absolute left-0 top-[7px] block h-0.5 w-5 rounded-full bg-white transition ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`absolute left-0 top-[14px] block h-0.5 w-5 rounded-full bg-white transition ${
            isOpen ? "-translate-y-[7px] -rotate-45" : ""
          }`}
        />
      </span>
    </button>
  );
}

function MenuPanel({ onClose }) {
  const navigation = getSafeNavigationItems();

  return (
    <div className="relative z-10 overflow-hidden border-t border-white/10">
      <div className="mx-auto w-full max-w-7xl px-5 pb-5 pt-3 sm:px-6 lg:px-8">
        <nav
          aria-label="Menu News"
          className="grid gap-2 rounded-[30px] border border-white/10 bg-white/[0.045] p-4 shadow-2xl shadow-black/30"
        >
          {navigation.map((item) => (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              onClick={onClose}
              className="flex min-h-12 items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm font-black text-slate-200 shadow-lg shadow-black/10 transition hover:border-emerald-400/25 hover:bg-emerald-400/10 hover:text-white"
            >
              <span>{item.label}</span>
              <span className="text-emerald-300">→</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default function NewsHeader() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [keyword, setKeyword] = useState("");

  function closeMenu() {
    setIsOpen(false);
  }

  function openSearchMode() {
    setIsOpen(false);
    setIsSearchMode(true);
  }

  function closeSearchMode() {
    setKeyword("");
    setIsSearchMode(false);
  }

  function handleSearchSubmit(event) {
    event.preventDefault();

    const cleanKeyword = keyword.trim();

    if (!cleanKeyword) {
      router.push("/news/search");
      setIsSearchMode(false);
      return;
    }

    router.push(`/news/search?q=${encodeURIComponent(cleanKeyword)}`);
    setIsSearchMode(false);
  }

  return (
    <header className="relative z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(16,185,129,0.14),transparent_34%),radial-gradient(circle_at_85%_10%,rgba(6,182,212,0.1),transparent_30%)]" />

      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/35 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-3 sm:px-6 lg:px-8">
        {isSearchMode ? (
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-[18px] border border-cyan-400/20 bg-slate-950/65 px-4 shadow-xl shadow-cyan-400/5">
              <span className="shrink-0 text-cyan-300">
                <SearchIcon />
              </span>

              <input
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                autoFocus
                placeholder="Cari berita Nexarin..."
                className="min-h-11 min-w-0 flex-1 bg-transparent text-sm font-bold text-white outline-none placeholder:text-slate-600"
              />
            </div>

            <button
              type="button"
              aria-label="Tutup pencarian"
              onClick={closeSearchMode}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[17px] border border-white/10 bg-white/[0.06] text-slate-200 shadow-lg shadow-black/20 transition hover:border-red-400/25 hover:bg-red-400/10 hover:text-red-200"
            >
              <CloseIcon />
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/news"
              aria-label="Nexarin News"
              onClick={closeMenu}
              className="group min-w-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-emerald-400/25 bg-slate-950/70 p-1.5 shadow-lg shadow-emerald-400/10">
                  <img
                    src="/images/logo/nexarin-logo.png"
                    alt=""
                    className="h-full w-full object-contain"
                    loading="eager"
                    decoding="async"
                  />
                </span>

                <div className="min-w-0">
                  <p className="truncate text-[1.05rem] font-black leading-tight tracking-[-0.045em]">
                    <span className="bg-gradient-to-r from-white via-emerald-100 to-cyan-200 bg-clip-text text-transparent">
                      Nexarin
                    </span>
                    <span className="text-emerald-300">-news</span>
                  </p>

                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/40" />
                    <p className="truncate text-[11px] font-bold leading-none text-slate-500">
                      by-rins
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <div className="flex shrink-0 items-center gap-2">
              <SearchButton onClick={openSearchMode} />

              <MenuButton
                isOpen={isOpen}
                onClick={() => setIsOpen((value) => !value)}
              />
            </div>
          </div>
        )}
      </div>

      <div
        className={`grid transition-all duration-300 ease-out ${
          isOpen && !isSearchMode
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          {isOpen && !isSearchMode && <MenuPanel onClose={closeMenu} />}
        </div>
      </div>
    </header>
  );
}