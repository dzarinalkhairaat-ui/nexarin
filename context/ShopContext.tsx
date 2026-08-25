"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, ProductVersion, Order, License, DownloadRecord } from "@/types/product";
import { AffiliateLink } from "@/types/affiliate";
import { AuditLog } from "@/types/user";
import { INITIAL_PRODUCTS } from "@/data/mockProducts";
import { INITIAL_AFFILIATES } from "@/data/mockAffiliates";
import { generateRandomKey, generateToken } from "@/lib/utils";
import { useNotification } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";

interface ShopContextType {
  products: Product[];
  orders: Order[];
  licenses: License[];
  downloads: DownloadRecord[];
  affiliates: AffiliateLink[];
  auditLogs: AuditLog[];
  getProductBySlug: (slug: string) => Product | undefined;
  startTrial: (productId: string) => Promise<{ success: boolean; license?: License; message: string }>;
  checkoutOrder: (productId: string, customerInfo: { name: string; email: string }) => Promise<{ success: boolean; order?: Order; license?: License }>;
  publishNewVersion: (productId: string, newVersionData: { version: string; releaseNotes: string[]; fileSize: string; downloadFileName: string }) => void;
  downloadProduct: (productId: string, version: string) => { downloadToken: string; downloadUrl: string; fileName: string };
  getUserLicenses: (userId: string) => License[];
  getAvailableUpdatesForUser: (userId: string) => Array<{ product: Product; license: License; latestVersion: ProductVersion; hasUpdate: boolean }>;
  trackAffiliateClick: (affiliateId: string) => void;
  createAffiliateLink: (data: Omit<AffiliateLink, "id" | "clicksCount" | "createdAt">) => void;
  updateAffiliateLink: (id: string, data: Partial<AffiliateLink>) => void;
  deleteAffiliateLink: (id: string) => void;
  createProduct: (product: Omit<Product, "id" | "rating" | "ratingCount" | "salesCount" | "createdAt" | "updatedAt" | "versions">) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
}

