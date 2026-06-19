"use client";

export default function ProductDetailInfo({ product }) {
  if (!product) {
    return null;
  }

  // Use actual product features or fallback if none exist
  const features = Array.isArray(product.features) && product.features.length > 0
    ? product.features
    : [
        "Desain modern dan responsif untuk semua perangkat.",
        "Komponen UI premium yang mudah disesuaikan.",
        "Asset siap pakai tanpa perlu desain ulang.",
        "Akses instan setelah pembelian berhasil.",
      ];

  return (
    <section className="relative px-5 py-6 text-white sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <div className="overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.025] shadow-xl shadow-black/20 backdrop-blur-sm">
          {/* Header Area */}
          <div className="border-b border-white/10 bg-white/[0.015] px-6 py-6 sm:px-8 sm:py-8">
            <h2 className="text-2xl font-black tracking-[-0.05em] text-white">
              Highlight Produk
            </h2>
            <p className="mt-2 text-sm font-medium leading-relaxed text-slate-400">
              Berikut adalah beberapa fitur dan keunggulan utama dari {product?.title || "produk ini"}.
              Cocok digunakan untuk {product?.bestFor?.toLowerCase() || "berbagai kebutuhan digital"}.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group flex items-start gap-4 rounded-[24px] border border-white/5 bg-slate-950/40 p-5 transition hover:border-emerald-400/20 hover:bg-emerald-400/5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-emerald-400/20 bg-emerald-400/10 shadow-inner shadow-emerald-400/20 transition group-hover:scale-110 group-hover:bg-emerald-400/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-emerald-300"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                <p className="pt-2 text-sm font-semibold leading-relaxed text-slate-300 transition group-hover:text-emerald-50">
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}