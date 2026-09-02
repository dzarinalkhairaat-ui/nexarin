import fs from "fs";
import path from "path";
import { db } from "@/lib/db/store";
import { getSupabaseAdminClient } from "@/lib/db/supabase";
import { Article } from "@/types/content";
import { auditService } from "./auditService";
import { INITIAL_ARTICLES } from "@/data/mockArticles";

const ARTICLES_JSON_FILE = path.join(process.cwd(), "data", "articles.json");

export function loadArticlesFromJson(): Article[] {
  try {
    if (typeof window === "undefined" && fs.existsSync(ARTICLES_JSON_FILE)) {
      const raw = fs.readFileSync(ARTICLES_JSON_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to read data/articles.json:", e);
  }
  return [...INITIAL_ARTICLES];
}

export function saveArticlesToJson(articles: Article[]): void {
  try {
    if (typeof window === "undefined") {
      const dir = path.dirname(ARTICLES_JSON_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(ARTICLES_JSON_FILE, JSON.stringify(articles, null, 2), "utf-8");
    }
  } catch (e) {
    console.error("Failed to write data/articles.json:", e);
  }
}

export const articleService = {
  async getAll(params?: { category?: string; query?: string; status?: string }): Promise<Article[]> {
    const targetStatus = params?.status || "published";

    // 1. Always load fresh from data/articles.json database
    const jsonArticles = loadArticlesFromJson();
    if (db.articles.length === 0 || db.articles.length < jsonArticles.length) {
      db.articles = [...jsonArticles];
    }

    // 2. Query Supabase if available for additional live published articles
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      try {
        let query = supabase.from("articles").select("*").order("created_at", { ascending: false });
        
        if (params?.status && params.status !== "all") {
          query = query.eq("status", params.status);
        } else if (!params?.status) {
          query = query.eq("status", "published");
        }

        if (params?.category && params.category !== "all") {
          query = query.eq("category_id", params.category.toLowerCase());
        }

        const { data: supaData, error } = await query;
        if (!error && supaData && supaData.length > 0) {
          const supaArticles = supaData.map((a: any) => ({
            id: a.id,
            title: a.title,
            slug: a.slug,
            excerpt: a.excerpt,
            content: a.content,
            contentType: (a.content_type || a.contentType || "news") as any,
            category: {
              id: a.category_id,
              name: a.category_id === "ai" ? "Artificial Intelligence" : a.category_id === "gadget" ? "Gadget" : a.category_id === "automotive" ? "Automotive" : a.category_id === "digital" ? "Digital" : "Technology",
              slug: a.category_id,
              description: `Kanal ${a.category_id}`
            },
            tags: Array.isArray(a.tags) ? a.tags : ["AI", "Technology", "Automation"],
            publishedAt: a.published_at || a.created_at,
            createdAt: a.created_at,
            updatedAt: a.updated_at,
            author: {
              name: a.author_name || "Redaksi Nexarin",
              role: "Lead Tech Architect",
              avatar: a.author_avatar || "/assets/avatar-default.svg"
            },
            readingTimeMinutes: a.read_time_minutes || 6,
            views: a.views_count || 1,
            featuredImage: a.featured_image || "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1600&auto=format&fit=crop",
            status: a.status || "published",
            featured: a.is_featured || false,
            breaking: a.breaking || false,
            source: a.source_name ? { name: a.source_name, url: a.source_url || "" } : undefined,
            metaTitle: a.meta_title || a.title,
            metaDescription: a.meta_description || a.excerpt
          }));

          // Merge: combine Supabase articles with JSON articles without duplicate IDs
          const existingIds = new Set(supaArticles.map((s: any) => s.id));
          const nonDuplicateJson = jsonArticles.filter((j) => !existingIds.has(j.id));
          db.articles = [...supaArticles, ...nonDuplicateJson];
        }
      } catch (e) {
        console.error("Supabase articles read error:", e);
      }
    }

    let result = [...db.articles];
    if (result.length === 0) {
      result = [...jsonArticles];
    }

    if (params?.status && params.status !== "all") {
      result = result.filter((a) => (a.status || "published") === params.status);
    } else if (!params?.status) {
      result = result.filter((a) => (a.status || "published") === "published");
    }

    if (params?.category && params.category !== "all") {
      result = result.filter(
        (a) =>
          a.category.id.toLowerCase() === params.category!.toLowerCase() ||
          a.category.slug.toLowerCase() === params.category!.toLowerCase()
      );
    }

    if (params?.query) {
      const q = params.query.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return result;
  },

  async getBySlug(slug: string): Promise<Article | null> {
    const articles = await this.getAll({ status: "all" });
    return articles.find((a) => a.slug === slug || a.id === slug) || null;
  },

  async getById(id: string): Promise<Article | null> {
    const articles = await this.getAll({ status: "all" });
    return articles.find((a) => a.id === id || a.slug === id) || null;
  },

  async create(articleData: Partial<Article>): Promise<Article> {
    const catSlug = (typeof articleData.category === "object" ? articleData.category?.slug : articleData.category) || "technology";
    const catName = catSlug === "ai" ? "Artificial Intelligence" : catSlug === "gadget" ? "Gadget" : catSlug === "automotive" ? "Automotive" : catSlug === "digital" ? "Digital" : "Technology";

    const newArticle: Article = {
      id: articleData.id || `art-${Date.now()}`,
      title: articleData.title || "Judul Baru",
      slug: articleData.slug || (articleData.title ? articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : `article-${Date.now()}`),
      excerpt: articleData.excerpt || "",
      content: articleData.content || "",
      contentType: articleData.contentType || "news",
      category: {
        id: catSlug,
        name: catName,
        slug: catSlug,
        description: `Kanal ${catName}`
      },
      tags: articleData.tags || ["Technology"],
      publishedAt: articleData.publishedAt || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: articleData.author || {
        name: "Redaksi Nexarin",
        role: "Lead Tech Architect",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
      },
      readingTimeMinutes: articleData.readingTimeMinutes || 5,
      views: 1,
      featuredImage: articleData.featuredImage || "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1600&auto=format&fit=crop",
      status: articleData.status || "published",
      metaTitle: articleData.metaTitle || articleData.title || "Nexarin Article",
      metaDescription: articleData.metaDescription || articleData.excerpt || "Nexarin Tech Article"
    };

    const supabase = getSupabaseAdminClient();
    if (supabase) {
      try {
        await supabase.from("articles").upsert({
          id: newArticle.id,
          title: newArticle.title,
          slug: newArticle.slug,
          excerpt: newArticle.excerpt,
          content: newArticle.content,
          category_id: catSlug,
          featured_image: newArticle.featuredImage,
          meta_title: newArticle.metaTitle,
          meta_description: newArticle.metaDescription,
          status: newArticle.status,
          author_name: newArticle.author.name,
          author_avatar: newArticle.author.avatar,
          read_time_minutes: newArticle.readingTimeMinutes,
          views_count: newArticle.views,
          is_featured: false,
          is_trending: true,
          published_at: newArticle.publishedAt
        });
      } catch (e) {
        console.error("Supabase create article error:", e);
      }
    }

    db.articles.unshift(newArticle);
    saveArticlesToJson(db.articles);
    return newArticle;
  },

  async update(id: string, updates: Partial<Article>): Promise<Article | null> {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      try {
        const catSlug = updates.category ? (typeof updates.category === "object" ? updates.category.slug : updates.category) : undefined;
        await supabase
          .from("articles")
          .update({
            title: updates.title,
            slug: updates.slug,
            excerpt: updates.excerpt,
            content: updates.content,
            category_id: catSlug,
            status: updates.status,
            meta_title: updates.metaTitle,
            meta_description: updates.metaDescription,
            updated_at: new Date().toISOString()
          })
          .eq("id", id);
      } catch (e) {
        console.error("Supabase update article error:", e);
      }
    }

    const idx = db.articles.findIndex((a) => a.id === id);
    if (idx !== -1) {
      db.articles[idx] = { ...db.articles[idx], ...updates, updatedAt: new Date().toISOString() };
      saveArticlesToJson(db.articles);
      return db.articles[idx];
    }
    return null;
  },

  async delete(id: string): Promise<boolean> {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      try {
        await supabase.from("articles").delete().eq("id", id);
        await supabase.from("editorial_drafts").delete().eq("id", id);
      } catch (e) {
        console.error("Supabase delete article error:", e);
      }
    }

    const idx = db.articles.findIndex((a) => a.id === id);
    if (idx !== -1) {
      const deleted = db.articles[idx];
      db.articles.splice(idx, 1);
      saveArticlesToJson(db.articles);
      await auditService.log(
        "usr-adm-001",
        "Rins",
        "delete_draft",
        "article",
        id,
        deleted.title,
        `Menghapus artikel ${deleted.title} (${id})`
      );
    }
    return true;
  }
};
