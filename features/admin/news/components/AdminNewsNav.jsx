"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminNewsNavItems = [
  {
    label: "Dashboard",
    href: "/admin/news",
  },
  {
    label: "Artikel",
    href: "/admin/news/artikel",
  },
  {
    label: "Tulis Artikel",
    href: "/admin/news/tulis-artikel",
  },
  {
    label: "Kategori",
    href: "/admin/news/kategori",
  },
  {
    label: "Pengaturan",
    href: "/admin/news/pengaturan",
  },
];

export default function AdminNewsNav() {
  const pathname = usePathname();

  return (
    <nav className="relative z-30 border-b border-white/10 bg-slate-950/92 px-5 py-2 text-white backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(16,185,129,0.08),transparent_34%),radial-gradient(circle_at_88%_12%,rgba(6,182,212,0.06),transparent_30%)]" />
      <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {adminNewsNavItems.map((item) => {
            const isActive =
              item.href === "/admin/news"
                ? pathname === "/admin/news"
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "inline-flex min-h-8 shrink-0 items-center justify-center rounded-full border px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] transition",
                  isActive
                    ? "border-emerald-400/25 bg-emerald-400/15 text-emerald-300 shadow-lg shadow-emerald-400/10"
                    : "border-white/10 bg-white/[0.055] text-slate-300 hover:border-emerald-400/25 hover:bg-emerald-400/10 hover:text-emerald-200",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}