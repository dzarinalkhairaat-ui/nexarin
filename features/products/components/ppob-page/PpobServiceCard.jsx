import Link from "next/link";

export default function PpobServiceCard({ item }) {
  const safeItem = item || {};
  const hasImage = Boolean(safeItem.image);

  return (
    <Link
      href={safeItem.href || "/products/kategori/ppob"}
      className="group flex min-w-0 flex-col items-center gap-2 text-center transition hover:-translate-y-0.5"
    >
      <span
        className={`flex h-14 w-14 items-center justify-center overflow-hidden rounded-[18px] shadow-lg shadow-black/20 transition ${
          hasImage
            ? "bg-white"
            : `border border-white/10 bg-gradient-to-br ${
                safeItem.tone || "from-emerald-400/20 to-slate-950"
              } text-lg font-black text-emerald-200 group-hover:border-emerald-400/25`
        }`}
      >
        {hasImage ? (
          <img
            src={safeItem.image}
            alt={safeItem.label || "PPOB"}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          safeItem.icon
        )}
      </span>

      <span className="line-clamp-2 min-h-[1.9rem] text-[12px] font-black leading-tight tracking-[-0.02em] text-slate-300 transition group-hover:text-white">
        {safeItem.label}
      </span>
    </Link>
  );
}