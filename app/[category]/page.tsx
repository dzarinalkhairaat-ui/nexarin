"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useContent } from "@/context/ContentContext";
import { CATEGORIES } from "@/lib/constants";
import { ArticleCard } from "@/components/portal/ArticleCard";
import { Tabs } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/feedback/EmptyState";

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  const { getArticlesByCategory } = useContent();

  const [activeFilter, setActiveFilter] = useState<string>("all");

  const categoryMeta = CATEGORIES.find((c) => c.slug === categorySlug) || {
    id: categorySlug,
    name: categorySlug ? categorySlug.toUpperCase() : "Category",
    slug: categorySlug,
    description: `Kumpulan artikel dan wawasan mendalam seputar ${categorySlug}.`
  };

  const rawArticles = getArticlesByCategory(categorySlug);

  const filteredArticles = rawArticles.filter((art) => {
    if (activeFilter === "all") return true;
    return art.contentType === activeFilter;
  });

  const filterTabs = [
    { id: "all", label: "Semua Tipe", count: rawArticles.length },
    { id: "news", label: "News", count: rawArticles.filter((a) => a.contentType === "news").length },
    { id: "analysis", label: "Analisis", count: rawArticles.filter((a) => a.contentType === "analysis").length },
    { id: "tutorial", label: "Tutorial", count: rawArticles.filter((a) => a.contentType === "tutorial").length },
    { id: "review", label: "Review", count: rawArticles.filter((a) => a.contentType === "review").length },
    { id: "explainer", label: "Explainer", count: rawArticles.filter((a) => a.contentType === "explainer").length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Category Header */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#08191B] border border-white/[0.08] relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18D6D0]/10 text-[#18D6D0] text-xs font-bold font-mono uppercase border border-[#18D6D0]/30">
            <span>Kanal Informasi Terkurasi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {categoryMeta.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#A8BCBA] leading-relaxed">
            {categoryMeta.description}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2">
        <Tabs tabs={filterTabs} activeTab={activeFilter} onChange={setActiveFilter} />
      </div>

      {/* Articles Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={`Belum ada artikel pada tipe ${activeFilter}`}
          description="Artikel baru sedang diproses melalui pipeline review editorial Gemini Spark."
        />
      )}
    </div>
  );
}
