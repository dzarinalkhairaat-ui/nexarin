import Link from "next/link";
import { SmartphoneIcon, WifiIcon, LightningIcon, MoreDotsIcon } from "@/components/shared/MenuIcons";

const iconMap = {
  pulsa: SmartphoneIcon,
  data: WifiIcon,
  pln: LightningIcon,
  lainnya: MoreDotsIcon,
};

export default function PpobServiceCard({ item }) {
  const safeItem = item || {};
  const hasImage = Boolean(safeItem.image);
  
  const IconComponent = typeof safeItem.icon === 'string' && iconMap[safeItem.icon] ? iconMap[safeItem.icon] : null;

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
          (() => {
            if (IconComponent) {
              return <IconComponent className="h-6 w-6 opacity-90 drop-shadow-md" />;
            }
            const icon = safeItem.icon;
            if (typeof icon === "string" && icon.startsWith("http")) {
              return <img src={icon} alt="" aria-hidden="true" className="h-7 w-7 object-contain opacity-90 drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]" loading="lazy" decoding="async" />;
            }
            return icon;
          })()
        )}
      </span>

      <span className="line-clamp-2 min-h-[1.9rem] text-[12px] font-black leading-tight tracking-[-0.02em] text-slate-300 transition group-hover:text-white">
        {safeItem.label}
      </span>
    </Link>
  );
}