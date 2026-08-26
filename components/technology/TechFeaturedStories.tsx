"use client";

import React from "react";
import Link from "next/link";
import { Article } from "@/types/content";
import { formatDate } from "@/lib/utils";
import { Clock } from "lucide-react";

interface TechFeaturedStoriesProps {
  articles: Article[];
}

export function TechFeaturedStories({ articles }: TechFeaturedStoriesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2DD4F5]" />
          Liputan Khusus &amp; Sorotan Engineering
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => {
          const sourceName = article.source?.name || "Nexari Tech";
          const coverImg =
            article.featuredImage && !article.featuredImage.includes(".svg")
              ? article.featuredImage
              : "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop";

          return (
            <article
              key={article.id}
              className="group flex flex-col justify-between rounded-xl bg-[#131E32]/70 border border-[#1E293B] hover:border-[#2DD4F5]/35 hover:bg-[#131E32] overflow-hidden transition-all duration-200 backdrop-blur-md"
            >
              <div>
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                  <img
                    src={coverImg}
                    alt={article.title}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop";
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#0B1120]/80 text-[#2DD4F5] border border-[#2DD4F5]/30 backdrop-blur-md">
                      {article.tags?.[0] || "Software Tech"}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#64748B]">
                    <span>{sourceName}</span>
                    <span>•</span>
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>

                  <Link href={`/article/${article.slug}`}>
                    <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-[#2DD4F5] transition-colors leading-snug line-clamp-2">
                      {article.title}
                    </h4>
                  </Link>

                  <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between text-xs text-[#64748B] font-mono border-t border-[#1E293B]/60 mt-2">
                <span className="truncate max-w-[130px]">{article.author.name}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.readingTimeMinutes}m
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
