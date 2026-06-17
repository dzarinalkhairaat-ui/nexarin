import PpobPulsaOperatorCard from "@/features/products/components/ppob-pulsa-page/PpobPulsaOperatorCard";
import { ppobPulsaOperators } from "@/features/products/components/ppob-pulsa-page/ppobPulsa.data";

function getSafeArray(value) {
  return Array.isArray(value) ? value : [];
}

export default function PpobPulsaOperatorGrid() {
  const operators = getSafeArray(ppobPulsaOperators);

  return (
    <section className="px-5 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-7 w-1 rounded-full bg-emerald-400" />

          <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-300">
            Pilih Operator
          </h2>
        </div>

        {operators.length > 0 ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {operators.map((operator) => (
              <PpobPulsaOperatorCard
                key={operator?.slug || operator?.label}
                operator={operator}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[26px] border border-white/10 bg-white/[0.045] p-6 text-center text-sm font-semibold text-slate-400">
            Operator pulsa belum tersedia.
          </div>
        )}
      </div>
    </section>
  );
}