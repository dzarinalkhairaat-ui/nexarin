export type ContentType = "news" | "analysis" | "opinion" | "tutorial" | "review" | "explainer" | "evergreen";
export type ContentStatus = "draft" | "published" | "archived";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  color?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Article {
  id: string;
  sourceId?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  contentType: ContentType;
  category: Category;
  tags: string[];
  featuredImage: string;
  metaTitle: string;
  metaDescription: string;
  status: ContentStatus;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  readingTimeMinutes: number;
  views: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
  breaking?: boolean;
  relatedProductId?: string;
  affiliateId?: string;
  source?: {
    name: string;
    url: string;
  };
}

export interface GeminiSparkDraft {
  id: string;
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  scrapedAt: string;
  title: string;
  suggestedSlug: string;
  summary: string;
  draftContent: string;
  opinionAnalysis: string;
  category: string;
  tags: string[];
  suggestedSeoTitle: string;
  suggestedMetaDescription: string;
  recommendedAffiliateProduct?: {
    name: string;
    reason: string;
    targetMarketplace: "Shopee" | "Tokopedia" | "TikTok Shop" | "Other";
  };
  recommendedNexarinProductSlug?: string;
  status: "draft" | "published" | "discarded";
  syncDate: string;
}
