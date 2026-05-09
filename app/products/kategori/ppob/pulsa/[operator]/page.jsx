import PpobPulsaOperatorPage from "@/features/products/PpobPulsaOperatorPage";

export default function Page({ params }) {
  return <PpobPulsaOperatorPage operatorSlug={params?.operator} />;
}
