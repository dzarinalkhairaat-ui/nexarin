"use client";

import React, { useState } from "react";
import { useShop } from "@/context/ShopContext";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminCard } from "@/components/admin/AdminCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { ConfirmModal } from "@/components/feedback/ConfirmModal";
import { Share2, Plus, ExternalLink, Trash2, MousePointerClick, TrendingUp } from "lucide-react";
import { MarketplaceType } from "@/types/affiliate";

export default function AdminAffiliatePage() {
  const { affiliates, createAffiliateLink, deleteAffiliateLink } = useShop();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [productName, setProductName] = useState("");
  const [marketplace, setMarketplace] = useState<MarketplaceType>("Shopee");
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [category, setCategory] = useState("Gadget / Peripherals");
  const [priceEstimate, setPriceEstimate] = useState("Rp 1.250.000");
  const [badgeLabel, setBadgeLabel] = useState("Pilihan Editor");

  const totalClicks = affiliates.reduce((acc, a) => acc + a.clicksCount, 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createAffiliateLink({
      name: productName,
      productName,
      marketplace,
      affiliateUrl,
      category,
      priceEstimate,
      badgeLabel,
      imageUrl: "/assets/affiliate-keyboard.svg",
      isActive: true,
      linkedArticleIds: []
    });

    setCreateModalOpen(false);
    setProductName("");
    setAffiliateUrl("");
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteAffiliateLink(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <AdminPageHeader
        title="Manajemen Tautan Afiliasi & Rekomendasi"
        description="Kelola tautan marketplace (Shopee, Tokopedia, TikTok Shop), pantau metrik klik, dan sematkan rekomendasi ke artikel."
        badge={`${affiliates.length} Link Aktif ? ${totalClicks} Klik`}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            className="font-bold text-xs"
          >
            <Plus className="w-4 h-4 mr-1" />
            Tambah Tautan Afiliasi
          </Button>
        }
      />

      {/* Affiliates List */}
      <div className="space-y-4">
        {affiliates.map((aff) => (
          <AdminCard key={aff.id} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    {aff.marketplace}
                  </span>
                  {aff.badgeLabel && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-[#7CF2C3] border border-emerald-500/20">
                      {aff.badgeLabel}
                    </span>
                  )}
                  <span className="text-xs text-slate-400 font-mono">{aff.category}</span>
                </div>
                <h3 className="text-base font-bold text-white">
                  {aff.productName}
                </h3>
              </div>

              <div className="flex items-center gap-4">
                <div className="sm:text-right">
                  <span className="text-xs text-slate-400 font-mono block">Total Klik Terlacak</span>
                  <span className="text-lg font-black text-cyan-400 font-mono">
                    {aff.clicksCount} klik
                  </span>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setDeleteId(aff.id)}
                  className="text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-mono">Estimasi Harga:</span>
                <strong className="text-slate-200 font-mono">{aff.priceEstimate}</strong>
              </div>

              <a
                href={aff.affiliateUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[#2DD4F5] hover:text-cyan-300 font-mono font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800"
              >
                <span>Uji Tautan Eksternal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </AdminCard>
        ))}
      </div>

      {/* Create Affiliate Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Tambah Tautan Afiliasi Baru"
        description="Masukkan URL affiliate resmi dari program affiliate Shopee / Tokopedia / TikTok Shop"
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Nama Produk Rekomendasi
            </label>
            <input
              type="text"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Contoh: Keychron K2 V2 Wireless Mechanical Keyboard"
              className="w-full rounded-xl border border-[#1E293B] bg-[#080D1A] text-slate-100 px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Platform Marketplace
            </label>
            <select
              value={marketplace}
              onChange={(e) => setMarketplace(e.target.value as MarketplaceType)}
              className="w-full rounded-xl border border-[#1E293B] bg-[#080D1A] text-slate-100 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
            >
              <option value="Shopee">Shopee</option>
              <option value="Tokopedia">Tokopedia</option>
              <option value="TikTok Shop">TikTok Shop</option>
              <option value="Lazada">Lazada</option>
              <option value="Direct">Direct Partner</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Affiliate URL (Tautan Tracking)
            </label>
            <input
              type="url"
              required
              value={affiliateUrl}
              onChange={(e) => setAffiliateUrl(e.target.value)}
              placeholder="https://shopee.co.id/product-link?ref=nexarin"
              className="w-full rounded-xl border border-[#1E293B] bg-[#080D1A] text-slate-100 font-mono px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Estimasi Harga
              </label>
              <input
                type="text"
                value={priceEstimate}
                onChange={(e) => setPriceEstimate(e.target.value)}
                placeholder="Rp 1.250.000"
                className="w-full rounded-xl border border-[#1E293B] bg-[#080D1A] text-slate-100 font-mono px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Label Badge
              </label>
              <input
                type="text"
                value={badgeLabel}
                onChange={(e) => setBadgeLabel(e.target.value)}
                placeholder="Pilihan Editor"
                className="w-full rounded-xl border border-[#1E293B] bg-[#080D1A] text-slate-100 px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-[#1E293B]">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setCreateModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" className="flex-1 font-bold">
              Simpan Link
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Tautan Afiliasi?"
        description="Tautan rekomendasi ini akan dihapus dari sistem dan tidak akan disematkan lagi pada artikel."
        confirmText="Ya, Hapus"
        variant="danger"
      />
    </div>
  );
}
