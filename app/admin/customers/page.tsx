"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useShop } from "@/context/ShopContext";
import { useNotification } from "@/context/NotificationContext";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminCard } from "@/components/admin/AdminCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Users,
  Mail,
  Package,
  ShieldCheck,
  ShieldAlert,
  Building,
  Search,
  Plus,
  Key,
  Calendar,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Phone,
  CreditCard,
  Copy,
  Check,
  Eye,
  FileText,
  AlertTriangle,
  Sparkles,
  Layers,
  ArrowUpRight,
  Filter
} from "lucide-react";

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  avatar?: string;
  status: "active" | "suspended";
  joinedAt: string;
  authProvider: "email" | "google";
  notes?: string;
}

const INITIAL_CUSTOMERS: CustomerRecord[] = [
  {
    id: "usr-cust-001",
    name: "Ahmad Fadillah",
    email: "ahmad.fadillah@example.com",
    phone: "+62 812-3456-7890",
    company: "SMA Nusantara Digital",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
    status: "active",
    joinedAt: "2026-06-10T00:00:00Z",
    authProvider: "email",
    notes: "Pelanggan institusi pendidikan dengan 2 lisensi software aktif."
  },
  {
    id: "usr-cust-002",
    name: "Budi Santoso",
    email: "budi.santoso@techcorp.co.id",
    phone: "+62 813-9876-5432",
    company: "PT Inovasi Solusi Digital",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop",
    status: "active",
    joinedAt: "2026-07-05T00:00:00Z",
    authProvider: "google",
    notes: "Pengembang full-stack software enterprise."
  },
  {
    id: "usr-cust-003",
    name: "Citra Lestari",
    email: "citra.lestari@edutech.ac.id",
    phone: "+62 856-4321-8765",
    company: "Universitas Bina Informatika",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    status: "suspended",
    joinedAt: "2026-08-01T00:00:00Z",
    authProvider: "email",
    notes: "Akun ditangguhkan sementara atas permintaan verifikasi identitas domain kampus."
  }
];

