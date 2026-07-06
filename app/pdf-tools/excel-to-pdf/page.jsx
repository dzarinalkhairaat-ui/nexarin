import { pdfTools } from "@/features/pdf-tools/pdf-tools.data";
import ExcelToPdfWorkspace from "@/features/pdf-tools/components/ExcelToPdfWorkspace";
import Header from "@/components/shared/Header";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  const tool = pdfTools.find(t => t.id === "excel-to-pdf");
  if (!tool) {
    return { title: "Not Found" };
  }
  return {
    title: `${tool.title} - Nexarin`,
    description: tool.description,
  };
}

export default function PdfToolRoute() {
  const tool = pdfTools.find(t => t.id === "excel-to-pdf");
  
  if (!tool) {
    notFound();
  }

  return (
    <>
      <Header />
      <ExcelToPdfWorkspace />
    </>
  );
}
