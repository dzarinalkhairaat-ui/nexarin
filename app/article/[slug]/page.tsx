"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useContent } from "@/context/ContentContext";

export default function LegacyArticleRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { getArticleBySlug } = useContent();

  useEffect(() => {
    const article = getArticleBySlug(slug);
    const categorySlug = article?.category?.slug || "technology";
    router.replace(`/tech-info/${categorySlug}/article/${slug}`);
  }, [slug, getArticleBySlug, router]);

  return (
    <div className="min-h-screen bg-[#0B1120] text-white flex items-center justify-center">
      <div className="text-center space-y-2">
        <div className="w-6 h-6 border-2 border-[#2DD4F5] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono text-slate-400">Memuat artikel di Tech Info...</p>
      </div>
    </div>
  );
}
