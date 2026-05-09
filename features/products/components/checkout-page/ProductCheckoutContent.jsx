"use client";

import Link from "next/link";
import { useState } from "react";

const checkoutSteps = [
  {
    label: "Pilih Produk",
    description: "Produk dipilih dari katalog Nexarin.",
  },
  {
    label: "Konfirmasi",
    description: "Order dikonfirmasi manual dulu lewat Contact.",
  },
  {
    label: "Aktivasi",
    description: "Produk/delivery diproses setelah pembayaran valid.",
  },
];

const trustItems = [
  {
    value: "Manual",
    label: "Checkout aman sementara",
  },
  {
    value: "Mobile",
    label: "Tampilan HP-first",
  },
  {
    value: "Soon",
    label: "Payment otomatis nanti",
  },
];

function ProductImageMini({ product }) {
  const safeProduct = product || {};
  const imageUrl = safeProduct.image || safeProduct.imageUrl || "";
  const [isError, setIsError] = useState(false);
  const canShowImage = Boolean(imageUrl && !isError);

  return (
    <div className="relative aspect-square w-[92px] shrink-0 overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/80 shadow-xl shadow-black/20 sm:w-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(52,211,153,0.18),transparent_34%),radial-gradient(circle_at_78%_70%,rgba(6,182,212,0.12),transparent_36%)]" />

      {canShowImage ? (
        <img
          src={imageUrl}
          alt={safeProduct.title || "Produk Nexarin"}
          className="relative z-10 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          onError={() => setIsError(true)}
        />
      ) : (
        <div className="relative z-10 flex h-full w-full items-center justify-center p-4">
          <img
            src="/images/logo/nexarin-logo.png"
            alt=""
            aria-hidden="true"
            className="h-10 w-10 object-contain opacity-85 drop-shadow-[0_0_18px_rgba(52,211,153,0.24)]"
            loading="lazy"
            decoding="async"
          />
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />
    </div>
  );
}

function CheckoutProductCard({ product }) {
  const safeProduct = product || {};

  return (
    <article className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.05] p-3 shadow-2xl shadow-black/25 backdrop-blur-xl">
      <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative z-10 flex items-center gap-3">
        <ProductImageMini product={safeProduct} />

        <div className="min-w-0 flex-1">
          <h2 className="line-clamp-2 text-[17px] font-black leading-[1.05] tracking-[-0.045em] text-white sm:text-xl">
            {safeProduct.title || "Produk Nexarin"}
          </h2>

          <p className="mt-2 line-clamp-2 text-xs font-medium leading-5 text-slate-400 sm:text-sm sm:leading-6">
            {safeProduct.description ||
              "Deskripsi produk akan ditambahkan saat produk sudah siap."}
          </p>

          <div className="mt-2">
            <p className="text-xs font-bold text-slate-500 line-through">
              {safeProduct.oldPrice || "Rp 0"}
            </p>

            <p className="mt-0.5 text-2xl font-black tracking-[-0.045em] text-emerald-300">
              {safeProduct.price || "Rp 0"}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

function CheckoutSummary({ product }) {
  const safeProduct = product || {};

  const summaryRows = [
    {
      label: "Produk",
      value: safeProduct.title || "-",
    },
    {
      label: "Kategori",
      value: safeProduct.category || "-",
    },
    {
      label: "Harga Normal",
      value: safeProduct.oldPrice || "Rp 0",
      muted: true,
    },
  ];

  return (
    <section className="rounded-[32px] border border-white/10 bg-white/[0.05] p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-black text-white">Ringkasan Order</p>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            Cek detail sebelum lanjut beli.
          </p>
        </div>

        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-emerald-300">
          Ready
        </span>
      </div>

      <div className="mt-5 grid gap-3 text-sm font-semibold text-slate-400">
        {summaryRows.map((row) => (
          <div key={row.label} className="flex items-start justify-between gap-4">
            <span className="shrink-0">{row.label}</span>
            <span
              className={`max-w-[58%] text-right ${
                row.muted ? "text-slate-500 line-through" : "text-white"
              }`}
            >
              {row.value}
            </span>
          </div>
        ))}

        <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4">
          <span>Total</span>
          <span className="text-right text-xl font-black tracking-[-0.04em] text-emerald-300">
            {safeProduct.price || "Rp 0"}
          </span>
        </div>
      </div>
    </section>
  );
}

function CheckoutTimeline() {
  return (
    <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
      <p className="text-sm font-black text-white">Alur Checkout</p>

      <div className="mt-5 grid gap-3">
        {checkoutSteps.map((step, index) => (
          <div key={step.label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-xs font-black text-emerald-300">
                {index + 1}
              </span>

              {index < checkoutSteps.length - 1 ? (
                <span className="mt-2 h-7 w-px bg-white/10" />
              ) : null}
            </div>

            <div className="min-w-0 pb-2">
              <p className="text-sm font-black text-white">{step.label}</p>
              <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CheckoutFormPreview({ product }) {
  const safeProduct = product || {};

  return (
    <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black text-white">Data Checkout</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
            Preview form. Input otomatis nanti saat backend/payment siap.
          </p>
        </div>

        <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] font-black text-slate-300">
          Beta
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
            Nama
          </span>
          <input
            readOnly
            value="Isi lewat Contact"
            className="min-h-12 rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-sm font-semibold text-slate-300 outline-none"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
            Kontak
          </span>
          <input
            readOnly
            value="WhatsApp / Email"
            className="min-h-12 rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-sm font-semibold text-slate-300 outline-none"
          />
        </label>

        <label className="grid gap-2 sm:col-span-2">
          <span className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
            Produk Dipilih
          </span>
          <input
            readOnly
            value={safeProduct.title || "Produk Nexarin"}
            className="min-h-12 rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-sm font-semibold text-white outline-none"
          />
        </label>
      </div>
    </section>
  );
}

function CheckoutActions({ product }) {
  const safeProduct = product || {};
  const productTitle = safeProduct.title || "Produk Nexarin";
  const contactHref = `/contact?produk=${encodeURIComponent(productTitle)}`;

  return (
    <div className="grid gap-3">
      <Link
        href={contactHref}
        className="inline-flex min-h-14 items-center justify-center gap-2 rounded-[22px] bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:bg-emerald-300"
      >
        <span>Lanjut Beli Manual</span>
        <span aria-hidden="true">→</span>
      </Link>

      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/products/semua"
          className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-xs font-black text-emerald-200 transition hover:bg-emerald-400 hover:text-slate-950"
        >
          Produk Lain
        </Link>

        <Link
          href={`/products/${safeProduct.slug || "preview"}`}
          className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-xs font-black text-white transition hover:border-emerald-400/25 hover:bg-emerald-400/10"
        >
          Detail Lagi
        </Link>
      </div>
    </div>
  );
}

function TrustStrip() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {trustItems.map((item) => (
        <div
          key={item.label}
          className="rounded-[22px] border border-white/10 bg-white/[0.035] p-3 text-center shadow-lg shadow-black/10"
        >
          <p className="text-sm font-black text-emerald-300">{item.value}</p>
          <p className="mt-1 text-[10px] font-semibold leading-4 text-slate-500">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function ProductCheckoutContent({ product }) {
  return (
    <section className="relative overflow-hidden px-5 py-5 text-white sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="pointer-events-none absolute -left-24 top-16 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-20 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

      <img
        src="/images/logo/nexarin-logo.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-32 h-80 w-80 rotate-12 object-contain opacity-[0.035]"
        loading="lazy"
        decoding="async"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-4 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] lg:items-start">
        <div className="grid gap-4">
          <CheckoutProductCard product={product} />
          <CheckoutFormPreview product={product} />
        </div>

        <aside className="grid gap-4 lg:sticky lg:top-24">
          <CheckoutSummary product={product} />
          <CheckoutActions product={product} />
          <TrustStrip />
          <CheckoutTimeline />

          <div className="rounded-[24px] border border-white/10 bg-white/[0.035] p-4">
            <p className="text-xs font-semibold leading-6 text-slate-500">
              Catatan: checkout masih manual agar frontend tetap ringan dan
              stabil. Integrasi database, Digiflazz, dan payment gateway nanti
              dikerjakan setelah UI foundation selesai.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}