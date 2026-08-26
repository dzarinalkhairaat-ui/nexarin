"use client";

import React from "react";
import Link from "next/link";
import { Article } from "@/types/content";
import { formatDate } from "@/lib/utils";
import { Clock, Eye, Sparkles } from "lucide-react";

interface AIHeroStoryProps {
  article: Article;
}

export function AIHeroStory({ article }: AIHeroStoryProps) {
  const sourceName = article.source?.name || "Nexari Intelligence";

  return (
    <article className="group relative rounded-2xl bg-[#131E32]/70 border border-[#1E293B] hover:border-[#2DD4F5]/35 overflow-hidden transition-all duration-300 backdrop-blur-md">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0 items-center">
        {/* 1:1 Aspect Ratio Media Cover */}
        <div className="md:col-span-5 relative aspect-square w-full overflow-hidden bg-slate-900 shrink-0">
          <img
            src={article.featuredImage || "/assets/article-ai.svg"}
            alt={article.title}
            onError={(e) => {
              e.currentTarget.src = "/assets/default-cover.svg";
            }}
            className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120]/70 via-transparent to-transparent" />

          {/* Badges Overlay */}
          <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase bg-[#2DD4F5]/20 text-[#2DD4F5] border border-[#2DD4F5]/40 backdrop-blur-md">
              Top Story
            </span>
            {article.breaking && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider animate-pulse">
                Breaking
              </span>
            )}
          </div>

          <div className="absolute bottom-3.5 left-3.5">
            <span className="text-[11px] font-mono font-bold uppercase text-[#7CF2C3] tracking-wider bg-[#0B1120]/80 px-2 py-0.5 rounded border border-[#7CF2C3]/30 backdrop-blur-md">
              {article.tags?.[0] || "Artificial Intelligence"}
            </span>
          </div>
        </div>

        {/* Editorial Content */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5 h-full">
          <div className="space-y-3.5">
            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B] font-mono">
              <span className="text-[#2DD4F5] font-semibold">{sourceName}</span>
              <span>•</span>
              <span>{formatDate(article.publishedAt)}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readingTimeMinutes} mnt baca
              </span>
            </div>

            {/* Headline */}
            <Link href={`/article/${article.slug}`}>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-white group-hover:text-[#2DD4F5] transition-colors leading-tight">
                {article.title}
              </h2>
            </Link>

            {/* Summary */}
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed line-clamp-3">
              {article.excerpt}
            </p>
          </div>

          {/* Author & Footer Metadata */}
          <div className="pt-3.5 border-t border-[#1E293B] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={article.author.avatar || "/assets/avatar-default.svg"}
                alt={article.author.name}
                onError={(e) => {
                  e.currentTarget.src = "/assets/avatar-default.svg";
                }}
                className="w-8 h-8 rounded-full object-cover border border-[#2DD4F5]/30"
              />
              <div>
                <h4 className="text-xs font-bold text-[#F8FAFC]">
                  {article.author.name}
                </h4>
                <p className="text-[10px] text-[#64748B] font-mono">
                  {article.author.role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-mono">
              <Eye className="w-3.5 h-3.5" />
              <span>{article.views.toLocaleString()} views</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
