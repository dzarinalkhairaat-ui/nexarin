export default function ProductsHero() {
  return (
    <section className="px-5 pt-4 sm:px-6 sm:pt-5 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="relative aspect-video overflow-hidden rounded-[24px] border border-white/10 shadow-2xl shadow-black/30 sm:rounded-[30px]">
          <img
            src="/images/banner-slendro 1.png"
            alt="Banner Slendro"
            className="h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}