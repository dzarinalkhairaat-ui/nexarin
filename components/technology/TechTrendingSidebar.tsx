"use client";

import React from "react";
import Link from "next/link";
import { Article } from "@/types/content";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface TechTrendingSidebarProps {
  articles: Article[];
}

export function TechTrendingSidebar({ articles }: TechTrendingSidebarProps) {
  const topTrending = articles.slice(0, 5);

  if (topTrending.length === 0) return null;

  return (
    <aside className="rounded-2xl bg-[#0F172A]/80 border border-[#1E293B] p-6 backdrop-blur-md space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#2DD4F5]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
            Trending di Technology
          </h3>
        </div>
        <span className="text-[11px] font-mono text-[#64748B]">Top 5</span>
      </div>

      <ol className="divide-y divide-[#1E293B]/70">
        {topTrending.map((article, idx) => {
          const rankNumber = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;
          const sourceName = article.source?.name || "Tech Architecture";

          return (
            <li key={article.id} className="py-3.5 first:pt-0 last:pb-0 group">
              <Link href={`/article/${article.slug}`} className="flex items-start gap-3.5">
                <span className={cn(
                  "font-mono font-extrabold text-lg leading-none shrink-0 pt-0.5",
                  idx === 0 ? "text-[#2DD4F5]" : idx === 1 ? "text-[#7CF2C3]" : "text-[#64748B]"
                )}>
                  {rankNumber}
                </span>

                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#64748B] block">
                    {sourceName} • {article.readingTimeMinutes}m
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-[#F8FAFC] group-hover:text-[#2DD4F5] transition-colors leading-snug line-clamp-2">
                    {article.title}
                  </h4>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
