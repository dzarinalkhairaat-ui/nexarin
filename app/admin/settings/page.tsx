"use client";

import React, { useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminCard } from "@/components/admin/AdminCard";
import { Button } from "@/components/ui/Button";
import { useNotification } from "@/context/NotificationContext";
import { Settings, ShieldCheck, Database, Key, Globe, CreditCard, Save } from "lucide-react";

export default function AdminSettingsPage() {
  const { showToast } = useNotification();
  const [siteName, setSiteName] = useState("Nexarin Tech Hub");
  const [brand, setBrand] = useState("Nexarin by Rins");
  const [mayarKey, setMayarKey] = useState("myr_live_demo_9898234892");
  const [supabaseUrl, setSupabaseUrl] = useState("https://nexarin-supabase.co");
  const [loading, setLoading] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast({
        type: "success",
        title: "Konfigurasi Berhasil Disimpan",
        message: "Pengaturan platform Nexarin Tech Hub telah diperbarui."
      });
    }, 400);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Page Header */}
      <AdminPageHeader
        title="Konfigurasi & Pengaturan Platform"
        description="Konfigurasi identitas sistem, parameter integrasi payment gateway Mayar, dan konektivitas Supabase Production."
        badge="System Config"
      />

      <AdminCard className="space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Platform Identity */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider flex items-center gap-1.5 pb-2 border-b border-[#1E293B]">
              <Globe className="w-3.5 h-3.5" />
              Identitas &amp; Metadata Portal
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Nama Situs (Site Title)
                </label>
                <input
                  type="text"
                  required
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full rounded-xl border border-[#1E293B] bg-[#080D1A] text-slate-100 px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Identitas Brand Author
                </label>
                <input
                  type="text"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full rounded-xl border border-[#1E293B] bg-[#080D1A] text-slate-100 px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Integrations */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase text-[#7CF2C3] font-bold tracking-wider flex items-center gap-1.5 pb-2 border-b border-[#1E293B]">
              <CreditCard className="w-3.5 h-3.5" />
              Integrasi Payment Gateway &amp; Database
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Mayar Payment Secret Key (Simulasi)
                </label>
                <input
                  type="password"
                  required
                  value={mayarKey}
                  onChange={(e) => setMayarKey(e.target.value)}
                  className="w-full rounded-xl border border-[#1E293B] bg-[#080D1A] text-cyan-300 font-mono px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Supabase URL Production
                </label>
                <input
                  type="url"
                  required
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full rounded-xl border border-[#1E293B] bg-[#080D1A] text-slate-100 font-mono px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1E293B] flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="font-extrabold text-xs shadow-md"
              disabled={loading}
            >
              {loading ? (
                "Menyimpan..."
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Simpan Semua Perubahan
                </span>
              )}
            </Button>
          </div>
        </form>
      </AdminCard>
    </div>
  );
}
