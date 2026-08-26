"use client";

import React from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useContent } from "@/context/ContentContext";
import { useShop } from "@/context/ShopContext";
import { useNotification } from "@/context/NotificationContext";
import { ReadingProgressBar } from "@/components/portal/ReadingProgressBar";
import { CategoryBadge } from "@/components/portal/CategoryBadge";
import { AffiliateWidget } from "@/components/affiliate/AffiliateWidget";
import { ArticleCard } from "@/components/portal/ArticleCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import {
  Clock,
  Calendar,
  Share2,
  Bookmark,
  ShoppingBag,
  ArrowLeft,
  Sparkles,
  Tag
} from "lucide-react";

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { getArticleBySlug, articles } = useContent();
  const { products, affiliates } = useShop();
  const { showToast } = useNotification();

  const article = getArticleBySlug(slug);

  if (!article) {
    return notFound();
  }

  // Find linked affiliate if available
  const affiliate = affiliates.find(
    (a) => a.id === article.affiliateId || a.linkedArticleIds.includes(article.id)
  );

  // Find related product
  const relatedProduct = products.find((p) => p.id === article.relatedProductId);

  // Other related articles in same category
  const relatedArticles = articles
    .filter((a) => a.id !== article.id && a.category.slug === article.category.slug)
    .slice(0, 3);

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href
      });
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast({
        type: "success",
        title: "Tautan Disalin!",
        message: "Tautan artikel berhasil disalin ke clipboard."
      });
    }
  };

  return (
    <>
      <ReadingProgressBar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
        {/* Back Link */}
        <div>
          <Link
            href={`/${article.category.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Kanal {article.category.name}</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-5 border-b border-white/[0.08] pb-8">
          <div className="flex items-center gap-2">
            <CategoryBadge category={article.category} />
            <span className="text-xs font-mono uppercase text-cyan-400 font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              {article.contentType}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.2]">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed font-normal">
            {article.excerpt}
          </p>

          {/* Author and Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 text-xs text-[#64748B]">
            <div className="flex items-center gap-3">
              <img
                src={article.author.avatar || "/assets/avatar-default.svg"}
                alt={article.author.name}
                onError={(e) => {
                  e.currentTarget.src = "/assets/avatar-default.svg";
                }}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#2DD4F5]/40"
              />
              <div>
                <span className="font-bold text-white text-sm block">
                  {article.author.name}
                </span>
                <span className="text-[#64748B] text-[11px] block">{article.author.role}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 font-mono">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(article.publishedAt)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {article.readingTimeMinutes} mnt baca
              </span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="rounded-3xl overflow-hidden border border-white/[0.08] h-72 sm:h-96 lg:h-[450px] bg-[#0F172A]">
          <img
            src={article.featuredImage || "/assets/default-cover.svg"}
            alt={article.title}
            onError={(e) => {
              e.currentTarget.src = "/assets/default-cover.svg";
            }}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body Content */}
        <article className="prose prose-invert max-w-none text-[#94A3B8] leading-relaxed space-y-6 text-sm sm:text-base">
          {article.content.split("\n\n").map((paragraph, index) => {
            if (paragraph.startsWith("### ")) {
              return (
                <h3
                  key={index}
                  className="text-xl sm:text-2xl font-bold text-white pt-6 pb-2 border-b border-white/[0.08]"
                >
                  {paragraph.replace("### ", "")}
                </h3>
              );
            }
            if (paragraph.startsWith("1. ") || paragraph.startsWith("- ")) {
              const lines = paragraph.split("\n");
              return (
                <ul key={index} className="space-y-2 pl-4 list-disc">
                  {lines.map((l, li) => (
                    <li key={li} className="text-[#94A3B8]">
                      {l.replace(/^[-*]|\d+\.\s/, "")}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={index} className="leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </article>

        {/* Tags & Action Bar */}
        <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#64748B] font-mono flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Tags:
            </span>
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-xl bg-slate-800/80 border border-white/[0.10] text-xs text-[#94A3B8] font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare} className="text-xs border-white/[0.10] text-[#94A3B8] hover:text-white">
              <Share2 className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
              Bagikan Artikel
            </Button>
          </div>
        </div>

        {/* Ingested Affiliate Recommendation */}
        {affiliate && (
          <section className="pt-6">
            <div className="space-y-2 mb-4">
              <span className="text-xs font-mono uppercase text-[#2DD4F5] font-bold tracking-wider">
                Rekomendasi Perangkat / Hardware Relevan:
              </span>
            </div>
            <AffiliateWidget affiliate={affiliate} />
          </section>
        )}

        {/* Product Conversion CTA Card */}
        {relatedProduct && (
          <Card className="p-6 sm:p-8 bg-gradient-to-br from-[#0F172A] to-[#131E32] border-cyan-500/30 text-white space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Solusi Terkait dari Nexarin Digital Shop</span>
            </div>
            <div className="space-y-1">
              <h4 className="text-lg sm:text-xl font-bold text-white">
                {relatedProduct.name}
              </h4>
              <p className="text-xs sm:text-sm text-[#94A3B8]">
                {relatedProduct.shortDescription}
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link href={`/shop/${relatedProduct.slug}`}>
                <Button variant="primary" size="sm" className="font-bold text-xs">
                  <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
                  Lihat Detail & Coba Demo Gratis 3 Hari
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Related Articles Carousel/Grid */}
        {relatedArticles.length > 0 && (
          <section className="pt-10 border-t border-white/[0.08] space-y-6">
            <h3 className="text-xl font-bold text-white">
              Artikel Terkait Lainnya di Kanal {article.category.name}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedArticles.map((rel) => (
                <Card key={rel.id} hoverable className="p-4 flex flex-col justify-between bg-white/[0.035] border-white/[0.08]">
                  <div className="space-y-2">
                    <img
                      src={rel.featuredImage || "/assets/default-cover.svg"}
                      alt={rel.title}
                      onError={(e) => {
                        e.currentTarget.src = "/assets/default-cover.svg";
                      }}
                      className="w-full h-32 rounded-xl object-cover"
                    />
                    <Link href={`/article/${rel.slug}`}>
                      <h4 className="text-xs font-bold text-white hover:text-[#2DD4F5] line-clamp-2 transition-colors">
                        {rel.title}
                      </h4>
                    </Link>
                  </div>
                  <span className="text-[11px] font-mono text-[#64748B] mt-2 block">
                    {rel.readingTimeMinutes} mnt baca
                  </span>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
