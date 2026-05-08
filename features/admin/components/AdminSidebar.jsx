"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const adminMenus = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: "⌂",
    status: "Main",
  },
  {
    label: "Home",
    href: "",
    icon: "H",
    status: "Soon",
    disabled: true,
  },
  {
    label: "News",
    href: "/admin/news",
    icon: "N",
    status: "Prioritas",
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: "P",
    status: "Next",
  },
  {
    label: "Portfolio",
    href: "/admin/portfolio",
    icon: "F",
    status: "Next",
  },
  {
    label: "Support",
    href: "/admin/support",
    icon: "S",
    status: "Ready",
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: "⚙",
    status: "Config",
  },
];

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none">
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none">
      <path
        d="M10 7V5.8c0-1 .8-1.8 1.8-1.8h5.4c1 0 1.8.8 1.8 1.8v12.4c0 1-.8 1.8-1.8 1.8h-5.4c-1 0-1.8-.8-1.8-1.8V17"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        d="M14 12H4m0 0 3.5-3.5M4 12l3.5 3.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function getMenuClassName({ isActive, disabled }) {
  if (disabled) {
    return "group flex min-h-12 cursor-not-allowed items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] px-3 py-2 text-slate-500 opacity-70";
  }

  return [
    "group flex min-h-12 items-center gap-3 rounded-2xl border px-3 py-2 transition",
    isActive
      ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
      : "border-white/10 bg-slate-950/55 text-slate-200 hover:border-emerald-400/25 hover:bg-emerald-400/10 hover:text-emerald-200",
  ].join(" ");
}

function MenuContent({ isDropdown, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);

    await supabase.auth.signOut();

    document.cookie =
      "nexarin_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";

    setIsLoggingOut(false);

    if (typeof onClose === "function") {
      onClose();
    }

    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="relative z-10">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-emerald-400/25 bg-slate-950 p-2 shadow-lg shadow-emerald-400/10">
          <img
            src="/images/logo/nexarin-logo.png"
            alt="Nexarin logo"
            className="h-full w-full object-contain"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-black tracking-[-0.035em] text-white">
            Admin Menu
          </p>

          <p className="mt-1 truncate text-xs font-semibold text-slate-500">
            Nexarin dashboard
          </p>
        </div>

        {isDropdown ? (
          <button
            type="button"
            aria-label="Tutup menu admin"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] text-slate-300 transition hover:border-emerald-400/25 hover:bg-emerald-400/10 hover:text-emerald-200"
          >
            <CloseIcon />
          </button>
        ) : null}
      </div>

      <div className="mt-5 border-t border-white/10 pt-4">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">
          Navigasi Admin
        </p>

        <div className="mt-3 grid gap-2">
          {adminMenus.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : item.href
                  ? pathname?.startsWith(item.href)
                  : false;

            const content = (
              <>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.055] text-sm font-black">
                  {item.icon}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-black">
                    {item.label}
                  </span>

                  <span className="mt-0.5 block truncate text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 group-hover:text-slate-400">
                    {item.status}
                  </span>
                </span>
              </>
            );

            if (item.disabled) {
              return (
                <div
                  key={`${item.label}-${item.status}`}
                  className={getMenuClassName({ disabled: true })}
                  aria-disabled="true"
                >
                  {content}
                </div>
              );
            }

            return (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                onClick={onClose}
                aria-current={isActive ? "page" : undefined}
                className={getMenuClassName({ isActive })}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-5 rounded-[24px] border border-emerald-400/15 bg-emerald-400/[0.07] p-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
          Fokus
        </p>

        <p className="mt-2 text-sm font-medium leading-6 text-slate-300">
          Prioritas sekarang adalah menyiapkan News Manager untuk CRUD artikel.
        </p>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-400/[0.08] px-4 py-3 text-sm font-black text-red-200 shadow-lg shadow-black/20 transition hover:border-red-300/35 hover:bg-red-400/15 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LogoutIcon />
        <span>{isLoggingOut ? "Keluar..." : "Logout Admin"}</span>
      </button>
    </div>
  );
}

export default function AdminSidebar({
  isOpen = true,
  onClose,
  mode = "inline",
}) {
  const isDropdown = mode === "dropdown";

  if (!isOpen) {
    return null;
  }

  return (
    <aside
      className={[
        "relative overflow-hidden border border-white/10 bg-white/[0.045] p-4 text-white shadow-2xl shadow-black/25 backdrop-blur-xl",
        isDropdown ? "rounded-[30px]" : "rounded-[34px]",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />

      <MenuContent isDropdown={isDropdown} onClose={onClose} />
    </aside>
  );
}