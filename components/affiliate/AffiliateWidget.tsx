"use client";

import React from "react";
import { AffiliateLink } from "@/types/affiliate";
import { useShop } from "@/context/ShopContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ExternalLink } from "lucide-react";

interface AffiliateWidgetProps {
  affiliate: AffiliateLink;
}

export function AffiliateWidget({ affiliate }: AffiliateWidgetProps) {
  const { trackAffiliateClick } = useShop();

  const handleOutbound = () => {
    trackAffiliateClick(affiliate.id);
  };

  const marketplaceColors: Record<string, string> = {
    Shopee: "bg-[#EE4D2D]/15 text-[#EE4D2D] border-[#EE4D2D]/30",
    Tokopedia: "bg-[#03AC0E]/15 text-[#03AC0E] border-[#03AC0E]/30",
    "TikTok Shop": "bg-slate-900 text-white",
  };

  return (
    <div className="my-8 p-5 sm:p-6 rounded-3xl border border-cyan-500/20 bg-[#131E32] shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={affiliate.imageUrl || "/assets/affiliate-keyboard.svg"}
            alt={affiliate.name}
            onError={(e) => {
              e.currentTarget.src = "/assets/default-cover.svg";
            }}
            className="w-16 h-16 rounded-2xl object-cover border border-slate-800 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${marketplaceColors[affiliate.marketplace] || "bg-slate-800 text-cyan-400"}`}>
                {affiliate.marketplace}
              </span>
              {affiliate.badgeLabel && (
                <Badge variant="cyan" size="sm">
                  {affiliate.badgeLabel}
                </Badge>
              )}
            </div>
            <h4 className="text-sm font-bold text-white">
              {affiliate.productName}
            </h4>
            {affiliate.priceEstimate && (
              <span className="text-xs font-mono font-semibold text-slate-400">
                Estimasi Harga: {affiliate.priceEstimate}
              </span>
            )}
          </div>
        </div>

        <a
          href={affiliate.affiliateUrl}
          target="_blank"
          rel="nofollow noopener noreferrer"
          onClick={handleOutbound}
          className="w-full sm:w-auto"
        >
          <Button variant="primary" size="sm" className="w-full font-bold">
            <span>Beli di {affiliate.marketplace}</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </a>
      </div>
      <p className="text-[10px] text-slate-400 mt-3 text-center sm:text-left">
        * Rekomendasi terkurasi oleh editorial Nexarin. Transaksi dilakukan di marketplace resmi terkait.
      </p>
    </div>
  );
}
