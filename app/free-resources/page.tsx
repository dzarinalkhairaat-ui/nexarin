"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { FreeResource } from "@/types/resource";
import { useNotification } from "@/context/NotificationContext";
import { CyberWaveBackground } from "@/components/ui/cyber-wave-background";
import { Button } from "@/components/ui/Button";
import confetti from "canvas-confetti";
import {
  DownloadCloud,
  Search,
  X,
  Radio,
  Sparkles,
  FileCode,
  CheckCircle2,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Code2,
  FolderDown,
  FileSpreadsheet,
  Database,
  Palette,
  ExternalLink,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";

const RESOURCE_CATEGORIES = [
  { id: "all", label: "Semua Aset" },
  { id: "starter-kits", label: "Starter Kits & Templates" },
  { id: "ai-tools", label: "AI & Automation" },
  { id: "ui-kits", label: "UI Kits & Icons" },
  { id: "spreadsheet", label: "Spreadsheet & Office" },
  { id: "backend-db", label: "Backend & Database" }
];

export default function FreeResourcesPage() {
  const [resources, setResources] = useState<FreeResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const { showToast } = useNotification();

  useEffect(() => {
    fetch("/api/free-resources")
      .then((res) => res.json())
      .then((d) => {
        if (d.success && d.data) {
          setResources(d.data.filter((r: FreeResource) => r.isActive !== false));
        }
      })
      .catch((e) => console.error("Failed to load free resources", e))
      .finally(() => setLoading(false));
  }, []);

  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      const matchQuery =
        !searchQuery.trim() ||
        res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.format.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory =
        selectedCategory === "all" ||
        res.category === selectedCategory ||
        (!res.category && selectedCategory === "starter-kits");

      return matchQuery && matchCategory;
    });
  }, [resources, searchQuery, selectedCategory]);

  const handleDownload = async (resItem: FreeResource) => {
    setDownloadingId(resItem.id);

    try {
      // Fire celebration confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#2DD4F5", "#7CF2C3", "#FFFFFF", "#38BDF8"]
      });

      // Trigger download tracking
      fetch(`/api/free-resources/${resItem.id}/download`, { method: "POST" }).catch(() => {});

      // Optimistically increment download count
      setResources((prev) =>
        prev.map((r) => (r.id === resItem.id ? { ...r, downloadsCount: (r.downloadsCount || 0) + 1 } : r))
      );

      showToast({
        type: "success",
        title: "Download Dimulai!",
        message: `File ${resItem.title} (${resItem.fileSize}) berhasil disiapkan.`
      });

      // Simulate download trigger if URL exists
      if (resItem.downloadUrl && resItem.downloadUrl !== "#") {
        const link = document.createElement("a");
        link.href = resItem.downloadUrl;
        link.download = `${resItem.slug}.${resItem.format.toLowerCase().includes("xlsx") ? "xlsx" : "zip"}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setDownloadingId(null), 1000);
    }
  };

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#0B1120] text-[#F8FAFC] selection:bg-[#2DD4F5]/30 w-full max-w-full overflow-x-hidden">
      
      {/* 1. HERO SECTION WITH 3D CYBER WAVE BACKGROUND */}
      <section className="relative isolate overflow-hidden pt-12 sm:pt-20 pb-20 sm:pb-28 w-full max-w-full">
        {/* Pure 3D Geometric Wave Canvas */}
        <CyberWaveBackground className="z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 sm:gap-12">
            
            {/* Headline & Description */}
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
                Template, Starter Kits, &amp; Source Code Gratis
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-[#94A3B8] leading-relaxed max-w-2xl">
                Akselerasi proses pengembangan web, otomatisasi AI, dan produktivitas Anda dengan aset starter pack siap pakai berlisensi 100% gratis untuk personal dan komersial.
              </p>
            </div>

            {/* Quick Search Input */}
            <div className="w-full lg:w-96 relative group shrink-0">
              <div className="relative flex items-center rounded-2xl bg-[#0F172A]/85 border border-white/[0.12] hover:border-[#2DD4F5]/40 focus-within:border-[#2DD4F5] focus-within:bg-[#0B1120] focus-within:ring-1 focus-within:ring-[#2DD4F5]/30 transition-all duration-200 backdrop-blur-xl p-2 pl-4 pr-2">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <Search className="w-4 h-4 text-[#64748B] group-focus-within:text-[#2DD4F5] transition-colors shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari aset: 'Next.js', 'Python AI', 'Excel'..."
                    className="w-full bg-transparent text-xs sm:text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none"
                  />
                </div>
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Bersihkan pencarian"
                    className="p-1 text-[#64748B] hover:text-white rounded-lg hover:bg-white/[0.08] transition-colors text-[11px] font-mono shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="hidden sm:flex items-center gap-1 pl-2 shrink-0">
                    <kbd className="px-2 py-0.5 text-[10px] font-mono font-bold text-[#64748B] bg-white/[0.05] rounded-md border border-white/[0.08]">
                      ⌘K
                    </kbd>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. LIVE RESOURCES DISPATCH MARQUEE */}
      <div className="w-full bg-[#0F172A]/90 border-y border-white/[0.08] backdrop-blur-xl py-2.5 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center gap-4 overflow-hidden text-xs font-mono">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-[#7CF2C3] border border-emerald-500/30 text-[10px] font-bold uppercase shrink-0 z-10 shadow-md">
            <Radio className="w-3 h-3 text-[#7CF2C3] animate-pulse" />
            Live Resources Dispatch
          </span>

          <div className="relative flex-1 overflow-hidden">
            <div className="animate-marquee flex items-center gap-8 whitespace-nowrap text-slate-300 text-xs">
              <span className="flex items-center gap-2">
                <span>Next.js 16 SaaS App Router Boilerplate v2.4</span>
                <span className="text-emerald-400 font-bold">•</span>
              </span>
              <span className="flex items-center gap-2">
                <span>Autonomous Python AI Agents &amp; Tool Calling Harness</span>
                <span className="text-emerald-400 font-bold">•</span>
              </span>
              <span className="flex items-center gap-2">
                <span>Tailwind CSS v4 Modern UI Components Library</span>
                <span className="text-emerald-400 font-bold">•</span>
              </span>
              <span className="flex items-center gap-2">
                <span>Financial Modeling &amp; Startup Cashflow Spreadsheet</span>
                <span className="text-emerald-400 font-bold">•</span>
              </span>

              {/* Duplicate track for seamless infinite looping */}
              <span className="flex items-center gap-2">
                <span>Next.js 16 SaaS App Router Boilerplate v2.4</span>
                <span className="text-emerald-400 font-bold">•</span>
              </span>
              <span className="flex items-center gap-2">
                <span>Autonomous Python AI Agents &amp; Tool Calling Harness</span>
                <span className="text-emerald-400 font-bold">•</span>
              </span>
              <span className="flex items-center gap-2">
                <span>Tailwind CSS v4 Modern UI Components Library</span>
                <span className="text-emerald-400 font-bold">•</span>
              </span>
              <span className="flex items-center gap-2">
                <span>Financial Modeling &amp; Startup Cashflow Spreadsheet</span>
                <span className="text-emerald-400 font-bold">•</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CATEGORY NAVIGATION BAR */}
      <nav aria-label="Resource Category Navigation" className="border-b border-white/[0.08] bg-[#0B1120]/95 backdrop-blur-xl sticky top-16 sm:top-20 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none">
            {RESOURCE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all select-none",
                  selectedCategory === cat.id
                    ? "bg-[#7CF2C3]/15 text-[#7CF2C3] font-bold border border-[#7CF2C3]/40"
                    : "text-[#94A3B8] hover:text-white hover:bg-white/[0.04] border border-transparent"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* 4. MAIN CONTENT CATALOG */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
        
        {/* Catalog Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <FolderDown className="w-5 h-5 text-[#7CF2C3]" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              {searchQuery || selectedCategory !== "all" ? "Hasil Filter Aset Gratis" : "Katalog Aset & Starter Kits"}
            </h2>
          </div>
          <span className="text-xs font-mono text-[#64748B]">
            Menampilkan <span className="text-white font-bold">{filteredResources.length}</span> aset siap unduh
          </span>
        </div>

        {/* Resource Cards Grid */}
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResources.map((res) => {
              const coverImage =
                res.thumbnail ||
                "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop";

              return (
                <article
                  key={res.id}
                  className="group flex flex-col justify-between rounded-3xl p-6 sm:p-7 transition-all duration-300 backdrop-blur-xl border border-transparent hover:border-[#7CF2C3]/40 relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(15, 23, 42, 0.85), rgba(11, 17, 32, 0.70)) padding-box, linear-gradient(120deg, rgba(255, 255, 255, 0.15), rgba(124, 242, 195, 0.25), rgba(45, 212, 245, 0.10)) border-box",
                    border: "1px solid transparent"
                  }}
                >
                  <div className="space-y-4">
                    {/* Visual Cover Preview */}
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-white/[0.08]">
                      <img
                        src={coverImage}
                        alt={res.title}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000&auto=format&fit=crop";
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      
                      {/* Badge Top Left */}
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#7CF2C3]/20 text-[#7CF2C3] border border-[#7CF2C3]/40 backdrop-blur-md">
                          {res.badge}
                        </span>
                      </div>

                      {/* File size Bottom Right */}
                      <div className="absolute bottom-3 right-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold text-white bg-[#0B1120]/85 border border-white/20 backdrop-blur-md">
                          {res.fileSize}
                        </span>
                      </div>
                    </div>

                    {/* Metadata & Title */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B]">
                        <span className="text-[#2DD4F5] font-bold uppercase truncate max-w-[180px]">
                          {res.format}
                        </span>
                        <span className="text-[#7CF2C3] font-semibold">
                          {res.downloadsCount?.toLocaleString() || 0}x diunduh
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-[#7CF2C3] transition-colors leading-snug">
                        {res.title}
                      </h3>

                      <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-2">
                        {res.description}
                      </p>
                    </div>

                    {/* Features list if present */}
                    {res.features && res.features.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-white/[0.08]">
                        {res.features.slice(0, 3).map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-300 font-mono">
                            <Check className="w-3 h-3 text-[#7CF2C3] shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Download CTA Button */}
                  <div className="pt-5 mt-4 border-t border-white/[0.08]">
                    <Button
                      variant="mint"
                      size="md"
                      className="w-full font-extrabold text-xs text-slate-950 shadow-lg shadow-emerald-500/20"
                      onClick={() => handleDownload(res)}
                      disabled={downloadingId === res.id}
                    >
                      <DownloadCloud className="w-4 h-4 mr-2" />
                      {downloadingId === res.id ? "Menyiapkan File..." : "Unduh Gratis Sekarang"}
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 space-y-4 rounded-3xl bg-[#0F172A]/50 border border-white/[0.08] p-8">
            <DownloadCloud className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">Tidak Ada Aset yang Sesuai</h3>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto">
              Coba sesuaikan kata kunci pencarian atau pilih kategori lain.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
            >
              Reset Filter
            </Button>
          </div>
        )}

        {/* 5. TRUST GUARANTEE & LICENSE CARD */}
        <section
          className="p-8 sm:p-10 rounded-3xl backdrop-blur-xl border border-transparent space-y-8"
          style={{
            background:
              "linear-gradient(180deg, rgba(15, 23, 42, 0.90), rgba(11, 17, 32, 0.80)) padding-box, linear-gradient(120deg, rgba(255, 255, 255, 0.15), rgba(45, 212, 245, 0.20), rgba(124, 242, 195, 0.15)) border-box",
            border: "1px solid transparent"
          }}
        >
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">
              Standar Kualitas &amp; Lisensi Bebas Pakai
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Semua starter kit, template, dan skrip yang dirilis di portal Free Resources telah diuji integritas kodenya dan bebas digunakan tanpa batas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
              <ShieldCheck className="w-6 h-6 text-[#7CF2C3]" />
              <h3 className="text-sm font-bold text-white">Lisensi 100% Komersial</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Gunakan secara bebas untuk proyek pribadi, tugas kuliah, hingga proyek komersial klien tanpa royalti.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
              <Zap className="w-6 h-6 text-[#2DD4F5]" />
              <h3 className="text-sm font-bold text-white">Clean Code &amp; Modern</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Dibangun mengikuti standar best practice terkini (React 19, Next.js 16, TypeScript, dan Tailwind CSS v4).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
              <Code2 className="w-6 h-6 text-purple-400" />
              <h3 className="text-sm font-bold text-white">Dokumentasi Siap Eksekusi</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Setiap paket dilengkapi dengan panduan instalasi `README.md` dan langkah setup yang terstruktur.
              </p>
            </div>
          </div>
        </section>

      </main>

    </div>
  );
}
