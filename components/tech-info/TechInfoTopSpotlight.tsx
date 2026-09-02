"use client";

import React from "react";
import Link from "next/link";
import { Article } from "@/types/content";
import { Sparkles, Clock, ArrowRight, Eye, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface TechInfoTopSpotlightProps {
  article: Article;
}

export function TechInfoTopSpotlight({ article }: TechInfoTopSpotlightProps) {
  if (!article) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#7CF2C3]" />
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Top Info &amp; Sorotan Utama
          </h2>
        </div>
        <span className="text-[11px] font-mono text-[#2DD4F5] bg-[#2DD4F5]/10 px-2.5 py-0.5 rounded-full border border-[#2DD4F5]/30 uppercase font-bold">
          Pilihan Redaksi
        </span>
      </div>

      <div className="group relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0F172A] via-[#0B1120] to-[#0F172A] border border-white/[0.12] hover:border-[#2DD4F5]/50 transition-all duration-500 shadow-2xl overflow-hidden backdrop-blur-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          
          {/* 16:9 Image Thumbnail */}
          <Link
            href={`/tech-info/${article.category?.slug || "technology"}/article/${article.slug}`}
            className="lg:col-span-6 relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-white/[0.08] block shrink-0"
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
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-[#0B1120]/80 text-[#2DD4F5] border border-cyan-500/40 backdrop-blur-md">
                {article.category?.name || "Top Story"}
              </span>
            </div>
            {article.breaking && (
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-rose-500 text-white shadow-lg shadow-rose-500/40 animate-pulse">
                  Breaking
                </span>
              </div>
            )}
          </Link>

          {/* Text Content & Metadata */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              <span className="text-[#7CF2C3] font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Featured Intelligence
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {article.readingTimeMinutes || 6} min baca
              </span>
            </div>

            <Link href={`/tech-info/${article.category?.slug || "technology"}/article/${article.slug}`}>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white group-hover:text-[#2DD4F5] transition-colors leading-snug">
                {article.title}
              </h3>
            </Link>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
              {article.excerpt}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/[0.08] text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2.5">
                <img
                  src={article.author?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"}
                  alt={article.author?.name || "Author"}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover border border-[#2DD4F5]/40"
                />
                <span className="text-white font-semibold">{article.author?.name || "Rins"}</span>
              </div>

              <Link
                href={`/tech-info/${article.category?.slug || "technology"}/article/${article.slug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2DD4F5]/10 hover:bg-[#2DD4F5]/20 text-[#2DD4F5] border border-[#2DD4F5]/30 font-bold text-xs transition-all group/btn"
              >
                <span>Baca Top Info</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
