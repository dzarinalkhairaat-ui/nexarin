"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminCard } from "@/components/admin/AdminCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { formatCurrency } from "@/lib/utils";
import {
  ShoppingBag,
  Plus,
  Sparkles,
  Layers,
  History,
  Check,
  ExternalLink,
  Tag,
  Star,
  ChevronRight
} from "lucide-react";

export default function AdminShopPage() {
  const { products, createProduct } = useShop();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [tagline, setTagline] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [price, setPrice] = useState("299000");
  const [category, setCategory] = useState<"applications" | "templates" | "starter-kits">("applications");
  const [currentVersion, setCurrentVersion] = useState("v1.0.0");
  const [trialEnabled, setTrialEnabled] = useState(true);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createProduct({
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
      tagline,
      shortDescription,
      description: shortDescription,
      price: parseInt(price, 10) || 199000,
      currency: "IDR",
      category,
      licenseType: "lifetime",
      trialEnabled,
      trialDurationDays: trialEnabled ? 3 : 0,
      status: "published",
      currentVersion,
      featuredImage: "/assets/product-absensi.svg",
      galleryImages: ["/assets/product-absensi.svg", "/assets/product-dashboard.svg"],
      features: ["Full Source Code Included", "Supabase Ready", "Responsive UI"],
      requirements: {
        platform: ["Web Browser"],
        runtime: "Node.js 18+",
        minimumSpecs: "512MB RAM"
      },
      faqs: [{ question: "Apakah ada garansi update?", answer: "Ya, lisensi lifetime mencakup update." }]
    });

    setCreateModalOpen(false);
    setName("");
    setSlug("");
    setTagline("");
    setShortDescription("");
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <AdminPageHeader
        title="Katalog Produk Digital & Versioning"
        description="Kelola aplikasi digital siap pakai, kunci lisensi, dan publikasikan pembaruan rilis versi baru untuk pelanggan."
        badge={`${products.length} Produk Aktif`}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            className="font-bold text-xs"
          >
            <Plus className="w-4 h-4 mr-1" />
            Tambah Produk Baru
          </Button>
        }
      />

      {/* Products List Grid */}
      <div className="space-y-4">
        {products.map((prod) => (
          <AdminCard key={prod.id} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {prod.category.toUpperCase()}
                  </span>
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Versi Saat Ini: {prod.currentVersion}
                  </span>
                  {prod.trialEnabled && (
                    <Badge variant="mint" size="sm">
                      Trial 3 Hari Aktif
                    </Badge>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white">
                  {prod.name}
                </h3>
              </div>

              <div className="sm:text-right">
                <span className="text-lg font-black text-[#2DD4F5] font-mono block">
                  {formatCurrency(prod.price, prod.currency)}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {prod.salesCount} Penjualan • ★ {prod.rating}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {prod.shortDescription}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1E293B]">
              <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                <span>Total Rilis: <strong className="text-white">{prod.versions.length} Versi</strong></span>
                <span>•</span>
                <span>Lisensi: <strong className="text-white">{prod.licenseType.toUpperCase()}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/admin/shop/${prod.id}/versions`}>
                  <Button variant="mint" size="sm" className="font-bold text-xs text-slate-950">
                    <History className="w-3.5 h-3.5 mr-1.5" />
                    Kelola Versi &amp; Rilis Baru →
                  </Button>
                </Link>

                <Link href={`/shop/${prod.slug}`} target="_blank">
                  <Button variant="outline" size="sm" className="text-xs border-slate-700 text-slate-300 hover:text-white">
                    Lihat di Toko <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>

      {/* Create Product Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Tambah Produk Digital Baru"
        description="Masukkan data produk aplikasi atau template untuk dimasukkan ke katalog toko"
        maxWidth="lg"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Nama Produk Digital
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Nexarin Sistem Absensi Sekolah"
              className="w-full rounded-xl border border-[#1E293B] bg-[#080D1A] text-slate-100 px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Slug URL (Opsional)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="nexarin-sistem-absensi"
                className="w-full rounded-xl border border-[#1E293B] bg-[#080D1A] text-slate-100 font-mono px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full rounded-xl border border-[#1E293B] bg-[#080D1A] text-slate-100 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
              >
                <option value="applications">Applications (Sistem Aplikasi)</option>
                <option value="templates">Templates (Next.js / Tailwind)</option>
                <option value="starter-kits">Starter Kits &amp; Boilerplate</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Harga (IDR)
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="349000"
                className="w-full rounded-xl border border-[#1E293B] bg-[#080D1A] text-slate-100 font-mono px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Nomor Versi Awal
              </label>
              <input
                type="text"
                required
                value={currentVersion}
                onChange={(e) => setCurrentVersion(e.target.value)}
                placeholder="v1.0.0"
                className="w-full rounded-xl border border-[#1E293B] bg-[#080D1A] text-slate-100 font-mono px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Deskripsi Singkat Produk
            </label>
            <textarea
              rows={3}
              required
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Jelaskan fitur unggulan dan stack teknologi produk ini..."
              className="w-full rounded-xl border border-[#1E293B] bg-[#080D1A] text-slate-100 px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="trialCheck"
              checked={trialEnabled}
              onChange={(e) => setTrialEnabled(e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-cyan-500"
            />
            <label htmlFor="trialCheck" className="text-xs text-slate-300 cursor-pointer">
              Aktifkan Akses Trial 3 Hari untuk Customer Terdaftar
            </label>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-[#1E293B]">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setCreateModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" className="flex-1 font-bold">
              Simpan &amp; Tambahkan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
