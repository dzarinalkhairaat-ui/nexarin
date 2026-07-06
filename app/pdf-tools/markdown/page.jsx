import { pdfTools } from "@/features/pdf-tools/pdf-tools.data";
import MarkdownWorkspace from "@/features/pdf-tools/components/MarkdownWorkspace";
import Header from "@/components/shared/Header";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  const tool = pdfTools.find(t => t.id === "markdown");
  if (!tool) {
    return { title: "Not Found" };
  }
  return {
    title: `${tool.title} - Nexarin`,
    description: tool.description,
  };
}

export default function PdfToolRoute() {
  const tool = pdfTools.find(t => t.id === "markdown");
  
  if (!tool) {
    notFound();
  }

  return (
    <>
      <Header />
      <MarkdownWorkspace />
    </>
  );
}
