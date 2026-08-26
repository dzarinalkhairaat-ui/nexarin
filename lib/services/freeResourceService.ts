import { db } from "@/lib/db/store";
import { getSupabaseAdminClient } from "@/lib/db/supabase";
import { FreeResource } from "@/types/resource";
import { auditService } from "./auditService";

const DEFAULT_RESOURCES: FreeResource[] = [
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

function getStoreResources(): FreeResource[] {
  if (!db.freeResources || !Array.isArray(db.freeResources)) {
    db.freeResources = [...DEFAULT_RESOURCES];
  }
  return db.freeResources;
}

export const freeResourceService = {
  async getAll(): Promise<FreeResource[]> {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("free_resources")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && Array.isArray(data) && data.length > 0) {
          return data.map((r: any) => ({
            id: r.id,
            title: r.title,
            slug: r.slug,
            description: r.description,
            fileSize: r.file_size || "1.5 MB",
            format: r.format || "ZIP",
            badge: r.badge || "Featured",
            downloadUrl: r.download_url || "/downloads/resource.zip",
            downloadsCount: r.downloads_count || 0,
            isActive: r.is_active ?? true,
            createdAt: r.created_at,
            updatedAt: r.updated_at
          }));
        }
      } catch (e) {
        console.error("Supabase free_resources read error:", e);
      }
    }
    return [...getStoreResources()];
  },

  async getById(id: string): Promise<FreeResource | null> {
    const all = await this.getAll();
    return all.find((r) => r.id === id || r.slug === id) || null;
  },

  async create(data: Omit<FreeResource, "id" | "downloadsCount" | "createdAt">): Promise<FreeResource> {
    const newRes: FreeResource = {
      ...data,
      id: `res-${Date.now()}`,
      downloadsCount: 0,
      createdAt: new Date().toISOString()
    };

    const supabase = getSupabaseAdminClient();
    if (supabase) {
      try {
        await supabase.from("free_resources").insert({
          id: newRes.id,
          title: newRes.title,
          slug: newRes.slug,
          description: newRes.description,
          file_size: newRes.fileSize,
          format: newRes.format,
          badge: newRes.badge,
          download_url: newRes.downloadUrl,
          downloads_count: 0,
          is_active: newRes.isActive
        });
      } catch (e) {
        console.error("Supabase insert free_resources error:", e);
      }
    }

    const store = getStoreResources();
    store.unshift(newRes);
    await auditService.log("usr-adm-001", "Admin", "create_product", "product", newRes.id, newRes.title, `Menambahkan Free Resource baru: ${newRes.title}`);
    return newRes;
  },

  async update(id: string, updates: Partial<FreeResource>): Promise<FreeResource | null> {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      try {
        await supabase
          .from("free_resources")
          .update({
            title: updates.title,
            slug: updates.slug,
            description: updates.description,
            file_size: updates.fileSize,
            format: updates.format,
            badge: updates.badge,
            download_url: updates.downloadUrl,
            is_active: updates.isActive,
            updated_at: new Date().toISOString()
          })
          .or(`id.eq.${id},slug.eq.${id}`);
      } catch (e) {
        console.error("Supabase update free_resources error:", e);
      }
    }

    const store = getStoreResources();
    const idx = store.findIndex((r) => r.id === id || r.slug === id);
    if (idx !== -1) {
      store[idx] = { ...store[idx], ...updates, updatedAt: new Date().toISOString() };
      await auditService.log("usr-adm-001", "Admin", "update_product", "product", id, store[idx].title, `Memperbarui Free Resource: ${store[idx].title}`);
      return store[idx];
    }
    return null;
  },

  async delete(id: string): Promise<boolean> {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      try {
        await supabase.from("free_resources").delete().or(`id.eq.${id},slug.eq.${id}`);
      } catch (e) {
        console.error("Supabase delete free_resources error:", e);
      }
    }

    const store = getStoreResources();
    const idx = store.findIndex((r) => r.id === id || r.slug === id);
    if (idx !== -1) {
      const deleted = store.splice(idx, 1)[0];
      await auditService.log("usr-adm-001", "Admin", "update_product", "product", id, deleted.title, `Menghapus Free Resource: ${deleted.title}`);
      return true;
    }
    return false;
  },

  async recordDownload(id: string): Promise<{ success: boolean; downloadsCount: number }> {
    const store = getStoreResources();
    const item = store.find((r) => r.id === id || r.slug === id);
    if (!item) return { success: false, downloadsCount: 0 };
    item.downloadsCount = (item.downloadsCount || 0) + 1;

    const supabase = getSupabaseAdminClient();
    if (supabase) {
      try {
        await supabase.from("free_resources").update({ downloads_count: item.downloadsCount }).eq("id", item.id);
      } catch (e) {}
    }
    return { success: true, downloadsCount: item.downloadsCount };
  }
};
