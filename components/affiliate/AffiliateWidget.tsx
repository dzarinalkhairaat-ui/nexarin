"use client";

import React from "react";
import { AffiliateLink } from "@/types/affiliate";
import { useShop } from "@/context/ShopContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ExternalLink, Tag } from "lucide-react";

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
    "TikTok Shop": "bg-slate-900 text-white border-white/20",
  };

  return (
    <div
      className="my-8 p-6 sm:p-8 rounded-3xl border border-transparent backdrop-blur-xl text-white transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-0.5"
      style={{
        background:
          "linear-gradient(180deg, rgba(15, 23, 42, 0.75), rgba(11, 17, 32, 0.55)) padding-box, linear-gradient(120deg, rgba(255, 255, 255, 0.18), rgba(45, 212, 245, 0.16), rgba(255, 255, 255, 0.05)) border-box",
        border: "1px solid transparent",
        backdropFilter: "blur(20px) saturate(130%)",
        WebkitBackdropFilter: "blur(20px) saturate(130%)",
        boxShadow: "0 12px 35px -5px rgba(0, 0, 0, 0.40), inset 0 1px 0 rgba(255, 255, 255, 0.06)"
      }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <img
            src={affiliate.imageUrl || "/assets/affiliate-keyboard.svg"}
            alt={affiliate.name}
            onError={(e) => {
              e.currentTarget.src = "/assets/default-cover.svg";
            }}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-white/[0.12] shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${marketplaceColors[affiliate.marketplace] || "bg-slate-800 text-cyan-400"}`}>
                {affiliate.marketplace}
              </span>
              {affiliate.badgeLabel && (
                <Badge variant="cyan" size="sm">
                  {affiliate.badgeLabel}
                </Badge>
              )}
            </div>
            <h4 className="text-base font-bold text-white">
              {affiliate.productName}
            </h4>
            {affiliate.priceEstimate && (
              <span className="text-xs font-mono font-semibold text-[#94A3B8] block">
                Estimasi: {affiliate.priceEstimate}
              </span>
            )}
          </div>
        </div>

        <a
          href={affiliate.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          onClick={handleOutbound}
          className="w-full sm:w-auto shrink-0"
        >
          <Button variant="mint" size="md" className="w-full sm:w-auto font-extrabold text-xs text-slate-950 shadow-md shadow-emerald-500/20">
            <span>Beli di {affiliate.marketplace}</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </a>
      </div>
    </div>
  );
}
