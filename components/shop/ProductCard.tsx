"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { formatCurrency } from "@/lib/utils";
import { Star, Check, Sparkles } from "lucide-react";
import { TrialModal } from "./TrialModal";
import { CheckoutModal } from "./CheckoutModal";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [trialOpen, setTrialOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { isCustomerAuthenticated } = useAuth();
  const { showToast } = useNotification();
  const router = useRouter();

  const handleBuyClick = () => {
    if (!isCustomerAuthenticated) {
      showToast({
        type: "info",
        title: "Login Diperlukan",
        message: "Silakan masuk ke akun Customer Anda terlebih dahulu untuk membeli produk ini."
      });
      router.push(`/login?redirect=${encodeURIComponent(`/shop/${product.slug}`)}&action=buy`);
      return;
    }
    setCheckoutOpen(true);
  };

  const handleTrialClick = () => {
    if (!isCustomerAuthenticated) {
      showToast({
        type: "info",
        title: "Login Diperlukan",
        message: "Silakan masuk ke akun Customer Anda untuk mengaktifkan Demo Gratis 3 Hari."
      });
      router.push(`/login?redirect=${encodeURIComponent(`/shop/${product.slug}`)}&action=trial`);
      return;
    }
    setTrialOpen(true);
  };

  return (
    <>
      <Card hoverable className="group flex flex-col h-full overflow-hidden">
        <div className="relative h-48 w-full overflow-hidden bg-slate-900">
          <img
            src={product.featuredImage || "/assets/default-cover.svg"}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.src = "/assets/default-cover.svg";
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-950/90 backdrop-blur-md text-white text-[10px] font-mono font-semibold border border-white/[0.12]">
              {product.currentVersion}
            </span>
            {product.trialEnabled && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#7CF2C3]/90 text-slate-950 text-[10px] font-bold shadow-md shadow-emerald-500/20">
                Trial 3 Hari
              </span>
            )}
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-[#64748B] mb-1.5">
              <span className="font-mono uppercase text-[10px] tracking-wider text-[#2DD4F5] font-bold">
                {product.category.replace("-", " ")}
              </span>
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="font-semibold text-[#94A3B8]">{product.rating}</span>
                <span className="text-[10px] text-slate-500">({product.salesCount} terjual)</span>
              </div>
            </div>

            <Link href={`/shop/${product.slug}`}>
              <h3 className="text-base font-bold text-white group-hover:text-[#2DD4F5] transition-colors leading-snug line-clamp-1 mb-1.5">
                {product.name}
              </h3>
            </Link>

            <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed mb-3">
              {product.shortDescription}
            </p>

            <div className="space-y-1.5 py-2.5 border-y border-white/[0.08]">
              {product.features.slice(0, 2).map((feat, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[11px] text-[#94A3B8]">
                  <Check className="w-3.5 h-3.5 text-[#7CF2C3] shrink-0" />
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-1">
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-xs font-mono text-[#64748B]">Lisensi Lifetime</span>
              <div className="text-right">
                <span className="text-lg font-black text-white">
                  {formatCurrency(product.price)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {product.trialEnabled ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTrialClick}
                  className="w-full text-xs font-semibold border-white/[0.12] text-slate-300 hover:text-white"
                >
                  Coba Gratis
                </Button>
              ) : (
                <Link href={`/shop/${product.slug}`} className="w-full">
                  <Button variant="outline" size="sm" className="w-full text-xs font-semibold border-white/[0.12]">
                    Detail
                  </Button>
                </Link>
              )}

              <Button
                variant="primary"
                size="sm"
                onClick={handleBuyClick}
                className="w-full text-xs font-extrabold shadow-md shadow-cyan-500/20"
              >
                Beli Lisensi
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Modals */}
      {trialOpen && (
        <TrialModal
          isOpen={trialOpen}
          onClose={() => setTrialOpen(false)}
          product={product}
        />
      )}
      {checkoutOpen && (
        <CheckoutModal
          isOpen={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          product={product}
        />
      )}
    </>
  );
}
