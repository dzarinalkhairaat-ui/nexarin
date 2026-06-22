"use client";

import Link from "next/link";
import Header from "@/components/shared/Header";
import { useCart } from "@/lib/cart/CartContext";

const CART_ICON_URL =
  "https://api.iconify.design/solar:bag-4-bold.svg?color=%23a7f3d0";

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function parsePrice(value) {
  if (!value || typeof value !== "string") return 0;
  return Number(value.replace(/[^\d]/g, "") || 0);
}

function EmptyCart() {
  return (
    <div className="mx-auto max-w-lg rounded-[34px] border border-white/10 bg-white/[0.045] p-8 text-center shadow-2xl shadow-black/25 sm:p-12">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] border border-emerald-400/20 bg-emerald-400/10 text-4xl shadow-lg shadow-emerald-400/10">
        🛒
      </div>

      <h2 className="mt-6 text-2xl font-black tracking-[-0.04em] text-white">
        Troli Kosong
      </h2>

      <p className="mt-3 text-sm font-medium leading-7 text-slate-400">
        Belum ada produk di troli Anda. Jelajahi katalog produk digital Nexarin
        dan temukan yang sesuai kebutuhan Anda.
      </p>

      <Link
        href="/products"
        className="mt-8 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:bg-emerald-300"
      >
        <span>Jelajahi Produk</span>
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
      </Link>
    </div>
  );
}

function CartItem({ item, onUpdateQuantity, onRemove }) {
  const pricePerItem = parsePrice(item.price);
  const subtotal = pricePerItem * item.quantity;

  return (
    <div className="group relative flex gap-4 rounded-[28px] border border-white/10 bg-white/[0.045] p-4 shadow-xl shadow-black/15 transition hover:border-emerald-400/15 sm:p-5">
      {/* Icon / Image */}
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] border border-emerald-400/20 bg-emerald-400/10 text-2xl shadow-lg shadow-emerald-400/10 sm:h-20 sm:w-20 sm:text-3xl">
        {(() => {
          const icon = item.icon || "✦";
          if (typeof icon === "string" && icon.startsWith("http")) {
            return <img src={icon} alt="" aria-hidden="true" className="h-6 w-6 object-contain opacity-90 drop-shadow-[0_0_10px_rgba(52,211,153,0.25)] sm:h-7 sm:w-7" loading="lazy" decoding="async" />;
          }
          return icon;
        })()}
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {item.category && (
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                {item.category}
              </p>
            )}
            <h3 className="mt-1 text-sm font-black leading-tight tracking-[-0.03em] text-white sm:text-base">
              {item.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => onRemove(item.slug)}
            aria-label={`Hapus ${item.title} dari troli`}
            className="shrink-0 rounded-xl p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          {/* Quantity Controls */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.slug, item.quantity - 1)}
              aria-label="Kurangi jumlah"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-950/60 text-sm font-black text-white transition hover:border-emerald-400/30 hover:bg-emerald-400/10"
            >
              −
            </button>

            <span className="flex h-9 w-10 items-center justify-center text-sm font-black text-emerald-300">
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={() => onUpdateQuantity(item.slug, item.quantity + 1)}
              aria-label="Tambah jumlah"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-950/60 text-sm font-black text-white transition hover:border-emerald-400/30 hover:bg-emerald-400/10"
            >
              +
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            {item.oldPrice && (
              <p className="text-[10px] font-bold text-slate-500 line-through">
                {item.oldPrice}
              </p>
            )}
            <p className="text-base font-black tracking-[-0.03em] text-emerald-300 sm:text-lg">
              {formatCurrency(subtotal)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartSummary({ total, itemCount, onClearCart }) {
  function handleCheckout() {
    const text = [
      "Halo Nexarin, saya ingin checkout produk dari troli.",
      "",
      `Jumlah item: ${itemCount}`,
      `Total: ${formatCurrency(total)}`,
      "",
      "Mohon bantu proses pembelian saya. Terima kasih!",
    ].join("\n");

    const encodedText = encodeURIComponent(text);
    window.location.href = `https://wa.me/6281234567890?text=${encodedText}`;
  }

  return (
    <div className="rounded-[34px] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/25 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="h-7 w-1 rounded-full bg-emerald-400" />
        <h2 className="text-xl font-black tracking-[-0.045em] text-white sm:text-2xl">
          Ringkasan
        </h2>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-400">Jumlah Produk</span>
          <span className="font-black text-white">{itemCount} item</span>
        </div>

        <div className="h-px bg-white/10" />

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-400">Total</span>
          <span className="text-2xl font-black tracking-[-0.04em] text-emerald-300">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleCheckout}
        className="group mt-7 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:bg-emerald-300"
      >
        <span>Checkout via WhatsApp</span>
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
      </button>

      <button
        type="button"
        onClick={onClearCart}
        className="mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-black text-slate-400 transition hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
      >
        Kosongkan Troli
      </button>

      <Link
        href="/products"
        className="mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-black text-slate-400 transition hover:border-emerald-400/20 hover:bg-emerald-400/10 hover:text-emerald-300"
      >
        ← Lanjut Belanja
      </Link>
    </div>
  );
}

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, getCartCount, getCartTotal } = useCart();

  const count = getCartCount();
  const total = getCartTotal();

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <Header />

      <section className="relative px-5 py-10 sm:px-6 sm:py-16 lg:px-8">
        {/* Background effects */}
        <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          {/* Header */}
          <div className="mb-10 text-center lg:mb-14">
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-300">
              <img
                src={CART_ICON_URL}
                alt=""
                aria-hidden="true"
                className="h-4 w-4 object-contain"
              />
              <span>Troli Anda</span>
            </p>

            <h1 className="mt-5 text-4xl font-black leading-tight tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
              Keranjang Belanja
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-400 sm:text-base">
              {count > 0
                ? `${count} produk di troli Anda. Review dan lanjutkan ke checkout.`
                : "Troli Anda masih kosong."}
            </p>
          </div>

          {/* Content */}
          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1fr_minmax(320px,0.45fr)] lg:items-start">
              {/* Cart Items */}
              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <CartItem
                    key={item.slug}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>

              {/* Summary */}
              <CartSummary
                total={total}
                itemCount={count}
                onClearCart={clearCart}
              />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
