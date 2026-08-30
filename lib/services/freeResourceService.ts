import { db } from "@/lib/db/store";
import { getSupabaseAdminClient } from "@/lib/db/supabase";
import { FreeResource } from "@/types/resource";
import { auditService } from "./auditService";

const DEFAULT_RESOURCES: FreeResource[] = [
  {
    id: "res-1",
    title: "Nexarin UI Components Starter Pack",
    slug: "nexarin-ui-components-starter-pack",
    description: "25+ Komponen UI modern berbasis Tailwind CSS v4 & React 19 (Button, Modal, Toast, Card, Dropdown, Accordion) dengan dark-mode tokens.",
    fileSize: "2.4 MB",
    format: "React 19 / Tailwind v4",
    badge: "Featured Kit",
    category: "ui-kits",
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000&auto=format&fit=crop",
    tags: ["React 19", "Tailwind CSS", "UI Kit", "TypeScript"],
    features: ["Fully Accessible (a11y)", "Zero External CSS Lib", "TypeScript Ready"],
    downloadUrl: "/downloads/nexarin-ui-starter.zip",
    downloadsCount: 2410,
    isActive: true,
    createdAt: "2026-08-01T00:00:00Z"
  },
  {
    id: "res-2",
    title: "Next.js 16 SaaS Boilerplate & Auth Starter",
    slug: "nextjs-16-saas-boilerplate-auth-starter",
    description: "Boilerplate fullstack Next.js 16 App Router siap pakai lengkap dengan Supabase Auth, middleware proteksi rute, dan admin layout.",
    fileSize: "4.8 MB",
    format: "Next.js 16 / TypeScript",
    badge: "Popular",
    category: "starter-kits",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop",
    tags: ["Next.js 16", "Supabase", "SaaS", "Fullstack"],
    features: ["App Router Ready", "Supabase SSR Configured", "Role-Based Access Control"],
    downloadUrl: "/downloads/nextjs16-saas-boilerplate.zip",
    downloadsCount: 3890,
    isActive: true,
    createdAt: "2026-08-05T00:00:00Z"
  },
  {
    id: "res-3",
    title: "Python AI Agent & LLM Workflow Starter",
    slug: "python-ai-agent-llm-workflow-starter",
    description: "Template skrip Python untuk orkestrasi Autonomous AI Agents, multi-tool calling, LangChain pipeline, dan prompt engineering harness.",
    fileSize: "1.2 MB",
    format: "Python 3.12 / Jupyter",
    badge: "AI Tool",
    category: "ai-tools",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1000&auto=format&fit=crop",
    tags: ["Python", "AI Agent", "LLM", "Automation"],
    features: ["OpenAI & Anthropic API ready", "Modular tool execution", "Async request pipeline"],
    downloadUrl: "/downloads/python-ai-agent-starter.zip",
    downloadsCount: 1950,
    isActive: true,
    createdAt: "2026-08-10T00:00:00Z"
  },
  {
    id: "res-4",
    title: "Excel Financial Model & Cashflow Pro Dashboard",
    slug: "excel-financial-model-cashflow-pro-dashboard",
    description: "Template spreadsheet Excel profesional untuk simulasi proyeksi keuangan startup, rekapitulasi cashflow, dan analisis P&L otomatis.",
    fileSize: "850 KB",
    format: "XLSX / Google Sheets",
    badge: "Spreadsheet",
    category: "spreadsheet",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
    tags: ["Excel", "Finance", "Dashboard", "Spreadsheet"],
    features: ["Dynamic XLOOKUP formulas", "Interactive Pivot Charts", "Clean Print-Ready Layout"],
    downloadUrl: "/downloads/excel-financial-model-template.xlsx",
    downloadsCount: 1620,
    isActive: true,
    createdAt: "2026-08-15T00:00:00Z"
  },
  {
    id: "res-5",
    title: "PostgreSQL Schema & Security RLS Starter Pack",
    slug: "postgresql-schema-security-rls-starter-pack",
    description: "Kumpulan script SQL PostgreSQL siap eksekusi untuk skema e-commerce, audit logging, multi-tenancy, dan Row Level Security policies.",
    fileSize: "320 KB",
    format: "SQL / Markdown",
    badge: "Backend",
    category: "backend-db",
    thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=1000&auto=format&fit=crop",
    tags: ["PostgreSQL", "SQL", "Database", "Security"],
    features: ["Production-Grade RLS", "Automated Trigger Functions", "Indexing Optimizations"],
    downloadUrl: "/downloads/postgresql-rls-starter-pack.zip",
    downloadsCount: 1240,
    isActive: true,
    createdAt: "2026-08-18T00:00:00Z"
  },
  {
    id: "res-6",
    title: "Modern Tech Brand & Icon SVG Vector Asset Pack",
    slug: "modern-tech-brand-icon-svg-vector-asset-pack",
    description: "Koleksi 100+ ikon SVG vektor monokrom dan gradasi ultra-tajam untuk developer tools, cloud infrastructure, AI, dan web modern.",
    fileSize: "3.1 MB",
    format: "SVG / Figma Library",
    badge: "Design Kit",
    category: "ui-kits",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
    tags: ["SVG", "Figma", "Icons", "Vector"],
    features: ["Scalable Infinite Vector", "24x24 Pixel Grid Perfect", "Figma Component Variables"],
    downloadUrl: "/downloads/tech-icons-svg-pack.zip",
    downloadsCount: 2110,
    isActive: true,
    createdAt: "2026-08-20T00:00:00Z"
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
