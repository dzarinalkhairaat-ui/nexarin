export type LicenseType = "trial" | "lifetime" | "subscription";
export type ProductStatus = "published" | "draft" | "archived";

export interface ProductVersion {
  id: string;
  productId: string;
  version: string;
  releaseDate: string;
  fileSize: string;
  downloadFileName: string;
  releaseNotes: string[];
  downloadUrl?: string;
  isLatest: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  shortDescription: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: "IDR" | "USD";
  category: "applications" | "templates" | "source-code" | "starter-kits" | "mobile";
  licenseType: LicenseType;
  trialEnabled: boolean;
  trialDurationDays: number;
  status: ProductStatus;
  currentVersion: string;
  featuredImage: string;
  galleryImages: string[];
  features: string[];
  requirements: {
    platform: string[];
    runtime: string;
    database?: string;
    minimumSpecs: string;
  };
  rating: number;
  ratingCount: number;
  salesCount: number;
  versions: ProductVersion[];
  faqs: { question: string; answer: string }[];
  documentationUrl?: string;
  demoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productSlug: string;
  version: string;
  price: number;
  licenseType: LicenseType;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  currency: "IDR" | "USD";
  status: "pending" | "paid" | "failed" | "refunded";
  paymentProvider: "Mayar" | "Manual";
  paymentReference: string;
  paidAt?: string;
  createdAt: string;
}

export interface License {
  id: string;
  licenseKey: string;
  userId: string;
  productId: string;
  productName: string;
  productSlug: string;
  orderId: string;
  licenseType: LicenseType;
  status: "active" | "trial_active" | "expired" | "revoked";
  currentVersion: string;
  ownedVersion: string;
  issuedAt: string;
  expiresAt?: string;
}

export interface DownloadRecord {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  version: string;
  downloadToken: string;
  downloadedAt: string;
  expiresAt: string;
  fileSize: string;
  checksum: string;
}
