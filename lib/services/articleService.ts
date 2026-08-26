import { db } from "@/lib/db/store";
import { getSupabaseAdminClient } from "@/lib/db/supabase";
import { Article } from "@/types/content";
import { auditService } from "./auditService";

export const articleService = {
  async getAll(params?: { category?: string; query?: string; status?: string }): Promise<Article[]> {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      try {
        let query = supabase.from("articles").select("*").order("published_at", { ascending: false });
        if (params?.category && params.category !== "all") {
          query = query.eq("category_id", params.category.toLowerCase());
        }
        const { data, error } = await query;
        if (!error && data) {
          const dbArticles = data.map((a: any) => ({
            id: a.id,
            title: a.title,
            slug: a.slug,
            excerpt: a.excerpt,
            content: a.content,
            contentType: (a.content_type || a.contentType || "news") as any,
            category: {
              id: a.category_id,
              name: a.category_id === "ai" ? "Artificial Intelligence" : a.category_id === "gadget" ? "Gadget" : a.category_id === "automotive" ? "Automotive" : "Technology",
              slug: a.category_id,
              description: "Kategori artikel teknologi"
            },
            tags: Array.isArray(a.tags) ? a.tags : ["AI", "Technology", "Automation"],
            publishedAt: a.published_at,
            createdAt: a.created_at,
            updatedAt: a.updated_at,
            author: {
              name: a.author_name || "Redaksi Nexari",
              role: "Lead Tech Architect",
              avatar: a.author_avatar || "/assets/avatar-default.svg"
            },
            readingTimeMinutes: a.read_time_minutes || 5,
            views: a.views_count || 1200,
            featuredImage: a.featured_image || "/assets/article-ai.svg",
            status: a.status || "published",
            featured: a.featured || false,
            breaking: a.breaking || false,
            source: a.source_name ? { name: a.source_name, url: a.source_url || "" } : undefined,
            metaTitle: a.meta_title || a.title,
            metaDescription: a.meta_description || a.excerpt
          }));

          // Merge with initial articles if count is small so all subcategories & editorial pieces render
          const existingSlugs = new Set(dbArticles.map((a: any) => a.slug));
          const fallbackMatches = db.articles.filter((a) => !existingSlugs.has(a.slug));
          return [...dbArticles, ...fallbackMatches];
        }
      } catch (e) {
        console.error("Supabase articles error, using store:", e);
      }
    }

    let result = [...db.articles];
    if (params?.category && params.category !== "all") {
      result = result.filter(
        (a) =>
          a.category.id.toLowerCase() === params.category!.toLowerCase() ||
          a.category.slug.toLowerCase() === params.category!.toLowerCase() ||
          a.category.name.toLowerCase() === params.category!.toLowerCase()
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
    const articles = await this.getAll();
    const article = articles.find((a) => a.slug === slug || a.id === slug);
    if (article) {
      article.views = (article.views || 0) + 1;
    }
    return article || null;
  },

  async getById(id: string): Promise<Article | null> {
    const articles = await this.getAll();
    return articles.find((a) => a.id === id || a.slug === id) || null;
  },

  async create(data: Omit<Article, "id" | "views" | "publishedAt" | "createdAt" | "updatedAt">): Promise<Article> {
    const newArticle: Article = {
      ...data,
      id: `art-${Date.now()}`,
      views: 1,
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const supabase = getSupabaseAdminClient();
    if (supabase) {
      try {
        await supabase.from("articles").insert({
          id: newArticle.id,
          title: newArticle.title,
          slug: newArticle.slug,
          excerpt: newArticle.excerpt,
          content: newArticle.content,
          category_id: newArticle.category?.id || "ai",
          featured_image: newArticle.featuredImage || "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1600",
          meta_title: newArticle.metaTitle || newArticle.title,
          meta_description: newArticle.metaDescription || newArticle.excerpt,
          status: newArticle.status || "published",
          author_name: newArticle.author?.name || "Redaksi Nexarin",
          author_avatar: newArticle.author?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200",
          read_time_minutes: newArticle.readingTimeMinutes || 5,
          views_count: 1,
          published_at: newArticle.publishedAt
        });
      } catch (e) {
        console.error("Supabase insert article error:", e);
      }
    }

    db.articles.unshift(newArticle);
    return newArticle;
  },

  async update(id: string, updates: Partial<Article>): Promise<Article | null> {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      try {
        await supabase
          .from("articles")
          .update({
            title: updates.title,
            slug: updates.slug,
            excerpt: updates.excerpt,
            content: updates.content,
            meta_title: updates.metaTitle,
            meta_description: updates.metaDescription,
            updated_at: new Date().toISOString()
          })
          .or(`id.eq.${id},slug.eq.${id}`);
      } catch (e) {
        console.error("Supabase update article error:", e);
      }
    }

    const idx = db.articles.findIndex((a) => a.id === id || a.slug === id);
    if (idx !== -1) {
      db.articles[idx] = { ...db.articles[idx], ...updates, updatedAt: new Date().toISOString() };
      return db.articles[idx];
    }
    return null;
  },

  async delete(id: string): Promise<boolean> {
    // 1. Delete from Supabase articles table
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      try {
        const res = await supabase.from("articles").delete().or(`id.eq.${id},slug.eq.${id}`);
        if (res.error) {
          console.error("Supabase delete article error:", res.error.message);
        }
        // Also cleanup matching editorial_drafts if any
        await supabase.from("editorial_drafts").delete().or(`id.eq.${id}`);
      } catch (e) {
        console.error("Supabase delete article exception:", e);
      }
    }

    // 2. Delete from in-memory store
    const idx = db.articles.findIndex((a) => a.id === id || a.slug === id);
    if (idx !== -1) {
      const deleted = db.articles.splice(idx, 1)[0];
      await auditService.log(
        "usr-adm-001",
        "Rins",
        "publish_article",
        "article",
        id,
        deleted.title,
        `Menghapus artikel: ${deleted.title}`
      );
    }

    const dIdx = db.drafts.findIndex((d) => d.id === id);
    if (dIdx !== -1) {
      db.drafts.splice(dIdx, 1);
    }

    return true;
  }
};
