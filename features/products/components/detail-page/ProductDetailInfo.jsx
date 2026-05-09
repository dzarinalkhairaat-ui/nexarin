"use client";

export default function ProductDetailInfo({ product }) {
  if (!product) {
    return null;
  }

  const points = [
    "Fondasi produk masih memakai data statis sementara.",
    "Nanti bisa dihubungkan ke database dan admin dashboard.",
    "Checkout masih manual/fondasi awal sebelum payment gateway.",
    "Gambar produk bisa diganti dari backend saat sistem sudah siap.",
  ];

  return (
    <section className="px-5 py-7 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-black/20">
          <h2 className="text-2xl font-black tracking-[-0.05em] text-white">
            Informasi Produk
          </h2>

          <p className="mt-3 text-sm font-medium leading-7 text-slate-400">
            {product?.title || "Produk"} adalah bagian dari katalog digital
            Nexarin yang disiapkan bertahap untuk ekosistem by-rins.
          </p>

          <div className="mt-5 grid gap-3">
            {points.map((point, index) => (
              <div
                key={point}
                className="flex gap-3 rounded-2xl border border-white/10 bg-slate-950/45 p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-xs font-black text-emerald-300">
                  {index + 1}
                </span>

                <p className="text-sm font-medium leading-6 text-slate-300">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}