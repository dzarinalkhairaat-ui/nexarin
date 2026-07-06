import { pdfTools } from "@/features/pdf-tools/pdf-tools.data";
import ToolWorkspace from "@/features/pdf-tools/components/ToolWorkspace";
import Header from "@/components/shared/Header";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  const toolsParams = pdfTools.map((tool) => ({
    slug: tool.id,
  }));
  
  // add workflow
  toolsParams.push({ slug: "workflow" });
  
  return toolsParams;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tool = pdfTools.find(t => t.id === slug);
  if (!tool) {
    if (slug === "workflow") {
       return { title: "Create a workflow - Nexarin" };
    }
    return { title: "Not Found" };
  }
  return {
    title: `${tool.title} - Nexarin`,
    description: tool.description,
  };
}

export default async function ToolDynamicRoute({ params }) {
  const { slug } = await params;
  const tool = pdfTools.find(t => t.id === slug);
  
  if (slug === "workflow") {
    // Basic placeholder for workflow
    return (
      <main className="min-h-screen bg-slate-950 pt-32 text-center text-white selection:bg-pink-500/30">
        <Header />
        <div className="mt-20">
          <div className="inline-block p-4 rounded-3xl bg-pink-500/10 text-pink-400 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-network"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6">Workflow Builder</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Build custom automation workflows for your PDFs directly in the browser. Coming soon.
          </p>
        </div>
      </main>
    );
  }

  if (!tool) {
    notFound();
  }

  return (
    <>
      <Header />
      <ToolWorkspace slug={slug} />
    </>
  );
}
