export type MarketplaceType = "Shopee" | "Tokopedia" | "TikTok Shop" | "Lazada" | "Amazon" | "Direct";

export interface AffiliateLink {
  id: string;
  name: string;
  productName: string;
  marketplace: MarketplaceType;
  affiliateUrl: string;
  category: string;
  priceEstimate?: string;
  badgeLabel?: string;
  imageUrl?: string;
  clicksCount: number;
  conversionRate?: number;
  isActive: boolean;
  linkedArticleIds: string[];
  createdAt: string;
}
