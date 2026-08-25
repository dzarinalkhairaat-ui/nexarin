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
  updateDraft: (draftId: string, updatedDraft: Partial<GeminiSparkDraft>) => void;
  createArticle: (article: Omit<Article, "id" | "views" | "createdAt" | "updatedAt">) => Promise<void>;
  updateArticle: (id: string, article: Partial<Article>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  syncGeminiSpark: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [drafts, setDrafts] = useState<GeminiSparkDraft[]>(INITIAL_DRAFTS);
  const { showToast } = useNotification();

  useEffect(() => {
    // Initial fetch from backend API
    fetch("/api/articles")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setArticles(data.data);
        }
      })
      .catch((e) => console.log("Using cached articles", e));

    fetch("/api/gemini-sync/drafts")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setDrafts(data.data);
        }
      })
      .catch((e) => console.log("Using cached drafts", e));
  }, []);

  const getArticleBySlug = (slug: string): Article | undefined => {
    return articles.find((a) => a.slug === slug);
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
        setArticles((prev) => [data.data, ...prev]);
        setDrafts((prev) => prev.filter((d) => d.id !== draftId));
      }
    } catch (e) {
      // Local fallback
      const draft = drafts.find((d) => d.id === draftId);
      if (draft) {
        const newArt: Article = {
          id: `art-${Date.now()}`,
          title: editedData?.title || draft.title,
          slug: (draft.suggestedSlug || draft.title).toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          excerpt: draft.summary,
          content: editedData?.content || draft.draftContent,
          contentType: "news",
          category: {
            id: "ai",
            name: "Artificial Intelligence",
            slug: "ai",
            description: "Berita dan riset model AI terbaru"
          },
          tags: editedData?.tags || draft.tags,
          publishedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          author: {
            name: "Redaksi Nexarin (via Gemini Spark)",
            role: "Editorial Tech AI",
            avatar: "/assets/avatar-default.svg"
          },
          readingTimeMinutes: 5,
          views: 1,
          featuredImage: "/assets/article-ai.svg",
          status: "published",
          metaTitle: editedData?.title || draft.title,
          metaDescription: draft.summary
        };
        setArticles((prev) => [newArt, ...prev]);
        setDrafts((prev) => prev.filter((d) => d.id !== draftId));
      }
    }

    showToast({
      type: "success",
      title: "Artikel Berhasil Dipublikasikan",
      message: "Draft telah diterbitkan dan langsung tampil pada portal publik."
    });
  };

  const deleteDraft = async (draftId: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== draftId));
    showToast({
      type: "info",
      title: "Draft Dihapus",
      message: "Draft telah dikeluarkan dari antrean review."
    });
  };

  const updateDraft = (draftId: string, updatedDraft: Partial<GeminiSparkDraft>) => {
    setDrafts((prev) =>
      prev.map((d) => (d.id === draftId ? { ...d, ...updatedDraft } : d))
    );
  };

  const createArticle = async (articleData: Omit<Article, "id" | "views" | "createdAt" | "updatedAt">) => {
    const newArticle: Article = {
      ...articleData,
      id: "art-" + Date.now(),
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setArticles((prev) => [newArticle, ...prev]);
    showToast({
      type: "success",
      title: "Artikel Dibuat",
      message: "Artikel baru berhasil ditambahkan."
    });
  };

  const updateArticle = async (id: string, updatedData: Partial<Article>) => {
    setArticles((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, ...updatedData, updatedAt: new Date().toISOString() } : a
      )
    );
  };

  const deleteArticle = async (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    showToast({
      type: "warning",
      title: "Artikel Dihapus",
      message: "Artikel telah dihapus dari portal."
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
      message: "Berhasil memeriksa dan mengimpor draft terbaru dari pipeline Gemini Spark."
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
