import ScrollReveal from "@/components/shared/ScrollReveal";
import ProductsHeader from "@/features/products/components/ProductsHeader";
import ProductGrid from "@/features/products/components/ProductGrid";
import ProductsFooter from "@/features/products/components/ProductsFooter";

export default function ProductsPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <ProductsHeader />

      <ScrollReveal>
        <ProductGrid />
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <ProductsFooter />
      </ScrollReveal>
    </main>
  );
}