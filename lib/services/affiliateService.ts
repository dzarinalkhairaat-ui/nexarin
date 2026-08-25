import { db } from "@/lib/db/store";
import { AffiliateLink } from "@/types/affiliate";

export const affiliateService = {
  async getAll(): Promise<AffiliateLink[]> {
    return [...db.affiliates];
  },

  async recordClick(id: string): Promise<{ success: boolean; clicks: number }> {
    const item = db.affiliates.find((a) => a.id === id);
    if (!item) return { success: false, clicks: 0 };
    item.clicksCount = (item.clicksCount || 0) + 1;
    return { success: true, clicks: item.clicksCount };
  },

  async create(data: Omit<AffiliateLink, "id" | "clicksCount" | "createdAt">): Promise<AffiliateLink> {
    const newItem: AffiliateLink = {
      ...data,
      id: `aff-${Date.now()}`,
      clicksCount: 0,
      createdAt: new Date().toISOString()
    };
    db.affiliates.push(newItem);
    return newItem;
  }
};
