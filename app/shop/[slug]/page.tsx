"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { TrialModal } from "@/components/shop/TrialModal";
import { CheckoutModal } from "@/components/shop/CheckoutModal";
import {
  ShieldCheck,
  Star,
  Check,
  Zap,
  ArrowLeft,
  RefreshCw,
  FileCode,
  Layers,
  Terminal,
  Server
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const router = useRouter();
  const { getProductBySlug } = useShop();
  const { isCustomerAuthenticated } = useAuth();
  const { showToast } = useNotification();

  const product = getProductBySlug(slug);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [trialOpen, setTrialOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Check if redirected with action=buy or action=trial
  useEffect(() => {
    const action = searchParams.get("action");
    if (isCustomerAuthenticated && product) {
      if (action === "buy") {
        setCheckoutOpen(true);
      } else if (action === "trial" && product.trialEnabled) {
        setTrialOpen(true);
      }
    }
  }, [searchParams, isCustomerAuthenticated, product]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">Produk Tidak Ditemukan</h1>
        <p className="text-[#64748B]">Produk yang Anda cari tidak tersedia di katalog Nexarin.</p>
        <Link href="/shop">
          <Button variant="primary">Kembali ke Katalog</Button>
        </Link>
      </div>
    );
  }

  const allImages = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages
    : [product.featuredImage];

  const handleBuyClick = () => {
    if (!isCustomerAuthenticated) {
      showToast({
        type: "info",
        title: "Login Diperlukan",
        message: "Silakan masuk ke akun Customer Anda terlebih dahulu untuk membeli lisensi produk ini."
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
        message: "Silakan masuk ke akun Customer Anda terlebih dahulu untuk mengaktifkan Demo Gratis 3 Hari."
      });
      router.push(`/login?redirect=${encodeURIComponent(`/shop/${product.slug}`)}&action=trial`);
      return;
    }
    setTrialOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Back to Shop */}
      <div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Nexarin Digital Shop</span>
        </Link>
      </div>

      {/* Top Product Hero: Gallery + Purchase Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Gallery and Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl overflow-hidden border border-white/[0.08] h-72 sm:h-96 bg-[#0F172A]">
            <img
              src={allImages[activeImageIndex] || product.featuredImage || "/assets/default-cover.svg"}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.src = "/assets/default-cover.svg";
              }}
              className="w-full h-full object-cover transition-all duration-300"
            />
          </div>

          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx ? "border-[#2DD4F5] scale-105 " : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt="Thumbnail"
                    onError={(e) => {
                      e.currentTarget.src = "/assets/default-cover.svg";
                    }}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Description Section */}
          <div className="space-y-4 pt-4 border-t border-white/[0.08]">
            <h3 className="text-xl font-bold text-white">
              Deskripsi Produk Lengkap
            </h3>
            <div className="text-sm text-[#94A3B8] leading-relaxed space-y-4">
              {product.description.split("\n\n").map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Pricing Box & Action Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 sm:p-8 space-y-6 border-cyan-500/30 bg-white/[0.035] sticky top-24">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold uppercase border border-cyan-500/20">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{product.rating}</span>
                  <span className="text-[#64748B]">({product.ratingCount} ulasan)</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {product.name}
              </h1>

              <p className="text-xs sm:text-sm text-[#94A3B8] mt-2 leading-relaxed">
                {product.tagline}
              </p>
            </div>

            {/* Price Row */}
            <div className="p-4 rounded-2xl bg-[#0B1120] border border-white/[0.08] flex items-baseline justify-between">
              <div>
                <span className="text-xs text-[#64748B] block font-medium">Lisensi Lifetime Resmi</span>
                <span className="text-3xl font-extrabold text-white font-mono">
                  {formatCurrency(product.price, product.currency)}
                </span>
              </div>
              {product.originalPrice && (
                <div className="text-right">
                  <span className="text-xs text-slate-500 line-through font-mono block">
                    {formatCurrency(product.originalPrice, product.currency)}
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
                    Hemat {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                variant="primary"
                size="lg"
                onClick={handleBuyClick}
                className="w-full font-extrabold text-slate-950"
              >
                Beli Sekarang (Lisensi Lifetime)
              </Button>

              {product.trialEnabled && (
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleTrialClick}
                  className="w-full font-bold text-xs border-white/[0.10] text-[#94A3B8] hover:text-white"
                >
                  <Zap className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                  Coba Demo Gratis {product.trialDurationDays} Hari
                </Button>
              )}
            </div>

            {/* Guarantee Badges */}
            <div className="space-y-2.5 pt-4 border-t border-white/[0.08] text-xs text-[#94A3B8]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Full Source Code &amp; Hak Lisensi Tanpa Batas Waktu</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pembaruan Gratis Langsung di Customer Dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Dokumentasi dan Video Panduan Instalasi Lengkap</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Features & Specs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/[0.08]">
        {/* Features list */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#2DD4F5]" />
            <h3 className="text-lg font-bold text-white">Fitur Kunci &amp; Kemampuan Sistem</h3>
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {product.features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.035] border border-white/[0.08] text-xs text-[#F8FAFC]">
                <Check className="w-4 h-4 text-[#7CF2C3] shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Specs */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-[#7CF2C3]" />
            <h3 className="text-lg font-bold text-white">Spesifikasi &amp; Kebutuhan Teknis</h3>
          </div>
          <Card className="p-5 space-y-4 bg-white/[0.035] border-white/[0.08]">
            <div>
              <span className="text-[11px] font-mono uppercase text-[#64748B] font-bold block mb-1">
                Platform yang Didukung:
              </span>
              <ul className="text-xs text-[#F8FAFC] space-y-1 list-disc pl-4">
                {product.requirements.platform.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-white/[0.08] grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-[#64748B] block text-[10px]">RUNTIME:</span>
                <span className="font-bold text-white">{product.requirements.runtime}</span>
              </div>
              <div>
                <span className="text-[#64748B] block text-[10px]">DATABASE:</span>
                <span className="font-bold text-white">{product.requirements.database}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Version History & Release Notes */}
      <section className="space-y-6 pt-8 border-t border-white/[0.08]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#2DD4F5]" />
            <h3 className="text-xl font-bold text-white">Riwayat Versi &amp; Changelog</h3>
          </div>
          <span className="text-xs font-mono text-cyan-400 font-semibold">
            Versi Aktif: {product.currentVersion}
          </span>
        </div>

        <div className="space-y-4">
          {product.versions.map((ver) => (
            <Card key={ver.id} className="p-5 space-y-3 bg-white/[0.035] border-white/[0.08]">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Badge variant={ver.isLatest ? "mint" : "slate"} size="sm">
                    {ver.version} {ver.isLatest ? "— Terbaru" : ""}
                  </Badge>
                  <span className="text-xs text-[#64748B] font-mono">
                    Rilis: {formatDate(ver.releaseDate)}
                  </span>
                </div>
                <span className="text-xs font-mono text-[#64748B]">
                  {ver.fileSize}
                </span>
              </div>

              <ul className="space-y-1.5 pl-4 list-disc text-xs text-[#94A3B8]">
                {ver.releaseNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQs */}
      {product.faqs && product.faqs.length > 0 && (
        <section className="space-y-6 pt-8 border-t border-white/[0.08]">
          <h3 className="text-xl font-bold text-white">Pertanyaan yang Sering Diajukan (FAQ)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.faqs.map((faq, idx) => (
              <Card key={idx} className="p-5 space-y-2 bg-white/[0.035] border-white/[0.08]">
                <h4 className="text-sm font-bold text-white">
                  {faq.question}
                </h4>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  {faq.answer}
                </p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Modals */}
      <TrialModal
        isOpen={trialOpen}
        onClose={() => setTrialOpen(false)}
        product={product}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        product={product}
      />
    </div>
  );
}
