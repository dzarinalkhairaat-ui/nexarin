import Link from "next/link";

const socialSlots = [
  {
    label: "Facebook",
    icon: "/icons/facebook.png",
  },
  {
    label: "Instagram",
    icon: "/icons/instagram.png",
  },
  {
    label: "YouTube",
    icon: "/icons/youtube.png",
  },
  {
    label: "TikTok",
    icon: "/icons/tiktok.png",
  },
];

function SocialIcon({ label, icon }) {
  return (
    <a
      href="/contact"
      aria-label={label}
      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07] p-3 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-emerald-400/25 hover:bg-emerald-400/10"
    >
      <img
        src={icon}
        alt=""
        className="h-full w-full object-contain"
        loading="lazy"
        decoding="async"
      />
    </a>
  );
}

function NexarinMiniLogo() {
  return (
    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-emerald-400/25 bg-slate-950 p-1.5 shadow-xl shadow-emerald-400/10">
      <img
        src="/images/logo/nexarin-logo.png"
        alt="Nexarin logo"
        className="h-full w-full object-contain"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

function SupportIcon() {
  return (
    <span
      aria-hidden="true"
      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.1] p-1.5 shadow-lg shadow-black/20"
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

export default function HomeFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-slate-950 px-5 pb-7 pt-10 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_22%,rgba(16,185,129,0.2),transparent_30%),radial-gradient(circle_at_88%_68%,rgba(6,182,212,0.13),transparent_34%)]" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.075] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:36px_36px]" />

      <img
        src="/images/logo/nexarin-logo.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-16 h-80 w-80 rotate-12 object-contain opacity-[0.05]"
        loading="lazy"
        decoding="async"
      />

      <div className="pointer-events-none absolute left-6 right-6 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />

      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center text-center">
        <div className="inline-flex items-center gap-3 rounded-[26px] border border-white/10 bg-white/[0.07] px-4 py-3 shadow-xl shadow-black/20 backdrop-blur-xl">
          <NexarinMiniLogo />

          <div className="text-left">
            <p className="text-base font-black leading-tight tracking-[-0.03em] text-white">
              Nexarin by-rins
            </p>

            <div className="mt-1 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/40" />
              <p className="text-xs font-semibold text-slate-400">
                Digital ecosystem by-rins
              </p>
            </div>
          </div>
        </div>

        <h2 className="mt-6 text-2xl font-black leading-tight tracking-[-0.055em] text-white sm:text-4xl">
          Stay connected with{" "}
          <span className="text-emerald-300">Nexarin</span>
        </h2>

        <p className="mt-3 max-w-md text-sm font-medium leading-7 text-slate-400 sm:text-base">
          Follow updates, digital products, portfolio project, news, tools, and
          creative ecosystem by-rins.
        </p>

        <div className="mt-5 w-full max-w-sm rounded-[30px] border border-white/10 bg-white/[0.045] p-4 shadow-xl shadow-black/20 backdrop-blur-xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">
            Social Media
          </p>

          <div className="mt-5 flex items-center justify-center gap-3">
            {socialSlots.map((item) => (
              <SocialIcon key={item.label} label={item.label} icon={item.icon} />
            ))}
          </div>
        </div>

        <Link
          href="/support"
          className="mt-6 inline-flex min-h-14 items-center justify-center gap-3 rounded-[30px] border border-emerald-400/20 bg-emerald-400/20 py-2 pl-2 pr-7 text-sm font-black text-white shadow-xl shadow-emerald-400/10 transition hover:-translate-y-0.5 hover:bg-emerald-400 hover:text-slate-950"
        >
          <SupportIcon />
          <span>Support Kami</span>
        </Link>

        <div className="mt-7 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <p className="mt-4 text-xs font-medium leading-6 text-slate-500">
          © 2026 Nexarin by-rins. Built mobile-first.
        </p>
      </div>
    </footer>
  );
}