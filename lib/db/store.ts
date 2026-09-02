import { TUTORIAL_COURSES, TUTORIAL_CATEGORIES } from "@/data/mockTutorials";
import { TutorialCourse, TutorialCategory } from "@/types/tutorial";
import { INITIAL_ARTICLES } from "@/data/mockArticles";
import { INITIAL_PRODUCTS } from "@/data/mockProducts";
import { INITIAL_DRAFTS } from "@/data/mockDrafts";
import { INITIAL_AFFILIATES } from "@/data/mockAffiliates";
import { Article, GeminiSparkDraft } from "@/types/content";
import { Product, ProductVersion, Order, License, DownloadRecord } from "@/types/product";
import { AffiliateLink } from "@/types/affiliate";
import { Notification, AuditLog } from "@/types/user";
import { FreeResource } from "@/types/resource";

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
  public tutorialCourses: TutorialCourse[] = [...TUTORIAL_COURSES];
  public tutorialCategories: TutorialCategory[] = [...TUTORIAL_CATEGORIES];
  public users = [
    {
      id: "usr-adm-001",
      name: "Rins (Administrator)",
      email: "nexarintech@administrator.com",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      role: "admin" as const,
      joinedAt: "2026-01-01T00:00:00Z",
      company: "Nexarin Tech HQ"
    },
    {
      id: "usr-cust-001",
      name: "Ahmad Fadillah",
      email: "ahmad.fadillah@example.com",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
      role: "customer" as const,
      joinedAt: "2026-06-10T00:00:00Z",
      company: "SMA Nusantara Digital"
    }
  ];
  public articles: Article[] = [...INITIAL_ARTICLES];
  public products: Product[] = [...INITIAL_PRODUCTS];
  public drafts: GeminiSparkDraft[] = [];
  public affiliates: AffiliateLink[] = [...INITIAL_AFFILIATES];
  public freeResources: FreeResource[] = [
    {
      id: "res-1",
      title: "Nexarin UI Components Starter Pack",
      slug: "nexarin-ui-components-starter-pack",
      description: "20+ Komponen UI siap pakai berbasis Tailwind CSS & React (Button, Modal, Toast, Card, Dropdown) dengan Nexarin Design System tokens.",
      fileSize: "2.4 MB",
      format: "ZIP / Source Code",
      badge: "Featured Kit",
      downloadUrl: "/downloads/nexarin-ui-starter.zip",
      downloadsCount: 1420,
      isActive: true,
      createdAt: "2026-08-01T00:00:00Z"
    },
    {
      id: "res-2",
      title: "HTML5 & Tailwind Landing Page Template",
      slug: "html5-tailwind-landing-page-template",
      description: "Template landing page responsif super cepat dengan dark mode, integrasi SEO tags, dan skor Lighthouse 100.",
      fileSize: "1.8 MB",
      format: "HTML5 / CSS3",
      badge: "Popular",
      downloadUrl: "/downloads/html5-landing-template.zip",
      downloadsCount: 980,
      isActive: true,
      createdAt: "2026-08-05T00:00:00Z"
    },
    {
      id: "res-3",
      title: "Supabase Schema & RLS Policy Starter Snippets",
      slug: "supabase-schema-rls-policy-starter-snippets",
      description: "Kumpulan script SQL PostgreSQL siap pakai untuk setup auth, profiles, roles, dan download token security.",
      fileSize: "450 KB",
      format: "SQL / Markdown",
      badge: "Database",
      downloadUrl: "/downloads/supabase-schema-snippets.zip",
      downloadsCount: 630,
      isActive: true,
      createdAt: "2026-08-10T00:00:00Z"
    }
  ];
  
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
