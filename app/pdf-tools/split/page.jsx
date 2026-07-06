import { pdfTools } from "@/features/pdf-tools/pdf-tools.data";
import SplitWorkspace from "@/features/pdf-tools/components/SplitWorkspace";
import Header from "@/components/shared/Header";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  const tool = pdfTools.find(t => t.id === "split");
  if (!tool) {
    return { title: "Not Found" };
  }
  return {
    title: `${tool.title} - Nexarin`,
    description: tool.description,
  };
}

export default function PdfToolRoute() {
  const tool = pdfTools.find(t => t.id === "split");
  
  if (!tool) {
    notFound();
  }

  return (
    <>
      <Header />
      <SplitWorkspace />
    </>
  );
}
