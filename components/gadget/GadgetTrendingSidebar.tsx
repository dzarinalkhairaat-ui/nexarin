"use client";

import React from "react";
import Link from "next/link";
import { Article } from "@/types/content";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface GadgetTrendingSidebarProps {
  articles: Article[];
}

export function GadgetTrendingSidebar({ articles }: GadgetTrendingSidebarProps) {
  const topTrending = articles.slice(0, 5);

  if (topTrending.length === 0) return null;

  return (
    <aside
      className="rounded-3xl p-6 sm:p-7 backdrop-blur-xl border border-transparent space-y-5"
      style={{
        background:
          "linear-gradient(180deg, rgba(15, 23, 42, 0.85), rgba(11, 17, 32, 0.70)) padding-box, linear-gradient(120deg, rgba(255, 255, 255, 0.15), rgba(45, 212, 245, 0.20), rgba(255, 255, 255, 0.03)) border-box",
        border: "1px solid transparent"
      }}
    >
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#2DD4F5]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
            Trending di Gadget
          </h3>
        </div>
        <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
          Top 5
        </span>
      </div>

      <ol className="divide-y divide-white/[0.06]">
        {topTrending.map((article, idx) => {
          const rankNumber = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;
          const sourceName = article.source?.name || "Nexarin Gadget";

          return (
            <li key={article.id} className="py-3.5 first:pt-0 last:pb-0 group">
              <Link href={`/article/${article.slug}`} className="flex items-start gap-3.5">
                <span
                  className={cn(
                    "font-mono font-extrabold text-lg leading-none shrink-0 pt-0.5",
                    idx === 0
                      ? "text-[#2DD4F5]"
                      : idx === 1
                      ? "text-[#7CF2C3]"
                      : idx === 2
                      ? "text-purple-400"
                      : "text-[#64748B]"
                  )}
                >
                  {rankNumber}
                </span>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                    <span className="font-bold uppercase text-slate-400 truncate max-w-[150px]">{sourceName}</span>
                    <span>{article.readingTimeMinutes}m</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-[#2DD4F5] transition-colors leading-snug line-clamp-2">
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