const INITIAL_LICENSES: License[] = [
  {
    id: "lic-001",
    licenseKey: "NXRN-AB78-99X2-LK44-SEK1",
    userId: "usr-cust-001",
    productId: "prod-absensi-sekolah",
    productName: "Nexarin Sistem Absensi Sekolah Digital",
    productSlug: "nexarin-sistem-absensi-sekolah",
    orderId: "ord-88120",
    licenseType: "lifetime",
    status: "active",
    currentVersion: "v2.1.0",
    ownedVersion: "v2.0.0",
    issuedAt: "2026-06-10T14:30:00Z"
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: "ord-88120",
    orderNumber: "ORD-NXRN-2026-88120",
    userId: "usr-cust-001",
    customerName: "Ahmad Fadillah",
    customerEmail: "ahmad.fadillah@example.com",
    items: [
      {
        productId: "prod-absensi-sekolah",
        productName: "Nexarin Sistem Absensi Sekolah Digital",
        productSlug: "nexarin-sistem-absensi-sekolah",
        version: "v2.0.0",
        price: 349000,
        licenseType: "lifetime"
      }
    ],
    subtotal: 349000,
    discount: 0,
    total: 349000,
    currency: "IDR",
    status: "paid",
    paymentProvider: "Mayar",
    paymentReference: "MYR-20260610-881209",
    paidAt: "2026-06-10T14:30:00Z",
    createdAt: "2026-06-10T14:25:00Z"
  }
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: "aud-001",
    adminId: "usr-adm-001",
    adminName: "Rins",
    action: "publish_article",
    entityType: "article",
    entityId: "art-001",
    entityName: "Claude 3.7 Sonnet & Hybrid Reasoning",
    details: "Mempublikasikan artikel editorial.",
    timestamp: "2026-08-25T14:20:00Z"
  },
  {
    id: "aud-002",
    adminId: "usr-adm-001",
    adminName: "Rins",
    action: "publish_version",
    entityType: "version",
    entityId: "v-001",
    entityName: "Nexarin Sistem Absensi Sekolah Digital v2.1.0",
    details: "Merilis versi pembaruan v2.1.0.",
    timestamp: "2026-08-20T08:00:00Z"
  }
];

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [licenses, setLicenses] = useState<License[]>(INITIAL_LICENSES);
  const [downloads, setDownloads] = useState<DownloadRecord[]>([]);
  const [affiliates, setAffiliates] = useState<AffiliateLink[]>(INITIAL_AFFILIATES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  const { showToast, addNotification } = useNotification();
  const { user } = useAuth();

  useEffect(() => {
    // Initial fetch from backend APIs
    fetch("/api/products")
      .then((res) => res.json())
      .then((d) => {
        if (d.success && d.data) setProducts(d.data);
      })
      .catch(() => {});

    fetch("/api/affiliates")
      .then((res) => res.json())
      .then((d) => {
        if (d.success && d.data) setAffiliates(d.data);
      })
      .catch(() => {});

    fetch("/api/audit-logs")
      .then((res) => res.json())
      .then((d) => {
        if (d.success && d.data) setAuditLogs(d.data);
      })
      .catch(() => {});
  }, []);

  const saveProducts = (items: Product[]) => setProducts(items);
  const saveLicenses = (items: License[]) => setLicenses(items);
  const saveOrders = (items: Order[]) => setOrders(items);
  const saveDownloads = (items: DownloadRecord[]) => setDownloads(items);
  const saveAffiliates = (items: AffiliateLink[]) => setAffiliates(items);

  const logAudit = (
    action: AuditLog["action"],
    entityType: AuditLog["entityType"],
    entityId: string,
    entityName: string,
    details: string
  ) => {
    const newLog: AuditLog = {
      id: "aud-" + Date.now(),
      adminId: user?.id || "usr-adm-001",
      adminName: user?.name || "Rins",
      action,
      entityType,
      entityId,
      entityName,
      details,
      timestamp: new Date().toISOString()
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const getProductBySlug = (slug: string): Product | undefined => {
    return products.find((p) => p.slug === slug);
  };

  const startTrial = async (productId: string): Promise<{ success: boolean; license?: License; message: string }> => {
    const product = products.find((p) => p.id === productId);
    if (!product) {
      return { success: false, message: "Produk tidak ditemukan." };
    }

    const currentUserId = user?.id || "usr-cust-001";
    const existingActiveTrial = licenses.find(
      (l) => l.productId === productId && l.userId === currentUserId && l.licenseType === "trial" && l.status === "active"
    );

    if (existingActiveTrial) {
      return {
        success: false,
        message: `Anda sudah memiliki trial aktif untuk ${product.name} hingga ${new Date(existingActiveTrial.expiresAt || "").toLocaleDateString("id-ID")}.`
      };
    }

    const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
    const trialKey = generateRandomKey("TRL");

    const newTrialLicense: License = {
      id: "lic-" + Date.now(),
      licenseKey: trialKey,
      userId: currentUserId,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      orderId: "trial-demo-req",
      licenseType: "trial",
      status: "active",
      currentVersion: product.currentVersion,
      ownedVersion: product.currentVersion,
      issuedAt: new Date().toISOString(),
      expiresAt
    };

    saveLicenses([newTrialLicense, ...licenses]);
    logAudit("activate_trial", "license", newTrialLicense.id, product.name, `Aktivasi demo trial 3 hari untuk user ${currentUserId}.`);

    addNotification({
      userId: currentUserId,
      type: "trial_started",
      title: "Trial 3 Hari Berhasil Diaktifkan!",
      message: `Anda dapat mengakses dan menguji coba ${product.name} secara penuh selama 3 hari.`,
      link: "/customer/products"
    });

    return {
      success: true,
      license: newTrialLicense,
      message: `Akses demo trial 3 hari untuk ${product.name} berhasil diaktifkan!`
    };
  };

  const checkoutOrder = async (
    productId: string,
    customerInfo: { name: string; email: string }
  ): Promise<{ success: boolean; order?: Order; license?: License }> => {
    const product = products.find((p) => p.id === productId);
    if (!product) return { success: false };

    const currentUserId = user?.id || "usr-cust-001";
    const orderNumber = `ORD-NXRN-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      id: "ord-" + Date.now(),
      orderNumber,
      userId: currentUserId,
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      items: [
        {
          productId: product.id,
          productName: product.name,
          productSlug: product.slug,
          version: product.currentVersion,
          price: product.price,
          licenseType: "lifetime"
        }
      ],
      subtotal: product.price,
      discount: 0,
      total: product.price,
      currency: "IDR",
      status: "paid",
      paymentProvider: "Mayar",
      paymentReference: `MYR-${Date.now()}`,
      paidAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    const licenseKey = generateRandomKey("NXRN");

    const newLicense: License = {
      id: "lic-" + Date.now(),
      licenseKey,
      userId: currentUserId,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      orderId: newOrder.id,
      licenseType: "lifetime",
      status: "active",
      currentVersion: product.currentVersion,
      ownedVersion: product.currentVersion,
      issuedAt: new Date().toISOString()
    };

    const updatedProducts = products.map((p) =>
      p.id === productId ? { ...p, salesCount: p.salesCount + 1 } : p
    );
    saveProducts(updatedProducts);

    const filteredLicenses = licenses.filter((l) => !(l.productId === productId && l.userId === currentUserId));
    saveLicenses([newLicense, ...filteredLicenses]);
    saveOrders([newOrder, ...orders]);

    logAudit("manual_order", "order", newOrder.id, product.name, `Pembelian berhasil sebesar Rp ${product.price.toLocaleString("id-ID")} via Mayar.`);

    addNotification({
      userId: currentUserId,
      type: "order_success",
      title: "Pembelian Berhasil!",
      message: `Lisensi Lifetime ${product.name} telah diterbitkan dan siap diunduh.`,
      link: "/customer/products"
    });

    return {
      success: true,
      order: newOrder,
      license: newLicense
    };
  };

  const publishNewVersion = (
    productId: string,
    versionData: { version: string; releaseNotes: string[]; fileSize: string; downloadFileName: string }
  ) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const newVersion: ProductVersion = {
      id: "v-" + Date.now(),
      productId,
      version: versionData.version,
      releaseDate: new Date().toISOString().split("T")[0],
      fileSize: versionData.fileSize || "15.0 MB",
      downloadFileName: versionData.downloadFileName || `${product.slug}-${versionData.version}.zip`,
      releaseNotes: versionData.releaseNotes,
      isLatest: true
    };

    const updatedVersions = product.versions.map((v) => ({ ...v, isLatest: false }));
    const updatedProduct: Product = {
      ...product,
      currentVersion: versionData.version,
      versions: [newVersion, ...updatedVersions],
      updatedAt: new Date().toISOString()
    };

    saveProducts(products.map((p) => (p.id === productId ? updatedProduct : p)));

    const updatedLicenses = licenses.map((lic) => {
      if (lic.productId === productId) {
        return { ...lic, currentVersion: versionData.version };
      }
      return lic;
    });
    saveLicenses(updatedLicenses);

    logAudit("publish_version", "version", newVersion.id, `${product.name} ${versionData.version}`, `Versi baru dipublikasikan: ${versionData.version}.`);

    const customersWithProduct = licenses.filter((l) => l.productId === productId && l.status === "active");
    customersWithProduct.forEach((lic) => {
      addNotification({
        userId: lic.userId,
        type: "product_update",
        title: `Pembaruan Versi Tersedia: ${versionData.version}`,
        message: `${product.name} telah merilis versi ${versionData.version}. Silakan unduh pembaruan di Customer Dashboard.`,
        link: "/customer/updates"
      });
    });

    showToast({
      type: "success",
      title: `Versi ${versionData.version} Berhasil Dipublikasikan`,
      message: `Notifikasi update otomatis telah dikirim ke seluruh pemilik produk.`
    });
  };

  const downloadProduct = (productId: string, version: string) => {
    const product = products.find((p) => p.id === productId);
    const token = generateToken(32);
    const fileName = `${product?.slug || "nexarin-asset"}-${version}.zip`;

    const newRecord: DownloadRecord = {
      id: "dl-" + Date.now(),
      userId: user?.id || "usr-cust-001",
      productId,
      productName: product?.name || "Digital Product",
      version,
      downloadToken: token,
      downloadedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
      fileSize: "18.4 MB",
      checksum: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    };

    saveDownloads([newRecord, ...downloads]);

    showToast({
      type: "success",
      title: "Mengunduh File Aman...",
      message: `Token validasi terverifikasi. File ${fileName} sedang diunduh.`
    });

    return {
      downloadToken: token,
      downloadUrl: `/api/downloads/${token}`,
      fileName
    };
  };

  const getUserLicenses = (userId: string) => {
    return licenses.filter((l) => l.userId === userId);
  };

  const getAvailableUpdatesForUser = (userId: string) => {
    const userLics = getUserLicenses(userId);
    return userLics.map((lic) => {
      const prod = products.find((p) => p.id === lic.productId);
      const latestVer = prod?.versions.find((v) => v.isLatest) || prod?.versions[0];
      const hasUpdate = prod ? lic.ownedVersion !== prod.currentVersion : false;
      return {
        product: prod!,
        license: lic,
        latestVersion: latestVer!,
        hasUpdate
      };
    }).filter((item) => item.product);
  };

  const trackAffiliateClick = (affiliateId: string) => {
    const updated = affiliates.map((a) =>
      a.id === affiliateId ? { ...a, clicksCount: a.clicksCount + 1 } : a
    );
    saveAffiliates(updated);
    fetch(`/api/affiliates/${affiliateId}/click`, { method: "POST" }).catch(() => {});
  };

  const createAffiliateLink = (data: Omit<AffiliateLink, "id" | "clicksCount" | "createdAt">) => {
    const newAff: AffiliateLink = {
      ...data,
      id: "aff-" + Date.now(),
      clicksCount: 0,
      createdAt: new Date().toISOString()
    };
    saveAffiliates([newAff, ...affiliates]);
    logAudit("create_affiliate", "affiliate", newAff.id, newAff.name, `Link affiliate baru ditambahkan.`);
    showToast({
      type: "success",
      title: "Link Affiliate Berhasil Dibuat"
    });
  };

  const updateAffiliateLink = (id: string, data: Partial<AffiliateLink>) => {
    saveAffiliates(affiliates.map((a) => (a.id === id ? { ...a, ...data } : a)));
    showToast({
      type: "success",
      title: "Link Affiliate Diperbarui"
    });
  };

  const deleteAffiliateLink = (id: string) => {
    saveAffiliates(affiliates.filter((a) => a.id !== id));
    showToast({
      type: "info",
      title: "Link Affiliate Dihapus"
    });
  };

  const createProduct = (productData: Omit<Product, "id" | "rating" | "ratingCount" | "salesCount" | "createdAt" | "updatedAt" | "versions">) => {
    const initialVer: ProductVersion = {
      id: "v-" + Date.now(),
      productId: "prod-" + Date.now(),
      version: productData.currentVersion || "v1.0.0",
      releaseDate: new Date().toISOString().split("T")[0],
      fileSize: "15.0 MB",
      downloadFileName: `${productData.slug}-v1.0.0.zip`,
      releaseNotes: ["Rilis versi perdana produk."],
      isLatest: true
    };

    const newProd: Product = {
      ...productData,
      id: initialVer.productId,
      rating: 5.0,
      ratingCount: 1,
      salesCount: 0,
      versions: [initialVer],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveProducts([newProd, ...products]);
    logAudit("create_product", "product", newProd.id, newProd.name, "Produk baru dibuat.");
    showToast({
      type: "success",
      title: "Produk Baru Berhasil Dibuat"
    });
  };

  const updateProduct = (id: string, data: Partial<Product>) => {
    saveProducts(products.map((p) => (p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p)));
    logAudit("update_product", "product", id, data.name || "Product", "Informasi produk diperbarui.");
    showToast({
      type: "success",
      title: "Produk Diperbarui"
    });
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        orders,
        licenses,
        downloads,
        affiliates,
        auditLogs,
        getProductBySlug,
        startTrial,
        checkoutOrder,
        publishNewVersion,
        downloadProduct,
        getUserLicenses,
        getAvailableUpdatesForUser,
        trackAffiliateClick,
        createAffiliateLink,
        updateAffiliateLink,
        deleteAffiliateLink,
        createProduct,
        updateProduct
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
}
