"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useContent } from "@/context/ContentContext";
import { useShop } from "@/context/ShopContext";
import { ArticleCard } from "@/components/portal/ArticleCard";
import { ProductCard } from "@/components/shop/ProductCard";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Search, Sparkles } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  const { articles } = useContent();
  const { products } = useShop();

  const q = query.toLowerCase().trim();

  const matchedArticles = q
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.category.name.toLowerCase().includes(q)
      )
    : articles;

  const matchedProducts = q
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
    : products;

  return (
    <div suppressHydrationWarning className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Search Header */}
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Pencarian Artikel & Produk Digital
        </h1>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik topik, kata kunci AI, framework, atau nama aplikasi..."
            className="w-full px-5 py-3.5 pl-12 rounded-2xl border border-white/[0.08] bg-[#0F172A] text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2DD4F5] text-sm"
          />
          <Search className="w-5 h-5 text-[#64748B] absolute left-4 top-4" />
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-12">
        {/* Products Results */}
        {matchedProducts.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-white/[0.08] pb-2">
              Produk Digital Terkait ({matchedProducts.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {matchedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </section>
        )}

        {/* Articles Results */}
        {matchedArticles.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-white/[0.08] pb-2">
              Artikel & Tutorial ({matchedArticles.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedArticles.map((art) => (
                <ArticleCard key={art.id} article={art} />
              ))}
            </div>
          </section>
        )}

        {matchedArticles.length === 0 && matchedProducts.length === 0 && (
          <EmptyState
            title="Tidak Ditemukan Hasil Pencarian"
            description={`Tidak ada artikel atau produk digital yang cocok dengan kata kunci "${query}".`}
          />
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center text-xs text-[#64748B]">Memuat pencarian...</div>}>
      <SearchContent />
    </Suspense>
  );
}
