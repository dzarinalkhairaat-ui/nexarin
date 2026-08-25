import { INITIAL_ARTICLES } from "@/data/mockArticles";
import { INITIAL_PRODUCTS } from "@/data/mockProducts";
import { INITIAL_DRAFTS } from "@/data/mockDrafts";
import { INITIAL_AFFILIATES } from "@/data/mockAffiliates";
import { Article, GeminiSparkDraft } from "@/types/content";
import { Product, ProductVersion, Order, License, DownloadRecord } from "@/types/product";
import { AffiliateLink } from "@/types/affiliate";
import { Notification, AuditLog } from "@/types/user";

export interface DBTrial {
  id: string;
  productId: string;
  productName: string;
  userEmail: string;
  userName: string;
  institution?: string;
  trialKey: string;
  expiresAt: string;
  status: "active" | "expired" | "converted";
  createdAt: string;
}

class MemoryDataStore {
  public articles: Article[] = [...INITIAL_ARTICLES];
  public products: Product[] = [...INITIAL_PRODUCTS];
  public drafts: GeminiSparkDraft[] = [...INITIAL_DRAFTS];
  public affiliates: AffiliateLink[] = [...INITIAL_AFFILIATES];
  
  public orders: Order[] = [
    {
      id: "ord-1724560001",
      orderNumber: "NEX-2026-9041",
      userId: "usr-cust-001",
      customerName: "Ahmad Fadillah",
      customerEmail: "ahmad.fadillah@example.com",
      items: [
        {
          productId: "prod-001",
          productName: "Nexarin Sistem Absensi Sekolah Digital",
          productSlug: "nexarin-sistem-absensi-sekolah-digital",
          version: "v2.1.0",
          price: 349000,
          licenseType: "lifetime"
        }
      ],
      subtotal: 349000,
      discount: 0,
      total: 349000,
      currency: "IDR",
      paymentProvider: "Manual",
      paymentReference: "TRX-QRIS-904128",
      status: "paid",
      paidAt: "2026-06-15T10:30:00Z",
      createdAt: "2026-06-15T10:28:00Z"
    },
    {
      id: "ord-1724560002",
      orderNumber: "NEX-2026-9042",
      userId: "usr-cust-001",
      customerName: "Ahmad Fadillah",
      customerEmail: "ahmad.fadillah@example.com",
      items: [
        {
          productId: "prod-002",
          productName: "Nexarin Admin Dashboard Pro Kit",
          productSlug: "nexarin-admin-dashboard-pro-kit",
          version: "v1.4.0",
          price: 249000,
          licenseType: "lifetime"
        }
      ],
      subtotal: 249000,
      discount: 0,
      total: 249000,
      currency: "IDR",
      paymentProvider: "Mayar",
      paymentReference: "TRX-MYR-883192",
      status: "paid",
      paidAt: "2026-07-20T14:15:00Z",
      createdAt: "2026-07-20T14:10:00Z"
    }
  ];

  public licenses: License[] = [
    {
      id: "lic-001",
      licenseKey: "NEX-LIFETIME-ABS-98234-KEY",
      userId: "usr-cust-001",
      productId: "prod-001",
      productName: "Nexarin Sistem Absensi Sekolah Digital",
      productSlug: "nexarin-sistem-absensi-sekolah-digital",
      orderId: "ord-1724560001",
      licenseType: "lifetime",
      status: "active",
      currentVersion: "v2.1.0",
      ownedVersion: "v2.1.0",
      issuedAt: "2026-06-15T10:30:00Z"
    },
    {
      id: "lic-002",
      licenseKey: "NEX-LIFETIME-DSH-77412-KEY",
      userId: "usr-cust-001",
      productId: "prod-002",
      productName: "Nexarin Admin Dashboard Pro Kit",
      productSlug: "nexarin-admin-dashboard-pro-kit",
      orderId: "ord-1724560002",
      licenseType: "lifetime",
      status: "active",
      currentVersion: "v1.4.0",
      ownedVersion: "v1.4.0",
      issuedAt: "2026-07-20T14:15:00Z"
    }
  ];

  public trials: DBTrial[] = [
    {
      id: "trl-001",
      productId: "prod-003",
      productName: "Sistem Manajemen Guru & Murid Terpadu",
      userEmail: "ahmad.fadillah@example.com",
      userName: "Ahmad Fadillah",
      institution: "SMA Nusantara Digital",
      trialKey: "TRL-3DAYS-SCH-4491",
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
      createdAt: new Date().toISOString()
    }
  ];

  public notifications: Notification[] = [
    {
      id: "notif-001",
      userId: "usr-cust-001",
      type: "product_update",
      title: "Pembaruan v2.1.0 Tersedia",
      message: "Nexarin Sistem Absensi Sekolah Digital mendapatkan pembaruan performa export XLSX dan perbaikan scanner QR.",
      read: false,
      link: "/customer/updates",
      createdAt: "2026-08-20T08:00:00Z"
    },
    {
      id: "notif-002",
      userId: "usr-cust-001",
      type: "order_success",
      title: "Pesanan Berhasil Diverifikasi",
      message: "Pembelian lisensi lifetime untuk Nexarin Admin Dashboard Pro Kit telah aktif.",
      read: true,
      link: "/customer/orders",
      createdAt: "2026-07-20T14:15:00Z"
    }
  ];

  public auditLogs: AuditLog[] = [
    {
      id: "aud-001",
      adminId: "usr-adm-001",
      adminName: "Rins",
      action: "publish_article",
      entityType: "article",
      entityId: "art-001",
      entityName: "Claude 3.7 Sonnet & Hybrid Reasoning",
      details: "Mempublikasikan artikel: Claude 3.7 Sonnet & Hybrid Reasoning",
      timestamp: "2026-08-25T14:20:00Z"
    },
    {
      id: "aud-002",
      adminId: "usr-adm-001",
      adminName: "Rins",
      action: "update_product",
      entityType: "product",
      entityId: "prod-001",
      entityName: "Nexarin Sistem Absensi Sekolah Digital",
      details: "Merilis pembaruan v2.1.0 untuk Nexarin Sistem Absensi Sekolah Digital",
      timestamp: "2026-08-20T08:00:00Z"
    }
  ];
}

declare global {
  var __nexarin_store: MemoryDataStore | undefined;
}

export const db = globalThis.__nexarin_store || new MemoryDataStore();
if (process.env.NODE_ENV !== "production") {
  globalThis.__nexarin_store = db;
}
