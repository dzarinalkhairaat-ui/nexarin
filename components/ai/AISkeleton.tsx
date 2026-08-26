"use client";

import React from "react";

export function AISkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
      {/* Top Story Skeleton */}
      <div className="rounded-2xl bg-[#131E32]/40 border border-[#1E293B] h-96 w-full" />

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-28 bg-[#131E32]/40 rounded-xl border border-[#1E293B]" />
          <div className="h-28 bg-[#131E32]/40 rounded-xl border border-[#1E293B]" />
          <div className="h-28 bg-[#131E32]/40 rounded-xl border border-[#1E293B]" />
        </div>
        <div className="h-80 bg-[#131E32]/40 rounded-xl border border-[#1E293B]" />
      </div>
    </div>
  );
}
