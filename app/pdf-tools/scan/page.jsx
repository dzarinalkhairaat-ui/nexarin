import { pdfTools } from "@/features/pdf-tools/pdf-tools.data";
import ScanWorkspace from "@/features/pdf-tools/components/ScanWorkspace";
import Header from "@/components/shared/Header";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  const tool = pdfTools.find(t => t.id === "scan");
  if (!tool) {
    return { title: "Not Found" };
  }
  return {
    title: `${tool.title} - Nexarin`,
    description: tool.description,
  };
}

export default function PdfToolRoute() {
  const tool = pdfTools.find(t => t.id === "scan");
  
  if (!tool) {
    notFound();
  }

  return (
    <>
      <Header />
      <ScanWorkspace />
    </>
  );
}
