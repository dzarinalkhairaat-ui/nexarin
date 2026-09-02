"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useContent } from "@/context/ContentContext";
import { TechInfoHeroHeadlines } from "@/components/tech-info/TechInfoHeroHeadlines";
import { TechInfoNewsTicker } from "@/components/tech-info/TechInfoNewsTicker";
import { TechInfoCategoryFilter } from "@/components/tech-info/TechInfoCategoryFilter";
import { TechInfoArticleCard } from "@/components/tech-info/TechInfoArticleCard";
import { TechInfoSidebar } from "@/components/tech-info/TechInfoSidebar";
import { TechInfoTopSpotlight } from "@/components/tech-info/TechInfoTopSpotlight";
import { Newspaper } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function TechInfoCategoryChannelPage() {
  const params = useParams();
  const categoryParam = (params.category as string) || "all";
  const { articles } = useContent();

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);

  const publishedArticles = useMemo(() => {
    return articles.filter((a) => a.status === "published" || !a.status);
  }, [articles]);

  const categoryArticles = useMemo(() => {
    return publishedArticles.filter((a) => {
      const categorySlug = a.category?.slug || a.category?.id || "";
      return categorySlug === selectedCategory || selectedCategory === "all";
    });
  }, [publishedArticles, selectedCategory]);

  const topSpotlight = categoryArticles[0] || publishedArticles[0];
  const trendingStories = categoryArticles.slice(1, 4).length > 0 ? categoryArticles.slice(1, 4) : publishedArticles.slice(1, 4);

  const filteredArticles = useMemo(() => {
    return categoryArticles.filter((art) => {
      return (
        !searchQuery.trim() ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [categoryArticles, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0B1120] text-[#F8FAFC] selection:bg-[#2DD4F5]/30 w-full max-w-full overflow-x-hidden">
      
      {/* 1. HERO BRANDING (Clean, without news cards) */}
      <TechInfoHeroHeadlines
        categoryTitle={`Kanal Berita: ${selectedCategory.toUpperCase()}`}
        categoryDescription={`Koleksi liputan mendalam, riset, dan analisis komprehensif seputar ekosistem ${selectedCategory.toUpperCase()}.`}
      />

      {/* 2. LIVE TICKER */}
      <TechInfoNewsTicker />

      {/* 3. CATEGORY FILTER */}
      <TechInfoCategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 4. MAIN FEED */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          <div className="lg:col-span-8 space-y-10">
            
            {/* Top Spotlight on Channel */}
            {!searchQuery.trim() && topSpotlight && (
              <TechInfoTopSpotlight article={topSpotlight} />
            )}

            {/* List of Channel News */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-[#2DD4F5]" />
                  <h2 className="text-xl font-bold text-white tracking-tight capitalize">
                    Berita Terbaru: {selectedCategory}
                  </h2>
                </div>
                <span className="text-xs font-mono text-[#64748B]">
                  Menampilkan <span className="text-white font-bold">{filteredArticles.length}</span> artikel
                </span>
              </div>

              {filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredArticles.slice(0, visibleCount).map((article) => (
                    <TechInfoArticleCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 space-y-3 rounded-3xl bg-[#0F172A]/50 border border-white/[0.08] p-8">
                  <Newspaper className="w-10 h-10 text-slate-600 mx-auto" />
                  <h3 className="text-base font-bold text-white">Tidak Ada Berita di Kanal Ini</h3>
                  <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                    Coba kembali ke semua berita atau sesuaikan kata kunci pencarian.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                  >
                    Lihat Semua Berita
                  </Button>
                </div>
              )}

              {filteredArticles.length > visibleCount && (
                <div className="text-center pt-4">
                  <Button
                    variant="outline"
                    size="md"
                    className="rounded-full px-6 text-xs font-bold border-white/20 hover:border-cyan-400"
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                  >
                    Muat Lebih Banyak
                  </Button>
                </div>
              )}
            </div>

          </div>

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
