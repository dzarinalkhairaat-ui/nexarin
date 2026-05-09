import Link from "next/link";

const socialLinks = [
  {
    label: "Facebook",
    icon: "/icons/facebook.png",
    href: "/contact",
  },
  {
    label: "Instagram",
    icon: "/icons/instagram.png",
    href: "/contact",
  },
  {
    label: "YouTube",
    icon: "/icons/youtube.png",
    href: "/contact",
  },
  {
    label: "TikTok",
    icon: "/icons/tiktok.png",
    href: "/contact",
  },
];

function SocialIcon({ label, icon, href }) {
  return (
    <Link
      href={href || "/contact"}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07] p-2.5 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-emerald-400/25 hover:bg-emerald-400/10"
    >
      <img
        src={icon}
        alt=""
        className="h-full w-full object-contain"
        loading="lazy"
        decoding="async"
      />
    </Link>
  );
}

function ProductFooterLogo() {
  return (
    <Link
      href="/products"
      className="inline-flex items-center gap-3 rounded-[24px] border border-white/10 bg-white/[0.07] px-4 py-3 shadow-xl shadow-black/20 backdrop-blur-xl transition hover:border-emerald-400/25 hover:bg-emerald-400/10"
      aria-label="Nexarin Products"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-emerald-400/25 bg-slate-950 p-1.5 shadow-xl shadow-emerald-400/10">
        <img
          src="/images/logo/nexarin-logo.png"
          alt="Nexarin logo"
          className="h-full w-full object-contain"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="text-left">
        <p className="text-base font-black leading-tight tracking-[-0.03em] text-white">
          Nexarin Products
        </p>

        <div className="mt-1 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/40" />
          <p className="text-xs font-semibold text-slate-400">
            Digital store by-rins
          </p>
        </div>
      </div>
    </Link>
  );
}

function SupportIcon() {
  return (
    <span
      aria-hidden="true"
      className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.1] p-1.5 shadow-lg shadow-black/20"
    >
      <img
        src="/icons/support.png"
        alt=""
        className="h-full w-full object-contain"
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}

export default function PpobFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-slate-950 px-5 pb-5 pt-7 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(16,185,129,0.15),transparent_32%),radial-gradient(circle_at_85%_72%,rgba(6,182,212,0.1),transparent_34%)]" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:36px_36px]" />

      <img
        src="/images/logo/nexarin-logo.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-8 h-56 w-56 rotate-12 object-contain opacity-[0.03]"
        loading="lazy"
        decoding="async"
      />

      <div className="pointer-events-none absolute left-6 right-6 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-5">
        <div className="flex flex-col items-center text-center">
          <ProductFooterLogo />

          <h2 className="mt-5 max-w-2xl text-2xl font-black leading-tight tracking-[-0.055em] text-white">
            Produk digital by-rins dibuat bertahap, rapi, dan{" "}
            <span className="text-emerald-300">mobile-first.</span>
          </h2>

          <p className="mt-3 max-w-xl text-sm font-medium leading-6 text-slate-400">
            Template, source code, AI tools, PPOB starter, ebook, dan layanan
            custom akan dirapikan pelan-pelan di ekosistem Nexarin.
          </p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.045] p-4 text-center shadow-xl shadow-black/20 backdrop-blur-xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">
            Social Media
          </p>

          <div className="mt-4 flex items-center justify-center gap-3">
            {socialLinks.map((item) => (
              <SocialIcon
                key={item.label}
                label={item.label}
                icon={item.icon}
                href={item.href}
              />
            ))}
          </div>
        </div>

        <Link
          href="/contact"
          className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[28px] border border-emerald-400/20 bg-emerald-400/20 py-2 pl-2 pr-6 text-sm font-black text-white shadow-xl shadow-emerald-400/10 transition hover:bg-emerald-400 hover:text-slate-950"
        >
          <SupportIcon />
          <span>Support / Order Manual</span>
        </Link>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="flex justify-center text-center">
          <p className="text-xs font-medium leading-5 text-slate-500">
            © 2026 Nexarin by-rins
          </p>
        </div>
      </div>
    </footer>
  );
}