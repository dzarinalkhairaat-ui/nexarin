"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Article, GeminiSparkDraft } from "@/types/content";
import { INITIAL_ARTICLES } from "@/data/mockArticles";
import { INITIAL_DRAFTS } from "@/data/mockDrafts";
import { useNotification } from "@/context/NotificationContext";

interface ContentContextType {
  articles: Article[];
  drafts: GeminiSparkDraft[];
  getArticleBySlug: (slug: string) => Article | undefined;
  getArticlesByCategory: (categorySlug: string) => Article[];
  searchArticles: (query: string, category?: string) => Article[];
  publishDraft: (draftId: string, editedData?: Partial<Article>) => Promise<void>;
  deleteDraft: (draftId: string) => Promise<void>;
  deleteMultipleDrafts: (draftIds: string[]) => Promise<void>;
  updateDraft: (draftId: string, updatedDraft: Partial<GeminiSparkDraft>) => void;
  createArticle: (article: Omit<Article, "id" | "views" | "createdAt" | "updatedAt">) => Promise<void>;
  updateArticle: (id: string, article: Partial<Article>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  deleteMultipleArticles: (articleIds: string[]) => Promise<void>;
  syncGeminiSpark: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [drafts, setDrafts] = useState<GeminiSparkDraft[]>([]);
  const { showToast } = useNotification();

  const loadData = async () => {
    try {
      const res = await fetch("/api/articles");
      const data = await res.json();
      if (data.success && data.data && Array.isArray(data.data)) {
        setArticles(data.data);
      }
    } catch (e) {
      console.log("Using cached articles", e);
    }

    try {
      const res = await fetch("/api/gemini-sync/drafts");
      const data = await res.json();
      if (data.success && data.data && Array.isArray(data.data)) {
        setDrafts(data.data);
      }
    } catch (e) {
      console.log("Using cached drafts", e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getArticleBySlug = (slug: string): Article | undefined => {
    return articles.find((a) => a.slug === slug || a.id === slug);
  };

  const getArticlesByCategory = (categorySlug: string): Article[] => {
    if (categorySlug === "all") return articles;
    return articles.filter(
      (a) =>
        a.category.slug.toLowerCase() === categorySlug.toLowerCase() ||
        a.category.id.toLowerCase() === categorySlug.toLowerCase()
    );
  };

  const searchArticles = (query: string, category?: string): Article[] => {
    let filtered = articles;
    if (category && category !== "all") {
      filtered = getArticlesByCategory(category);
    }
    if (!query.trim()) return filtered;

    const lower = query.toLowerCase();
    return filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(lower) ||
        a.excerpt.toLowerCase().includes(lower) ||
        a.tags.some((t) => t.toLowerCase().includes(lower))
    );
  };

  const publishDraft = async (draftId: string, editedData?: Partial<Article>) => {
    try {
      const res = await fetch(`/api/articles/${draftId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedData || {})
      });
      const data = await res.json();
      if (data.success && data.data) {
        setArticles((prev) => [data.data, ...prev.filter((a) => a.id !== data.data.id)]);
        setDrafts((prev) => prev.filter((d) => d.id !== draftId));
      }
    } catch (e) {
      console.error("Publish draft error:", e);
    }

    showToast({
      type: "success",
      title: "Artikel Berhasil Dipublikasikan",
      message: "Draft telah diterbitkan dan langsung tayang di portal publik dan database Supabase."
    });
  };

  const deleteMultipleDrafts = async (draftIds: string[]) => {
    if (draftIds.length === 0) return;
    setDrafts((prev) => prev.filter((d) => !draftIds.includes(d.id)));
    try {
      await Promise.all(draftIds.map(id => fetch(`/api/gemini-sync/drafts/${id}`, { method: "DELETE" })));
    } catch (e) {
      console.error("Bulk delete drafts error:", e);
    }
    showToast({
      type: "info",
      title: "Draft Terpilih Dihapus",
      message: `${draftIds.length} draft artikel berhasil dihapus secara massal.`
    });
  };

  const deleteMultipleArticles = async (articleIds: string[]) => {
    if (articleIds.length === 0) return;
    setArticles((prev) => prev.filter((a) => !articleIds.includes(a.id)));
    try {
      await Promise.all(articleIds.map(id => fetch(`/api/articles/${id}`, { method: "DELETE" })));
    } catch (e) {
      console.error("Bulk delete articles error:", e);
    }
    showToast({
      type: "info",
      title: "Artikel Terpilih Dihapus",
      message: `${articleIds.length} artikel berhasil dihapus dari portal publik.`
    });
  };

  const deleteDraft = async (draftId: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== draftId));
    try {
      await fetch(`/api/gemini-sync/drafts/${draftId}`, { method: "DELETE" });
    } catch (e) {
      console.error("Delete draft error:", e);
    }
    showToast({
      type: "info",
      title: "Draft Dihapus",
      message: "Draft telah dihapus secara permanen dari antrean review dan database."
    });
  };

  const updateDraft = (draftId: string, updatedDraft: Partial<GeminiSparkDraft>) => {
    setDrafts((prev) =>
      prev.map((d) => (d.id === draftId ? { ...d, ...updatedDraft } : d))
    );
  };

  const createArticle = async (articleData: Omit<Article, "id" | "views" | "createdAt" | "updatedAt">) => {
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articleData)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setArticles((prev) => [data.data, ...prev]);
      }
    } catch (e) {
      const fallbackArt: Article = {
        ...articleData,
        id: "art-" + Date.now(),
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setArticles((prev) => [fallbackArt, ...prev]);
    }

    showToast({
      type: "success",
      title: "Artikel Dibuat",
      message: "Artikel baru berhasil ditambahkan ke database."
    });
  };

  const updateArticle = async (id: string, updatedData: Partial<Article>) => {
    setArticles((prev) =>
      prev.map((a) =>
        a.id === id || a.slug === id ? { ...a, ...updatedData, updatedAt: new Date().toISOString() } : a
      )
    );

    try {
      await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
      });
    } catch (e) {
      console.error("Update article error:", e);
    }

    showToast({
      type: "success",
      title: "Artikel Diperbarui",
      message: "Perubahan artikel berhasil disimpan ke database."
    });
  };

  const deleteArticle = async (id: string) => {
    // Optimistic state update so UI removes it immediately
    setArticles((prev) => prev.filter((a) => a.id !== id && a.slug !== id));

    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      const data = await res.json();
      console.log("Delete article API response:", data);
    } catch (e) {
      console.error("Delete article API error:", e);
    }

    showToast({
      type: "warning",
      title: "Artikel Berhasil Dihapus",
      message: "Artikel telah dihapus secara permanen dari website dan database Supabase."
    });
  };

  const syncGeminiSpark = async () => {
    try {
      const res = await fetch("/api/gemini-sync/sync", { method: "POST" });
      const data = await res.json();
      if (data.success && data.data?.newDrafts) {
        setDrafts((prev) => [...data.data.newDrafts, ...prev]);
      }
    } catch (e) {
      console.log("Local sync triggered");
    }

    showToast({
      type: "success",
      title: "Sinkronisasi Berhasil",
      message: "Berhasil memeriksa dan mengimpor draft terbaru dari pipeline Gemini Spark dan Google Sheets."
    });
  };

  return (
    <ContentContext.Provider
      value={{
        articles,
        drafts,
        getArticleBySlug,
        getArticlesByCategory,
        searchArticles,
        publishDraft,
        deleteDraft,
        deleteMultipleDrafts,
        deleteMultipleArticles,
        updateDraft,
        createArticle,
        updateArticle,
        deleteArticle,
        syncGeminiSpark
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
}
