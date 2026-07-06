import { pdfTools } from "@/features/pdf-tools/pdf-tools.data";
import OrganizeWorkspace from "@/features/pdf-tools/components/OrganizeWorkspace";
import Header from "@/components/shared/Header";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  const tool = pdfTools.find(t => t.id === "organize");
  if (!tool) {
    return { title: "Not Found" };
  }
  return {
    title: `${tool.title} - Nexarin`,
    description: tool.description,
  };
}

export default function PdfToolRoute() {
  const tool = pdfTools.find(t => t.id === "organize");
  
  if (!tool) {
    notFound();
  }

  return (
    <>
      <Header />
      <OrganizeWorkspace />
    </>
  );
}
