import { db } from "@/lib/db/store";
import { Product, ProductVersion } from "@/types/product";
import { notificationService } from "./notificationService";
import { auditService } from "./auditService";

export const productService = {
  async getAll(): Promise<Product[]> {
    return [...db.products];
  },

  async getBySlug(slug: string): Promise<Product | null> {
    return db.products.find((p) => p.slug === slug) || null;
  },

  async getById(id: string): Promise<Product | null> {
    return db.products.find((p) => p.id === id) || null;
  },

  async create(data: Omit<Product, "id" | "salesCount" | "createdAt" | "updatedAt">): Promise<Product> {
    const newProduct: Product = {
      ...data,
      id: `prod-${Date.now()}`,
      salesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.products.push(newProduct);
    await auditService.log("usr-adm-001", "Admin", "create_product", "product", newProduct.id, newProduct.name, `Menambahkan produk baru: ${newProduct.name}`);
    return newProduct;
  },

  async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    const idx = db.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    db.products[idx] = { ...db.products[idx], ...updates, updatedAt: new Date().toISOString() };
    await auditService.log("usr-adm-001", "Admin", "update_product", "product", id, db.products[idx].name, `Memperbarui data produk: ${db.products[idx].name}`);
    return db.products[idx];
  },

  async addVersion(productId: string, versionData: Omit<ProductVersion, "releaseDate">): Promise<Product | null> {
    const product = db.products.find((p) => p.id === productId);
    if (!product) return null;

    const newVer: ProductVersion = {
      ...versionData,
      releaseDate: new Date().toISOString()
    };

    product.versions.unshift(newVer);
    product.currentVersion = newVer.version;

    await notificationService.broadcast(
      "product_update",
      `Pembaruan ${newVer.version} Tersedia untuk ${product.name}`,
      `Pembaruan terbaru telah dirilis dengan peningkatan: ${newVer.releaseNotes.slice(0, 2).join(", ")}.`,
      "/customer/updates"
    );

    await auditService.log("usr-adm-001", "Admin", "publish_version", "version", productId, product.name, `Merilis pembaruan ${newVer.version} untuk ${product.name}`);

    return product;
  }
};
