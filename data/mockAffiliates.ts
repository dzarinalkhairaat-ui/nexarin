import { AffiliateLink } from "@/types/affiliate";

export const INITIAL_AFFILIATES: AffiliateLink[] = [
  {
    id: "aff-1",
    name: "Keychron K2 V2 Wireless Mechanical Keyboard",
    productName: "Keychron K2 V2 Wireless Keyboard",
    marketplace: "Shopee",
    affiliateUrl: "https://shopee.co.id/keychron-k2-v2-official-aff?ref=nexarin",
    category: "Gadget / Peripherals",
    priceEstimate: "Rp 1.350.000",
    badgeLabel: "Pilihan Editor",
    imageUrl: "/assets/affiliate-keyboard.svg",
    clicksCount: 384,
    conversionRate: 6.8,
    isActive: true,
    linkedArticleIds: ["art-1", "art-4"],
    createdAt: "2026-08-01T00:00:00Z"
  },
  {
    id: "aff-2",
    name: "Logitech MX Master 3S Ergonomic Mouse",
    productName: "Logitech MX Master 3S",
    marketplace: "Tokopedia",
    affiliateUrl: "https://tokopedia.com/logitech-mx-master-3s-aff?ref=nexarin",
    category: "Gadget / Productivity",
    priceEstimate: "Rp 1.499.000",
    badgeLabel: "Rekomendasi Terbaik",
    imageUrl: "/assets/affiliate-keyboard.svg",
    clicksCount: 512,
    conversionRate: 8.2,
    isActive: true,
    linkedArticleIds: ["art-2", "art-5"],
    createdAt: "2026-08-05T00:00:00Z"
  },
  {
    id: "aff-3",
    name: "Anker Prime 200W GaN Fast Charger & Power Bank",
    productName: "Anker Prime 200W Power Station",
    marketplace: "TikTok Shop",
    affiliateUrl: "https://tiktok.com/@anker_store/prime-200w-aff?ref=nexarin",
    category: "Gadget / Charging",
    priceEstimate: "Rp 1.890.000",
    badgeLabel: "Top Trending",
    imageUrl: "/assets/affiliate-keyboard.svg",
    clicksCount: 228,
    conversionRate: 5.4,
    isActive: true,
    linkedArticleIds: ["art-3"],
    createdAt: "2026-08-10T00:00:00Z"
  }
];
