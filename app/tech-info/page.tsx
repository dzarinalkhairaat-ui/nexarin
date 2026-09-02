"use client";

import React, { useState, useMemo } from "react";
import { useContent } from "@/context/ContentContext";
import { TechInfoHeroHeadlines } from "@/components/tech-info/TechInfoHeroHeadlines";
import { TechInfoNewsTicker } from "@/components/tech-info/TechInfoNewsTicker";
import { TechInfoCategoryFilter } from "@/components/tech-info/TechInfoCategoryFilter";
import { TechInfoArticleCard } from "@/components/tech-info/TechInfoArticleCard";
import { TechInfoSidebar } from "@/components/tech-info/TechInfoSidebar";
import { TechInfoTopSpotlight } from "@/components/tech-info/TechInfoTopSpotlight";
import { Newspaper, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function TechInfoPortalPage() {
  const { articles } = useContent();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);

  // Published articles sorted by date
  const publishedArticles = useMemo(() => {
    return articles.filter((a) => a.status === "published" || !a.status);
  }, [articles]);

  const topSpotlight = publishedArticles[0];
  const trendingStories = publishedArticles.slice(1, 4);

  // Filtered articles list
  const filteredArticles = useMemo(() => {
    return publishedArticles.filter((art) => {
      const categorySlug = art.category?.slug || art.category?.id || "";
      const matchesCategory =
        selectedCategory === "all" ||
        categorySlug === selectedCategory;

      const matchesSearch =
        !searchQuery.trim() ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [publishedArticles, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0B1120] text-[#F8FAFC] selection:bg-[#2DD4F5]/30 w-full max-w-full overflow-x-hidden">
      
      {/* 1. HERO BRANDING SECTION (Clean, without news cards) */}
      <TechInfoHeroHeadlines />

      {/* 2. LIVE BREAKING NEWS TICKER */}
      <TechInfoNewsTicker />

      {/* 3. STICKY CATEGORY FILTER & SEARCH BAR */}
      <TechInfoCategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 4. MAIN NEWS FEED & SIDEBAR SECTION */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Main Feed Column (Col 8) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* 4.1 TOP INFO & SOROTAN UTAMA (Hanya tampil saat di tab "Semua" atau tanpa search query) */}
            {selectedCategory === "all" && !searchQuery.trim() && topSpotlight && (
              <TechInfoTopSpotlight article={topSpotlight} />
            )}

            {/* 4.2 BERITA TERBARU & DAFTAR ARTIKEL */}
            <div className="space-y-6">
              
              {/* Feed Section Title */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-[#2DD4F5]" />
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {selectedCategory !== "all" ? `Kanal Berita: ${selectedCategory.toUpperCase()}` : "Daftar Berita Terbaru"}
                  </h2>
                </div>
                <span className="text-xs font-mono text-[#64748B]">
                  Menampilkan <span className="text-white font-bold">{filteredArticles.length}</span> artikel
                </span>
              </div>

              {/* Articles Grid */}
              {filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredArticles.slice(0, visibleCount).map((article) => (
                    <TechInfoArticleCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 space-y-3 rounded-3xl bg-[#0F172A]/50 border border-white/[0.08] p-8">
                  <Newspaper className="w-10 h-10 text-slate-600 mx-auto" />
                  <h3 className="text-base font-bold text-white">Tidak Ada Berita Ditemukan</h3>
                  <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                    Coba sesuaikan kata kunci pencarian Anda atau pilih kanal berita lain.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                  >
                    Reset Pencarian
                  </Button>
                </div>
              )}

              {/* Load More Button */}
              {filteredArticles.length > visibleCount && (
                <div className="text-center pt-4">
                  <Button
                    variant="outline"
                    size="md"
                    className="rounded-full px-6 text-xs font-bold border-white/20 hover:border-cyan-400"
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                  >
                    Muat Lebih Banyak Berita
                  </Button>
                </div>
              )}

            </div>

          </div>

          {/* Right Sidebar Column (Col 4) */}
          <div className="lg:col-span-4 sticky top-36">
            <TechInfoSidebar
              trendingArticles={trendingStories}
              popularArticles={publishedArticles}
            />
          </div>

        </div>
      </main>

    </div>
  );
}
