import PpobServiceCard from "@/features/products/components/ppob-page/PpobServiceCard";

export default function PpobServiceSection({ section }) {
  const safeSection = section || {};
  const items = Array.isArray(safeSection.items) ? safeSection.items : [];

  return (
    <section className="px-5 pt-7 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-4 flex items-center gap-3">
          <span
            className={`h-7 w-1 rounded-full ${
              safeSection.accentClass || "bg-emerald-400"
            }`}
          />

          <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-200">
            {safeSection.title}
          </h2>
        </div>

        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8">
          {items.map((item) => (
            <PpobServiceCard
              key={`${safeSection.title}-${item.label}`}
              item={item}
            />
          ))}
        </div>
      </div>
    </section>
  );
}