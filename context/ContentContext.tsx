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
  publishDraft: (draftId: string, editedData?: Partial<Article>) => void;
  deleteDraft: (draftId: string) => void;
  updateDraft: (draftId: string, updatedDraft: Partial<GeminiSparkDraft>) => void;
  createArticle: (article: Omit<Article, "id" | "views" | "createdAt" | "updatedAt">) => void;
  updateArticle: (id: string, article: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  syncGeminiSpark: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [drafts, setDrafts] = useState<GeminiSparkDraft[]>(INITIAL_DRAFTS);
  const { showToast } = useNotification();

  useEffect(() => {
    const savedArticles = localStorage.getItem("nexarin_articles");
    if (savedArticles) {
      try {
        setArticles(JSON.parse(savedArticles));
      } catch (e) {
        console.error("Failed to parse articles", e);
      }
    }

    const savedDrafts = localStorage.getItem("nexarin_drafts");
    if (savedDrafts) {
      try {
        setDrafts(JSON.parse(savedDrafts));
      } catch (e) {
        console.error("Failed to parse drafts", e);
      }
    }
  }, []);

  const saveArticles = (items: Article[]) => {
    setArticles(items);
    localStorage.setItem("nexarin_articles", JSON.stringify(items));
  };

  const saveDrafts = (items: GeminiSparkDraft[]) => {
    setDrafts(items);
    localStorage.setItem("nexarin_drafts", JSON.stringify(items));
  };

  const getArticleBySlug = (slug: string) => {
    return articles.find((a) => a.slug === slug && a.status === "published");
  };

  const getArticlesByCategory = (categorySlug: string) => {
    return articles.filter(
      (a) => a.status === "published" && (a.category.slug === categorySlug || categorySlug === "all")
    );
  };

  const searchArticles = (query: string, category?: string) => {
    const q = query.toLowerCase().trim();
    return articles.filter((a) => {
      if (a.status !== "published") return false;
      if (category && category !== "all" && a.category.slug !== category) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  };

  const publishDraft = (draftId: string, editedData?: Partial<Article>) => {
    const draft = drafts.find((d) => d.id === draftId);
    if (!draft) return;

    // Check duplicate source ID
    const exists = articles.some((a) => a.sourceId === draft.sourceId);
    if (exists) {
      showToast({
        type: "warning",
        title: "Artikel Duplikat Ditolak",
        message: `Artikel dengan source ID ${draft.sourceId} sudah dipublikasikan sebelumnya.`
      });
      return;
    }

    const newArticle: Article = {
      id: "art-" + Date.now(),
      sourceId: draft.sourceId,
      title: editedData?.title || draft.title,
      slug: editedData?.slug || draft.suggestedSlug,
      excerpt: editedData?.excerpt || draft.summary,
      content: editedData?.content || `${draft.draftContent}\n\n### Analisis Editorial\n${draft.opinionAnalysis}`,
      contentType: editedData?.contentType || "analysis",
      category: editedData?.category || {
        id: draft.category.toLowerCase(),
        name: draft.category,
        slug: draft.category.toLowerCase(),
        description: `Kumpulan artikel ${draft.category}`
      },
      tags: editedData?.tags || draft.tags,
      featuredImage:
        editedData?.featuredImage ||
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
      metaTitle: editedData?.metaTitle || draft.suggestedSeoTitle,
      metaDescription: editedData?.metaDescription || draft.suggestedMetaDescription,
      status: "published",
      author: editedData?.author || {
        name: "Rins",
        role: "Editorial Lead",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
      },
      readingTimeMinutes: 4,
      views: 0,
      publishedAt: new Date().toISOString(),
      createdAt: draft.scrapedAt,
      updatedAt: new Date().toISOString(),
      relatedProductId: editedData?.relatedProductId || (draft.recommendedNexarinProductSlug ? "prod-starter-kit" : undefined),
      source: {
        name: draft.sourceName,
        url: draft.sourceUrl
      }
    };

    saveArticles([newArticle, ...articles]);
    saveDrafts(drafts.filter((d) => d.id !== draftId));

    showToast({
      type: "success",
      title: "Artikel Berhasil Dipublikasikan",
      message: `"${newArticle.title.substring(0, 50)}..." kini live di portal publik.`
    });
  };

  const deleteDraft = (draftId: string) => {
    const draft = drafts.find((d) => d.id === draftId);
    saveDrafts(drafts.filter((d) => d.id !== draftId));

    showToast({
      type: "info",
      title: "Draft Dihapus dari Staging",
      message: draft ? `Draft "${draft.title.substring(0, 40)}..." telah dibersihkan.` : "Draft dihapus."
    });
  };

  const updateDraft = (draftId: string, updatedDraft: Partial<GeminiSparkDraft>) => {
    const updated = drafts.map((d) => (d.id === draftId ? { ...d, ...updatedDraft } : d));
    saveDrafts(updated);
    showToast({
      type: "success",
      title: "Perubahan Draft Disimpan"
    });
  };

  const createArticle = (art: Omit<Article, "id" | "views" | "createdAt" | "updatedAt">) => {
    const newArt: Article = {
      ...art,
      id: "art-" + Date.now(),
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    saveArticles([newArt, ...articles]);
    showToast({
      type: "success",
      title: "Artikel Baru Dibuat",
      message: `Artikel "${newArt.title}" berhasil dipublikasikan.`
    });
  };

  const updateArticle = (id: string, updated: Partial<Article>) => {
    const next = articles.map((a) => (a.id === id ? { ...a, ...updated, updatedAt: new Date().toISOString() } : a));
    saveArticles(next);
    showToast({
      type: "success",
      title: "Artikel Diperbarui"
    });
  };

  const deleteArticle = (id: string) => {
    saveArticles(articles.filter((a) => a.id !== id));
    showToast({
      type: "info",
      title: "Artikel Dihapus dari Portal"
    });
  };

  const syncGeminiSpark = () => {
    showToast({
      type: "info",
      title: "Sinkronisasi Gemini Spark Berjalan",
      message: "Mengambil data draft terbaru dari Google Sheets staging..."
    });

    setTimeout(() => {
      showToast({
        type: "success",
        title: "Sinkronisasi Berhasil",
        message: "Staging Google Sheets sinkron. Semua draft siap direview."
      });
    }, 1200);
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
