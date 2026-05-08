export default function NewsCategoryHero({ category }) {
  const categoryLabel = category?.label || "News";

  return (
    <section className="relative px-5 pb-6 pt-7 text-white sm:px-6 sm:pb-8 sm:pt-10 lg:px-8">
      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        <p className="inline-flex rounded-full border border-lime-400/20 bg-lime-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-lime-300 shadow-lg shadow-lime-400/5">
          Kategori
        </p>

        <h1 className="mx-auto mt-5 max-w-3xl text-[2.35rem] font-black leading-[0.96] tracking-[-0.065em] text-white sm:text-6xl">
          {categoryLabel} Nexarin.
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-sm font-medium leading-7 text-slate-300 sm:text-base sm:leading-8">
          Kumpulan artikel pilihan kategori {categoryLabel} dari portal
          informasi Nexarin by-rins.
        </p>
      </div>
    </section>
  );
}