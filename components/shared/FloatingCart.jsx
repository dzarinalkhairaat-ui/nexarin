"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";

const CART_ICON_URL =
  "https://api.iconify.design/solar:bag-4-bold.svg?color=%23020617";

export default function FloatingCart() {
  const { getCartCount } = useCart();
  const count = getCartCount();

  if (count === 0) return null;

  return (
    <Link
      href="/products/cart"
      aria-label={`Lihat troli (${count} produk)`}
      className="fixed bottom-6 right-6 z-[9999] flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400 shadow-2xl shadow-emerald-400/30 transition-all duration-300 hover:scale-110 hover:bg-emerald-300 hover:shadow-emerald-400/40 animate-[floatIn_0.4s_ease-out]"
      style={{
        animation: "floatIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      <img
        src={CART_ICON_URL}
        alt=""
        aria-hidden="true"
        className="h-7 w-7 object-contain"
        loading="lazy"
        decoding="async"
      />

      <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-[11px] font-black text-white shadow-lg shadow-red-500/30 ring-2 ring-slate-950">
        {count > 99 ? "99+" : count}
      </span>
    </Link>
  );
}
