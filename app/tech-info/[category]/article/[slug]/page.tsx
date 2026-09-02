"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useContent } from "@/context/ContentContext";
import { useShop } from "@/context/ShopContext";
import { useNotification } from "@/context/NotificationContext";
import { ReadingProgressBar } from "@/components/portal/ReadingProgressBar";
import { LessonMarkdownRenderer } from "@/components/tutorials/classroom/LessonMarkdownRenderer";
import { Button } from "@/components/ui/Button";
import {
  Clock,
  Calendar,
  Share2,
  Bookmark,
  ShoppingBag,
  ArrowLeft,
  Sparkles,
  Tag,
  ChevronRight,
  Eye,
  Check,
  Copy,
  Flame,
  ArrowRight,
  BookOpen
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

export default function TechInfoArticleDetailPage() {
  const params = useParams();
  const categoryParam = (params.category as string) || "technology";
  const slug = params.slug as string;

  const { getArticleBySlug, articles } = useContent();
  const { products, affiliates } = useShop();
  const { showToast } = useNotification();

  const [copied, setCopied] = useState(false);

  const article = getArticleBySlug(slug);

  if (!article) {
    return notFound();
  }

  const categorySlug = article.category?.slug || categoryParam;
  const categoryName = article.category?.name || categorySlug.toUpperCase();

  // Related articles in same category
  const relatedArticles = articles
    .filter((a) => a.id !== article.id && (a.category?.slug === categorySlug || a.category?.id === categorySlug))
    .slice(0, 3);

  // Trending articles across all tech info
  const trendingArticles = articles
    .filter((a) => a.id !== article.id)
    .slice(0, 4);

  // Linked product / affiliate
  const relatedProduct = products.find((p) => p.id === article.relatedProductId);
  const affiliate = affiliates.find(
    (a) => a.id === article.affiliateId || a.linkedArticleIds?.includes(article.id)
  );

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      showToast({
        type: "success",
        title: "Tautan Disalin!",
        message: "URL artikel telah disalin ke clipboard."
      });
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareTwitter = () => {
    if (typeof window !== "undefined") {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(`Membaca "${article.title}" di Nexarin Tech Info:`);
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank");
    }
  };

  const handleShareLinkedIn = () => {
    if (typeof window !== "undefined") {
      const url = encodeURIComponent(window.location.href);
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-[#F8FAFC] selection:bg-[#2DD4F5]/30">
      <ReadingProgressBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-20 space-y-10">
        
        {/* 1. Breadcrumbs Navigation */}
        <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs font-mono text-slate-400 overflow-x-auto pb-1 scrollbar-none">
          <Link href="/tech-info" className="hover:text-[#2DD4F5] transition-colors whitespace-nowrap">
            Tech Info
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
          <Link href={`/tech-info/${categorySlug}`} className="hover:text-[#2DD4F5] transition-colors capitalize whitespace-nowrap">
            {categoryName}
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
          <span className="text-white font-bold truncate max-w-[240px] sm:max-w-md">
            {article.title}
          </span>
        </nav>

        {/* 2. Article Header */}
        <header className="space-y-6 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-[#2DD4F5]/15 text-[#2DD4F5] border border-[#2DD4F5]/30">
              {categoryName}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono uppercase bg-white/[0.05] text-slate-300 border border-white/[0.10]">
              {article.contentType || "Insight"}
            </span>
            {article.breaking && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
                Breaking
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            {article.excerpt}
          </p>

          {/* Author & Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/[0.08] text-xs font-mono text-slate-400">
            
            {/* Author Card */}
            <div className="flex items-center gap-3">
              <img
                src={article.author?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"}
                alt={article.author?.name || "Author"}
                className="w-10 h-10 rounded-full object-cover border border-[#2DD4F5]/40 shadow-md"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white leading-snug">
                  {article.author?.name || "Rins"}
                </span>
                <span className="text-[11px] text-slate-400">
                  {article.author?.role || "Lead Tech Architect"}
                </span>
              </div>
            </div>

            {/* Read Stats & Date */}
            <div className="flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {article.publishedAt ? formatDate(article.publishedAt) : "26 Agu 2026"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-white font-semibold">
                <Clock className="w-3.5 h-3.5 text-[#7CF2C3]" />
                {article.readingTimeMinutes || 4} min baca
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#2DD4F5]" />
                {article.views || 4380} views
              </span>
            </div>

          </div>
        </header>

        {/* 3. Featured Image (16:9 Banner) */}
        <div className="relative aspect-video w-full max-w-5xl rounded-3xl overflow-hidden bg-slate-950 border border-white/[0.12] shadow-2xl">
          <img
            src={article.featuredImage || "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1600&q=80"}
            alt={article.title}
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = "/assets/default-cover.svg";
            }}
            className="w-full h-full object-cover brightness-[0.85]"
          />
        </div>

        {/* 4. Two-Column Reading Layout: Main Paper + Sticky Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Main Reading Paper (Col 8) */}
          <article className="lg:col-span-8 space-y-10">
            
            {/* Article Body Content */}
            <div className="rounded-3xl p-6 sm:p-10 bg-[#0F172A]/70 border border-white/[0.08] backdrop-blur-xl shadow-2xl space-y-8">
              <LessonMarkdownRenderer content={article.content} />

              {/* Tags Cloud */}
              {article.tags && article.tags.length > 0 && (
                <div className="pt-8 border-t border-white/[0.08] space-y-3">
                  <span className="text-xs font-mono font-bold uppercase text-slate-400 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#2DD4F5]" />
                    Topik Terkait
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Share & Actions Footer */}
              <div className="pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs font-mono font-bold text-slate-400">
                  Bagikan artikel ini:
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#7CF2C3]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Disalin" : "Salin Link"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShareTwitter}
                    className="p-2 rounded-full text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.10] border border-white/[0.08] hover:border-white/30 transition-all"
                    aria-label="Share on X"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={handleShareLinkedIn}
                    className="p-2 rounded-full text-slate-300 hover:text-white bg-white/[0.04] hover:bg-[#0A66C2]/20 border border-white/[0.08] hover:border-[#0A66C2]/40 transition-all"
                    aria-label="Share on LinkedIn"
                  >
                    <svg className="w-3.5 h-3.5 fill-current text-[#0A66C2]" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Author Signature Card */}
            <div className="rounded-3xl p-6 sm:p-8 bg-[#0F172A]/85 border border-white/[0.08] backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <img
                src={article.author?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"}
                alt={article.author?.name || "Author"}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#2DD4F5]/40 shadow-lg shrink-0"
              />
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">
                    Ditulis oleh {article.author?.name || "Rins"}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#2DD4F5]/15 text-[#2DD4F5] border border-[#2DD4F5]/30">
                    Lead Tech Author
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Spesialis arsitektur sistem terdistribusi, AI tooling, dan ekosistem modern web development. Menulis panduan komprehensif untuk pengembang software dan profesional teknologi.
                </p>
              </div>
            </div>

            {/* Linked Product Recommendation Box (if any) */}
            {relatedProduct && (
              <div className="rounded-3xl p-6 bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-cyan-500/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#2DD4F5] tracking-wider">
                    Software &amp; Tools Terkait Artikel
                  </span>
                  <h4 className="text-lg font-bold text-white">
                    {relatedProduct.name}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {relatedProduct.description}
                  </p>
                </div>
                <Link href={`/shop/${relatedProduct.slug}`} className="shrink-0">
                  <Button variant="primary" size="sm" className="rounded-full px-5 text-xs font-bold shadow-lg shadow-cyan-500/20">
                    <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
                    Lihat di Digital Shop
                  </Button>
                </Link>
              </div>
            )}

            {/* Back to Channel Footer Link */}
            <div className="pt-4 text-center sm:text-left">
              <Link
                href={`/tech-info/${categorySlug}`}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#2DD4F5] hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Kanal {categoryName}</span>
              </Link>
            </div>

          </article>

          {/* Sticky Sidebar (Col 4) */}
          <aside className="lg:col-span-4 space-y-6 sticky top-28">
            
            {/* 1. Related Articles in This Channel */}
            {relatedArticles.length > 0 && (
              <div className="rounded-3xl bg-[#0F172A]/90 border border-white/[0.08] backdrop-blur-xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center gap-2 pb-3 border-b border-white/[0.08]">
                  <BookOpen className="w-4 h-4 text-[#2DD4F5]" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    Artikel Terkait ({categoryName})
                  </h3>
                </div>

                <div className="space-y-3.5">
                  {relatedArticles.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/tech-info/${rel.category?.slug || categorySlug}/article/${rel.slug}`}
                      className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] group transition-all"
                    >
                      <div className="relative w-16 h-14 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-white/[0.08]">
                        <img
                          src={rel.featuredImage || "/assets/default-cover.svg"}
                          alt={rel.title}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.src = "/assets/default-cover.svg";
                          }}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 brightness-[0.85]"
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <span className="text-[10px] font-mono text-[#7CF2C3] font-bold uppercase block">
                          {rel.category?.name || categoryName}
                        </span>
                        <h4 className="text-xs font-bold text-white group-hover:text-[#2DD4F5] transition-colors leading-snug line-clamp-2">
                          {rel.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Top Trending in Tech Info */}
            <div className="rounded-3xl bg-[#0F172A]/90 border border-white/[0.08] backdrop-blur-xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 pb-3 border-b border-white/[0.08]">
                <Flame className="w-4 h-4 text-orange-400" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Trending di Tech Info
                </h3>
              </div>

              <div className="space-y-4">
                {trendingArticles.map((art, idx) => (
                  <Link
                    key={art.id}
                    href={`/tech-info/${art.category?.slug || "technology"}/article/${art.slug}`}
                    className="flex items-start gap-3 group"
                  >
                    <span className="text-lg font-black font-mono text-[#2DD4F5] shrink-0 w-6">
                      0{idx + 1}
                    </span>
                    <div className="space-y-1 min-w-0">
                      <span className="text-[10px] font-mono text-[#7CF2C3] font-bold uppercase block">
                        {art.category?.name || "Tech"}
                      </span>
                      <h4 className="text-xs font-bold text-slate-200 group-hover:text-[#2DD4F5] transition-colors leading-snug line-clamp-2">
                        {art.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </aside>

        </div>

      </main>
    </div>
  );
}
