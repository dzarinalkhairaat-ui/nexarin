import { pdfTools } from "@/features/pdf-tools/pdf-tools.data";
import RepairWorkspace from "@/features/pdf-tools/components/RepairWorkspace";
import Header from "@/components/shared/Header";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  const tool = pdfTools.find(t => t.id === "repair");
  if (!tool) {
    return { title: "Not Found" };
  }
  return {
    title: `${tool.title} - Nexarin`,
    description: tool.description,
  };
}

export default function PdfToolRoute() {
  const tool = pdfTools.find(t => t.id === "repair");
  
  if (!tool) {
    notFound();
  }

  return (
    <>
      <Header />
      <RepairWorkspace />
    </>
  );
}
