"use client";

import React from "react";
import Link from "next/link";
import { Article } from "@/types/content";
import { formatDate } from "@/lib/utils";
import { Clock, Eye, Newspaper } from "lucide-react";

interface AILatestNewsProps {
  articles: Article[];
}

export function AILatestNews({ articles }: AILatestNewsProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
        <div className="flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-[#2DD4F5]" />
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Berita &amp; Perkembangan AI Terbaru
          </h3>
        </div>
        <span className="text-xs font-mono text-[#64748B]">
          {articles.length} Berita
        </span>
      </div>

      <div className="divide-y divide-[#1E293B] rounded-2xl bg-[#0F172A]/70 border border-[#1E293B] backdrop-blur-md overflow-hidden">
        {articles.map((article) => {
          const sourceName = article.source?.name || "Nexari Intelligence";

          return (
            <article
              key={article.id}
              className="p-5 sm:p-6 hover:bg-[#131E32]/70 transition-colors group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
            >
              {/* Thumbnail */}
              <div className="relative w-full sm:w-44 h-32 sm:h-28 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                <img
                  src={article.featuredImage || "/assets/article-ai.svg"}
                  alt={article.title}
                  onError={(e) => {
                    e.currentTarget.src = "/assets/default-cover.svg";
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-[#64748B]">
                  <span className="text-[#2DD4F5] font-bold">{sourceName}</span>
                  <span>•</span>
                  <span>{formatDate(article.publishedAt)}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readingTimeMinutes} mnt
                  </span>
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

              {/* Views */}
              <div className="hidden lg:flex flex-col items-end text-xs font-mono text-[#64748B] shrink-0 pl-2">
                <span className="flex items-center gap-1 text-[#F8FAFC]">
                  <Eye className="w-3 h-3 text-[#2DD4F5]" />
                  {article.views}
                </span>
                <span className="text-[10px] text-[#64748B]">views</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
