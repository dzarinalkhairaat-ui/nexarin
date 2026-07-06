import { pdfTools } from "@/features/pdf-tools/pdf-tools.data";
import PdfToExcelWorkspace from "@/features/pdf-tools/components/PdfToExcelWorkspace";
import Header from "@/components/shared/Header";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  const tool = pdfTools.find(t => t.id === "pdf-to-excel");
  if (!tool) {
    return { title: "Not Found" };
  }
  return {
    title: `${tool.title} - Nexarin`,
    description: tool.description,
  };
}

export default function PdfToolRoute() {
  const tool = pdfTools.find(t => t.id === "pdf-to-excel");
  
  if (!tool) {
    notFound();
  }

  return (
    <>
      <Header />
      <PdfToExcelWorkspace />
    </>
  );
}
