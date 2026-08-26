"use client";

import React, { useState } from "react";
import { useShop } from "@/context/ShopContext";
import { ProductCard } from "@/components/shop/ProductCard";
import { Tabs } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Zap, ShieldCheck, RefreshCw, KeyRound } from "lucide-react";

export default function ShopCatalogPage() {
  const { products } = useShop();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", label: "Semua Produk", count: products.length },
    { id: "applications", label: "Aplikasi Web & Mobile", count: products.filter((p) => p.category === "applications").length },
    { id: "templates", label: "Dashboard & Templates", count: products.filter((p) => p.category === "templates").length },
    { id: "starter-kits", label: "Starter Kits", count: products.filter((p) => p.category === "starter-kits").length },
  ];

  const filteredProducts = products.filter((p) => {
    if (activeCategory !== "all" && p.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Shop Hero */}
      <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-slate-950 via-[#0F172A] to-slate-950 border border-cyan-500/30 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#18D6D0]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#49D7A5]/15 text-[#49D7A5] text-xs font-mono font-bold border border-[#49D7A5]/30">
            <Zap className="w-3.5 h-3.5" />
            <span>Nexarin Digital Shop • Produksi Resmi Rins</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Produk Digital & Solusi Perangkat Lunak Siap Pakai
          </h1>

          <p className="text-xs sm:text-sm text-[#A8BCBA] leading-relaxed">
            Dapatkan aplikasi siap pakai, sistem manajemen, dan boilerplate standar industri. Seluruh produk dilengkapi akses trial 3 hari gratis dan hak lisensi Lifetime.
          </p>

          {/* Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/[0.08] text-xs text-[#A8BCBA] font-mono">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Lisensi Lifetime</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Update Berkelanjutan</span>
            </div>
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Full Source Code</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filtering and Search Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <Tabs tabs={categories} activeTab={activeCategory} onChange={setActiveCategory} />
        <div className="w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari produk digital..."
            className="w-full px-4 py-2 text-xs rounded-xl border border-white/[0.08] bg-[#08191B] text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#18D6D0]"
          />
        </div>
      </div>

      {/* Product Catalog Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Tidak Ada Produk yang Cocok"
          description="Coba ubah kata kunci pencarian atau pilih kategori produk yang lain."
          actionText="Tampilkan Semua Produk"
          onAction={() => {
            setActiveCategory("all");
            setSearchQuery("");
          }}
        />
      )}
    </div>
  );
}
