"use client";

import React from "react";
import Link from "next/link";
import { Article } from "@/types/content";
import { formatDate } from "@/lib/utils";
import { Clock, Eye, Newspaper } from "lucide-react";

interface AutomotiveLatestNewsProps {
  articles: Article[];
}

export function AutomotiveLatestNews({ articles }: AutomotiveLatestNewsProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <Newspaper className="w-5 h-5 text-[#2DD4F5]" />
          <h3 className="text-lg font-bold text-white tracking-tight">
            Berita &amp; Perkembangan Otomotif Terbaru
          </h3>
        </div>
        <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
          {articles.length} Liputan
        </span>
      </div>

      <div className="divide-y divide-white/[0.08] rounded-3xl bg-[#0F172A]/75 border border-white/[0.08] backdrop-blur-xl overflow-hidden">
        {articles.map((article) => {
          const sourceName = article.source?.name || "Nexarin Automotive";

          return (
            <article
              key={article.id}
              className="p-5 sm:p-6 hover:bg-white/[0.03] transition-colors group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
            >
              {/* Thumbnail */}
              <div className="relative w-full sm:w-44 h-32 sm:h-28 rounded-2xl overflow-hidden bg-slate-900 border border-white/[0.08] shrink-0">
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
                    <Clock className="w-3 h-3 text-cyan-400" />
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
                  <Eye className="w-3.5 h-3.5 text-[#2DD4F5]" />
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
