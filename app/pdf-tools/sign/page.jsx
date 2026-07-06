import { pdfTools } from "@/features/pdf-tools/pdf-tools.data";
import SignWorkspace from "@/features/pdf-tools/components/SignWorkspace";
import Header from "@/components/shared/Header";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  const tool = pdfTools.find(t => t.id === "sign");
  if (!tool) {
    return { title: "Not Found" };
  }
  return {
    title: `${tool.title} - Nexarin`,
    description: tool.description,
  };
}

export default function PdfToolRoute() {
  const tool = pdfTools.find(t => t.id === "sign");
  
  if (!tool) {
    notFound();
  }

  return (
    <>
      <Header />
      <SignWorkspace />
    </>
  );
}
