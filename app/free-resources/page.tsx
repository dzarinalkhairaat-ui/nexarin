"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useNotification } from "@/context/NotificationContext";
import { DownloadCloud, Sparkles } from "lucide-react";

export default function FreeResourcesPage() {
  const { showToast } = useNotification();

  const resources = [
    {
      id: "res-1",
      title: "Nexarin UI Components Starter Pack",
      description: "20+ Komponen UI siap pakai berbasis Tailwind CSS & React (Button, Modal, Toast, Card, Dropdown) dengan Nexarin Design System tokens.",
      fileSize: "2.4 MB",
      format: "ZIP / Source Code",
      badge: "Featured Kit",
      downloadsCount: 1420
    },
    {
      id: "res-2",
      title: "HTML5 & Tailwind Landing Page Template",
      description: "Template landing page responsif super cepat dengan dark mode, integrasi SEO tags, dan skor Lighthouse 100.",
      fileSize: "1.8 MB",
      format: "HTML5 / CSS3",
      badge: "Popular",
      downloadsCount: 980
    },
    {
      id: "res-3",
      title: "Supabase Schema & RLS Policy Starter Snippets",
      description: "Kumpulan script SQL PostgreSQL siap pakai untuk setup auth, profiles, roles, dan download token security.",
      fileSize: "450 KB",
      format: "SQL / Markdown",
      badge: "Database",
      downloadsCount: 630
    }
  ];

  const handleDownload = (resTitle: string) => {
    showToast({
      type: "success",
      title: "Mengunduh Free Resource",
      message: `File ${resTitle} berhasil disiapkan untuk diunduh!`
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7CF2C3]/15 text-[#7CF2C3] text-xs font-mono font-bold border border-[#7CF2C3]/30">
          <DownloadCloud className="w-3.5 h-3.5" />
          <span>100% Free Resources & Assets</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Template, Starter Kits, & Source Code Gratis
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
          Akselerasi proses pengembangan web dan aplikasi Anda dengan aset berkualitas tinggi yang dibuat dan dikurasi langsung oleh tim Nexarin.
        </p>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {resources.map((res) => (
          <Card key={res.id} hoverable className="p-6 flex flex-col justify-between space-y-6 bg-[#131E32] border-[#1E293B]">
            <div>
              <div className="flex items-center justify-between mb-3">
                <Badge variant="cyan" size="sm">
                  {res.badge}
                </Badge>
                <span className="text-[11px] font-mono text-slate-400">{res.fileSize}</span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                {res.title}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {res.description}
              </p>

              <div className="space-y-1 py-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
                <div className="flex items-center justify-between">
                  <span>Format:</span>
                  <span className="font-semibold text-slate-300">{res.format}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Diunduh:</span>
                  <span className="font-semibold text-[#7CF2C3]">{res.downloadsCount}x</span>
                </div>
              </div>
            </div>

            <Button
              variant="mint"
              size="md"
              className="w-full font-bold text-slate-950"
              onClick={() => handleDownload(res.title)}
            >
              <DownloadCloud className="w-4 h-4 mr-2" />
              Unduh Gratis Sekarang
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