export default function AdminCustomersPage() {
  const { licenses, orders, products } = useShop();
  const { showToast } = useNotification();

  // Local state persisted in localStorage
  const [customerList, setCustomerList] = useState<CustomerRecord[]>(INITIAL_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all");

  // Modals state
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailActiveTab, setDetailActiveTab] = useState<"profile" | "licenses" | "orders">("profile");

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerRecord | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<CustomerRecord | null>(null);

  // Manual Grant License Modal
  const [isGrantLicenseModalOpen, setIsGrantLicenseModalOpen] = useState(false);
  const [grantProductId, setGrantProductId] = useState("");
  const [grantLicenseType, setGrantLicenseType] = useState<"lifetime" | "annual">("lifetime");

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Form inputs state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formCompany, setFormCompany] = useState("");
  const [formStatus, setFormStatus] = useState<"active" | "suspended">("active");
  const [formNotes, setFormNotes] = useState("");

  // Load customers directly from Database API & Supabase
  const [loading, setLoading] = useState(true);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/customers");
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setCustomerList(data.data);
        localStorage.setItem("nexarin_admin_crm_customers", JSON.stringify(data.data));
      } else {
        const saved = localStorage.getItem("nexarin_admin_crm_customers");
        if (saved) {
          setCustomerList(JSON.parse(saved));
        }
      }
    } catch (e) {
      console.error("Failed to fetch customers from API", e);
      try {
        const saved = localStorage.getItem("nexarin_admin_crm_customers");
        if (saved) {
          setCustomerList(JSON.parse(saved));
        }
      } catch (err) {}
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const saveCustomers = (newList: CustomerRecord[]) => {
    setCustomerList(newList);
    localStorage.setItem("nexarin_admin_crm_customers", JSON.stringify(newList));
  };

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    return customerList.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.company && c.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.phone && c.phone.includes(searchQuery));

      const matchesStatus = statusFilter === "all" || c.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customerList, searchQuery, statusFilter]);

  // CRM Analytics Overview
  const totalCustomers = customerList.length;
  const activeCustomersCount = customerList.filter((c) => c.status === "active").length;
  const suspendedCustomersCount = customerList.filter((c) => c.status === "suspended").length;
  const totalLicensesCount = licenses.length;
  const totalCRMRevenue = orders.reduce((acc, o) => acc + o.total, 0);

  // Handler: Toggle Status (Activate / Suspend) with Database Sync
  const handleToggleStatus = async (customer: CustomerRecord) => {
    const newStatus: "active" | "suspended" = customer.status === "active" ? "suspended" : "active";
    
    // Optimistic UI update
    const updated = customerList.map((c) => (c.id === customer.id ? { ...c, status: newStatus } : c));
    saveCustomers(updated);

    if (selectedCustomer?.id === customer.id) {
      setSelectedCustomer({ ...selectedCustomer, status: newStatus });
    }

    try {
      await fetch(`/api/customers/${customer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {
      console.error("Failed to update status in DB:", e);
    }

    showToast({
      type: newStatus === "active" ? "success" : "info",
      title: newStatus === "active" ? "Akun Diaktifkan" : "Akun Ditangguhkan",
      message: `Status akun ${customer.name} berhasil diubah menjadi ${newStatus === "active" ? "Aktif" : "Nonaktif/Suspended"} di database.`
    });
  };

  // Handler: Open Add / Edit Form Modal
  const handleOpenForm = (customer?: CustomerRecord) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormName(customer.name);
      setFormEmail(customer.email);
      setFormPhone(customer.phone || "");
      setFormCompany(customer.company || "");
      setFormStatus(customer.status);
      setFormNotes(customer.notes || "");
    } else {
      setEditingCustomer(null);
      setFormName("");
      setFormEmail("");
      setFormPhone("");
      setFormCompany("");
      setFormStatus("active");
      setFormNotes("");
    }
    setIsFormModalOpen(true);
  };

  // Handler: Save Form
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName || !formEmail) {
      showToast({
        type: "error",
        title: "Validasi Gagal",
        message: "Nama lengkap dan email pelanggan wajib diisi."
      });
      return;
    }

    if (editingCustomer) {
      // Edit existing with DB sync
      const updatedItem: CustomerRecord = {
        ...editingCustomer,
        name: formName,
        email: formEmail,
        phone: formPhone || undefined,
        company: formCompany || undefined,
        status: formStatus,
        notes: formNotes || undefined
      };

      const updated = customerList.map((c) => (c.id === editingCustomer.id ? updatedItem : c));
      saveCustomers(updated);

      fetch(`/api/customers/${editingCustomer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          phone: formPhone,
          company: formCompany,
          status: formStatus,
          notes: formNotes
        })
      }).catch((e) => console.error("Failed to update customer in DB:", e));

      showToast({
        type: "success",
        title: "Akun Customer Diperbarui",
        message: `Informasi data pelanggan ${formName} telah diperbarui di database.`
      });
      if (selectedCustomer?.id === editingCustomer.id) {
        setSelectedCustomer(updatedItem);
      }
    } else {
      // Create new with DB sync
      const tempId = `usr-cust-${Date.now().toString().slice(-4)}`;
      const newCust: CustomerRecord = {
        id: tempId,
        name: formName,
        email: formEmail,
        phone: formPhone || undefined,
        company: formCompany || undefined,
        status: formStatus,
        joinedAt: new Date().toISOString(),
        authProvider: "email",
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop`,
        notes: formNotes || undefined
      };
      saveCustomers([newCust, ...customerList]);

      fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          phone: formPhone,
          company: formCompany,
          status: formStatus,
          notes: formNotes
        })
      })
        .then((res) => res.json())
        .then((d) => {
          if (d.success && d.data) {
            setCustomerList((prev) => prev.map((c) => (c.id === tempId ? d.data : c)));
          }
        })
        .catch((e) => console.error("Failed to insert customer to DB:", e));

      showToast({
        type: "success",
        title: "Customer Baru Ditambahkan",
        message: `Akun pelanggan ${formName} telah dibuat di database.`
      });
    }

    setIsFormModalOpen(false);
  };

  // Handler: Delete Customer with Database Sync
  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return;

    const idToDelete = customerToDelete.id;
    const nameToDelete = customerToDelete.name;

    // Optimistic UI update
    const updated = customerList.filter((c) => c.id !== idToDelete);
    saveCustomers(updated);

    if (selectedCustomer?.id === idToDelete) {
      setIsDetailModalOpen(false);
      setSelectedCustomer(null);
    }

    try {
      await fetch(`/api/customers/${idToDelete}`, {
        method: "DELETE"
      });
    } catch (e) {
      console.error("Failed to delete customer from DB:", e);
    }

    showToast({
      type: "info",
      title: "Akun Customer Dihapus Permanen",
      message: `Data pelanggan ${nameToDelete} telah dihapus dari database & sistem autentikasi.`
    });

    setIsDeleteModalOpen(false);
    setCustomerToDelete(null);
  };

  // Copy License Key helper
  const handleCopyKey = (keyText: string) => {
    navigator.clipboard.writeText(keyText);
    setCopiedKey(keyText);
    showToast({
      type: "success",
      title: "Kunci Lisensi Disalin",
      message: "License key berhasil disalin ke clipboard."
    });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div suppressHydrationWarning className="space-y-8 max-w-7xl">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <AdminPageHeader
          title="Direktori Pengguna & Lisensi (Customer CRM)"
          description="Kelola profil lengkap pelanggan, hak akses lisensi software digital, status akun, dan histori transaksi."
          badge={`${totalCustomers} Total Pelanggan`}
        />

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={() => handleOpenForm()}
          className="font-bold text-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Tambah Pelanggan Baru
        </Button>
      </div>

      {/* 2. Top Stats Overview Cards */}
      <div suppressHydrationWarning className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0F172A]/80 border border-white/[0.08] backdrop-blur-md space-y-1.5">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-mono">
            <span>Total Pelanggan</span>
            <Users className="w-4 h-4 text-[#2DD4F5]" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-white">{totalCustomers}</p>
          <span className="text-[11px] text-[#7CF2C3] font-mono block">
            {activeCustomersCount} Aktif • {suspendedCustomersCount} Nonaktif
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#0F172A]/80 border border-white/[0.08] backdrop-blur-md space-y-1.5">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-mono">
            <span>Lisensi Diterbitkan</span>
            <Key className="w-4 h-4 text-[#7CF2C3]" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-white">{totalLicensesCount}</p>
          <span className="text-[11px] text-[#94A3B8] font-mono block">Lisensi Software Siap Pakai</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#0F172A]/80 border border-white/[0.08] backdrop-blur-md space-y-1.5">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-mono">
            <span>Customer Aktif</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-400">
            {Math.round((activeCustomersCount / (totalCustomers || 1)) * 100)}%
          </p>
          <span className="text-[11px] text-[#64748B] font-mono block">Tingkat Retensi CRM</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#0F172A]/80 border border-white/[0.08] backdrop-blur-md space-y-1.5">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-mono">
            <span>Total Transaksi CRM</span>
            <CreditCard className="w-4 h-4 text-[#2DD4F5]" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-[#2DD4F5]">
            Rp {totalCRMRevenue.toLocaleString("id-ID")}
          </p>
          <span className="text-[11px] text-[#94A3B8] font-mono block">{orders.length} Total Pesanan</span>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#0F172A]/90 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, email, no HP, institusi..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#0B1120] border border-white/[0.08] text-xs text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#2DD4F5] focus:ring-1 focus:ring-[#2DD4F5]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs text-[#64748B] font-mono flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
              statusFilter === "all"
                ? "bg-[#2DD4F5]/15 text-[#2DD4F5] font-bold border border-[#2DD4F5]/30"
                : "bg-white/[0.04] text-[#64748B] hover:text-white"
            }`}
          >
            Semua ({customerList.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("active")}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
              statusFilter === "active"
                ? "bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30"
                : "bg-white/[0.04] text-[#64748B] hover:text-white"
            }`}
          >
            Aktif ({activeCustomersCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("suspended")}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
              statusFilter === "suspended"
                ? "bg-rose-500/15 text-rose-400 font-bold border border-rose-500/30"
                : "bg-white/[0.04] text-[#64748B] hover:text-white"
            }`}
          >
            Nonaktif ({suspendedCustomersCount})
          </button>
        </div>
      </div>

      {/* 4. Customer Directory List / Cards */}
      <div suppressHydrationWarning className="space-y-4">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((cust) => {
            const customerLicenses = licenses.filter((l) => l.userId === cust.id);
            const customerOrders = orders.filter((o) => o.userId === cust.id);
            const totalSpent = customerOrders.reduce((acc, o) => acc + o.total, 0);

            return (
              <AdminCard
                key={cust.id}
                className="space-y-4 border hover:border-cyan-500/30 transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
                  {/* Avatar & Personal Info */}
                  <div className="flex items-start sm:items-center gap-3.5">
                    <img
                      src={cust.avatar || "/assets/avatar-default.svg"}
                      alt={cust.name}
                      onError={(e) => {
                        e.currentTarget.src = "/assets/avatar-default.svg";
                      }}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-white/[0.12] shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-white leading-snug">{cust.name}</h3>
                        <Badge
                          variant={cust.status === "active" ? "mint" : "danger"}
                          size="sm"
                          className="font-mono text-[10px]"
                        >
                          {cust.status === "active" ? "✓ Active Customer" : "✕ Nonaktif / Suspended"}
                        </Badge>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/[0.05] text-[#64748B] border border-white/[0.08]">
                          Login: {cust.authProvider}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B] font-mono">
                        <span className="flex items-center gap-1 text-[#94A3B8]">
                          <Mail className="w-3.5 h-3.5 text-cyan-400" />
                          {cust.email}
                        </span>
                        {cust.phone && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-emerald-400" />
                              {cust.phone}
                            </span>
                          </>
                        )}
                        {cust.company && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-[#94A3B8]">
                              <Building className="w-3.5 h-3.5 text-indigo-400" />
                              {cust.company}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Buttons Group */}
                  <div className="flex items-center gap-2 self-start lg:self-auto flex-wrap">
                    {/* View Details Button */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCustomer(cust);
                        setDetailActiveTab("profile");
                        setIsDetailModalOpen(true);
                      }}
                      className="text-xs font-bold border-white/[0.12] text-slate-300 hover:text-white"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                      Detail &amp; Lisensi
                    </Button>

                    {/* Toggle Active / Suspend Button */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(cust)}
                      className={`text-xs font-bold ${
                        cust.status === "active"
                          ? "border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                          : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                      }`}
                    >
                      {cust.status === "active" ? (
                        <>
                          <UserX className="w-3.5 h-3.5 mr-1.5" />
                          Nonaktifkan
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-3.5 h-3.5 mr-1.5" />
                          Aktifkan
                        </>
                      )}
                    </Button>

                    {/* Edit Button */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenForm(cust)}
                      className="text-xs font-bold border-white/[0.12] text-slate-300 hover:text-white p-2"
                      title="Edit Data Customer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Button>

                    {/* Delete Button */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCustomerToDelete(cust);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-xs font-bold border-rose-500/30 text-rose-400 hover:bg-rose-500/10 p-2"
                      title="Hapus Akun Customer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Metrics Summary Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-[#0B1120] border border-white/[0.08] flex items-center justify-between">
                    <span className="text-[#64748B]">Lisensi Software:</span>
                    <strong className="text-white font-bold">
                      {customerLicenses.length} Lisensi Terdaftar
                    </strong>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B1120] border border-white/[0.08] flex items-center justify-between">
                    <span className="text-[#64748B]">Total Transaksi:</span>
                    <strong className="text-[#2DD4F5] font-bold">
                      Rp {totalSpent.toLocaleString("id-ID")}
                    </strong>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B1120] border border-white/[0.08] flex items-center justify-between">
                    <span className="text-[#64748B]">Bergabung:</span>
                    <span className="text-[#94A3B8]">
                      {new Date(cust.joinedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </span>
                  </div>
                </div>

                {/* Quick Licenses Tags preview */}
                {customerLicenses.length > 0 && (
                  <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-[11px] font-mono text-[#64748B]">Kepemilikan Lisensi:</span>
                    {customerLicenses.map((lic) => (
                      <span
                        key={lic.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-medium"
                      >
                        <Package className="w-3 h-3 text-cyan-400" />
                        {lic.productName} ({lic.currentVersion})
                      </span>
                    ))}
                  </div>
                )}
              </AdminCard>
            );
          })
        ) : (
          <div className="p-12 rounded-3xl bg-[#0F172A]/70 border border-white/[0.08] text-center space-y-3">
            <Users className="w-10 h-10 text-[#64748B] mx-auto" />
            <h3 className="text-base font-bold text-white">Tidak Ada Data Customer</h3>
            <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
              Tidak ditemukan data pelanggan dengan filter atau kata kunci pencarian yang dimasukkan.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="text-xs mt-2 border-white/[0.12]"
            >
              Reset Filter
            </Button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. MODAL DETAIL LENGKAP CUSTOMER (Tabs: Profil, Lisensi, Orders)           */}
      {/* ========================================================================= */}
      {isDetailModalOpen && selectedCustomer && (
        <div suppressHydrationWarning className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-3xl max-h-[90vh] bg-[#0F172A] border border-white/[0.15] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3.5">
                <img
                  src={selectedCustomer.avatar || "/assets/avatar-default.svg"}
                  alt={selectedCustomer.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-400"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-bold text-white">{selectedCustomer.name}</h2>
                    <Badge
                      variant={selectedCustomer.status === "active" ? "mint" : "danger"}
                      size="sm"
                    >
                      {selectedCustomer.status === "active" ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#64748B] font-mono mt-0.5">
                    ID: {selectedCustomer.id} • Terdaftar sejak{" "}
                    {new Date(selectedCustomer.joinedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-white hover:bg-white/[0.08] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1">
              <button
                type="button"
                onClick={() => setDetailActiveTab("profile")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  detailActiveTab === "profile"
                    ? "bg-[#2DD4F5]/15 text-[#2DD4F5] border border-[#2DD4F5]/30"
                    : "text-[#94A3B8] hover:text-white"
                }`}
              >
                Profil Lengkap
              </button>
              <button
                type="button"
                onClick={() => setDetailActiveTab("licenses")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  detailActiveTab === "licenses"
                    ? "bg-[#2DD4F5]/15 text-[#2DD4F5] border border-[#2DD4F5]/30"
                    : "text-[#94A3B8] hover:text-white"
                }`}
              >
                <span>Lisensi &amp; Langganan</span>
                <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">
                  {licenses.filter((l) => l.userId === selectedCustomer.id).length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setDetailActiveTab("orders")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  detailActiveTab === "orders"
                    ? "bg-[#2DD4F5]/15 text-[#2DD4F5] border border-[#2DD4F5]/30"
                    : "text-[#94A3B8] hover:text-white"
                }`}
              >
                <span>Riwayat Pesanan</span>
                <span className="px-1.5 py-0.2 rounded bg-white/[0.08] text-[#94A3B8] text-[10px] font-mono">
                  {orders.filter((o) => o.userId === selectedCustomer.id).length}
                </span>
              </button>
            </div>

            {/* Modal Body - Tab Contents */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4">
              {/* TAB 1: PROFIL LENGKAP */}
              {detailActiveTab === "profile" && (
                <div suppressHydrationWarning className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-[#0B1120] border border-white/[0.08] space-y-1">
                      <span className="text-[11px] font-mono text-[#64748B]">Nama Lengkap:</span>
                      <p className="text-sm font-bold text-white">{selectedCustomer.name}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#0B1120] border border-white/[0.08] space-y-1">
                      <span className="text-[11px] font-mono text-[#64748B]">Email Akun:</span>
                      <p className="text-sm font-bold text-cyan-400 font-mono">{selectedCustomer.email}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#0B1120] border border-white/[0.08] space-y-1">
                      <span className="text-[11px] font-mono text-[#64748B]">Nomor WhatsApp / HP:</span>
                      <p className="text-sm font-bold text-white font-mono">
                        {selectedCustomer.phone || "Belum ditambahkan"}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#0B1120] border border-white/[0.08] space-y-1">
                      <span className="text-[11px] font-mono text-[#64748B]">Institusi / Organisasi:</span>
                      <p className="text-sm font-bold text-white">
                        {selectedCustomer.company || "Pribadi / Perorangan"}
                      </p>
                    </div>
                  </div>

                  {selectedCustomer.notes && (
                    <div className="p-4 rounded-2xl bg-[#0B1120] border border-white/[0.08] space-y-1">
                      <span className="text-[11px] font-mono text-[#64748B] flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" /> Catatan Internal Admin:
                      </span>
                      <p className="text-xs text-[#94A3B8] leading-relaxed">{selectedCustomer.notes}</p>
                    </div>
                  )}

                  {/* Status Toggle Quick Button in Profile Tab */}
                  <div className="p-4 rounded-2xl bg-[#131E32]/60 border border-white/[0.08] flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Status Otorisasi Akun</h4>
                      <p className="text-xs text-[#64748B]">
                        {selectedCustomer.status === "active"
                          ? "Pelanggan ini dapat login dan mengakses lisensi produk."
                          : "Akses pelanggan ditangguhkan sementara dari portal customer."}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(selectedCustomer)}
                      className={
                        selectedCustomer.status === "active"
                          ? "border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-xs font-bold"
                          : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs font-bold"
                      }
                    >
                      {selectedCustomer.status === "active" ? "Tangguhkan Akun" : "Aktifkan Akun"}
                    </Button>
                  </div>
                </div>
              )}

              {/* TAB 2: LISENSI & LANGGANAN */}
              {detailActiveTab === "licenses" && (
                <div suppressHydrationWarning className="space-y-4">
                  {licenses.filter((l) => l.userId === selectedCustomer.id).length > 0 ? (
                    licenses
                      .filter((l) => l.userId === selectedCustomer.id)
                      .map((lic) => (
                        <div
                          key={lic.id}
                          className="p-5 rounded-2xl bg-[#0B1120] border border-white/[0.08] space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/[0.06]">
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-cyan-400" />
                              <h4 className="text-sm font-bold text-white">{lic.productName}</h4>
                            </div>
                            <Badge variant={lic.status === "active" ? "mint" : "danger"} size="sm">
                              {lic.status === "active" ? "Lisensi Aktif" : "Dicabut / Expired"}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                            <div>
                              <span className="text-[#64748B] block text-[11px]">Tipe Lisensi:</span>
                              <span className="text-[#7CF2C3] font-bold uppercase">
                                {lic.licenseType} License
                              </span>
                            </div>
                            <div>
                              <span className="text-[#64748B] block text-[11px]">Versi Terdaftar:</span>
                              <span className="text-white">{lic.currentVersion}</span>
                            </div>
                          </div>

                          {/* License Key with Copy Button */}
                          <div className="space-y-1">
                            <span className="text-[11px] font-mono text-[#64748B]">Kode Kunci Lisensi:</span>
                            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-white/[0.08] text-xs font-mono text-cyan-300">
                              <span className="truncate pr-2">{lic.licenseKey}</span>
                              <button
                                type="button"
                                onClick={() => handleCopyKey(lic.licenseKey)}
                                className="p-1 rounded text-[#64748B] hover:text-white transition-colors shrink-0"
                                title="Salin Kunci Lisensi"
                              >
                                {copiedKey === lic.licenseKey ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="p-8 rounded-2xl bg-[#0B1120] border border-white/[0.08] text-center space-y-2">
                      <Key className="w-8 h-8 text-[#64748B] mx-auto" />
                      <h4 className="text-sm font-bold text-white">Belum Ada Lisensi Terbit</h4>
                      <p className="text-xs text-[#64748B]">
                        Pelanggan ini belum memiliki produk software atau lisensi yang terhubung.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: RIWAYAT PESANAN */}
              {detailActiveTab === "orders" && (
                <div suppressHydrationWarning className="space-y-4">
                  {orders.filter((o) => o.userId === selectedCustomer.id).length > 0 ? (
                    orders
                      .filter((o) => o.userId === selectedCustomer.id)
                      .map((ord) => (
                        <div
                          key={ord.id}
                          className="p-4 rounded-2xl bg-[#0B1120] border border-white/[0.08] space-y-2.5"
                        >
                          <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-white/[0.06]">
                            <span className="font-bold text-cyan-400">{ord.orderNumber}</span>
                            <span className="text-emerald-400 uppercase font-bold">✓ {ord.status}</span>
                          </div>

                          <div className="space-y-1">
                            {ord.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between text-xs text-white font-medium"
                              >
                                <span>{item.productName} ({item.version})</span>
                                <span className="font-mono text-[#7CF2C3]">
                                  Rp {item.price.toLocaleString("id-ID")}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-2 flex items-center justify-between text-xs font-mono text-[#64748B] border-t border-white/[0.06]">
                            <span>
                              {new Date(ord.createdAt).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric"
                              })}
                            </span>
                            <strong className="text-[#2DD4F5] text-sm">
                              Total: Rp {ord.total.toLocaleString("id-ID")}
                            </strong>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="p-8 rounded-2xl bg-[#0B1120] border border-white/[0.08] text-center space-y-2">
                      <CreditCard className="w-8 h-8 text-[#64748B] mx-auto" />
                      <h4 className="text-sm font-bold text-white">Belum Ada Transaksi</h4>
                      <p className="text-xs text-[#64748B]">
                        Pelanggan ini belum melakukan pembelian melalui sistem checkout.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  handleOpenForm(selectedCustomer);
                }}
                className="text-xs font-bold border-white/[0.12]"
              >
                <Edit className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                Edit Profil Pelanggan
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsDetailModalOpen(false)}
                className="text-xs font-bold"
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL FORM: TAMBAH / EDIT CUSTOMER                                    */}
      {/* ========================================================================= */}
      {isFormModalOpen && (
        <div suppressHydrationWarning className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-[#0F172A] border border-white/[0.15] rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#2DD4F5]" />
                <h3 className="text-base font-bold text-white">
                  {editingCustomer ? "Edit Data Pelanggan" : "Tambah Pelanggan Baru"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="text-[#64748B] hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#94A3B8]">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Ahmad Fadillah"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0B1120] text-[#F8FAFC] px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#94A3B8]">
                  Alamat Email *
                </label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="nama@perusahaan.com"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0B1120] text-[#F8FAFC] px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#94A3B8]">
                    No. WhatsApp / HP
                  </label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+62 812-3456-7890"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#0B1120] text-[#F8FAFC] px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#94A3B8]">
                    Status Akun
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as "active" | "suspended")}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#0B1120] text-[#F8FAFC] px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
                  >
                    <option value="active">Aktif (Active)</option>
                    <option value="suspended">Nonaktif (Suspended)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#94A3B8]">
                  Institusi / Organisasi (Opsional)
                </label>
                <input
                  type="text"
                  value={formCompany}
                  onChange={(e) => setFormCompany(e.target.value)}
                  placeholder="Contoh: SMA Nusantara Digital / PT Inovasi"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0B1120] text-[#F8FAFC] px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#94A3B8]">
                  Catatan Internal Admin (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Catatan khusus terkait pelanggan ini..."
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0B1120] text-[#F8FAFC] p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/[0.08]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFormModalOpen(false)}
                  className="text-xs border-white/[0.12]"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="text-xs font-bold"
                >
                  {editingCustomer ? "Simpan Perubahan" : "Daftarkan Pelanggan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODAL KONFIRMASI HAPUS CUSTOMER                                        */}
      {/* ========================================================================= */}
      {isDeleteModalOpen && customerToDelete && (
        <div suppressHydrationWarning className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#0F172A] border border-rose-500/30 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base font-bold text-white">Hapus Akun Pelanggan?</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Anda akan menghapus data pelanggan <strong className="text-white">{customerToDelete.name}</strong> ({customerToDelete.email}). Aksi ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300 font-mono">
              ⚠️ Perhatian: Hak akses download dan sesi customer terkait akan dinonaktifkan.
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/[0.08]">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-xs border-white/[0.12]"
              >
                Batal
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={handleDeleteCustomer}
                className="text-xs font-bold"
              >
                Ya, Hapus Customer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
