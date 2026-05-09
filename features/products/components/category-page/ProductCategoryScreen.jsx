"use client";

import { useState } from "react";
import ProductCategoryContent from "@/features/products/components/category-page/ProductCategoryContent";
import ProductCategoryFooter from "@/features/products/components/category-page/ProductCategoryFooter";
import ProductCategoryHeader from "@/features/products/components/category-page/ProductCategoryHeader";
import ProductSubcategoryScroller from "@/features/products/components/category-page/ProductSubcategoryScroller";
import PpobCategoryScreen from "@/features/products/components/ppob-page/PpobCategoryScreen";
import {
  getCategoryProducts,
  getProductCategory,
  getProductSubcategories,
} from "@/features/products/components/category-page/productCategory.helpers";

export default function ProductCategoryScreen({ slug }) {
  const [sortBy, setSortBy] = useState("terbaru");
  const [activeSubcategory, setActiveSubcategory] = useState("semua");

  const category = getProductCategory(slug);

  if (category.slug === "ppob") {
    return <PpobCategoryScreen />;
  }

  const products = getCategoryProducts(category.slug);
  const subcategories = getProductSubcategories(products);

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <ProductCategoryHeader
        title={category.label}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <ProductSubcategoryScroller
        subcategories={subcategories}
        activeSubcategory={activeSubcategory}
        onSubcategoryChange={setActiveSubcategory}
      />

      <ProductCategoryContent
        products={products}
        activeSubcategory={activeSubcategory}
        sortBy={sortBy}
      />

      <ProductCategoryFooter />
    </main>
  );
}