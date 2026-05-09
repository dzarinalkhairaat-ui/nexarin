export default function PpobPulsaNominalCard({ item }) {
  const safeItem = item || {};

  return (
    <button
      type="button"
      className="group rounded-[24px] border border-white/10 bg-white/[0.045] p-4 text-left shadow-xl shadow-black/15 transition hover:-translate-y-0.5 hover:border-emerald-400/25 hover:bg-white/[0.065]"
    >
      <div className="mb-5 inline-flex rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-300">
        {safeItem.badge || "Pulsa"}
      </div>

      <p className="text-sm font-black leading-tight tracking-[-0.03em] text-white">
        {safeItem.label || "Pulsa"}
      </p>

      <p className="mt-1 text-xs font-semibold text-slate-500">
        Nominal {safeItem.value || "Rp 0"}
      </p>

      <p className="mt-3 text-lg font-black tracking-[-0.045em] text-emerald-300">
        {safeItem.price || "Rp 0"}
      </p>
    </button>
  );
}