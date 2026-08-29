"use client";

import React from "react";
import Link from "next/link";
import { Article } from "@/types/content";
import { formatDate } from "@/lib/utils";
import { Clock } from "lucide-react";

interface AutomotiveFeaturedStoriesProps {
  articles: Article[];
}

export function AutomotiveFeaturedStories({ articles }: AutomotiveFeaturedStoriesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4F5] animate-pulse" />
          <span>Liputan Khusus &amp; Sorotan Editorial Otomotif</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => {
          const sourceName = article.source?.name || "Nexarin Automotive";

          return (
            <article
              key={article.id}
              className="group flex flex-col justify-between rounded-3xl p-5 sm:p-6 transition-all duration-300 backdrop-blur-xl border border-transparent hover:border-cyan-500/40"
              style={{
                background:
                  "linear-gradient(180deg, rgba(15, 23, 42, 0.85), rgba(11, 17, 32, 0.70)) padding-box, linear-gradient(120deg, rgba(255, 255, 255, 0.15), rgba(45, 212, 245, 0.20), rgba(255, 255, 255, 0.03)) border-box",
                border: "1px solid transparent"
              }}
            >
              <div>
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/[0.08]">
                  <img
                    src={article.featuredImage || "/assets/article-ai.svg"}
                    alt={article.title}
                    onError={(e) => {
                      e.currentTarget.src = "/assets/default-cover.svg";
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-[#0B1120]/85 text-[#2DD4F5] border border-[#2DD4F5]/30 backdrop-blur-md">
                      {article.tags?.[0] || "EV Innovation"}
                    </span>
                  </div>
                </div>

                <div className="pt-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#64748B]">
                    <span className="text-[#2DD4F5] font-bold">{sourceName}</span>
                    <span>•</span>
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>

                  <Link href={`/article/${article.slug}`}>
                    <h4 className="text-base font-bold text-white group-hover:text-[#2DD4F5] transition-colors leading-snug line-clamp-2">
                      {article.title}
                    </h4>
                  </Link>

                  <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs text-[#64748B] font-mono border-t border-white/[0.08] mt-4">
                <span className="truncate max-w-[130px] font-medium text-slate-400">{article.author.name}</span>
                <span className="flex items-center gap-1 text-cyan-400">
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
