"use client";

import { useState } from "react";
import AllProductsContent from "@/features/products/components/all-products-page/AllProductsContent";
import AllProductsFooter from "@/features/products/components/all-products-page/AllProductsFooter";
import AllProductsHeader from "@/features/products/components/all-products-page/AllProductsHeader";

export default function AllProductsScreen() {
  const [sortBy, setSortBy] = useState("terbaru");

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <AllProductsHeader sortBy={sortBy} onSortChange={setSortBy} />

      <AllProductsContent sortBy={sortBy} query="" />

      <AllProductsFooter />
    </main>
  );
}