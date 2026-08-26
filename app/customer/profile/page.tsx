"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { CustomerPageHeader } from "@/components/customer/CustomerPageHeader";
import { CustomerCard } from "@/components/customer/CustomerCard";
import { Button } from "@/components/ui/Button";
import { User, Mail, Building, ShieldCheck, Lock } from "lucide-react";

export default function CustomerProfilePage() {
  const { customer } = useAuth();
  const { showToast } = useNotification();

  const [name, setName] = useState(customer?.name || "Ahmad Fadillah");
  const [email] = useState(customer?.email || "ahmad.fadillah@example.com"); // read-only per PRD
  const [company, setCompany] = useState(customer?.company || "SMA Nusantara Digital");
  const [loading, setLoading] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      showToast({
        type: "success",
        title: "Profil Berhasil Diperbarui",
        message: "Perubahan informasi akun Anda telah disimpan."
      });
    }, 400);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Page Header */}
      <CustomerPageHeader
        title="Pengaturan Profil Akun (Account Profile)"
        description="Kelola informasi identitas akun, kontak penerimaan lisensi, dan institusi terdaftar."
        badge="Verified Customer"
      />

      <CustomerCard className="space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-white/[0.08]">
          <img
            src={customer?.avatar || "/assets/avatar-default.svg"}
            alt="Profile Avatar"
            onError={(e) => {
              e.currentTarget.src = "/assets/avatar-default.svg";
            }}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#18D6D0]"
          />
          <div>
            <h3 className="text-lg font-bold text-white">{customer?.name}</h3>
            <span className="text-xs text-[#6F8583] font-mono">Tipe Akun: Customer Resmi</span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#A8BCBA]">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-white/[0.08] bg-[#061214] text-[#F2FAF9] px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#18D6D0] focus:border-transparent placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#A8BCBA]">
                Alamat Email (Akun Lisensi)
              </label>
              <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Read-Only
              </span>
            </div>
            <input
              type="email"
              readOnly
              value={email}
              className="w-full rounded-xl border border-white/[0.08] bg-slate-900/50 text-[#6F8583] px-4 py-2.5 text-sm cursor-not-allowed"
            />
            <span className="text-[10px] text-slate-500 block">
              Email lisensi tidak dapat diubah langsung demi keamanan aktivasi software.
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#A8BCBA]">
              Organisasi / Institusi / Sekolah (Opsional)
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Contoh: SMA Nusantara Digital"
              className="w-full rounded-xl border border-white/[0.08] bg-[#061214] text-[#F2FAF9] px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#18D6D0] focus:border-transparent placeholder:text-slate-500"
            />
          </div>

          <Button type="submit" variant="primary" size="md" className="w-full font-bold mt-2" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan Perubahan Profil"}
          </Button>
        </form>
      </CustomerCard>
    </div>
  );
}
