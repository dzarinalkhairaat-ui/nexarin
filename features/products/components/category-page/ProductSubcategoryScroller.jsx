"use client";

function getSafeArray(value) {
  return Array.isArray(value) ? value : [];
}

export default function ProductSubcategoryScroller({
  subcategories,
  activeSubcategory,
  onSubcategoryChange,
}) {
  const safeSubcategories = getSafeArray(subcategories);

  return (
    <section className="border-b border-white/10 bg-slate-950 px-5 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {safeSubcategories.map((subcategory) => {
            const isActive = subcategory.value === activeSubcategory;

            return (
              <button
                key={subcategory.value}
                type="button"
                onClick={() => onSubcategoryChange(subcategory.value)}
                className={`min-h-8 shrink-0 rounded-full border px-4 text-xs font-black transition ${
                  isActive
                    ? "border-emerald-400 bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/20"
                    : "border-white/10 bg-white/[0.045] text-slate-300 hover:border-emerald-400/25 hover:bg-emerald-400/10 hover:text-white"
                }`}
              >
                {subcategory.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}