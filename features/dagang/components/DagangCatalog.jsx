"use client";

import { useState, useEffect } from "react";
import { dagangData } from "../dagang.data";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/40 backdrop-blur-[4px] animate-[fadeIn_0.2s_ease-out_forwards]">
      <div className="flex flex-col items-center justify-center">
        <LoadingSpinner className="h-10 w-10 text-emerald-400 mb-3" />
        <span className="text-sm font-black tracking-widest text-emerald-300 uppercase animate-pulse">
          Memuat...
        </span>
      </div>
    </div>
  );
}

function CloseIcon({ className = "h-6 w-6" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ProductModal({ product, onClose, onOrder }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    // Prevent scrolling on body when modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] sm:rounded-[32px] border border-white/10 bg-slate-900/95 shadow-2xl shadow-black/50 ring-1 ring-white/5 transition-transform">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-white/20"
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        <div className="overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Image */}
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950 sm:aspect-[2/1]">
            <img
              src={product.image}
              alt={product.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8">
            <div className="mb-4 inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-300">
              {product.category}
            </div>

            <h2 className="mb-4 text-2xl sm:text-3xl font-black leading-tight tracking-tight text-white">
              {product.title}
            </h2>

            <p className="mb-8 text-sm sm:text-base leading-relaxed text-slate-300">
              {product.description}
            </p>

            <div className="mb-8">
              <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-slate-500">
                Fitur Utama
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {product.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400 shrink-0">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-slate-200">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/5 bg-black/20 p-4 sm:p-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mulai Dari</p>
                <p className="text-2xl font-black tracking-tight text-emerald-400">{product.price}</p>
              </div>
              <button
                onClick={() => onOrder(product.linkToBuy)}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-emerald-400 px-8 text-sm font-black text-slate-950 shadow-lg shadow-emerald-400/20 transition-colors hover:bg-emerald-300"
              >
                Pesan Via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, onClick, onOrder }) {
  const handleOrder = (e) => {
    e.stopPropagation(); // Mencegah klik menyebar ke card
    onOrder(product.linkToBuy);
  };

  return (
    <div 
      onClick={onClick}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[20px] sm:rounded-[24px] border border-white/10 bg-white/[0.02] shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-white/[0.04] hover:shadow-2xl hover:shadow-emerald-400/10"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
        <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 rounded-full border border-white/20 bg-black/40 px-2 py-0.5 sm:px-3 sm:py-1 text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md">
          {product.category}
        </div>
        {/* Overlay Text "Lihat Detail" */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
          <span className="rounded-full bg-white/10 border border-white/20 px-4 py-2 text-xs font-black text-white backdrop-blur-md">
            Lihat Detail
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3 sm:p-6">
        <div className="mb-1 sm:mb-2 flex items-start justify-between gap-2 sm:gap-4">
          <h3 className="text-sm sm:text-xl font-black leading-tight tracking-tight text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
            {product.title}
          </h3>
        </div>
        
        <p className="mt-1 sm:mt-2 text-[10px] sm:text-sm font-medium leading-relaxed text-slate-400 flex-grow line-clamp-2 sm:line-clamp-none">
          {product.description}
        </p>

        {/* Features / Tags */}
        <div className="mt-3 hidden sm:flex flex-wrap gap-2">
          {product.features.map((feature, idx) => (
            <span key={idx} className="rounded-lg bg-white/5 px-2.5 py-1 text-[10px] font-bold text-slate-300">
              {feature}
            </span>
          ))}
        </div>

        {/* Price & Action */}
        <div className="mt-3 sm:mt-6 flex items-center justify-between border-t border-white/5 pt-3 sm:pt-5">
          <span className="text-xs sm:text-lg font-black tracking-tight text-emerald-400">
            {product.price}
          </span>
          <button
            onClick={handleOrder}
            className="relative z-10 inline-flex h-7 sm:h-10 items-center justify-center rounded-lg sm:rounded-xl bg-white/10 px-3 sm:px-4 text-[9px] sm:text-xs font-black text-white transition-colors hover:bg-emerald-400 hover:text-slate-950"
          >
            Pesan
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DagangCatalog() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [isLoadingCategory, setIsLoadingCategory] = useState(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // State untuk Modal
  const { categories, products } = dagangData;

  const handleGlobalOrder = (link) => {
    setIsProcessingOrder(true);
    setTimeout(() => {
      setIsProcessingOrder(false);
      window.open(link, "_blank");
    }, 800);
  };

  const filteredProducts = activeCategory === "Semua" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const handleCategoryClick = (cat) => {
    if (cat === activeCategory) return;
    setIsLoadingCategory(cat);
    setTimeout(() => {
      setActiveCategory(cat);
      setIsLoadingCategory(null);
    }, 400);
  };

  return (
    <section id="catalog" className="relative px-4 sm:px-5 pb-24 text-white lg:px-8">
      <div className="relative z-10 mx-auto w-full max-w-5xl">
        
        {/* Categories Filter */}
        <div className="mb-8 relative py-4 sm:py-6">
          {/* Garis atas premium */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-70" />
          {/* Garis bawah premium */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-70" />

          <div className="relative -mx-4 sm:mx-0">
            {/* Gradient Edges for Premium Look on Mobile */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-6 bg-gradient-to-r from-slate-950 to-transparent sm:hidden" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-6 bg-gradient-to-l from-slate-950 to-transparent sm:hidden" />
            
            <div className="flex overflow-x-auto overflow-y-hidden px-4 sm:px-0 gap-2 sm:justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  disabled={isLoadingCategory !== null}
                  className={`shrink-0 flex items-center gap-2 rounded-full px-4 sm:px-5 py-2 text-[10px] sm:text-xs font-black tracking-wide transition-all ${
                    activeCategory === cat
                      ? "bg-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(52,211,153,0.3)] border border-emerald-300"
                      : "bg-white/[0.03] text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white"
                  } disabled:opacity-70`}
                >
                  {isLoadingCategory === cat && (
                    <span className={`h-3 w-3 shrink-0 animate-spin rounded-full border-2 ${activeCategory === cat ? 'border-slate-900/30 border-t-slate-900' : 'border-white/20 border-t-white'}`} />
                  )}
                  <span className="whitespace-nowrap">{cat}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onClick={() => setSelectedProduct(product)} 
              onOrder={handleGlobalOrder}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-500 font-medium">Belum ada produk di kategori ini.</p>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onOrder={handleGlobalOrder}
        />
      )}

      {/* Global Style Loader */}
      {isProcessingOrder && <FullScreenLoader />}
    </section>
  );
}
