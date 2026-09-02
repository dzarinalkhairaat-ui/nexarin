"use client";

import React from "react";
import Link from "next/link";
import { Article } from "@/types/content";
import { Sparkles, Clock, ArrowRight, Calendar, Tag } from "lucide-react";
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

      {/* Modern High-End Editorial Card */}
      <div className="group relative rounded-3xl bg-[#0F172A]/90 border border-white/[0.12] hover:border-[#2DD4F5]/40 transition-all duration-500 shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* Subtle Ambient Background Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#2DD4F5]/10 rounded-full blur-3xl pointer-events-none -mr-24 -mt-24" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
          
          {/* Left Column: Full-Height Visual Cover (Col 5) */}
          <Link
            href={`/tech-info/${article.category?.slug || "technology"}/article/${article.slug}`}
            className="lg:col-span-5 relative min-h-[260px] sm:min-h-[340px] lg:min-h-[400px] overflow-hidden bg-slate-950 block shrink-0"
          >
            <img
              src={article.featuredImage || "/assets/default-cover.svg"}
              alt={article.title}
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = "/assets/default-cover.svg";
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.85]"
            />

            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#0F172A]" />

            {/* Badges on Top of Cover */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-[#0B1120]/85 text-[#2DD4F5] border border-[#2DD4F5]/40 backdrop-blur-md shadow-lg">
                {article.category?.name || "Top Story"}
              </span>
              {article.breaking && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-rose-500 text-white shadow-lg shadow-rose-500/40 animate-pulse">
                  Breaking
                </span>
              )}
            </div>
          </Link>

          {/* Right Column: Editorial Body & Meta (Col 7) */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-9 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Metadata Pill Row */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-mono">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#7CF2C3]/10 text-[#7CF2C3] font-bold border border-[#7CF2C3]/30 text-[11px]">
                  <Sparkles className="w-3.5 h-3.5" />
                  SOROTAN UTAMA
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  {article.publishedAt ? formatDate(article.publishedAt) : "Terbaru"}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-300 font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#2DD4F5]" />
                  {article.readingTimeMinutes || 6} min baca
                </span>
              </div>

              {/* Title with Balanced Editorial Typography */}
              <Link href={`/tech-info/${article.category?.slug || "technology"}/article/${article.slug}`}>
                <h3 className="text-lg sm:text-2xl lg:text-[26px] font-black text-white group-hover:text-[#2DD4F5] transition-colors leading-[1.28] line-clamp-3">
                  {article.title}
                </h3>
              </Link>

              {/* Excerpt */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                {article.excerpt}
              </p>

              {/* Topic Tags Pills */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {article.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-lg text-[11px] font-mono bg-white/[0.04] text-slate-400 border border-white/[0.06]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Author Profile and CTA Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-white/[0.08]">
              <div className="flex items-center gap-3">
                <img
                  src={article.author?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"}
                  alt={article.author?.name || "Author"}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-[#2DD4F5]/40 shadow-md"
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

              <Link
                href={`/tech-info/${article.category?.slug || "technology"}/article/${article.slug}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#2DD4F5] to-[#7CF2C3] hover:from-[#2DD4F5]/90 hover:to-[#7CF2C3]/90 text-[#0B1120] font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all group/btn"
              >
                <span>Baca Analisis Lengkap</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
