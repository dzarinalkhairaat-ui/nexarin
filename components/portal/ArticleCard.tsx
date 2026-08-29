"use client";

import React from "react";
import Link from "next/link";
import { Article } from "@/types/content";
import { Card } from "@/components/ui/Card";
import { CategoryBadge } from "./CategoryBadge";
import { formatDate } from "@/lib/utils";
import { Clock, Eye, ArrowRight } from "lucide-react";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  if (featured) {
    return (
      <Card hoverable elevated className="group grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-full min-h-[320px] overflow-hidden bg-slate-900">
          <img
            src={article.featuredImage || "/assets/article-ai.svg"}
            alt={article.title}
            onError={(e) => {
              e.currentTarget.src = "/assets/default-cover.svg";
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent opacity-60 lg:opacity-0" />
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <CategoryBadge category={article.category} />
            {article.breaking && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider animate-pulse shadow-lg shadow-rose-500/30">
                Breaking
              </span>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs text-[#64748B] font-mono">
              <span>{formatDate(article.publishedAt)}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {article.readingTimeMinutes} mnt baca
              </span>
            </div>

            <Link href={`/article/${article.slug}`}>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white group-hover:text-[#2DD4F5] transition-colors leading-snug">
                {article.title}
              </h2>
            </Link>

            <p className="text-xs sm:text-sm text-[#94A3B8] line-clamp-3 leading-relaxed">
              {article.excerpt}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <img
                src={article.author.avatar || "/assets/avatar-default.svg"}
                alt={article.author.name}
                onError={(e) => {
                  e.currentTarget.src = "/assets/avatar-default.svg";
                }}
                className="w-8 h-8 rounded-full object-cover border border-[#2DD4F5]/40"
              />
              <div>
                <h4 className="text-xs font-bold text-[#F8FAFC]">
                  {article.author.name}
                </h4>
                <span className="text-[10px] text-[#64748B] font-mono">
                  {article.author.role}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-mono">
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>{article.views}</span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card hoverable className="group flex flex-col h-full overflow-hidden">
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={article.featuredImage || "/assets/article-ai.svg"}
          alt={article.title}
          onError={(e) => {
            e.currentTarget.src = "/assets/default-cover.svg";
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <CategoryBadge category={article.category} />
          {article.breaking && (
            <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-bold uppercase tracking-wider animate-pulse">
              Breaking
            </span>
          )}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-[#64748B] mb-2 font-mono">
            <span>{formatDate(article.publishedAt)}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              {article.readingTimeMinutes} mnt
            </span>
          </div>

          <Link href={`/article/${article.slug}`}>
            <h3 className="text-base font-bold text-white group-hover:text-[#2DD4F5] transition-colors leading-snug line-clamp-2 mb-2">
              {article.title}
            </h3>
          </Link>

          <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/[0.08] text-xs">
          <span className="text-[11px] font-semibold text-slate-400 truncate max-w-[150px]">
            {article.author.name}
          </span>
          <div className="flex items-center gap-1 text-[#64748B] font-mono text-[11px]">
            <Eye className="w-3 h-3" />
            <span>{article.views}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
