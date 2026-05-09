import PpobPulsaNominalCard from "@/features/products/components/ppob-pulsa-operator-page/PpobPulsaNominalCard";
import { ppobPulsaNominals } from "@/features/products/components/ppob-pulsa-operator-page/ppobPulsaOperator.data";

function getSafeArray(value) {
  return Array.isArray(value) ? value : [];
}

export default function PpobPulsaNominalGrid() {
  const nominals = getSafeArray(ppobPulsaNominals);

  return (
    <section className="px-5 pb-10 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-7 w-1 rounded-full bg-emerald-400" />

          <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-300">
            Pilih Nominal
          </h2>
        </div>

        {nominals.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {nominals.map((item) => (
              <PpobPulsaNominalCard key={item?.label} item={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-[26px] border border-white/10 bg-white/[0.045] p-6 text-center text-sm font-semibold text-slate-400">
            Nominal pulsa belum tersedia.
          </div>
        )}
      </div>
    </section>
  );
}