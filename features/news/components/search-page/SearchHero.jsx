export default function SearchHero({ keyword }) {
  return (
    <section className="relative px-5 pb-7 pt-7 text-white sm:px-6 sm:pb-10 sm:pt-10 lg:px-8">
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-cyan-300 shadow-lg shadow-cyan-400/5">
            Search
          </p>

          <h1 className="mx-auto mt-5 max-w-3xl text-[2.4rem] font-black leading-[0.95] tracking-[-0.065em] text-white sm:text-6xl">
            Cari berita Nexarin.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm font-medium leading-7 text-slate-300 sm:text-base sm:leading-8">
            {keyword
              ? `Menampilkan hasil pencarian untuk “${keyword}”.`
              : "Temukan artikel, update, dan informasi terbaru dari News Nexarin."}
          </p>
        </div>
      </div>
    </section>
  );
}