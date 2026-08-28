"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { CustomerPageHeader } from "@/components/customer/CustomerPageHeader";
import { CustomerCard } from "@/components/customer/CustomerCard";
import { Button } from "@/components/ui/Button";
import { User, Mail, Building, ShieldCheck, Lock, Link as LinkIcon, CheckCircle2, AlertTriangle, Key } from "lucide-react";

export default function CustomerProfilePage() {
  const { customer, isGoogleLinked, linkGoogleAccount, unlinkGoogleAccount } = useAuth();
  const { showToast } = useNotification();

  const [name, setName] = useState(customer?.name || "Ahmad Fadillah");
  const [email] = useState(customer?.email || "ahmad.fadillah@example.com");
  const [company, setCompany] = useState(customer?.company || "SMA Nusantara Digital");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Password update simulation modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

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

  const handleLinkGoogle = async () => {
    setGoogleLoading(true);
    try {
      const res = await linkGoogleAccount();
      if (res.success) {
        showToast({
          type: "success",
          title: "Akun Google Ditautkan",
          message: "Akun Google Anda kini terhubung ke akun Nexarin ini."
        });
      } else {
        showToast({
          type: "error",
          title: "Gagal Menautkan",
          message: res.error || "Gagal menautkan akun Google."
        });
      }
    } catch (err) {
      showToast({
        type: "error",
        title: "Kendala Sistem",
        message: "Terjadi kesalahan saat menghubungkan ke Google."
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleUnlinkGoogle = async () => {
    setGoogleLoading(true);
    try {
      const res = await unlinkGoogleAccount();
      if (res.success) {
        showToast({
          type: "info",
          title: "Tautan Google Diputuskan",
          message: "Akun Google telah dilepas dari akun Nexarin Anda."
        });
      } else {
        showToast({
          type: "error",
          title: "Gagal Memutuskan Tautan",
          message: res.error || "Gagal melepas akun Google."
        });
      }
    } catch (err) {
      showToast({
        type: "error",
        title: "Kendala Sistem",
        message: "Gagal memproses pelepasan akun."
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast({
        type: "error",
        title: "Password Terlalu Pendek",
        message: "Password baru harus minimal 6 karakter."
      });
      return;
    }

    setPasswordLoading(true);
    setTimeout(() => {
      setPasswordLoading(false);
      setShowPasswordModal(false);
      setOldPassword("");
      setNewPassword("");
      showToast({
        type: "success",
        title: "Password Diperbarui",
        message: "Password baru akun Anda telah berhasil disimpan."
      });
    }, 500);
  };

  return (
    <div suppressHydrationWarning className="space-y-8 max-w-3xl">
      {/* Page Header */}
      <CustomerPageHeader
        title="Pengaturan Profil Akun (Account Profile)"
        description="Kelola informasi identitas akun, kontak penerimaan lisensi, dan metode autentikasi tertaut."
        badge="Verified Customer"
      />

      {/* 1. Main Profile Information Card */}
      <CustomerCard className="space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-white/[0.08]">
          <img
            src={customer?.avatar || "/assets/avatar-default.svg"}
            alt="Profile Avatar"
            onError={(e) => {
              e.currentTarget.src = "/assets/avatar-default.svg";
            }}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#2DD4F5]"
          />
          <div>
            <h3 className="text-lg font-bold text-white">{customer?.name || "Customer Nexarin"}</h3>
            <span className="text-xs text-[#64748B] font-mono">Tipe Akun: Customer Resmi</span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-white/[0.08] bg-[#0B1120] text-[#F8FAFC] px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#2DD4F5] focus:border-transparent placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                Alamat Email Utama (Akun Lisensi)
              </label>
              <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Read-Only
              </span>
            </div>
            <input
              type="email"
              readOnly
              value={email}
              className="w-full rounded-xl border border-white/[0.08] bg-slate-900/50 text-[#64748B] px-4 py-2.5 text-sm cursor-not-allowed"
            />
            <span className="text-[10px] text-slate-500 block">
              Email lisensi tidak dapat diubah langsung demi keamanan aktivasi software.
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Organisasi / Institusi / Sekolah (Opsional)
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Contoh: PT Inovasi Digital / SMA Negeri 1"
              className="w-full rounded-xl border border-white/[0.08] bg-[#0B1120] text-[#F8FAFC] px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#2DD4F5] focus:border-transparent placeholder:text-slate-500"
            />
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={loading}
              className="font-bold text-xs"
            >
              {loading ? "Menyimpan..." : "Simpan Perubahan Profil"}
            </Button>
          </div>
        </form>
      </CustomerCard>

      {/* 2. Connected Accounts & Security Card */}
      <CustomerCard className="space-y-6">
        <div className="pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-[#2DD4F5]" />
            <h3 className="text-base font-bold text-white">
              Metode Login &amp; Akun Tertaut (Connected Identities)
            </h3>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
            Tautkan akun Google untuk memudahkan login 1-klik tanpa perlu mengetikkan password berulang kali.
          </p>
        </div>

        <div className="space-y-4 divide-y divide-white/[0.08]">
          {/* Email & Password Provider Item */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 first:pt-0">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-[#2DD4F5] shrink-0 mt-0.5">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">Email &amp; Password</h4>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-[#7CF2C3] border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" /> Terverifikasi
                  </span>
                </div>
                <p className="text-xs text-[#64748B] font-mono">{email}</p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowPasswordModal(true)}
              className="text-xs font-bold border-white/[0.12] text-slate-300 hover:text-white shrink-0"
            >
              <Key className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
              Ubah Password
            </Button>
          </div>

          {/* Google OAuth Provider Item */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.12] flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">Akun Google</h4>
                  {isGoogleLinked ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-[#2DD4F5] border border-cyan-500/20">
                      <CheckCircle2 className="w-3 h-3" /> Tertaut
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono text-[#64748B] bg-white/[0.04] border border-white/[0.08]">
                      Belum Tertaut
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#94A3B8]">
                  {isGoogleLinked
                    ? customer?.googleEmail || customer?.email
                    : "Tautkan akun Google untuk mengaktifkan login instan."}
                </p>
              </div>
            </div>

            {isGoogleLinked ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={googleLoading}
                onClick={handleUnlinkGoogle}
                className="text-xs font-bold border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/50 shrink-0"
              >
                {googleLoading ? "Memproses..." : "Putuskan Tautan"}
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                size="sm"
                disabled={googleLoading}
                onClick={handleLinkGoogle}
                className="text-xs font-bold shrink-0"
              >
                {googleLoading ? "Menghubungkan..." : "+ Tautkan Akun Google"}
              </Button>
            )}
          </div>
        </div>
      </CustomerCard>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#0F172A] border border-white/[0.12] rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-[#2DD4F5]" />
                <h3 className="text-base font-bold text-white">Ubah Password Akun</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="text-[#64748B] hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#94A3B8]">
                  Password Lama
                </label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0B1120] text-[#F8FAFC] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#94A3B8]">
                  Password Baru (min. 6 karakter)
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0B1120] text-[#F8FAFC] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/[0.08]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPasswordModal(false)}
                  className="text-xs border-white/[0.12]"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={passwordLoading}
                  className="text-xs font-bold"
                >
                  {passwordLoading ? "Menyimpan..." : "Update Password"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
