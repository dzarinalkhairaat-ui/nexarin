"use client";

import Link from "next/link";
import { useState } from "react";

function OperatorFallback({ label }) {
  const initials = String(label || "OP")
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_35%_28%,rgba(52,211,153,0.24),transparent_36%),linear-gradient(135deg,rgba(15,23,42,1),rgba(30,41,59,1))] text-3xl font-black text-emerald-300">
      {initials}
    </div>
  );
}

export default function PpobPulsaOperatorCard({ operator }) {
  const safeOperator = operator || {};
  const [isError, setIsError] = useState(false);
  const hasImage = Boolean(safeOperator.image && !isError);

  return (
    <Link
      href={safeOperator.href || "/products/kategori/ppob/pulsa"}
      className="group overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.045] shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-emerald-400/25 hover:bg-white/[0.06]"
    >
      <div className="relative aspect-square overflow-hidden rounded-[18px] bg-slate-900">
        {hasImage ? (
          <img
            src={safeOperator.image}
            alt={safeOperator.label || "Operator"}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
            onError={() => setIsError(true)}
          />
        ) : (
          <OperatorFallback label={safeOperator.label} />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent" />
      </div>

      <div className="px-2 py-3 text-center">
        <p className="line-clamp-1 text-xs font-black tracking-[-0.02em] text-slate-200">
          {safeOperator.label || "Operator"}
        </p>
      </div>
    </Link>
  );
}