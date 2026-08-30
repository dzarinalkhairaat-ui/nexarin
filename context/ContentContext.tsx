"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Article, GeminiSparkDraft } from "@/types/content";
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
    // 1. Fetch fresh published articles from backend
    try {
      const res = await fetch("/api/articles");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setArticles(data.data);
      }
    } catch (e) {
      console.error("Failed to load articles from API:", e);
    }

    // 2. Fetch fresh drafts from backend
    try {
      const res = await fetch("/api/gemini-sync/drafts");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setDrafts(data.data);
      }
    } catch (e) {
      console.error("Failed to load drafts from API:", e);
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

        showToast({
          type: "success",
          title: "Artikel Berhasil Diterbitkan",
          message: `"${data.data.title}" kini telah tayang di database Supabase dan portal publik.`
        });
      }
    } catch (e) {
      showToast({
        type: "error",
        title: "Gagal Publikasi",
        message: "Terjadi kesalahan saat mempublikasikan artikel."
      });
    }
  };

  const deleteDraft = async (draftId: string) => {
    try {
      const res = await fetch(`/api/gemini-sync/drafts/${draftId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        setDrafts((prev) => prev.filter((d) => d.id !== draftId));
        showToast({
          type: "info",
          title: "Draft Dihapus",
          message: "Draft artikel telah dihapus dari antrean dan database Supabase."
        });
      }
    } catch (e) {
      showToast({
        type: "error",
        title: "Gagal Menghapus",
        message: "Gagal menghapus draft dari database."
      });
    }
  };

  const deleteMultipleDrafts = async (draftIds: string[]) => {
    try {
      await Promise.all(
        draftIds.map((id) =>
          fetch(`/api/gemini-sync/drafts/${id}`, { method: "DELETE" })
        )
      );
      setDrafts((prev) => prev.filter((d) => !draftIds.includes(d.id)));
      showToast({
        type: "info",
        title: "Draft Massal Dihapus",
        message: `${draftIds.length} draft artikel berhasil dihapus dari database Supabase.`
      });
    } catch (e) {
      showToast({
        type: "error",
        title: "Gagal Menghapus",
        message: "Gagal menghapus beberapa draft terpilih."
      });
    }
  };

  const updateDraft = (draftId: string, updatedDraft: Partial<GeminiSparkDraft>) => {
    setDrafts((prev) => prev.map((d) => (d.id === draftId ? { ...d, ...updatedDraft } : d)));
  };

  const createArticle = async (article: Omit<Article, "id" | "views" | "createdAt" | "updatedAt">) => {
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(article)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setArticles((prev) => [data.data, ...prev]);
        showToast({
          type: "success",
          title: "Artikel Berhasil Ditambahkan",
          message: `Artikel "${data.data.title}" telah disimpan ke Supabase.`
        });
      }
    } catch (e) {
      showToast({
        type: "error",
        title: "Gagal Menambahkan Artikel",
        message: "Terjadi kesalahan saat menyimpan artikel ke database."
      });
    }
  };

  const updateArticle = async (id: string, articleUpdates: Partial<Article>) => {
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articleUpdates)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setArticles((prev) => prev.map((a) => (a.id === id ? data.data : a)));
        showToast({
          type: "success",
          title: "Artikel Diperbarui",
          message: `Perubahan artikel telah disimpan ke Supabase.`
        });
      }
    } catch (e) {
      showToast({
        type: "error",
        title: "Gagal Memperbarui",
        message: "Gagal memperbarui artikel di database."
      });
    }
  };

  const deleteArticle = async (id: string) => {
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
        showToast({
          type: "info",
          title: "Artikel Dihapus",
          message: "Artikel telah dihapus secara permanen dari Supabase."
        });
      }
    } catch (e) {
      showToast({
        type: "error",
        title: "Gagal Menghapus",
        message: "Gagal menghapus artikel dari database."
      });
    }
  };

  const deleteMultipleArticles = async (articleIds: string[]) => {
    try {
      await Promise.all(
        articleIds.map((id) =>
          fetch(`/api/articles/${id}`, { method: "DELETE" })
        )
      );
      setArticles((prev) => prev.filter((a) => !articleIds.includes(a.id)));
      showToast({
        type: "info",
        title: "Artikel Massal Dihapus",
        message: `${articleIds.length} artikel telah dihapus dari Supabase.`
      });
    } catch (e) {
      showToast({
        type: "error",
        title: "Gagal Menghapus",
        message: "Gagal menghapus artikel terpilih."
      });
    }
  };

  const syncGeminiSpark = async () => {
    try {
      const res = await fetch("/api/gemini-sync/sync", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        const dftRes = await fetch("/api/gemini-sync/drafts");
        const dftData = await dftRes.json();
        if (dftData.success && Array.isArray(dftData.data)) {
          setDrafts(dftData.data);
        }
      }
    } catch (e) {
      console.error("Sync error:", e);
    }
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
        updateDraft,
        createArticle,
        updateArticle,
        deleteArticle,
        deleteMultipleArticles,
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
