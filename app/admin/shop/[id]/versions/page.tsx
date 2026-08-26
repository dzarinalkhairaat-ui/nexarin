"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminCard } from "@/components/admin/AdminCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmModal } from "@/components/feedback/ConfirmModal";
import { formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  Sparkles,
  History,
  CheckCircle2,
  UploadCloud,
  Bell,
  DownloadCloud,
  FileCode
} from "lucide-react";

export default function AdminProductVersionsPage() {
  const params = useParams();
  const productId = params.id as string;
  const router = useRouter();
  const { products, publishNewVersion } = useShop();

  const product = products.find((p) => p.id === productId);

  const [versionNumber, setVersionNumber] = useState("");
  const [fileSize, setFileSize] = useState("18.5 MB");
  const [releaseNotesStr, setReleaseNotesStr] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center space-y-4">
        <AdminCard className="p-8 space-y-4">
          <h3 className="text-lg font-bold text-white">Produk Tidak Ditemukan</h3>
          <p className="text-xs text-[#64748B]">ID produk tidak valid atau belum terdaftar pada katalog.</p>
          <Link href="/admin/shop">
            <Button variant="primary" size="sm">Kembali ke Katalog</Button>
          </Link>
        </AdminCard>
      </div>
    );
  }

  const handlePublish = () => {
    if (!versionNumber) return;

    publishNewVersion(product.id, {
      version: versionNumber.startsWith("v") ? versionNumber : `v${versionNumber}`,
      fileSize: fileSize || "18.0 MB",
      downloadFileName: `${product.slug}-${versionNumber}.zip`,
      releaseNotes: releaseNotesStr.split("\n").map((n) => n.trim()).filter(Boolean)
    });

    setConfirmOpen(false);
    setVersionNumber("");
    setReleaseNotesStr("");
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Back Link */}
      <div>
        <Link
          href="/admin/shop"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Produk</span>
        </Link>
      </div>

      {/* Page Header */}
      <AdminPageHeader
        title={`Rilis Versi: ${product.name}`}
        description={`Kelola changelog, publikasikan pembaruan software, dan kirimkan update otomatis ke seluruh pemegang lisensi.`}
        badge={`Versi Aktif: ${product.currentVersion}`}
      />

      {/* Publish New Version Form */}
      <AdminCard className="space-y-5 border-cyan-500/30">
        <div className="flex items-center gap-2 pb-2 border-b border-white/[0.08]">
          <Sparkles className="w-5 h-5 text-[#2DD4F5]" />
          <h3 className="text-base font-bold text-white">
            Formulir Rilis Versi Baru (Product Update Pipeline)
          </h3>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1120] border border-cyan-500/20 text-xs text-[#94A3B8] flex items-start gap-3">
          <Bell className="w-5 h-5 text-[#7CF2C3] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Sesuai arsitektur PRD: Ketika versi baru dirilis, sistem secara otomatis akan memicu notifikasi pembaruan ke seluruh akun customer yang memiliki lisensi produk ini, dan file ZIP baru akan langsung tersedia di menu <strong>Available Updates</strong> pada Customer Dashboard mereka.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Nomor Versi Baru (SemVer)
            </label>
            <input
              type="text"
              required
              value={versionNumber}
              onChange={(e) => setVersionNumber(e.target.value)}
              placeholder="Contoh: v2.2.0"
              className="w-full rounded-xl border border-white/[0.08] bg-[#0B1120] text-[#F8FAFC] font-mono px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Ukuran File Paket Build
            </label>
            <input
              type="text"
              required
              value={fileSize}
              onChange={(e) => setFileSize(e.target.value)}
              placeholder="Contoh: 19.2 MB"
              className="w-full rounded-xl border border-white/[0.08] bg-[#0B1120] text-[#F8FAFC] font-mono px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
            Catatan Rilis / Changelog (1 baris per poin fitur)
          </label>
          <textarea
            rows={4}
            required
            value={releaseNotesStr}
            onChange={(e) => setReleaseNotesStr(e.target.value)}
            placeholder="Integrasi AI Scanner QR Real-time&#10;Peningkatan performa database Supabase&#10;Perbaikan bug export PDF"
            className="w-full rounded-xl border border-white/[0.08] bg-[#0B1120] text-[#F8FAFC] font-mono px-4 py-2.5 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <Button
            variant="mint"
            size="md"
            className="font-black text-xs text-slate-950"
            disabled={!versionNumber}
            onClick={() => setConfirmOpen(true)}
          >
            <UploadCloud className="w-4 h-4 mr-2" />
            Rilis &amp; Notifikasikan Versi Baru
          </Button>
        </div>
      </AdminCard>

      {/* Version History Table / List */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-white/[0.08]">
          <History className="w-4 h-4 text-cyan-400" />
          <h3 className="text-base font-bold text-white tracking-tight">
            Riwayat Rilis Versi Sebelumnya ({product.versions.length} Rilis)
          </h3>
        </div>

        <div className="space-y-3">
          {product.versions.map((v) => (
            <AdminCard key={v.id} className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <Badge variant={v.isLatest ? "mint" : "slate"} size="sm">
                    {v.version} {v.isLatest ? "— VERSI AKTIF" : ""}
                  </Badge>
                  <span className="text-xs text-[#64748B] font-mono">
                    Rilis: {formatDate(v.releaseDate)}
                  </span>
                  <span className="text-xs text-[#64748B] font-mono">
                    ? {v.fileSize}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-cyan-400">
                  {v.downloadFileName}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono text-[#64748B] font-bold uppercase block">
                  Changelog:
                </span>
                <ul className="space-y-1 pl-4 list-disc text-xs text-[#94A3B8]">
                  {v.releaseNotes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>
            </AdminCard>
          ))}
        </div>
      </section>

      {/* Confirm Publish Modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handlePublish}
        title={`Rilis Versi ${versionNumber}?`}
        description={`Versi ini akan ditetapkan sebagai rilis terbaru untuk "${product.name}", dan seluruh customer yang memegang lisensi aktif akan menerima notifikasi update otomatis.`}
        confirmText="Ya, Rilis Sekarang"
        variant="primary"
      />
    </div>
  );
}
