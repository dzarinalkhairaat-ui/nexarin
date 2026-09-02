"use client";

import React from "react";
import Link from "next/link";
import { Article } from "@/types/content";
import { Sparkles, Clock, ArrowRight, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface TechInfoTopSpotlightProps {
  article: Article;
}

export function TechInfoTopSpotlight({ article }: TechInfoTopSpotlightProps) {
  if (!article) return null;

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#7CF2C3]" />
          <h2 className="text-sm sm:text-base font-mono font-bold uppercase tracking-wider text-white">
            Top Info &amp; Sorotan Utama
          </h2>
        </div>
        <span className="text-[11px] font-mono text-[#2DD4F5] bg-[#2DD4F5]/10 px-2.5 py-0.5 rounded-full border border-[#2DD4F5]/30 uppercase font-bold">
          Pilihan Redaksi
        </span>
      </div>

      {/* Clean Solid Editorial Card (No Gradient Backgrounds) */}
      <div className="group relative rounded-3xl bg-[#0F172A] border border-white/[0.08] hover:border-cyan-500/40 transition-all duration-300 shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 sm:p-6 lg:p-7 items-center">
          
          {/* Left Column: Clean, Sharp Image Container (Col 5) */}
          <Link
            href={`/tech-info/${article.category?.slug || "technology"}/article/${article.slug}`}
            className="lg:col-span-5 relative aspect-video lg:aspect-auto lg:h-full min-h-[220px] sm:min-h-[280px] rounded-2xl overflow-hidden bg-slate-950 border border-white/[0.08] block shrink-0"
          >
            <img
              src={article.featuredImage || "/assets/default-cover.svg"}
              alt={article.title}
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = "/assets/default-cover.svg";
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Badges on Top-Left of Image */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#0B1120]/85 text-[#2DD4F5] border border-cyan-500/30 backdrop-blur-md">
                {article.category?.name || "Top Story"}
              </span>
              {article.breaking && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-rose-500 text-white shadow-md animate-pulse">
                  Breaking
                </span>
              )}
            </div>
          </Link>

          {/* Right Column: Clean Editorial Content (Col 7) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              
              {/* Meta Header */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono text-slate-400">
                <span className="inline-flex items-center gap-1 text-[#7CF2C3] font-bold text-[11px] uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  Sorotan Utama
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  {article.publishedAt ? formatDate(article.publishedAt) : "Terbaru"}
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <Clock className="w-3 h-3 text-[#2DD4F5]" />
                  {article.readingTimeMinutes || 6} min baca
                </span>
              </div>

              {/* Title */}
              <Link href={`/tech-info/${article.category?.slug || "technology"}/article/${article.slug}`}>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white group-hover:text-[#2DD4F5] transition-colors leading-snug line-clamp-2">
                  {article.title}
                </h3>
              </Link>

              {/* Excerpt */}
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed line-clamp-3">
                {article.excerpt}
              </p>

              {/* Topic Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {article.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-lg text-[11px] font-mono bg-white/[0.04] text-slate-400 border border-white/[0.06]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Author and Action Row (Author on left, Text-only "Selengkapnya" on right) */}
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
              {/* Left: Author Profile */}
              <div className="flex items-center gap-3">
                <img
                  src={article.author?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"}
                  alt={article.author?.name || "Author"}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover border border-white/20"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white leading-snug">
                    {article.author?.name || "Rins"}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {article.author?.role || "Lead Tech Architect"}
                  </span>
                </div>
              </div>

              {/* Right: Clean Text-Only "Selengkapnya" Link (No Background) */}
              <Link
                href={`/tech-info/${article.category?.slug || "technology"}/article/${article.slug}`}
                className="text-[#2DD4F5] hover:text-[#7CF2C3] font-bold text-xs font-mono flex items-center gap-1.5 transition-colors group/link"
              >
                <span>Selengkapnya</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
