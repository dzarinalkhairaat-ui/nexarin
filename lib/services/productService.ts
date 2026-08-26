import { db } from "@/lib/db/store";
import { getSupabaseAdminClient } from "@/lib/db/supabase";
import { Product, ProductVersion } from "@/types/product";
import { notificationService } from "./notificationService";
import { auditService } from "./auditService";

export const productService = {
  async getAll(): Promise<Product[]> {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from("products").select("*, product_versions(*)");
        if (!error && data && data.length > 0) {
          return data.map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            tagline: p.short_description,
            shortDescription: p.short_description,
            description: p.description,
            price: p.price,
            originalPrice: p.original_price,
            currency: p.currency || "IDR",
            category: p.category || "applications",
            licenseType: p.license_type || "lifetime",
            trialEnabled: p.trial_enabled ?? true,
            trialDurationDays: p.trial_duration_days || 3,
            status: p.status === "active" ? "published" : "draft",
            currentVersion: p.product_versions?.[0]?.version || "v1.0.0",
            featuredImage: p.cover_image || "/assets/product-absensi.svg",
            galleryImages: [p.cover_image || "/assets/product-absensi.svg"],
            features: ["Full Source Code Included", "Supabase Ready", "Responsive UI"],
            requirements: {
              platform: ["Web Browser"],
              runtime: "Node.js 18+",
              minimumSpecs: "512MB RAM"
            },
            rating: p.rating || 5.0,
            ratingCount: 12,
            salesCount: p.sales_count || 0,
            versions: p.product_versions?.map((v: any) => ({
              id: v.id,
              productId: p.id,
              version: v.version,
              releaseDate: v.release_date,
              fileSize: v.file_size || "15 MB",
              downloadFileName: `${p.slug}-${v.version}.zip`,
              releaseNotes: v.release_notes || ["Rilis versi pembaruan."],
              downloadUrl: v.download_path,
              isLatest: v.is_latest ?? true
            })) || [],
            faqs: [{ question: "Apakah ada garansi update?", answer: "Ya, lisensi lifetime mencakup update." }],
            documentationUrl: p.demo_url,
            demoUrl: p.demo_url,
            createdAt: p.created_at,
            updatedAt: p.updated_at
          }));
        }
      } catch (e) {
        console.error("Supabase products read error, using store:", e);
      }
    }
    return [...db.products];
  },

  async getBySlug(slug: string): Promise<Product | null> {
    const products = await this.getAll();
    return products.find((p) => p.slug === slug || p.id === slug) || null;
  },

  async getById(id: string): Promise<Product | null> {
    const products = await this.getAll();
    return products.find((p) => p.id === id || p.slug === id || p.id.toLowerCase().includes(id.toLowerCase())) || null;
  },

  async create(data: Omit<Product, "id" | "salesCount" | "createdAt" | "updatedAt">): Promise<Product> {
    const newProduct: Product = {
      ...data,
      id: `prod-${Date.now()}`,
      salesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const supabase = getSupabaseAdminClient();
    if (supabase) {
      try {
        await supabase.from("products").insert({
          id: newProduct.id,
          name: newProduct.name,
          slug: newProduct.slug,
          short_description: newProduct.shortDescription,
          description: newProduct.description,
          price: newProduct.price,
          original_price: newProduct.originalPrice || newProduct.price * 1.5,
          currency: newProduct.currency,
          category: newProduct.category,
          license_type: newProduct.licenseType,
          trial_enabled: newProduct.trialEnabled,
          trial_duration_days: newProduct.trialDurationDays,
          status: "active",
          cover_image: newProduct.featuredImage,
          download_url: `/downloads/${newProduct.slug}.zip`
        });
      } catch (e) {
        console.error("Supabase create product error:", e);
      }
    }

    db.products.push(newProduct);
    await auditService.log("usr-adm-001", "Admin", "create_product", "product", newProduct.id, newProduct.name, `Menambahkan produk baru: ${newProduct.name}`);
    return newProduct;
  },

  async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    const idx = db.products.findIndex((p) => p.id === id || p.slug === id);
    if (idx === -1) return null;
    db.products[idx] = { ...db.products[idx], ...updates, updatedAt: new Date().toISOString() };
    await auditService.log("usr-adm-001", "Admin", "update_product", "product", id, db.products[idx].name, `Memperbarui data produk: ${db.products[idx].name}`);
    return db.products[idx];
  },

  async addVersion(productId: string, versionData: Omit<ProductVersion, "releaseDate">): Promise<Product | null> {
    let product = db.products.find((p) => p.id === productId || p.slug === productId || p.id.toLowerCase().includes(productId.toLowerCase()));
    if (!product) {
      // Look in Supabase
      const all = await this.getAll();
      product = all.find((p) => p.id === productId || p.slug === productId);
    }
    if (!product) return null;

    const newVer: ProductVersion = {
      ...versionData,
      releaseDate: new Date().toISOString()
    };

    if (!product.versions) {
      product.versions = [];
    }
    product.versions.unshift(newVer);
    product.currentVersion = newVer.version;

    const supabase = getSupabaseAdminClient();
    if (supabase) {
      try {
        await supabase.from("product_versions").insert({
          id: newVer.id || `v-${Date.now()}`,
          product_id: product.id,
          version: newVer.version,
          download_path: newVer.downloadUrl || `/downloads/${product.slug}-${newVer.version}.zip`,
          file_size: newVer.fileSize || "15.0 MB",
          release_notes: newVer.releaseNotes,
          is_latest: true
        });
      } catch (e) {
        console.error("Supabase version insert error:", e);
      }
    }

    await notificationService.broadcast(
      "product_update",
      `Pembaruan ${newVer.version} Tersedia untuk ${product.name}`,
      `Pembaruan terbaru telah dirilis dengan peningkatan: ${newVer.releaseNotes.slice(0, 2).join(", ")}.`,
      "/customer/updates"
    );

    await auditService.log("usr-adm-001", "Admin", "publish_version", "version", product.id, product.name, `Merilis pembaruan ${newVer.version} untuk ${product.name}`);

    return product;
  }
};
