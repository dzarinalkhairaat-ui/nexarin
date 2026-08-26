"use client";

import React from "react";
import Link from "next/link";
import { Article } from "@/types/content";
import { formatDate } from "@/lib/utils";
import { Clock, Eye } from "lucide-react";

interface TechHeroStoryProps {
  article: Article;
}

export function TechHeroStory({ article }: TechHeroStoryProps) {
  const sourceName = article.source?.name || "Nexari Tech Architecture";

  const coverImage =
    article.featuredImage &&
    !article.featuredImage.includes(".svg") &&
    !article.featuredImage.includes("placeholder")
      ? article.featuredImage
      : "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop";

  return (
    <article className="group relative rounded-2xl bg-[#131E32]/75 border border-[#1E293B] hover:border-[#2DD4F5]/35 p-5 sm:p-6 transition-all duration-300 backdrop-blur-md">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-6 lg:gap-8">
        {/* Inset 1:1 Aspect-Square Image Container */}
        <div className="w-full md:w-[280px] lg:w-[340px] aspect-square rounded-xl overflow-hidden relative border border-white/[0.08] shrink-0 bg-slate-950">
          <img
            src={coverImage}
            alt={article.title}
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop";
            }}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120]/80 via-transparent to-black/30 pointer-events-none" />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase bg-[#2DD4F5]/20 text-[#2DD4F5] border border-[#2DD4F5]/40 backdrop-blur-md">
              Top Story
            </span>
            {article.breaking && (
              <span className="px-2 py-0.5 rounded-md bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider animate-pulse">
                Breaking
              </span>
            )}
          </div>

          <div className="absolute bottom-3 left-3">
            <span className="text-[11px] font-mono font-bold uppercase text-[#7CF2C3] tracking-wider bg-[#0B1120]/85 px-2.5 py-0.5 rounded-md border border-[#7CF2C3]/30 backdrop-blur-md">
              {article.tags?.[0] || "Software Engineering"}
            </span>
          </div>
        </div>

        {/* Editorial Content Column */}
        <div className="flex-1 flex flex-col justify-between space-y-4 min-w-0">
          <div className="space-y-3">
            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B] font-mono">
              <span className="text-[#2DD4F5] font-bold">{sourceName}</span>
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
              <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-white group-hover:text-[#2DD4F5] transition-colors leading-snug line-clamp-3">
                {article.title}
              </h2>
            </Link>

            {/* Summary */}
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed line-clamp-3">
              {article.excerpt}
            </p>
          </div>

          {/* Author & Footer Metadata */}
          <div className="pt-4 border-t border-[#1E293B] flex items-center justify-between">
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
              <Eye className="w-3.5 h-3.5 text-[#2DD4F5]" />
              <span className="text-[#94A3B8]">{article.views.toLocaleString()} views</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
