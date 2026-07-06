import { pdfTools } from "@/features/pdf-tools/pdf-tools.data";
import CompareWorkspace from "@/features/pdf-tools/components/CompareWorkspace";
import Header from "@/components/shared/Header";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  const tool = pdfTools.find(t => t.id === "compare");
  if (!tool) {
    return { title: "Not Found" };
  }
  return {
    title: `${tool.title} - Nexarin`,
    description: tool.description,
  };
}

export default function PdfToolRoute() {
  const tool = pdfTools.find(t => t.id === "compare");
  
  if (!tool) {
    notFound();
  }

  return (
    <>
      <Header />
      <CompareWorkspace />
    </>
  );
}
