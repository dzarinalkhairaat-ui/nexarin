"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useNotification } from "@/context/NotificationContext";
import { DownloadCloud, Sparkles, FileCode, CheckCircle2, Layers } from "lucide-react";
import { FreeResource } from "@/types/resource";

export default function FreeResourcesPage() {
  const [resources, setResources] = useState<FreeResource[]>([]);
  const [loading, setLoading] = useState(true);
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

  const handleDownload = async (resItem: FreeResource) => {
    try {
      fetch(`/api/free-resources/${resItem.id}/download`, { method: "POST" }).catch(() => {});
      setResources((prev) =>
        prev.map((r) => (r.id === resItem.id ? { ...r, downloadsCount: r.downloadsCount + 1 } : r))
      );
    } catch (e) {}

    showToast({
      type: "success",
      title: "Mengunduh Free Resource",
      message: `File ${resItem.title} (${resItem.fileSize}) berhasil disiapkan untuk diunduh!`
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7CF2C3]/15 text-[#7CF2C3] text-xs font-mono font-bold border border-[#7CF2C3]/30">
          <DownloadCloud className="w-3.5 h-3.5" />
          <span>100% Free Resources &amp; Assets</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Template, Starter Kits, &amp; Source Code Gratis
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-xl mx-auto">
          Akselerasi proses pengembangan web dan aplikasi Anda dengan aset berkualitas tinggi yang dibuat dan dikurasi langsung oleh tim Nexarin.
        </p>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {resources.map((res) => (
          <Card key={res.id} hoverable className="p-6 flex flex-col justify-between space-y-6 bg-white/[0.035] border-white/[0.08] hover:border-cyan-500/40 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <Badge variant="cyan" size="sm">
                  {res.badge}
                </Badge>
                <span className="text-[11px] font-mono text-[#64748B]">{res.fileSize}</span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                {res.title}
              </h3>

              <p className="text-xs text-[#64748B] leading-relaxed mb-4">
                {res.description}
              </p>

              <div className="space-y-1 py-2 border-t border-white/[0.08] text-[11px] text-[#64748B] font-mono">
                <div className="flex items-center justify-between">
                  <span>Format:</span>
                  <span className="font-semibold text-[#94A3B8]">{res.format}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Diunduh:</span>
                  <span className="font-semibold text-[#7CF2C3]">{res.downloadsCount.toLocaleString()}x</span>
                </div>
              </div>
            </div>

            <Button
              variant="mint"
              size="md"
              className="w-full font-extrabold text-xs text-slate-950"
              onClick={() => handleDownload(res)}
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
