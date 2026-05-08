export default function Logo({
  label = "Nexarin",
  sublabel = "by-rins",
  logoSrc = "/images/logo/nexarin-logo.png",
  compact = false,
}) {
  return (
    <div className="inline-flex min-w-0 items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-emerald-400/25 bg-slate-950 shadow-lg shadow-emerald-400/10">
        <img
          src={logoSrc}
          alt={`${label} logo`}
          className="h-full w-full object-cover"
          loading="eager"
          decoding="async"
        />
      </div>

      {!compact && (
        <div className="min-w-0 leading-tight">
          <p className="truncate text-base font-black tracking-[-0.03em] text-white">
            {label}
          </p>
          <p className="mt-0.5 truncate text-xs font-semibold text-slate-400">
            {sublabel}
          </p>
        </div>
      )}
    </div>
  );
}