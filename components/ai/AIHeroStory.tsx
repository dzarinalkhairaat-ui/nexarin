"use client";

import React from "react";
import Link from "next/link";
import { Article } from "@/types/content";
import { formatDate } from "@/lib/utils";
import { Clock, Eye, Sparkles, Flame } from "lucide-react";

interface AIHeroStoryProps {
  article: Article;
}

export function AIHeroStory({ article }: AIHeroStoryProps) {
  const sourceName = article.source?.name || "Nexarin Intelligence";

  const coverImage =
    article.featuredImage &&
    !article.featuredImage.includes(".svg") &&
    !article.featuredImage.includes("placeholder")
      ? article.featuredImage
      : "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop";

  return (
    <article
      className="group relative rounded-3xl p-6 sm:p-7 transition-all duration-300 backdrop-blur-xl border border-transparent hover:border-cyan-500/40"
      style={{
        background:
          "linear-gradient(180deg, rgba(15, 23, 42, 0.85), rgba(11, 17, 32, 0.70)) padding-box, linear-gradient(120deg, rgba(255, 255, 255, 0.18), rgba(45, 212, 245, 0.35), rgba(124, 242, 195, 0.20)) border-box",
        border: "1px solid transparent"
      }}
    >
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-6 lg:gap-8">
        {/* Visual Cover Container */}
        <div className="w-full md:w-[300px] lg:w-[340px] aspect-square rounded-2xl overflow-hidden relative border border-white/[0.10] shrink-0 bg-slate-950">
          <img
            src={coverImage}
            alt={article.title}
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1000&auto=format&fit=crop";
            }}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="eager"
          />
          {/* Bottom Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120]/80 via-transparent to-transparent pointer-events-none" />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-[#2DD4F5]/20 text-[#2DD4F5] border border-[#2DD4F5]/40 backdrop-blur-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#2DD4F5]" />
              Top Story
            </span>
            {article.breaking && (
              <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider animate-pulse">
                Breaking
              </span>
            )}
          </div>

          <div className="absolute bottom-3 left-3">
            <span className="text-[10px] font-mono font-bold uppercase text-[#7CF2C3] tracking-wider bg-[#0B1120]/90 px-3 py-1 rounded-full border border-[#7CF2C3]/30 backdrop-blur-md">
              {article.tags?.[0] || "Artificial Intelligence"}
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
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {article.readingTimeMinutes} mnt baca
              </span>
            </div>

            {/* Headline */}
            <Link href={`/article/${article.slug}`}>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white group-hover:text-[#2DD4F5] transition-colors leading-snug line-clamp-3">
                {article.title}
              </h2>
            </Link>

            {/* Summary */}
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed line-clamp-3">
              {article.excerpt}
            </p>
          </div>

          {/* Author & Footer Metadata */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
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
                <span className="text-xs font-bold text-white block">
                  {article.author.name}
                </span>
                <span className="text-[10px] text-[#64748B] font-mono block">
                  {article.author.role}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-mono">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>{article.views} views</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
