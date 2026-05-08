export default function ArticleHero({ article }) {
  return (
    <section className="relative px-5 pb-4 pt-7 text-white sm:px-6 sm:pb-5 sm:pt-10 lg:px-8">
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="max-w-3xl">
          <h1 className="text-[2.35rem] font-black leading-[0.96] tracking-[-0.065em] text-white sm:text-6xl">
            {article?.title || "Artikel Nexarin News"}
          </h1>

          <p className="mt-5 max-w-2xl text-sm font-medium leading-7 text-slate-300 sm:text-base sm:leading-8">
            {article?.excerpt ||
              "Ringkasan artikel Nexarin News akan tampil di sini."}
          </p>
        </div>
      </div>
    </section>
  );
}