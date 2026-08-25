import { db } from "@/lib/db/store";
import { Article } from "@/types/content";

export const articleService = {
  async getAll(params?: { category?: string; query?: string; status?: string }): Promise<Article[]> {
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
    const article = db.articles.find((a) => a.slug === slug);
    if (article) {
      article.views = (article.views || 0) + 1;
    }
    return article || null;
  },

  async getById(id: string): Promise<Article | null> {
    return db.articles.find((a) => a.id === id) || null;
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
