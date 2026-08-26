import { db } from "@/lib/db/store";
import { getSupabaseAdminClient } from "@/lib/db/supabase";
import { Article } from "@/types/content";

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
        if (!error && data && data.length > 0) {
          return data.map((a: any) => ({
            id: a.id,
            title: a.title,
            slug: a.slug,
            excerpt: a.excerpt,
            content: a.content,
            contentType: "news",
            category: {
              id: a.category_id,
              name: a.category_id === "ai" ? "Artificial Intelligence" : "Software Engineering",
              slug: a.category_id,
              description: "Kategori artikel teknologi"
            },
            tags: ["AI", "Tech", "Engineering"],
            publishedAt: a.published_at,
            createdAt: a.created_at,
            updatedAt: a.updated_at,
            author: {
              name: a.author_name || "Redaksi Nexarin",
              role: "Editorial Tech AI",
              avatar: a.author_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
            },
            readingTimeMinutes: a.read_time_minutes || 5,
            views: a.views_count || 1,
            featuredImage: a.featured_image,
            status: a.status || "published",
            metaTitle: a.meta_title || a.title,
            metaDescription: a.meta_description || a.excerpt
          }));
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
    const article = articles.find((a) => a.slug === slug);
    if (article) {
      article.views = (article.views || 0) + 1;
    }
    return article || null;
  },

  async getById(id: string): Promise<Article | null> {
    const articles = await this.getAll();
    return articles.find((a) => a.id === id) || null;
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
    db.articles.unshift(newArticle);
    return newArticle;
  },

  async update(id: string, updates: Partial<Article>): Promise<Article | null> {
    const idx = db.articles.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    db.articles[idx] = { ...db.articles[idx], ...updates, updatedAt: new Date().toISOString() };
    return db.articles[idx];
  },

  async delete(id: string): Promise<boolean> {
    const idx = db.articles.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    db.articles.splice(idx, 1);
    return true;
  }
};
