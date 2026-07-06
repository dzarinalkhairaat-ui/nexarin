import { pdfTools } from "@/features/pdf-tools/pdf-tools.data";
import ProtectWorkspace from "@/features/pdf-tools/components/ProtectWorkspace";
import Header from "@/components/shared/Header";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  const tool = pdfTools.find(t => t.id === "protect");
  if (!tool) {
    return { title: "Not Found" };
  }
  return {
    title: `${tool.title} - Nexarin`,
    description: tool.description,
  };
}

export default function PdfToolRoute() {
  const tool = pdfTools.find(t => t.id === "protect");
  
  if (!tool) {
    notFound();
  }

  return (
    <>
      <Header />
      <ProtectWorkspace />
    </>
  );
}
