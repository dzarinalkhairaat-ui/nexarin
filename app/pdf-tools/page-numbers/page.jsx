import { pdfTools } from "@/features/pdf-tools/pdf-tools.data";
import PageNumbersWorkspace from "@/features/pdf-tools/components/PageNumbersWorkspace";
import Header from "@/components/shared/Header";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  const tool = pdfTools.find(t => t.id === "page-numbers");
  if (!tool) {
    return { title: "Not Found" };
  }
  return {
    title: `${tool.title} - Nexarin`,
    description: tool.description,
  };
}

export default function PdfToolRoute() {
  const tool = pdfTools.find(t => t.id === "page-numbers");
  
  if (!tool) {
    notFound();
  }

  return (
    <>
      <Header />
      <PageNumbersWorkspace />
    </>
  );
}
