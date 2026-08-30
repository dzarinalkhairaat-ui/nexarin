"use client";

import React from "react";
import Link from "next/link";
import { Article } from "@/types/content";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TechInfoArticleCardProps {
  article: Article;
}

export function TechInfoArticleCard({ article }: TechInfoArticleCardProps) {
  const coverImage =
    article.featuredImage ||
    "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop";

  return (
    <article
      className="group flex flex-col justify-between rounded-3xl p-5 sm:p-6 transition-all duration-300 backdrop-blur-xl border border-transparent hover:border-[#2DD4F5]/40 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(15, 23, 42, 0.85), rgba(11, 17, 32, 0.70)) padding-box, linear-gradient(120deg, rgba(255, 255, 255, 0.15), rgba(45, 212, 245, 0.20), rgba(124, 242, 195, 0.10)) border-box",
        border: "1px solid transparent"
      }}
    >
      <div className="space-y-4">
        {/* Cover Thumbnail 16:9 */}
        <Link href={`/tech-info/${article.category?.slug || "technology"}/article/${article.slug}`} className="block relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-white/[0.08]">
          <img
            src={coverImage}
            alt={article.title}
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop";
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#0B1120]/80 text-[#2DD4F5] border border-cyan-500/30 backdrop-blur-md">
              {article.category?.name || "Tech"}
            </span>
          </div>
          <div className="absolute bottom-3 right-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold text-white bg-[#0B1120]/85 border border-white/20 backdrop-blur-md flex items-center gap-1">
              <Clock className="w-2.5 h-2.5 text-[#7CF2C3]" />
              {article.readingTimeMinutes || 4}m
            </span>
          </div>
        </Link>

        {/* Title & Excerpt */}
        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#2DD4F5] transition-colors leading-snug line-clamp-2">
            <Link href={`/tech-info/${article.category?.slug || "technology"}/article/${article.slug}`}>
              {article.title}
            </Link>
          </h3>

          <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-2">
            {article.excerpt}
          </p>
        </div>
      </div>

      {/* Author & Read Link */}
      <div className="pt-4 mt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={article.author?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"}
            alt={article.author?.name || "Author"}
            className="w-5 h-5 rounded-full object-cover border border-white/20 shrink-0"
          />
          <span className="truncate text-white font-medium">{article.author?.name || "Rins"}</span>
        </div>

        <Link
          href={`/tech-info/${article.category?.slug || "technology"}/article/${article.slug}`}
          className="text-[#2DD4F5] font-bold flex items-center gap-1 hover:underline shrink-0"
        >
          <span>Baca</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </article>
  );
}
