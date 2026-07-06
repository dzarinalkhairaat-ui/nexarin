import { pdfTools } from "@/features/pdf-tools/pdf-tools.data";
import CompressWorkspace from "@/features/pdf-tools/components/CompressWorkspace";
import Header from "@/components/shared/Header";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  const tool = pdfTools.find(t => t.id === "compress");
  if (!tool) {
    return { title: "Not Found" };
  }
  return {
    title: `${tool.title} - Nexarin`,
    description: tool.description,
  };
}

export default function PdfToolRoute() {
  const tool = pdfTools.find(t => t.id === "compress");
  
  if (!tool) {
    notFound();
  }

  return (
    <>
      <Header />
      <CompressWorkspace />
    </>
  );
}
