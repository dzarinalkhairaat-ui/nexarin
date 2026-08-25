import { db, DBTrial } from "@/lib/db/store";
import { License } from "@/types/product";

export const licenseService = {
  async getByCustomer(email: string): Promise<License[]> {
    return [...db.licenses];
  },

  async generateLicense(params: {
    userId?: string;
    customerEmail?: string;
    customerName?: string;
    productId: string;
    productName: string;
    productSlug?: string;
    orderId?: string;
    licenseType: "lifetime" | "trial" | "subscription";
  }): Promise<License> {
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const randomHex2 = Math.random().toString(36).substring(2, 7).toUpperCase();
    const licenseKey = `NEX-${params.licenseType.toUpperCase()}-${randomHex}-${randomHex2}-KEY`;

    const newLicense: License = {
      id: `lic-${Date.now()}`,
      licenseKey,
      userId: params.userId || "usr-cust-001",
      productId: params.productId,
      productName: params.productName,
      productSlug: params.productSlug || params.productId,
      orderId: params.orderId || `ord-${Date.now()}`,
      licenseType: params.licenseType,
      status: "active",
      currentVersion: "v2.1.0",
      ownedVersion: "v2.1.0",
      issuedAt: new Date().toISOString()
    };

    db.licenses.unshift(newLicense);
    return newLicense;
  },

  async verify(licenseKey: string, productId?: string): Promise<{
    valid: boolean;
    status: string;
    license?: License;
    message: string;
  }> {
    const license = db.licenses.find((l) => l.licenseKey === licenseKey);
    if (!license) {
      return { valid: false, status: "not_found", message: "Kunci lisensi tidak ditemukan di sistem Nexarin." };
    }
    if (license.status !== "active") {
      return { valid: false, status: license.status, message: "Kunci lisensi telah dicabut atau kedaluwarsa." };
    }
    if (productId && license.productId !== productId) {
      return { valid: false, status: "product_mismatch", message: "Kunci lisensi tidak sesuai dengan produk ini." };
    }
    return { valid: true, status: "active", license, message: "Lisensi resmi Nexarin valid dan aktif." };
  },

  async requestTrial(params: {
    productId: string;
    productName: string;
    userEmail: string;
    userName: string;
    institution?: string;
  }): Promise<DBTrial> {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const trialKey = `TRL-3DAYS-${randomCode}`;
    const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();

    const newTrial: DBTrial = {
      id: `trl-${Date.now()}`,
      productId: params.productId,
      productName: params.productName,
      userEmail: params.userEmail,
      userName: params.userName,
      institution: params.institution,
      trialKey,
      expiresAt,
      status: "active",
      createdAt: new Date().toISOString()
    };

    db.trials.unshift(newTrial);
    return newTrial;
  },

  async getTrials(): Promise<DBTrial[]> {
    return [...db.trials];
  }
};
